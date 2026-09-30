"""
SimulationRecorder - Records every timestep to JSON for 2D/3D replay.
=====================================================================
Captures AGV positions (interpolated from node + edge progress),
QC states, and network node data at every simulation step.
"""

import json
import os
import numpy as np
from typing import Optional


class _NumpyEncoder(json.JSONEncoder):
    """Handles numpy int64/float64 which json.dump can't serialize natively."""
    def default(self, obj):
        if isinstance(obj, (np.integer,)):
            return int(obj)
        if isinstance(obj, (np.floating,)):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super().default(obj)


class SimulationRecorder:
    """Captures terminal state every timestep and saves as JSON for replay."""

    def __init__(self, terminal, policy_name: str = "unknown"):
        self.terminal = terminal
        self.policy_name = policy_name

        # Network layout (static)
        net = terminal.network
        self.layout = {
            "width": terminal.width,
            "height": terminal.height,
            "quay_road_y": terminal.quay_road_y,
            "yard_road_y": terminal.yard_road_y,
            "n_qcs": terminal.n_qcs,
            "n_agvs": terminal.n_agvs,
            "n_yard_blocks": terminal.n_yard_blocks,
            # Network graph
            "nodes": [
                {
                    "id": n.id,
                    "x": n.x,
                    "y": n.y,
                    "type": n.node_type.value,
                    "entity_id": n.entity_id,
                }
                for n in net.nodes.values()
            ],
            "edges": [
                {
                    "from": edge.from_node_id,
                    "to": edge.to_node_id,
                    "distance": round(edge.distance, 1),
                }
                for edges in net.adjacency.values()
                for edge in edges
            ],
            # QC / Yard positions (for 3D renderer compatibility)
            "qc_positions": [
                {"id": qc_id, "x": net.nodes[nid].x, "y": net.nodes[nid].y}
                for qc_id, nid in sorted(net.qc_nodes.items())
            ],
            "yard_positions": [
                {"id": yb_id, "x": net.nodes[nid].x, "y": net.nodes[nid].y}
                for yb_id, nid in sorted(net.yard_nodes.items())
            ],
            "qc_handoff_y": terminal.quay_road_y,
            "yard_handoff_y": terminal.yard_road_y,
        }

        self.frames = []

    def capture(self):
        """Snapshot the current terminal state."""
        t = self.terminal

        agv_states = []
        for agv in t.agvs:
            agv_states.append({
                "id": agv.id,
                "x": round(agv.x, 2),
                "y": round(agv.y, 2),
                "status": agv.status.name,
                "has_container": agv.has_container,
                "assigned_qc": agv.assigned_qc_id,
                "assigned_yard": agv.assigned_yard_block_id,
                "current_node": agv.current_node,
                "is_blocked": agv.is_blocked,
            })

        qc_states = []
        for qc in t.qcs:
            qc_states.append({
                "id": qc.id,
                "is_working": qc.is_working,
                "is_idle_waiting": qc.is_idle_waiting_agv,
                "queue_length": len(qc.tasks_pending),
                "idle_time": round(qc.accumulated_idle_time, 1),
                "time_until_ready": round(qc.time_until_next_ready, 1),
            })

        metrics = {
            "completed_tasks": t.completed_tasks,
            "pending_tasks": len(t.pending_tasks),
            "unassigned_tasks": len(t.unassigned_tasks),
            "qc_idle_total": round(t.get_total_qc_idle_time(), 1),
            "conflicts": t.get_conflict_count(),
        }

        self.frames.append({
            "time": round(t.current_time, 1),
            "agvs": agv_states,
            "qcs": qc_states,
            "metrics": metrics,
        })

    def save(self, filepath: str):
        """Save the complete recording as JSON."""
        final = self.frames[-1]["metrics"] if self.frames else {}

        data = {
            "metadata": {
                "policy": self.policy_name,
                "total_frames": len(self.frames),
                "timestep_seconds": self.terminal.config["episode"]["timestep_seconds"],
                "final_completed": final.get("completed_tasks", 0),
                "final_qc_idle": final.get("qc_idle_total", 0),
            },
            "layout": self.layout,
            "frames": self.frames,
        }

        os.makedirs(os.path.dirname(filepath) if os.path.dirname(filepath) else ".", exist_ok=True)

        with open(filepath, "w") as f:
            json.dump(data, f, indent=None, separators=(",", ":"), cls=_NumpyEncoder)

        size_kb = os.path.getsize(filepath) / 1024
        print(f"[Recorder] Saved {len(self.frames)} frames to {filepath} ({size_kb:.0f} KB)")
