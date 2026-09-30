# Inventory-based Dispatching of Automated Guided Vehicles on Container Terminals
**Authors:** Dirk Briskorn, Andreas Drexl, Sönke Hartmann  
**Journal:** OR Spectrum (2006)  
**Methodology:** Exact Algorithm & Priority Heuristic (Inventory vs Due-Time formulations)  

## 1. The Core Motivation: The Fallacy of Time Estimates
This paper represents a massive paradigm shift in the literature. While previous papers (like Kim & Bae, 2004) spent all their effort building mathematical models based on exact time estimates ($s_i^k$ and $y_i^k$), Briskorn et al. completely reject this premise. 

They argue that an alternative formulation is necessary because:
> *"estimates of driving times, completion times, due times and tardiness... are often highly unreliable in practice and do not allow for accurate planning."*

**Thesis Application:** This is an incredibly powerful citation for our thesis. Mathematical models fail in real-world ports because they rely on deterministic time estimates that immediately break down due to traffic and crane delays. Our DRL agent completely bypasses this limitation. By mapping *state representations* directly to *dispatching actions*, the neural network learns to react to the terminal's stochastic flow implicitly, without ever needing an explicit, fragile mathematical time estimate.

## 2. Terminal Layout (Altenwerder, Hamburg)
Unlike theoretical papers, this study is based on a real, highly automated terminal: the **HHLA Container Terminal Altenwerder (CTA)** in Hamburg, Germany. 

![Figure 1: Layout of the container terminal](/literature/briskorn_2006/figure1.png)
*Figure 1: Layout of the container terminal*

The layout features:
- **Perpendicular Stacking:** Blocks are perpendicular to the quay.
- **Dedicated Handover Lanes:** Notice in Figure 1 how the AGVs have dedicated buffer/handover lanes at the ends of the yard blocks to interact with the Automated Stacking Cranes (which we refer to as AYCs). 
- **AGV Buffers:** There are specific areas marked as "AGVs waiting in buffer" under the Quay Cranes. 

## 3. Asymmetric Precedence Constraints
The authors make a very important distinction regarding the sequence of operations:
- **Loading Operations:** There are strict precedence relations. The ship's stowage plan dictates that container $i$ *must* arrive at the Quay Crane before container $j$.
- **Discharging Operations:** There are **no** precedence relations. The Quay Crane simply pulls containers off the ship as fast as possible, and AGVs can take them to the yard in whatever order they come off.

**Thesis Application:** This is a crucial rule for coding our DRL Environment's **Action Masking**. When the agent selects an action (assigning a task to an AGV), it must be restricted by these rules. The agent is forced to follow the strict sequence for loading tasks, but it has total freedom to assign any available discharging task to any AGV.

## 4. Dynamic Replanning and Provisional Assignments
The control system operates in real-time. Instead of generating a schedule for the whole day, the system assigns $n$ urgent jobs to $n$ available (or soon-to-be available) AGVs. 

However, they use a clever dynamic rule:
- If a job is assigned to an AGV that is **currently available**, the assignment is **fixed**, and the AGV immediately starts driving.
- If a job is assigned to an AGV that is **not yet available** (i.e., it is finishing another job), the assignment is **provisional**. When the next event occurs in the simulation, that provisional assignment is thrown out and re-calculated based on updated data.

**Thesis Application:** This rigorously validates the **Vehicle-Initiated** dispatching architecture we extracted from Egbelu (1984). Pre-assigning tasks to busy AGVs is useless in a stochastic environment because conditions change before the AGV even finishes its current task. Our DRL agent should only be queried to make a decision at the exact millisecond an AGV drops off its container and becomes `idle`.

## 5. The Concept: Inventory vs. Due-Time
The core premise of the paper is to compare two objective functions:
1. **The Conventional Approach (Due-Time):** Assigns AGVs based on an Earliness-Tardiness objective (minimizing how late the AGV is to the crane).
2. **The New Approach (Inventory-Based):** Treats the Quay Cranes as "factories" and the containers as "inventory." The goal is to keep the inventory buffer at the QC neither empty (starvation) nor overflowing, completely ignoring exact time estimates.

## 6. The Due-Time Baseline (Equation 1)
To establish a baseline, the authors mathematically formalize the "Due-Time" approach. They define $d_j$ as the exact due time an AGV *should* arrive at the crane. 

The cost $c_{ja}$ of assigning AGV $a$ to job $j$ is calculated by penalizing earliness ($\alpha_E$), tardiness ($\alpha_T$), and empty travel time ($\alpha_e$):

$$ c_{ja} = \begin{cases} \alpha_E \cdot (d_j - f_j^q) + \alpha_e \cdot e_{ja} & \text{if } f_j^q < d_j \\ \alpha_T \cdot (f_j^q - d_j) + \alpha_e \cdot e_{ja} & \text{otherwise} \end{cases} $$
*(where $f_j^q$ is the estimated arrival time and $e_{ja}$ is empty travel time).*

**Thesis Application:** This formula is an excellent mathematical benchmark. However, as the authors note, it relies entirely on the estimated arrival time ($f_j^q$). In a real port with traffic, $f_j^q$ is constantly changing, making this static formula highly fragile. 

## 7. Fluidity at the Yard (Job Swapping)
In Section 3.3, the authors make a fascinating observation about traffic congestion. Suppose AGV $a$ is assigned an urgent job and AGV $b$ is assigned a less urgent job. If AGV $a$ gets stuck in traffic and AGV $b$ arrives at the yard crane first, the yard crane should logically "swap" their jobs and give the urgent container to AGV $b$.

**Thesis Application:** Traditional algorithms struggle with this because they lock AGVs into rigid assignments. Our DRL simulation dynamically queries the agent. If an AGV arrives early or late due to stochastic traffic, the DRL agent evaluates the exact state of the terminal *at that exact moment*, automatically achieving this "job swapping" fluidity without needing special exception rules.

## 8. The Inventory-Based Approach ($ila_q$)
Instead of relying on fragile time estimates, the authors introduce the **Inventory Level for Assignment ($ila_q$)**. 
- The Quay Cranes ($q$) are treated as "customers".
- The AGVs are treated as "goods" or "inventory".
- $ila_q$ is defined as the number of AGVs currently busy with a job for QC $q$ that have *not yet reached* QC $q$.

**The Rule:** Whenever an AGV becomes free, simply assign it to the Quay Crane with the smallest $ila_q$ (the crane with the lowest inventory of incoming AGVs).

**Thesis Application:** This is a breakthrough for our DRL State Space representation! Instead of forcing the neural network to calculate complex ETAs ($f_j^q$), we can simply feed it the $ila$ vector for our 4 QCs: `[ila_1, ila_2, ila_3, ila_4]`. 
By observing how many AGVs are currently committed to each QC, the DRL agent can naturally learn to balance the "AGV inventory" across the terminal, completely avoiding the need for unreliable deterministic time estimates.

## 9. The Phase Factor ($\phi$) Normalization
Loading QCs and Discharging QCs are not equal. A loading QC inherently requires more AGVs in its pipeline because the AGVs must first travel to the yard, wait for the AYC, and then drive to the quay. 
To balance this, the authors introduce a "phase factor" ($\phi$) to adapt the inventory level:
- For loading QCs: $ila'_q = ila_q / \phi$
- For discharging QCs: $ila'_p = ila_p$

**Thesis Application:** This is a vital piece of feature engineering for the DRL State Vector. If we just feed the raw number of AGVs into the neural network, it might struggle to balance the QCs. We must include a binary flag in the State Vector indicating the operation type of the QC (e.g., `1` for Loading, `0` for Discharging) so the neural network can learn its own internal $\phi$ weight to normalize the buffers.

## 10. The Inventory Assignment Cost Function
To solve the actual assignment problem using this inventory logic, they create a cost function $c_{ja}$ that multiplies the job's **Urgency Rank** ($o_j$) by the AGV's **Proximity**:
$$ c_{ja} = (\lambda \cdot (n - o_j) + 1) \cdot (w_a + e_{ja}) $$
*(where $\lambda$ is a weight, $n$ is total jobs, $o_j$ is the urgency rank where $1$ is most urgent, $w_a$ is waiting time for the AGV to become free, and $e_{ja}$ is the empty travel time).*

**Thesis Application:** This is an incredibly elegant alternative to the Due-Time penalty. Instead of calculating *when* the AGV will arrive, it simply takes the ordinal rank of how starved the QC is and multiplies it by the distance of the AGV. 

## 11. Transport Inventory ($ilt_q$) for Yard Cranes
Just as the dispatching system needs $ila_q$ to assign AGVs, the Stacking Cranes (AYCs) need a metric to decide *which* container to load onto a waiting AGV. The authors define $ilt_q$ (Inventory Level for Transport) as the number of AGVs that are already loaded and driving straight towards QC $q$. The AYC will greedily load a container for the QC with the lowest $ilt_q$.

## 12. Enforcing Dual Cycles
A "Dual Cycle" occurs when an AGV drops off an import container at a stack, and immediately picks up an export container from that exact same stack (making empty travel $e_{ja} = 0$). 
The authors explicitly hardcode a heuristic rule: if a valid dual cycle exists, it bypasses the normal assignment process and is assigned immediately.

**Thesis Application:** In classical heuristics, dual-cycling must be manually hardcoded as an exception rule. In Deep Reinforcement Learning, dual-cycling emerges *naturally* from the reward function. Because our DRL agent receives a penalty for empty travel time ($\alpha_e$), it will mathematically learn to prefer actions where the pick-up location equals the current drop-off location, discovering dual-cycling without us having to explicitly code a bypass rule.

## 13. Simulation Configuration (Fleet Ratio)
The simulation models the Altenwerder terminal with:
- 10 Quay Cranes (5 loading, 5 discharging)
- 20 Stacking Cranes
- 40 AGVs

This creates an AGV-to-QC ratio of **4:1**. 

**Thesis Application:** In our proposed thesis configuration (4 QCs, 10 AGVs), our ratio is **2.5:1**. Briskorn is operating in a well-supplied environment. We are operating in a severely bottlenecked, "overloaded" environment. This highlights exactly why Deep Reinforcement Learning is necessary for our thesis: when the fleet size is that tight, sub-optimal dispatching causes immediate starvation and gridlock.

## 14. The Empirical Weight of Delay (Table 1)
In Table 1, the authors reveal the exact weights they tuned for the Due-Time baseline:
- Earliness weight ($\alpha_E$) = 1
- Empty driving weight ($\alpha_e$) = 1
- **Tardiness weight ($\alpha_T$) = 7.5**

**Thesis Application:** This perfectly corroborates Kim & Bae (2004), who stated that the penalty for QC delay must be vastly larger than AGV travel time. Briskorn gives us a concrete scalar ratio to start with in our DRL Reward Function: penalizing QC Starvation/Tardiness **7.5 times harder** than empty driving distance.

## 15. The Phase Factor Value (Table 2)
Table 2 shows the optimal tuned Phase Factor: $\phi = 1.6$. 
This means a Loading QC requires exactly 60% more AGVs in its pipeline than a Discharging QC to maintain the same 60 containers/hour throughput. If the DRL agent's State Space includes a binary "Loading/Discharging" flag, the neural network should naturally learn to allocate ~1.6x more AGVs to the loading cranes.

## 16. Results: The Superiority of Inventory & Dual-Cycling (Table 3)
The simulation results (Table 3) conclusively prove the premise of the paper:
1. **Inventory > Due Time:** The inventory approach (`inv`) universally beat the optimal mathematical due-time approach (`dueTimeHung`).
2. **Dual-Cycling Explodes Productivity:** Adding dual-cycling (`invDualCycle`) increased productivity by up to **22.9%** (1.229 index) in scenarios with fewer precedence constraints.

Furthermore, the authors had to write complex heuristic bounds (using $\tau$ and $\sigma$ limits) to prevent the dual-cycling rule from accidentally starving other cranes.

## 17. The Value of Look-Ahead (Multi-Agent Justification)
Section 5.4 tests what happens if the system only looks at the 1 AGV that just became free, versus looking ahead at the next ~4.6 AGVs that will soon be free. 
Table 7 shows that looking at multiple AGVs simultaneously improves productivity by ~10%. 

**Thesis Application:** If we run a basic Single-Agent DRL (like DQN), it will only evaluate 1 AGV at a time (when it becomes idle). Briskorn just proved that evaluating ~4.6 AGVs simultaneously is 10% better. This provides the exact academic justification for why your thesis must upgrade from standard Single-Agent RL to **Multi-Agent Reinforcement Learning (MAPPO)** in Phase 5!

## 18. The Impact of Precedence Relations (Table 8)
Table 8 proves that the stricter the precedence relations, the worse the terminal performs. Having zero precedence relations improved productivity by 11.8% because AGVs never get stuck in the QC buffer waiting for a delayed predecessor container.

**Thesis Application:** This mathematically proves why the Asymmetric Precedence Rule (Loading = Strict, Discharging = None) is so critical. Your DRL agent will inherently achieve much higher throughput on the Discharging cranes because it has total routing freedom, and we should expect to see that asymmetry directly in our simulation logs.

---

# Final Thesis Takeaways from Briskorn (2006)
1. **Abandon Time Estimates:** The authors explicitly conclude that time estimates are too unreliable in practice. The DRL State Vector should absolutely NOT rely on deterministic ETAs ($f_j^q$).
2. **The $ila_q$ State Vector:** Use the "Inventory Level for Assignment" (the number of AGVs currently dispatched to QC $q$) as a primary feature in the DRL state space. 
3. **Reward Ratio:** Set the reward penalty for QC Starvation to be approximately **7.5x higher** than the penalty for AGV empty travel (derived from Table 1).
4. **Action Masking:** Loading operations require strict precedence checking; discharging operations do not.
5. **The Multi-Agent Justification:** Dispatching 4 to 5 AGVs simultaneously is 10% more efficient than dispatching 1 at a time. This perfectly justifies using Multi-Agent PPO (MAPPO) over single-agent algorithms.
6. **The DRL Advantage:** Briskorn had to write rigid exception equations to force Dual-Cycling and manually balance Phase Factors ($\phi = 1.6$). A DRL agent, given the $ila_q$ state and the 7.5:1 reward ratio, will mathematically discover dual-cycling and optimal buffer balancing completely on its own through policy optimization.
