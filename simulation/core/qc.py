class QuayCrane:
    """
    Represents a Quay Crane (QC) that unloads containers from vessels.
    """
    def __init__(self, qc_id: int, x: float, y: float):
        self.id = qc_id
        
        # Position (handoff point for AGVs)
        self.x = x
        self.y = y
        
        # Status tracking
        self.is_working = False
        self.is_idle_waiting_agv = True  # The critical metric we want to minimize!
        
        # Task queue tracking
        self.tasks_pending = [] # List of dictionary/objects representing tasks
        self.agvs_en_route = [] # List of AGV IDs assigned to this QC
        
        # Timing
        self.time_until_next_ready = 0.0
        self.accumulated_idle_time = 0.0

    def add_task(self, task):
        """
        Adds a new container task to the QC's queue.
        """
        self.tasks_pending.append(task)
        # If the crane was doing nothing, it can start working immediately
        if not self.is_working and self.is_idle_waiting_agv and len(self.tasks_pending) > 0:
             # Logic for starting handling will be in terminal.py step function
             pass

    def start_handling(self, handling_time: float):
        """
        Starts processing a container from the ship to the handoff point.
        """
        if len(self.tasks_pending) == 0:
            raise ValueError(f"QC {self.id} cannot start handling: no tasks pending.")
            
        self.is_working = True
        self.is_idle_waiting_agv = False
        self.time_until_next_ready = handling_time

    def finish_handling(self):
        """
        Container is now at the handoff point waiting for an AGV.
        """
        self.is_working = False
        self.is_idle_waiting_agv = True
        self.time_until_next_ready = 0.0

    def handoff_to_agv(self, agv_id: int):
        """
        An AGV picks up the container. 
        """
        if not self.is_idle_waiting_agv:
            raise ValueError(f"QC {self.id} is not ready to handoff.")
            
        if len(self.tasks_pending) == 0:
             raise ValueError(f"QC {self.id} has no tasks to handoff.")
             
        # Remove task from queue and AGV from en route list
        task = self.tasks_pending.pop(0)
        if agv_id in self.agvs_en_route:
            self.agvs_en_route.remove(agv_id)
            
        return task

    def step(self, dt: float):
        """
        Advances the QC's internal clock by dt seconds.
        """
        if self.is_working and self.time_until_next_ready > 0:
            self.time_until_next_ready = max(0.0, self.time_until_next_ready - dt)
            if self.time_until_next_ready == 0:
                self.finish_handling()
                
        # If it's waiting for an AGV but has tasks, accumulate idle time
        if self.is_idle_waiting_agv and len(self.tasks_pending) > 0:
            self.accumulated_idle_time += dt

    def __repr__(self):
        status = "Working" if self.is_working else "Waiting for AGV"
        return f"QC({self.id}, Status:{status}, Queue:{len(self.tasks_pending)}, IdleTime:{self.accumulated_idle_time:.1f}s)"
