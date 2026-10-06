# Internal notes: Briskorn, Drexl & Hartmann (2006)

> **Private.** Not for the public site. Keep this file outside `public/` and outside any public repository: anything under `public/` can be downloaded by URL even if no page links to it.

---

## 1. Know cold

- **What it is:** two assignment formulations for real-time AGV dispatching, due-time based and inventory based, both solved as n-jobs-to-n-AGVs assignment problems (Hungarian method; a greedy rule as benchmark), evaluated in a DESMO-J simulation built on modified Altenwerder statistics.
- **Inventory rule:** the crane's inventory level is the number of AGVs assigned to it that have not yet reached it; loading cranes' levels are divided by the phase factor $\varphi$ = 1.6; send the next AGV to the crane with the lowest level; then assign with cost $(\lambda(n-o_j)+1)(w_a+e_{ja})$, $\lambda$ = 3.
- **Numbers:** productivity index (greedy due-time = 1): Hungarian 1.010-1.018; inventory 1.045-1.075; inventory + dual cycles 1.049-1.229 (1.183-1.229 with medium, few or no precedence); inventory gain over the Hungarian due-time version about 3-6 points (our arithmetic). Look-ahead +9.0-10.7%. About 4.6 AGVs per assignment; Hungarian under 0.001 s average, 0.016 s maximum. Setup: 10 QCs (5 loading, 5 discharging), 20 stacking cranes, 40 AGVs, 60 jobs/hour/QC, 100 runs × 11 h per approach. Precedence: no precedence gives +11.8% against linear (greedy rule).
- **Use it for:** an implementable benchmark, state-feature ideas, the four measures, look-ahead evidence, a scenario axis (precedence density).
- **Do not use it for:** "proves time-based methods fail", "no time estimates needed", "multiple vehicles simultaneously +10%", anything about MAPPO, large fleets or breakdowns.

---

## 2. Likely viva questions

**Q1. What is the inventory idea, and how does it differ from the due-time approach?**
Each crane's AGV buffer is a store, the crane a customer, AGVs the goods. Jobs are chosen by the lowest inventory level (AGVs assigned to or heading for the crane) rather than by due times, then matched to AGVs with a linear assignment. The due-time approach computes earliness-tardiness costs from estimated arrival times.

**Q2. Does it really avoid time estimates?**
Only partly. Job selection avoids due times and tardiness, but the assignment cost still uses the estimated availability wait and empty travel time. The abstract overstates it; the conclusions say "to a large extent".

**Q3. How much better is it, and how sure are we?**
Against the greedy due-time rule: Hungarian +1.0-1.8%, inventory +4.5-7.5%, inventory with dual cycles up to about +23%. Against the Hungarian due-time version the inventory gain is roughly 3-6 points. These are relative figures from 100 runs per approach, with no confidence intervals or tests, and absolute productivity is withheld.

**Q4. Why is it a good benchmark for a learned dispatcher?**
It is simple, fully specified, uses mostly counts, runs in under a millisecond per assignment, and held up in a noisy simulation. The Carlo et al. review calls it an excellent benchmark. A learned policy has to beat it, not just a greedy rule.

**Q5. What does the paper say about looking ahead?**
Including AGVs that will soon be free raised productivity by about 9-11%, with about 4.6 AGVs per assignment against typically one without look-ahead under high load, despite poor availability estimates. It complements Kim and Bae's look-ahead depth results.

**Q6. What does it say about precedence relations?**
Fewer precedence relations among loading jobs raise productivity (up to +11.8% with none, for the greedy rule) and sharply cut AGV waiting in the buffer, because AGVs wait less for delayed predecessors; the dual-cycle benefit also grows. So stowage structure belongs in our scenarios.

**Q7. Can you conclude that unreliable time estimates are why the due-time method loses?**
No. The quality of the estimates is never varied; both methods run in the same noisy simulator. It is the authors' interpretation.

---

## 3. Known unknowns (do not guess in a viva)

- The phase factor used for the dual-cycle variant (Table 2 gives one value, 1.6, while the text says it must be adapted).
- Whether "100 simulation runs" is per approach overall or per approach and scenario.
- Random seeds, confidence intervals, and whether the final runs used new scenarios after the parameter tuning.
- Parameters of the simulation distributions (crane handover, stack transfer, driving, estimate error).
- Absolute productivity (withheld).
- The origin of the Table 6 "linear" row (identical to Table 5's; likely a copying error).
- The equations were read from the PDF's text layer, where primes are garbled (for example $ila'_q$ appears as "ila0 q"); my reading is unambiguous but not checked against an image.
- Journal page numbers: the PDF is the reprinted version with preprint pagination 1-16; the journal pages are 611-630.

---

## 4. Claims register (earlier WebApp draft against the paper)

| Claim (earlier draft) | Status after reading |
|---|---|
| "Rejects traditional due-time based mathematical models" | **Overstated.** The due-time formulation is built, solved (greedy and Hungarian) and used as the benchmark; the inventory formulation beats it by a few percent |
| "Treats quay cranes like factories and AGVs as buffer inventory" | **Wrong analogy.** Quay cranes are customers, AGV buffers are inventory (stock), AGVs are the goods |
| "Proves that dispatching multiple vehicles simultaneously improves productivity by 10%" | **Misdescribed.** The roughly 10% (9.0-10.7%) is the effect of look-ahead (free and soon-free AGVs, about 4.6 considered); it is a simulation result, not a proof |
| "Provides our primary justification for why deterministic time-based routing fails in reality" | **Overstated.** The due-time approach performs only a few points worse, and the paper never varies the quality of time estimates |
| "Establishes the rule of asymmetric precedence (strict for loading, none for discharging)" | **Not a finding.** It is a modelling assumption from stowage plans |
| "Provides the ultimate justification for using MAPPO over single-agent RL" | **Not supported.** The paper has no multi-agent content; it solves one centralised assignment per event |
| Stochasticity badge "Deterministic" | **Wrong.** Both formulations use point estimates, but they are evaluated in a stochastic simulation with random handover, transfer and driving times and noisy availability estimates |
| Author name "Sönke" printed as "S-nke" | Encoding error in the card |
| Layout "Perpendicular" | Consistent with Figure 1 (blocks extend away from the quay), our reading of the sketch |
| "Inventory-Based dispatching baseline (Briskorn et al. 2006)" described as "verified" | Implementable from the paper (rule, $\varphi$, $\lambda$, optional dual cycles), but $\varphi$ for the dual-cycle variant is not stated |

**Cross-check with Carlo et al. (2014).** Their summary (priority to the crane whose buffer has the fewest AGVs when the AGV arrives; aimed at robustness to stochastic parameters; better productivity and more robust than due-time policies) matches the paper's claims, but compresses the definition: the paper counts AGVs assigned to or heading for a crane, not only those in the buffer, and "more robust" is the authors' interpretation. Table A.1, by our parse, codes this paper with precedence for loading, deterministic ready and due times, a dynamic horizon, double cycling, and lateness plus other metrics, which matches the paper's modelling assumptions (it describes the optimisation model, not the noisy evaluation).

---

## 5. Open questions for us

1. **Crane roles.** Here each quay crane either loads or discharges; our problem has each crane handling import unloading and export loading over a vessel episode. How should the inventory rule be adapted?
2. **Benchmark specification.** Which variant do we implement (inv or invDualCycle)? In our simulator do we give it true availability waits and empty travel times, or noisy estimates? What phase factor do we use for the dual-cycle variant?
3. **Look-ahead in our MDP.** Briskorn considers AGVs that will soon be free and keeps those assignments provisional; our trigger is a single AGV becoming free. Should our observation include soon-free AGVs?
4. **State features.** Is "AGVs assigned to or heading for each crane" part of our state?
5. **Scenario design.** Do we vary precedence density as an experimental axis?
6. **Fair timing comparison.** How do we compare a learned policy's inference time with a sub-millisecond assignment?

---

## 6. Provenance and verification

| Field | Value |
|---|---|
| Source access | Full text. Born-digital reprint PDF (preprint pagination 1-16; journal pages 611-630 and the DOI from its header). Tables 1-8 and Figure 1 viewed as images. Equations read from the extracted text, with primes garbled but unambiguous |
| Human verification | None recorded yet |

**Suggested first checks (a learning checklist):**
1. Table 3 against the text's "1.0-1.8%" for the Hungarian method.
2. Table 7 against the text's "about 10%" for look-ahead, and the 4.6 average number of AGVs.
3. The Table 6 "linear" row against the Table 5 "linear" row.
4. The simulation setup: 10 quay cranes (5 loading, 5 discharging), 20 stacking cranes, 40 AGVs, 60 jobs per hour per crane.
5. The inventory cost formula and the phase-factor definition in Sec. 4.

### Verification log

| Item | Status |
|---|---|
| Tables 1-8 (parameters and results) | Read from page images; transcribed here and matched against the text |
| Figure 1 | Read from the image (a sketch with 7 quay cranes and 7 stacking blocks, against 10 and 20 in the experiments) |
| Equations (cost (1), inventory cost, conditions (2) and (3), $ila'$) | From the extracted text; reconstructed, not checked against an image |
| Table 6 "linear" row | Confirmed identical to Table 5's on the page images |
| Section texts | Extracted text, readable |
| DOI and journal pages | From the PDF header |
| Statements on missing information (no confidence intervals, no estimate-quality experiment, no phase factor for dual cycles) | Based on the full text supplied |
