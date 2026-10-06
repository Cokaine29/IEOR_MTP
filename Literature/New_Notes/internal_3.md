# Internal notes: Kim & Bae (2004)

> **Private.** Not for the public site. Keep this file outside `public/` and outside any public repository: anything under `public/` can be downloaded by URL even if no page links to it.

---

## 1. Know cold

- **What it is:** a static MIP plus a constructive heuristic for AGV dispatching when crane sequence lists are known, turned into a real-time "look-ahead" dispatcher. Trigger: an AGV becomes free; only that AGV is committed after each re-plan.
- **Objective:** crane delay first, AGV travel second ($\alpha \ll \beta$). The crane's delay term equals its accumulated delay (our derivation from constraint 5 and Property 3).
- **Heuristic:** process events in time order; if the next event cannot be given an AGV, delay it (and the crane's later events) by the smallest amount that makes a matching feasible; finally solve an assignment problem for travel. Feasibility is a maximum cardinality matching.
- **Numbers:** 50 small instances (1-2 CCs, 2-4 AGVs, 10-20 operations): objective ratio avg 1.028 (1.000-1.261), time ratio avg 0.01 (0.0001-0.03). Simulation: 2 CCs, 100 operations each, 5 blocks, 3-7 AGVs, NFT 4-14, $\delta$ 0-0.4, 10 replications, 1,500 runs. At 7 AGVs the other rules' delay was about 4.5 times look-ahead's. Look-ahead's travel time is about 75-86% of STT/D's (the text says "by 75%-85%").
- **Use it for:** delay-first objective, definitions of STT/D, EDD and r-SI, the heuristic as a classical baseline, look-ahead depth as a design question.
- **Do not use it for:** "proved", "MIP > 1 minute", "mathematically impossible", anything about congestion, yard cranes, learning, or large fleets.

---

## 2. Likely viva questions

**Q1. What is look-ahead dispatching and why do the authors use it?**
Crane sequence lists make future tasks known, so Egbelu-type rules (which react to a newly idle vehicle or a newly available task) are not used. The authors formulate a static MIP, solve it heuristically by delaying event times and matching, and in real time look only at the next few tasks per crane, re-planning whenever an AGV becomes free and committing only that AGV.

**Q2. What is the objective, and how does it relate to quay-crane idle time?**
Total crane delay is weighted far above AGV travel time. Constraint (5) and Property 3 make a delay carry through to a crane's later events, so the delay term is the crane's accumulated waiting. That makes it the closest published analogue of our objective (our derivation).

**Q3. Did they show the exact model is too slow for real time?**
No numbers in seconds. They say the model needs "excessive" computation, and show the heuristic uses about 0.01 of LINDO's time (range 0.0001-0.03) on 10-20 operation instances on a Pentium II, with objective ratio averaging 1.028.

**Q4. How robust is look-ahead to uncertainty?**
Only crane operation times are randomised (uniform, up to ±40%). With more than a few AGVs delay rises modestly with $\delta$ (about 14-15% at 5 and 7 AGVs); travel time does not change. The gap to STT/D, EDD and r-SI is reported as unchanged across $\delta$, in text only. Travel times are fixed and congestion is excluded.

**Q5. When does look-ahead not help?**
When AGVs are the bottleneck (3 AGVs here), more look-ahead does not cut delay. Beyond about 8-10 future tasks per crane the gains flatten, and travel time rises slightly.

**Q6. How would you use this paper in your thesis?**
As the source of baseline definitions (STT/D, EDD, r-SI, with the candidate set of each crane's imminent task), possibly the heuristic as a stronger classical baseline, and a delay-dominant objective precedent. Our MDP must still decide how much of the future the agent sees, because this method depends on known sequences.

**Q7. Why can't Egbelu's rules be used as they are?**
In the authors' view, tasks are known in advance and executed in sequence, and AGVs must be dispatched ahead of time so that crane delay is small.

---

## 3. Known unknowns (do not guess in a viva)

- The exact levels of the first factor (number of AGVs) as printed in the Sec. 3 paragraph. Figures 4-9 and the text's own statements use 3-7 AGVs; my reading of that one line was ambiguous. Check the line.
- The travel-time inputs. Sec. 3 says AGV travel times are "provided in Table 1", but Table 1 is the sequence list and has none. Niraj confirmed that the paper has no other table, so the travel-time values are simply not given (a printed inconsistency).
- The name of the statistical test.
- Which parameter combinations make up the "25 problems" in Figures 8 and 9 (presumably 5 fleet sizes × 5 values of $\delta$).
- Whether the benchmark rules received the same $\delta$ noise in the $\delta$ comparison (reported in text only, no figure).
- The heavy horizontal line at 40,000 s in Figure 8 (probably a gridline artefact).
- The absolute run time of LINDO or of the heuristic.
- Whether Δ in the real-time section is per crane; the experiments define NFT per crane.
- The wording of one introductory sentence about the dual-cycle manner of the sequence lists in Table 1 (machine-recognised text with words missing).

---

## 4. Claims register (earlier WebApp draft against the paper)

| Claim (earlier draft) | Status after reading |
|---|---|
| "Introduced LADP using a mixed-integer programming model" | **Partly.** The MIP is the static formulation; the look-ahead dispatching procedure is the heuristic (plus Δ-step re-planning) |
| "Formally proved that looking ahead drastically reduces delays" | **Not supported.** Simulation with 1% significance tests; gains only with more than 3 AGVs, flatten by NFT of about 8-10, and travel time rises slightly |
| "Explicitly admitted that tracking traffic congestion and yard cranes is mathematically impossible for MIPs" | **Not supported.** These are excluded by Assumptions 3 and 5 with reasons (AYCs usually not the bottleneck, modelling them is much more complicated, interference is difficult to anticipate); AYC synchronisation is listed as future work |
| "Their look-ahead MIP got within 2.8% of optimal" | **Misattributed.** 1.028 is the average objective ratio of the *heuristic* to LINDO's optimum on 50 small instances (maximum 1.261) |
| "...but required runtimes exceeding 1 minute per decision" | **Not in the paper.** No absolute run times; time is reported only as a ratio (0.0001-0.03, average 0.01) |
| "Exact MIP solutions exceed 1 minute per dispatching decision, too slow for a decision every 90 seconds" (Problem page) | **Not from this paper** |
| "Provides the mathematical blueprint for our DRL reward function" | **Partly.** A delay-first, travel-second objective is a precedent; the paper has no reward or learning |
| "Justifies limiting our state space to a Δ-step look-ahead window" | **Partly.** Δ-step look-ahead is the paper's own device; its experiments show diminishing returns beyond about 8-10 |
| "Defines the STT/D baseline formulas" | **Supported** (Sec. 3), with the candidate set restricted to each crane's most imminent task, which differs from Egbelu and Tanchoco's STT/D |
| "Explicitly calls for yard crane synchronization (which our DRL natively solves)" | **Half supported.** It is listed as future work; "our DRL natively solves" is not from the paper |
| Stochasticity badge "Deterministic" | **Incomplete.** The static MIP assumes deterministic times; the simulation adds uniform ±δ noise to crane operation times |
| Layout "Perpendicular" | **Consistent** with Figure 1 |
| "pp. 224-240" (Background) | **Wrong.** The INFORMS header shows pp. 224-234 |
| "Look-Ahead MIP baseline" (Problem and Home pages) | **Imprecise.** The paper's deployable method is the heuristic; the MIP is only a static reference solved on small instances |

**Cross-check with Carlo et al. (2014).** The review says Kim & Bae beat three benchmark rules on quay-crane delays and travel distances: consistent (the figures show travel time). Table A.1, by our parse, codes this paper with both deterministic and stochastic ready times (consistent with a deterministic MIP plus a noisy simulation) but codes its objective as completion time, whereas the paper's objective is crane delay plus AGV travel time.

---

## 5. Open questions for us

1. **Future tasks in the MDP.** Does our agent see upcoming tasks, and how many (an NFT analogue)? This method relies on known sequence lists.
2. **Action space.** In this paper the decision is which crane's imminent task the free AGV serves, and the task type then fixes where the AGV goes (yard for loading, apron for discharging). If our simulator also has fixed sequence lists, choosing a yard block is not an independent decision; revisit the action set (quay crane, yard block, hold).
3. **Baseline set.** STT/D, EDD and r-SI with the imminent-task candidate set; and the heuristic in place of "Look-Ahead MIP". How do these relate to Egbelu's STT/D and MFCFS?
4. **QC idle time.** Does our definition match the accumulated crane delay used here (the shift of the last event), given that a crane cannot recover lost time?
5. **Idle policy.** Idle AGVs stay at their dropoff point here. Does our "hold" action need repositioning?
6. **No replication claim.** Their simulation cannot be reproduced exactly (no travel-time values, no cycle-time specification for the 100-operation lists). Our simulator needs its own travel times, and we should not describe our baselines as a replication of their experiments.

---

## 6. Provenance and verification

| Field | Value |
|---|---|
| Source access | Full text. The paper is a scan. The introduction and the start of the problem definition came as machine-recognised text with some words missing; all equations, Table 1, Figures 1-9, the heuristic, the worked example, the experiments and the conclusion were read from page images. Only one image carried a page number (p. 228); the INFORMS header shows pp. 224-234 |
| Human verification | Partial. Niraj confirmed that the paper has no table of AGV travel times: Sec. 3 cites Table 1, which holds the sequence lists only |

**Suggested first checks (a learning checklist):**
1. Eq. (1) and constraint (5): why the last event's delay equals the crane's accumulated delay.
2. The worked example against Table 1, including the likely typographical error (760 against 450).
3. The 50-instance comparison: objective ratio 1.028 (1.000-1.261), time ratio 0.01 (0.0001-0.03), and the Conclusion's 0.01%.
4. The look-ahead trigger: re-plan when an AGV becomes free, commit only the newly free AGV.
5. Figures 4 and 5 (look-ahead depth) and Figures 8 and 9 against the "4.5 times" and "75%-85%" statements.

### Verification log

| Item | Status |
|---|---|
| Equations (1)-(13), Steps 1-5, the $\pi$ formula, benchmark rules | Read from page images |
| Table 1 and Figures 1-9 | Read from images; Table 1 transcribed |
| Worked example numbers | Checked against Table 1; the printed 760 is inconsistent (see claims) |
| Figure values in the tables | Read off graphs, approximate (about ±500 s) |
| Consistency between figures | Look-ahead at NFT 10 in Figures 4-5 matches Figures 8-9 at the same fleet sizes |
| Introduction text | Machine-recognised, with words missing (for example in Assumptions 1 and 4); wording reconstructed |
| Header page range and DOI | Read from the INFORMS header image (pp. 224-234; 10.1287/trsc.1030.0082) |
| Statistical test name, absolute run times | Not given in the paper (as far as seen) |
| Travel-time inputs | Not given: Sec. 3 cites Table 1, which has none (confirmed by Niraj) |
