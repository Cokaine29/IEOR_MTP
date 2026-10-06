---
id: carlo_2014
title: "Transport operations in container terminals: Literature overview, trends, research directions and classification scheme"
authors: "Hector J. Carlo, Iris F. A. Vis, Kees Jan Roodbergen"
venue: "European Journal of Operational Research, 236(1), 1-13 (invited review)"
year: 2014
doi: "10.1016/j.ejor.2013.11.023"
paper_type: "Literature review with a classification scheme"
domain: "Container terminal transport operations, all vehicle types (AGV, ALV, straddle carrier, yard truck)"
review_scope: "Journal papers up to 2012; papers after 2004 discussed in detail"
search: "Engineering Village, Google Scholar, ProQuest, Web of Science and handbooks; keywords container / container terminal / port(s); plus citation chasing. No search date, screening counts or exclusion log reported."
corpus_size: "56 rows in Table A.1 (55 journal papers + 1 book chapter, by our reconciliation in 2.3)"
last_updated: "2026-10-05"
trigger: "Not applicable (review). States that dispatching in terminals is mainly vehicle-initiated (Sec. 7)."
objective: "Not applicable (review)"
randomness:
  qc_cycle_time: "Mentioned in text (unloading time shows large variance, Sec. 2.1); no Table A.1 attribute"
  travel_time_congestion: "Attribute 14a (congestion); RA3 calls for congestion models"
  task_arrival: "Attributes readys / dues (stochastic container ready / due times)"
  stowage: "No attribute"
  agv_breakdown: "No attribute"
  yard_crane_delay: "No attribute"
  battery: "RA5 (recharging) listed as a research avenue; no attribute"
method: "Literature classification (30 binary attributes) and narrative synthesis"
evaluation: "n/a"
---

# Transport Operations in Container Terminals: Literature Overview, Trends, Research Directions and Classification Scheme

**Carlo, Vis & Roodbergen (2014)** · *European Journal of Operational Research* 236(1), 1-13

> **How to read this note.** Sections 1-3 summarise what the paper says, by section number. Section 4 lists what the paper does not show, and Section 5 is *our* interpretation for the thesis.

---

## Key takeaways

- **What it did:** reviewed container-terminal transport operations and classified 56 publications up to 2012 with a scheme of 30 binary attributes.
- **Numbers to remember:** 56 classified publications (55 journal papers and 1 book chapter, by our reconciliation; 6 predate 2004). Individual studies report about 38% (Vis & Harika) to at least 50% (Yang et al.) more AGVs than ALVs, and the authors' synthesis is roughly twice as many. Dispatching is described as mainly vehicle-initiated. Sixteen research avenues are proposed (RA1-RA16).
- **Used in the thesis for:** vocabulary and the vehicle-initiated trigger statement; evidence that most models assume deterministic times; Briskorn's inventory-based policy as a benchmark; a reading queue.
- **Not evidence for:** counts of stochastic dispatching papers, learning-based dispatching (the review stops in 2012), or automated terminals only.

---

## 1. Summary in five points

1. This is an **invited review** of internal transport between ship and yard in container terminals, covering all vehicle types (AGVs, automated lifting vehicles, straddle carriers, yard trucks), not only automated terminals.
2. It proposes a **classification scheme of 30 binary attributes** (Table 4) and classifies **56 publications** (Table A.1), of which 6 predate 2004.
3. Transport operations are described as three decision problems: **vehicle type, number of vehicles, and routing and dispatching** (Sec. 2.1). Dispatching is then split into vehicle-initiated and move-request-initiated, the latter in the sense of Egbelu and Tanchoco (Sec. 7).
4. Across the studies it reviews, **single-load AGVs need roughly twice as many vehicles as single-load self-lifting vehicles**, because AGVs depend on an external crane to load and unload (Sec. 5).
5. The authors observe that most work assumes **deterministic operational times**, which may undermine practicality but allows larger instances to be solved (Sec. 9). Their research avenues call for congestion models and models of recharging, dwell-point strategy and quayside buffer size (RA3-RA11).

---

## 2. What the paper does

### 2.1 Scope and structure

A container terminal has five areas: berth, quay, **transport area**, storage yard and gate. The berth and quay are seaside; the yard and gate are landside. The transport area sits between them and is the focus of the paper (Figure 1). Only papers after 2004 are discussed in detail, as a partial follow-up to Vis and De Koster (2003); earlier work is classified but not discussed.

![Figure 1. Container terminal main areas: seaside (quay crane), transport area (transfer vehicles), landside (storage yard, gate).](figure1.png)

![Figure 2. Unloading and loading processes at container terminals: arrival, unloading and loading of the ship, transport of containers, stack, inter-terminal transport, other modalities, with the unload and load plans.](figure2.png)

### 2.2 Decision problems and vehicles (Sec. 2)

- **Process.** Quay cranes unload the vessel following an unloading plan. The unloading time of a container depends on its position in the vessel and typically shows a large variance. Vessel loading usually starts after all imports are unloaded and follows a stowage plan.
- **Three decision problems:** (1) which vehicle type, (2) how many vehicles, (3) routing and dispatching.
- **Vehicle classes.** *Self-lifting* vehicles (straddle carriers, automated lifting vehicles, ALVs) can lift containers themselves. *Non-lifting* vehicles (yard trucks, AGVs) need external equipment to load and unload (Figure 3). AGVs are fully automated and controlled by a central computer that decides the dispatching and movement of each vehicle.
- **Trends.** Automation, free-travelling GPS-guided AGVs (harder traffic management), zone-based control with permission requests, deadlock prevention versus resolution, twin-load vehicles, double cycling and indented berths.

![Figure 3. Two common transfer vehicles: (a) straddle carrier, (b) AGV.](figure3.png)

![Figure 4. Yard layout with straddle carriers (a) and by blocks (b).](figure4.png)

### 2.3 Search and corpus (Sec. 3)

- **Search.** Several scientific databases and handbooks, searched with the keywords *container*, *container terminal* and *port(s)*, then complemented by inspecting the references of papers found. Only articles on transport-operation decisions were kept. No search date, number of hits, or screening log is reported.
- **Corpus counts.** The text speaks of 55 journal articles (plus 6 book chapters). Figure 5 sums to 55 bars including "before 2004". Table A.1 has 56 rows. By matching the paper names and years in Table A.1 to the bars of Figure 5, every year matches exactly except 2008 (4 rows against 3 bars); the extra row is Gawrilow et al. (2008), which the reference list shows to be a book chapter. We therefore read **56 = 55 journal papers + 1 book chapter**, with 6 papers before 2004 and 50 from 2004 to 2012. This reconciliation is ours, not the authors'.
- **Spread.** 132 authors, 30 journals; OR Spectrum contributed 16 papers and Transportation Research Part E 5. Most papers originate in Asia (23) and Europe (22).

![Figure 5. Number of journal papers on container terminal transport operations published up to 2012.](figure5.png)

### 2.4 Classification scheme (Sec. 4, Table 4)

Thirty 0/1 attributes in eight groups (attribute 14 has two columns, 14a and 14b, so the table has 31 columns):

| Group | Attributes |
|---|---|
| Decision variables | 1 compare, 2 number, 3 route, 4 dispatch, 5 deadlock, 6 collision |
| Operations | 7 load, 8 unload, 9 double cycling, 10 inter-terminal |
| Vehicle capabilities | 11 self-lift, 12 non-lift, 13 self-stack |
| Interaction | 14a congestion, 14b collisions, 15 precedence for loading, 16 precedence for unloading |
| Temporal | 17 ready times deterministic, 18 ready times stochastic, 19 due times deterministic, 20 due times stochastic, 21 dynamic horizon |
| Uncertainty environment | 22 stochastic optimization used |
| Performance | 23 number of vehicles, 24 completion time, 25 distance, 26 lateness, 27 quay crane work rate (maximise), 28 vessel processing time, 29 other financial cost, 30 other |

Two points about the scheme itself:
- The **stochasticity attributes cover only container ready times, due times and the use of stochastic optimization.** There are no attributes for quay-crane cycle-time variability, travel-time noise, stowage imbalance or AGV breakdowns. Congestion (14a) is the only interaction-related uncertainty.
- The authors say they include only attributes with mutually exclusive values, so as to state what each paper does and does not address.

### 2.5 Findings by section

**Vehicle comparison (Sec. 5).** All studies use simulation.

| Study | Setting | Reported finding |
|---|---|---|
| Vis & Harika (2004) | 4 quay cranes, 16 automated stacking cranes, Rotterdam data | About 38% more AGVs than ALVs for unloading; buffer size at quay cranes and twin-load capability matter |
| Yang et al. (2004) | Hypothetical terminal, 3 quay cranes, 12 stacking cranes | At least 50% more AGVs than ALVs; ALVs reduce waiting in quay buffers |
| Duinkerken et al. (2006) | Inter-terminal transport, Rotterdam data | ALVs need about 55% fewer vehicles than AGVs; AGV numbers depend strongly on buffer size |
| Bae et al. (2011) | Single-load AGVs vs free-travel ALVs, under Briskorn's dispatching | About twice as many AGVs as ALVs for similar performance; for dual-trolley cranes ALVs outperform AGVs |

The authors' synthesis: roughly **twice as many single-load AGVs as single-load ALVs** for the same service level, attributed to the AGVs' dependence on an external crane, and described as robust across terminal characteristics. Buffer size at the crane affects the number of AGVs needed.

**Number of vehicles (Sec. 6).** Deterministic integer programs (for example Vis et al. 2005, which underestimated the simulated fleet requirement by about 10%), queueing-based stochastic models (Kang et al. 2008 combine a cyclic queueing model with a Markov decision process; Goodchild & Daganzo 2007; Alessandri et al. 2007; Sacone & Siri 2009) and simulation.

**Routing (Sec. 7.1).** All authors consider a deterministic setting and test robustness by experiments in a stochastic environment.

**Dispatching (Sec. 7.2).** Dispatching is separated into **vehicle-initiated** (an idle vehicle is assigned to a request) and **move-request-initiated** (an available container is assigned to a vehicle), citing Egbelu & Tanchoco (1984). The authors state that in terminals dispatching is mainly vehicle-initiated because there are far more requests than vehicles; no data or citation is given for this.

| Paper | Approach | Finding as reported by Carlo et al. |
|---|---|---|
| Li & Vairaktarakis (2004) | Single quay crane, deterministic times; optimal algorithm plus heuristics | One heuristic (H3) is near the lower bound |
| Zhang et al. (2005) | Three MIP models, unloading, one berth, deterministic times; minimise crane waiting | A greedy heuristic is useful for large instances |
| Bish et al. (2005) | Single quay crane | A reversed greedy algorithm is optimal; with double cycling an enhanced greedy was 1.55% from optimal on 200 small instances |
| Kim & Bae (2004) | Vehicle-initiated look-ahead dispatching, static and dynamic | Beats three benchmark rules (shortest travel time/distance, earliest due date, revised shortest imminent operation) on quay-crane delays and travel distance |
| Briskorn et al. (2006) | Inventory-based: priority to the quay crane whose buffer holds the fewest AGVs when an AGV arrives | Aimed at robustness to stochastic parameters such as travel-time estimates; simulation shows better terminal productivity and more robustness than due-time-based policies |
| Angeloudis & Bell (2010) | Maximise net benefit of AGV-to-job assignment; task durations as intervals; earlier tasks weighted more | Outperforms four benchmark heuristics; collisions prevented in real time, not optimised |
| Xing et al. (2012) | MILP and two heuristics for tandem-lift quay cranes; minimise lateness | Neighbourhood-search heuristics most efficient |
| Hartmann (2004a) | Scheduling framework for straddle carriers and AGVs | A GA beats the priority-rule methods |
| Nguyen & Kim (2009) | ALVs; MIP and a heuristic that turns buffer constraints into time windows; deterministic times | (no headline result reported in the review) |
| Grunow et al. (2004; 2006) | Twin-load / dual-load AGVs; priority rules vs MIP | MIP gives better quality but runtimes are too long; for dual-load AGVs a modified rule was within 5% of a lower bound |
| Klerides & Hadjiconstantinou (2011) | Simplified Grunow formulation, rolling horizon | About 0.4 time units of extra lateness per job against the full horizon |
| Petering (2010) | Simulation of dual-load yard-truck control | Inventory-based strategy raised quay-crane throughput under several conditions (single pool, loading priority, twin load, batches), with sensitivity to terminal size |

Synthesis: pooling vehicles beats dedicated vehicles, and Briskorn's inventory-based policy is described as a simple, robust and excellent **benchmark policy**, whose effectiveness depends strongly on buffer sizes.

**Deadlock and collision (Sec. 8)** and **integrated problems (Sec. 9).** Integrated seaside, transport and yard models are mostly three-stage flow shops with deterministic times. The authors note this may jeopardise practicality but allows larger instances, and suggest a compromise: deterministic times that differ per container.

### 2.6 Research avenues (Sec. 10.2)

Most relevant to a stochastic dispatching thesis:

| Avenue | Content |
|---|---|
| RA3 | Models for estimating traffic congestion, to address the typical deterministic travel-time assumption |
| RA4 | Treating congestion as a modelling decision rather than an implementation constraint |
| RA5 | Models for automated vehicle recharging |
| RA6 | Analytical models for the dwell-point strategy of vehicles |
| RA7 | Vehicle management for terminals with multi-spreader quay cranes |
| RA10 | Terminals where the bottleneck shifts between seaside and yardside |
| RA11 | Optimising the size of the quayside buffer for lifting vehicles |

The remaining avenues concern reconfigurable vehicles (RA1, RA2), non-traditional berths (RA8, RA9), yard layout and staging (RA12, RA13), slopes and gravity (RA14, RA15) and security and sustainability (RA16).

### 2.7 Authors' conclusions (Sec. 11)

Most papers derive and compare dispatching policies, mainly with heuristic approaches (tabu search, genetic algorithms), and simulation is used both to solve and to compare. Most papers focus on unit-load AGVs. The authors conclude that a **library of benchmark problems** for container-terminal transport operations would help further research.

---

## 3. Structured summary

| Field | Value |
|---|---|
| Type | Review (invited) with classification scheme |
| Scope | Transport operations, all vehicle types, literature up to 2012 |
| Corpus | 56 rows in Table A.1 |
| Search | Several databases, three generic keywords, citation chasing; no counts or dates |
| Trigger statement | Dispatching mainly vehicle-initiated (Sec. 7) |
| Stochasticity coverage in the scheme | Ready times, due times, stochastic optimization; congestion (14a) |
| Not covered by the scheme | Crane cycle-time variability, stowage, breakdowns, battery |

**Citation sentence supported by the paper:** *Carlo et al. (2014) classified 56 publications on container-terminal transport operations up to 2012 and reported that dispatching studies mostly assume deterministic operational times, calling for congestion-aware and recharging-aware models.*

---

## 4. What the paper does not support

- **It says nothing about learning-based dispatching.** The review stops at 2012; the only learning method it mentions is a Q-learning algorithm in a double-cycling routing paper (Zeng et al. 2009).
- **It does not show that nobody handles uncertainty in dispatching.** It describes Briskorn (robustness to stochastic parameters) and Angeloudis & Bell (interval duration estimates) as doing so.
- **It does not contain a count of "stochastic dispatching papers".** The `stochop` attribute is narrow (stochastic optimization used) and does not capture papers that handle uncertainty by other means, such as the robust and interval-based dispatching methods described in Sec. 7.
- **It gives no evidence for the claim that requests far outnumber vehicles** beyond stating it.
- **It does not produce the AGV-versus-ALV numbers itself.** They are results of other authors' simulations.
- **It is not specific to automated terminals.** The corpus includes straddle carriers and yard trucks.

---

## 5. Our reading (interpretation, not from the paper)

### 5.1 What we can use

- **Vocabulary and a trigger statement.** Carlo et al. repeat the vehicle-initiated versus request-initiated distinction and say terminals are mainly vehicle-initiated. This is consistent with our reading of Egbelu and Tanchoco, but is an observation without data.
- **Support for specific stochastic sources.** Large variance in quay-crane unloading time (Sec. 2.1); the typical deterministic travel-time assumption (RA3); the AGV dependence on external cranes (Sec. 5); the observation that most models are deterministic (Sec. 9).
- **Baseline candidates.** Briskorn's inventory-based policy is flagged as a strong benchmark; Kim & Bae's look-ahead rule and the shortest-travel rules are the reference points in the dispatching literature.
- **A reading queue** drawn from the review: Briskorn 2006, Kim & Bae 2004, Angeloudis & Bell 2010, Grunow 2004 and 2006, Petering 2010, Bae et al. 2011 (AGV versus ALV with dual-trolley cranes), Zeng et al. 2009 (Q-learning), Kang et al. 2008 and Alessandri et al. 2007 (stochastic models).
- **A search-method warning.** Carlo et al. report no search date, hit counts or screening decisions. Our review should do better.
- **A research-avenue link.** RA6 (dwell-point strategy) is related to a "hold" action for idle vehicles.
