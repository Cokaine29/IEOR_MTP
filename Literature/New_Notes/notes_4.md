---
id: briskorn_2006
title: "Inventory-based dispatching of automated guided vehicles on container terminals"
authors: "Dirk Briskorn, Andreas Drexl, Sönke Hartmann"
venue: "OR Spectrum, 28, 611-630"
year: 2006
doi: "10.1007/s00291-006-0033-8"
paper_type: "Assignment formulations and simulation study"
domain: "Automated container terminal, waterside only (configuration similar to HHLA Altenwerder)"
trigger: "An event in the control system, mainly the completion of a job (an AGV becomes free); assignments to AGVs that are not yet free are provisional"
decision_variable: "Assignment of the n most urgent jobs to n AGVs (free or soon free), one job per AGV; the quay crane whose job is served is chosen by the due-time rule or the inventory rule"
objective: "Waterside productivity, pursued through assignment costs: weighted earliness, tardiness and empty travel (due-time model) or urgency-weighted time to pick-up (inventory model)"
scale: "Simulation: 10 quay cranes, 20 stacking cranes, 40 AGVs; about 4.6 AGVs per assignment on average"
randomness:
  qc_cycle_time: "Modelled: crane handover times and the time before the crane is ready for the next handover are drawn from distributions (modified Altenwerder statistics); parameters not given"
  travel_time_congestion: "Modelled: an AGV driving-time distribution for every origin-destination pair, covering interference and congestion; parameters not given"
  task_arrival: "Jobs created at 60 per hour per quay crane (about the technical maximum), so throughput is set by the dispatching strategy; estimated AGV availability times carry random error"
  stowage: "Precedence relations between loading jobs (reflecting stowage plans) are varied in five scenarios; every crane receives the same job rate"
  agv_breakdown: "Not described in the paper"
  yard_crane_delay: "Modelled: stacking-crane transfer times from distributions that implicitly include shuffling and landside work"
  battery: "Not mentioned in the paper"
method: "Assignment problems (Hungarian method and a greedy rule) under two cost formulations, with a dual-cycle extension, evaluated in discrete-event simulation"
evaluation: "100 runs of 11 hours per approach with warm-up and cool-down; results relative to a greedy baseline; no confidence intervals or significance tests reported"
baselines: "dueTimePrio (greedy due-time rule), dueTimeHung (Hungarian method on the same due-time costs), and a version without look-ahead"
last_updated: "2026-10-05"
---

# Inventory-Based Dispatching of Automated Guided Vehicles on Container Terminals

**Briskorn, Drexl & Hartmann (2006)** · *OR Spectrum* 28, 611-630 · [DOI 10.1007/s00291-006-0033-8](https://doi.org/10.1007/s00291-006-0033-8)

> **How to read this note.** Sections 1-4 summarise what the paper says, by section, equation, table and figure number. Section 5 is *our* interpretation for the thesis and is labelled as such.

---

## Key takeaways

- **What it did:** compared two ways of assigning jobs to AGVs in real time. The conventional one uses job due times and an earliness-tardiness cost. The new one treats each quay crane's AGV buffer as an inventory and sends the next AGV to the crane with the lowest inventory level. Both reduce to the same kind of assignment problem, solved with the Hungarian method.
- **Numbers to remember:** productivity relative to the greedy due-time rule (index 1): Hungarian on the due-time costs 1.010-1.018; inventory-based 1.045-1.075; inventory-based with forced dual cycles 1.049-1.229, largest with few or no precedence relations (1.183-1.229). Considering AGVs that will soon be free (look-ahead) adds about 9-11%. The Hungarian method took under 0.001 s on average per assignment (maximum 0.016 s), with about 4.6 AGVs per assignment. Setting: 10 quay cranes, 20 stacking cranes, 40 AGVs, 100 runs of 11 hours per approach.
- **Used in the thesis for:** a simple, fast, fully specified benchmark policy; ideas for state features (AGVs assigned to or heading for each crane); a set of four performance measures; evidence on the value of looking ahead; and a simulation design with realistic stochastic inputs.
- **Not evidence for:** proof that time-based methods fail, elimination of time estimates, gains for large fleets, or anything about learning-based or multi-agent dispatching.

---

## 1. Summary in five points

1. The paper targets **real-time AGV assignment** on a waterside terminal, with three requirements: high waterside productivity, very short computation times, and robustness to an unpredictable environment (crane delays, inaccurate travel-time estimates, manual interference).
2. It compares a **due-time formulation** (earliness, tardiness and empty travel costs) with an **inventory formulation** that avoids due times and tardiness estimates; both are assignment problems with *n* jobs and *n* AGVs and differ only in how the jobs are chosen and how costs are defined.
3. The inventory rule sends an AGV to the crane whose buffer is most likely to be empty on arrival, measured by the number of AGVs already assigned to, or on their way to, that crane.
4. In simulation, the inventory formulation gave higher productivity than the due-time formulation even when both used the same algorithm, but only by a few percent; forcing **dual cycles** gave much larger gains when precedence relations were few.
5. The authors conclude that the inventory approach is more robust and easier to run, because frequent updates of time estimates are not needed.

---

## 2. What the paper does

### 2.1 Setting and problem (Sec. 1-2)

The study was carried out with the HHLA Container Terminal Altenwerder in Hamburg and considers a similar configuration: quay cranes, AGVs (which cannot load or unload themselves) and automated stacking cranes serving yard blocks. Only the **waterside** is considered (discharging from and loading onto vessels); the landside is excluded.

![Figure 1. Layout of the container terminal: vessels along the quay, quay cranes with AGV waiting buffers, AGV lanes, handover lanes and stacking cranes serving the stacking area.](figure1.png)

A **job** is the transport of one container from a pick-up to a delivery location: an empty drive to the pick-up, a handover there, a loaded drive, and a handover at the delivery. For discharging, pick-up is at a quay crane and delivery at a stack; for loading, the reverse. Both locations are fixed for each job, so assignment decisions influence only the empty drive. An AGV carries one container at a time. Estimates of driving and handover times are assumed to be available where a method needs them.

There may be **precedence relations** between loading jobs of the same crane (from the stowage plan), usually for some but not all pairs; there are none between discharging jobs. The quay cranes in the simulation are each either loading or discharging, so a crane never discharges directly after loading in the same ship bay.

**Rolling decisions.** The assignment considers *n* AGVs: those that are free and those that will soon complete their current job (a look-ahead), each with an estimated wait until availability. Which AGVs count as "soon free" depends on events in the progress of the current job, not on a time horizon. Only the *n* most urgent jobs are considered. A new assignment is computed whenever an event occurs, mainly a job completion. If a job is assigned to a currently available AGV, the assignment is fixed and the AGV starts; if it is assigned to an AGV that is not yet available, it is not fixed, and both are reconsidered after the next event. The authors say this makes the decision to execute a job as late as possible and, with unreliable estimates, leads to a short planning horizon and one job per AGV instead of a sequence.

The overall goal is waterside productivity (containers per hour handled by the quay cranes), which cannot be used directly as an objective. Candidate goals are: minimise crane waiting for AGVs, minimise AGV waiting at cranes, minimise empty travel, and spread AGVs evenly over cranes.

### 2.2 Due-time approach (Sec. 3)

Each job *j* has a due time $d_j$, the time an AGV should reach the quay crane (empty for discharging, loaded for loading); a job's due time is later than those of its predecessors. Early arrival wastes AGV capacity; late arrival makes the crane wait. With weights $\alpha_E$, $\alpha_T$, $\alpha_e$ for earliness, tardiness and empty travel, the cost of giving AGV *a* to job *j* is

$$
c_{ja}=\begin{cases}\alpha_E\,(d_j-f_j^{q})+\alpha_e\,e_{ja}, & f_j^{q}<d_j\\[4pt]\alpha_T\,(f_j^{q}-d_j)+\alpha_e\,e_{ja}, & \text{otherwise}\end{cases}\tag{1}
$$

where $e_{ja}$ is the empty travel time and $f_j^q$ the estimated arrival time at the quay crane: $f_j^q=w_a+e_{ja}$ for discharging and $f_j^q=w_a+e_{ja}+h_{SC}+t_{ja}$ for loading, with $w_a$ the AGV's estimated wait for availability, $h_{SC}$ the stacking-crane handover time and $t_{ja}$ the transport time. The $n$ jobs are the $n$ not-yet-started jobs with the earliest due times.

Two solution methods are used: the **Hungarian method** (optimal for costs (1)) and a **greedy priority rule** (repeatedly take the job with the smallest due time, give it the cheapest AGV, remove both), which serves as the benchmark. The AGV assignment decides which empty AGV does which job but not which container it receives; the paper assumes stacking cranes prefer containers with earlier due times.

### 2.3 Inventory approach (Sec. 4)

**Idea.** The buffer in front of each quay crane is a store, the quay crane is a customer, and the goods are AGVs. As in inventory management, no customer should run out (no crane waiting), but the level should not be too high either, because AGVs are tied up in stock. The **inventory level for assignment** of crane *q*, $ila_q$, is the number of AGVs busy with a job of *q* that have not yet reached *q*. For a loading crane this includes AGVs waiting in the buffer, carrying a container toward it, waiting for a container at a stack, or driving to a stack to fetch one; for a discharging crane it includes empty AGVs in the buffer or on their way.

**Rule.** When an AGV needs a job, give it the first unassigned job of the crane with the smallest inventory level. Because reaching a loading crane takes much longer than reaching a discharging one, loading cranes' levels are divided by a **phase factor** $\varphi$:

$$
ila'_q=\frac{ila_q}{\varphi}\ \text{(loading cranes)},\qquad ila'_p=ila_p\ \text{(discharging cranes)}
$$

Ties go to the crane whose last AGV started longest ago. The levels can be adjusted for operational priorities (for example a crane with the longest remaining job list).

**Procedure.** (1) Determine the $n$ AGVs that are free or soon free. (2) Select $n$ jobs: repeatedly take the crane with the lowest $ila'$, choose among its jobs one whose predecessors are all assigned, in transport or finished, mark it assigned and temporarily increase that crane's $ila'$ by one; the order of selection gives each job an ordinal number $o_j$. (3) Solve a linear assignment problem with Hungarian costs

$$
c_{ja}=\bigl(\lambda\,(n-o_j)+1\bigr)\,(w_a+e_{ja})
$$

so that urgent jobs (small $o_j$) and AGVs that need long to reach the pick-up are expensive; $\lambda$ weights urgency.

**Stacking-crane decision.** A second level, $ilt_q$, counts AGVs driving straight toward loading crane *q* after collecting a container for it; a stacking crane serves the loading crane with the lowest $ilt_q$ among those with containers on its stack, respecting precedence and relaxing requirements stepwise if none qualifies.

### 2.4 Enforcing dual cycles (Sec. 4.4)

A **dual cycle** is an AGV delivering a container to a stack and taking a new job whose pick-up is at that same stack, so its empty drive is a dummy. Dual cycles are possible only at stacks. Before the normal assignment, an AGV available at a stack is given the most urgent job at that stack whose predecessors are assigned or completed, provided the job's crane is urgent enough:

$$
ila'_{q_j}\le(1-\tau)\,ila^{\min}_{all}+\tau\,ila^{\max}_{all}\tag{2}
$$

$$
ilt_{q_j}\le(1-\sigma)\,ilt^{\min}_{loading}+\sigma\,ilt^{\max}_{loading}\tag{3}
$$

with $0\le\tau,\sigma\le1$. The authors note two drawbacks: urgency is partly ignored, which can unbalance inventory levels, and AGVs are drawn to loading cranes that would otherwise have gone to discharging ones, so the phase factor $\varphi$ has to be readjusted.

### 2.5 Simulation model and design (Sec. 5.1-5.2)

The model (DESMO-J, discrete-event, in Java) has three flows:
- **Quay cranes** loop between handling containers and waiting for AGVs, characterised by three distributions: handover time to load discharged containers onto AGVs, handover time to take containers from AGVs for loading, and the time before the crane is ready for the next handover (which includes the container's trip to or from the vessel).
- **Stacking cranes** are not modelled explicitly; distributions for the transfer times AGVs wait at stacks implicitly contain shuffling and landside work.
- **AGVs** only drive. A driving-time distribution is registered for each pair of positions and covers interference and congestion. An estimated availability time is also generated for each handover, with both the lead time and the error of the estimate controlled by distributions.

Distributions come from statistics of the Altenwerder terminal, modified for confidentiality. A further description is in a separate report.

**Design.** Four methods are compared: *dueTimePrio* (greedy due-time rule), *dueTimeHung* (Hungarian method on the same costs, used to separate the effect of the algorithm from the effect of the formulation), *inv* (inventory), and *invDualCycle* (inventory with forced dual cycles). Five precedence structures are used: none ("without"), "linear" (a single available job per crane), and three partial structures ("many", "medium", "few"). Each scenario has 20 stacking cranes and 40 AGVs; ten quay cranes (five loading, five discharging) are placed randomly on twenty possible positions, and 60 jobs per hour per crane are created, roughly a crane's maximum technical productivity. Four measures are reported: waterside productivity, crane waiting times, AGV waiting times and empty travel times.

Parameters were chosen after preliminary experiments that varied each in turn, then fixed:

| Due-time approach (Table 1) | Value |
|---|---|
| earliness weight $\alpha_E$ | 1 |
| tardiness weight $\alpha_T$ | 7.5 |
| empty driving weight $\alpha_e$ | 1 |

| Inventory approach (Table 2) | Value |
|---|---|
| phase factor $\varphi$ | 1.6 |
| cost step $\lambda$ | 3 |
| dual cycle $\tau$ | 1 |
| dual cycle $\sigma$ | 0.5 |

Each approach was run 100 times for 11 hours, preceded by 2 hours to reach balance and followed by 2 hours so containers do not run out; only the 11 hours are evaluated. The paper notes that $\varphi$ must be adapted when dual cycles are forced.

### 2.6 Results (Sec. 5.3-5.5)

All results are relative to *dueTimePrio* = 1 (for example 1.015 means +1.5%); absolute productivity is withheld to avoid misinterpretation. Higher is better for productivity; lower is better for the other measures.

**Table 3. Quay crane productivity.**

| Precedence relations | dueTimePrio | dueTimeHung | inv | invDualCycle |
|---|---|---|---|---|
| linear | 1 | 1.010 | 1.050 | 1.049 |
| many | 1 | 1.014 | 1.046 | 1.059 |
| medium | 1 | 1.015 | 1.045 | 1.183 |
| few | 1 | 1.014 | 1.075 | 1.229 |
| without | 1 | 1.018 | 1.047 | 1.190 |

**Table 4. Empty travel times of AGVs.**

| Precedence relations | dueTimePrio | dueTimeHung | inv | invDualCycle |
|---|---|---|---|---|
| linear | 1 | 0.955 | 0.906 | 0.876 |
| many | 1 | 0.951 | 0.906 | 0.814 |
| medium | 1 | 0.943 | 0.924 | 0.580 |
| few | 1 | 0.952 | 0.914 | 0.559 |
| without | 1 | 0.950 | 0.919 | 0.529 |

**Table 5. AGV waiting times in the buffer at the quay crane.**

| Precedence relations | dueTimePrio | dueTimeHung | inv | invDualCycle |
|---|---|---|---|---|
| linear | 1 | 1.032 | 0.860 | 0.944 |
| many | 1 | 1.027 | 0.881 | 1.036 |
| medium | 1 | 1.075 | 0.666 | 0.696 |
| few | 1 | 1.039 | 0.911 | 0.964 |
| without | 1 | 1.007 | 0.601 | 1.052 |

**Table 6. Quay crane waiting times for AGVs.**

| Precedence relations | dueTimePrio | dueTimeHung | inv | invDualCycle |
|---|---|---|---|---|
| linear | 1 | 1.032 | 0.860 | 0.944 |
| many | 1 | 0.990 | 0.974 | 0.955 |
| medium | 1 | 0.982 | 0.957 | 0.800 |
| few | 1 | 0.990 | 0.962 | 0.837 |
| without | 1 | 0.987 | 0.977 | 0.838 |

What the authors report:
- The Hungarian method is slightly better than the greedy rule in every scenario, by 1.0-1.8% in productivity, although the two differ only in the algorithm.
- *inv* beats *dueTimeHung*, which uses the same algorithm, so the formulation matters; the gain from the inventory concept is larger than the gain from an optimal algorithm in the due-time model.
- Forcing dual cycles is described as extremely promising, with the advantage growing as precedence relations decrease. Empty travel falls strongly, and the effect also grows with fewer precedence relations.
- The inventory approach reduces AGV waiting in the buffer significantly, but with dual cycles AGV waiting is higher than with *inv*, because urgency is partly ignored and AGV queues at cranes lengthen.
- The inventory approach and dual cycles also reduce quay crane waiting (Table 6; see the note on the "linear" row in 2.8).

**Look-ahead (Sec. 5.4, Table 7).** Comparing the inventory method with and without look-ahead (considering only free AGVs versus free and soon-available AGVs), the version with look-ahead has about 10% higher productivity. The method with look-ahead considers about 4.6 AGVs per assignment on average; without it, usually only one AGV is considered under high workload, because the assignment runs whenever an AGV completes a job and the others are all busy.

| Precedence relations | only free AGVs | free and soon available AGVs |
|---|---|---|
| linear | 1 | 1.090 |
| many | 1 | 1.097 |
| medium | 1 | 1.099 |
| few | 1 | 1.095 |
| without | 1 | 1.107 |

**Precedence relations (Sec. 5.5, Table 8).** For the greedy due-time rule, with the linear structure as base:

| Precedence relations | productivity | empty travel | AGV waiting | QC waiting |
|---|---|---|---|---|
| linear | 1 | 1 | 1 | 1 |
| many | 1.035 | 1.000 | 0.744 | 0.982 |
| medium | 1.065 | 0.981 | 0.370 | 0.973 |
| few | 1.071 | 0.993 | 0.256 | 0.964 |
| without | 1.118 | 0.989 | 0.242 | 0.943 |

Productivity is 11.8% higher without precedence relations than with linear ones, because AGVs less often wait in a loading crane's buffer for a delayed predecessor.

### 2.7 Computation times (Sec. 5.6) and conclusions (Sec. 6)

The average computation time of one Hungarian execution was below 0.001 s and the maximum 0.016 s, on an Athlon XP 2200+ with 512 MB RAM, which the authors take to show suitability for real-time control.

In the conclusions, the authors state that even with the same algorithm the inventory concept beat the due-time approach on waterside productivity, "although only by a few percent". They argue that bad time estimates, common in practice and included in their simulation, lead to suboptimal decisions in the due-time approach, whereas the inventory approach avoids estimated times to a large extent, is more robust and gives a simpler control system. Further research: applying the inventory idea to stacking cranes and straddle carriers.

### 2.8 Inconsistencies in the printed paper

- **Table 6, "linear" row.** It reads 1, 1.032, 0.860, 0.944, identical to the "linear" row of Table 5. That row contradicts the other rows and the text: it shows *dueTimeHung* worse than *dueTimePrio* (1.032) and *invDualCycle* worse than *inv* (0.944 against 0.860), whereas every other row shows both better, and the text says dual cycles reduce crane waiting further. It is most likely a copying error from Table 5.
- **Abstract against method.** The abstract says the inventory formulation avoids estimates of driving times, completion times, due times and tardiness. The assignment step still uses the estimated availability wait $w_a$ and empty travel time $e_{ja}$ in its cost; the conclusions say the estimates are avoided "to a large extent".
- **Phase factor for dual cycles.** The text says $\varphi$ must be readjusted when dual cycles are forced, but Table 2 gives a single value ($\varphi=1.6$) and no separate one for the dual-cycle variant.

---

## 3. Structured summary

| Field | Value |
|---|---|
| Problem | Real-time assignment of waterside transport jobs to AGVs |
| Decision trigger | Job completions and other events; assignments to not-yet-free AGVs are provisional |
| Decision | Which jobs (via urgency of cranes) go to which of *n* free or soon-free AGVs |
| Objective | Waterside productivity, through assignment costs (due-time or inventory) |
| Scale | Simulation: 10 quay cranes, 20 stacking cranes, 40 AGVs |
| Randomness: quay-crane cycle time | Handover and ready-for-next distributions (modified Altenwerder statistics) |
| Randomness: travel time / congestion | Driving-time distribution per origin-destination pair, covering congestion |
| Randomness: task arrival | 60 jobs per hour per crane; availability estimates with random error |
| Randomness: stowage | Five precedence structures; equal job rate per crane |
| Randomness: yard crane | Stack transfer-time distributions including shuffling |
| Randomness: AGV breakdown, battery | Not described / not mentioned in the paper |
| Method | Hungarian method, greedy rule, inventory urgency, dual-cycle rule |
| Evaluation | 100 runs of 11 hours per approach; relative to a greedy baseline |
| Authors' stated future work | Apply the inventory idea to stacking cranes and straddle carriers |

**Citation sentence supported by the paper:** *Briskorn, Drexl and Hartmann (2006) proposed an inventory-based rule that sends the next AGV to the quay crane with the fewest AGVs assigned or on their way, and showed in a simulation based on Altenwerder statistics that it raised waterside productivity by a few percent over a due-time formulation solved with the same algorithm, with larger gains when dual cycles were enforced.*

---

## 4. What the paper does not support

- **It is not proof that time-based methods fail.** The inventory formulation beat the due-time one by a few percentage points of productivity in a simulation, with 100 runs per approach, relative figures only, and no confidence intervals or significance tests.
- **It does not isolate the cause.** The quality of time estimates is never varied, so the claim that bad estimates make the due-time approach lose is the authors' interpretation of the results, not an effect they measured.
- **It does not remove time estimates.** The assignment costs still use estimated availability waits and empty travel times; only the choice of which job is urgent avoids due times.
- **The roughly 10% figure is the effect of look-ahead.** It compares considering free and soon-free AGVs with considering only free AGVs; it is not the effect of dispatching several vehicles at once, nor a proof.
- **Both formulations are evaluated in the same noisy simulator.** The paper does not compare behaviour with and without noise.
- **It cannot be replicated from the paper.** The simulation inputs are modified, confidential statistics; distribution parameters and absolute productivity are not given; and the phase factor for the dual-cycle variant is not stated.
- **Tuning and evaluation are not clearly separated.** Parameters were fixed at their best values after preliminary runs on the same simulation model; the paper does not say whether the final runs used new random scenarios.
- **Small assignment problems.** About 4.6 AGVs are considered per assignment, so the sub-millisecond Hungarian times say little about large fleets.
- **No breakdowns, battery, uneven crane workloads, learning-based or multi-agent methods.** The only comparators are the greedy and Hungarian versions of its own due-time formulation.
- **Waterside only**, with each quay crane either loading or discharging.

---

## 5. Our reading (interpretation, not from the paper)

### 5.1 What we can use

- **A benchmark with a full specification.** The inventory rule uses only counts (AGVs assigned to or heading for each crane), a phase factor for loading cranes, a tie-break, and a Hungarian assignment with the cost above, so it can be implemented exactly and runs in milliseconds. Note, as our observation, that with the reported $\tau=1$ condition (2) is always satisfied, so only $\sigma$ restricts dual cycles. The Carlo et al. review also describes it as a strong benchmark.
- **State-feature ideas.** The per-crane count of AGVs assigned or on their way, the ordinal urgency of jobs, the estimated wait until each AGV is free, and the precedence status of loading jobs.
- **Performance measures.** Waterside productivity, crane waiting, AGV waiting and empty travel, reported together; crane waiting for AGVs is the measure closest to quay-crane idle time.
- **Look-ahead evidence.** Including AGVs that will soon be free raised productivity by about 9-11% despite poor availability estimates, which complements the look-ahead-depth results of Kim and Bae.
- **A scenario axis.** The density of precedence relations among loading jobs changes productivity by up to 11.8%, so stowage-related structure belongs in the experimental design.
- **A simulation template.** Stochastic crane, stack and driving times, estimate errors, a warm-up and cool-down period, 100 runs, and relative reporting against a simple baseline.
- **A fairness point for comparisons.** A learned policy's inference time should be compared with sub-millisecond assignment times, not with the minutes sometimes quoted for exact scheduling.
