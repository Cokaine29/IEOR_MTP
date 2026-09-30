const fs = require('fs');

let page = fs.readFileSync('src/app/background/page.tsx', 'utf8');

if (!page.includes('Target')) {
    page = page.replace("from 'lucide-react';", ", Target } from 'lucide-react';");
}

const p11 = `
          {/* Point 11 */}
          <div className="bg-zinc-900 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-800 relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 p-4 bg-zinc-800 rounded-bl-3xl">
              <span className="text-zinc-300 font-bold text-xs uppercase tracking-widest">State of the Art</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-zinc-800 rounded-xl shrink-0">
                <BookOpen className="w-6 h-6 text-zinc-100" />
              </div>
              <div className="w-full min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-white mb-4 pr-32">
                  11. Existing Research on Stochastic AGV Dispatching: The State of the Art and the Gap
                </h2>
                <div className="text-zinc-300 leading-relaxed space-y-6 text-justify">
                  <p>The last three years (2022-2025) have seen an explosion of interest in applying Deep Reinforcement Learning to ACT AGV dispatching. However, a careful analysis of this body of work reveals that existing research has addressed stochasticity in only <strong className="text-white font-semibold">partial, isolated, or domain-mismatched</strong> ways. The following table maps what each category of research has done - and critically, what it has left undone:</p>
                  
                  <div className="overflow-x-auto rounded-xl border border-zinc-700">
                    <table className="w-full text-sm text-left text-zinc-300">
                      <thead className="bg-zinc-800 text-white font-semibold border-b border-zinc-700">
                        <tr>
                          <th className="px-4 py-3 border-r border-zinc-700 min-w-[180px]">Research Category</th>
                          <th className="px-4 py-3 border-r border-zinc-700 min-w-[150px]">Representative Work</th>
                          <th className="px-4 py-3 border-r border-zinc-700 min-w-[180px]">Level of Stochasticity Introduced</th>
                          <th className="px-4 py-3 min-w-[200px]">What Was Left Unaddressed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-700 bg-zinc-900/50">
                        <tr className="hover:bg-zinc-800/50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-700 font-semibold text-white">Rule-Based Dispatching</td>
                          <td className="px-4 py-3 border-r border-zinc-700">Egbelu & Tanchoco (1984)</td>
                          <td className="px-4 py-3 border-r border-zinc-700">None - fully deterministic</td>
                          <td className="px-4 py-3 text-red-300">Collapses under any real-world disruption.</td>
                        </tr>
                        <tr className="hover:bg-zinc-800/50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-700 font-semibold text-white">OR/MILP Optimization</td>
                          <td className="px-4 py-3 border-r border-zinc-700">Grunow et al. (2006); Kim & Bae (2004)</td>
                          <td className="px-4 py-3 border-r border-zinc-700">Modeled via empirical variance in crane cycles only</td>
                          <td className="px-4 py-3 text-red-300">Offline re-optimization required; cannot respond in real-time.</td>
                        </tr>
                        <tr className="hover:bg-zinc-800/50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-700 font-semibold text-white">Single-Agent DRL (DQN)</td>
                          <td className="px-4 py-3 border-r border-zinc-700">Zheng et al. (2022)</td>
                          <td className="px-4 py-3 border-r border-zinc-700">Dynamic task arrivals (timing randomness only)</td>
                          <td className="px-4 py-3 text-red-300">No physical equipment failures, no weather, no cascading disruptions. Single centralized controller.</td>
                        </tr>
                        <tr className="hover:bg-zinc-800/50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-700 font-semibold text-white">Single-Agent NN Variance Stabilization</td>
                          <td className="px-4 py-3 border-r border-zinc-700">Choe et al. (2016)</td>
                          <td className="px-4 py-3 border-r border-zinc-700">Two-mode crane variance (T1 stable vs T2 chaotic)</td>
                          <td className="px-4 py-3 text-red-300">Only one disruption source. No AGV breakdowns, no multi-agent cooperation.</td>
                        </tr>
                        <tr className="hover:bg-zinc-800/50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-700 font-semibold text-white">Multi-Load & Charging Schedules</td>
                          <td className="px-4 py-3 border-r border-zinc-700">Yang et al. (2025)</td>
                          <td className="px-4 py-3 border-r border-zinc-700">Battery exhaustion and charging demand variability</td>
                          <td className="px-4 py-3 text-red-300">Uses MIP + Variable Neighbourhood Search; offline optimization, not a learned real-time policy.</td>
                        </tr>
                        <tr className="hover:bg-zinc-800/50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-700 font-semibold text-white">MADDPG Multi-Agent Path Planning</td>
                          <td className="px-4 py-3 border-r border-zinc-700">Various (2023-2024, MDPI/ResearchGate)</td>
                          <td className="px-4 py-3 border-r border-zinc-700">Conflict resolution in dynamic traffic</td>
                          <td className="px-4 py-3 text-red-300">Focuses on <em className="text-zinc-100">routing</em> (how to move), not <em className="text-zinc-100">dispatching</em> (which job to assign). Stochasticity limited to traffic flow, not equipment failure or weather.</td>
                        </tr>
                        <tr className="hover:bg-zinc-800/50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-700 font-semibold text-white">MAPPO in General MARL</td>
                          <td className="px-4 py-3 border-r border-zinc-700">Yu et al. (2021)</td>
                          <td className="px-4 py-3 border-r border-zinc-700">Extremely high (StarCraft II, multi-robot chaos)</td>
                          <td className="px-4 py-3 text-red-300">Algorithm proven robust but never applied to a port-specific environment with crane constraints, I/O synchronization, or terminal reward structures.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8 space-y-6">
                    <h3 className="text-xl font-bold text-white border-b border-zinc-700 pb-2">Three structural gaps emerge clearly from this landscape:</h3>
                    
                    <div>
                      <h4 className="text-lg font-bold text-cyan-400 mb-2">Gap 1 — Stochasticity is always single-source.</h4>
                      <p>Every existing paper introduces one type of disruption at a time. No study simultaneously models crane cycle variability <em className="text-zinc-100">and</em> AGV breakdowns <em className="text-zinc-100">and</em> weather-induced speed reductions as co-occurring events. Real terminals experience all three at once.</p>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-cyan-400 mb-2">Gap 2 — Multi-agent architectures avoid disruption modeling.</h4>
                      <p>The papers that use MADDPG or other multi-agent frameworks (2023-2024) focus exclusively on low-level conflict-free path planning. They treat dispatching (the high-level job assignment problem) as already solved. The papers that attempt dispatching use single-agent DQN, which cannot scale to a fleet of 48 AGVs without centralization bottlenecks.</p>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-cyan-400 mb-2">Gap 3 — The algorithm-domain mismatch.</h4>
                      <p>MAPPO (Yu et al., 2021) has been rigorously proven to outperform IPPO, QMIX, and MADDPG under chaotic multi-agent conditions — but exclusively in game-theoretic or generic robotics domains. Its application to the <em className="text-zinc-100">specific</em> ACT domain, with port-realistic reward functions, crane speed limits, I/O point synchronization bottlenecks, and NeurIPS-standard statistical evaluation, has not been done.</p>
                    </div>
                  </div>

                  <div className="mt-10 bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-800/50 p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Target className="w-6 h-6 text-cyan-400" />
                      The Proposed Contribution
                    </h3>
                    <p className="text-zinc-200 text-base md:text-lg leading-relaxed font-medium">
                      This thesis bridges all three gaps simultaneously. By applying MAPPO — a decentralized, cooperative multi-agent framework — to a PettingZoo-based ACT environment that concurrently injects <strong className="text-white bg-cyan-900/50 px-1 py-0.5 rounded">crane cycle stochasticity, AGV failure events, and weather-induced speed penalties</strong>, and by evaluating results under the rigorous Agarwal et al. (2021) statistical standards (IQM + 95% Confidence Intervals), this thesis makes the first end-to-end contribution at the intersection of: <strong className="text-cyan-300 block mt-3 text-center text-lg md:text-xl p-3 bg-black/30 rounded-xl border border-white/10">multi-agent dispatching + simultaneous multi-source disruptions + port-specific physics + rigorous statistical evaluation.</strong>
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>`;

const altEndIndex = page.lastIndexOf('        </div>\n      </section>');
const finalEndIndex = page.lastIndexOf('        </div>\r\n      </section>');
const targetEnd = finalEndIndex !== -1 ? finalEndIndex : (altEndIndex !== -1 ? altEndIndex : page.lastIndexOf('</section>') - 18);

if (targetEnd !== -1) {
    const newPage = page.substring(0, targetEnd) + p11 + '\n\n' + page.substring(targetEnd);
    fs.writeFileSync('src/app/background/page.tsx', newPage, 'utf8');
    console.log('Appended Point 11 successfully.');
} else {
    console.log('Could not find targetEnd boundaries');
}
