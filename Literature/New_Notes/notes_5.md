---
id: choe_2016
title: "Online preference learning for adaptive dispatching of AGVs in an automated container terminal"
authors: "Ri Choe, Jeongmin Kim, Kwang Ryel Ryu"
venue: "Applied Soft Computing, 38, 647-660"
year: 2016
doi: "10.1016/j.asoc.2015.09.027"
paper_type: "Learning-based dispatching method with simulation study"
domain: "Automated container terminal (apron AGVs, quay cranes, automated stacking cranes)"
trigger: "An AGV finishes its job and requests a new one (vehicle-initiated, as the paper states)"
decision_variable: "Which candidate job a newly free AGV takes; candidates are the first unassigned job of each quay crane's loading or discharging sequence"
objective: "Weighted sum of average quay-crane makespan per job and average empty-travel distance of the AGVs"
scale: "Simulation: 6 quay cranes, 14 yard blocks, 12, 18 or 24 AGVs, 3,000 jobs per scenario, 50 scenarios per test case"
randomness:
  qc_cycle_time: "Listed as a source of uncertainty (operator skill, weather); how it is modelled in the experiments is not described in the paper"
  travel_time_congestion: "AGV routing and traffic control are simulated in detail with the simulator of Bae et al. (2011), so congestion arises in the simulation; no noise model is described"
  task_arrival: "Job sequences are preplanned; scenarios vary the spread of containers over yard blocks and the number of jobs per ship bay (normal, mean 125)"
  stowage: "Ship bays hold 3-6 job groups with fixed order inside each group; discharging precedes loading at each bay"
  agv_breakdown: "Not described in the paper"
  yard_crane_delay: "Stacking cranes serve AGVs first-come-first-served; retrieval-time uncertainty is listed as a source but its modelling is not described"
  battery: "Not mentioned in the paper"
method: "Pairwise preference function (neural network) relearned online from training examples labelled by short look-ahead simulations"
evaluation: "Two test cases of 50 scenarios each; average QC makespan and empty-travel distance; non-paired t-tests at 95% and hypervolume ratio over 10 repetitions; decision and learning times"
baselines: "Rolling-horizon GA (RH), policy search (PS, Kim et al. 2013), Q-learning (RL, Zeng et al. 2011)"
last_updated: "2026-10-05"
---

# Online Preference Learning for Adaptive Dispatching of AGVs in an Automated Container Terminal

**Choe, Kim & Ryu (2016)** · *Applied Soft Computing* 38, 647-660 · [DOI 10.1016/j.asoc.2015.09.027](https://doi.org/10.1016/j.asoc.2015.09.027)

> **How to read this note.** Sections 1-4 summarise what the paper says, by section, equation, table and figure number. Section 5 is *our* interpretation for the thesis and is labelled as such.

---

## Key takeaways

- **What it did:** proposed OnPL, a vehicle-initiated dispatching policy built on a pairwise **job-preference function** (a neural network over nine criteria). After every decision, each candidate job is evaluated by a short look-ahead simulation, the best one is paired with the others to make weighted training examples, and the function is relearned from a pool of recent examples.
- **Numbers to remember:** simulation of 6 quay cranes, 14 yard blocks, 12-24 AGVs, 3,000 jobs per scenario, 50 scenarios per test case. In the test case close to the training conditions (T1) all methods lie within about 2.4% on makespan (152.7-156.4 s); policy search (PS) has the shortest empty travel (182.9 m) and OnPL-MLP is second (183.8 m). In the harder test case (T2), PS trained on T2 (183.9 s, 237.0 m) and OnPL-MLP (185.8 s, 236.5 m) are nearly equal, while a PS policy trained on a T1 scenario reaches 209.3 ± 44.9 s and 255.9 m against OnPL-MLP's 185.9 ± 0.67 s and 236.5 m (weights 1:1). Rolling-horizon search gives the best makespan but takes up to 10, 20 or 40 s per decision (depending on its search budget) against a dispatch interval of about 10 s; policy-based methods decide in under 0.001 s; PS needs up to 12 h to derive a policy, OnPL relearns in under 1-2 s after each decision. With 24 AGVs OnPL no longer dominates PS.
- **Used in the thesis for:** a list of nine decision criteria; a set of two objectives and an evaluation protocol (repetitions, t-tests, objective-space plots); evidence on distribution shift between scenario families; and a documented, pre-deep-learning reinforcement-learning negative result.
- **Not evidence for:** failure of deep reinforcement learning, a tabular Q-learning "curse of dimensionality", or any quay-crane idle-time result.

---

## 1. Summary in five points

1. OnPL is a **vehicle-initiated** dispatcher: when an AGV frees up, it chooses among candidate jobs (the first unassigned job of each quay crane's sequence) with a learned pairwise preference function.
2. Training is **supervised and online**: after every decision, short look-ahead simulations (driven by the current policy) rank the candidates, and the best candidate is paired with each other candidate to form weighted positive and negative examples; the neural network is relearned from a reserve pool of recent examples.
3. The objective trades **average quay-crane makespan per job** against **average empty-travel distance**, the latter as a proxy for CO₂ emissions.
4. Experiments use two test cases of 50 scenarios (a similar-scenario case T1 and a deliberately adverse case T2) and compare OnPL with a rolling-horizon GA, an offline policy search and a Q-learning method.
5. The authors conclude that OnPL is fast enough for real time and adapts to changing scenarios better than a policy found offline on a different scenario type, while noting that a policy found offline on similar scenarios is as good or better.

---

## 2. What the paper does

### 2.1 Setting and problem (Sec. 1-2)

AGVs carry containers between quay cranes (QCs) and automated stacking cranes (ASCs) at the yard blocks. A pair of ASCs serves each block; a few **handover points** (HPs) in front of each block are where AGVs and ASCs exchange containers, and an HP lies under the back-reach of each QC. AGVs may not stay idle at an HP under a QC; they wait at an HP in front of a block or in a waiting area in the middle of the apron.

![Figure 1. Layout of an automated container terminal.](figure1.png)

The figure shows quay cranes (QC) along the quay with AGVs in the apron; twelve yard blocks drawn perpendicular to the quay, each served by a pair of ASCs; handover points (HP) at the apron end of each block (for AGVs) and at the hinterland end (for external trucks); and the gate with external trucks. The experiments use 14 blocks.

Loading and discharging follow **predetermined sequences** planned from weights, destination ports, stowage and yard stacking status. Containers in a ship bay are stored in groups by destination, and QCs work bay after bay (Figure 2).

![Figure 2. Ship bays (a) and stowage plan of a bay (b).](figure2.png)

A **delivery job** has four steps: an empty trip to an HP, the pick-up, a loaded trip to the destination HP, and the release. For loading, the AGV waits at a block HP until the ASC retrieves and sets down the container, then drives to the HP under the QC. For discharging, the AGV drives to the HP under the QC, receives the container, and carries it to a block HP. A **dual cycle** occurs when an AGV, right after releasing a container to a crane, receives another container from the same crane, which avoids the empty trip. Operators try to build plans that maximise dual cycles, but reducing empty travel can lengthen crane delays: a nearer AGV that is still busy may arrive later than a farther free one.

The paper states two objectives: maximise QC productivity, and minimise CO₂ emissions by reducing empty-travel distance. It notes that a very strong bias toward empty-travel reduction sacrifices service to the QCs. It identifies uncertainty in QC loading time (operator skill, weather), ASC retrieval time (containers stacked on top of the target) and AGV travel time (congestion).

### 2.2 Positioning against earlier work (Sec. 1 and 3)

- **Heuristic rules** are fast but shortsighted; **optimal plans** need computation that grows exponentially with the number of jobs and go stale in a changing environment; **rolling-horizon** methods must shorten the horizon when rescheduling more often. The authors describe Briskorn et al.'s inventory-based method as reducing the computation so that a longer horizon can be scheduled, with QC productivity as its main objective.
- **Policy search (PS)** by Kim et al. (2013) searches for the weight vector of a multi-criteria scoring function by simulation. The resulting policies fail to do well on scenarios that differ from their training scenarios, and the search takes hours of CPU time.
- **Offline supervised learning** of policies faces the same problem of an unbounded number of situations.
- **Reinforcement learning.** The authors single out Zeng et al. (2011), who use Q-learning for yard cranes and yard trailers in a conventional terminal, with a state of a single attribute (number of waiting QCs or waiting trailers) and actions that select one of three heuristic rules. They say this over-simplification gives worse performance than theirs, but that reinforcement learning is in itself a good option for adapting in uncertain, dynamic environments because it needs little CPU time. They add that reinforcement learning with a nonlinear function of features often diverges (citing Tsitsiklis and Van Roy), and that their own trial with a more realistic and complicated state representation failed to converge. No further detail of that trial is given.

### 2.3 Dispatching policy (Sec. 4.1)

**Preference function.** For two candidate jobs described by $d$-dimensional vectors, the function returns a value in $[0,1]$; values near 1 mean the first job is preferred.

$$F:\mathbb{R}^d\times\mathbb{R}^d\to[0,1]\tag{1}$$

Applying it to every pair can give inconsistent preferences (a cycle), so the paper uses the greedy ordering heuristic of Cohen et al.: the **potential value** of a candidate counts how much more it is preferred than disliked against each other candidate, and the policy picks the candidate with the highest potential value.

$$v(\mathbf{x}\mid J_\theta)=\sum_{\mathbf{y}\in J_\theta-\{\mathbf{x}\}}\bigl(F(\mathbf{x},\mathbf{y})-F(\mathbf{y},\mathbf{x})\bigr)\tag{2}$$

$$\pi(J_\theta)=\arg\max_{\mathbf{x}\in J_\theta}v(\mathbf{x}\mid J_\theta)\tag{3}$$

**Candidate representation.** Each candidate job is a vector of nine criteria (essentially those of Kim et al.), $\mathbf{x}=(C_1(x),\dots,C_9(x))$ (Eq. 4); smaller scores mean higher preference. The authors say that removing any one criterion degraded performance, which justified using all nine.

| Criterion | Meaning |
|---|---|
| $C_1$ | Urgency: time remaining to the job's due time, minus the minimum over the candidate set |
| $C_2$ | Arrival advantage: the current AGV's expected arrival time at the pick-up HP minus that of the quickest other AGV (so other AGVs that will finish soon are taken into account) |
| $C_3$ | Time for the crane (QC or ASC) to become ready to hand the container over, including estimated time for higher-priority jobs the crane will do first |
| $C_4$ | Empty-travel distance of the current AGV to the pick-up HP |
| $C_5$ | Negation of the loaded-travel distance to the destination HP |
| $C_6$ | Negation of the average delay per container of the QC that will process the job |
| $C_7$ | $-1$ for a loading container, $1$ for a discharging container |
| $C_8$ | Relative remaining workload of the ASC of the block holding the container (Eq. 5) |
| $C_9$ | Dual-cycle likelihood: $-1$ if the job forms a dual cycle with the AGV's previous job, $-0.5$ if it forms one with the next job at the HP where the AGV would finish, else $0$ |

$$
C_8(x)=\begin{cases}-\dfrac{W_x}{2W_{avg}}, & x\ \text{is a loading container}\\[6pt]-\dfrac12, & \text{otherwise}\end{cases}\tag{5}
$$

Here $W_x$ is the remaining workload of the ASC of the block where $x$ is stored and $W_{avg}$ the average over all ASCs. Each score is normalised to $[0,1]$ with a fuzzy function (Eq. 6), using empirical lower and upper bounds $l(i)$ and $u(i)$ found in separate simulations that dispatch AGVs with the earliest-deadline-first rule (the authors had no better policy at that stage).

$$
\Phi_{[l(i),u(i)]}(v_i)=\begin{cases}1, & v_i>u(i)\\0, & v_i<l(i)\\\dfrac{v_i-l(i)}{u(i)-l(i)}, & \text{otherwise}\end{cases}\tag{6}
$$

**Why a preference function, not a scoring function.** Kim et al. score a job as a weighted sum $s(\mathbf{x})=\mathbf{w}\cdot\mathbf{x}=\sum_i w_iC_i(\mathbf{x})$ (Eq. 7) and pick the job with the minimum score (Eq. 8), which avoids preference conflicts. Because training examples labelled with real-valued scores are hard to produce, the weight vector can only be found by direct search, so any online learning needs pairwise preferences instead.

**Performance measure.** Long-term performance over $n$ processed jobs is a weighted sum of two terms:

$$w_T\cdot T_n+w_D\cdot D_n\tag{9}$$

$$T_n=\frac{|Q|}{n}\,(t_n-s)\tag{10}$$

$$D_n=\frac1n\sum_{q\in Q}\ \sum_{j\in F_{q,n}}e_j\tag{11}$$

where $Q$ is the set of QCs used, $t_n$ the time the $n$th job completes, $s$ the common start time, $F_{q,n}$ the jobs completed by QC $q$ up to $t_n$, and $e_j$ the empty-travel distance for job $j$. $T_n$ is the total processing time divided by the average number of jobs per QC, so the authors read it as the average QC makespan per job.

### 2.4 Training examples and the reserve pool (Sec. 4.2)

A training example is a pair of candidate jobs plus a binary label (1 if the first is preferred). With $k$ candidates, the best job paired with each of the others gives $k-1$ positive examples, and inverting them gives $k-1$ negative ones. That is too few to learn a whole function, so a **pool of recent examples** is kept.

**Pool management.** Once the pool exceeds a bound $R$, it is reduced to $R$ examples by **sampling without replacement** before new examples are added, so older examples have a lower and lower chance of surviving. If $q$ examples are added per round, an example is kept in a round with probability $R/(R+q)$ and survives $m$ rounds with probability $\bigl(R/(R+q)\bigr)^m$ (Figure 3, with $R=30{,}000$ and $q=10$). The alternative is **truncation**, which deletes the oldest $q$ examples each round.

![Figure 3. Survival probability of a training example in the pool: sampling without replacement against truncation (R = 30,000, q = 10).](figure3.png)

**Evaluating candidates.** After a decision, each candidate job seen at that moment is evaluated by simulating the next few assignments (the number of future jobs simulated, including the candidate, is kept below 20). All decisions inside this simulation use the current preference function, and AGV routing and traffic control are simulated in realistic detail with the simulator of Bae et al. (2011). The short-term evaluation differs slightly from Eqs. 9-11:

$$w_T\cdot T_{n+L}+w_D\cdot D_{n+L}\tag{12}$$

$$T_{n+L}=\frac{t_{n+L}-s}{\min_{q\in Q}\lvert F_{q,n+L}\rvert}\tag{13}$$

$$D_{n+L}=\frac1{n+L}\sum_{q\in Q}\ \sum_{j\in F_{q,n+L}}e_j\tag{14}$$

$T_{n+L}$ divides by the number of jobs of the most retarded QC (the one with the fewest jobs processed), which promotes equal job progress across QCs. The reason given: a measure in the style of $T_n$ prefers jobs with short processing times, which leaves long jobs unselected until later and eventually delays the QCs they belong to. The weights $w_T$ and $w_D$ stay the same as in Eq. 9, because the relative importance of the two objectives cannot differ between short-term and long-term evaluation.

### 2.5 The OnPL algorithm (Sec. 4.3, Figure 4)

Persistent state: the example pool $T$ (initially empty), the bound $R$, and the look-ahead length $L$ in jobs. The loop runs until all jobs are done:

1. **Decide.** Update the candidate list $J$; select job $i=\pi(J)$ with the current policy and assign it to the requesting AGV. (At the start the policy is random, so early choices are arbitrary.)
2. **Evaluate.** For each candidate $j\in J$, compute $V[j]=\text{Evaluate}(j,\pi,L)$ by simulating $L$ consecutive assignments with the current policy.
3. **Generate examples.** Take $j^*=\arg\min_j V[j]$. For each other candidate $j$, compute a weight $w$ (Eq. 15) and add the positive example $((j^*,j),1,w)$ and the negative example $((j,j^*),0,w)$.
4. **Buffer.** If $|T|>R$, sample $R$ examples from $T$ without replacement; then add the new examples.
5. **Update.** Relearn the preference function from the pool.

The weight gives more influence to examples whose two jobs differ more in evaluation, since an evaluation from a short simulation is noisy and examples built from nearly equal jobs may produce preference conflicts; $\beta$ controls how discriminating the weighting is:

$$w=\left(\frac{\lvert V[j^*]-V[j]\rvert}{\max_{i,k\in J}\lvert V[i]-V[k]\rvert}\right)^{\beta}\tag{15}$$

The preference function is an **artificial neural network** trained incrementally with **RPROP** (Riedmiller and Braun), which uses only the sign of the partial derivative, multiplies the update value by $\eta^+=1.2$ when the sign stays the same and by $\eta^-=0.5$ when it flips, and needs almost no tuning. The learned function can output any real value in $[0,1]$.

### 2.6 Experimental design (Sec. 5.1)

Experiments ran on an Intel Core i7-2600 PC (3.40 GHz, 8 GB), with the implementation in C++.

**Table 1. Settings used in the scenarios.**

| Setting | Value |
|---|---|
| Total number of delivery jobs | 3,000 |
| Number of QCs at work | 6 |
| Number of yard blocks involved | 14 |
| Number of ship bays per QC | 4 |
| Number of jobs per ship bay | $62.5<125+N(0,2.6^2)<187.5$ |
| Total number of AGVs | 12, 18, 24 |

The 14 blocks are in consecutive locations. Each QC serves four ship bays in turn, completing the discharging jobs at a bay before its loading jobs; the jobs of a bay are split into 3-6 groups whose jobs are done in sequence (Figure 2). ASCs serve AGVs first-come-first-served. Containers to be discharged go to blocks pre-planned from delivery distance and ASC workload, and containers to be loaded onto one vessel are stored near the berth. In the scenarios, the containers of a group handled by QC $i$ are placed in blocks following $N(\mu_i,\sigma_i^2)$, where $\mu_i$ itself follows $N(m_i,s_i^2)$ with $m_i$ the block nearest to QC $i$ (Figure 5); large $\sigma_i$ and $s_i$ lead to long loaded travel and unequal job loads.

![Figure 5. Distribution of containers at different blocks.](figure5.png)

In the figure, QC 2 has $\mu_2=5$ (the containers of its group are centred on block B5) and QC 4 has $\mu_4=9$, each with a normal spread around that block.

**Two test cases**, each of 50 scenarios (3,000 jobs each, discharging to loading 1:1), run as one long sequence:
- **T1:** $(m_1,\dots,m_6)=(2,4,6,9,11,13)$, $s_i=0.5$, $\sigma_i=1.0$. Containers cluster near the closest block, so loaded travel is short and uniform.
- **T2:** $(m_1,\dots,m_6)=(4,5,6,7,8,9)$, $s_i=10$, $\sigma_i=5$. Containers are widely scattered, loaded travel is non-uniform, and the situation changes much more.

To make sure T2 differs from T1, scenarios that look like T1 were discarded: a scenario was picked at random from T1, a policy was derived for it with Kim et al.'s search, and any generated T2 scenario on which that policy beat the earliest-deadline-first heuristic was thrown away. T2 therefore holds only scenarios on which a policy specialised to a T1 scenario does not work well.

### 2.7 Tuning the design parameters (Sec. 5.2)

All tuning used T2. Both a single-layer perceptron (OnPL-SLP) and a multi-layer perceptron (OnPL-MLP, 11 hidden nodes, set empirically) were tried; initial weights were random in $[-0.01,0.01]$. RPROP settings are in Table 2, and the network is trained for one epoch on all pool examples after every dispatching decision.

**Table 2. RPROP parameters.**

| Parameter | Value |
|---|---|
| Update increase rate ($\eta^+$) | 1.2 |
| Update decrease rate ($\eta^-$) | 0.5 |
| Maximum size of update ($\Delta_{max}$) | 1.0 |
| Minimum size of update ($\Delta_{min}$) | 1.0E-20 |

- **Weighting parameter $\beta$** (integers 0 to 10, with $R=30{,}000$, $L=20$, update at every iteration, $w_T=w_D=1$): $\beta=5$ dominated the other values for OnPL-SLP and $\beta=6$ for OnPL-MLP. Every non-zero $\beta$ was better than zero, which the authors take to show that the weighting based on candidate evaluation helps.
- **Replacement strategy** (Figures 6 and 7): for weight ratios $w_T:w_D$ from 1:1 up to 100:1, sampling without replacement almost always dominated truncation in the objective space.
- **Pool size $R$:** for OnPL-SLP, $R=30{,}000$ dominated the other values and larger pools degraded performance because of inertia; OnPL-MLP needed more examples, with good results between 60,000 and 120,000. A pool of 30,000 holds one scenario's worth (3,000 decisions × 10 examples, since six candidates give ten examples per decision). Truncation forgets everything older than one scenario; sampling keeps some old examples and so learns from long-term experience.
- **Learning time** (examples generation, weights and RPROP) grows with pool size but is under 1 s in most cases.

![Figure 6. Replacement strategies compared in the objective space (Sec. 5.2).](figure6.png)

![Figure 7. Replacement strategies compared in the objective space (Sec. 5.2).](figure7.png)

### 2.8 Compared methods (Sec. 5.3, Table 5)

- **RH (rolling horizon):** a genetic algorithm searches the dispatching decisions for the next 12 jobs and repeats after every 6 jobs; three search budgets (population × generations: 25 × 20, 50 × 20, 50 × 50).
- **PS (policy search):** a genetic algorithm searches the weight vector of the scoring function (population 50, 300 generations). One scenario $s_i$ is picked at random from test case $T_i$, a policy $\pi_i$ is derived for it, and this policy is then applied to all scenarios of $T_i$ in sequence. PS-T1 and PS-T2 denote policies derived from a T1 or a T2 scenario.
- **RL:** Q-learning (learning rate 0.01, discount rate 0.1) following Zeng et al., with simplified state definitions and action selection.
- **OnPL:** SLP and MLP variants.

**Table 5. Parameter settings for the compared methods.**

| Method | Parameter | Value |
|---|---|---|
| RH | Look-ahead horizon | 12 jobs |
| RH | Rescheduling interval | 6 jobs |
| RH | Crossover | uniform (rate 1.0, exchange rate 0.2) |
| RH | Mutation | bit-flip, rate 1/(3 bits × 12 jobs) = 1/36 |
| RH | Parent selection; fitness sharing | binary tournament; yes (radius 0.1) |
| RH | Population × generations | 25 × 20, 50 × 20, 50 × 50 |
| PS | Crossover | SBX (rate 1.0, spread factor 2.0) |
| PS | Mutation | non-uniform, rate 1/(9 weights) = 1/9 |
| PS | Parent selection; fitness sharing | binary tournament; yes (radius 0.1) |
| PS | Population × generations | 50 × 300 |
| RL | Learning rate; discount rate | 0.01; 0.1 |
| OnPL | $\eta^+,\eta^-$; $\Delta_{max},\Delta_{min}$ | 1.2, 0.5; 1.0, 1.0E-20 |
| OnPL | Hidden nodes; update interval | 11 (MLP only); 1 iteration |
| OnPL | Weighting $\beta$ | SLP 5.0; MLP 6.0 |
| OnPL | Pool size $R$ | SLP 30,000; MLP 60,000 |
| OnPL | Look-ahead length $L$ | SLP 20 jobs; MLP 10 jobs |

### 2.9 Results (Sec. 5.3)

Weights $w_T=w_D=1$ in the main tables; the authors say the right ratio should be set by terminal operators according to their own objectives. Numbers in parentheses are ranks; bold marks the best.

**Table 6. Performance comparison on test case T1.**

| Algorithm | Makespan (s) | Empty-travel distance (m) |
|---|---|---|
| RH (25 × 20) | 154.6 (4) | 221.8 (7) |
| RH (50 × 20) | 154.1 (3) | 213.1 (6) |
| RH (50 × 50) | **152.7 (1)** | 201.7 (5) |
| PS | 154.0 (2) | **182.9 (1)** |
| RL | 156.4 (7) | 198.5 (4) |
| OnPL-SLP | 155.1 (5) | 186.2 (3) |
| OnPL-MLP | 155.4 (6) | 183.8 (2) |

**Table 7. Performance comparison on test case T2.**

| Algorithm | Makespan (s) | Empty-travel distance (m) |
|---|---|---|
| RH (25 × 20) | 178.9 (3) | 260.3 (6) |
| RH (50 × 20) | 178.5 (2) | 256.9 (5) |
| RH (50 × 50) | **177.6 (1)** | 250.8 (4) |
| PS | 183.9 (4) | 237.0 (2) |
| RL | 190.3 (7) | 321.6 (7) |
| OnPL-SLP | 185.6 (5) | 238.7 (3) |
| OnPL-MLP | 185.8 (6) | **236.5 (1)** |

What the authors report:
- RH improves as more computation is invested; RH 50 × 50 ranks first in makespan but only fifth in empty travel on T1.
- Among the policy-based methods on T1, PS dominates and RL is dominated by the others; because T1 scenarios are rather uniform, the online learner shows no advantage and fails to derive as good a policy as direct policy search.
- On T2, PS no longer dominates OnPL-MLP and the difference is smaller. RL performs worst, which the authors attribute to its simplified state definitions and simplistic action selection.

**Table 8. Times for a dispatching decision, and CPU times for learning.**

| Dispatching method | Dispatching time | Learning time |
|---|---|---|
| RH (25 × 20) | < 10 s | - |
| RH (50 × 20) | < 20 s | - |
| RH (50 × 50) | < 40 s | - |
| PS | < 0.001 s | < 12 h |
| RL | < 0.001 s | < 0.001 s |
| OnPL-SLP | < 0.001 s | < 1 s |
| OnPL-MLP | < 0.001 s | < 2 s |

RH is unsuitable for real time because it searches at decision time. PS needs up to 12 h of CPU time to derive a policy and cannot prepare for changing situations in real time; the loading and discharging plan for a vessel usually becomes available only a few hours before the operation, so PS cannot produce a policy custom-designed for that vessel. OnPL's learning runs after the dispatching decision, which is not a problem unless consecutive dispatches are less than about 2 s apart; the dispatching interval in the simulation averages about 10 s, and the authors suggest aborting learning in the rare case of a very short interval.

**Adaptation (Figures 8-11).** For each method the weight ratio $w_T:w_D$ was varied from 1:1 up to 1000:1 and the resulting (makespan, empty-travel) pairs were plotted. On T2 with 12 AGVs (Figure 8), PS-T2 is the best (as expected) while PS-T1 is much worse than OnPL; on T1 (Figure 9) the picture reverses: PS-T1 is the clear winner and PS-T2 performs worse than OnPL-MLP. The authors conclude that offline policy search works well when the scenarios resemble the one it was derived from and degrades when they differ, while OnPL's results dominate those of PS in that situation. With 18 AGVs on T2 (Figure 10) OnPL dominates PS-T1 and all makespans are shorter. With 24 AGVs (Figure 11) neither dominates: OnPL is better on empty travel, while three PS-T1 cases have a shorter makespan, by less than 0.5 s.

![Figure 8. OnPL and PS in the objective space on test case T2 with 12 AGVs.](figure8.png)

![Figure 9. OnPL and PS in the objective space on test case T1 with 12 AGVs.](figure9.png)

![Figure 10. OnPL and PS-T1 in the objective space on test case T2 with 18 AGVs.](figure10.png)

![Figure 11. OnPL and PS-T1 in the objective space on test case T2 with 24 AGVs.](figure11.png)

**Repeated experiments (Figure 12, Tables 9 and 10).** With 12 AGVs, PS-T1 and OnPL-MLP were tested on T2 at five weight ratios. For PS-T1, a scenario was picked at random from T1 and a policy derived for each ratio, repeated 10 times with different training scenarios. For OnPL-MLP, which has no pre-training, the order of the scenarios in T2 was reshuffled 10 times. The **hypervolume ratio (HVR)** of the five resulting points averaged 0.746 for PS-T1 and 0.713 for OnPL-MLP, and a non-paired t-test showed these averages differ significantly at 95% confidence. The text does not define HVR beyond computing it from the five (makespan, empty-travel) points.

![Figure 12. Performances of OnPL-MLP and PS-T1 on T2 for five different weight ratios.](figure12.png)

In the figure (makespan on the horizontal axis, empty travel on the vertical axis) the five OnPL-MLP points lie below and to the left of the five PS-T1 points, and the legend gives HVR = 0.713 for OnPL-MLP and 0.746 for PS-T1.

**Table 9. Test results of OnPL-MLP and PS-T1 on T2 for five weight ratios** (mean ± standard deviation over 10 repetitions).

| Method | $w_T:w_D$ | Makespan (s) | Empty-travel distance (m) |
|---|---|---|---|
| PS-T1 | 1:1 | 209.3 ± 44.9 | 255.9 ± 10.2 |
| PS-T1 | 5:1 | 194.6 ± 32.2 | 265.1 ± 9.6 |
| PS-T1 | 10:1 | 189.2 ± 9.1 | 268.1 ± 9.4 |
| PS-T1 | 50:1 | 185.1 ± 1.8 | 280.3 ± 12.9 |
| PS-T1 | 100:1 | 184.7 ± 1.2 | 282.7 ± 14.2 |
| OnPL-MLP | 1:1 | 185.9 ± 0.67 | 236.5 ± 1.93 |
| OnPL-MLP | 5:1 | 181.6 ± 0.38 | 240.8 ± 1.41 |
| OnPL-MLP | 10:1 | 180.5 ± 0.50 | 243.9 ± 2.44 |
| OnPL-MLP | 50:1 | 179.5 ± 0.62 | 252.2 ± 2.00 |
| OnPL-MLP | 100:1 | 178.8 ± 0.61 | 255.6 ± 1.71 |

**Table 10. Non-paired t-test (95% confidence) of OnPL-MLP against PS-T1 on T2, per weight ratio** (probability of the null hypothesis in parentheses; symbols as printed).

| $w_T:w_D$ | Makespan | Empty-travel distance |
|---|---|---|
| 1:1 | = (1.5E-01) | − (2.6E-04) |
| 5:1 | = (2.6E-01) | − (2.8E-05) |
| 10:1 | − (1.9E-02) | − (1.9E-05) |
| 50:1 | − (2.0E-06) | − (9.4E-05) |
| 100:1 | − (5.3E-09) | − (2.8E-04) |

The text says that both makespan and empty-travel distance of OnPL-MLP are significantly shorter than most of those of PS-T1; we read "−" as significantly shorter and "=" as no significant difference. As the weight on makespan rises, both methods' makespan falls and empty travel rises (OnPL-MLP: about −3.8% and +8.1% between 1:1 and 100:1; PS-T1: about −11.8% and +10.5%; our arithmetic from Table 9).

### 2.10 Conclusions (Sec. 6)

The authors conclude that OnPL adapts the dispatching policy to changes in the environment, that a pool that is too large makes adaptation sluggish and learning slow, that sampling without replacement beats truncation, and that a pairwise preference function is used because its training examples are easy to generate (a scoring function with real-valued labels would not allow online learning). They state that RH cannot be scaled up to make quality decisions in real time; that the RL method has limited quality because of simplified states and action selection but is among the best options for real-time applicability; and that PS is better than or competitive with OnPL on scenarios similar to its training scenario, but worse on different ones, takes a long time to derive a policy, and offers no easy rule for when to update. They present OnPL as quick in both decision making and online learning.

### 2.11 Gaps and inconsistencies in the printed paper

- **Jobs per ship bay.** The number of jobs per bay is drawn from a normal distribution with standard deviation 2.6 but restricted to between 63 and 187 (Table 1: 62.5 and 187.5), roughly 24 standard deviations from the mean. With $\sigma=2.6$ the restriction would never apply; either the deviation or the bounds are not as printed.
- **Hypervolume ratio.** The paper does not define HVR or say which direction is better. In Figure 12 the lower value (0.713) belongs to OnPL-MLP, whose five points lie below and to the left of PS-T1's.
- **Table 10 symbols.** The legend for "=" and "−" is not printed with the table.
- **Look-ahead length.** Sec. 4.2.2 says fewer than 20 future jobs are simulated; Table 5 gives $L=20$ for OnPL-SLP and 10 for OnPL-MLP.

---

## 3. Structured summary

| Field | Value |
|---|---|
| Problem | Dispatching AGVs to delivery jobs in an automated container terminal, with quay-crane productivity and empty travel as objectives |
| Decision trigger | An AGV finishes its job (vehicle-initiated) |
| Decision | Which candidate job the AGV takes; candidates are the first unassigned job of each QC's sequence |
| Objective | Weighted average QC makespan per job and average empty-travel distance |
| Scale | 6 QCs, 14 yard blocks, 12-24 AGVs, 3,000 jobs per scenario |
| Randomness: quay-crane cycle time | Listed as a source; modelling not described |
| Randomness: travel time / congestion | Congestion from a detailed AGV traffic simulation; no noise model described |
| Randomness: task arrival and stowage | Preplanned sequences; scenarios vary container spread over blocks and jobs per bay |
| Randomness: yard crane | First-come-first-served ASCs; retrieval-time uncertainty listed, not modelled in the text |
| Randomness: AGV breakdown, battery | Not described / not mentioned in the paper |
| Method | Online-relearned pairwise preference function (neural network) with look-ahead-labelled examples |
| Evaluation | Two test cases of 50 scenarios; t-tests at 95%; hypervolume ratio over 10 repetitions |
| Comparators | Rolling-horizon GA, policy search, Q-learning |
| Authors' stated limits | Preference conflicts from noisy examples; pool size trade-off; abort learning when dispatches are very close together |

**Citation sentence supported by the paper:** *Choe, Kim and Ryu (2016) proposed OnPL, which relearns a pairwise job-preference function (a neural network over nine criteria) after every dispatching decision from training examples labelled by short look-ahead simulations, and showed in simulation of a six-crane terminal with 12-24 AGVs that it decides in under a millisecond, relearns in one to two seconds, and adapts to a change of scenario type better than a policy found offline on a different scenario type.*

---

## 4. What the paper does not support

- **It is not a reinforcement-learning method.** OnPL relearns a preference function by supervised learning on labels from short simulations; there is no value function and no long-horizon credit assignment. It cannot be cited as an example of tabular or deep reinforcement learning.
- **It gives no evidence against modern reinforcement learning.** The RL comparator is a Q-learning scheme in the style of Zeng et al. with simplified states and rule-selection actions; it ran and performed worst. The remark about failing to converge refers to the authors' own earlier trial with a richer state, described in one sentence without setup or results.
- **The adaptation result is partly built in.** T2 consists only of scenarios on which a policy specialised to a T1 scenario does poorly, and the main adaptation comparisons (Figures 8, 10, 11, Tables 9 and 10) use a PS policy trained on a T1 scenario. PS was also given one training scenario, whereas Kim et al. gave it a set. The design parameters of OnPL were tuned on T2, the case used for the adaptation comparisons.
- **In-distribution, PS is as good or better.** On T1 PS has the best empty travel and the better makespan of the two; on T2, PS trained on T2 and OnPL-MLP are almost equal (183.9 s / 237.0 m against 185.8 s / 236.5 m).
- **OnPL is not best on makespan.** The rolling-horizon method with the largest budget has the shortest makespan on both test cases (152.7 s and 177.6 s), although it is too slow for real time.
- **The advantage shrinks with more AGVs.** With 24 AGVs OnPL does not dominate PS-T1.
- **Uncertainty is mostly scenario-level.** The text describes variation in container spread and job counts per bay, and congestion from the traffic simulator; it does not describe noise in quay-crane, stacking-crane or travel times.
- **The objective is makespan, not idle time.** Quay-crane makespan per job is the measure; neither it nor the paper reports quay-crane idle time directly.
- **No breakdowns, battery, or multi-agent aspects,** and a fleet of at most 24 AGVs with six cranes.
- **Statistics.** Ten repetitions per method and non-paired t-tests per weight ratio; the paper mentions no correction for multiple comparisons. The simulator is that of earlier work (Bae et al.) and is not described here.

---

## 5. Our reading (interpretation, not from the paper)

### 5.1 What we can use

- **The same decision structure as other vehicle-initiated work.** Candidates are the first unassigned job of each quay crane's sequence, so with six cranes there are at most six candidates; the action is effectively "which crane's next job", as in Kim and Bae and in Briskorn et al.
- **A feature list.** The nine criteria (urgency, arrival advantage over other AGVs, crane readiness time, empty travel, loaded travel, QC delay, job type, ASC workload, dual-cycle likelihood) are a ready starting list for observation features. The authors report that dropping any one worsened their results, in their setup.
- **A baseline family with the same features.** Kim et al.'s weighted scoring function (Eq. 7-8), whose weights are found by evolutionary search, is a strong non-learning policy that uses exactly these criteria; its search cost (hours) is part of the comparison.
- **An evaluation template.** Two objectives reported together, objective-space plots over a range of weight ratios, repeated runs with mean ± standard deviation, t-tests and a hypervolume measure; and decision-time and learning-time tables.
- **A design lesson on distribution shift.** A policy tuned to one scenario family can degrade sharply on another; our evaluation should include train/test scenario mismatch and a range of disruption intensities, not only in-distribution tests.
- **A reward-shaping lesson.** A plain average of processing times favours short jobs; dividing by the progress of the most retarded crane equalises progress across cranes (Eq. 13).
- **A negative result to cite carefully.** Within this paper's setting a simplified Q-learning policy ranked last, and a richer-state RL trial did not converge; both predate deep reinforcement learning and should be described as such.
- **Timing context.** Per-decision times under a millisecond for policy methods against up to 10-40 s for a rolling-horizon search, at a dispatch interval of about 10 s.
