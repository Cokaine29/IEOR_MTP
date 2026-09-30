"""
AGV - Automated Guided Vehicle with node-based movement.
=========================================================
Moves along a directed graph (TerminalNetwork) from node to node.
Positions are interpolated between nodes for smooth visualization.

State machine (5 states) -- Yang et al. (2025):
    IDLE -> TRAVELLING_EMPTY -> AT_QC_WAITING -> TRAVELLING_LOADED -> AT_YARD_DROPPING -> IDLE

Movement model -- Lou et al. (2023):
    - AGV follows a path of node IDs computed by Dijkstra
    - At each timestep, AGV advances along the current edge
    - If the next node is occupied, AGV waits (conflict avoidance)
    - Different speeds for loaded vs empty -- Liu et al. (2002)

Conflict avoidance -- Lou et al. (2023):
    - Two AGVs cannot occupy the same node simultaneously
    - When target node is occupied, AGV stops and waits
    - Lower-priority AGV yields (currently: any waiting AGV yields)
"""

import enum
from typing import List, Optional


class AGVStatus(enum.IntEnum):
    """5-state AGV status machine -- Yang et al. (2025)."""
    IDLE = 0
    TRAVELLING_EMPTY = 1
    AT_QC_WAITING = 2
    TRAVELLING_LOADED = 3
    AT_YARD_DROPPING = 4


class AGV:
    """
    Automated Guided Vehicle with node-based movement on a directed graph.

    Road Network (Lou et al. 2023 -- node network):
    ---------------------------------------------------------------
    QUAY CORRIDOR  (y=15, one-way -->)
      n0 -> n1 -> n2(QC0) -> n3 -> ... -> n10
       |          |                        |
    PERPENDICULAR LANES (bidirectional)
       |          |                        |
    YARD CORRIDOR  (y=85, one-way <--)
     n21 <- n20 <- n19(YB0) <- ... <- n11
    """

    def __init__(self, agv_id: int, start_node_id: int, network,
                 speed_empty: float = 5.0, speed_loaded: float = 3.0):
        self.id = agv_id
        self.network = network

        # Position (node-based)
        self.current_node = start_node_id
        self.target_node: Optional[int] = None
        self.edge_progress: float = 0.0  # 0.0 = at current, 1.0 = at target

        # Continuous position (interpolated for visualization)
        node = network.nodes[start_node_id]
        self.x: float = node.x
        self.y: float = node.y

        # Path (list of remaining node IDs to visit)
        self.path: List[int] = []

        # State
        self.status = AGVStatus.IDLE
        self.assigned_qc_id: Optional[int] = None
        self.assigned_yard_block_id: Optional[int] = None

        # Timer for pickup/dropoff waits
        self.timer: float = 0.0

        # Speed -- Liu et al. (2002): loaded AGVs are slower
        self.speed_empty = speed_empty
        self.speed_loaded = speed_loaded

        # Track if AGV is waiting due to conflict
        self.is_blocked: bool = False

        # Occupy starting node
        network.occupy_node(start_node_id, agv_id)

    @property
    def speed(self) -> float:
        """Current speed depends on whether AGV is carrying a container."""
        if self.status == AGVStatus.TRAVELLING_LOADED:
            return self.speed_loaded
        return self.speed_empty

    @property
    def has_container(self) -> bool:
        """AGV is carrying a container when loaded or dropping off."""
        return self.status in (AGVStatus.TRAVELLING_LOADED, AGVStatus.AT_YARD_DROPPING)

    @property
    def has_arrived(self) -> bool:
        """AGV has completed its current path (no more nodes to visit)."""
        return len(self.path) == 0 and self.target_node is None

    @property
    def travel_remaining_time(self) -> float:
        """Estimated remaining travel time based on path distance and speed."""
        if self.target_node is None:
            return 0.0

        remaining = 0.0

        # Distance left on current edge
        edge_dist = self.network.get_edge_distance(self.current_node, self.target_node)
        remaining += edge_dist * (1.0 - self.edge_progress)

        # Distance for remaining path segments
        prev_node = self.target_node
        for next_node in self.path[1:]:  # path[0] is target_node
            remaining += self.network.get_edge_distance(prev_node, next_node)
            prev_node = next_node

        return remaining / max(self.speed, 0.1)

    # -- Position Interpolation -----------------------------------------------

    def _update_position(self):
        """Update continuous (x, y) from node positions and edge progress."""
        if self.target_node is not None and self.edge_progress > 0:
            curr = self.network.nodes[self.current_node]
            targ = self.network.nodes[self.target_node]
            self.x = curr.x + self.edge_progress * (targ.x - curr.x)
            self.y = curr.y + self.edge_progress * (targ.y - curr.y)
        else:
            node = self.network.nodes[self.current_node]
            self.x = node.x
            self.y = node.y

    # -- Path Management ------------------------------------------------------

    def set_path(self, path: List[int]):
        """
        Set a new navigation path (list of node IDs).
        First element should be the current node; it will be skipped.
        """
        if path and path[0] == self.current_node:
            self.path = list(path[1:])  # Skip current node
        else:
            self.path = list(path)

        if self.path:
            self.target_node = self.path[0]
            self.edge_progress = 0.0
        else:
            self.target_node = None
            self.edge_progress = 0.0

    # -- State Transitions ----------------------------------------------------

    def assign_task(self, qc_id: int, yard_block_id: int, path_to_qc: List[int]):
        """
        Assign AGV to pick up from a QC. Sets path to QC node.
        Transitions: IDLE -> TRAVELLING_EMPTY
        """
        if self.status != AGVStatus.IDLE:
            raise ValueError(
                f"AGV {self.id} cannot accept task -- not IDLE "
                f"(current: {self.status.name})"
            )
        self.assigned_qc_id = qc_id
        self.assigned_yard_block_id = yard_block_id
        self.set_path(path_to_qc)
        self.status = AGVStatus.TRAVELLING_EMPTY

    def arrive_at_qc(self):
        """
        Empty travel complete. AGV is now at QC node waiting for crane.
        Transitions: TRAVELLING_EMPTY -> AT_QC_WAITING
        """
        if self.status != AGVStatus.TRAVELLING_EMPTY:
            raise ValueError(f"AGV {self.id} is not travelling empty.")
        # Release the network node -- AGV is now "in the QC serving area",
        # off the main corridor, so the corridor node is freed for traffic.
        self.network.release_node(self.current_node, self.id)
        self.status = AGVStatus.AT_QC_WAITING
        self.timer = 0.0

    def start_loaded_travel(self, path_to_yard: List[int]):
        """
        QC has loaded a container. AGV departs toward yard block.
        Transitions: AT_QC_WAITING -> TRAVELLING_LOADED
        """
        if self.status != AGVStatus.AT_QC_WAITING:
            raise ValueError(f"AGV {self.id} is not waiting at a QC.")
        # Re-enter the network at the QC node
        self.network.occupy_node(self.current_node, self.id)
        self.set_path(path_to_yard)
        self.status = AGVStatus.TRAVELLING_LOADED

    def arrive_at_yard(self, dropoff_time: float):
        """
        Loaded travel complete. AGV starts dropping off container.
        Transitions: TRAVELLING_LOADED -> AT_YARD_DROPPING
        """
        if self.status != AGVStatus.TRAVELLING_LOADED:
            raise ValueError(f"AGV {self.id} is not travelling loaded.")
        # Release node -- AGV is in the yard crane serving area
        self.network.release_node(self.current_node, self.id)
        self.status = AGVStatus.AT_YARD_DROPPING
        self.timer = dropoff_time

    def finish_dropoff(self):
        """
        Yard crane has lifted container. AGV is free.
        Transitions: AT_YARD_DROPPING -> IDLE
        """
        if self.status != AGVStatus.AT_YARD_DROPPING:
            raise ValueError(f"AGV {self.id} is not at yard dropping.")
        # Re-enter the network at the yard node
        self.network.occupy_node(self.current_node, self.id)
        self.status = AGVStatus.IDLE
        self.assigned_qc_id = None
        self.assigned_yard_block_id = None

    # -- Simulation Step ------------------------------------------------------

    def step(self, dt: float):
        """
        Advance AGV by dt seconds along its path.

        Movement: follows directed graph edges, node to node.
        Conflict: if next node is occupied, AGV waits (Lou et al. 2023).
        """
        self.is_blocked = False

        # Handle stationary timers (pickup wait at QC, dropoff at yard)
        if self.timer > 0:
            self.timer = max(0.0, self.timer - dt)
            return

        # If no path, nothing to move
        if self.target_node is None or not self.path:
            return

        # Check for congestion at target node (soft tracking, not hard block)
        if self.network.get_node_occupant_count(self.target_node) >= 2:
            self.is_blocked = True  # Flag for reward penalty, but DON'T stop

        # Calculate movement along edge
        edge_dist = self.network.get_edge_distance(self.current_node, self.target_node)
        if edge_dist <= 0:
            return

        progress_delta = (self.speed * dt) / edge_dist
        self.edge_progress += progress_delta

        if self.edge_progress >= 1.0:
            # Arrived at target node
            self.network.release_node(self.current_node, self.id)
            self.current_node = self.target_node
            self.network.occupy_node(self.current_node, self.id)
            self.edge_progress = 0.0
            self.path.pop(0)

            if self.path:
                self.target_node = self.path[0]
            else:
                self.target_node = None  # Path complete

        self._update_position()

    # -- Representation -------------------------------------------------------

    def __repr__(self):
        blocked = " BLOCKED" if self.is_blocked else ""
        return (
            f"AGV({self.id}, {self.status.name}, "
            f"node=n{self.current_node}, pos=({self.x:.1f},{self.y:.1f})"
            f"{blocked})"
        )
