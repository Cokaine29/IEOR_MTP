# Literature Review: Final Synthesis & Thesis Positioning

## 1. Literature Synthesis Matrix
This table synthesizes the 10 core papers reviewed for this thesis, categorizing them by objective, methodology, their handling of stochastic uncertainty, and the baselines they evaluated against.

| # | Paper | Core Objective | Methodology | Handles Uncertainty? | Baseline Evaluated Against |
|---|---|---|---|---|---|
| 1 | Mnih (2015) | Foundation of Deep RL via pixel inputs | DQN | No | Human performance |
| 2 | Lillicrap (2015) | Deep RL for continuous action spaces | DDPG | No | Standard physics solvers |
| 3 | Schulman (2017) | Stable, sample-efficient policy gradients | PPO | No | TRPO, A2C |
| 4 | Yu (2021) | Scaling PPO to Multi-Agent environments | MAPPO | No | IPPO, QMIX, MADDPG |
| 5 | Hu (2020) | AGV Routing & Path Planning | DQN | No | Dijkstra, A* |
| 6 | Zheng (2022) | AGV Meta-Controller for rule selection | DQN | Yes | Static heuristics (FCFS) |
| 7 | Choe (2016) | Variance stabilization in terminal operations | Q-Learning / NN | Yes | Math solvers, GA |
| 8 | Grunow (2006) | Abstracting high-level dispatching from physics | Priority Rules / Sim | Yes | MILP (CPLEX) Lower Bound |
| 9 | Liu (2001) | Macro-level terminal design & physics | Queuing Theory | Yes | Shortest Queue First |
| 10 | Agarwal (2021) | Rigorous statistical evaluation in Deep RL | IQM, Bootstrap CIs | N/A | Mean/Median point estimates |

## 2. Dispatching Rules Inventory (Classical Baselines)
Based on the literature, the following classical heuristics have been identified as the standard competitors against which the MAPPO agent must be evaluated:
1. **Shortest Queue First (SQF):** Extracted from Liu (2001). The AGV is assigned to the Quay Crane or Yard Crane that currently has the fewest AGVs waiting in its buffer.
2. **First Come First Serve (FCFS):** Extracted from Zheng (2022). Jobs are assigned to AGVs strictly based on the chronological order in which they were generated.
3. **Mixed-Integer Linear Programming (MILP):** Extracted from Grunow (2006). Serves as the theoretical "Lower Bound" for un-capacitated throughput, calculated via solvers like CPLEX.

## 3. Thesis Positioning (The Research Gap)
Despite the massive advancements in Deep Reinforcement Learning (Papers 1-4) and the specific application of RL to container terminals (Papers 5-7), a critical gap exists in the literature: **Modern Multi-Agent Deep RL (MAPPO) has not been rigorously applied to abstracted, high-level AGV dispatching under stochastic disruptions using modern statistical standards.**

This thesis fills this exact gap by combining the findings of the Tier 2 literature:
*   **The Abstraction Argument:** Following Grunow (2006) and Liu (2001), this thesis abstracts away low-level collision physics (e.g., 45ft spacing, node tie-breakers) to the onboard manufacturer controllers, allowing the MAPPO agent to function strictly as a high-level dispatcher.
*   **The Stochastic Variance Argument:** Following Choe (2016), this thesis utilizes neural networks not for routing, but as variance stabilizers to handle real-time stochastic disruptions (e.g., crane breakdowns, weather delays) where classical MILP solvers fail.
*   **The Statistical Rigor Argument:** Following Agarwal (2021), this thesis rejects the prevalent methodology of reporting single-run point estimates or "max evaluation scores." Instead, the MAPPO agent's superiority over classical heuristics (SQF/FCFS) will be proven using Interquartile Means (IQM), Probability of Improvement, and 95% Stratified Bootstrap Confidence Intervals.
