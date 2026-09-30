# Deep Reinforcement Learning at the Edge of the Statistical Precipice
**Authors:** Rishabh Agarwal, Max Schwarzer, Pablo Samuel Castro, Aaron Courville, Marc G. Bellemare (Google Research / MILA)  
**Conference:** NeurIPS 2021 (Outstanding Paper Award)  
**Methodology:** Statistical Evaluation, Confidence Intervals, and Metric Robustness in RL

## 1. The "Statistical Precipice" (Explained in Plain English)
In traditional Deep RL research, researchers usually train their algorithm using 3 to 5 different "random seeds" (runs). They take the average (mean) or middle (median) score of those 5 runs, put it in a table, and if their number is higher than the baseline's number, they claim their algorithm is the new State-of-the-Art.

This paper proves that this methodology is statistically completely invalid. 
Because RL training is inherently chaotic and random, 5 runs is nowhere near enough to find the "true" average. If you run those same 5 seeds again, you might get a wildly different number. The authors show that researchers are accidentally claiming their algorithms are better purely because they got "lucky" with their 5 random seeds.

**Thesis Application:** This paper will be the cornerstone of your **Methodology & Evaluation** chapter. You will use this paper to prove to the examiner that you are holding your RL agent to the highest modern statistical standards, not just relying on lucky averages.

## 2. The Three New Standards for RL Evaluation
To fix this reproducibility crisis, the authors introduce an open-source library called `rliable` and mandate three new rules for evaluating RL algorithms:

### A. Use Interquartile Mean (IQM) instead of Mean or Median
*   **The Problem with Mean:** If your agent does terribly on 9 tasks but gets an insanely lucky high score on 1 task, the average (mean) will look artificially great.
*   **The Problem with Median:** The median is highly volatile with only 5 runs.
*   **The Solution (IQM):** The Interquartile Mean takes all your runs, throws away the top 25% (the lucky outliers) and the bottom 25% (the unlucky disasters), and calculates the average of the **middle 50%**. It is far more robust and mathematically stable for small sample sizes.

### B. Use Stratified Bootstrap Confidence Intervals
Instead of reporting a "Point Estimate" (e.g., "My agent scored 42"), you must report a **95% Confidence Interval** (e.g., "I am 95% confident my agent's true score lies between 38 and 45"). If your confidence interval overlaps with the baseline algorithm's confidence interval, you *cannot* mathematically claim your algorithm is better.

### C. Use Performance Profiles
Instead of putting a giant table of numbers in your paper, you should plot a "Performance Profile" graph, which visually shows the distribution of all scores across all runs.

## 3. The "Max Score" Cheat
At the end of Section 3, the authors call out a massive flaw in how some researchers report results. Some papers evaluate their agent periodically during training, take the absolute **maximum** score it ever achieved on a lucky episode, and report that as the final score. 
The authors state this invalidates the comparison. You must evaluate the agent's *end-performance* (how it performs reliably at the end of training).

**Thesis Application:** When you evaluate MAPPO, do not just pick its best single episode. You must evaluate its final trained policy over several episodes and report that aggregate. You can cite Agarwal (2021) as justification for your rigorous evaluation protocol.

## 4. The IQM Formula
![Figure 2: Distribution of median normalized scores](/literature/agarwal_2021/figure2.png)

In Section 4.3, the authors explicitly define the **Interquartile Mean (IQM)**. Also known as the 25% trimmed mean, it discards the bottom 25% of runs (the unlucky disasters) and the top 25% of runs (the extremely lucky outliers). It then calculates the mean score of the remaining middle 50% of runs.

**Thesis Application:** You should calculate the IQM for your PettingZoo simulation runs. If you run 20 random seeds of your MAPPO algorithm, you will sort the final scores, throw away the bottom 5 and the top 5, and average the middle 10.

## 5. Probability of Improvement
![Figure 12: Procgen evaluation and Probability of Improvement](/literature/agarwal_2021/figure12.png)

In Section 4.3, they introduce another highly robust metric: **Probability of Improvement**. This metric simply answers the question: *If I pick a random seed, what is the probability that Algorithm X outperforms Algorithm Y?* 
In Figure 12, they show that several papers claiming to be "State-of-the-Art" actually only had a 40% to 50% chance of beating the previous baseline!

**Thesis Application:** This is an incredibly powerful metric for your Results chapter. You can run MAPPO against your Shortest-Queue Baseline for 20 runs, and report: *"MAPPO demonstrated an 85% Probability of Improvement over the classical baseline."*

## 6. Overlapping Confidence Intervals
![Figure 11: DeepMind Control Suite evaluation results](/literature/agarwal_2021/figure11.png)

In Figure 11, the authors re-evaluate several famous continuous control algorithms (like CURL and SUNRISE). When they plot the 95% Confidence Intervals (the error bars) for these algorithms, they find that the error bars massively overlap. If the error bars overlap, it means the performance difference is not statistically significant—the gains are just spurious randomness.

**Thesis Application:** When you plot your final bar charts (e.g., Throughput of MAPPO vs Genetic Algorithm), you MUST include 95% Confidence Interval error bars on the graph. If your MAPPO error bar is completely above the baseline's error bar with no overlap, you have mathematically proven your thesis is a success!

## 7. The Myth of Fixed Random Seeds
![Figure A.13: Runs can be different from using fixed random seeds](/literature/agarwal_2021/figureA13.png)

In Appendix A.2, the authors debunk a common misconception in RL: *If I fix my random seeds (e.g., `np.random.seed(42)`), my results are perfectly reproducible.* 
The authors prove that because modern Deep RL relies on GPUs, the parallel processing in GPUs introduces inherent non-determinism. Two runs on the exact same hardware with the exact same fixed random seed can yield completely different scores.

**Thesis Application:** If an examiner asks why you ran 20 different evaluations instead of just fixing the random seed to prove it works once, you cite this exact appendix. Fixing seeds does not guarantee determinism in Deep Learning. Robustness *must* be proven through multiple runs.

## 8. Mathematical Proof of IQM
![Figure A.16: Statistical Efficiency of IQM](/literature/agarwal_2021/figureA16.png)

Why exactly did the authors choose to trim 25% of the data for the Interquartile Mean (IQM)? Why not 10% or 40%? In Appendix Figure A.16, they plot the Mean Squared Error (MSE) of different trim fractions. A trim fraction of 0% (the standard Mean) has high error due to outliers. A trim fraction of nearly 50% (the standard Median) has high error due to volatility. Exactly 25% (the IQM) mathematically minimizes the Mean Squared Error.

## 9. The Statistical Bias of "Max Score" Evaluation
![Figure 5: Normalized DER scores with non-standard protocols](/literature/agarwal_2021/figure5.png)

In Appendix A.4, the authors dive deep into the math of why you cannot report the "best" episode your algorithm ever achieved during training. 
Because training performance is a random variable, *"the maximum of a set of random variables is a biased estimate of their true maximum."* By reporting the max score, algorithms artificially inflate their performance through positive statistical bias.

**Thesis Application:** In your Methodology chapter, explicitly state: *"Following Agarwal et al. (2021), this thesis rejects the positively-biased 'maximum evaluation score' protocol. All reported metrics reflect the aggregated end-of-training performance of the agent."* This shows immense academic maturity.

## 10. Bootstrap Resampling Parameters
In Appendix A.5, the authors detail exactly how they generated those 95% Confidence Intervals. They used the **Percentile Bootstrap** method, re-sampling the runs **50,000 times**.

**Thesis Application:** When you process your PettingZoo simulation results in Python (using the authors' `rliable` library or your own script), you should set your bootstrap re-sampling parameter to `N = 50,000`. You can cite this appendix for using that exact number.

## 11. Statistical Meaningfulness (Neyman-Pearson Criterion)
In Appendix A.7, the authors provide the exact mathematical formula for calculating the "Probability of Improvement" metric: the **Mann-Whitney U-statistic**. 
Crucially, they provide a hard threshold for determining if your algorithm is actually successful. Based on the Neyman-Pearson statistical testing criterion, if the **upper bound of your Confidence Interval is higher than 0.75 (75%)**, then your results are officially considered **statistically meaningful**.

**Thesis Application:** This is your finish line! When you evaluate MAPPO vs the Shortest Queue Baseline, you will calculate the Mann-Whitney Probability of Improvement. If the upper CI hits 76%, you literally just write: *"According to the Neyman-Pearson statistical testing criterion outlined by Agarwal et al. (2021), the upper confidence interval exceeds 0.75, mathematically proving that MAPPO provides a statistically meaningful improvement over the baseline."* 

---

# Final Thesis Conclusion for Paper 10
Agarwal et al. (2021) provides the ultimate modern statistical framework for evaluating Deep RL. It protects your thesis from any claims of "statistical invalidity" by contributing the following:
1. **Rejection of Point Estimates:** It proves that claiming superiority based on the Mean or Median of 3-5 runs is scientifically invalid.
2. **The IQM Standard:** It establishes the Interquartile Mean (IQM) as the most robust metric for aggregating RL performance, proving it mathematically minimizes Mean Squared Error.
3. **Probability of Improvement:** It introduces the Mann-Whitney U-statistic to calculate the probability that your MAPPO agent beats the baseline, establishing a 0.75 upper-CI threshold for "statistical meaningfulness".
4. **Evaluation Protocol Integrity:** It mathematically outlaws the practice of reporting the "maximum evaluation score" during training due to positive statistical bias, mandating end-of-training evaluation.
5. **Confidence Intervals:** It mandates the use of 95% Stratified Bootstrap Confidence Intervals (computed via 50,000 percentile bootstrap resamples) on all bar charts to prove that performance gains are statistically defensible and not just random seed luck.
6. **The Myth of Fixed Seeds:** It proves that GPU non-determinism invalidates the idea that a "fixed random seed" guarantees reproducibility, mathematically requiring multiple independent runs.
