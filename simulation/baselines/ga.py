"""
Genetic Algorithm Baseline — Offline AGV Dispatch Optimizer
===========================================================
Uses a Genetic Algorithm to find an optimized AGV dispatch schedule.

Unlike the Greedy baseline (myopic, one decision at a time), the GA
explores the full space of possible assignment sequences to find
globally better solutions.

Chromosome: A sequence of AGV IDs [a0, a1, a2, ...] where gene i
            specifies which AGV should be dispatched for the i-th
            dispatch decision during the simulation episode.

Fitness:    Maximize  -QC_idle - 0.5*conflicts - 10*unfinished + 2*completed
            (higher is better; perfect = 0)

GA search runs with a FIXED SEED so the same tasks appear in every
evaluation — this makes the fitness landscape deterministic and lets
the GA fairly compare chromosomes.

Literature:
    - GA for AGV scheduling: Hu et al. (2023), Liu et al. (2002)
    - Offline optimization baseline: Standard practice in RL papers

Usage:
    python simulation/baselines/ga.py
"""

import os
import sys
import random
import numpy as np
from typing import List, Tuple, Optional

# Allow running from D:\MTP directory
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from core.terminal import Terminal
from core.agv import AGVStatus
from utils.recorder import SimulationRecorder


# ── GA Hyperparameters ────────────────────────────────────────────────
POPULATION_SIZE = 50
N_GENERATIONS = 100
TOURNAMENT_K = 3
CROSSOVER_RATE = 0.8
MUTATION_RATE = 0.15
ELITE_COUNT = 2
CHROMOSOME_LENGTH = 60   # > max_total_tasks (50) to be safe
N_AGVS = 10
MAX_STEPS = 1000
SEED = 42                # Fixed seed for reproducible task sequence

CONFIG_PATH = "simulation/configs/config.yaml"


# ── Chromosome ────────────────────────────────────────────────────────

class GAChromosome:
    """A candidate dispatch schedule for the full simulation episode."""

    def __init__(self, genes: List[int] = None):
        if genes is not None:
            self.genes = list(genes)
        else:
            # Random initialization: each gene is a random AGV id
            self.genes = [random.randint(0, N_AGVS - 1)
                          for _ in range(CHROMOSOME_LENGTH)]
        self.fitness: float = float('-inf')

    def copy(self) -> 'GAChromosome':
        c = GAChromosome(genes=self.genes[:])
        c.fitness = self.fitness
        return c


# ── Simulation Evaluation ─────────────────────────────────────────────

def _nearest_idle_agv(terminal, task) -> Optional[int]:
    """Greedy fallback: pick nearest idle AGV to the task's QC."""
    idle = terminal.get_idle_agvs()
    if not idle:
        return None
    qc = terminal.qcs[task.qc_id]
    best_id, best_d = None, float('inf')
    for aid in idle:
        agv = terminal.agvs[aid]
        d = abs(agv.x - qc.x) + abs(agv.y - qc.y)
        if d < best_d:
            best_d = d
            best_id = aid
    return best_id


def evaluate_chromosome(chromosome: GAChromosome,
                        seed: int = SEED,
                        record: bool = False):
    """
    Run one full simulation episode using the chromosome's dispatch plan.

    Returns:
        fitness (float): higher is better
        terminal (Terminal): final simulation state
        recorder (SimulationRecorder | None): if record=True
    """
    # Fix seed so the exact same tasks appear every evaluation
    np.random.seed(seed)
    random.seed(seed)

    terminal = Terminal(config_path=CONFIG_PATH)
    terminal.reset()

    recorder = None
    if record:
        recorder = SimulationRecorder(terminal, policy_name="ga")
        recorder.capture()

    dispatch_idx = 0

    for step in range(1, MAX_STEPS + 1):
        # ── GA-guided dispatching ──
        while True:
            task = terminal.get_highest_priority_task()
            if task is None:
                break

            idle_agvs = terminal.get_idle_agvs()
            if not idle_agvs:
                break

            # Use chromosome gene to pick AGV
            if dispatch_idx < len(chromosome.genes):
                preferred = chromosome.genes[dispatch_idx]
                dispatch_idx += 1

                if preferred in idle_agvs:
                    agv_id = preferred
                else:
                    # Preferred AGV busy → greedy fallback
                    agv_id = _nearest_idle_agv(terminal, task)
            else:
                # Chromosome exhausted → greedy fallback
                agv_id = _nearest_idle_agv(terminal, task)

            if agv_id is None:
                break

            terminal.assign_agv_to_task(agv_id, task)

            if not terminal.get_idle_agvs() or not terminal.unassigned_tasks:
                break

        # ── Step simulation ──
        terminal.step()
        if record:
            recorder.capture()

        # ── Early termination ──
        all_idle = all(a.status == AGVStatus.IDLE for a in terminal.agvs)
        no_tasks = (len(terminal.pending_tasks) == 0 and
                    len(terminal.unassigned_tasks) == 0)
        if all_idle and no_tasks and terminal.completed_tasks > 0:
            break

    # ── Fitness ──
    qc_idle    = terminal.get_total_qc_idle_time()
    conflicts  = terminal.get_conflict_count()
    unfinished = len(terminal.pending_tasks) + len(terminal.unassigned_tasks)
    completed  = terminal.completed_tasks

    fitness = -qc_idle - 0.5 * conflicts - 10.0 * unfinished + 2.0 * completed

    chromosome.fitness = fitness
    return fitness, terminal, recorder


# ── GA Operators ──────────────────────────────────────────────────────

def tournament_select(population: List[GAChromosome],
                      k: int = TOURNAMENT_K) -> GAChromosome:
    """Select the best individual from k random candidates."""
    candidates = random.sample(population, min(k, len(population)))
    return max(candidates, key=lambda c: c.fitness).copy()


def two_point_crossover(p1: GAChromosome,
                        p2: GAChromosome) -> Tuple[GAChromosome, GAChromosome]:
    """Two-point crossover between two parents."""
    if random.random() > CROSSOVER_RATE:
        return p1.copy(), p2.copy()

    n = len(p1.genes)
    pt1 = random.randint(0, n - 2)
    pt2 = random.randint(pt1 + 1, n - 1)

    c1_genes = p1.genes[:pt1] + p2.genes[pt1:pt2] + p1.genes[pt2:]
    c2_genes = p2.genes[:pt1] + p1.genes[pt1:pt2] + p2.genes[pt2:]

    return GAChromosome(c1_genes), GAChromosome(c2_genes)


def mutate(chromosome: GAChromosome) -> GAChromosome:
    """Swap two random genes + randomize one gene."""
    if random.random() > MUTATION_RATE:
        return chromosome

    c = chromosome.copy()
    n = len(c.genes)

    # Swap two positions
    i, j = random.sample(range(n), 2)
    c.genes[i], c.genes[j] = c.genes[j], c.genes[i]

    # Randomize one gene
    k = random.randint(0, n - 1)
    c.genes[k] = random.randint(0, N_AGVS - 1)

    c.fitness = float('-inf')  # Mark as unevaluated
    return c


# ── Main GA Loop ──────────────────────────────────────────────────────

def run_ga() -> GAChromosome:
    """Run the full Genetic Algorithm and return the best chromosome."""
    random.seed(SEED)

    print("=" * 60)
    print("  GENETIC ALGORITHM — AGV Dispatch Optimizer")
    print("=" * 60)
    print(f"  Population:        {POPULATION_SIZE}")
    print(f"  Generations:       {N_GENERATIONS}")
    print(f"  Chromosome length: {CHROMOSOME_LENGTH}")
    print(f"  Crossover rate:    {CROSSOVER_RATE}")
    print(f"  Mutation rate:     {MUTATION_RATE}")
    print(f"  Seed:              {SEED}")
    print()

    # ── 1. Initialize population ──
    print("  Initializing & evaluating population...")
    population: List[GAChromosome] = []
    for i in range(POPULATION_SIZE):
        chrom = GAChromosome()
        evaluate_chromosome(chrom)
        population.append(chrom)
        if (i + 1) % 10 == 0:
            print(f"    {i + 1}/{POPULATION_SIZE} evaluated")

    best_ever = max(population, key=lambda c: c.fitness).copy()

    print(f"\n  Initial best fitness: {best_ever.fitness:.1f}")
    print()
    print(f"  {'Gen':>5} | {'Best':>10} | {'Avg':>10} | {'Worst':>10} | {'Best Ever':>10}")
    print(f"  {'-' * 5}-+-{'-' * 10}-+-{'-' * 10}-+-{'-' * 10}-+-{'-' * 10}")

    # ── 2. Evolution loop ──
    for gen in range(1, N_GENERATIONS + 1):
        new_pop: List[GAChromosome] = []

        # Elitism: carry forward top individuals unchanged
        ranked = sorted(population, key=lambda c: c.fitness, reverse=True)
        for i in range(ELITE_COUNT):
            new_pop.append(ranked[i].copy())

        # Fill rest with offspring
        while len(new_pop) < POPULATION_SIZE:
            p1 = tournament_select(population)
            p2 = tournament_select(population)
            c1, c2 = two_point_crossover(p1, p2)
            c1 = mutate(c1)
            c2 = mutate(c2)
            new_pop.append(c1)
            if len(new_pop) < POPULATION_SIZE:
                new_pop.append(c2)

        # Evaluate new (unevaluated) individuals
        for chrom in new_pop:
            if chrom.fitness == float('-inf'):
                evaluate_chromosome(chrom)

        population = new_pop

        # Track best
        gen_best = max(population, key=lambda c: c.fitness)
        if gen_best.fitness > best_ever.fitness:
            best_ever = gen_best.copy()

        # Report
        if gen % 10 == 0 or gen == 1:
            fits = [c.fitness for c in population]
            print(
                f"  {gen:5d} | {max(fits):10.1f} | {np.mean(fits):10.1f} "
                f"| {min(fits):10.1f} | {best_ever.fitness:10.1f}"
            )

    print(f"\n  [OK] Evolution complete!")
    print(f"  Best fitness: {best_ever.fitness:.1f}")
    return best_ever


# ── Entry Point ───────────────────────────────────────────────────────

def main():
    best = run_ga()

    # Re-run best chromosome WITH recording for webapp replay
    print("\n  Re-running best chromosome with full recording...")
    fitness, terminal, recorder = evaluate_chromosome(best, record=True)

    # ── Print detailed results ──
    print()
    print("=" * 60)
    print("  GA BASELINE RESULTS")
    print("=" * 60)
    print(f"  Total simulation time:  {terminal.current_time:.0f} seconds")
    print(f"  Tasks completed:        {terminal.completed_tasks}")
    remaining = len(terminal.pending_tasks) + len(terminal.unassigned_tasks)
    print(f"  Tasks remaining:        {remaining}")
    print(f"  Total QC idle time:     {terminal.get_total_qc_idle_time():.1f} seconds")
    print(f"  Avg QC idle per crane:  {terminal.get_total_qc_idle_time() / terminal.n_qcs:.1f} seconds")
    print(f"  Fitness:                {fitness:.1f}")
    print()

    print("  AGV Final States:")
    for agv in terminal.agvs:
        print(f"    AGV {agv.id}: {agv.status.name} at ({agv.x:.1f}, {agv.y:.1f})")
    print()

    print("  QC Performance:")
    for qc in terminal.qcs:
        print(f"    QC {qc.id}: Idle={qc.accumulated_idle_time:.1f}s, "
              f"Queue={len(qc.tasks_pending)}")
    print("=" * 60)

    # Save replay
    output_dir = "simulation/replays"
    os.makedirs(output_dir, exist_ok=True)
    replay_path = os.path.join(output_dir, "ga_replay.json")
    recorder.save(replay_path)

    print(f"\n  Replay saved to: {replay_path}")
    print(f"  Best chromosome (first 20 genes): {best.genes[:20]}")
    print()


if __name__ == "__main__":
    main()
