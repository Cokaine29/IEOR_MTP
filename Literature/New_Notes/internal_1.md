# Internal notes: Egbelu & Tanchoco (1984)

> **Private.** Not for the public site. Keep this file outside `public/` and outside any public repository: anything under `public/` can be downloaded by URL even if no page links to it.

---

## 1. Know cold

- **What it is:** a simulation study of AGV dispatching rules in a 13-department, 6-AGV job shop (not a port).
- **Two classes:** work-centre-initiated (a task appears, choose an idle vehicle) and vehicle-initiated (a vehicle frees up, choose a waiting work centre). Rule pairs are needed (p. 363). Our dispatcher is vehicle-initiated.
- **Numbers:** 15 combinations (3 × 5), 30 trials (2 each). 9 combinations locked (all with MOQS, STT/D or LTT/D); locked throughput 1-108 against 763-777 for MROQS and MFCFS. With the central buffer, 290-596. Infinite queues: MFCFS 758-764, STT/D 664-669, MOQS and MROQS about 334-350; STT/D output queues up to 231 against a maximum of 13 under MFCFS. Sequential loop: 406 and 499.
- **Use it for:** vocabulary, baseline candidates (STT/D, MFCFS), locking as a failure mode to test.
- **Do not use it for:** stochastic robustness, learning-based dispatching, port-specific claims, or the word "proved".

---

## 2. Likely viva questions

**Q1. What are the two classes of dispatching decision, and which one is your dispatcher?**
Work-centre-initiated: a task appears, pick an idle vehicle. Vehicle-initiated: a vehicle frees up, pick a waiting work centre. Ours (an AGV becomes empty, where next?) is vehicle-initiated. Egbelu says a full system needs a rule from each class, so we must say how the other half is handled (open question below).

**Q2. What did Egbelu and Tanchoco actually show about gridlock?**
In one 13-department, 6-AGV job shop with finite queues, 9 of 15 rule combinations locked, all with MOQS, STT/D or LTT/D. MROQS and MFCFS never locked. Mechanism: distance-based vehicle-initiated rules never serve departments whose pickup point is not nearest to any vehicle release point, so their queues fill and the blockage spreads upstream.

**Q3. Does this show that rule-based dispatching fails under stochastic disruption?**
No. The failure is structural: finite queues, layout and distance-based rules. With infinite queues STT/D reached 664-669. The paper does not describe injected disruptions, and the supplied text does not say whether arrivals or processing times are random.

**Q4. How strong is the evidence?**
One layout, two runs per combination, no confidence intervals. The same combinations differ between Table 1 and Table 4 (LIV-MROQS 766, 763 against 740, 754), so small gaps such as MROQS against MFCFS in the capacitated case are within visible noise. The gap between locked and not locked is far larger and robust.

**Q5. Why not use Nearest Vehicle as your greedy baseline?**
NV is a work-centre-initiated rule (which idle vehicle). Our decision is vehicle-initiated, so the closest analogues are STT/D (nearest task) and MFCFS (oldest request).

**Q6. What would you test in your own simulator because of this paper?**
Whether a nearest-destination greedy dispatcher starves some quay cranes or yard blocks when queues or buffers are finite.

---

## 3. Known unknowns (do not guess in a viva)

- Why MOQS and MROQS fall to about 346 with infinite queues, against about 765 for MROQS with finite queues. The paper does not explain it.
- The NV and LIV rows are identical in Tables 1, 2 and 3; the paper does not remark on it.
- Run length and warm-up, what differs between the two trials of a combination, and whether job arrivals or processing times are random. None of this is stated in the paper: p. 366 says only that all experiments were run under similar conditions, and defers simulation details to ref. [8] (the first author's 1982 dissertation).
- The approximation for the ramp length f in the appendix: its text is machine-recognised only and the symbol for pi is garbled.

---

## 4. Claims register (earlier WebApp draft against the paper)

| Claim (earlier draft) | Status after reading |
|---|---|
| Egbelu proved the Nearest Vehicle or shortest-distance rule causes gridlock; throughput fell from about 770 to near zero | **Partly.** Locking came from the vehicle-initiated rules MOQS, STT/D and LTT/D. NV is work-centre-initiated and did not lock when paired with MROQS or MFCFS. Locked throughput was 1-108 against 763-777. Finite queues, one layout, two runs per combination: not a proof |
| "Proves our DRL must use work-centre-initiated logic" | **Not supported.** In the paper's terms our decision is vehicle-initiated |
| Stochasticity "None, fully deterministic"; rules "collapse under disruption" | **Not supported.** The collapse was structural. "Deterministic" is not stated in the supplied text, and Tables 1 and 4 hint at randomness in the simulator |
| "Defines the exact mathematical logic for our greedy NV baseline" | **Misaligned.** NV is defined (p. 362), but the closest rules to our decision are STT/D and MFCFS |
| Layout "directly determines" whether rules gridlock | **Overstated.** Argued from a mechanism and shown on one layout; no layout comparison |
| Egbelu "formally characterised and mathematically defined all dispatching rules" | **Overstated.** The paper presents a catalogue of 12 heuristics; 4 of them (RV, LUV, RW, ULSAT) were not tested |
| Locking "where static dispatching causes total gridlock in high-traffic" | **Imprecise.** It required finite queues plus distance- or queue-based vehicle-initiated rules; flow volume matters because it makes work-centre rules inactive (p. 368) |

---

## 5. Open questions for us

1. Does our MDP also need a work-centre-initiated decision (which idle AGV serves a new crane request), or does "hold in buffer, then re-trigger" cover it?
2. Which of STT/D, MFCFS and a queue-pressure analogue become baselines, and how do they relate to the baselines in Kim & Bae and Grunow?
3. Do we test explicitly for destination starvation under greedy dispatching in our simulator?

---

## 6. Provenance and verification

| Field | Value |
|---|---|
| Source access | Full text. The paper is a scan, so its text is machine-recognised (OCR) and unreliable for numbers and equations. Rule equations (pp. 362-365), Tables 1-4, Figures 1-3 and A1-A3, page 366, the Table 1 page (p. 367) and the appendix distance formula (p. 372) were read from page images. The definitions of e, f and phi and the approximation for f come from the machine-recognised text only |
| Human verification | Partial. Niraj confirmed against the paper that battery and charging are not mentioned and that no reason is given for the MOQS/MROQS drop in Table 3 (p. 369) |

**Suggested first checks (a learning checklist):**
1. Table 1 (p. 367): nine combinations locked, all with MOQS, STT/D or LTT/D.
2. The throughput range of the locked runs, 1-108 (p. 367).
3. The definitions of the two decision classes (pp. 359-360) and the statement that rule pairs are required (p. 363).
4. Why the work-centre-initiated rules look alike at high flow (p. 368).
5. STT/D under infinite queues: 669 and 664 in Table 3, queues up to 231 (pp. 369-370).

### Verification log

| Item | Status |
|---|---|
| Rule definitions and equations (pp. 362-365) | Checked against page images |
| Tables 1-4 | Checked against images; transcribed here |
| Figures 1, 2, 3, A1, A2, A3 | Checked against images |
| Page 366 and the Table 1 page (p. 367) | Checked against page images |
| Rest of pp. 359-371 | OCR only (garbled in places); numbers cross-checked against the tables |
| Appendix distance formula $d_{\alpha\beta}$ (p. 372) | Checked against the page image. The plus sign inside the square root of the Euclidean case is printed that way (likely a typo in the paper), not an OCR error |
| Appendix: definitions of $e$, $f$, $\phi$ and the approximation for $f$ | Machine-recognised text only; not checked against an image |
| Simulation run length, random elements, and what differs between the two trials | **Not stated in the paper** (p. 366: "similar conditions"; details deferred to ref. [8]) |
| Table 3 nomenclature ("maximum remaining...") | Confirmed on the page image: the wording is printed that way. It appears to be a typo in the original, inferred from the paper's own text (Section 2.5 of the public note) |
