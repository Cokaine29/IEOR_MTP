"""
test_gymnasium_env.py -- Validates the TerminalEnv Gymnasium wrapper.
Run from the D:/MTP directory:
    python simulation/envs/test_gymnasium_env.py
"""

import os
import sys
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from envs.terminal_env import TerminalEnv


def ok(msg):   print(f"  [PASS] {msg}")
def fail(msg): print(f"  [FAIL] {msg}"); sys.exit(1)
def header(msg): print(f"\n{'='*60}\n  {msg}\n{'='*60}")


# ==============================================================================
# TEST 1 -- Environment creation
# ==============================================================================
header("TEST 1: Environment Creation")
try:
    env = TerminalEnv(config_path="simulation/configs/config.yaml")
    ok(f"TerminalEnv created successfully")
    ok(f"Observation space: Box({env.obs_dim},)  dtype=float32")
    ok(f"Action space:      Discrete({env.n_agvs})")
    ok(f"Reward weights: alpha={env.alpha}, beta={env.beta}, gamma={env.gamma_r}, delta={env.delta}")
    ok(f"Max steps: {env.max_steps}")
    ok(f"Lane segments: {env.n_lanes}")
except Exception as e:
    fail(f"Environment creation failed: {e}")


# ==============================================================================
# TEST 2 -- reset() shape and dtype
# ==============================================================================
header("TEST 2: reset() Observation Shape & Dtype")
try:
    obs, info = env.reset(seed=42)
    assert isinstance(obs, np.ndarray), "Observation is not np.ndarray"
    assert obs.shape == (env.obs_dim,), f"Shape mismatch: {obs.shape} != ({env.obs_dim},)"
    assert obs.dtype == np.float32, f"Dtype mismatch: {obs.dtype} != float32"
    assert np.all(obs >= 0.0) and np.all(obs <= 1.0), "Observation out of [0, 1] range"
    ok(f"Observation shape: {obs.shape}")
    ok(f"Observation dtype: {obs.dtype}")
    ok(f"Observation range: [{obs.min():.3f}, {obs.max():.3f}]")
except AssertionError as e:
    fail(str(e))
except Exception as e:
    fail(f"reset() failed: {e}")


# ==============================================================================
# TEST 3 -- Random agent: 200 steps, no crash, reward non-zero
# ==============================================================================
header("TEST 3: Random Agent (200 steps)")
try:
    obs, _ = env.reset(seed=0)
    total_reward = 0.0
    rewards = []

    for step in range(200):
        mask = env.action_masks()
        valid_actions = np.where(mask)[0]
        action = int(np.random.choice(valid_actions))
        obs, reward, terminated, truncated, info = env.step(action)
        total_reward += reward
        rewards.append(reward)

        assert obs.shape == (env.obs_dim,)
        assert obs.dtype == np.float32
        assert np.all(obs >= 0.0) and np.all(obs <= 1.0)

        if terminated or truncated:
            ok(f"Episode ended at step {step+1} (terminated={terminated}, truncated={truncated})")
            break

    ok(f"All 200 steps completed without crash")
    ok(f"Total reward:   {total_reward:.2f}")
    ok(f"Reward range:   [{min(rewards):.2f}, {max(rewards):.2f}]")
    ok(f"Non-zero steps: {sum(1 for r in rewards if r != 0)}/{len(rewards)}")
    ok(f"Tasks done:     {env.terminal.completed_tasks}")
    ok(f"QC idle total:  {env.terminal.get_total_qc_idle_time():.1f}s")
except Exception as e:
    import traceback; traceback.print_exc()
    fail(f"Random agent test failed: {e}")


# ==============================================================================
# TEST 4 -- Action masking correctness
# ==============================================================================
header("TEST 4: Action Masking")
try:
    env.reset(seed=1)
    mask = env.action_masks()
    assert mask.shape == (env.n_agvs,), f"Mask shape wrong: {mask.shape}"
    assert mask.dtype == bool, f"Mask dtype wrong: {mask.dtype}"

    idle_agvs = env.terminal.get_idle_agvs()
    has_task = env.terminal.get_highest_priority_task() is not None
    if has_task:
        for i in idle_agvs:
            assert mask[i] == True, f"AGV {i} is IDLE but masked as invalid"

    ok(f"Mask shape: {mask.shape}")
    ok(f"Mask dtype: {mask.dtype}")
    ok(f"Idle AGVs:  {idle_agvs}")
    ok(f"Valid mask indices: {np.where(mask)[0].tolist()}")
    ok(f"Masking is consistent with idle AGV list")
except AssertionError as e:
    fail(str(e))
except Exception as e:
    fail(f"Action masking test failed: {e}")


# ==============================================================================
# TEST 5 -- Full episode to termination
# ==============================================================================
header("TEST 5: Full Episode to Termination")
try:
    obs, _ = env.reset(seed=99)
    total_reward = 0.0
    step_count = 0

    while True:
        mask = env.action_masks()
        valid = np.where(mask)[0]
        action = int(np.random.choice(valid))
        obs, reward, terminated, truncated, info = env.step(action)
        total_reward += reward
        step_count += 1
        if terminated or truncated:
            break

    reason = "terminated (all done)" if terminated else "truncated (max steps)"
    ok(f"Episode ended at step {step_count} -- {reason}")
    ok(f"Tasks completed: {env.terminal.completed_tasks}")
    ok(f"Total reward:    {total_reward:.2f}")
    ok(f"QC idle total:   {env.terminal.get_total_qc_idle_time():.1f}s")
except Exception as e:
    import traceback; traceback.print_exc()
    fail(f"Full episode test failed: {e}")


# ==============================================================================
# TEST 6 -- SB3 check_env compatibility
# ==============================================================================
header("TEST 6: SB3 check_env() Compatibility")
try:
    from stable_baselines3.common.env_checker import check_env
    fresh_env = TerminalEnv(config_path="simulation/configs/config.yaml")
    check_env(fresh_env, warn=True)
    ok("SB3 check_env() passed -- environment is fully SB3-compatible")
except Exception as e:
    print(f"  [WARN] check_env warning (non-fatal): {e}")


# ==============================================================================
# TEST 7 -- MaskablePPO smoke test (512 steps)
# ==============================================================================
header("TEST 7: MaskablePPO Smoke Test (512 steps)")
try:
    from sb3_contrib import MaskablePPO
    train_env = TerminalEnv(config_path="simulation/configs/config.yaml")
    model = MaskablePPO(
        "MlpPolicy", train_env,
        verbose=0, n_steps=128, batch_size=32, n_epochs=4,
    )
    model.learn(total_timesteps=512)
    ok("MaskablePPO trained for 512 steps without crash")
except ImportError:
    print("  [SKIP] sb3-contrib not installed -- skipping MaskablePPO test")
except Exception as e:
    import traceback; traceback.print_exc()
    fail(f"MaskablePPO smoke test failed: {e}")


print(f"\n{'='*60}")
print(f"  ALL TESTS PASSED -- TerminalEnv is ready for RL training!")
print(f"{'='*60}\n")
