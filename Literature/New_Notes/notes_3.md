---
id: kim_2004
title: "A look-ahead dispatching method for automated guided vehicles in automated port container terminals"
authors: "Kap Hwan Kim, Jong Wook Bae"
venue: "Transportation Science, 38(2), 224-234"
year: 2004
doi: "10.1287/trsc.1030.0082"
paper_type: "Mathematical model, heuristic and simulation study"
domain: "Automated container terminal (hypothetical layout, Figure 1)"
trigger: "An AGV becomes free (vehicle-initiated in Egbelu and Tanchoco's sense), over known sequence lists"
decision_variable: "Static: assignment of transfer events to AGVs. Real time: which imminent task, among the next few per crane, the newly free AGV serves"
objective: "Lexicographic: total container-crane delay first, total AGV travel time second"
scale: "Simulation: 2 cranes, 100 operations per crane, 5 yard blocks, 3-7 AGVs. Heuristic against optimiser: 1-2 cranes, 2-4 AGVs, 10-20 operations"
randomness:
  qc_cycle_time: "Uniform noise of plus or minus delta times the mean on crane operation times, delta = 0 to 0.4"
  travel_time_congestion: "Travel times are fixed inputs (the paper cites Table 1, which does not contain them); congestion is explicitly excluded"
  task_arrival: "Task sequence fixed and known (sequence lists)"
  stowage: "Not modelled; the sequence list is given"
  agv_breakdown: "Not described in the paper"
  yard_crane_delay: "Excluded by assumption (no AGV queueing at yard cranes)"
  battery: "Not mentioned in the paper"
method: "MIP formulation, constructive heuristic (event delaying plus matching), look-ahead over the next few tasks in real time"
evaluation: "50 random instances against LINDO; 1,500 simulation runs (150 combinations x 10 replications); significance tests at the 1% level"
baselines: "STT/D, EDD and revised shortest imminent operation (r-SI)"
last_updated: "2026-10-05"
---

# A Look-Ahead Dispatching Method for Automated Guided Vehicles in Automated Port Container Terminals

**Kim & Bae (2004)** · *Transportation Science* 38(2), 224-234 · [DOI 10.1287/trsc.1030.0082](https://doi.org/10.1287/trsc.1030.0082)

> **How to read this note.** Sections 1-4 summarise what the paper says, by section, equation, table and figure number. Section 5 is *our* interpretation for the thesis and is labelled as such.

---

## Key takeaways

- **What it did:** formulated AGV dispatching in a container terminal with *known* crane sequence lists as a mixed-integer program, proposed a fast heuristic, and turned it into a real-time "look-ahead" dispatcher that re-plans each time an AGV becomes free.
- **Numbers to remember:** on 50 small random instances the heuristic's objective averaged 1.028 times the optimiser's (range 1.000-1.261) at about 0.01 of its run time (range 0.0001-0.03). In simulation (2 cranes, 100 operations each, 5 yard blocks, 3-7 AGVs, 1,500 runs) look-ahead cut crane delay sharply once there were more than 3 AGVs, with returns flattening beyond about 8-10 future tasks per crane. At 7 AGVs the other rules' delay was about 4.5 times that of look-ahead. Its travel time was about 75-85% of STT/D's, the best benchmark.
- **Used in the thesis for:** a delay-first objective with travel time as a tie-breaker; exact definitions of STT/D, EDD and r-SI; a complete heuristic that can serve as a classical baseline; and evidence on how far ahead it pays to look.
- **Not evidence for:** congestion or yard-crane effects, large fleets, learning-based dispatching, or the speed of the exact model in seconds.

---

## 1. Summary in five points

1. The paper treats ship operations as a **known sequence of crane transfers**: each crane's order of discharging and loading operations is fixed in advance, so AGV tasks and their order are known.
2. Because of that, the authors say the **conventional dispatching rules of Egbelu and Tanchoco cannot be used**; AGVs have to be dispatched in advance using information about future tasks.
3. The dispatching problem is a **static MIP** whose objective puts crane delay far above AGV travel time (Eq. 1), followed by a **heuristic** that delays event times just enough to keep an assignment feasible and then minimises travel by solving an assignment problem.
4. For real-time use the paper adopts a **Δ-step look-ahead**: when an AGV becomes free, only the next few tasks are considered, the plan is recomputed with updated event-time estimates, and only the newly free AGV is committed.
5. In simulation, look-ahead beats three myopic rules (STT/D, EDD, r-SI) on both delay and travel time, in deterministic and noisy conditions, but only a hypothetical terminal with 3-7 AGVs was tested.

---

## 2. What the paper does

### 2.1 Setting and problem (Introduction)

An automated terminal uses container cranes (CCs), AGVs and automated yard cranes (AYCs). In **discharging**, a CC places a container on an AGV, which carries it to the marshalling yard where an AYC stacks it; **loading** runs in reverse. An AGV's task is to deliver one container from the apron to the yard (discharging) or from the yard to the apron (loading).

Before a ship is worked, a crane work schedule is built from the bay profile, and a **working sequence list** then fixes the order of individual discharging and loading operations, which are carried out in that order. There is no buffer space at pickup and dropoff points, so an AGV waits at the point until the crane completes the transfer, and a CC is delayed when no AGV is ready. The aim is to minimise CC delay and AGV travel time together.

The authors state three properties of the problem:

1. Tasks must be carried out in exactly the order of the sequence list.
2. Minimising CC delay has **higher priority** than minimising AGV travel time, because a CC is much more expensive than an AGV or AYC and is usually the bottleneck.
3. A delay in one transfer by a CC delays all of that CC's later transfers by the same amount.

They cite Egbelu and Tanchoco's two classes (vehicle-initiated rules, triggered when an idle vehicle appears; work-centre-initiated rules, applied when a task becomes available) and argue that neither can be used here, because AGVs must be dispatched in advance using future tasks. They also note that most earlier AGV studies assumed pickup calls arrive randomly with no advance knowledge of their order.

**Assumptions:**
1. Every AGV can serve more than one CC; none is dedicated to a crane.
2. All AGVs are identical and carry one container at a time.
3. Queueing of AGVs under AYCs is not considered. The authors justify this because AYCs are usually not the bottleneck and modelling AYC operation times would make the problem much more complicated.
4. The time between a CC releasing a container onto an AGV and picking up from the next waiting AGV is negligible.
5. Congestion among AGVs on the guide paths is not considered, because interference is difficult to anticipate without scheduling and controlling detailed vehicle movements.

![Figure 1. A layout of an automated port container terminal: five crane working positions on the apron, a one-way AGV guide path, and yard blocks A to E with one AYC each and a pickup/dropoff position at the seaside end of each block.](figure1.png)

### 2.2 Static formulation (Sec. 1, Eqs. 1-7)

A container crane's operations are **events**: for the $i$th operation of CC $k$, event $e_i^k$ is the moment an AGV transfers the container, that is, the start of a pickup from an AGV (loading) or the start of a release onto an AGV (discharging). Its time is $y_i^k$, a decision variable; with no delay it equals the earliest possible event time $s_i^k$ (Table 1, Figure 2).

![Figure 2. The progress of the ship operation of CC 1 and its events: at times 0, about 220, about 240 and 450 an empty AGV must be ready under the crane.](figure2.png)

**Table 1. An example of a working sequence list** ($s$ = earliest possible event time without delay; L loading, D discharging; ship location is ship-bay/row/tier, yard location is yard block/yard-bay/row/tier).

| CC 1 task | Type | Ship location | Yard location | Operation cycle time | $s_i^1$ |
|---|---|---|---|---|---|
| 1 | L | 12/03/04 | C/21/3/2 | 120 | 0 |
| 2 | D | 12/04/10 | B/17/4/3 | 120 | 220 |
| 3 | L | 12/03/06 | C/07/4/1 | 110 | 240 |
| 4 | D | 12/04/08 | C/21/3/1 | 120 | 450 |

| CC 2 task | Type | Ship location | Yard location | Operation cycle time | $s_i^2$ |
|---|---|---|---|---|---|
| 1 | L | 19/05/02 | B/07/3/2 | 135 | 0 |
| 2 | D | 19/06/12 | B/17/3/2 | 135 | 250 |
| 3 | L | 19/05/04 | B/11/3/2 | 90 | 270 |
| 4 | D | 19/06/10 | C/11/3/2 | 110 | 450 |

**Notation.** $V$ is the set of AGVs and $K$ the set of CCs; CC $k$ has $m_k$ tasks. $e_j^O$ is the starting event of AGV $j$ and $e^F$ a stopping event. $t_{ki}^{lj}$ is the pure travel time from the location of $e_i^k$ to that of $e_j^l$, and $c_{ki}^{lj}$ is the time an AGV needs to be ready for $e_j^l$ after experiencing $e_i^k$ (travel, yard-crane release time where relevant, and travel to the crane); $c$ is a constant that does not depend on event times. With $K'=\{O\}\cup K$ and $K''=\{F\}\cup K$, the binary variable $x_{ki}^{lj}=1$ if event $e_i^k$ is assigned to event $e_j^l$, meaning the AGV that has just delivered the $i$th container of CC $k$ is next scheduled to deliver the $j$th container of CC $l$. Let $\alpha$ be the travel cost per unit time of an AGV and $\beta$ the penalty per unit time of delay, with $\alpha \ll \beta$.

$$
\min\ \alpha\sum_{k\in K'}\sum_{i=1}^{m_k}\sum_{l\in K''}\sum_{j=1}^{m_l} t_{ki}^{lj}\,x_{ki}^{lj}\;+\;\beta\sum_{k\in K}\bigl(y_{m_k}^{k}-s_{m_k}^{k}\bigr)^{+}\tag{1}
$$

subject to

$$
\sum_{l\in K''}\sum_{j=1}^{m_l}x_{ki}^{lj}=1,\qquad \forall k\in K',\ i=1,\dots,m_k\tag{2}
$$

$$
\sum_{k\in K'}\sum_{i=1}^{m_k}x_{ki}^{lj}=1,\qquad \forall l\in K'',\ j=1,\dots,m_l\tag{3}
$$

$$
y_j^{l}-\bigl(y_i^{k}+c_{ki}^{lj}\bigr)\ \ge\ M\bigl(x_{ki}^{lj}-1\bigr),\qquad \forall k\in K',\ l\in K,\ i=1,\dots,m_k,\ j=1,\dots,m_l\tag{4}
$$

$$
y_{i+1}^{k}-y_i^{k}\ \ge\ s_{i+1}^{k}-s_i^{k},\qquad \forall k\in K,\ i=1,\dots,m_k-1\tag{5}
$$

$$
y_i^{k}\ \ge\ s_i^{k},\qquad \forall k\in K',\ i=1,\dots,m_k\tag{6}
$$

$$
x_{ki}^{lj}\in\{0,1\}\tag{7}
$$

with $s_i^O=0$ and $y_i^O=0$ for all AGVs.

**How the paper explains it.** Because $\alpha\ll\beta$, the sum of crane delays is minimised first and, for the same delay, total AGV travel is minimised. Constraints (2) and (3) force a one-to-one assignment between the events in $S\cup T$ (supply side) and those in $D\cup T$ (demand side). Constraint (4) says two events served consecutively by the same AGV must be at least $c$ apart; it does not restrict starting events or stopping assignments. Constraint (5) says two events of the same CC must be at least as far apart as the crane needs for the movements between them. Constraint (6) says the actual event time is never earlier than the earliest possible one.

The assignment variables carry no AGV index, but a solution can be read as per-AGV task chains. In the paper's example with 2 CCs, 2 AGVs and 2 tasks each, AGV 1 starts, serves CC 2's first operation, then CC 1's second operation, and stops; AGV 2 serves CC 1's first operation, then CC 2's second, and stops (Figure 3).

![Figure 3. A graphical representation of a feasible solution for the assignment variables: supply-side nodes (AGV starts and crane events) are matched one-to-one with demand-side nodes (crane events and AGV stops).](figure3.png)

**Size and complexity.** The formulation has about $\bigl(\sum_{k=1}^{|K|+1} m_k\bigr)^2$ variables and $2\bigl(\sum_{k=1}^{|K|+1} m_k\bigr)^2$ constraints. The authors note its similarity to parallel-machine scheduling with sequence-dependent setup times and parallel precedence chains, and to the multiple travelling salesmen problem with precedence constraints and time windows, and say both "must be NP-hard"; no proof is given. A heuristic is therefore proposed.

### 2.3 The heuristic (Sec. 2)

Given event times $y$ (initially equal to $s$), events are sorted by increasing $y$, and $T_\xi$ denotes the first $\xi$ events. The constraint subset $\xi$ of (2)-(4) is:

$$\sum_{i\in S\cup T_\xi}x_{ij}=1,\ \ j\in D\cup T_\xi\tag{8}$$

$$\sum_{j\in D\cup T_\xi}x_{ij}=1,\ \ i\in S\cup T_\xi\tag{9}$$

$$y_j-(y_i+c_{ij})\ge M(x_{ij}-1),\ \ i\in S\cup T_\xi,\ j\in T_\xi\tag{10}$$

$$x_{ij}\in\{0,1\}\tag{11}$$

**Procedure.**

1. *Initialise:* $y_i^k=s_i^k$, $y_i^O=0$, $\xi=0$.
2. *Next task:* set $\xi=\xi+1$; if $\xi$ exceeds the number of events, go to Step 5; otherwise sort events by $y$.
3. *Feasibility check* of (8)-(11): if feasible, go to Step 2, otherwise Step 4.
4. *Delay event times:* compute

$$
\pi_{i^{*}\xi}=\min_{i\in S\cup T_{\xi-1}}\Bigl[\max\bigl\{c_{i\xi}-(y_\xi-y_i),\,0\bigr\}\Bigr]
$$

   and add $\pi_{i^*\xi}$ to the time of event $(\xi)$ and to all later events of the same crane. Return to Step 3.
5. *Task assignment:* evaluate $t_{ij}$ and solve an assignment problem that minimises total travel, subject to the full constraint set.

In words: events are processed in time order, and whenever the next event cannot be given an AGV, it is postponed by the *smallest* amount that lets at least one earlier-event AGV reach it in time. Feasibility is checked as a **maximum cardinality matching** in the bipartite graph (Evans and Minieka, 1992): the subset is feasible if the matching size equals $|S\cup T_\xi|$. The authors say other delay choices might give better final solutions but only the minimum delay was used to reduce the search space, which they consider reasonable because the primary objective is the total delay of the cranes. The two steps can be read as event-by-event minimisation of $(y_\lambda^\gamma-s_\lambda^\gamma)^{+}$ subject to (2)-(7) (Eq. 12).

**Worked example (4 AGVs, Table 1).** Starting from $(y_1^1,\dots,y_4^1;\,y_1^2,\dots,y_4^2)=(0,220,240,450;\,0,250,270,450)$: at $\xi=1$ there is no feasible assignment and the delays are $(310,310,350,350)$ for the four AGVs' initial positions, so $\pi=310$ and the first crane's events shift by 310. At $\xi=2$ the delays are $(390,390,430,430)$, so $\pi=390$ and the second crane's events shift by 390, giving $(310,530,550,760;\,390,640,660,840)$. The process repeats until $\xi$ exceeds 8. The paper states that for this example the heuristic matches the optimal solution of (1)-(7) in total crane delay and total travel time.

### 2.4 Heuristic against the optimiser (Sec. 2)

Fifty random problems with 1 to 2 CCs, 2 to 4 AGVs and 10 to 20 transfer operations were solved by the heuristic and by LINDO on a Pentium II MMX 266 PC. The ratio of the heuristic's objective to LINDO's ranged from 1.000 to 1.261 with an average of **1.028**; the ratio of computation times ranged from 0.0001 to 0.03 with an average of **0.01**. Absolute run times are not given.

### 2.5 Real-time use: look-ahead dispatching (Sec. 2)

The formulation assumes deterministic equipment times, but real operation times are uncertain, so the authors argue it is meaningless to schedule every task in the sequence lists; looking ahead a few tasks is enough. Tasks are performed in list order, and **the dispatching procedure is triggered when an AGV becomes free**. Only the most imminent Δ tasks are considered ("Δ-step look-ahead dispatching"; the experiments call this number NFT, the number of future tasks per crane). A control system is assumed to monitor progress and update event-time estimates whenever an AGV becomes free or a task completes. The heuristic is run, and **only the newly available AGV is committed** to its delivery.

### 2.6 Simulation design (Sec. 3)

- **Terminal:** hypothetical, as in Figure 1: five crane working positions, five yard blocks, one AYC per block that transfers only at the pickup/dropoff position in front of its block. Transfer time is 20 s per container. AGV travel times are treated as given inputs (Sec. 3 points to Table 1, which lists sequence lists and contains no travel times); blocking and congestion are not considered. After a task, an idle AGV stays at its dropoff location.
- **Factors:** number of AGVs (3 to 7 in Figures 4-9); NFT (4, 6, 8, 10, 12, 14); and uncertainty $\delta$ (0, 0.1, 0.2, 0.3, 0.4), where crane operation times are drawn from
$$\text{Uniform}\bigl(\text{mean}-\delta\times\text{mean},\ \text{mean}+\delta\times\text{mean}\bigr)\tag{13}$$
 This gives 150 combinations; each has 10 replications, so 1,500 runs.
- **Instance size:** 2 CCs, 100 operations per CC, 5 blocks. Pickup and dropoff points of cranes and yard cranes are chosen at random in each replication, and loading and discharging alternate.

### 2.7 Results (Sec. 3)

Figures 4 to 9 give the following; numbers marked ≈ are read off the graphs and are approximate.

![Figure 4. The effects of the NFTs for looking ahead on the sum of delay times, for 3 to 7 AGVs.](figure4.png)

![Figure 5. The effects of the NFTs for looking ahead on the average total travel time.](figure5.png)

**Effect of looking ahead (Figures 4 and 5; each point averages 50 runs).**
- With few AGVs, looking further ahead did not reduce delay. With more than 3 AGVs, delay fell as NFT grew (tested at the 1% level), but the reduction diminished as NFT increased. With 7 AGVs, delay falls from ≈7.6k s at NFT 4 to ≈2.3-2.6k s at NFT 10-14; with 3 AGVs it stays near ≈24-25k s.
- Total travel time rises with NFT (also tested at the 1% level), opposite to the delay trend. The authors attribute this to the algorithm minimising delay first, and conclude that using more tasks to cut delay hurts travel distance. The rise is small (for example ≈95k to ≈97k s with 7 AGVs).

![Figure 6. The effects of the degree of uncertainties of operation times on the sum of delay times.](figure6.png)

![Figure 7. The effects of the degree of uncertainties of operation times on the total travel time.](figure7.png)

**Effect of uncertainty $\delta$ (Figures 6 and 7).**
- With few AGVs (vehicles overloaded, AGVs the bottleneck), more variance did not raise delay. With more AGVs delay rose with $\delta$, supported at the 1% level for 5, 6 and 7 AGVs (for example ≈6.6k to ≈7.5k s with 5 AGVs; ≈3.4k to ≈3.9k s with 7).
- Travel time was insensitive to $\delta$ at every fleet size.

**Comparison with conventional rules.** Each benchmark picks, among the most imminent task of each CC, the task with the smallest value of $Z_i^k$ for the newly free AGV at location $o$, where $t(x,y)$ is travel time, $a_i^k$ is the apron transfer location (discharging) and $b_i^k$ the yard transfer location (loading):

| Rule | Discharging | Loading |
|---|---|---|
| STT/D (shortest travel time/distance) | $Z_i^k=t(o,a_i^k)$ | $Z_i^k=t(o,b_i^k)$ |
| EDD (earliest due date) | $Z_i^k=s_i^k$ | $Z_i^k=s_i^k$ |
| r-SI (revised shortest imminent operation) | $Z_i^k=s_i^k-t(o,a_i^k)$ | $Z_i^k=s_i^k-t(o,b_i^k)-(\text{AYC transfer time})-t(b_i^k,a_i^k)$ |

![Figure 8. Comparison of the total delay times for various dispatching methods (look-ahead with NFT = 10 against EDD, STT/D and r-SI).](figure8.png)

![Figure 9. Comparison of the total travel times for various dispatching methods.](figure9.png)

- NFT was 10 for look-ahead; values average 10 replications of 25 problems with different parameter combinations.
- Look-ahead significantly outperformed the other rules in total delay (null hypothesis of no difference rejected at the 1% level). At 7 AGVs the other rules' delay was about 4.5 times that of look-ahead.
- It also significantly outperformed them in total travel time (again at the 1% level). Look-ahead's travel time decreased as AGVs were added, while the others' did not change. STT/D had the lowest travel time of the three rules.
- The paper says look-ahead reduced STT/D's travel time "by 75%-85%". Figure 9 shows look-ahead's travel time at roughly 75-86% of STT/D's (see 2.9).
- The gaps in delay and travel time between look-ahead and each rule were significant and did not change as $\delta$ changed (reported in the text, with no figure).

Approximate readings from Figures 8 and 9:

| AGVs | Look-ahead delay (s) | Best benchmark delay (s) | Look-ahead travel (s) | STT/D travel (s) |
|---|---|---|---|---|
| 3 | ≈24.4k | ≈41k (STT/D) | ≈110k | ≈128.5k |
| 4 | ≈12.2k | ≈29k (STT/D) | ≈108k | ≈128k |
| 5 | ≈5.6k | ≈20.5k (STT/D) | ≈104k | ≈129k |
| 6 | ≈3.3k | ≈15.8k (all three alike) | ≈100k | ≈129k |
| 7 | ≈2.6k | ≈11.8k (all three alike) | ≈97k | ≈130.5k |

EDD and r-SI travel times are about 160k s at every fleet size.

### 2.8 Conclusions and future work (Sec. 4)

The authors conclude that a static formulation and a heuristic were developed, that the heuristic needed about 0.01% of the optimiser's time with objective values less than 10% higher on average, and that the simulation showed advantages over conventional dispatching rules in both deterministic and stochastic environments. Future work: synchronising AGV travel with **yard-crane operations** as well as container-crane operations, and extending the approach to a general case with several material-handling machines that must be synchronised without buffers between them.

### 2.9 Inconsistencies in the printed paper

- **Worked example.** After $\xi=1$ the printed vector ends in $y_4^2=760$, but Table 1 gives $s_4^2=450$, and the next step's value 840 equals $450+390$. The 760 appears to be a typographical error for 450.
- **"75%-85%".** The text says look-ahead reduced STT/D's total travel time by 75%-85%, whereas Figure 9 puts look-ahead at roughly 75-86% *of* STT/D's travel time (a reduction of about 14-26%). The text most likely means "to".
- **Time ratio.** Sec. 2 gives an average computation-time ratio of 0.01 (1% if read as a fraction), whereas the Conclusion says 0.01%. The two differ by a factor of 100 unless the Sec. 2 figure is itself a percentage; 0.01% corresponds to the lowest ratio in the reported range (0.0001).
- **Distance and time.** The text speaks of "total travel distance" while Figures 5, 7 and 9 show total travel time.
- **Travel-time inputs.** Sec. 3 says the AGV travel times between pickup and dropoff points are provided in Table 1, but Table 1 holds the example sequence lists (ship and yard locations, cycle times, earliest event times) and contains no travel times. The paper has no other table, so the travel-time inputs are not given.

---

## 3. Structured summary

| Field | Value |
|---|---|
| Problem | Dispatching AGVs to crane transfer tasks with known sequence lists |
| Decision trigger | An AGV becomes free |
| Decision | Static: event-to-event assignment. Real time: which of the imminent tasks (next few per crane) the newly free AGV serves |
| Objective | Total CC delay (weight $\beta$) first, total AGV travel time (weight $\alpha \ll \beta$) second |
| Scale | Simulation: 2 CCs, 100 operations each, 5 blocks, 3-7 AGVs |
| Randomness: quay-crane cycle time | Uniform noise of plus or minus $\delta$ times the mean, $\delta \le 0.4$ |
| Randomness: travel time / congestion | Travel times fixed (values not given in the paper); congestion excluded |
| Randomness: task arrival | Sequence fixed and known |
| Randomness: stowage / yard crane | Not modelled / excluded by assumption |
| Randomness: AGV breakdown, battery | Not described / not mentioned in the paper |
| Method | MIP, constructive heuristic, look-ahead re-planning |
| Evaluation | 50 small instances against LINDO; 1,500 simulation runs; tests at the 1% level |
| Benchmarks | STT/D, EDD, r-SI |
| Authors' stated future work | AGV synchronisation with yard cranes; wider equipment synchronisation |

**Citation sentence supported by the paper:** *Kim and Bae (2004) proposed a heuristic look-ahead dispatching procedure for AGVs, based on a mixed-integer formulation with crane delay prioritised over AGV travel, and showed in simulation of a hypothetical terminal with three to seven AGVs that it reduced both delay and travel time relative to shortest-travel, earliest-due-date and shortest-imminent-operation rules.*

---

## 4. What the paper does not support

- **It is not a proof that look-ahead reduces delay.** The evidence is a simulation of one hypothetical terminal (2 cranes, 5 blocks, 3-7 AGVs), with significance tests at the 1% level. The gains appear only when AGVs are not the bottleneck and flatten by about 8-10 future tasks.
- **It gives no absolute run times.** The exact model's speed is described qualitatively ("excessive computational time"); times are reported only as a ratio on instances of 10-20 operations, on 1990s hardware. Nothing in the paper shows that a decision takes a minute or more.
- **It does not show that congestion or yard cranes are impossible to include in a MIP.** They are excluded by assumption, with reasons given, and yard-crane synchronisation is listed as future work.
- **Uncertainty is narrow.** Only crane operation times are randomised (uniform, up to ±40%). Travel times are fixed, congestion is excluded, and breakdowns, battery and stowage effects are not described. The benchmark gap against $\delta$ is reported in text only.
- **It says nothing about scale.** Fleet sizes of 3-7 do not inform fleets of tens or hundreds of AGVs.
- **The simulation cannot be reproduced from the paper alone.** The AGV travel-time inputs are not given (Sec. 3 cites Table 1, which does not contain them), and the cycle times used in the 100-operation lists are not stated (Table 1 is only an example list).
- **It is not learning-based, and its benchmarks are all myopic rules.** No other look-ahead, optimisation-based or learned dispatcher is compared.
- **It relies on a known task sequence.** Its methods are not designed for dispatching without sequence lists.
- **It does not name the statistical test** behind its significance statements.

---

## 5. Our reading (interpretation, not from the paper)

### 5.1 What we can use

- **An objective precedent.** Putting crane delay far above AGV travel time (Eq. 1) is the closest published analogue of minimising quay-crane idle time. By constraint (5) and Property 3, a delay in one event is passed unchanged to all later events of the same crane, so the term $(y_{m_k}^k-s_{m_k}^k)^+$ is that crane's accumulated delay, which is essentially its total waiting for AGVs (our derivation, not stated in this form in the paper).
- **A way to define delay.** The event-based view (earliest possible event time $s$, actual time $y$) gives a precise definition of crane delay that can be reused in our simulator and reward.
- **Baseline definitions.** STT/D, EDD and r-SI are given exactly, with the candidate set restricted to each crane's most imminent task. This candidate set differs from Egbelu and Tanchoco's STT/D, so the two should not be conflated. The heuristic in 2.3 is complete enough to implement as a classical baseline; it is the paper's deployable method, whereas the MIP is only a static reference solved on small instances.
- **A look-ahead depth parameter.** NFT is a design parameter with diminishing returns beyond about 8-10 and a small travel-time cost; any agent that sees upcoming tasks has the same trade-off.
- **An experiment template.** Uniform noise of ±δ on crane operation times, replications per setting and fleet sizes spanning the bottleneck regime.
- **A dwell-point data point.** Idle AGVs stay where they delivered; there is no repositioning decision.
- **A link to our action space.** Here the decision is which crane's imminent task the newly free AGV takes; the task type then fixes where the AGV goes (the yard for loading, the apron for discharging).
