"""
MaskablePPO Agent — The Main RL Contribution
=============================================
Trains a MaskablePPO agent for AGV dispatching in container terminals.

WHY PPO WITH ACTION MASKING:
    PPO (Proximal Policy Optimization) is the state-of-the-art on-policy
    RL algorithm. MaskablePPO extends it with action masking — at each
    step, only IDLE AGVs are valid actions. This prevents the agent from
    wasting training signal on impossible actions.

    This is the PRIMARY RL AGENT for the thesis. We expect it to:
    1. Outperform Greedy (myopic nearest-idle)
    2. Outperform GA (offline, can't adapt to stochastic events)
    3. Outperform DQN (off-policy, no native action masking)

ARCHITECTURE:
    State:  114 floats (AGV positions + status, QC states, congestion, global)
    Action: Discrete(10) — pick which AGV to dispatch (masked to idle only)
    Reward: -alpha*QC_idle - beta*conflicts + gamma*completions - delta*empty_travel

Literature:
    - Schulman et al. (2017): PPO
    - Huang et al. (2020): Invalid Action Masking
    - Zheng et al. (2022): DRL for AGV scheduling (uses PPO-like approach)

Usage:
    python simulation/agents/train_ppo.py --quick     # 100K steps (~8 min)
    python simulation/agents/train_ppo.py --full      # 1M steps (~70 min)
    python simulation/agents/train_ppo.py              # default: 300K steps
"""

import os
import sys
import argparse
import numpy as np
import time

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sb3_contrib import MaskablePPO
from sb3_contrib.common.wrappers import ActionMasker
from sb3_contrib.common.maskable.callbacks import MaskableEvalCallback
from stable_baselines3.common.callbacks import BaseCallback
from stable_baselines3.common.monitor import Monitor

from envs.terminal_env import TerminalEnv
from utils.recorder import SimulationRecorder
from core.agv import AGVStatus


# ── Action Masking Wrapper ────────────────────────────────────────────

def mask_fn(env: TerminalEnv) -> np.ndarray:
    """Returns boolean mask of valid actions (idle AGVs)."""
    return env.action_masks()


# ── Progress Callback ─────────────────────────────────────────────────

class ProgressCallback(BaseCallback):
    """Logs training progress every N steps."""

    def __init__(self, log_interval: int = 10_000, verbose: int = 1):
        super().__init__(verbose)
        self.log_interval = log_interval
        self.start_time = None
        self.episode_rewards = []

    def _on_training_start(self):
        self.start_time = time.time()

    def _on_step(self) -> bool:
        if len(self.model.ep_info_buffer) > 0:
            self.episode_rewards = [ep["r"] for ep in self.model.ep_info_buffer]

        if self.num_timesteps % self.log_interval == 0:
            elapsed = time.time() - self.start_time
            fps = self.num_timesteps / max(elapsed, 1)
            avg_r = np.mean(self.episode_rewards[-10:]) if self.episode_rewards else 0

            print(
                f"  [{self.num_timesteps:>8,d} steps] "
                f"Avg reward (last 10 eps): {avg_r:>8.1f} | "
                f"FPS: {fps:>5.0f} | "
                f"Elapsed: {elapsed/60:>5.1f} min"
            )

        return True


# ── Record Replay ─────────────────────────────────────────────────────

def record_replay(model, replay_path: str, max_steps: int = 1000):
    """Run one episode with the trained agent and save replay JSON."""
    raw_env = TerminalEnv()
    wrapped_env = ActionMasker(raw_env, mask_fn)

    obs, _ = wrapped_env.reset(seed=42)
    terminal = raw_env.terminal
    recorder = SimulationRecorder(terminal, policy_name="maskable_ppo")
    recorder.capture()

    total_reward = 0
    for step in range(max_steps):
        action_masks = raw_env.action_masks()
        action, _ = model.predict(obs, deterministic=True, action_masks=action_masks)

        obs, reward, terminated, truncated, info = wrapped_env.step(int(action))
        recorder.capture()
        total_reward += reward

        if terminated or truncated:
            break

    recorder.save(replay_path)
    print(f"  Replay saved: {replay_path}")
    print(f"  Episode reward: {total_reward:.1f}")
    print(f"  Tasks completed: {info['completed_tasks']}")
    print(f"  QC idle total: {info['qc_idle_total']:.1f}s")
    return info


# ── Main ──────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Train MaskablePPO for AGV dispatching")
    parser.add_argument("--quick", action="store_true", help="Quick test: 100K steps")
    parser.add_argument("--full", action="store_true", help="Full training: 1M steps")
    parser.add_argument("--steps", type=int, default=None, help="Custom timestep count")
    args = parser.parse_args()

    if args.steps:
        total_timesteps = args.steps
    elif args.quick:
        total_timesteps = 100_000
    elif args.full:
        total_timesteps = 1_000_000
    else:
        total_timesteps = 300_000

    print("=" * 60)
    print("  MaskablePPO AGENT — Training")
    print("=" * 60)
    print(f"  Total timesteps:  {total_timesteps:,}")
    print(f"  Estimated time:   ~{total_timesteps / 250 / 60:.0f} minutes")
    print()

    # Create environment with action masking wrapper
    env = ActionMasker(Monitor(TerminalEnv()), mask_fn)
    eval_env = ActionMasker(Monitor(TerminalEnv()), mask_fn)

    # MaskablePPO hyperparameters
    model = MaskablePPO(
        "MlpPolicy",
        env,
        learning_rate=3e-4,
        n_steps=2048,
        batch_size=64,
        n_epochs=10,
        gamma=0.99,
        gae_lambda=0.95,
        clip_range=0.2,
        ent_coef=0.01,
        vf_coef=0.5,
        max_grad_norm=0.5,
        policy_kwargs=dict(net_arch=[dict(pi=[256, 256], vf=[256, 256])]),
        verbose=0,
        seed=42,
    )

    print(f"  Network:    MLP pi=[256,256], vf=[256,256]")
    print(f"  LR:         {model.learning_rate}")
    print(f"  n_steps:    {model.n_steps}")
    print(f"  batch_size: {model.batch_size}")
    print(f"  Gamma:      {model.gamma}")
    print()

    # Callbacks
    progress_cb = ProgressCallback(log_interval=10_000)

    os.makedirs("simulation/agents/models", exist_ok=True)
    eval_cb = MaskableEvalCallback(
        eval_env,
        best_model_save_path="simulation/agents/models/",
        eval_freq=20_000,
        n_eval_episodes=3,
        deterministic=True,
        verbose=0,
    )

    # Train
    print("  Training started...")
    print(f"  {'':>8} {'Avg Reward':>26} | {'FPS':>8} | {'Elapsed':>10}")
    print(f"  {'-' * 60}")

    model.learn(
        total_timesteps=total_timesteps,
        callback=[progress_cb, eval_cb],
        progress_bar=False,
    )

    print(f"\n  Training complete!")

    # Save final model
    final_path = "simulation/agents/models/ppo_final"
    model.save(final_path)
    print(f"  Model saved: {final_path}")

    # Record replay
    print("\n  Recording replay with trained agent...")
    os.makedirs("simulation/replays", exist_ok=True)
    replay_path = "simulation/replays/ppo_replay.json"
    record_replay(model, replay_path)

    # Copy to webapp
    import shutil
    webapp_dir = "frontend/public/replays"
    os.makedirs(webapp_dir, exist_ok=True)
    if os.path.exists(replay_path):
        shutil.copy2(replay_path, os.path.join(webapp_dir, "ppo_replay.json"))
        print(f"  Copied to webapp: {webapp_dir}/ppo_replay.json")

    print("\n" + "=" * 60)
    print("  MaskablePPO training pipeline complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
