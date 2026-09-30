# A Look-Ahead Dispatching Method for Automated Guided Vehicles in Automated Port Container Terminals
**Authors:** Kap Hwan Kim, Jong Wook Bae  
**Journal:** Transportation Science (2004)  
**Methodology:** Mixed-Integer Programming (MIP) & Heuristic Algorithm  

## 1. Introduction & The "Look-Ahead" Concept
Unlike traditional manufacturing facilities where jobs arrive randomly (as modeled in Egbelu 1984), ship operations follow a strict, pre-determined **Sequence List** (stowage plan) provided by the shipping agent. 

Kim & Bae argue that conventional dispatching rules fail to utilize this known future information. They propose a **"look-ahead"** dispatching method that assigns AGVs by looking at the known sequence of future delivery tasks.

**Thesis Application:** The DRL agent's State Space should not be limited to the *current* state of the terminal. To outperform classic models, the DRL observation vector should include a "look-ahead window" (e.g., the locations and types of the next 5 containers in the QC sequence lists) allowing the neural network to learn anticipatory pre-positioning.

## 2. Terminal Layout (The Perpendicular Standard)
Figure 1 provides a clear schematic of an Automated Container Terminal (ACT). 

![Figure 1: A Layout of an Automated Port Container Terminal](/literature/kim_2004/figure1.png)
*Figure 1: A Layout of an Automated Port Container Terminal*

The layout features:
- **Containerships & Apron:** Where the Quay Cranes (CCs) operate.
- **AGV Guide Path:** A one-way circulatory loop connecting the apron to the yard.
- **Marshalling Yard:** Blocks arranged perpendicularly to the shoreline, serviced by Automated Yard Cranes (AYCs).

## 3. The Objective Function Hierarchy
The authors define three special properties of the port dispatching problem:
1. **Strict Sequence:** Tasks must be carried out in the exact sequence specified by the list.
2. **CC Priority:** Minimizing the delay of Container Cranes (CCs) has a strictly higher priority than minimizing the total travel time of AGVs. CCs are the bottleneck resource; AGVs exist solely to support them.
3. **Cascading Delays:** A delay in one transfer operation cascades by the same amount of time to all succeeding operations assigned to that CC.

**Thesis Application:** This dictates the Reward Function design for the DRL agent:
$$ \text{Reward} = -(W_1 \times \text{Total CC Idle Time}) - (W_2 \times \text{Total AGV Travel Time}) $$
where weight $W_1 \gg W_2$.

## 4. The "Deterministic Flaw" (Assumption 3)
To formulate their mathematical model, the authors introduce several assumptions, including:
1. AGVs serve multiple CCs (Vehicle Pooling is active).
2. All AGVs are identical unit-load vehicles.
3. **The queueing time of AGVs under AYCs is NOT considered.** 

Regarding Assumption 3, the authors admit: *"To consider the waiting time of AGVs for the transfer of a container by an AYC, the operation time of the AYC for each container must be considered, which makes the problem much more complicated."*

**Thesis Application:** This is a massive limitation of Mixed-Integer Programming (MIP). To remain mathematically tractable, the authors had to ignore yard-side traffic jams and AYC delays. Deep Reinforcement Learning does not suffer from this limitation. The DRL agent can be trained in a stochastic simulation where AYC queueing times are fully modeled, allowing it to find robust policies that traditional MIP cannot handle.

## 5. The Second Deterministic Flaw (Assumption 5)
In this batch, the authors explicitly state **Assumption 5**: *"Congestions among AGVs on guide paths are not considered."*
They admit that vehicle interference is too difficult to anticipate mathematically without detailing the exact movements.

**Thesis Application:** Another massive justification for our thesis. The classic mathematical benchmark (MIP) is completely blind to traffic congestion. Our DRL simulation natively includes routing and congestion penalties, meaning the DRL policy will be far more realistic and resilient than Kim & Bae's model.

## 6. The Sequence List and Dual-Cycling (Table 1)
Table 1 illustrates the strict "Working Sequence List" for the Quay Cranes. It shows how loading (L) and discharging (D) operations are interleaved in a "dual-cycle" manner to maximize CC efficiency. 

![Table 1: An Example of a Working Sequence List](/literature/kim_2004/table1.png)
*Table 1: An Example of a Working Sequence List*

**Thesis Application:** Our DRL environment must feed these exact parameters (Task Type, Ship Location, Yard Location) into the state vector for the upcoming $N$ tasks. The agent needs this look-ahead to know whether it should pick up an export container from the yard (L) or travel empty to the apron to catch an import container (D).

## 7. Defining the Mathematical Delay (Figure 2)
Figure 2 provides a strict chronological timeline of events for a Quay Crane. The authors define the variables that govern delays:
- $e_i^k$: The event moment an AGV transfers the $i$-th container of CC $k$.
- $s_i^k$: The *earliest possible* event time (the ideal, perfect-world schedule).
- $y_i^k$: The *actual* event time (the decision variable).

A delay occurs whenever the AGV is late, mathematically defined as:
$$ y_i^k > s_i^k $$

![Figure 2: The Progress of the Ship Operation of CC 1 and Events](/literature/kim_2004/figure2.png)
*Figure 2: The Progress of the Ship Operation of CC 1 and Events*

**Thesis Application:** This gives us the exact blueprint for our DRL reward function! Our environment should compute the penalty exactly as the authors define the delay: 
$$ \text{Penalty} = \max(0, y_i^k - s_i^k) $$ 
The agent's goal is to keep the actual arrival time ($y_i^k$) as close to the ideal time ($s_i^k$) as possible.

## 8. The Mixed-Integer Programming (MIP) Objective Function
The authors formally define the exact objective function for AGV dispatching:

$$ \text{Minimize:} \quad \alpha \times (\text{Total AGV Travel Time}) + \beta \times (\text{Total CC Delay}) $$

They explicitly state that $\alpha \ll \beta$ (the penalty for CC delay is vastly larger than the cost of AGV travel). Interestingly, because of the "cascading delay" assumption, they calculate the total CC delay by only looking at the delay of the *final* container in the CC's sequence.

**Thesis Application:** This validates our DRL Reward Function structure. Our agent should receive a small negative reward for total AGV driving distance/time ($\alpha$), and a massive negative penalty ($\beta$) every time a CC sits idle waiting for an AGV. 

## 9. Visualizing the Decision Variable (Figure 3)
The primary decision variable in their MIP is $x_{ki}^{lj}$, a binary variable that equals $1$ if an AGV completes task $i$ for CC $k$, and is immediately assigned to task $j$ for CC $l$. Figure 3 visualizes this mathematically as a flow network, where nodes are tasks (supply/demand) and arcs are AGV assignments.

![Figure 3: A Graphical Representation of a Feasible Solution](/literature/kim_2004/figure3.png)
*Figure 3: A Graphical Representation of a Feasible Solution*

## 10. The Computational Bottleneck (NP-Hard)
At the end of the formulation, the authors reveal the fatal flaw of their exact mathematical model:
> *"Both the problems must be NP-hard. Thus, a heuristic algorithm is suggested in the following section."*

Because the number of constraints and variables grows quadratically with the number of containers, the MIP takes too long to solve dynamically in a real port. 

**Thesis Application:** This is one of the strongest arguments for Deep Reinforcement Learning in our thesis. While MIPs and routing heuristics suffer from NP-Hard computational complexity as the terminal scales up, a trained DRL neural network operates in near $\mathcal{O}(1)$ time complexity during inference. An AGV querying the DRL agent will receive an optimal dispatch decision in milliseconds, completely bypassing the traditional mathematical bottleneck.

## 11. The Heuristic Algorithm (Maximum Cardinality Matching)
Because the MIP is NP-hard, the authors propose a 5-step heuristic to assign tasks. Instead of solving the whole matrix at once, it builds the schedule iteratively:
- **Step 1 & 2 (Initialization):** Set ideal times ($y_i^k = s_i^k$) and select the next task $\xi$ in chronological order.
- **Step 3 (Feasibility Checking):** Uses a **Maximum Cardinality Matching** problem on a bipartite graph to see if the current AGV fleet can cover the tasks without delays.
- **Step 4 (Delaying Event Times):** If the matching is infeasible, the algorithm forces a minimum time delay ($\pi_{i^*\xi}$) on the event time to mathematically allow an AGV to reach the QC, thereby increasing the actual event time ($y$).
- **Step 5 (Task Assignment):** Once all necessary delays are locked in to make the schedule feasible, it solves a standard assignment problem to minimize the total travel distance.

**Thesis Application:** Our DRL agent directly replaces this entire 5-step heuristic. Instead of running a bipartite matching algorithm at every discrete step and manually injecting delays, the DRL agent evaluates a highly non-linear value function to instantly select the optimal AGV assignment.

## 12. Computational Results (Heuristic vs MIP)
The authors tested the heuristic against the optimal MIP (solved via LINDO software) on 50 randomly generated problems.
- **Solution Quality:** The heuristic was, on average, only **2.8% worse** than the optimal mathematical solution (ratio 1.028).
- **Speed:** The heuristic took only **1% of the computational time** (ratio 0.01) compared to the optimal MIP (essentially a 100x speedup).

## 13. The Dynamic Real-World Adjustment ($\Delta$-Step Look-Ahead)
In a critical admission at the end of this section, the authors concede that real-world stochasticity breaks full-horizon planning:
> *"However, in a real world, because the operation times of container handling equipment are uncertain, it is meaningless to schedule all the delivery tasks in sequencing lists... we assume that only the most imminent $\Delta$ tasks are considered in the dispatching, which we call **$\Delta$-step look-ahead dispatching**."*

They explicitly specify that this dispatching procedure is triggered **"whenever an AGV becomes free."**

**Thesis Application:** This paragraph is foundational for the DRL environment design.
1. **Vehicle-Initiated Trigger:** It mathematically confirms the assumption from Carlo (2014) that the dispatching trigger must be an idle AGV asking for a task, not a machine asking for a vehicle.
2. **State Space Design ($\Delta$):** This rigorously justifies the dimensions of the DRL State Space. The neural network does not need to process the entire 2,000-container stowage plan. It only needs to observe a localized hyperparameter window, $\Delta$ (e.g., the next 3 to 5 containers per QC). The DRL agent will observe this $\Delta$-step window to make anticipatory dispatching decisions under uncertainty.

## 14. Simulation Design & Modeling Stochasticity
To test their heuristic, the authors built a simulation with three experimental factors:
1. **Fleet Size:** 3 to 7 AGVs per CC.
2. **Look-Ahead Window (NFT/$\Delta$):** 4 to 14 future tasks.
3. **Degree of Uncertainty ($\delta$):** 0 to 0.4 (0% to 40% variance).

Stochasticity was modeled using a Uniform distribution for operation times: 
$$ \text{Uniform}(\text{mean} - \delta \times \text{mean}, \text{mean} + \delta \times \text{mean}) $$

## 15. The Look-Ahead Trade-off (Figures 4 & 5)
The results reveal a fascinating trade-off governed by their objective function:
- **Figure 4:** As the look-ahead window ($\Delta$) increases, CC delay *decreases*. However, there are massive diminishing returns. Looking ahead more than 8-10 tasks provides almost zero additional benefit.
- **Figure 5:** As the look-ahead window increases, total AGV travel time *increases*. Because the algorithm strictly prioritizes CCs, it forces AGVs to drive much longer distances just to ensure a CC is never starved.

![Figure 4: Effects of NFT on Delay Times](/literature/kim_2004/figure4.png)
*Figure 4: The Effects of the NFTs for Looking Ahead on the Sum of Delay Times*

![Figure 5: Effects of NFT on Travel Time](/literature/kim_2004/figure5.png)
*Figure 5: The Effects of the NFTs for Looking Ahead on the Average Total Travel Time*

**Thesis Application:** This proves we do not need an infinitely large state vector for our DRL agent. We only need to feed the agent a $\Delta$ of about 5 to 8 future tasks per QC. Anything larger will cause the "curse of dimensionality" in our neural network without actually improving the dispatching policy. Furthermore, Figure 5 proves our Reward Function needs a carefully tuned weight for travel distance ($\alpha$), otherwise the agent will learn to drive AGVs erratically just to buffer the CCs.

## 16. The Impact of Overloading (Figure 6)
Figure 6 shows that higher uncertainty ($\delta$) generally increases delays. However, there is a glaring exception: when the system only has 3 AGVs per CC, the delay curve is completely flat regardless of uncertainty. 
Why? Because the AGVs are so hopelessly overloaded that the CCs are perpetually starved anyway. Stochasticity doesn't matter when the system is fundamentally bottlenecked by a lack of vehicles.

![Figure 6: Effects of Uncertainties](/literature/kim_2004/figure6.png)
*Figure 6: The Effects of the Degree of Uncertainties of Operation Times*

**Thesis Application:** Our proposed terminal configuration (10 AGVs for 4 QCs) equates to **2.5 AGVs per QC**. We are operating in the extreme "overloaded" regime! This strongly justifies the necessity of Deep Reinforcement Learning. When a fleet is this heavily constrained, naive rules collapse. The DRL agent must achieve near-perfect routing and dispatching efficiency to prevent catastrophic gridlock.

## 17. Establishing the Baselines (STT/D, EDD, r-SI)
The authors formally define three conventional dispatching rules to compare their Look-Ahead Dispatching Procedure (LADP) against. A newly idle AGV calculates a score $Z_i^k$ for each imminent task and greedily picks the minimum:
- **STT/D (Shortest Travel Time/Distance):** The classic Egbelu (1984) Nearest Vehicle rule. For discharging, where $o$ is the idle location and $a_i^k$ is the destination:
  $$ Z_i^k = t(o, a_i^k) $$ 
- **EDD (Earliest Due Date):** Assigns the task with the earliest ideal schedule time:
  $$ Z_i^k = s_i^k $$
- **r-SI (revised Shortest Imminent):** Considers both the ideal schedule time and the travel distance:
  $$ Z_i^k = s_i^k - t(o, a_i^k) $$

**Thesis Application:** We will use these exact mathematical definitions to code the naive baselines in our simulation environment. STT/D is particularly important as the industry-standard greedy baseline that our DRL must beat.

## 18. LADP vs Conventional Rules (Figures 8 & 9)
The results prove that Look-Ahead dispatching absolutely crushes naive rules. 
- In Figure 8, at 7 AGVs per CC, the total delay time from the conventional rules was **4.5 times higher** than LADP. 
- In Figure 9, LADP also vastly outperformed the naive rules in total travel time, and its travel time actually decreased as the fleet size grew.

![Figure 8: Comparison of Total Delay Times](/literature/kim_2004/figure8.png)
*Figure 8: Comparison of the Total Delay Times for Various Dispatching Methods*

![Figure 9: Comparison of Total Travel Times](/literature/kim_2004/figure9.png)
*Figure 9: Comparison of the Total Travel Times for Various Dispatching Methods*

**Thesis Application:** This sets the ultimate benchmark for our thesis. Beating STT/D and EDD is the bare minimum. The true test of our DRL agent will be whether it can match or beat a look-ahead heuristic like LADP. Since LADP completely ignores traffic congestion and yard crane queues (as admitted in their assumptions), our DRL agent should mathematically surpass LADP in a highly congested, stochastic simulation.

## 19. Conclusion and Future Research Directions
In the final conclusion, the authors highlight an incredible statistic: LADP reduced the total travel time of STT/D by a staggering **75%-85%**. 

Most importantly, they explicitly define the open research gap that their MIP could not solve:
> *"In a future research, a dispatching algorithm for synchronizing travels of AGVs with operations of yard cranes, in addition to operations of container cranes, can be addressed."*

**Thesis Application:** This is the smoking gun for our thesis justification. Kim & Bae's mathematical model could only synchronize AGVs with Quay Cranes, completely ignoring Yard Cranes (AYCs) to keep the equations solvable. Deep Reinforcement Learning allows us to synchronize *both* simultaneously, as the DRL state vector can natively include the queue and readiness status of both QCs and AYCs. We are directly answering this exact call for future research.

---

# Final Thesis Takeaways from Kim & Bae (2004)
1. **The Objective Benchmark:** The standard metric to beat is:
   $$ \text{Minimize:} \quad \alpha \times (\text{Travel Time}) + \beta \times (\text{CC Delay}) \quad \text{where } \alpha \ll \beta $$
2. **State Space Dimension:** The neural network input should include a look-ahead window of $\Delta \approx 5-8$ tasks per CC. 
3. **The Simulation Trigger:** Dispatch decisions must be queried when an AGV drops off a container and becomes idle (Vehicle-Initiated).
4. **The Weakness to Exploit:** Mathematical MIPs and LADP heuristics deliberately ignore **traffic congestion** and **yard crane queues** because it makes the math impossible to solve. Our stochastic DRL simulation naturally includes both, making our approach vastly superior for real-world application.
5. **The Baseline Formulas:** The mathematical definitions of STT/D and EDD provided here will serve as our lower-bound simulation benchmarks.
6. **The Ultimate Justification:** The authors explicitly conclude that synchronizing AGVs with Yard Cranes is the critical next step for future research. Our DRL agent natively solves this by observing the queue status of all cranes simultaneously.
