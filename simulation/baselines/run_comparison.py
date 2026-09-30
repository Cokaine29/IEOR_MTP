"""
Baseline Comparison — Greedy vs GA (vs RL later)
=================================================
Runs both baselines under the SAME seed and prints a side-by-side
comparison table. This is the core results table for the thesis.

Usage:
    python simulation/baselines/run_comparison.py
"""

import os
import sys
import random
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from core.terminal import Terminal
from core.agv import AGVStatus
from utils.recorder import SimulationRecorder

SEED = 42
CONFIG_PATH = "simulation/configs/config.yaml"
MAX_STEPS = 1000


# ── Greedy Runner ─────────────────────────────────────────────────────

def run_greedy(seed=SEED):
    """Run greedy baseline with fixed seed. Returns metrics dict."""
    np.random.seed(seed)
    random.seed(seed)

    terminal = Terminal(config_path=CONFIG_PATH)
    terminal.reset()
    recorder = SimulationRecorder(terminal, policy_name="greedy")
    recorder.capture()

    dispatches = 0

    for step in range(1, MAX_STEPS + 1):
        while True:
            task = terminal.get_highest_priority_task()
            if task is None:
                break
            idle_agvs = terminal.get_idle_agvs()
            if not idle_agvs:
                break

            qc = terminal.qcs[task.qc_id]
            best_id, best_d = None, float('inf')
            for aid in idle_agvs:
                agv = terminal.agvs[aid]
                d = abs(agv.x - qc.x) + abs(agv.y - qc.y)
                if d < best_d:
                    best_d = d
                    best_id = aid

            terminal.assign_agv_to_task(best_id, task)
            dispatches += 1

            if not terminal.get_idle_agvs() or not terminal.unassigned_tasks:
                break

        terminal.step()
        recorder.capture()

        all_idle = all(a.status == AGVStatus.IDLE for a in terminal.agvs)
        no_tasks = (len(terminal.pending_tasks) == 0 and
                    len(terminal.unassigned_tasks) == 0)
        if all_idle and no_tasks and terminal.completed_tasks > 0:
            break

    qc_idle = terminal.get_total_qc_idle_time()
    remaining = len(terminal.pending_tasks) + len(terminal.unassigned_tasks)

    # Save replay
    os.makedirs("simulation/replays", exist_ok=True)
    recorder.save("simulation/replays/greedy_replay.json")

    return {
        "policy": "Greedy",
        "completed": terminal.completed_tasks,
        "remaining": remaining,
        "dispatches": dispatches,
        "qc_idle_total": qc_idle,
        "qc_idle_avg": qc_idle / terminal.n_qcs,
        "conflicts": terminal.get_conflict_count(),
        "sim_time": terminal.current_time,
        "qc_details": [(qc.id, qc.accumulated_idle_time, len(qc.tasks_pending))
                       for qc in terminal.qcs],
    }


# ── GA Runner ─────────────────────────────────────────────────────────

def run_ga_best(seed=SEED):
    """Run GA, return metrics for the best chromosome."""
    from baselines.ga import run_ga, evaluate_chromosome

    best = run_ga()

    # Re-run with recording
    fitness, terminal, recorder = evaluate_chromosome(best, seed=seed, record=True)

    qc_idle = terminal.get_total_qc_idle_time()
    remaining = len(terminal.pending_tasks) + len(terminal.unassigned_tasks)

    # Save replay
    os.makedirs("simulation/replays", exist_ok=True)
    recorder.save("simulation/replays/ga_replay.json")

    return {
        "policy": "GA (best)",
        "completed": terminal.completed_tasks,
        "remaining": remaining,
        "dispatches": sum(1 for _ in range(60)),  # approximate
        "qc_idle_total": qc_idle,
        "qc_idle_avg": qc_idle / terminal.n_qcs,
        "conflicts": terminal.get_conflict_count(),
        "sim_time": terminal.current_time,
        "fitness": fitness,
        "qc_details": [(qc.id, qc.accumulated_idle_time, len(qc.tasks_pending))
                       for qc in terminal.qcs],
    }


# ── Comparison Table ──────────────────────────────────────────────────

def print_comparison(results):
    """Print a side-by-side comparison table."""
    print()
    print("=" * 70)
    print("  BASELINE COMPARISON (seed={})".format(SEED))
    print("=" * 70)
    print()

    # Header
    policies = [r["policy"] for r in results]
    header = f"  {'Metric':<25}" + "".join(f"| {p:>18} " for p in policies)
    print(header)
    print(f"  {'-' * 25}" + "".join(f"+{'-' * 19} " for _ in policies))

    # Rows
    metrics = [
        ("Tasks Completed",    "completed",     "{:d}"),
        ("Tasks Remaining",    "remaining",     "{:d}"),
        ("QC Idle (total)",    "qc_idle_total", "{:.1f}s"),
        ("QC Idle (avg/crane)","qc_idle_avg",   "{:.1f}s"),
        ("Conflicts",          "conflicts",     "{:d}"),
        ("Sim Time",           "sim_time",      "{:.0f}s"),
    ]

    for label, key, fmt in metrics:
        row = f"  {label:<25}"
        for r in results:
            val = r.get(key, "—")
            if val != "—":
                row += f"| {fmt.format(val):>18} "
            else:
                row += f"| {'—':>18} "
        print(row)

    print()

    # Per-QC breakdown
    print("  Per-QC Idle Time:")
    for qc_idx in range(4):
        row = f"    QC {qc_idx}:               "
        for r in results:
            details = r.get("qc_details", [])
            if qc_idx < len(details):
                _, idle, queue = details[qc_idx]
                row += f"| {idle:>10.1f}s (q={queue}) "
            else:
                row += f"| {'—':>18} "
        print(row)

    print()
    print("=" * 70)

    # Winner
    best = min(results, key=lambda r: r["qc_idle_total"])
    print(f"\n  🏆 Winner (lowest QC idle): {best['policy']}")
    if len(results) >= 2:
        improvement = results[0]["qc_idle_total"] - results[1]["qc_idle_total"]
        pct = (improvement / results[0]["qc_idle_total"]) * 100 if results[0]["qc_idle_total"] > 0 else 0
        print(f"  📊 GA improvement over Greedy: {improvement:.1f}s ({pct:.1f}%)")
    print()


# ── Main ──────────────────────────────────────────────────────────────

def main():
    print("\n" + "=" * 70)
    print("  RUNNING BASELINE COMPARISON")
    print("=" * 70)

    # 1. Greedy
    print("\n  ──── PHASE 1: Greedy Baseline ────")
    greedy_results = run_greedy()
    print(f"  Greedy done: {greedy_results['completed']} tasks, "
          f"QC idle = {greedy_results['qc_idle_total']:.1f}s")

    # 2. GA
    print("\n  ──── PHASE 2: Genetic Algorithm ────")
    ga_results = run_ga_best()
    print(f"  GA done: {ga_results['completed']} tasks, "
          f"QC idle = {ga_results['qc_idle_total']:.1f}s")

    # 3. Compare
    print_comparison([greedy_results, ga_results])

    # Copy replays to webapp
    import shutil
    webapp_dir = "frontend/public/replays"
    os.makedirs(webapp_dir, exist_ok=True)
    for fname in ["greedy_replay.json", "ga_replay.json"]:
        src = os.path.join("simulation/replays", fname)
        dst = os.path.join(webapp_dir, fname)
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"  Copied {fname} → {webapp_dir}/")


if __name__ == "__main__":
    main()
