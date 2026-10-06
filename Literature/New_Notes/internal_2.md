# Internal notes: Carlo, Vis & Roodbergen (2014)

> **Private.** Not for the public site. Keep this file outside `public/` and outside any public repository: anything under `public/` can be downloaded by URL even if no page links to it.

---

## 1. Know cold

- **What it is:** an invited review of transport operations in container terminals, all vehicle types, literature to 2012; 30-attribute scheme; 56 rows in Table A.1.
- **Numbers:** 56 classified (55 journal papers + 1 book chapter by our reconciliation; 6 before 2004). AGVs need about 38% (Vis & Harika) to at least 50% (Yang et al.) more vehicles than ALVs, Duinkerken reports ALVs needing about 55% fewer, and the authors' synthesis is roughly twice as many. Dispatching is "mainly vehicle-initiated" because requests far outnumber vehicles (no data given). Briskorn's inventory-based policy is flagged as a benchmark. RA3, RA5, RA6 and RA11 matter most for us. The conclusion asks for a benchmark library.
- **Use it for:** vocabulary, the deterministic-assumption observation, benchmark candidates, a reading queue.
- **Do not use it for:** counts of stochastic dispatching papers, anything about learning-based methods, or claims about automated terminals only.

---

## 2. Likely viva questions

**Q1. What does Carlo's classification tell you about stochastic dispatching?**
Little. Its stochasticity attributes cover only container ready times, due times and the use of stochastic optimization (plus congestion). There is nothing on quay-crane cycle variability, stowage or breakdowns, and the review ends in 2012. The gap grid for our four disruptors is our own.

**Q2. How big is the non-lifting penalty and where does it come from?**
Single studies report about 38% (Vis & Harika) and at least 50% (Yang et al.) more AGVs than ALVs; the authors summarise it as roughly twice as many. It comes from AGVs depending on an external crane, and buffer size matters. These are other authors' simulation results.

**Q3. Is terminal dispatching vehicle-initiated or request-initiated?**
Carlo et al. say mainly vehicle-initiated, because requests far outnumber vehicles; no data is given. For our terminal we need to check the vehicle-to-crane ratio and whether AGVs sit idle.

**Q4. Which benchmark would you pick, and why?**
Briskorn's inventory-based policy: simple, robust, and flagged as an excellent benchmark. Petering (2010) found gains under pooling, loading priority and batching, with sensitivity to terminal size. Kim & Bae's look-ahead and the shortest-travel rules are further reference points.

**Q5. What do the authors say about deterministic assumptions?**
That they may undermine practicality but allow larger instances to be solved. They suggest per-container deterministic times as a compromise, and note that routing papers test robustness by simulation in stochastic environments.

**Q6. Does the review cover reinforcement learning?**
No. The only learning method it mentions is Q-learning in a double-cycling routing paper (Zeng et al. 2009).

---

## 3. Known unknowns (do not guess in a viva)

- Whether our Table A.1 counts (25 dispatching, 16 routing, 17 stochastic ready times, 4 stochastic due times, 2 stochastic-optimization papers) are right; the image check is pending.
- The Nguyen & Kim (2009) row, which disagrees with the review's own text.
- Where the earlier draft's counts of 13 and 5 came from.
- Where the two sentences attributed to Carlo et al. on the earlier draft came from.

---

## 4. Coverage of Table A.1 (held back from the public note until checked against the image)
These counts are **ours**, derived from Table A.1 (see the verification log for how reliable they are). They describe what the table encodes, which is narrower than what the papers contain.

| Quantity | Our count |
|---|---|
| Rows in Table A.1 | 56 (6 before 2004) |
| Papers with `dispatch` = 1 | 25 |
| Papers with `route` = 1 | 16 |
| Papers with both | 4 (Chen 2007, Murty et al. 2005 twice, Rashidi & Tsang 2011) |
| Papers with `dispatch` or `route` | 37 |
| `stochop` = 1 (stochastic optimization used) | 2: Alessandri et al. (2007), Kang et al. (2008); neither has `dispatch` = 1 |
| `readys` = 1 (stochastic ready times) | 17 (8 of them with `dispatch` = 1) |
| `dues` = 1 (stochastic due times) | 4 |
| 14a congestion considered | 5 |
| `QC` performance attribute (quay-crane work rate) | 2: Petering (2010, 2011) |

Papers with `readys` = 1: Angeloudis & Bell 2010; Bae et al. 2011; Hadjiconstantinou & Ma 2009; Kang et al. 2008; Kim & Bae 2004; Liu et al. 2004; Murty, Liu et al. 2005; Murty, Wan et al. 2005; Nguyen & Kim 2009; Park et al. 2009; Petering 2010; Petering 2011; Sacone & Siri 2009; Soriguera, Robuste et al. 2006; Soriguera et al. 2007; Vis & Harika 2004; Yang et al. 2004.

Papers with `dues` = 1: Hadjiconstantinou & Ma 2009; Petering 2010; Petering 2011; Sacone & Siri 2009.

**Extract of the 25 dispatching rows** (key attributes only). Vehicles: NL non-lifting, SL self-lifting, SS self-stacking. Operations: L load, U unload, DC double cycling. Ready / due times: D deterministic, S stochastic, "–" neither flagged. Horizon: dynamic planning horizon flagged.

| Paper | Vehicles | Ops | Ready | Due | Horizon | Stoch. opt. | Objective attributes |
|---|---|---|---|---|---|---|---|
| Angeloudis & Bell 2010 | NL | L, U, DC | S | D | yes | – | other cost |
| Bish et al. 2005 | NL | L, U, DC | D | – | yes | – | completion |
| Briskorn et al. 2006 | NL | L, U, DC | D | D | yes | – | lateness, other |
| Cao et al. 2008 | NL | U | D | – | – | – | completion |
| Cao et al. 2010 | NL | L | – | – | yes | – | completion |
| Chen et al. 2007 | NL | L, U, DC | D | – | yes | – | completion |
| Grunow et al. 2004 | NL | L, U, DC | D | D | yes | – | lateness |
| Grunow et al. 2006 | NL | L, U, DC | D | D | yes | – | completion |
| Hadjiconstantinou & Ma 2009 | SL, SS | L, U, DC | S | S | yes | – | number of vehicles |
| Hartmann 2004a | SL, NL, SS | L, U, DC | D | D | yes | – | lateness |
| Kim & Bae 1999 | NL | L, U, DC | D | – | – | – | completion, distance |
| Kim & Bae 2004 | NL | L, U | D and S | – | yes | – | completion |
| Klerides & Hadjiconstantinou 2011 | NL | L, U, DC | D | D | yes | – | lateness |
| Lee et al. 2010 | NL | L, U, DC | D | – | yes | – | completion |
| Li & Vairaktarakis 2004 | NL | L, U | D | – | yes | – | completion |
| Murty, Liu et al. 2005 | NL | L, U | S | – | yes | – | number of vehicles |
| Murty, Wan et al. 2005 | NL | L, U | S | – | yes | – | number of vehicles |
| Nguyen & Kim 2009 | NL (see the verification log) | L, U, DC | D and S (see the verification log) | – | yes | – | completion |
| Petering 2010 | NL | L, U, DC | S | S | yes | – | distance, QC, other |
| Rashidi & Tsang 2011 | NL | L, U, DC | D | D | yes | – | distance, lateness |
| Soriguera, Espinet et al. 2006 | SL, SS | L, U, DC | – | – | – | – | completion, distance, cost, other |
| Soriguera et al. 2007 | SL, SS | L, U, DC | S | – | yes | – | number of vehicles |
| Xing et al. 2012 | NL | L, U, DC | D | D | – | – | lateness |
| Yin et al. 2011 | NL | L, U | – | – | – | – | number of vehicles |
| Zhang et al. 2005 | NL | U | D | – | yes | – | lateness |

What this extract shows and does not show:
- Briskorn (2006) is described in the text as aiming at robustness to stochastic parameters, yet in the table it carries deterministic ready and due times and `stochop` = 0. The attributes describe the *optimisation model's assumptions*, not the *evaluation environment*.
- Crane waiting or delay appears under other codes: Zhang (2005, "waiting time of the crane" in the text) is coded as lateness; Kim & Bae (2004) and Nguyen & Kim (2009) (quay-crane delays in the text) as completion time. **How many papers minimise quay-crane idle time cannot be read off Table A.1**; it needs a paper-by-paper reading.

---

## 5. Claims register (earlier WebApp draft against the paper)
| Claim (as it appeared in the earlier WebApp draft) | Status after reading |
|---|---|
| "Of 56 routing and dispatching papers reviewed" | **Not supported.** 56 is the full classified set of transport-operation papers, all vehicle types, 1992-2012. Our count: 25 dispatching, 16 routing, 37 either |
| "56 ACT papers published 1993-2012" | **Not supported.** Not limited to automated terminals; the earliest row is 1992 |
| "Only 13 (23%) considered stochastic ready times" | **Not reproduced.** Our count is 17 of 56 (30%). 13/56 = 23%, so the draft appears to use 56 as the denominator with a different numerator |
| "Only 5 (9%) considered stochastic due times" | **Not reproduced.** Our count is 4 of 56 (7%) |
| "Papers combining AGV dispatching with deep stochastic optimization = exactly 0" | **Misleading.** The attribute is `stochop` (stochastic optimization used), not "deep"; the review ends in 2012; two papers have it and neither is a dispatching paper |
| "0 out of 56 combine stochastic disruptions with real-time optimization" (Home) | **Not supported** as phrased: the review has no such attribute, and it describes uncertainty-aware dispatching papers |
| "Dictates that the dispatching architecture must be vehicle-initiated" | **Overstated.** Carlo et al. state that dispatching is mainly vehicle-initiated; they do not prescribe it |
| "Mathematically proves the severe penalty of non-lifting AGVs" | **Overstated.** It is a review; the 38% and at-least-50% figures come from other authors' simulations. The authors' own summary is "roughly twice" |
| "38-50% more AGVs" (Home) | **Supported** as figures reported from Vis & Harika (38%) and Yang et al. (at least 50%) |
| Carlo et al. "establish a strict distinction" between routing and dispatching | **Overstated.** They treat routing and dispatching together as one decision problem, define routing as including trips, paths and schedules, and describe routing as typically static and dispatching as typically dynamic |
| The quoted sentence that deterministic operational times "could jeopardize the practicality of the solutions" | **Present in Sec. 9**, in the discussion of integrated problems; the same passage adds that the assumption allows larger instances and proposes a compromise |
| "Any inefficiency here causes a complete system bottleneck" | **Not found** in the supplied text |
| "Stochastic ready times are one of the most critical, yet ignored, variables" | **Not found** in the supplied text |
| Yangshan "nearly 49 million TEUs in a single year" | **Not supported by this paper.** Its Table 1 gives port-level totals (Shanghai, 31.74 million TEU in 2011); the 49 million figure needs its own source |

---

## 6. Open questions for us
1. Are the AGVs in our target terminal lifting or non-lifting? The non-lifting premise drives the Sec. 5 argument.
2. In our terminal, when is it true that requests far outnumber vehicles, and when are vehicles idle in a buffer? This decides whether a single vehicle-initiated trigger is enough.
3. Carlo's attributes cannot show a gap for crane cycle-time variability, stowage imbalance or breakdowns. Our own gap grid must record these per paper.
4. Which of Carlo's 30 attributes will describe our thesis once scope decisions are made?

---

## 7. Provenance and verification

| Field | Value |
|---|---|
| Source access | Full text (born-digital PDF, extracted text). Figures 1-5 and Table A.1 viewed as images. Table A.1 digits were taken from the extracted text and checked only for row length |
| Human verification | Partial. Niraj confirmed against the paper: (1) the "mainly vehicle initiated" sentence in Sec. 7 has no citation or data after it; (2) the only hit for "learning" is the Q-learning mention in Sec. 7.1, and the other search terms found nothing; (3) Table 4 has no attribute for crane cycle variability, stowage, breakdown or battery. The Sec. 3 search description (no date, hit counts or screening log) is consistent with the full text supplied but was not separately checked |

**Suggested first checks (a learning checklist):**
1. Table A.1 against the image: the lists of 17 papers with stochastic ready times, 4 with stochastic due times, and 2 with stochastic optimization.
2. The Nguyen & Kim (2009) row.
3. The vehicle-initiated sentence in Sec. 7.
4. The "roughly twice as many AGVs" synthesis in Sec. 5.
5. The deterministic-assumption passage in Sec. 9.
6. Search the PDF for the two sentences the earlier draft attributed to Carlo et al.

### Verification log

| Item | Status |
|---|---|
| Sections 1-11 text | extracted text; readable |
| Figures 1-5 | Checked against images |
| Table 4 (attribute list) | Checked against the page image |
| Table A.1 | Digits taken from the text layer. All 56 rows have exactly 31 values. The image's row count (56) and column layout match. Counts in the coverage section above and the extract are **our derivation and should be spot-checked against the image**, using the paper lists in the coverage section above |
| Year reconciliation (56 = 55 + 1 book chapter) | Our derivation from names and years in Table A.1, Figure 5 and the reference list |
| Nguyen & Kim (2009) row | The table codes it non-lifting and with both deterministic and stochastic ready times, whereas the text describes automated *lifting* vehicles and deterministic times. Either our parse or the table is inconsistent; check this row on the image |
| Table 3 of the paper (countries) | Internally inconsistent: ranks do not follow the counts (Germany 8 is ranked below South Korea 7), and only 6 of 14 countries are shown |
| DOI | Taken from the IDEAS/RePEc record of the article (10.1016/j.ejor.2013.11.023); match it against the first-page footer or the publisher page |
| Two sentences quoted in the earlier draft | Not found in the supplied text (see the claims register) |
