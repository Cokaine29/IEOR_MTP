"""
TerminalNetwork - Directed graph model of the ACT road network.
================================================================
Based on Lou et al. (2023) "Digital-Twin-Driven AGV Scheduling and Routing"
(Mathematics, Vol. 11, No. 12, Article 2678)

The terminal is modeled as a directed graph where:
- Nodes represent physical locations (QC positions, yard block I/O points, intersections)
- Edges represent one-way road segments AGVs can travel on
- The quay corridor runs left -> right (one-way)
- The yard corridor runs right -> left (one-way, opposite direction)
- Perpendicular lanes connect the two corridors (bidirectional)

Node layout for 4 QCs, 4 Yard Blocks (22 nodes, ~42 directed edges):

SHIP (y=0)
============================================================================
QUAY CORRIDOR (y=15, one-way -->):
 n0 --> n1 --> n2(QC0) --> n3 --> n4(QC1) --> n5 --> n6(QC2) --> n7 --> n8(QC3) --> n9 --> n10
  |      |       |          |       |          |       |          |       |          |      |
  |      |   perpendicular  |   connecting     |    lanes         |    (bidir.)      |      |
  |      |       |          |       |          |       |          |       |          |      |
n21 <-- n20 <-- n19(YB0) <-- n18 <-- n17(YB1) <-- n16 <-- n15(YB2) <-- n14 <-- n13(YB3) <-- n12 <-- n11
YARD CORRIDOR (y=85, one-way <--):
============================================================================
YARD STORAGE (y=100)

References:
  - Lou et al. (2023): 18-node, 44-edge network for 3 QCs
  - Liu et al. (2002): Two-road directional separation
  - Hu et al. (2023): Node-network with driving rules
"""

import heapq
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple, Set
from enum import Enum


class NodeType(Enum):
    QC = "QC"                      # Quay Crane loading position
    YARD = "YARD"                  # Yard Block I/O point
    INTERSECTION = "INTERSECTION"  # Road intersection / corridor node


@dataclass
class Node:
    """A physical location in the terminal network."""
    id: int
    x: float           # meters from left edge
    y: float           # meters from quay (0=ship, 100=yard back)
    node_type: NodeType
    entity_id: Optional[int] = None   # QC id or Yard Block id (if applicable)
    occupied_by: Optional[int] = None # AGV id currently at this node, or None

    def __repr__(self):
        label = self.node_type.value
        if self.entity_id is not None:
            label += f"({self.entity_id})"
        occ = f", AGV={self.occupied_by}" if self.occupied_by is not None else ""
        return f"Node(n{self.id}, {label}, ({self.x:.0f},{self.y:.0f}){occ})"


@dataclass
class Edge:
    """A directed road segment between two nodes."""
    from_node_id: int
    to_node_id: int
    distance: float   # meters


class TerminalNetwork:
    """
    Directed graph representing the ACT road network.

    Builds a network of nodes and one-way edges that AGVs must follow.
    Provides Dijkstra shortest-path routing and node-level conflict tracking.
    """

    def __init__(self, config: dict):
        self.config = config
        self.nodes: Dict[int, Node] = {}
        self.adjacency: Dict[int, List[Edge]] = {}
        self._occupant_counts: Dict[int, Set[int]] = {}  # node_id -> set of AGV ids

        # Quick lookups
        self.qc_nodes: Dict[int, int] = {}     # qc_id -> node_id
        self.yard_nodes: Dict[int, int] = {}   # yard_block_id -> node_id
        self.quay_node_ids: List[int] = []      # ordered left to right
        self.yard_node_ids: List[int] = []      # ordered right to left

        self._build_network()

    def _build_network(self):
        """Construct the 22-node directed graph."""
        width = self.config["terminal"]["grid_width"]
        n_qcs = self.config["terminal"]["n_qcs"]
        n_ybs = self.config["terminal"]["n_yard_blocks"]
        quay_y = float(self.config["terminal"]["quay_road_y"])
        yard_y = float(self.config["terminal"]["yard_road_y"])
        node_spacing = float(self.config.get("network", {}).get("node_spacing", 20))

        # QC and YB x-positions (evenly spaced)
        qc_spacing = width / (n_qcs + 1)
        qc_x_positions = [(i + 1) * qc_spacing for i in range(n_qcs)]

        yb_spacing = width / (n_ybs + 1)
        yb_x_positions = [(i + 1) * yb_spacing for i in range(n_ybs)]

        # Generate x-coordinates for corridor nodes
        n_nodes_per_corridor = int(width / node_spacing) + 1
        corridor_xs = [i * node_spacing for i in range(n_nodes_per_corridor)]

        node_id = 0

        # ── Quay Corridor Nodes (y = quay_y, left to right) ──────────────
        for x in corridor_xs:
            # Check if this x is a QC position
            qc_id = None
            for i, cx in enumerate(qc_x_positions):
                if abs(x - cx) < 0.1:
                    qc_id = i
                    break

            ntype = NodeType.QC if qc_id is not None else NodeType.INTERSECTION
            node = Node(id=node_id, x=x, y=quay_y, node_type=ntype, entity_id=qc_id)
            self.nodes[node_id] = node
            self.quay_node_ids.append(node_id)
            if qc_id is not None:
                self.qc_nodes[qc_id] = node_id
            node_id += 1

        # ── Yard Corridor Nodes (y = yard_y, right to left) ──────────────
        for x in reversed(corridor_xs):
            # Check if this x is a Yard Block position
            yb_id = None
            for i, yx in enumerate(yb_x_positions):
                if abs(x - yx) < 0.1:
                    yb_id = i
                    break

            ntype = NodeType.YARD if yb_id is not None else NodeType.INTERSECTION
            node = Node(id=node_id, x=x, y=yard_y, node_type=ntype, entity_id=yb_id)
            self.nodes[node_id] = node
            self.yard_node_ids.append(node_id)
            if yb_id is not None:
                self.yard_nodes[yb_id] = node_id
            node_id += 1

        # ── Build Edges ──────────────────────────────────────────────────

        # Initialize adjacency lists
        for nid in self.nodes:
            self.adjacency[nid] = []

        # Quay corridor: one-way left -> right
        for i in range(len(self.quay_node_ids) - 1):
            a = self.quay_node_ids[i]
            b = self.quay_node_ids[i + 1]
            dist = abs(self.nodes[a].x - self.nodes[b].x)
            self.adjacency[a].append(Edge(a, b, dist))

        # Yard corridor: one-way right -> left
        # yard_node_ids is already in descending x order (200, 180, ... 0)
        for i in range(len(self.yard_node_ids) - 1):
            a = self.yard_node_ids[i]
            b = self.yard_node_ids[i + 1]
            dist = abs(self.nodes[a].x - self.nodes[b].x)
            self.adjacency[a].append(Edge(a, b, dist))

        # Perpendicular lanes: bidirectional (quay <-> yard at same x)
        for qi in self.quay_node_ids:
            qx = self.nodes[qi].x
            for yi in self.yard_node_ids:
                if abs(self.nodes[yi].x - qx) < 0.1:
                    # ONLY create a crossroad if both nodes are INTERSECTION nodes.
                    # This prevents cross-traffic from dumping directly into a QC loading bay or Yard swap area!
                    if self.nodes[qi].node_type == NodeType.INTERSECTION and self.nodes[yi].node_type == NodeType.INTERSECTION:
                        dist = abs(self.nodes[qi].y - self.nodes[yi].y)
                        # Quay -> Yard (for loaded AGVs heading to yard)
                        self.adjacency[qi].append(Edge(qi, yi, dist))
                        # Yard -> Quay (for empty AGVs heading to QC)
                        self.adjacency[yi].append(Edge(yi, qi, dist))
                    break

    # ── Pathfinding ───────────────────────────────────────────────────────

    def shortest_path(self, from_node: int, to_node: int) -> Tuple[List[int], float]:
        """
        Dijkstra's shortest path on the directed graph.

        Returns:
            (path, distance) where path is a list of node IDs from source to dest.
            Returns ([], inf) if no path exists.
        """
        if from_node == to_node:
            return [from_node], 0.0

        dist = {nid: float("inf") for nid in self.nodes}
        prev = {nid: None for nid in self.nodes}
        dist[from_node] = 0.0
        pq = [(0.0, from_node)]

        while pq:
            d, u = heapq.heappop(pq)
            if d > dist[u]:
                continue
            if u == to_node:
                break
            for edge in self.adjacency[u]:
                v = edge.to_node_id
                new_dist = d + edge.distance
                if new_dist < dist[v]:
                    dist[v] = new_dist
                    prev[v] = u
                    heapq.heappush(pq, (new_dist, v))

        if dist[to_node] == float("inf"):
            return [], float("inf")

        # Reconstruct path
        path = []
        current = to_node
        while current is not None:
            path.append(current)
            current = prev[current]
        path.reverse()
        return path, dist[to_node]

    # ── Edge Queries ──────────────────────────────────────────────────────

    def get_edge_distance(self, from_node: int, to_node: int) -> float:
        """Get the distance of a direct edge between two adjacent nodes."""
        for edge in self.adjacency[from_node]:
            if edge.to_node_id == to_node:
                return edge.distance
        return float("inf")

    def has_edge(self, from_node: int, to_node: int) -> bool:
        return any(e.to_node_id == to_node for e in self.adjacency[from_node])

    # ── Node Occupancy (Conflict Tracking) ────────────────────────────────

    def is_node_occupied(self, node_id: int) -> bool:
        """
        Check if a node would physically block an incoming AGV.

        Design Decision (matching our dispatching focus):
        -------------------------------------------------
        We do NOT hard-block AGVs at nodes. Instead, we TRACK congestion
        and penalize it via the RL reward function (beta * conflict_count).

        Why? Our thesis solves DISPATCHING (which AGV to which QC), not
        PATH PLANNING (collision-free routing). Hard-blocking causes
        deadlocks with 10 AGVs on a 22-node network. All published
        dispatching papers (Yang 2025, Zheng 2022) use soft conflict
        penalties, not hard collision avoidance.

        Full collision avoidance is Phase 5 (MAPPO multi-agent).
        """
        return False  # Soft conflicts -- tracked, not enforced

    def get_node_occupant_count(self, node_id: int) -> int:
        """Get the number of AGVs currently at a node (for congestion tracking)."""
        return len(self._occupant_counts.get(node_id, set()))

    def occupy_node(self, node_id: int, agv_id: int):
        """Mark a node as occupied by an AGV."""
        self.nodes[node_id].occupied_by = agv_id
        if node_id not in self._occupant_counts:
            self._occupant_counts[node_id] = set()
        self._occupant_counts[node_id].add(agv_id)

    def release_node(self, node_id: int, agv_id: int):
        """Release a node (only if it's occupied by the specified AGV)."""
        if self.nodes[node_id].occupied_by == agv_id:
            self.nodes[node_id].occupied_by = None
        if node_id in self._occupant_counts:
            self._occupant_counts[node_id].discard(agv_id)

    def release_all_for_agv(self, agv_id: int):
        """Release all nodes occupied by a specific AGV."""
        for node in self.nodes.values():
            if node.occupied_by == agv_id:
                node.occupied_by = None
        for nid in self._occupant_counts:
            self._occupant_counts[nid].discard(agv_id)

    # ── Convenience Lookups ───────────────────────────────────────────────

    def get_qc_node_id(self, qc_id: int) -> int:
        """Get the node ID for a specific Quay Crane."""
        return self.qc_nodes[qc_id]

    def get_yard_node_id(self, yard_block_id: int) -> int:
        """Get the node ID for a specific Yard Block I/O point."""
        return self.yard_nodes[yard_block_id]

    def get_nearest_node(self, x: float, y: float) -> int:
        """Find the nearest node to a given (x, y) position."""
        best_id = 0
        best_dist = float("inf")
        for nid, node in self.nodes.items():
            d = abs(node.x - x) + abs(node.y - y)
            if d < best_dist:
                best_dist = d
                best_id = nid
        return best_id

    def get_node_count(self) -> int:
        return len(self.nodes)

    def get_edge_count(self) -> int:
        return sum(len(edges) for edges in self.adjacency.values())

    # ── Debug ─────────────────────────────────────────────────────────────

    def __repr__(self):
        n = self.get_node_count()
        e = self.get_edge_count()
        return (
            f"TerminalNetwork({n} nodes, {e} edges, "
            f"{len(self.qc_nodes)} QCs, {len(self.yard_nodes)} YBs)"
        )

    def print_network(self):
        """Print a human-readable summary of the network."""
        print(f"=== {self} ===")
        print(f"  Quay corridor: {len(self.quay_node_ids)} nodes (left->right)")
        print(f"  Yard corridor: {len(self.yard_node_ids)} nodes (right->left)")
        print()
        print("  QC Nodes:")
        for qc_id, nid in sorted(self.qc_nodes.items()):
            n = self.nodes[nid]
            print(f"    QC {qc_id} -> n{nid} at ({n.x:.0f}, {n.y:.0f})")
        print("  Yard Nodes:")
        for yb_id, nid in sorted(self.yard_nodes.items()):
            n = self.nodes[nid]
            print(f"    YB {yb_id} -> n{nid} at ({n.x:.0f}, {n.y:.0f})")
        print()
        print("  Sample paths:")
        for qc_id in self.qc_nodes:
            for yb_id in self.yard_nodes:
                qn = self.qc_nodes[qc_id]
                yn = self.yard_nodes[yb_id]
                path, dist = self.shortest_path(qn, yn)
                node_str = " -> ".join(f"n{p}" for p in path)
                print(f"    QC{qc_id} -> YB{yb_id}: {dist:.0f}m via {node_str}")
            break  # Just show paths from QC0
