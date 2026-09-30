"""
TerminalEnv — Gymnasium wrapper for the AGV Terminal Simulation.
================================================================
Wraps the Terminal discrete-event simulation (terminal.py) into a standard
Gymnasium.Env interface so any RL algorithm can interact with it via the
standard reset() / step() API.

WHAT THIS FILE DOES (plain English):
    - reset():        Starts a fresh episode. Returns initial observation.
    - step(action):   Agent picks an AGV to dispatch. Sim advances 1 second.
                      Returns (new_observation, reward, done, truncated, info).
    - action_masks(): Tells MaskablePPO which AGVs are currently idle (valid).

OBSERVATION (what the agent "sees" — 114 floats, all in [0, 1]):
    For each AGV  (10 AGVs × 9 features = 90 floats):
        - x position / terminal width
        - y position / terminal height
        - 5-bit one-hot: which of the 5 AGV states it is in
        - remaining travel time / max possible travel time
        - assigned QC index / total QCs  (0 if not assigned to anything)
    For each QC   (4 QCs × 4 features = 16 floats):
        - is the QC currently idle, waiting for an AGV? (0 or 1)
        - how many containers are queued / max queue size
        - how many AGVs are on their way / total AGVs
        - time until crane finishes current lift / mean handling time
    Lane congestion (6 floats — 2 roads + 4 perpendicular lanes):
        - number of AGVs on this lane / total AGVs
    Global (2 floats):
        - unassigned tasks / max total tasks for this episode
        - current step / max steps (episode progress)
    TOTAL: 90 + 16 + 6 + 2 = 114

ACTION (what the agent "decides"):
    An integer in {0, 1, ..., n_agvs-1} — which AGV to dispatch.
    The chosen AGV is sent to the highest-priority pending task.
    If the AGV is not idle or there is no task, it is a no-op (sim still steps).

REWARD (how the agent learns — computed every second of simulation time):
    R = -alpha  x  QC idle seconds this step       (bad: crane waiting for AGV)
        - beta  x  conflict count this step         (bad: lane crowding)
        + gamma x  tasks completed this step        (good: delivered containers)
        - delta x  empty travel distance this step  (bad: sending far AGVs)
    Weights: alpha=1.0, beta=0.5, gamma=2.0, delta=0.1  (from config.yaml)

EPISODE ENDS when:
    - All tasks done AND all AGVs idle (terminated = True), OR
    - max_steps reached (truncated = True, with a penalty for unfinished tasks)

LITERATURE BASIS:
    State design:     Zheng et al. (2022), Yang et al. (2025)
    Reward structure: Zheng et al. (2022)
    Congestion model: Song et al. (2024)
    Lane system:      Liu et al. (2001)
    Action masking:   Standard RL scheduling practice (SB3-Contrib MaskablePPO)
"""

import os
import sys
import numpy as np
import gymnasium as gym
from gymnasium import spaces
from typing import Optional, Dict, Any, List, Tuple

# Allow imports from the simulation package regardless of where script is run from
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from core.terminal import Terminal
from core.agv import AGVStatus


class TerminalEnv(gym.Env):
    """
    Gymnasium environment wrapping the AGV Terminal simulation.

    Designed for use with MaskablePPO from sb3-contrib (recommended)
    or standard PPO/DQN from stable-baselines3 (no masking variant).

    Example usage:
        from simulation.envs.terminal_env import TerminalEnv
        from sb3_contrib import MaskablePPO

        env = TerminalEnv()
        model = MaskablePPO("MlpPolicy", env, verbose=1)
        model.learn(total_timesteps=500_000)
    """

    metadata = {"render_modes": ["human", "ansi"]}

    def __init__(
        self,
        config_path: str = "simulation/configs/config.yaml",
        render_mode: Optional[str] = None,
    ):
        super().__init__()

        self.config_path = config_path
        self.render_mode = render_mode

        # ── Build a temporary terminal just to read config dimensions ──────────
        # (This terminal is replaced in reset() with a fresh one)
        _temp = Terminal(config_path=config_path)
        cfg = _temp.config

        # Core dimensions from config
        self.n_agvs       = cfg["terminal"]["n_agvs"]
        self.n_qcs        = cfg["terminal"]["n_qcs"]
        self.max_steps    = cfg["episode"]["max_steps"]
        self.dt           = cfg["episode"]["timestep_seconds"]
        self.max_total_tasks = cfg["episode"]["max_total_tasks"]

        # Reward weights
        rw = cfg["reward"]
        self.alpha           = rw["alpha"]           # QC idle time penalty weight
        self.beta            = rw["beta"]            # Conflict/congestion penalty weight
        self.gamma_r         = rw["gamma"]           # Task completion reward weight
        self.delta           = rw["delta"]           # Empty travel penalty weight
        self.terminal_penalty = rw["terminal_penalty"] # Per unfinished task at ep end

        # Number of lane segments (2 corridors + perpendicular lanes at each QC column)
        # With 4 QCs: n_lanes = 2 + 4 = 6
        self.n_lanes = 2 + self.n_qcs

        # Pre-compute max travel time for normalization
        # Worst case: diagonal of the terminal (Manhattan)
        speed = cfg["agv"]["speed"]
        self._max_travel_time = (cfg["terminal"]["grid_width"] + cfg["terminal"]["grid_height"]) / speed
        self._max_queue       = cfg["crane"]["max_container_queue"]
        self._handling_mean   = cfg["crane"]["handling_time_mean"]

        # ── Observation Space ──────────────────────────────────────────────────
        #   Per AGV : x, y, 5-hot status, travel_remaining, assigned_qc = 9 floats
        #   Per QC  : is_idle, queue_len, agvs_enroute, time_to_ready   = 4 floats
        #   Lanes   : occupancy per segment                              = n_lanes floats
        #   Global  : pending_tasks_norm, timestep_norm                  = 2 floats
        self._agv_features = 9
        self._qc_features  = 4
        self.obs_dim = (
            self.n_agvs * self._agv_features
            + self.n_qcs * self._qc_features
            + self.n_lanes
            + 2
        )
        self.observation_space = spaces.Box(
            low=0.0, high=1.0, shape=(self.obs_dim,), dtype=np.float32
        )

        # ── Action Space ───────────────────────────────────────────────────────
        # Choose which AGV (index 0..n_agvs-1) to dispatch to the pending task.
        # Invalid choices (non-idle AGVs) are masked out via action_masks().
        self.action_space = spaces.Discrete(self.n_agvs)

        # ── Runtime state (populated in reset) ────────────────────────────────
        self.terminal: Optional[Terminal] = None
        self.current_step: int = 0

    # ==========================================================================
    # Gymnasium API
    # ==========================================================================

    def reset(
        self,
        seed: Optional[int] = None,
        options: Optional[Dict[str, Any]] = None,
    ) -> Tuple[np.ndarray, Dict]:
        """
        Start a fresh episode.

        Creates a new Terminal, resets all entities to their starting positions,
        generates an initial batch of tasks, and returns the first observation.

        Args:
            seed:    Optional random seed for reproducibility.
            options: Not used currently. Reserved for curriculum overrides.

        Returns:
            observation (np.ndarray): Initial state vector of shape (obs_dim,)
            info        (dict):       Empty dict at reset (Gymnasium convention)
        """
        super().reset(seed=seed)

        # Fresh terminal for each episode — guarantees clean state
        self.terminal = Terminal(config_path=self.config_path, np_random=self.np_random)
        self.terminal.reset()

        self.current_step = 0

        observation = self._get_observation()
        info = {}
        return observation, info

    def step(self, action: int) -> Tuple[np.ndarray, float, bool, bool, Dict]:
        """
        Execute one simulation timestep (1 second by default).

        Flow:
            1. If action points to an IDLE AGV and a task is pending  → dispatch
            2. Record pre-step metrics for delta computation
            3. Advance simulation by 1 timestep (terminal.step())
            4. Compute reward from deltas
            5. Check termination / truncation
            6. Build and return next observation

        Args:
            action (int): Index of the AGV to dispatch (0..n_agvs-1)

        Returns:
            observation  (np.ndarray): Next state, shape (obs_dim,)
            reward       (float):      Scalar reward for this step
            terminated   (bool):       True if all tasks done and all AGVs idle
            truncated    (bool):       True if max_steps reached
            info         (dict):       Diagnostic metrics for logging
        """
        assert self.terminal is not None, "Call reset() before step()"

        # ── 1. Execute dispatch ────────────────────────────────────────────────
        task = self.terminal.get_highest_priority_task()
        idle_agvs = self.terminal.get_idle_agvs()
        dispatched = False
        if task is not None and action in idle_agvs:
            self.terminal.assign_agv_to_task(action, task)
            dispatched = True
        # If action is invalid (busy AGV) or no task: sim still steps — no crash

        # ── 2. Snapshot pre-step metrics ──────────────────────────────────────
        qc_idle_before      = self.terminal.get_total_qc_idle_time()
        completed_before    = self.terminal.completed_tasks
        # Track which AGVs are travelling empty and where they are
        empty_agv_pos_before = {
            agv.id: (agv.x, agv.y)
            for agv in self.terminal.agvs
            if agv.status == AGVStatus.TRAVELLING_EMPTY
        }

        # ── 3. Advance simulation by 1 second ─────────────────────────────────
        self.terminal.step()
        self.current_step += 1

        # ── 4. Compute per-step deltas ─────────────────────────────────────────
        qc_idle_delta    = self.terminal.get_total_qc_idle_time() - qc_idle_before
        completed_delta  = self.terminal.completed_tasks - completed_before
        conflicts        = self._count_conflicts()
        empty_travel     = self._compute_empty_travel(empty_agv_pos_before)

        # ── 5. Compute reward ──────────────────────────────────────────────────
        reward = self._compute_reward(qc_idle_delta, conflicts, completed_delta, empty_travel)

        # ── 6. Check termination conditions ───────────────────────────────────
        all_idle = all(agv.status == AGVStatus.IDLE for agv in self.terminal.agvs)
        no_tasks = (
            len(self.terminal.pending_tasks) == 0
            and len(self.terminal.unassigned_tasks) == 0
        )
        terminated = all_idle and no_tasks
        truncated  = self.current_step >= self.max_steps

        # Apply terminal penalty if episode ends with unfinished tasks
        if (terminated or truncated) and not (all_idle and no_tasks):
            remaining = len(self.terminal.pending_tasks) + len(self.terminal.unassigned_tasks)
            reward += self.terminal_penalty * remaining

        # ── 7. Build observation and info dict ─────────────────────────────────
        observation = self._get_observation()
        info = {
            "current_time"   : self.terminal.current_time,
            "completed_tasks": self.terminal.completed_tasks,
            "pending_tasks"  : len(self.terminal.pending_tasks),
            "unassigned_tasks": len(self.terminal.unassigned_tasks),
            "qc_idle_total"  : self.terminal.get_total_qc_idle_time(),
            "qc_idle_delta"  : qc_idle_delta,
            "conflicts"      : conflicts,
            "empty_travel"   : empty_travel,
            "dispatched"     : dispatched,
        }

        return observation, reward, terminated, truncated, info

    def action_masks(self) -> np.ndarray:
        """
        Returns a boolean mask for MaskablePPO (sb3-contrib).

            True  → AGV is IDLE and can be dispatched (valid action)
            False → AGV is busy, this action is masked out

        If no pending task exists, all actions are masked — we fall back to
        unmasking AGV 0 as a harmless "no-op" so MaskablePPO does not crash
        on an all-False mask.

        Returns:
            np.ndarray of shape (n_agvs,), dtype bool
        """
        assert self.terminal is not None, "Call reset() before action_masks()"

        # If no task is waiting, no dispatch is needed — return no-op mask
        if self.terminal.get_highest_priority_task() is None:
            mask = np.zeros(self.n_agvs, dtype=bool)
            mask[0] = True  # AGV 0 as dummy no-op (no task assigned, sim just steps)
            return mask

        idle_set = set(self.terminal.get_idle_agvs())
        mask = np.array([i in idle_set for i in range(self.n_agvs)], dtype=bool)

        # Safety: if no AGV is idle, fall back to no-op mask
        if not mask.any():
            mask[0] = True
        return mask

    # ==========================================================================
    # Observation Builder
    # ==========================================================================

    def _get_observation(self) -> np.ndarray:
        """
        Build the flat float32 observation vector.

        LAYOUT (all values in [0, 1]):
            [agv_0_x, agv_0_y, agv_0_status(5), agv_0_travel, agv_0_qc,  # 9 features
             agv_1_x, ...                                                   # 9 features each
             ...
             qc_0_idle, qc_0_queue, qc_0_agvs, qc_0_time,                 # 4 features
             qc_1_idle, ...                                                 # 4 features each
             ...
             lane_0_occ, lane_1_occ, ..., lane_{n_lanes-1}_occ,            # n_lanes features
             pending_norm, timestep_norm]                                    # 2 features
        """
        obs = []

        # ── Per-AGV features (9 each) ──────────────────────────────────────────
        for agv in self.terminal.agvs:
            # Position (normalized by terminal dimensions)
            obs.append(agv.x / self.terminal.width)
            obs.append(agv.y / self.terminal.height)

            # One-hot encode status (5 possible states: IDLE=0 ... AT_YARD_DROPPING=4)
            status_onehot = [0.0] * 5
            status_onehot[int(agv.status)] = 1.0
            obs.extend(status_onehot)

            # Remaining travel time (normalized by worst-case travel time)
            obs.append(
                min(agv.travel_remaining_time / max(self._max_travel_time, 1.0), 1.0)
            )

            # Assigned QC index normalized (0 = no assignment)
            if agv.assigned_qc_id is not None:
                obs.append((agv.assigned_qc_id + 1) / self.n_qcs)
            else:
                obs.append(0.0)

        # ── Per-QC features (4 each) ───────────────────────────────────────────
        for qc in self.terminal.qcs:
            obs.append(float(qc.is_idle_waiting_agv))  # 0 or 1
            obs.append(
                min(len(qc.tasks_pending) / max(self._max_queue, 1), 1.0)
            )
            obs.append(
                min(len(qc.agvs_en_route) / max(self.n_agvs, 1), 1.0)
            )
            obs.append(
                min(qc.time_until_next_ready / max(self._handling_mean, 1.0), 1.0)
            )

        # ── Lane congestion features ───────────────────────────────────────────
        for occupancy in self.terminal.lane_occupancy:
            obs.append(min(occupancy / max(self.n_agvs, 1), 1.0))

        # ── Global features ────────────────────────────────────────────────────
        unassigned_norm = min(
            len(self.terminal.unassigned_tasks) / max(self.max_total_tasks, 1), 1.0
        )
        obs.append(unassigned_norm)
        obs.append(min(self.current_step / max(self.max_steps, 1), 1.0))

        obs_array = np.array(obs, dtype=np.float32)

        # Sanity check: shape must match declared observation_space
        assert obs_array.shape == (self.obs_dim,), (
            f"Observation shape mismatch: got {obs_array.shape}, expected ({self.obs_dim},)"
        )

        return obs_array

    # ==========================================================================
    # Reward Computation Helpers
    # ==========================================================================

    def _compute_reward(
        self,
        qc_idle_delta: float,
        conflicts: int,
        completed_delta: int,
        empty_travel_delta: float,
    ) -> float:
        """
        Reward = -alpha * QC_idle
                 - beta  * conflicts
                 + gamma * completed
                 - delta * empty_travel

        All terms are PER-STEP (not cumulative totals).
        The agent learns to minimize idle time, minimize congestion,
        maximize deliveries, and prefer nearby AGV assignments.

        Source: Zheng et al. (2022) reward structure
        """
        return float(
            - self.alpha   * qc_idle_delta
            - self.beta    * conflicts
            + self.gamma_r * completed_delta
            - self.delta   * empty_travel_delta
        )

    def _count_conflicts(self) -> int:
        """
        Count the number of AGV-pair conflicts — cases where more than one
        AGV is on the same lane segment. Each extra AGV above 1 on a lane
        adds one conflict point.

        Example: If lane 3 has 3 AGVs, that's 2 conflict points.

        Source: Congestion model, Song et al. (2024)
        """
        conflicts = 0
        for occ in self.terminal.lane_occupancy:
            if occ > 1:
                conflicts += (occ - 1)
        return conflicts

    def _compute_empty_travel(self, pos_before: Dict[int, Tuple[float, float]]) -> float:
        """
        Total Manhattan distance covered by EMPTY-travelling AGVs this step.
        Penalized (with weight delta) to encourage dispatching the nearest idle AGV
        rather than a far-away one.

        Source: Yang et al. (2025) efficiency metric
        """
        total = 0.0
        for agv in self.terminal.agvs:
            if agv.id in pos_before:
                old_x, old_y = pos_before[agv.id]
                total += abs(agv.x - old_x) + abs(agv.y - old_y)
        return total

    # ==========================================================================
    # Rendering
    # ==========================================================================

    def render(self) -> Optional[str]:
        if self.render_mode == "ansi":
            return self._render_ansi()
        return None

    def _render_ansi(self) -> str:
        """Compact text summary for console debugging."""
        t = self.terminal
        agv_summary = ", ".join(
            f"A{agv.id}:{agv.status.name[:3]}" for agv in t.agvs
        )
        return (
            f"Step {self.current_step:4d}/{self.max_steps}  "
            f"| Time {t.current_time:6.0f}s  "
            f"| Done {t.completed_tasks:3d}  "
            f"| Pending {len(t.pending_tasks):3d}  "
            f"| QC Idle {t.get_total_qc_idle_time():7.1f}s  "
            f"| AGVs: [{agv_summary}]"
        )

    def close(self):
        pass
