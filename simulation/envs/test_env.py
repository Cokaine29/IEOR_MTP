import os
import sys

# Add the parent directory to the python path so we can import 'core'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from core.terminal import Terminal
from core.agv import AGVStatus

def test_simulation():
    print("Initializing Terminal Environment...")
    # Initialize terminal with the generated config
    term = Terminal(config_path="simulation/configs/config.yaml")
    term.reset()
    
    print(f"Terminal initialized with {len(term.qcs)} QCs and {len(term.agvs)} AGVs.")
    print(f"Initial pending tasks: {len(term.pending_tasks)}")
    
    print("\n--- Starting Simulation Loop (Greedy Policy) ---")
    
    for step in range(1, 101): # Run for 100 timesteps (100 seconds)
        # Greedy Dispatcher Logic:
        # Assign available AGVs to the highest priority tasks
        idle_agvs = term.get_idle_agvs()
        while idle_agvs:
            task = term.get_highest_priority_task()
            if task is None:
                break # No eligible tasks currently waiting
                
            agv_id = idle_agvs.pop(0)
            print(f"[t={term.current_time:03.0f}] Dispatching AGV {agv_id} to QC {task.qc_id} for Yard Block {task.yard_block_id}")
            term.assign_agv_to_task(agv_id, task)
            
        # Step the simulation forward by 1 tick
        term.step()
        
        # Every 20 seconds, print status
        if step % 20 == 0:
            print(f"\n[t={term.current_time:03.0f}] Status Update:")
            # Count AGVs in different states
            status_counts = {s.name: 0 for s in AGVStatus}
            for agv in term.agvs:
                status_counts[agv.status.name] += 1
            print(f"  AGVs: {status_counts}")
            
            qc_idle_total = sum(qc.accumulated_idle_time for qc in term.qcs)
            print(f"  Total QC Idle Time: {qc_idle_total:.1f}s")
            print(f"  Completed Tasks: {term.completed_tasks}")
            print(f"  Pending Tasks: {len(term.pending_tasks)}\n")

    print("--- Simulation Complete ---")

if __name__ == "__main__":
    test_simulation()
