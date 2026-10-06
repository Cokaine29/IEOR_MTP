---
id: egbelu_1984
title: "Characterization of automatic guided vehicle dispatching rules"
authors: "Pius J. Egbelu, Jose M. A. Tanchoco"
venue: "International Journal of Production Research, 22(3), 359-374"
year: 1984
doi: "10.1080/00207548408942459"
paper_type: "Simulation study of heuristic dispatching rules"
domain: "Job-shop manufacturing (not a container terminal)"
last_updated: "2026-10-05"
trigger: "Both classes defined: vehicle-initiated and work-centre-initiated"
decision_variable: "Vehicle-initiated: which work centre to serve next. Work-centre-initiated: which idle vehicle to send."
objective: "Shop throughput in unit loads (primary); buffer queue lengths; whether the shop locks"
scale: "13 departments, 6 AGVs, one-way guide path, one facility layout"
randomness:
  qc_cycle_time: "n/a (no quay cranes)"
  travel_time_congestion: "Modelled: transition time between check points depends on speed, congestion and node separation (Appendix); the form of the congestion effect and any randomness are not stated"
  task_arrival: "Not stated in the paper (simulation details are deferred to Egbelu 1982, ref. [8])"
  stowage: "n/a"
  agv_breakdown: "Not described in the paper"
  yard_crane_delay: "n/a"
  battery: "Not mentioned in the paper"
method: "Discrete-event simulation (AGVSim) comparing 15 rule combinations"
evaluation: "2 runs per combination (Tables 1 and 4); number of runs for Table 3 not stated; no confidence intervals"
baselines: "None external; rule combinations are compared with each other and with a sequential-loop strategy"
---

# Characterization of Automatic Guided Vehicle Dispatching Rules

**Egbelu & Tanchoco (1984)** · *International Journal of Production Research* 22(3), 359-374 · [DOI 10.1080/00207548408942459](https://doi.org/10.1080/00207548408942459)

> **How to read this note.** Sections 1-4 summarise what the paper says, with page references. Section 5 is *our* interpretation for the thesis and is labelled as such.

---

## Key takeaways

- **What it did:** simulated 15 AGV dispatching rule combinations (3 work-centre-initiated × 5 vehicle-initiated rules) in a 13-department, 6-AGV job shop.
- **Numbers to remember:** 9 of 15 combinations locked the shop, with 1-108 unit loads against over 700 for the rest. Locking occurred only with the vehicle-initiated rules MOQS, STT/D and LTT/D; MROQS and MFCFS never locked. With infinite queues STT/D reached 664-669 but built output queues of up to 231 loads. A sequential loop reached only 406 and 499.
- **Used in the thesis for:** the vocabulary of vehicle-initiated versus work-centre-initiated dispatching; STT/D and MFCFS as baseline candidates; the locking mechanism as a failure mode to test for.
- **Not evidence for:** robustness to stochastic disruption, learning-based dispatching, or container-terminal operations.

---

## 1. Summary in five points

1. The paper is a **simulation study of heuristic AGV dispatching rules in a job shop** (13 departments, 6 AGVs). It is not about container terminals.
2. It separates two kinds of dispatching decision: **work-centre-initiated** (a pickup task appears, so choose an idle vehicle) and **vehicle-initiated** (a vehicle becomes free, so choose which waiting work centre to serve). A working system needs one rule from each class (p. 363).
3. Of 15 rule combinations tested, **9 locked the shop**, meaning a complete seizure of material flow. All nine used one of the vehicle-initiated rules MOQS, STT/D or LTT/D, whichever work-centre-initiated rule it was paired with (Table 1, p. 367).
4. The vehicle-initiated rules MROQS and MFCFS did not lock the shop in any run, and gave about 763-777 unit loads against 1-108 for the locked runs.
5. The authors attribute locking to the interaction of **finite queue capacities**, **distance-based vehicle-initiated rules**, and a **layout** in which some pickup points are never the "nearest" to any point where vehicles are released (pp. 364, 368).

---

## 2. What the paper does

### 2.1 Setting and problem

A *unit load* is one or more parts bound together and moved as a unit. Each job is split into equal-size unit loads that follow the job's route through several **work centres**. Each work centre has machines, an incoming queue and an outgoing queue (Figure 1). When a unit load enters the outgoing queue, the work centre requests a vehicle to take it away.

![Figure 1. Schematic representation of a work centre: delivery point, incoming queue, machines, outgoing queue, pickup point.](figure1.png)

When a vehicle finishes a delivery it is reassigned at once if any task is unattended; otherwise it idles until a task appears (p. 360). The authors argue that the way these assignment decisions are made affects material flow, buffer requirements, machine utilisation and vehicle effectiveness.

### 2.2 Two classes of dispatching decision (pp. 359-360)

| Class | Trigger | Decision | Cardinality |
|---|---|---|---|
| **Work-centre-initiated** | A pickup task is generated at a work centre | Which **idle vehicle** should take it | One work centre, one or more vehicles |
| **Vehicle-initiated** | A vehicle has just completed a delivery | Which **waiting work centre** should it serve next | One vehicle, several work centres |

Requests that cannot be served immediately are logged and considered when a vehicle is released (p. 363). The authors state that "rule pairs" are required, one from each class (p. 363).

### 2.3 Rule catalogue

Notation: $d_i$ is the path distance from vehicle $i$ to the demand point, $d_i'$ the distance from vehicle $i$ to its next node ($0$ if it is at a node), $J$ the number of nodes on the shortest path, $s_i$ the travelling speed of vehicle $i$, $T_c$ the current time, $T_i$ the time vehicle $i$ was last set idle, $U_i$ the mean utilisation of vehicle $i$.

**Work-centre-initiated rules (choose a vehicle), pp. 362-363**

| Rule | Criterion | Comment |
|---|---|---|
| RV, Random Vehicle | Assign to a random available vehicle | Ignores vehicle location |
| NV, Nearest Vehicle | $d_j=\min_i\{d_i\}$ with $d_i=d_i'+\sum_{k=1}^{J-1}d(n_k,n_{k+1})$. Time version: $d_j/s_j=\min_i\{d_i/s_i\}$ | In a congested network the shortest path is not necessarily the fastest |
| FV, Farthest Vehicle | $d_j/s_j=\max_i\{d_i/s_i\}$ | Antithetical to NV. Not meant as a viable rule; it shows the effect of unnecessary travel |
| LIV, Longest Idle Vehicle | $t_j=\max_i\{t_i\}$ with $t_i=T_c-T_i$ | Balances workload across vehicles |
| LUV, Least Utilized Vehicle | $U_j=\min_i\{U_i\}$ | Balances workload; uses utilisation statistics |

**Vehicle-initiated rules (choose a work centre), pp. 363-365**

Additional notation: $q_k$ is the number of unit loads in the outgoing queue of work centre $k$ awaiting pickup; $R_k$ the number of those not yet assigned to a vehicle ($1 \le R_k \le q_k$); $Q_k$ the outgoing-queue capacity; $S_k$ its current length; $T_k$ the shop-arrival time of the unassigned unit load at the end of queue $k$.

| Rule | Criterion | Stated purpose / comment |
|---|---|---|
| RW, Random Work centre | Pick randomly among requesting work centres | |
| STT/D, Shortest Travel Time/Distance | Serve the work centre whose pickup point is closest to the vehicle (path and direction of traffic flow) | Minimise the share of time vehicles travel empty. Very sensitive to layout and equipment location |
| LTT/D, Longest Travel Time/Distance | Serve the farthest work centre | Antithetical to STT/D; no attractive quality except for experiments |
| MOQS, Maximum Outgoing Queue Size | $q_j=\max_k\{q_k\}$ over $k$ with $R_k\ge 1$ | |
| MROQS, Minimum Remaining Outgoing Queue Space | $C_k=Q_k-S_k$; serve $i$ with $C_i=\min_k\{C_k\}$ over $k$ with $R_k\ge 1$ | Reduce the chance of a work centre blocking |
| MFCFS, Modified First Come First Serve | Serve the work centre with the earliest *saved* call. A department holds at most one saved call. After service, if it still needs vehicles, a new call is saved with the time the old one was satisfied | Shortens the wait between request and service. Ignores impending queue exhaustion |
| ULSAT, Unit Load Shop Arrival Time | Serve the work centre holding the unit load that entered the shop earliest: $T_i=T^*=\min_k\{T_k\}$ | Reduce time jobs spend in the shop. **Not tested** |

Rules **not** included in the experiments: RV, LUV, RW, ULSAT.

### 2.4 Experimental design (pp. 366-367)

- Simulator: AGVSim (the authors' own, documented in a technical report).
- Facility: a job shop with **13 departments**, multiple identical machines per department, **6 vehicles**, unidirectional guide path (Figure 2). Department 1 is receiving, 13 is shipping.
- Each department has one input queue and one output queue. All queues are **capacitated** except the receiving input queue and the two shipping queues.
- Rule combinations: 3 work-centre-initiated rules (NV, FV, LIV) $\times$ 5 vehicle-initiated rules (MOQS, STT/D, LTT/D, MROQS, MFCFS) = **15 combinations**, **2 trials each = 30 trials**.
- Performance measure: shop throughput in unit loads.
- **Locking** is declared when (1) input and output queues are full at some or all departments and machines are blocked, (2) loaded vehicles cannot deliver because input queues are full and no free vehicle can empty the output queues, and (3) empty vehicles sent for pickups cannot reach their destinations because of interference from other vehicles (p. 366).

![Figure 2. Network layout of the demonstrative facility: 13 departments, one-way guide path, D = delivery station, P = pickup station.](figure2.png)

### 2.5 Results

**Table 1. Shop throughput in unit loads, capacitated queues (p. 367).** "Locked" means locking was encountered.

| Work-centre rule | Run | MOQS | STT/D | LTT/D | MROQS | MFCFS |
|---|---|---|---|---|---|---|
| NV | 1 | locked | locked | locked | 766 | 775 |
| NV | 2 | locked | locked | locked | 763 | 770 |
| FV | 1 | locked | locked | locked | 765 | 767 |
| FV | 2 | locked | locked | locked | 770 | 777 |
| LIV | 1 | locked | locked | locked | 766 | 775 |
| LIV | 2 | locked | locked | locked | 763 | 770 |

- The first nine combinations locked. Throughput in the locked runs was **1 to 108** unit loads, against **over 700** for every combination with MROQS or MFCFS (p. 367).
- The NV and LIV rows are identical in Tables 1, 2 and 3. The paper explains why the work-centre rules differ so little (p. 368) but does not remark on this exact equality.

**Table 2. Central buffer queue length with the anti-lock mechanism, maximum / average (p. 369).**

| Work-centre rule | MOQS | STT/D | LTT/D | MROQS | MFCFS |
|---|---|---|---|---|---|
| NV | 17 / 6.22 | 5 / 1.06 | 9 / 1.31 | 0 / 0 | 0 / 0 |
| FV | 15 / 5.80 | 6 / 1.04 | 8 / 1.26 | 0 / 0 | 0 / 0 |
| LIV | 17 / 6.22 | 5 / 1.06 | 9 / 1.31 | 0 / 0 | 0 / 0 |

With the anti-lock mechanism, throughput for the previously locked combinations rose to a range of **290-596** (from 1-108). Output for MROQS and MFCFS was unchanged (pp. 368-369).

**Table 3. Throughput with infinite queue capacity (p. 369).**

| Work-centre rule | MOQS | STT/D | LTT/D | MROQS | MFCFS |
|---|---|---|---|---|---|
| NV | 348 | 669 | 431 | 346 | 764 |
| FV | 334 | 664 | 434 | 350 | 758 |
| LIV | 348 | 669 | 431 | 346 | 764 |

The paper's own nomenclature under Table 3 reads "maximum remaining outgoing queue space" for MROQS and "queue space" for MOQS, which differs from the text and Tables 1, 2 and 4 ("minimum remaining outgoing queue space", "queue size"). The text says MOQS and MROQS collapse to the same rule when queues are infinite, which only holds for "minimum remaining". We treat the Table 3 wording as a typo in the original.

**Table 4. Throughput under sequential and non-sequential dispatching (p. 371).**

| Run | LIV-MROQS | LIV-MFCFS | Sequential dispatching |
|---|---|---|---|
| 1 | 740 | 770 | 406 |
| 2 | 754 | 783 | 499 |

### 2.6 The locking mechanism, as the authors explain it (p. 368)

1. A vehicle-initiated rule is invoked only when a vehicle is released, and releases happen only at **delivery points**. The rules are therefore sensitive to where delivery points are.
2. Under STT/D and LTT/D some departments almost never meet the dispatching criterion. Their output queues fill, which blocks their machines. Their input queues then fill, which blocks vehicles trying to deliver. The blockage propagates until all material flow stops.
3. Unless pickup points are well located relative to delivery points, locking (or at least work-centre locking) is described as "inevitable" for distance-derived rules.
4. The work-centre-initiated rules show little difference from each other because, at high flow, vehicles are rarely free, so work-centre-initiated rules are rarely invoked and dispatching is governed by the vehicle-initiated rule. The rules effectively become inactive after a few hours of operation.

### 2.7 Other experiments

**Anti-lock mechanism with a central buffer (pp. 368-369).** Loaded, blocked vehicles are diverted to a central buffer area to unload, then sent to release the blocked departments, then return for the buffered items. This lifted throughput of the locked combinations to 290-596.

**Infinite queues (pp. 369-370).** With queue limits removed there is no locking. Reported findings:
- All combinations that involve queue-based rules (MOQS, MROQS) performed worse than all others (Table 3).
- MFCFS performed best overall.
- STT/D had competitive throughput (669 / 664) but its output queues grew to as many as **231** unit loads in some departments, against a maximum of 13 under MFCFS. No loads were ever picked up from those departments, so STT/D turned them into sink nodes.
- The paper does not explain why MOQS and MROQS fall to about 346 here, compared with about 765 for MROQS in Table 1.

**Sequential (loop) dispatching (pp. 370-371).** Vehicles visit pickup points in a fixed loop, which makes locking impossible by construction. The tested sequence was 1→4→13→11→10→8→6→2→12→5→9→7→3→1 (Figure 3), not chosen by any optimisation. Throughput was 406 and 499, well below LIV-MROQS (740, 754) and LIV-MFCFS (770, 783). The authors attribute this partly to the non-optimal sequence and partly to many unproductive visits, and suggest such a policy be justified by simplicity of traffic control or lock elimination rather than by speed.

![Figure 3. A single-loop vehicle assignment system based on the demonstrative facility.](figure3.png)

### 2.8 Authors' conclusions and stated limitations (p. 371)

- Distance-derived rules have several drawbacks if layout and equipment-location conditions are not met.
- The dispatching problem and its resolution method affect buffer space requirements per department, central buffer requirements, shop throughput, and the identification of poor layout designs.
- Not addressed: traffic control problems, load-transfer mechanisms at pickup and delivery points, and other operation-related issues.

---

## 3. Guide-path model (Appendix, pp. 371-373)

The simulation represents the guide path as a **network of nodes and arcs**, with nodes at guide-wire intersections, merges, diverges, pickup stations and delivery stations (Figure A1). Key modelling choices:

- A **check zone** is a safety zone around each node, and a **check point** is where an arc enters a check zone. Check points are the vehicles' **decision points**: crossing an intersection, holding for a blockage, negotiating a turn (Figure A2).
- All turns are made through interchange **ramps**. Vehicle flow is modelled as discrete jumps between successive check points.
- Transition time between check points depends on vehicle speed, **the degree of traffic congestion between the nodes**, and the physical separation of the nodes.
- Arcs enter or leave nodes only along a coordinate axis, and only the arc shapes of Figure A3 are allowed (Family One: straight arcs; Family Two: L-shaped arcs). Adjacent nodes are at "Euclidean" distance if exactly one coordinate matches, and at "rectilinear" distance if both coordinates differ.

The distance between the check points of two adjacent nodes $\alpha$ and $\beta$ is given, as printed in the Appendix (p. 372), by

$$
d_{\alpha\beta}=
\begin{cases}
\sqrt{(x_\alpha-x_\beta)^2+(y_\alpha+y_\beta)^2}+(f-2e)\,\phi, & \text{Euclidean arc}\\[4pt]
\lvert x_\alpha-x_\beta\rvert+\lvert y_\alpha-y_\beta\rvert+(f-2e)(\phi+1), & \text{rectilinear arc}
\end{cases}
$$

where $e$ is the distance between a check point and the node it serves, $f$ is the length of the smoothed ramp needed to negotiate a turn, and $\phi=1$ if a turn is required at the check point of node $\alpha$ to reach node $\beta$ (otherwise $0$). The plus sign inside the second term of the Euclidean case is as printed. Because the rectilinear case uses a difference there, and a Euclidean distance requires one, it is most likely a typographical error in the paper. The approximation for $f$ in terms of the turning radius and maximum speed is not reproduced here.

![Figure A1. A guide path system: segments, merges, diverges, crossings, pickup and delivery points.](figureA1.png)

![Figure A2. A section of a guide path network: nodes, check zones, check points b1-b7 and ramps.](figureA2.png)

![Figure A3. Characterization of arcs according to orientation (Family One: straight, Family Two: L-shaped).](figureA3.png)

---

## 4. Structured summary

| Field | Value |
|---|---|
| Problem | AGV dispatching rules in a job shop with finite queues |
| Decision trigger | Both: vehicle-initiated and work-centre-initiated |
| Decision variable | Work centre to serve (vehicle-initiated); vehicle to send (work-centre-initiated) |
| Objective | Unit-load throughput; also buffer lengths and locking |
| Scale | 13 departments, 6 AGVs, one layout |
| Randomness: quay-crane cycle time | n/a |
| Randomness: travel time / congestion | Transition time depends on congestion (Appendix); form and any randomness not stated |
| Randomness: task arrival | Not stated in the paper (details deferred to ref. [8]) |
| Randomness: stowage / yard crane | n/a |
| Randomness: AGV breakdown | Not described in the paper |
| Battery | Not mentioned in the paper |
| Method | Discrete-event simulation of 15 rule combinations |
| Evaluation | 2 runs per combination, no confidence intervals |
| Authors' limitations | Traffic control, load transfer and other operational issues not addressed |

**Citation sentence supported by the paper:** *Egbelu and Tanchoco (1984) distinguished vehicle-initiated from work-centre-initiated dispatching and showed, in a simulated 13-department job shop with finite queues, that vehicle-initiated rules based on distance or queue size can lock the system, whereas MROQS and MFCFS did not.*

---

## 5. Our reading (interpretation, not from the paper)

### 5.1 What we can use

- **A precise vocabulary for our trigger.** In the paper's terms, our dispatcher ("an AGV has become empty, where should it go?") is a **vehicle-initiated** decision. The paper also says a full system needs the other class too, so we must decide what happens when a task appears while AGVs are idle.
- **Baseline candidates.** The closest vehicle-initiated analogues for a greedy baseline are STT/D (nearest task) and MFCFS (oldest request first). NV, FV and LIV answer a different question (which idle vehicle) and are not direct equivalents.
- **A testable hypothesis.** A distance-greedy vehicle-initiated rule may systematically starve some destinations when capacities are finite. Whether anything similar happens in a terminal is an empirical question for our simulator.
- **A methodological lesson.** Same rule combinations in Table 1 and Table 4 gave different throughputs (LIV-MROQS: 766, 763 vs 740, 754; LIV-MFCFS: 775, 770 vs 770, 783). Run-to-run variation of this size exceeds the gap between MROQS and MFCFS in the capacitated case, and the paper reports only two runs, so such small differences cannot be called significant. Our evaluation needs many seeds and confidence intervals.

Proposed mapping (our design choice, to be validated against what the other papers use):

| Paper concept | Possible terminal counterpart |
|---|---|
| Work centre | Quay crane (and/or yard block) |
| Unit load | Container |
| Vehicle-initiated decision | Empty AGV chooses a quay crane or yard block |
| STT/D | Nearest-task greedy dispatcher |
| MFCFS | Longest-waiting request first |
| MOQS / MROQS | Queue-pressure rules (needs a queue notion at quay cranes in our simulator) |

### 5.2 What this paper does not support

- **It is not evidence about stochastic disruption.** The failure it documents is structural (finite queues, layout, distance-based rules). The paper does not describe injecting disruptions, and it does not say whether job arrivals or processing times are random; simulation details are deferred to the first author's earlier dissertation (ref. [8]).
- **It does not show that "rule-based dispatching collapses under uncertainty."** Locking was caused by queue blocking and layout, and with infinite queues STT/D reached 669.
- **It does not prove anything formally.** The evidence is simulation of one layout with two runs per combination.
- **It does not show that a DRL dispatcher should be work-centre-initiated.** The paper says nothing about learning, and in its terms our decision is vehicle-initiated.
- **It does not compare layouts.** The claim that layout determines whether a rule locks is argued from a mechanism and illustrated on one layout.
- **It uses throughput, not quay-crane idle time, as its metric.**
- **It is not a port.** There are no cranes that vehicles must wait for, no handoff synchronisation, and no yard blocks.
