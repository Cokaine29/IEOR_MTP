"""
DQN Agent — Deep Q-Network for AGV Dispatching
================================================
Trains a DQN agent on the TerminalEnv Gymnasium environment.

DQN learns a Q-value function Q(state, action) that estimates the
expected future reward of dispatching a particular AGV. At each step,
it picks the AGV with the highest Q-value (among valid/idle ones).

This is the first RL baseline. DQN is simpler than PPO but can still
outperform heuristics like Greedy on this problem because it learns
from experience which AGV assignments lead to lower QC idle time.

Limitation: Standard DQN doesn't natively support action masking.
We handle this by setting Q-values of invalid actions to -inf before
taking argmax. This is a common workaround (Huang et al. 2020).

Usage:
    python simulation/agents/train_dqn.py --quick     # 100K steps (~8 min)
    python simulation/agents/train_dqn.py --full      # 500K steps (~35 min)
    python simulation/agents/train_dqn.py              # default: 200K steps

Literature:
    - Mnih et al. (2015): DQN
    - Zheng et al. (2022): DRL for AGV scheduling
"""

import os
import sys
import argparse
import numpy as np
import time

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from stable_baselines3 import DQN
from stable_baselines3.common.callbacks import BaseCallback, EvalCallback
from stable_baselines3.common.monitor import Monitor

from envs.terminal_env import TerminalEnv
from utils.recorder import SimulationRecorder
from core.agv import AGVStatus


# ── Custom Callback for Progress Logging ──────────────────────────────

class ProgressCallback(BaseCallback):
    """Logs training progress every N steps."""

    def __init__(self, log_interval: int = 10_000, verbose: int = 1):
        super().__init__(verbose)
        self.log_interval = log_interval
        self.start_time = None
        self.episode_rewards = []
        self.episode_lengths = []

    def _on_training_start(self):
        self.start_time = time.time()

    def _on_step(self) -> bool:
        # Collect episode stats from Monitor wrapper
        if len(self.model.ep_info_buffer) > 0:
            recent = list(self.model.ep_info_buffer)
            self.episode_rewards = [ep["r"] for ep in recent]
            self.episode_lengths = [ep["l"] for ep in recent]

        if self.num_timesteps % self.log_interval == 0:
            elapsed = time.time() - self.start_time
            fps = self.num_timesteps / max(elapsed, 1)

            avg_r = np.mean(self.episode_rewards[-10:]) if self.episode_rewards else 0
            avg_l = np.mean(self.episode_lengths[-10:]) if self.episode_lengths else 0

            print(
                f"  [{self.num_timesteps:>8,d} steps] "
                f"Avg reward (last 10 eps): {avg_r:>8.1f} | "
                f"Avg length: {avg_l:>6.0f} | "
                f"FPS: {fps:>5.0f} | "
                f"Elapsed: {elapsed/60:>5.1f} min"
            )

        return True


# ── Record a Replay from Trained Agent ────────────────────────────────

def record_replay(model, env, replay_path: str, max_steps: int = 1000):
    """Run one episode with the trained agent and save replay JSON."""
    # We need direct access to the terminal for recording
    raw_env = TerminalEnv()
    obs, _ = raw_env.reset(seed=42)
    terminal = raw_env.terminal
    recorder = SimulationRecorder(terminal, policy_name="dqn")
    recorder.capture()

    total_reward = 0
    for step in range(max_steps):
        # Get action from trained model
        action, _ = model.predict(obs, deterministic=True)
        action = int(action)

        # Apply action mask manually (DQN doesn't do it natively)
        mask = raw_env.action_masks()
        if not mask[action]:
            # Pick best valid action
            q_values = model.policy.q_net(
                model.policy.obs_to_tensor(obs.reshape(1, -1))[0]
            ).detach().cpu().numpy()[0]
            q_values[~mask] = -np.inf
            action = int(np.argmax(q_values))

        obs, reward, terminated, truncated, info = raw_env.step(action)
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


# ── Main Training ─────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Train DQN for AGV dispatching")
    parser.add_argument("--quick", action="store_true", help="Quick test: 100K steps")
    parser.add_argument("--full", action="store_true", help="Full training: 500K steps")
    parser.add_argument("--steps", type=int, default=None, help="Custom timestep count")
    args = parser.parse_args()

    if args.steps:
        total_timesteps = args.steps
    elif args.quick:
        total_timesteps = 100_000
    elif args.full:
        total_timesteps = 500_000
    else:
        total_timesteps = 200_000

    print("=" * 60)
    print("  DQN AGENT — Training")
    print("=" * 60)
    print(f"  Total timesteps:  {total_timesteps:,}")
    print(f"  Estimated time:   ~{total_timesteps / 250 / 60:.0f} minutes")
    print()

    # Create environment with Monitor wrapper for episode stats
    env = Monitor(TerminalEnv())

    # Create evaluation environment
    eval_env = Monitor(TerminalEnv())

    # DQN hyperparameters (tuned for this problem)
    model = DQN(
        "MlpPolicy",
        env,
        learning_rate=1e-4,
        buffer_size=50_000,
        learning_starts=5_000,
        batch_size=64,
        gamma=0.99,
        tau=0.005,
        target_update_interval=1000,
        exploration_fraction=0.3,
        exploration_initial_eps=1.0,
        exploration_final_eps=0.05,
        train_freq=4,
        gradient_steps=1,
        policy_kwargs=dict(net_arch=[256, 256]),
        verbose=0,
        seed=42,
    )

    print(f"  Network:  MLP [114 -> 256 -> 256 -> 10]")
    print(f"  LR:       {model.learning_rate}")
    print(f"  Buffer:   {model.buffer_size:,}")
    print(f"  Gamma:    {model.gamma}")
    print()

    # Callbacks
    progress_cb = ProgressCallback(log_interval=10_000)

    # Save best model during training
    os.makedirs("simulation/agents/models", exist_ok=True)
    eval_cb = EvalCallback(
        eval_env,
        best_model_save_path="simulation/agents/models/",
        eval_freq=20_000,
        n_eval_episodes=3,
        deterministic=True,
        verbose=0,
    )

    # Train!
    print("  Training started...")
    print(f"  {'':>8} {'Avg Reward':>20} | {'Avg Length':>10} | {'FPS':>8} | {'Elapsed':>10}")
    print(f"  {'-' * 70}")

    model.learn(
        total_timesteps=total_timesteps,
        callback=[progress_cb, eval_cb],
        progress_bar=False,
    )

    print(f"\n  Training complete!")

    # Save final model
    final_path = "simulation/agents/models/dqn_final"
    model.save(final_path)
    print(f"  Model saved: {final_path}")

    # Record replay
    print("\n  Recording replay with trained agent...")
    os.makedirs("simulation/replays", exist_ok=True)
    replay_path = "simulation/replays/dqn_replay.json"
    record_replay(model, env, replay_path)

    # Copy to webapp
    import shutil
    webapp_dir = "frontend/public/replays"
    os.makedirs(webapp_dir, exist_ok=True)
    if os.path.exists(replay_path):
        shutil.copy2(replay_path, os.path.join(webapp_dir, "dqn_replay.json"))
        print(f"  Copied to webapp: {webapp_dir}/dqn_replay.json")

    print("\n" + "=" * 60)
    print("  DQN training pipeline complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
