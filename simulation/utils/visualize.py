import os
import sys
import matplotlib
matplotlib.use('TkAgg')  # Force Tkinter backend for Windows GUI window
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.animation as animation
import matplotlib.lines as mlines
import numpy as np

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from core.terminal import Terminal
from core.agv import AGVStatus

# ── Color map for each AGV status ──────────────────────────────────────────
STATUS_COLORS = {
    AGVStatus.IDLE:              '#95a5a6',  # Grey
    AGVStatus.TRAVELLING_EMPTY:  '#f1c40f',  # Yellow
    AGVStatus.AT_QC_WAITING:     '#e67e22',  # Orange
    AGVStatus.TRAVELLING_LOADED: '#e74c3c',  # Red
    AGVStatus.AT_YARD_DROPPING:  '#8e44ad',  # Purple
}

def run_visualizer():
    term = Terminal(config_path="simulation/configs/config.yaml")
    term.reset()

    W, H = term.width, term.height

    # ── Figure Setup ────────────────────────────────────────────────────────
    fig, ax = plt.subplots(figsize=(12, 7))
    fig.patch.set_facecolor('#1a1a2e')
    ax.set_facecolor('#16213e')
    ax.set_xlim(-5, W + 5)
    ax.set_ylim(-15, H + 15)
    ax.set_aspect('equal')
    ax.set_title("Automated Container Terminal — AGV Traffic Simulation",
                 color='white', fontsize=14, pad=12)
    ax.tick_params(colors='#aaaaaa')
    for spine in ax.spines.values():
        spine.set_edgecolor('#444444')

    # ── Draw Road Network ───────────────────────────────────────────────────
    # Vertical perpendicular lanes — one per QC/YB column
    for yb in term.yard_dropoffs:
        ax.axvline(x=yb["x"], color='#2c3e50', linewidth=2.5,
                   linestyle='--', alpha=0.4, zorder=1)
    # Also draw perpendicular lanes at each QC x position
    for qc in term.qcs:
        ax.axvline(x=qc.x, color='#2c3e50', linewidth=2.5,
                   linestyle='--', alpha=0.25, zorder=1)

    # Quay Road — loaded AGVs cross here (QC → Yard direction)
    ax.axhline(y=term.quay_road_y, color='#e74c3c', linewidth=3,
               linestyle='-', alpha=0.35, zorder=2)
    ax.text(3, term.quay_road_y + 2, "▶ QUAY ROAD  (loaded: QC→Yard)",
            color='#e74c3c', fontsize=7, alpha=0.8)

    # Yard Road — empty AGVs cross here (Yard → QC direction)
    ax.axhline(y=term.yard_road_y, color='#3498db', linewidth=3,
               linestyle='-', alpha=0.35, zorder=2)
    ax.text(3, term.yard_road_y + 2, "◀ YARD ROAD  (empty: Yard→QC)",
            color='#3498db', fontsize=7, alpha=0.8)


    # ── Draw Quay (ship side) ───────────────────────────────────────────────
    ship_bar = plt.Rectangle((-5, -12), W + 10, 10,
                              color='#0d3b66', zorder=0)
    ax.add_patch(ship_bar)
    ax.text(W / 2, -7, "⚓  VESSEL / QUAY SIDE",
            ha='center', va='center', color='#3498db',
            fontsize=10, fontweight='bold')

    # ── Draw Yard Area ──────────────────────────────────────────────────────
    yard_bar = plt.Rectangle((-5, H + 2), W + 10, 12,
                              color='#1d3d1d', zorder=0)
    ax.add_patch(yard_bar)
    ax.text(W / 2, H + 8, "🏗  YARD AREA",
            ha='center', va='center', color='#2ecc71',
            fontsize=10, fontweight='bold')

    # ── Draw QC Markers ────────────────────────────────────────────────────
    qc_artists = []
    for qc in term.qcs:
        marker, = ax.plot(qc.x, qc.y, marker='s', markersize=16,
                          color='#3498db', zorder=5,
                          markeredgecolor='white', markeredgewidth=1.5)
        ax.text(qc.x, qc.y - 5, f"QC{qc.id}", ha='center',
                color='#3498db', fontsize=8)
        qc_artists.append(marker)

    # ── Draw Yard Block Markers ─────────────────────────────────────────────
    for i, yb in enumerate(term.yard_dropoffs):
        ax.plot(yb["x"], yb["y"], marker='^', markersize=14,
                color='#2ecc71', zorder=5,
                markeredgecolor='white', markeredgewidth=1.5)
        ax.text(yb["x"], yb["y"] + 4, f"YB{i}", ha='center',
                color='#2ecc71', fontsize=8)

    # ── Draw AGVs ───────────────────────────────────────────────────────────
    agv_dots = []
    agv_labels = []
    for agv in term.agvs:
        dot, = ax.plot(agv.x, agv.y, 'o', markersize=10, zorder=10,
                       color=STATUS_COLORS[agv.status],
                       markeredgecolor='white', markeredgewidth=0.8)
        lbl = ax.text(agv.x, agv.y + 3, str(agv.id),
                      ha='center', color='white', fontsize=6, zorder=11)
        agv_dots.append(dot)
        agv_labels.append(lbl)

    # ── Draw AGV Path lines ─────────────────────────────────────────────────
    agv_path_lines = []
    for _ in term.agvs:
        line, = ax.plot([], [], color='#f39c12', linewidth=0.8,
                        alpha=0.4, zorder=4)
        agv_path_lines.append(line)

    # ── QC Idle Time bars ───────────────────────────────────────────────────
    qc_idle_bars = []
    for qc in term.qcs:
        bar = ax.barh(y=-3, width=0, left=qc.x - 3, height=1.5,
                      color='#e74c3c', alpha=0.7, zorder=6)
        qc_idle_bars.append(bar)

    # ── Stats Text ──────────────────────────────────────────────────────────
    stats = ax.text(2, H - 5, '', color='white', fontsize=9,
                    va='top', zorder=20,
                    bbox=dict(facecolor='#0a0a1a', alpha=0.7,
                              edgecolor='#444', boxstyle='round,pad=0.4'))

    # ── Legend ──────────────────────────────────────────────────────────────
    legend_patches = [
        mpatches.Patch(color=c, label=s.name.replace('_', ' ').title())
        for s, c in STATUS_COLORS.items()
    ]
    ax.legend(handles=legend_patches, loc='lower right',
              facecolor='#1a1a2e', edgecolor='#444',
              labelcolor='white', fontsize=8)

    # ── Update Function ─────────────────────────────────────────────────────
    def update(frame):
        # Greedy dispatcher
        idle_agvs = term.get_idle_agvs()
        while idle_agvs:
            task = term.get_highest_priority_task()
            if task is None:
                break
            agv_id = idle_agvs.pop(0)
            term.assign_agv_to_task(agv_id, task)

        term.step()

        # Update each AGV dot, label, and path line
        for i, agv in enumerate(term.agvs):
            color = STATUS_COLORS[agv.status]
            agv_dots[i].set_data([agv.x], [agv.y])
            agv_dots[i].set_color(color)
            agv_labels[i].set_position((agv.x, agv.y + 3))

            # Draw the planned L-shaped path
            if agv.path:
                px = [agv.x] + [wp[0] for wp in agv.path]
                py = [agv.y] + [wp[1] for wp in agv.path]
                agv_path_lines[i].set_data(px, py)
            else:
                agv_path_lines[i].set_data([], [])

        # Update QC idle bars (width proportional to idle time)
        for j, qc in enumerate(term.qcs):
            for bar_container in qc_idle_bars[j]:
                idle_scaled = min(qc.accumulated_idle_time / 100.0 * 6, 6)
                bar_container.set_width(idle_scaled)
                bar_container.set_x(qc.x - idle_scaled / 2)

        # Update stats
        qc_idle_total = sum(qc.accumulated_idle_time for qc in term.qcs)
        status_counts = {s.name: 0 for s in AGVStatus}
        for agv in term.agvs:
            status_counts[agv.status.name] += 1

        stats.set_text(
            f"⏱  Time:  {term.current_time:.0f}s\n"
            f"✅  Done:  {term.completed_tasks} tasks\n"
            f"📋  Queue: {len(term.pending_tasks)} tasks\n"
            f"🔴  QC Idle: {qc_idle_total:.0f}s\n"
            f"───────────────\n"
            f"🟡 Empty Travel: {status_counts['TRAVELLING_EMPTY']}\n"
            f"🟠 At QC:        {status_counts['AT_QC_WAITING']}\n"
            f"🔴 Loaded:       {status_counts['TRAVELLING_LOADED']}\n"
        )

        return agv_dots + agv_labels + agv_path_lines + [stats]

    ani = animation.FuncAnimation(fig, update, frames=2000,
                                  interval=30, blit=False)
    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    run_visualizer()
