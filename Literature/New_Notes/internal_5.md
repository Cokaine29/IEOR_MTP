# Internal notes: Choe, Kim & Ryu (2016)

> **Private.** Not for the public site. Keep this file outside `public/` and outside any public repository: anything under `public/` can be downloaded by URL even if no page links to it.

---

## 1. Know cold

- **What it is:** OnPL, an online-relearned pairwise preference function (neural network, nine criteria) for vehicle-initiated AGV dispatching. After each decision, each candidate job is scored by a short simulation (up to about 20 jobs) driven by the current policy; the best candidate is paired with the rest to make weighted positive and negative examples; a reserve pool of recent examples (sampling without replacement) is used to relearn the network with RPROP. It is supervised learning with simulation-derived labels, not reinforcement learning.
- **Decision structure:** candidates = the first unassigned job of each QC sequence (at most 6 here); policy = argmax of potential value (Eq. 2-3). Trigger: an AGV frees up.
- **Objective:** $w_T T_n + w_D D_n$: average QC makespan per job and average empty-travel distance (CO₂ proxy). Not QC idle time.
- **Setting:** 6 QCs, 14 blocks, 12/18/24 AGVs, 3,000 jobs per scenario, 50 scenarios per test case; T1 similar scenarios, T2 adverse scenarios (filtered against a T1-trained policy).
- **Numbers:** T1 makespan 152.7-156.4 s (all methods), empty travel 182.9 m (PS) to 221.8 m (RH 25×20). T2: PS 183.9 s/237.0 m, OnPL-MLP 185.8 s/236.5 m, RH 50×50 177.6 s/250.8 m, RL 190.3 s/321.6 m. Table 9 (T2, 1:1): PS-T1 209.3 ± 44.9 s, 255.9 ± 10.2 m; OnPL-MLP 185.9 ± 0.67 s, 236.5 ± 1.93 m. Times: policy methods decide in under 0.001 s, RH under 10/20/40 s, PS learns in up to 12 h, OnPL in under 1 s (SLP) or 2 s (MLP); dispatch interval about 10 s.
- **Use it for:** feature list, scoring-function baseline, evaluation template, distribution-shift lesson, reward-shaping lesson, a carefully worded RL negative result.
- **Do not use it for:** "tabular Q-learning failed from state-space explosion", "early RL era", "preference learning is a PPO precursor", "GA/RH take 12 hours to adapt", anything about deep RL.

---

## 2. Likely viva questions

**Q1. What is OnPL, and is it reinforcement learning?**
It relearns a pairwise preference function online. After each dispatch, short look-ahead simulations rank the candidates and label training examples (best candidate against each other candidate); the network is retrained from a pool of recent examples. It is supervised learning with labels from rollouts; there is no value function or long-horizon credit assignment, so it is not reinforcement learning.

**Q2. Does the paper show that reinforcement learning fails at AGV dispatching?**
No. The RL comparator is Q-learning in the style of Zeng et al. with simplified states and rule-selection actions; it ran and ranked last (Tables 6-7). The paper says its own trial with a richer state failed to converge, in one sentence with no detail. All of it predates deep RL.

**Q3. Is OnPL the best method?**
Not on makespan: RH with the largest budget wins on both test cases but needs up to 40 s per decision. On T1 PS has better empty travel and makespan; on T2, PS trained on T2 and OnPL-MLP are nearly equal. OnPL's advantage appears against a PS policy trained on a different scenario type (PS-T1 on T2), and shrinks as the fleet grows (24 AGVs: no dominance).

**Q4. How was the test set built, and why does it matter?**
T2 contains only scenarios on which a policy specialised to a T1 scenario does not beat earliest-deadline-first, and the adaptation comparisons pit OnPL against a PS policy trained on a T1 scenario. PS also got a single training scenario rather than a set. So the result partly follows from the design. Parameters of OnPL were tuned on T2 as well.

**Q5. What are the nine criteria?**
Urgency; arrival advantage over other AGVs; crane readiness time; empty travel; loaded travel; QC delay; job type (loading or discharging); ASC workload; dual-cycle likelihood. Normalised by a fuzzy function with bounds from earliest-deadline-first simulations.

**Q6. What does the paper say about real time?**
Policy-based methods decide in under 0.001 s; RH under 10-40 s per decision, which is too slow against a dispatch interval of about 10 s; PS needs up to 12 h offline; OnPL's learning (under 1-2 s) runs after the decision and is skipped or aborted if dispatches come too close together.

**Q7. How is evidence of adaptation presented, and how strong is it?**
Objective-space plots over weight ratios 1:1 to 1000:1 (Figures 8-11), and 10 repetitions with non-paired t-tests and a hypervolume ratio (Tables 9-10). In Table 9 OnPL-MLP is better than PS-T1 at every ratio, with far smaller spread; the makespan difference is not significant at 1:1 and 5:1 because of PS-T1's large variance.

---

## 3. Known unknowns (do not guess in a viva)

- The definition and direction of the hypervolume ratio (0.746 for PS-T1 against 0.713 for OnPL-MLP). Figure 12 shows all five OnPL-MLP points below and to the left of the PS-T1 points (both objectives are minimised), so a standard larger-is-better hypervolume would favour OnPL. OnPL has the lower value, so here lower is presumably better, or the ratio is defined against a different reference. Neither the text nor the figure says which.
- Tables 3 and 4 (results for $\beta$ and for pool size) and Figures 3 and 6-11 were not seen; only the text statements about them are used.
- How quay-crane, stacking-crane and travel-time variability is simulated; the simulator of Bae et al. (2011) is not described here.
- The state definition and action set of the RL comparator beyond "simplified".
- The legend of Table 10's "=" and "−" symbols (text says OnPL-MLP is significantly shorter than "most" of PS-T1's).
- The number of jobs per ship bay: $N(125,2.6^2)$ limited to 63-187 (the limits would never apply).
- Whether PS-T2's scenario is also among the 50 evaluated (in-sample for one scenario).
- Whether "Table 7 PS" is PS-T2 (by the Sec. 5.3 description, PS is trained on a scenario of the same test case).
- Figure 1 shows twelve yard blocks while the experiments use 14 (Table 1, Figure 5); the figure is illustrative.

---

## 4. Claims register (earlier WebApp draft against the paper)

| Claim (earlier draft) | Status after reading |
|---|---|
| "Pivotal paper that bridges classical static formulas and modern Deep RL" | **Overstated.** OnPL is online supervised preference learning, not reinforcement learning and not deep |
| "Proves GAs and Rolling Horizon heuristics are computationally unviable for real-time chaotic ports (up to 12 hours to adapt)" | **Misattributed.** RH (a GA run at each decision) takes under 10-40 s per decision against a dispatch interval of about 10 s; the 12 hours is PS's offline policy search. RH also has the best makespan. "Proves" overstates a simulation comparison |
| "OnPL makes decisions in milliseconds" / "under 1 ms" | **Supported for decisions** (under 0.001 s). Learning takes under 1-2 s, after the decision |
| "Demonstrates basic single-agent Q-learning fails to converge in complex ports" | **Wrong.** The Q-learning comparator ran and ranked last; non-convergence is the authors' own richer-state trial, in one sentence |
| "Early RL era (2010s), tabular Q-learning; Choe et al. (2016) successfully learned to adapt" (Background) | **Wrong on method.** OnPL is not Q-learning and not reinforcement learning |
| "Q-table explodes exponentially with fleet size; dominated by simple heuristics in all chaotic-condition tests" | **Not in the paper.** RL ranked last on T2 but beat all RH variants on empty travel on T1 (198.5 m against 201.7-221.8 m); no table compares against simple heuristics |
| "Basic Q-learning failed to converge ... due to state space explosion (Choe 2016)" (Home and Problem pages) | **Not supported.** The cause is not given; the paper cites divergence of RL with nonlinear function approximation |
| "Two-mode crane variance (stable T1 vs chaotic T2)" | **Wrong.** T1 and T2 are scenario families (spread of containers over yard blocks); no crane-variance modes are described |
| "Only one disruption source" (Background, Online Preference Learning row) | **Unclear.** Scenario variability and congestion are present; noise models for crane and travel times are not described |
| "Pairwise preference is the mathematical precursor to the PPO advantage function" | **Not supported.** The preference function is Cohen et al.'s ordering scheme; no link to advantage functions is made |
| "Their dual objective function provides empirical proof of the Makespan vs Empty-Travel Starvation trade-off" | **Partly.** Table 9 shows makespan falling and empty travel rising as $w_T:w_D$ grows (OnPL-MLP about −3.8% and +8.1% from 1:1 to 100:1); "starvation" is not the paper's word and "proof" overstates |
| "Requires computationally expensive simulation rollouts at every decision step" | **Partly.** Rollouts run for each candidate after every decision, but learning takes under 1-2 s |
| Citation "Applied Soft Computing, 48, 285-296" | **Wrong.** The paper is Applied Soft Computing 38 (2016), 647-660 |
| Methods tag "Q-Learning" on the card | **Misleading.** Q-learning is only a comparator |
| Layout "Perpendicular" | **Consistent** with Figure 1 (yard blocks drawn perpendicular to the quay) |

**Cross-check with other notes.**
- *Briskorn et al.* Choe et al. describe Briskorn's method as scheduling jobs over a horizon with QC productivity as its main objective and empty travel only a helper. Briskorn's due-time cost does include an explicit empty-driving weight, and each AGV is given one job rather than a schedule, so this description is loose.
- *Kim and Bae.* Same candidate-set structure (the next job of each crane) and same vehicle-initiated trigger.
- *Carlo et al.* The review ends in 2012 and cannot speak to this paper.

---

## 5. Open questions for us

1. **Objective.** Our objective is QC idle time; this paper uses QC makespan per job plus empty travel (a CO₂ proxy). Do we report empty travel as a secondary metric (as the Problem page plans)?
2. **Action space.** Here at most six candidates; ours (26 QCs + 61 blocks + hold) is far larger. If task sequences are fixed, is the decision again "which QC's next job"?
3. **Distribution shift.** Should we build train/test scenario families (like T1 and T2) and test a policy trained on one against another, with disruption intensity as the axis?
4. **Baselines.** Do we include a scoring-function policy with these nine features, tuned by evolutionary search, as a strong non-learning baseline? What would a rolling-horizon baseline cost in our simulator?
5. **Features.** Which of the nine criteria are available in our simulator (arrival advantage and crane readiness need time estimates)?
6. **Statistics.** This paper uses 10 repetitions, non-paired t-tests and a hypervolume measure; our plan uses 20 seeds, interquartile mean and bootstrap intervals. Do we also plot objective-space results over weight ratios?
7. **Timing fairness.** How do we report per-decision time next to a dispatch interval of the same scale as ours?

---

## 6. Provenance and verification

| Field | Value |
|---|---|
| Source access | Full text. Born-digital PDF (journal pages 647-660; DOI and dates from its header). Equations (1)-(15), the OnPL pseudocode (Fig. 4), Tables 1, 2 and 5-10 were read from page images. Figures 1, 2, 5 and 12 were also read from images. Tables 3 and 4 and Figures 3 and 6-11 were not seen |
| Human verification | None recorded yet |

**Suggested first checks (a learning checklist):**
1. Tables 6 and 7 against the text (ranks, "PS dominated", "PS fails to dominate OnPL-MLP").
2. Table 8 against the text (under 0.001 s decisions, up to 12 h for PS, 1-2 s learning).
3. Sec. 5.1: how T2 is built, and Sec. 5.3: how PS is trained (one scenario).
4. The sentence on reinforcement-learning convergence in Sec. 3.
5. The statement about 24 AGVs in Sec. 5.3 and the start of Sec. 5.

### Verification log

| Item | Status |
|---|---|
| Equations (1)-(15), Fig. 4 pseudocode | Read from page images |
| Tables 1, 2, 5, 6, 7, 8, 9, 10 | Read from images; transcribed here |
| Ranks in Tables 6 and 7 | Re-derived from the values and consistent |
| Table 9 against Table 10 | Welch-type t-statistics from the printed means and standard deviations (n = 10) give about 0.13, 0.23 and 0.015 for the makespan comparisons at 1:1, 5:1 and 10:1, against 0.15, 0.26 and 0.019 printed; our approximate check suggests the tests use the 10 repetitions as the sample |
| Table 9 against Table 7 | OnPL-MLP at 1:1 is 185.9 s / 236.5 m (Table 9) against 185.8 s / 236.5 m (Table 7), consistent |
| Percentage changes quoted (−3.8%, +8.1%, −11.8%, +10.5%, 2.4% spread) | Our arithmetic from the tables |
| Figures 1, 2, 5 | Read from images; consistent with the text (Figure 1 shows twelve blocks, the experiments use 14) |
| Figure 12 | Read from the image; the plotted points match the Table 9 means, and the legend HVR values (7.13E-01 and 7.46E-01) match the text |
| Tables 3 and 4, Figures 3 and 6-11 | Not seen; their content is taken only from the text |
| HVR definition and direction | Not defined in the text or in Figure 12 |
| Statements about what is not described (noise models, breakdown, battery, multiple-comparison correction) | Based on the full text supplied |
