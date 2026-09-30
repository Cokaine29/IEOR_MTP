"""
2D Top-Down Visualization of the ACT Simulation.
=================================================
Generates an animated MP4/GIF of AGVs moving on the node network.
Shows: nodes, directed edges, AGVs (color-coded by status), QCs, Yard Blocks.

Usage:
    python simulation/utils/visualize_2d.py [replay_json_path]

Default: simulation/replays/greedy_replay.json
"""

import json
import sys
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.animation import FuncAnimation, FFMpegWriter, PillowWriter
import numpy as np


# AGV status colors
STATUS_COLORS = {
    "IDLE": "#888888",             # grey
    "TRAVELLING_EMPTY": "#FFD700", # gold
    "AT_QC_WAITING": "#FF8C00",    # orange
    "TRAVELLING_LOADED": "#DC143C",# crimson
    "AT_YARD_DROPPING": "#9370DB", # purple
}

STATUS_LABELS = {
    "IDLE": "Idle",
    "TRAVELLING_EMPTY": "Empty",
    "AT_QC_WAITING": "@ QC",
    "TRAVELLING_LOADED": "Loaded",
    "AT_YARD_DROPPING": "Drop",
}


def create_2d_animation(replay_path, output_path=None, fps=30, speed=5):
    """
    Create a 2D top-down animated visualization of the simulation.

    Args:
        replay_path: Path to the replay JSON file.
        output_path: Output file path (mp4 or gif). None = show plot.
        fps: Frames per second for the animation.
        speed: Playback speed multiplier (skip frames).
    """
    print(f"Loading replay: {replay_path}")
    with open(replay_path, "r") as f:
        data = json.load(f)

    layout = data["layout"]
    frames = data["frames"]
    meta = data["metadata"]

    width = layout["width"]
    height = layout["height"]
    quay_y = layout["quay_road_y"]
    yard_y = layout["yard_road_y"]

    # Parse nodes and edges
    nodes = {n["id"]: n for n in layout["nodes"]}
    edges = layout["edges"]

    # Subsample frames for speed
    frame_indices = list(range(0, len(frames), speed))

    # ── Set up figure ────────────────────────────────────────────
    fig, ax = plt.subplots(1, 1, figsize=(14, 7))
    fig.patch.set_facecolor("#0A0A1A")
    ax.set_facecolor("#0F0F2A")

    # Fixed elements (drawn once)
    _draw_static_elements(ax, layout, nodes, edges, width, height, quay_y, yard_y)

    # Dynamic elements (updated per frame)
    agv_dots = []
    agv_labels = []
    n_agvs = layout["n_agvs"]
    for i in range(n_agvs):
        dot, = ax.plot([], [], "o", markersize=10, markeredgecolor="white",
                       markeredgewidth=1.0, zorder=20)
        agv_dots.append(dot)
        label = ax.text(0, 0, str(i), fontsize=6, color="white",
                        ha="center", va="center", fontweight="bold", zorder=21)
        agv_labels.append(label)

    # Info text
    info_text = ax.text(0.02, 0.98, "", transform=ax.transAxes,
                        fontsize=9, color="white", verticalalignment="top",
                        fontfamily="monospace",
                        bbox=dict(boxstyle="round,pad=0.3", facecolor="#1a1a3e",
                                  edgecolor="#444", alpha=0.9))

    # Legend
    _draw_legend(ax)

    ax.set_xlim(-10, width + 10)
    ax.set_ylim(-10, height + 10)
    ax.set_aspect("equal")
    ax.invert_yaxis()  # y=0 at top (ship side), y=100 at bottom (yard side)
    ax.set_xlabel("X (meters)", color="white", fontsize=10)
    ax.set_ylabel("Y (meters)", color="white", fontsize=10)
    ax.tick_params(colors="white")
    for spine in ax.spines.values():
        spine.set_color("#333")

    # ── Animation update function ────────────────────────────────
    def update(frame_idx):
        frame = frames[frame_indices[frame_idx]]
        t = frame["time"]
        metrics = frame["metrics"]

        # Update AGV positions and colors
        for agv_data in frame["agvs"]:
            i = agv_data["id"]
            x = agv_data["x"]
            y = agv_data["y"]
            status = agv_data["status"]
            color = STATUS_COLORS.get(status, "white")

            agv_dots[i].set_data([x], [y])
            agv_dots[i].set_color(color)
            agv_labels[i].set_position((x, y))

            # Show container indicator
            if agv_data.get("has_container", False):
                agv_dots[i].set_markersize(12)
                agv_dots[i].set_marker("s")  # Square = carrying container
            else:
                agv_dots[i].set_markersize(10)
                agv_dots[i].set_marker("o")  # Circle = empty

        # Update info text
        info = (
            f"t = {t:.0f}s  |  "
            f"Completed: {metrics['completed_tasks']}  |  "
            f"Pending: {metrics['pending_tasks']}  |  "
            f"QC Idle: {metrics['qc_idle_total']:.0f}s  |  "
            f"Conflicts: {metrics['conflicts']}"
        )
        info_text.set_text(info)

        return agv_dots + agv_labels + [info_text]

    # ── Create animation ─────────────────────────────────────────
    anim = FuncAnimation(fig, update, frames=len(frame_indices),
                         interval=1000 / fps, blit=True)

    if output_path:
        ext = os.path.splitext(output_path)[1].lower()
        print(f"Saving animation to {output_path} ({len(frame_indices)} frames)...")
        if ext == ".gif":
            writer = PillowWriter(fps=fps)
        else:
            writer = FFMpegWriter(fps=fps, metadata={"title": f"ACT Sim - {meta['policy']}"})
        anim.save(output_path, writer=writer, dpi=100)
        size_mb = os.path.getsize(output_path) / (1024 * 1024)
        print(f"Saved: {output_path} ({size_mb:.1f} MB)")
    else:
        plt.show()

    plt.close(fig)
    return output_path


def _draw_static_elements(ax, layout, nodes, edges, width, height, quay_y, yard_y):
    """Draw the fixed terminal infrastructure."""

    # Ship zone (top)
    ship_rect = patches.FancyBboxPatch(
        (5, -5), width - 10, quay_y - 2,
        boxstyle="round,pad=2", facecolor="#1a2a4a", edgecolor="#2a5a8a",
        linewidth=1.5, alpha=0.5
    )
    ax.add_patch(ship_rect)
    ax.text(width / 2, 4, "VESSEL / SHIP", ha="center", va="center",
            fontsize=12, color="#4a8aca", fontweight="bold", alpha=0.7)

    # Yard storage zone (bottom)
    yard_rect = patches.FancyBboxPatch(
        (5, yard_y + 2), width - 10, height - yard_y - 5,
        boxstyle="round,pad=2", facecolor="#1a3a1a", edgecolor="#2a6a2a",
        linewidth=1.5, alpha=0.5
    )
    ax.add_patch(yard_rect)
    ax.text(width / 2, height - 5, "YARD STORAGE", ha="center", va="center",
            fontsize=12, color="#4aca4a", fontweight="bold", alpha=0.7)

    # Transport corridor
    ax.axhline(y=quay_y, color="#4a8aca", linewidth=2, linestyle="-", alpha=0.6,
               label="Quay Road (y=15)")
    ax.axhline(y=yard_y, color="#4aca4a", linewidth=2, linestyle="-", alpha=0.6,
               label="Yard Road (y=85)")

    # Draw directed edges (arrows)
    for edge in edges:
        fn = nodes[edge["from"]]
        tn = nodes[edge["to"]]
        dx = tn["x"] - fn["x"]
        dy = tn["y"] - fn["y"]
        ax.annotate("", xy=(tn["x"], tn["y"]), xytext=(fn["x"], fn["y"]),
                    arrowprops=dict(arrowstyle="-|>", color="#333", lw=0.8),
                    zorder=1)

    # Draw nodes
    for nid, node in nodes.items():
        if node["type"] == "QC":
            color = "#4a8aca"
            size = 120
            marker = "^"  # Triangle pointing up (toward ship)
            ax.text(node["x"], node["y"] + 5, f"QC{node['entity_id']}",
                    ha="center", fontsize=8, color="#4a8aca", fontweight="bold")
        elif node["type"] == "YARD":
            color = "#4aca4a"
            size = 120
            marker = "v"  # Triangle pointing down (toward yard)
            ax.text(node["x"], node["y"] - 5, f"YB{node['entity_id']}",
                    ha="center", fontsize=8, color="#4aca4a", fontweight="bold")
        else:
            color = "#555"
            size = 30
            marker = "o"

        ax.scatter(node["x"], node["y"], s=size, c=color, marker=marker,
                   edgecolors="white", linewidths=0.5, zorder=10, alpha=0.7)


def _draw_legend(ax):
    """Draw AGV status legend."""
    legend_x = 0.98
    legend_y = 0.98
    for i, (status, color) in enumerate(STATUS_COLORS.items()):
        label = STATUS_LABELS[status]
        ax.text(legend_x, legend_y - i * 0.05, f"  {label}",
                transform=ax.transAxes, fontsize=8, color=color,
                verticalalignment="top", ha="right", fontweight="bold")


def create_static_snapshot(replay_path, frame_idx=0, output_path=None):
    """Create a single-frame PNG snapshot of the simulation."""
    with open(replay_path, "r") as f:
        data = json.load(f)

    layout = data["layout"]
    frame = data["frames"][frame_idx]
    nodes = {n["id"]: n for n in layout["nodes"]}
    edges = layout["edges"]

    fig, ax = plt.subplots(1, 1, figsize=(14, 7))
    fig.patch.set_facecolor("#0A0A1A")
    ax.set_facecolor("#0F0F2A")

    _draw_static_elements(ax, layout, nodes, edges,
                          layout["width"], layout["height"],
                          layout["quay_road_y"], layout["yard_road_y"])

    # Draw AGVs
    for agv in frame["agvs"]:
        color = STATUS_COLORS.get(agv["status"], "white")
        marker = "s" if agv.get("has_container", False) else "o"
        ax.plot(agv["x"], agv["y"], marker, markersize=12, color=color,
                markeredgecolor="white", markeredgewidth=1.2, zorder=20)
        ax.text(agv["x"], agv["y"], str(agv["id"]), fontsize=6,
                color="white", ha="center", va="center", fontweight="bold", zorder=21)

    _draw_legend(ax)

    t = frame["time"]
    m = frame["metrics"]
    ax.set_title(
        f"t={t:.0f}s  |  Completed={m['completed_tasks']}  |  "
        f"QC Idle={m['qc_idle_total']:.0f}s  |  Conflicts={m['conflicts']}",
        color="white", fontsize=11
    )

    ax.set_xlim(-10, layout["width"] + 10)
    ax.set_ylim(-10, layout["height"] + 10)
    ax.set_aspect("equal")
    ax.invert_yaxis()
    ax.set_xlabel("X (meters)", color="white")
    ax.set_ylabel("Y (meters)", color="white")
    ax.tick_params(colors="white")
    for spine in ax.spines.values():
        spine.set_color("#333")

    plt.tight_layout()
    if output_path:
        plt.savefig(output_path, dpi=150, facecolor=fig.get_facecolor(),
                    bbox_inches="tight")
        print(f"Saved snapshot: {output_path}")
    else:
        plt.show()
    plt.close(fig)


# ── Main ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    replay = sys.argv[1] if len(sys.argv) > 1 else "simulation/replays/greedy_replay.json"

    # Generate a few key-frame snapshots
    for t_idx in [0, 250, 500, 750, 999]:
        out = f"simulation/replays/snapshot_t{t_idx}.png"
        create_static_snapshot(replay, frame_idx=t_idx, output_path=out)

    # Generate GIF animation (skip frames for speed)
    gif_path = "simulation/replays/simulation_2d.gif"
    create_2d_animation(replay, output_path=gif_path, fps=15, speed=10)
