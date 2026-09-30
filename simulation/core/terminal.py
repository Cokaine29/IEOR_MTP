"""
Terminal - Main simulation environment using a node-based road network.
========================================================================
Manages all entities (AGVs, QCs, Tasks) on a directed graph network.

Architecture (Lou et al. 2023):
  - AGVs move node-to-node on a directed graph
  - QCs and Yard Blocks are specific nodes on the graph
  - Conflict avoidance: AGVs wait if target node is occupied
  - Travel time depends on graph distance and AGV speed (loaded vs empty)

Key changes from the original waypoint-based terminal:
  - Layout is defined by TerminalNetwork (network.py)
  - AGV paths are computed via Dijkstra shortest path
  - Congestion is measured per-node (occupancy) instead of per-lane
  - Conflict count = number of AGVs currently blocked
"""

import numpy as np
from typing import List, Dict, Optional
import yaml

from .agv import AGV, AGVStatus
from .qc import QuayCrane
from .task_generator import TaskGenerator, Task
from .network import TerminalNetwork, NodeType


class Terminal:
    """
    The main simulation environment managing all entities on a node network.
    """

    def __init__(self, config_path: str = "simulation/configs/config.yaml", np_random: np.random.Generator = None):
        # Load config
        with open(config_path, "r") as f:
            self.config = yaml.safe_load(f)

        self.np_random = np_random if np_random is not None else np.random.default_rng()

        # Terminal layout dimensions
        self.width       = self.config["terminal"]["grid_width"]
        self.height      = self.config["terminal"]["grid_height"]
        self.quay_road_y = self.config["terminal"]["quay_road_y"]
        self.yard_road_y = self.config["terminal"]["yard_road_y"]

        self.n_qcs         = self.config["terminal"]["n_qcs"]
        self.n_agvs        = self.config["terminal"]["n_agvs"]
        self.n_yard_blocks = self.config["terminal"]["n_yard_blocks"]

        # Entities
        self.network: Optional[TerminalNetwork] = None
        self.qcs: List[QuayCrane] = []
        self.agvs: List[AGV] = []
        self.task_generator = TaskGenerator(
            n_qcs=self.n_qcs,
            n_yard_blocks=self.n_yard_blocks,
            mode=self.config["stochasticity"]["mode"],
            np_random=self.np_random
        )

        # State tracking
        self.current_time    = 0.0
        self.completed_tasks = 0
        self.pending_tasks: List[Task] = []
        self.unassigned_tasks: List[Task] = []

        # Conflict tracking
        self.conflicts_this_step = 0

        # Lane occupancy (initialized here so it exists before first step)
        self.lane_occupancy = [0] * (2 + self.n_qcs)
        self.n_lanes = len(self.lane_occupancy)

        # Initialize
        self._build_layout()

    def _build_layout(self):
        """
        Initializes the network, QCs, AGVs, and Yard Block positions.
        """
        # Build the directed graph network
        self.network = TerminalNetwork(self.config)

        # QCs at their network node positions
        for qc_id in range(self.n_qcs):
            node_id = self.network.get_qc_node_id(qc_id)
            node = self.network.nodes[node_id]
            self.qcs.append(QuayCrane(qc_id=qc_id, x=node.x, y=node.y))

        # Yard dropoff positions (at yard block network nodes)
        self.yard_dropoffs = []
        for yb_id in range(self.n_yard_blocks):
            node_id = self.network.get_yard_node_id(yb_id)
            node = self.network.nodes[node_id]
            self.yard_dropoffs.append({"x": node.x, "y": node.y})

        # AGVs start at evenly-spaced nodes on the yard corridor
        # Use ALL yard corridor nodes (including YB nodes for parking)
        available_start_nodes = list(self.network.yard_node_ids)

        speed_empty  = float(self.config["agv"].get("speed_empty", 5.0))
        speed_loaded = float(self.config["agv"].get("speed_loaded", 3.0))

        for i in range(self.n_agvs):
            # Distribute across available nodes, cycling if more AGVs than nodes
            node_idx = i % len(available_start_nodes)
            start_node = available_start_nodes[node_idx]

            agv = AGV(
                agv_id=i,
                start_node_id=start_node,
                network=self.network,
                speed_empty=speed_empty,
                speed_loaded=speed_loaded,
            )
            self.agvs.append(agv)

    def reset(self):
        """Resets the terminal state for a new episode."""
        self.current_time = 0.0
        self.completed_tasks = 0
        self.pending_tasks = []
        self.unassigned_tasks = []
        self.conflicts_this_step = 0
        self.qcs = []
        self.agvs = []

        self.task_generator = TaskGenerator(
            n_qcs=self.n_qcs,
            n_yard_blocks=self.n_yard_blocks,
            mode=self.config["stochasticity"]["mode"],
            np_random=self.np_random
        )

        self._build_layout()

        # Generate initial batch of tasks
        initial_tasks = self.task_generator.generate_initial_tasks(
            base_count=self.config["episode"]["initial_tasks"]
        )
        for t in initial_tasks:
            self.qcs[t.qc_id].add_task(t)
            self.pending_tasks.append(t)
            self.unassigned_tasks.append(t)

        # Start QC handling for the first container at each crane
        for qc in self.qcs:
            if len(qc.tasks_pending) > 0 and not qc.is_working:
                handling_time = self.np_random.normal(
                    self.config["crane"]["handling_time_mean"],
                    self.config["crane"]["handling_time_std"]
                )
                qc.start_handling(max(10.0, handling_time))

    # -- Lane / Node Occupancy ------------------------------------------------

    def _compute_lane_occupancy(self):
        """
        Compute node occupancy for the observation space.
        Returns a list of occupancy counts per corridor segment.

        For backward compatibility with the Gymnasium wrapper, we map
        node occupancy to 6 virtual 'lanes':
          [0] quay corridor occupancy (total AGVs on quay nodes)
          [1] yard corridor occupancy (total AGVs on yard nodes)
          [2..5] perpendicular lane occupancy at each QC/YB column
        """
        self.lane_occupancy = [0] * (2 + self.n_qcs)

        for agv in self.agvs:
            if agv.status not in (AGVStatus.TRAVELLING_EMPTY, AGVStatus.TRAVELLING_LOADED):
                continue

            node = self.network.nodes[agv.current_node]
            if node.y == self.quay_road_y:
                self.lane_occupancy[0] += 1
            elif node.y == self.yard_road_y:
                self.lane_occupancy[1] += 1
            else:
                # On a perpendicular lane -- find which column
                for idx, qc_id in enumerate(sorted(self.network.qc_nodes.keys())):
                    qc_node = self.network.nodes[self.network.qc_nodes[qc_id]]
                    if abs(node.x - qc_node.x) < 1.0:
                        self.lane_occupancy[2 + idx] += 1
                        break

        self.n_lanes = len(self.lane_occupancy)

    def _get_route_congestion(self, from_node: int, to_node: int) -> float:
        """
        Estimate congestion along a route by counting occupied nodes.
        Returns a float representing congestion level (0 = clear, higher = worse).
        """
        path, _ = self.network.shortest_path(from_node, to_node)
        if not path:
            return 0.0
        occupied = sum(1 for nid in path if self.network.is_node_occupied(nid))
        return float(occupied)

    # -- Travel Time ----------------------------------------------------------

    def _calculate_travel_time(self, from_node: int, to_node: int,
                               is_loaded: bool = False) -> float:
        """
        Calculate estimated travel time from node to node.

        Formula (matches MDP formulation):
          travel_time = (path_distance / speed) * (1 + kappa * congestion)
                        + n_turns * turning_time
                        + Normal(0, sigma)
        """
        _, path_distance = self.network.shortest_path(from_node, to_node)

        if path_distance == float("inf"):
            return 9999.0

        # Speed depends on loaded/empty
        speed = float(self.config["agv"].get("speed_loaded", 3.0)) if is_loaded \
            else float(self.config["agv"].get("speed_empty", 5.0))
        base_time = path_distance / speed

        # Congestion multiplier -- Song et al. (2024)
        mode  = self.config["stochasticity"]["mode"]
        kappa = self.config["stochasticity"]["congestion_factor"][mode]
        congestion = self._get_route_congestion(from_node, to_node)
        travel_time = base_time * (1.0 + kappa * congestion)

        # Turning time -- Liu et al. (2001)
        # Each route has ~2 turns (corridor -> perpendicular -> corridor)
        turning_time = self.config["agv"]["turning_time"]
        path, _ = self.network.shortest_path(from_node, to_node)
        n_turns = self._count_turns(path) if path else 0
        travel_time += n_turns * turning_time

        # Stochastic travel noise
        noise_std = self.config["stochasticity"]["travel_noise_std"][mode]
        if noise_std > 0:
            noise = self.np_random.normal(0, noise_std)
            travel_time = max(1.0, travel_time + noise)

        return travel_time

    def _count_turns(self, path: List[int]) -> int:
        """Count direction changes (turns) in a node path."""
        if len(path) < 3:
            return 0
        turns = 0
        for i in range(1, len(path) - 1):
            prev_n = self.network.nodes[path[i - 1]]
            curr_n = self.network.nodes[path[i]]
            next_n = self.network.nodes[path[i + 1]]
            # Direction change: was moving horizontally, now vertical (or vice versa)
            was_horizontal = abs(curr_n.x - prev_n.x) > 0.1
            now_horizontal = abs(next_n.x - curr_n.x) > 0.1
            if was_horizontal != now_horizontal:
                turns += 1
        return turns

    # -- Task Management ------------------------------------------------------

    def get_idle_agvs(self) -> List[int]:
        return [agv.id for agv in self.agvs if agv.status == AGVStatus.IDLE]

    def get_highest_priority_task(self) -> Optional[Task]:
        """Returns the highest priority unassigned task (QC with most idle time)."""
        if not self.unassigned_tasks:
            return None
        self.unassigned_tasks.sort(
            key=lambda t: self.qcs[t.qc_id].accumulated_idle_time, reverse=True
        )
        return self.unassigned_tasks[0]

    def assign_agv_to_task(self, agv_id: int, task: Task):
        """
        Executes a dispatching decision.
        AGV receives a Dijkstra-computed path to the QC node.
        """
        agv = self.agvs[agv_id]
        qc = self.qcs[task.qc_id]
        qc_node = self.network.get_qc_node_id(task.qc_id)

        # Compute path from AGV's current node to QC node
        path, _ = self.network.shortest_path(agv.current_node, qc_node)
        if not path:
            return  # No path found (shouldn't happen in a connected graph)

        # Assign
        agv.assign_task(
            qc_id=qc.id,
            yard_block_id=task.yard_block_id,
            path_to_qc=path,
        )

        # Update QC tracking
        qc.agvs_en_route.append(agv_id)

        # Remove from unassigned
        if task in self.unassigned_tasks:
            self.unassigned_tasks.remove(task)

    # -- Simulation Step ------------------------------------------------------

    def step(self):
        """Advances the simulation by one timestep."""
        dt = self.config["episode"]["timestep_seconds"]
        self.current_time += dt

        # 0. Update lane/node congestion
        self._compute_lane_occupancy()

        # 1. Generate new tasks
        new_tasks = self.task_generator.step(dt, self.current_time)
        for t in new_tasks:
            self.qcs[t.qc_id].add_task(t)
            self.pending_tasks.append(t)
            self.unassigned_tasks.append(t)

        # 2. Update AGVs
        self.conflicts_this_step = 0
        for agv in self.agvs:
            agv.step(dt)

            # Count conflicts (AGVs blocked this step)
            if agv.is_blocked:
                self.conflicts_this_step += 1

            # State transitions based on path completion
            if agv.status == AGVStatus.TRAVELLING_EMPTY and agv.has_arrived:
                # Arrived at QC node
                agv.arrive_at_qc()

            elif agv.status == AGVStatus.AT_QC_WAITING:
                # Check if QC is ready for handoff
                qc = self.qcs[agv.assigned_qc_id]
                if qc.is_idle_waiting_agv and len(qc.tasks_pending) > 0:
                    # Handoff successful!
                    task = qc.handoff_to_agv(agv.id)
                    if task in self.pending_tasks:
                        self.pending_tasks.remove(task)

                    # Compute path from QC node to Yard Block node
                    qc_node = self.network.get_qc_node_id(agv.assigned_qc_id)
                    yb_node = self.network.get_yard_node_id(task.yard_block_id)
                    path, _ = self.network.shortest_path(qc_node, yb_node)

                    agv.start_loaded_travel(path_to_yard=path)

                    # Tell QC to start handling next container
                    if len(qc.tasks_pending) > 0:
                        handling_time = self.np_random.normal(
                            self.config["crane"]["handling_time_mean"],
                            self.config["crane"]["handling_time_std"]
                        )
                        qc.start_handling(max(10.0, handling_time))

            elif agv.status == AGVStatus.TRAVELLING_LOADED and agv.has_arrived:
                # Arrived at yard block node
                agv.arrive_at_yard(
                    dropoff_time=self.config["agv"]["dropoff_time"]
                )

            elif agv.status == AGVStatus.AT_YARD_DROPPING and agv.timer == 0:
                # Dropoff complete
                agv.finish_dropoff()
                self.completed_tasks += 1

        # 3. Update QCs
        for qc in self.qcs:
            qc.step(dt)

    # -- Metrics --------------------------------------------------------------

    def get_total_qc_idle_time(self) -> float:
        return sum(qc.accumulated_idle_time for qc in self.qcs)

    def get_conflict_count(self) -> int:
        """
        Number of node-level congestion events (2+ AGVs at same node).
        Used as a soft penalty in the RL reward, not as a hard block.
        """
        conflicts = 0
        for node_id in self.network.nodes:
            count = self.network.get_node_occupant_count(node_id)
            if count >= 2:
                conflicts += count - 1  # Each extra AGV is a conflict
        return conflicts
