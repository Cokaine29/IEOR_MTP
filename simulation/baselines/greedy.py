"""
Greedy Baseline - Nearest Idle AGV Dispatching Policy
=====================================================
The simplest reasonable dispatching strategy. When a task needs an AGV:
    1. Look at all idle AGVs
    2. Pick the one closest to the requesting QC (Manhattan distance)
    3. Dispatch it

This is how many real, older ports actually operate — simple and fast,
but it doesn't consider future tasks, congestion, or global optimization.

This script:
    1. Runs a full simulation episode with greedy dispatching
    2. Records every timestep using SimulationRecorder
    3. Saves the replay as JSON for the 3D webapp
    4. Prints final performance metrics

Usage:
    python simulation/baselines/greedy.py
"""

import os
import sys

# Allow running from D:\MTP directory
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from core.terminal import Terminal
from core.agv import AGVStatus
from utils.recorder import SimulationRecorder


def manhattan_distance(x1, y1, x2, y2):
    return abs(x1 - x2) + abs(y1 - y2)


def find_nearest_idle_agv(terminal, qc):
    """
    Find the idle AGV closest (Manhattan distance) to the given QC.
    Returns the AGV id, or None if no AGV is idle.
    """
    idle_agvs = terminal.get_idle_agvs()
    if not idle_agvs:
        return None

    best_id = None
    best_dist = float("inf")
    for agv_id in idle_agvs:
        agv = terminal.agvs[agv_id]
        d = manhattan_distance(agv.x, agv.y, qc.x, qc.y)
        if d < best_dist:
            best_dist = d
            best_id = agv_id

    return best_id


def run_greedy_episode(config_path="simulation/configs/config.yaml", max_steps=1000):
    """
    Run one full episode with greedy (nearest-AGV) dispatching.
    Returns the terminal and recorder for post-analysis.
    """
    # Initialize
    terminal = Terminal(config_path=config_path)
    terminal.reset()
    recorder = SimulationRecorder(terminal, policy_name="greedy")

    # Capture initial state (before any steps)
    recorder.capture()

    print(f"=== Greedy Baseline ===")
    print(f"Terminal: {terminal.n_qcs} QCs, {terminal.n_agvs} AGVs, {terminal.n_yard_blocks} Yard Blocks")
    print(f"Max steps: {max_steps}")
    print(f"Initial pending tasks: {len(terminal.pending_tasks)}")
    print()

    dispatches = 0

    for step in range(1, max_steps + 1):
        # --- Greedy Dispatching Logic ---
        # Try to dispatch idle AGVs to unassigned tasks
        # Keep dispatching until no more idle AGVs or no more tasks
        keep_dispatching = True
        while keep_dispatching:
            task = terminal.get_highest_priority_task()
            if task is None:
                break

            qc = terminal.qcs[task.qc_id]
            nearest_agv_id = find_nearest_idle_agv(terminal, qc)

            if nearest_agv_id is None:
                break  # No idle AGVs available

            # Dispatch!
            terminal.assign_agv_to_task(nearest_agv_id, task)
            dispatches += 1

            # Check if there are more idle AGVs and tasks
            if not terminal.get_idle_agvs() or not terminal.unassigned_tasks:
                keep_dispatching = False

        # --- Step simulation forward ---
        terminal.step()
        recorder.capture()

        # --- Progress reporting every 100 steps ---
        if step % 100 == 0:
            idle_count = sum(1 for a in terminal.agvs if a.status == AGVStatus.IDLE)
            print(
                f"  [t={terminal.current_time:5.0f}s] "
                f"Completed: {terminal.completed_tasks:3d} | "
                f"Pending: {len(terminal.pending_tasks):3d} | "
                f"Idle AGVs: {idle_count:2d} | "
                f"QC Idle: {terminal.get_total_qc_idle_time():7.1f}s | "
                f"Dispatches: {dispatches}"
            )

        # --- Early termination if all done ---
        all_idle = all(a.status == AGVStatus.IDLE for a in terminal.agvs)
        no_tasks = len(terminal.pending_tasks) == 0 and len(terminal.unassigned_tasks) == 0
        if all_idle and no_tasks and terminal.completed_tasks > 0:
            print(f"\n  All tasks completed at step {step} (t={terminal.current_time:.0f}s)!")
            break

    return terminal, recorder, dispatches


def main():
    terminal, recorder, dispatches = run_greedy_episode()

    # Final stats
    print()
    print("=" * 60)
    print("  GREEDY BASELINE RESULTS")
    print("=" * 60)
    print(f"  Total simulation time:  {terminal.current_time:.0f} seconds")
    print(f"  Tasks completed:        {terminal.completed_tasks}")
    print(f"  Tasks remaining:        {len(terminal.pending_tasks) + len(terminal.unassigned_tasks)}")
    print(f"  Total dispatches:       {dispatches}")
    print(f"  Total QC idle time:     {terminal.get_total_qc_idle_time():.1f} seconds")
    print(f"  Avg QC idle per crane:  {terminal.get_total_qc_idle_time() / terminal.n_qcs:.1f} seconds")
    print()

    # AGV utilization
    print("  AGV Final States:")
    for agv in terminal.agvs:
        print(f"    AGV {agv.id}: {agv.status.name} at ({agv.x:.1f}, {agv.y:.1f})")
    print()

    # QC performance
    print("  QC Performance:")
    for qc in terminal.qcs:
        print(f"    QC {qc.id}: Idle={qc.accumulated_idle_time:.1f}s, Queue={len(qc.tasks_pending)}")
    print("=" * 60)

    # Save replay JSON
    output_dir = "simulation/replays"
    os.makedirs(output_dir, exist_ok=True)
    replay_path = os.path.join(output_dir, "greedy_replay.json")
    recorder.save(replay_path)

    print(f"\n  Replay saved to: {replay_path}")
    print(f"  Copy this file to your Next.js public/ folder for 3D playback!")
    print()


if __name__ == "__main__":
    main()
