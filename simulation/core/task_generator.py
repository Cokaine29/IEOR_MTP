import numpy as np
from dataclasses import dataclass
from typing import List

@dataclass
class Task:
    """
    Represents a single container movement task from a QC to a Yard Block.
    """
    id: int
    qc_id: int
    yard_block_id: int
    creation_time: float


class TaskGenerator:
    """
    Generates tasks based on stochastic models (Poisson arrivals) or deterministic schedules.
    """
    def __init__(self, n_qcs: int, n_yard_blocks: int, mode: str = "medium", np_random: np.random.Generator = None):
        self.n_qcs = n_qcs
        self.n_yard_blocks = n_yard_blocks
        self.mode = mode
        # Use provided generator or create a new one
        self.rng = np_random if np_random is not None else np.random.default_rng()
        
        # Arrival rates (lambda in tasks per minute) from simulation_parameters.md
        self.arrival_rates = {
            "deterministic": 0.0,  # Handled separately or fixed schedule
            "low": 0.2,
            "medium": 0.5,
            "high": 0.8
        }
        
        self.lam = self.arrival_rates.get(self.mode, 0.5)
        self.task_counter = 0

    def generate_initial_tasks(self, base_count: int = 5) -> List[Task]:
        """
        Generates an initial batch of tasks to populate the terminal at t=0.
        """
        tasks = []
        
        for qc_id in range(self.n_qcs):
            if self.mode == "deterministic":
                n_tasks = base_count
            else:
                n_tasks = self.rng.poisson(base_count)
                
            for _ in range(n_tasks):
                tasks.append(self._create_task(qc_id, 0.0))
                
        return tasks

    def step(self, dt: float, current_time: float) -> List[Task]:
        """
        Called every simulation step to potentially generate new tasks.
        """
        new_tasks = []
        if self.mode == "deterministic":
            # For deterministic, we might just rely on initial tasks 
            # or a pre-defined schedule. For now, no dynamic generation.
            return new_tasks
            
        # Convert lambda (tasks/min) to probability per step (dt)
        # Prob = 1 - exp(-lambda * dt_in_minutes)
        # Approximation for small dt: prob ≈ lambda * dt_in_minutes
        dt_minutes = dt / 60.0
        prob_per_qc = self.lam * dt_minutes
        
        for qc_id in range(self.n_qcs):
            if self.rng.random() < prob_per_qc:
                new_tasks.append(self._create_task(qc_id, current_time))
                
        return new_tasks
        
    def _create_task(self, qc_id: int, current_time: float) -> Task:
        """
        Helper to instantiate a Task object with a random yard destination.
        """
        self.task_counter += 1
        # Randomly assign a yard block destination
        yard_block_id = self.rng.integers(0, self.n_yard_blocks)
        
        return Task(
            id=self.task_counter,
            qc_id=qc_id,
            yard_block_id=yard_block_id,
            creation_time=current_time
        )
