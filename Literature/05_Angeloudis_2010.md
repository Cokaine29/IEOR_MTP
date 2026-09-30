# An Uncertainty-Aware AGV Assignment Algorithm for Automated Container Terminals
**Authors:** Panagiotis Angeloudis, Michael G.H. Bell  
**Journal:** Transportation Research Part E (2010)  
**Methodology:** 0-1 Integer Programming with Uncertainty Parameters  

## 1. The Curse of Determinism
This paper acts as a bridge between classical mathematical optimization and modern stochastic control. The authors explicitly identify the fatal flaw of previous models (like Kim & Bae, 2004): 
> *"Automated tasks can be planned with great accuracy in both the time and space dimensions, but in practice significant discrepancies can exist between their anticipated and observed execution times... Uncertainty, unless appropriately handled, may eventually degrade the operational gains that stem from automation."*

If the inputs to an optimization algorithm are deterministic (exact travel times), but the environment is stochastic (traffic, crane delays), the control software is forced into an endless, inefficient loop of discarding and re-optimizing flawed schedules.

**Thesis Application:** This is the exact motivation for our Deep Reinforcement Learning approach. DRL agents do not rely on deterministic schedules that break upon contact with reality; they learn a reactive *policy* that naturally absorbs and mitigates stochastic perturbations in real-time.

## 2. Primary vs. Secondary Operations
The authors divide an AGV container move into distinct steps and classify them:
- **Primary Operations (Fixed):** The AGV transporting the loaded container from origin to destination. This is dictated by the terminal layout and cannot be optimized away.
- **Secondary Operations (Helper):** The AGV traveling *empty* to the buffer of the origin crane to pick up the load. 

**Thesis Application:** This confirms that the entire focus of our DRL action space and reward function must be on minimizing the **Secondary Operations** (empty travel time and wait times), as the primary loaded travel is an unavoidable constant for any given job.

## 3. The 2-Step Look-Ahead Limit
In previous studies, researchers tried to solve AGV routing using the Travelling Salesman Problem (TSP) or Minimum Cost Flow, which attempt to route an infinite horizon of jobs. Angeloudis & Bell state that this yields "unpredictable solutions" in a volatile terminal environment.

To fix this, they limit their AGV Assignment Algorithm (AAA) to assign a maximum of **two jobs per AGV** (the immediate next job, and one follow-up job). 

**Thesis Application:** This validates our decision to keep the DRL action horizon extremely tight. Attempting to have an agent predict and assign the next 10 jobs for an AGV is futile because the terminal state will change before the 3rd job even begins. 

## 4. The Uncertainty-Aware Cost Function
![Figure 2: Network of nodes and directional edges](/literature/angeloudis_2010/figure2.png)
To evaluate the cost of assigning AGV $i$ to Job $j$ (creating transition $ij$), the authors formulate a Generalized Cost Parameter ($C_{ij}$):
$$ C_{ij} = \alpha L_{ij} + \beta T_{ij} + \gamma U_{ij} + \delta D_i $$
Where:
- $L_{ij}$: Distance
- $T_{ij}$: Expected travel time
- **$U_{ij}$: The Uncertainty Index associated with the transition**
- $D_i$: Expected remaining time until completion of the current task
- $\alpha, \beta, \gamma, \delta$: Weights

**Thesis Application:** The inclusion of $U_{ij}$ is a massive conceptual leap. Instead of just measuring time, they explicitly penalize routes that are highly uncertain (e.g., routes passing through heavy congestion zones). In our DRL environment, the neural network will *implicitly* learn this $\gamma U_{ij}$ penalty! If a certain block is heavily congested in the simulation, the agent will learn that sending an AGV there yields a delayed (lower) reward, causing it to naturally avoid high-uncertainty routes.

## 5. The Benefit Function (Starvation Prevention)
Instead of just minimizing costs, they formulate a "Net-Benefit" objective. The benefit of executing job $i$ ($B_i$) is defined as:
$$ B_i = \zeta Q_i $$
Where $Q_i$ is the amount of time job $i$ has been waiting (due time), and $\zeta$ is a weight. 
As a job sits unassigned, its $Q_i$ grows, making its execution incredibly "beneficial" to the algorithm, eventually forcing the system to assign an AGV to it.

**Thesis Application:** We *must* include this exact mechanism in our DRL Reward Function. If we only penalize AGV empty travel time, the DRL agent will become "lazy" and repeatedly serve the Quay Cranes closest to the yard, completely starving the Quay Cranes furthest away. By feeding $Q_i$ (crane wait time) into the state vector, and scaling the reward by $Q_i$, the DRL agent will be forced to travel further to service starved cranes.

## 6. The Net-Benefit Objective & The Discount Factor ($\kappa$)
The final objective function seeks to maximize the Total Assignment Benefit:
$$ \text{Maximize} \left\{ \sum_{j \in J} \left( B_j a_j - \sum_{i \in V} C_{ij} t_{ij} \right) + \kappa \sum_{j \in J} \left( B_j b_j - \sum_{i \in J, i \ne j} C_{ij} t_{ij} \right) \right\} $$

Notice the parameter **$\kappa$** attached to the second summation (which represents the 2nd job in the 2-step look-ahead). The authors state that $\kappa$ lies between 0 and 1, giving *less weight* to later assignments because the data associated with future jobs is volatile.

**Thesis Application:** This is a spectacular finding. Angeloudis & Bell manually engineered a parameter ($\kappa$) to discount the value of future, uncertain rewards. In Reinforcement Learning, this exact concept is built into the fundamental math of the Markov Decision Process (MDP)! It is called the **Discount Factor ($\gamma$)**. This proves that the AGV routing problem naturally maps to the Bellman Equation used by our DRL algorithms (like PPO).

## 7. Measuring Uncertainty ($U_{ij})
![Figure 3: Cumulative distribution of AGV service times](/literature/angeloudis_2010/figure3.png)
In Section 6, the authors detail exactly how they calculate the Uncertainty Index ($U_{ij}$) that was used in their cost function. Because travel times have long-tail distributions (proven in Figure 3), deterministic averages are useless.
Instead, they track the upper bound ($\overline{T}_{ij}$) and lower bound ($\underline{T}_{ij}$) of recent travel times (dropping the extreme outliers via percentiles). 
The uncertainty index is calculated as the relative spread (the range divided by the midpoint):
$$ U_{ij} = \frac{2(\overline{T}_{ij} - \underline{T}_{ij})}{\overline{T}_{ij} + \underline{T}_{ij}} $$

**Thesis Application:** Why is there uncertainty in the first place? The authors state it comes from real-time **collision avoidance rules** (safety stops, junction priorities) that disrupt static $A^*$ pathfinding. Our DRL simulation environment will natively generate this exact type of variance when multiple AGVs cross paths. 

## 8. The Spatial "Heatmap" of Uncertainty
![Figure 4: Types of assignment chains](/literature/angeloudis_2010/figure4.png)
![Figure 5: Heat map of uncertainty levels across the AGV grid](/literature/angeloudis_2010/figure5.png)
Figure 5 shows a "heat map" of uncertainty levels across the AGV grid. The authors found that uncertainty is not uniform; it is highly concentrated at:
1. Intersections
2. The Quay Crane buffer area (due to variable QC handover delays)

Because their AAA algorithm penalizes $U_{ij}$, it naturally routes AGVs away from these dark "hotspots" of congestion.

**Thesis Application:** This is a crucial insight for our DRL **State Space** design. Because congestion and uncertainty are spatially distributed, the DRL agent needs spatial awareness. Feeding it a flat 1D array of AGV statuses might not be enough. We should consider giving the agent a grid-based spatial state (like a matrix/heatmap of current AGV positions) or using a Graph Neural Network (GNN) so it can "see" the congestion hotspots and learn to route around them, mimicking the behavior of Angeloudis & Bell's algorithm.

## 9. The Utilization Paradox (Table 2)
![Figure 6: Screenshot from Limen 3D Simulator](/literature/angeloudis_2010/figure6.png)
![Figure 7: Fleet Performance vs Vehicles](/literature/angeloudis_2010/figure7.png)
![Table 2: Simulation results for various optimisation approaches](/literature/angeloudis_2010/table2.png)
Table 2 benchmarks AAA against classical heuristics (Greedy, Closest) and mTSP. The AAA algorithm utterly dominated, achieving the highest productivity (8.87 moves/hr vs 7.77 for mTSP) and the lowest empty travel overhead.
However, the most startling metric is **Fleet Utilisation**. The inferior heuristics ran the fleet at 98-99% utilization, while AAA achieved higher throughput using only **93% utilization**. 

**Thesis Application:** This proves that **100% utilization is a trap**. In a dense, highly uncertain terminal, forcing every AGV to move constantly creates gridlock and increases the Uncertainty Index. Our DRL Action Space must include a "No-Op" or "Stay Idle" action. The agent must learn that sometimes it is mathematically superior to leave an AGV idle rather than dispatching it into a highly congested zone.

## 10. Tuning the Discount Factor ($\kappa = 0.5$)
In the final text block, the authors reveal the empirically tuned value for $\kappa$ (which we previously identified as mathematically identical to the Reinforcement Learning discount factor, $\gamma$). 
They state: *"Optimal values for $\kappa$ were found to lie between 0.5 and 0.6, while outside this range in both directions, performance levels would deteriorate."*

**Thesis Application:** This is an incredible hyperparameter cheat-code for our DRL model! Standard DRL tutorials blindly set the discount factor $\gamma = 0.99$ (valuing long-term future rewards almost equally to immediate ones). Angeloudis & Bell mathematically prove that because terminal traffic is so volatile and stochastic, predicting deep into the future actually *hurts* performance. When we set up our PPO or MAPPO algorithm, we should test lowering our $\gamma$ hyperparameter to the `[0.5, 0.7]` range.

## 11. The Impact of the Benefit Weight (Figure 8)
![Figure 8: Terminal performance measurements in relation to benefit contribution](/literature/angeloudis_2010/figure8.png)
![Figure 9: Relationship between average job delay and contribution of uncertainty](/literature/angeloudis_2010/figure9.png)
Figure 8 shows what happens when the control algorithm increases the weight of the "Benefit" parameter (which rewards the system for picking jobs that have been waiting a long time). As the benefit contribution increases to ~40%, the average "Job Delay" plummets from 2500 seconds down to under 500 seconds, while total fleet throughput increases.

**Thesis Application:** This finalizes the design for our DRL Reward Function. It cannot just be $-1 \times (\text{empty travel distance})$. The reward must be a composite function: $R = (\text{Wait Time of QC}) - (\text{Empty Travel Penalty})$. Figure 8 proves that heavily weighting the QC wait time dramatically reduces overall delays and increases total terminal throughput.

## 12. Visualizing the Discount Factor (Figure 10)
![Figure 10: Impact of parameter kappa to the performance of AAA algorithm](/literature/angeloudis_2010/figure10.png)
Figure 10 provides the visual proof for the optimal $\kappa$ value discussed earlier. It plots both Terminal Uncertainty (GUI) and Vehicle Productivity against $\kappa$ (which ranges from 0 to 1). 
- At **$\kappa = 0$** (Myopic/Greedy - ignoring the future completely), productivity is lowest.
- At **$\kappa = 1$** (Deterministic - trusting future predictions 100%), uncertainty spikes to its maximum and productivity crashes. 
- At **$\kappa \approx 0.5$**, productivity peaks and uncertainty bottoms out.

**Thesis Application:** This graph is a goldmine for defending our Reinforcement Learning architecture. It proves visually why deterministic planning ($\kappa=1$) fails in container terminals: the environment is too volatile, and trusting future predictions completely leads to massive uncertainty and gridlock. Our DRL agent uses the Bellman discount factor ($\gamma$) to naturally replicate this "sweet spot" of caring about the future, but heavily discounting it due to stochasticity.

## 13. Conclusions & Future Work
The authors conclude that their method of "uncertainty penalisation" leads to significant operational benefits compared to traditional heuristics. 
Most importantly, in their *Future Work* section, they state their ambition to upgrade the model to utilize **"present congestion levels in the AGV grid"** and dynamic routing that **"seeks minimum-conflict routes for the entire AGV fleet."**

**Thesis Application:** The "future work" of Angeloudis & Bell (2010) is exactly what our thesis accomplishes using Deep Reinforcement Learning! By including spatial congestion features in the State Vector, and using Multi-Agent PPO (MAPPO) to cooperatively train the vehicles, our DRL agent intrinsically fulfills their vision of dynamic, minimum-conflict fleet routing based on real-time congestion.

---

# Final Thesis Takeaways from Angeloudis & Bell (2010)
1. **Stochasticity Breaks Determinism:** Accurate mathematical planning fails because execution times fluctuate wildly due to traffic and crane delays. DRL is required because it learns a robust, reactive policy rather than a rigid schedule.
2. **The Starvation Penalty:** The Reward Function must scale with $Q_i$ (crane wait time), not just empty travel distance. Without this benefit parameter, the DRL will lazily serve close cranes and starve distant ones.
3. **The Spatial Uncertainty Heatmap:** Congestion is highly concentrated at intersections and Quay Crane buffers. The DRL State Space requires spatial awareness (e.g., grid maps or Graph Neural Networks) to "see" and avoid these dark hotspots.
4. **Tuning the Discount Factor ($\gamma \approx 0.5$):** Highly stochastic terminal environments demand a significantly lower discount factor. Trusting the future too much ($\gamma = 0.99$) causes performance to crash. We must test $\gamma$ values in the `[0.5, 0.7]` range.
5. **The Fleet Utilization Trap:** 100% fleet utilization causes gridlock. The action space must include a "Stay Idle" (No-Op) command so the agent can learn to park AGVs rather than injecting them into heavily congested zones.

