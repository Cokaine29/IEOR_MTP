const fs = require('fs');

let page = fs.readFileSync('src/app/background/page.tsx', 'utf8');

const p11_replacement = `          {/* Point 11 */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-indigo-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 bg-indigo-50 rounded-bl-3xl">
              <span className="text-indigo-700 font-bold text-xs uppercase tracking-widest">State of the Art</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-indigo-100 rounded-xl shrink-0">
                <BookOpen className="w-6 h-6 text-indigo-700" />
              </div>
              <div className="w-full min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4 pr-32">
                  11. State of the Art in Stochastic AGV Dispatching — and the Gap
                </h2>
                <div className="text-zinc-800 leading-relaxed space-y-6 text-justify">
                  <p>The table below maps the complete evolutionary chain of AGV dispatching research — what stochasticity each approach handled, and the critical limitation that drove the next generation of research:</p>
                  
                  <div className="overflow-x-auto rounded-xl border border-zinc-200">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-zinc-100 text-zinc-900 font-semibold border-b border-zinc-200">
                        <tr>
                          <th className="px-4 py-3 border-r border-zinc-200 w-12 text-center">#</th>
                          <th className="px-4 py-3 border-r border-zinc-200 min-w-[180px]">Methodology</th>
                          <th className="px-4 py-3 border-r border-zinc-200 min-w-[160px]">Representative Work</th>
                          <th className="px-4 py-3 border-r border-zinc-200 min-w-[180px]">Stochasticity Handled</th>
                          <th className="px-4 py-3 min-w-[250px]">Critical Limitation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 bg-white">
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 text-center font-semibold text-zinc-500">1</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Rule-Based Dispatching</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Egbelu & Tanchoco (1984)</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">None — fully deterministic</td>
                          <td className="px-4 py-3 text-red-700">Collapses under disruption. The "Locking Phenomenon" proved the Nearest Vehicle rule causes complete gridlock under heavy load.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 text-center font-semibold text-zinc-500">2</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Mathematical Optimisation (MILP / OR)</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Kim & Bae (2004); Grunow et al. (2006)</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Empirical crane cycle variance modelled offline</td>
                          <td className="px-4 py-3 text-red-700">Runtimes exceed 1 minute per dispatching decision — computationally infeasible for real-time port use. Fragile: any disruption requires a full re-solve from scratch.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 text-center font-semibold text-zinc-500">3</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Uncertainty-Aware Optimisation</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Angeloudis & Bell (2010)</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Traffic uncertainty via a formal Uncertainty Index embedded in the objective function</td>
                          <td className="px-4 py-3 text-red-700">Only a 2-step look-ahead; no equipment failure or weather modelling. Still an offline optimiser, not a reactive real-time policy.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 text-center font-semibold text-zinc-500">4</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Tabular Q-Learning</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Failed baseline documented in Choe et al. (2016)</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Two-mode crane variance (stable T1 vs chaotic T2)</td>
                          <td className="px-4 py-3 text-red-700">Curse of Dimensionality — Q-table explodes exponentially with fleet size. Dominated by simple heuristics in all chaotic-condition tests. Cannot generalise to unseen terminal states.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 text-center font-semibold text-zinc-500">5</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Online Preference Learning (Neural Network)</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Choe et al. (2016) — their proposed method</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Two-mode crane variance (stable T1 vs chaotic T2)</td>
                          <td className="px-4 py-3 text-red-700">Only one disruption source. Purely single-agent. Requires computationally expensive simulation rollouts at every decision step.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 text-center font-semibold text-zinc-500">6</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Single-Agent DRL — DQN</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Zheng et al. (2022)</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Dynamic task arrival timing</td>
                          <td className="px-4 py-3 text-red-700">No physical equipment failures, no cascading disruptions, no weather. Authors explicitly acknowledge the action space explosion caps the method at ~12 AGVs. Centralised single controller.</td>
                        </tr>
                        <tr className="bg-indigo-50/50 hover:bg-indigo-50 transition-colors border-t-2 border-indigo-200">
                          <td className="px-4 py-3 border-r border-zinc-200 text-center font-bold text-indigo-600">7</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-bold text-indigo-900">Single-Agent DRL — PPO</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-bold text-indigo-700">This Thesis — Phase 1</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-medium text-indigo-800">Crane cycle variability + travel time noise + stochastic task arrivals — simultaneously</td>
                          <td className="px-4 py-3 text-indigo-600 font-semibold text-center">—</td>
                        </tr>
                        <tr className="bg-indigo-100/50 hover:bg-indigo-100/70 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 text-center font-bold text-indigo-700">8</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-bold text-indigo-950">Multi-Agent DRL — MAPPO</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-bold text-indigo-800">This Thesis — Phase 2 <span className="block text-xs font-normal mt-1 opacity-80">(Yu et al. (2021) framework applied to ACT domain)</span></td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-medium text-indigo-900">Simultaneous multi-source disruptions across a full decentralised AGV fleet</td>
                          <td className="px-4 py-3 text-indigo-600 font-semibold text-center">—</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8 space-y-6">
                    <h3 className="text-xl font-bold text-zinc-900 border-b border-zinc-200 pb-2">Three Structural Gaps That Emerge</h3>
                    
                    <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                      <h4 className="text-lg font-bold text-indigo-700 mb-2">Gap 1 — Stochasticity Has Always Been Single-Source</h4>
                      <p className="text-zinc-700 mb-3">Every paper from Row 1 to Row 6 introduces at most one type of disruption in isolation. No existing study simultaneously models crane cycle variability, AGV travel time noise, and stochastic task arrivals as co-occurring events — which is the reality of every operational shift in a live port.</p>
                      <div className="border-l-4 border-indigo-300 pl-4 py-2 text-sm bg-indigo-50/50 text-indigo-900 rounded-r-lg shadow-sm">
                        <strong className="font-semibold">Evidence:</strong> Carlo et al. (2014), reviewed 56 ACT papers published between 1993–2012. Papers combining AGV dispatching with stochastic optimisation = <strong>exactly zero.</strong>
                      </div>
                    </div>

                    <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                      <h4 className="text-lg font-bold text-indigo-700 mb-2">Gap 2 — Deep RL Applied to ACT Dispatching is Stuck at DQN</h4>
                      <p className="text-zinc-700 mb-3">The only Deep RL paper applied to the ACT AGV dispatching problem (Zheng 2022) uses DQN — an older, less stable algorithm. PPO (Schulman et al., 2017) was developed precisely to address DQN's training instability and poor sample efficiency in high-dimensional environments, yet it has <strong className="text-zinc-900">never been applied to the ACT dispatching problem.</strong></p>
                      <div className="border-l-4 border-indigo-300 pl-4 py-2 text-sm bg-indigo-50/50 text-indigo-900 rounded-r-lg shadow-sm">
                        <strong className="font-semibold">Evidence:</strong> Zheng et al. (2022) themselves acknowledge their DQN formulation restricts the system to ~12 AGVs due to action space explosion — far below the 20–48 AGVs required by a real 5-QC terminal (Liu et al., 2001).
                      </div>
                    </div>

                    <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                      <h4 className="text-lg font-bold text-indigo-700 mb-2">Gap 3 — Multi-Agent Coordination Has Never Been Applied to ACT Dispatching</h4>
                      <p className="text-zinc-700">MAPPO (Yu et al., 2021) has been rigorously proven to outperform IPPO, QMIX, and MADDPG under chaotic cooperative multi-agent conditions. However, this has been demonstrated exclusively in game-theoretic benchmarks (StarCraft II, multi-robot coordination). Its application to the ACT domain — with port-realistic reward structures, crane synchronisation bottlenecks, I/O point constraints, and stochastic disruptions — has never been attempted.</p>
                    </div>
                  </div>

                  <div className="mt-10 bg-indigo-50/50 border border-indigo-200 p-6 md:p-8 rounded-2xl shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                    <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
                      <Target className="w-6 h-6 text-indigo-600" />
                      The Proposed Contribution (Phased)
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-bold text-indigo-800 text-lg flex items-center gap-2 mb-2">
                          <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded shadow-sm">Phase 1</span> 
                          Thesis Core <span className="opacity-75 text-sm ml-1">(Target: October 2026)</span>
                        </h4>
                        <p className="text-indigo-900/80 leading-relaxed mb-3 font-medium">
                          Apply <strong className="text-indigo-900 font-bold">PPO</strong> — for the first time in the ACT dispatching context — to a reproducible Gymnasium-based simulation with simultaneous multi-source stochastic disruptions (crane cycle variability + travel time noise + dynamic task arrivals). Benchmark against three verified classical baselines:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-indigo-900/80 font-medium mb-3">
                          <li><strong>Greedy / Egbelu baseline</strong> <em className="opacity-80">(Egbelu & Tanchoco, 1984)</em></li>
                          <li><strong>Look-Ahead MIP baseline</strong> <em className="opacity-80">(Kim & Bae, 2004)</em></li>
                          <li><strong>Inventory-Based dispatching baseline</strong> <em className="opacity-80">(Briskorn et al., 2006)</em></li>
                        </ul>
                        <p className="text-indigo-900/80 leading-relaxed font-medium">
                          Generate <strong className="text-indigo-900 font-bold">degradation curves</strong> — showing how each approach degrades as stochasticity intensity increases — to provide a clean, visual proof of PPO's robustness advantage over classical methods.
                        </p>
                      </div>

                      <div className="border-t border-indigo-200/60 pt-6">
                        <h4 className="font-bold text-indigo-800 text-lg flex items-center gap-2 mb-2">
                          <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded shadow-sm">Phase 2</span> 
                          Thesis Extension <span className="opacity-75 text-sm ml-1">(October 2026 → May 2027)</span>
                        </h4>
                        <p className="text-indigo-900/80 leading-relaxed font-medium">
                          Extend the Phase 1 environment to <strong className="text-indigo-900 font-bold">MAPPO</strong> for decentralised multi-agent dispatching across a full fleet of 20–48 AGVs. Evaluate under Agarwal et al. (2021) statistical standards — <strong className="text-indigo-900 font-bold">Interquartile Mean (IQM)</strong> and <strong className="text-indigo-900 font-bold">95% stratified bootstrap confidence intervals</strong> across a minimum of 20 independent seeds — to rigorously prove statistical meaningfulness under the Neyman-Pearson 0.75 upper-CI criterion.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>`;

const startIndex = page.indexOf('{/* Point 11 */}');
if (startIndex !== -1) {
    const altEndIndex = page.lastIndexOf('        </div>\n      </section>');
    const finalEndIndex = page.lastIndexOf('        </div>\r\n      </section>');
    const targetEnd = finalEndIndex !== -1 ? finalEndIndex : (altEndIndex !== -1 ? altEndIndex : page.lastIndexOf('</section>') - 18);
    
    if (targetEnd !== -1) {
        const newPage = page.substring(0, startIndex) + p11_replacement + '\n\n' + page.substring(targetEnd);
        fs.writeFileSync('src/app/background/page.tsx', newPage, 'utf8');
        console.log('Replaced Point 11 successfully.');
    } else {
        console.log('Could not find targetEnd boundaries');
    }
} else {
    console.log('Could not find Point 11.');
}
