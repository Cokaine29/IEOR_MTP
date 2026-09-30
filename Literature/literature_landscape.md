# Research Landscape Map: AGV Scheduling in Automated Container Terminals

## 0. Canonical & Expected Papers (IEOR Examiner Baseline)
*Detailed analysis available in [examiner_expected_papers.md](file:///d:/MTP/Literature/examiner_expected_papers.md).*

- **Egbelu & Tanchoco (1984)**: Foundational AGV dispatching rules taxonomy (WIP vs Vehicle initiated).
- **Kim & Bae (2004)**: Look-ahead MIP & heuristic dispatching for port AGVs (*PDF present in folder*).
- **Grunow, Günther & Lehmann (2006)**: Multi-load AGV dispatching strategies (offline pattern vs online).
- **Briskorn, Drexl & Hartmann (2006)**: Inventory-based AGV dispatching formulation at seaport terminals.
- **Vis & Harika (2004)**: Simulation fleet sizing & vehicle comparison (AGVs require ~38% more vehicles vs ALVs).
- **Lehmann, Grunow & Günther (2006)**: Real-time deadlock handling & avoidance strategies for AGVs.
- **Angeloudis & Bell (2010)**: Uncertainty-aware agent-based AGV assignment algorithm.
- **Choe, Kim & Ryu (2016)**: Online Preference Learning (OnPL) with neural networks & short look-ahead.
- **Carlo et al. (2014) / Kizilay & Eliiyi (2021)**: Standard literature reviews of transport & integrated terminal operations.
- **Agarwal et al. (2021)**: Statistical best practices for evaluating DRL (IQM, stratified bootstrap CIs, `rliable`).

## 1. Per-Paper Summary Table

| Paper (Year) | Problem Solved | Methods / Approach | Terminal Layout | Stochasticity? | Joint Opt. (Cranes)? | Key Gaps / Future Work |
|---|---|---|---|---|---|---|
| **Yu (2026)** | Reviews DRL for AGV scheduling — path conflicts & inefficiencies | DRL Literature Review (DQN, PPO, etc.) | General/Unspecified | Partial | ❌ | *"conduct in-depth research on the collaborative coordination of multiple intelligences... to improve the overall scheduling efficiency."* |
| **Li et al. (2025)** | Reviews layout designs & handling tech in traditional and automated terminals | Systematic Literature Review (119 papers) | Parallel, Perpendicular, U-type, Towers | Partial | Partial | *"optimization methods for handling equipment under different types of layout designs... online and real-time scheduling methods... by using history data."* |
| **Hoshino et al. (2007)** | Determines minimum fleet sizes (AGVs, ATCs) to meet throughput cost-effectively | Queuing Network Theory + Multi-Agent Simulation | Vertical vs. Horizontal | Partial | Partial (strategic, not real-time) | *"necessary to take into consideration... agents cooperation; container storage scheduling; container transportation planning."* |
| **ifm (Port Automation, 2026)** | Industry sensors for efficiency & safety | Commercial sensors (3D radar, AI cameras) | General | ❌ | ❌ | N/A — commercial brochure |
| **Yang et al. (2025) (IJPR)** | AGV scheduling with multi-load strategy & battery swapping | MIP + Guided Variable Neighborhood Search | Perpendicular | ❌ | ❌ | *"actual operation is a dynamic process... affected by dynamic arrival of tasks, equipment failures, traffic congestion... study AGV scheduling considering uncertainties."* |
| **Song et al. (2024)** | Resilient AGV scheduling with load-dependent power & non-linear charging under disruptions | ALNS + Dual-Threshold Charging | Parallel | Partial (disruptions via priority rules) | ❌ | *"consider more dynamic factors... congestion waiting time, path conflicts, and other AGV charging and scheduling"* |
| **Liu et al. (2001)** | Designs & sizes a high-density AGV terminal; evaluates efficiency | Discrete-Event Simulation + Queuing | High-Density Divided Yard | Partial (Poisson arrivals) | ❌ | *"reshuffling has not been considered in our simulation... the number of yard cranes has not been optimized."* |
| **Xie et al. (2025)** | AGV scheduling & charging to minimize makespan and charging congestion | Dual-Threshold charging + Genetic-ALNS Hybrid | U-shaped (Side-loading) | Partial | ❌ | *"explore the simultaneous execution of loading and unloading tasks... incorporating the power consumption of idle AGVs... adaptive algorithms that can handle dynamic conditions"* |
| **ifm (AGV Sensors, 2026)** | Sensor hardware for AGV collision avoidance & navigation | O3M 3D cameras, R2D radar, encoders | General | ❌ | ❌ | N/A — commercial brochure |
| **Ai et al. (2023)** | AGV task assignment considering quay crane priorities and handling times | Multi-TSP + Improved Genetic Algorithm | Parallel-Perpendicular | ❌ | ❌ | Need to consider task priority and handling time (previously ignored) |
| **Zheng et al. (2022)** | Dynamic AGV scheduling and dispatching rule selection under uncertainties | MDP + DQN + Plant Simulation | Perpendicular (One-Way Loop) | Partial | ❌ | *"can be extended to include AGV collision avoidance and dynamic path planning... import and export containers handled in mixed operations"* |
| **Zhao et al. (2025)** | AGV scheduling to minimize energy consumption | MIP + Variable Neighborhood Search | Perpendicular | Partial | Partial (crane schedules fixed) | *"solution efficiency of VNS is somewhat limited, often requiring support of other algorithms"* |
| **Yang et al. (2023) (JMSE)** | AGV scheduling with battery swapping & speed control | MIP + Two-Level Genetic Algorithm + Simulated Annealing | Perpendicular | ❌ | ❌ | *"consider the conflict and congestion issues during AGV operation... combining different charging methods [e.g., plug-in]."* |
| **Anon (2021) (Piraeus Case)** | Evaluates environmental sustainability of AGV routing | DES (WITNESS) + LCIA environmental impact | Trapezoidal Pier (Parallel) | ❌ | ❌ | *"development and evaluation of sophisticated routing algorithms for port-oriented landside operations... optimizing benefits from automation and AI"* |

---

## 2. Cross-Paper Analysis: Recurring Unsolved Themes

After scanning all 14 papers, five pronounced recurring gaps emerge:

### 🔴 Theme 1: Deterministic Assumptions (Almost Universal)
The vast majority of models assume deterministic environments — task release times, travel speeds, and crane handling times known in advance. **Yang et al. 2025, Ai et al. 2023, Yang et al. 2023** all assume this. Multiple papers explicitly call out incorporating real stochasticity (equipment failures, dynamic task arrivals, traffic congestion) as critical future work.

### 🔴 Theme 2: AGV Optimized in Isolation from Cranes (Almost Universal)
Almost ALL papers treat Quay Cranes and Yard Cranes as fixed constraints — AGVs scheduled assuming predetermined crane schedules. Joint optimization of QCs + AGVs + YCs simultaneously, especially under dynamic/stochastic conditions, remains largely unsolved and explicitly flagged across papers.

### 🟡 Theme 3: Traffic, Congestion, Path Conflicts Oversimplified
Many models assume constant AGV speeds, unlimited horizontal space, or ignore path conflicts entirely. **Song et al. 2024, Zheng et al. 2022, Yang et al. 2023** all flag integrating real-time collision avoidance, deadlock resolution, and congestion into scheduling models as a major missing piece.

### 🟡 Theme 4: Energy Management Gaps
While recent papers tackle battery swapping/charging, they often neglect idle power consumption, nonlinear battery degradation, or integrating multiple charging technologies simultaneously.

### 🟢 Theme 5: Operational Scope Too Narrow
Models typically restrict to single-load AGVs, unidirectional operations (only import unloading). Mixed operations (loading + unloading simultaneously) and multi-load capabilities in novel layouts (U-shaped) flagged for future work.

---

## 3. TOP 3 Genuine Research Gaps for MTech Thesis

### GAP 1 ⭐⭐⭐ — Joint QC-AGV-YC Co-Optimization Under Stochasticity
**Problem:** Current models schedule AGVs assuming crane operations are perfectly predictable and fixed. In reality, Quay Cranes and Yard Cranes experience stochastic handling times and unexpected delays, causing cascading wait times and deadlocks for AGVs.

**Thesis Direction:** Formulate a stochastic MIP or robust optimization framework that *jointly* schedules QCs, AGVs, and YCs. A proactive-reactive scheduling approach — initial joint schedule generated offline, then dynamic rescheduling (via RL or fast heuristics) triggered when stochastic disruptions exceed a threshold.

**Strength:** Addresses the #1 and #2 recurring gap simultaneously. High novelty, strong OR + AI/ML fit.

---

### GAP 2 ⭐⭐ — Energy-Aware AGV Routing with Microscopic Traffic Congestion Modeling
**Problem:** Recent papers tackle battery swapping but falsely assume AGVs travel at constant speeds without traffic conflicts. They ignore energy consumed while idling in congested zones or waiting for cranes.

**Thesis Direction:** Integrated routing + scheduling model explicitly penalizing traffic congestion and path conflicts. Non-linear battery consumption accounting for acceleration, deceleration, idle-waiting. Two-layer algorithm: metaheuristic (ALNS/VNS) for macro-scheduling + MAPF for micro conflict-free routing.

**Strength:** Addresses Themes 3 and 4. Very computationally rich.

---

### GAP 3 ⭐⭐ — Multi-Load AGV Scheduling for Mixed Operations in U-Shaped Layouts
**Problem:** Most literature models single-load AGVs on one-way import tasks in standard perpendicular layouts. U-shaped terminals + multi-load AGVs require entirely different routing and task-pairing logic.

**Thesis Direction:** Task-pairing + scheduling optimization for multi-load AGVs in U-shaped terminal handling mixed (import + export) operations simultaneously.

**Strength:** Directly addresses gaps cited by Xie et al. (2025) and Zheng et al. (2022). Novel layout angle.
