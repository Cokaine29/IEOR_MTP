const fs = require('fs');

let page = fs.readFileSync('src/app/background/page.tsx', 'utf8');

const p9_p10_replacement = `          {/* Point 9 */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
                <History className="w-6 h-6 text-zinc-900" />
              </div>
              <div className="w-full min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
                  9. The Evolution of Dispatching: A 40-Year Quest for Optimality
                </h2>
                <div className="text-zinc-800 leading-relaxed text-justify mb-8">
                  <p>How do you assign <span className="font-semibold italic">N</span> tasks to <span className="font-semibold italic">M</span> AGVs? Over the last four decades, the approach to this problem has evolved through five distinct eras, driven by the increasing complexity of Automated Container Terminals.</p>
                </div>

                {/* Vertical Flowchart */}
                <div className="relative border-l-2 border-zinc-200 ml-4 md:ml-8 space-y-8 pb-4">
                  
                  {/* Era 1 */}
                  <div className="relative pl-6 md:pl-8">
                    <div className="absolute w-4 h-4 rounded-full bg-blue-500 -left-[9px] top-1 ring-4 ring-white" />
                    <h3 className="font-bold text-zinc-900 text-lg mb-1">
                      1. The Reactive Rule-Based Era <span className="text-sm font-medium text-zinc-500 ml-2">(1980s - 1990s)</span>
                    </h3>
                    <p className="text-zinc-700 mb-2">Early dispatching relied on static, human-designed heuristics.</p>
                    <div className="space-y-2 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                      <p><strong className="text-zinc-900">Methods:</strong> First-Come-First-Serve (FCFS), Nearest Vehicle, and Shortest Queue First (SQF).</p>
                      <p><strong className="text-red-700">The Problem:</strong> While computationally instant, these rules are purely "myopic" (short-sighted). Egbelu & Tanchoco (1984) proved that acting locally without seeing the global picture eventually leads to systemic bottlenecks and terminal deadlocks.</p>
                    </div>
                  </div>

                  {/* Era 2 */}
                  <div className="relative pl-6 md:pl-8">
                    <div className="absolute w-4 h-4 rounded-full bg-cyan-500 -left-[9px] top-1 ring-4 ring-white" />
                    <h3 className="font-bold text-zinc-900 text-lg mb-1">
                      2. The Operations Research (OR) Era <span className="text-sm font-medium text-zinc-500 ml-2">(1990s - 2000s)</span>
                    </h3>
                    <p className="text-zinc-700 mb-2">To fix the short-sightedness of basic rules, engineers turned to exact mathematical optimization.</p>
                    <div className="space-y-2 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                      <p><strong className="text-zinc-900">Methods:</strong> Mixed-Integer Linear Programming (MILP) and Discrete Event Simulation (DES).</p>
                      <p><strong className="text-red-700">The Problem:</strong> MILP guarantees a mathematically perfect, globally optimal schedule (Grunow et al., 2006). However, the computation time grows exponentially. Solving a large port assignment takes minutes to hours, making it impossible to use for split-second, real-time routing.</p>
                    </div>
                  </div>

                  {/* Era 3 */}
                  <div className="relative pl-6 md:pl-8">
                    <div className="absolute w-4 h-4 rounded-full bg-purple-500 -left-[9px] top-1 ring-4 ring-white" />
                    <h3 className="font-bold text-zinc-900 text-lg mb-1">
                      3. The Meta-Heuristic Era <span className="text-sm font-medium text-zinc-500 ml-2">(2000s - 2010s)</span>
                    </h3>
                    <p className="text-zinc-700 mb-2">To speed up the math, researchers traded "perfect" optimization for "good enough" approximations.</p>
                    <div className="space-y-2 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                      <p><strong className="text-zinc-900">Methods:</strong> Genetic Algorithms (GA), Simulated Annealing, and Greedy Search.</p>
                      <p><strong className="text-red-700">The Problem:</strong> While much faster than MILP, GAs still compute offline, rigid schedules. They assume the terminal will behave exactly as predicted. If a single AGV is delayed by 30 seconds, the entire pre-computed schedule shatters, forcing the system to pause and re-calculate.</p>
                    </div>
                  </div>

                  {/* Era 4 */}
                  <div className="relative pl-6 md:pl-8">
                    <div className="absolute w-4 h-4 rounded-full bg-orange-500 -left-[9px] top-1 ring-4 ring-white" />
                    <h3 className="font-bold text-zinc-900 text-lg mb-1">
                      4. The Early Reinforcement Learning Era <span className="text-sm font-medium text-zinc-500 ml-2">(2010s)</span>
                    </h3>
                    <p className="text-zinc-700 mb-2">The paradigm shifted from pre-computing schedules to learning dynamic policies.</p>
                    <div className="space-y-2 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                      <p><strong className="text-zinc-900">Methods:</strong> Tabular Q-Learning.</p>
                      <p><strong className="text-red-700">The Problem:</strong> Early RL agents successfully learned to adapt in real-time (Choe et al., 2016). However, they relied on lookup tables. As the number of AGVs and containers increased, they suffered from the Curse of Dimensionality (Zheng et al., 2022) - the state space grew so massive that computers literally ran out of memory trying to store the Q-table.</p>
                    </div>
                  </div>

                  {/* Era 5 */}
                  <div className="relative pl-6 md:pl-8">
                    <div className="absolute w-4 h-4 rounded-full bg-emerald-500 -left-[9px] top-1 ring-4 ring-white shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <h3 className="font-bold text-zinc-900 text-lg mb-1">
                      5. The Multi-Agent Deep RL Era <span className="text-sm font-medium text-zinc-500 ml-2">(2020s - Present)</span>
                    </h3>
                    <p className="text-zinc-700 mb-2">This brings us to the bleeding edge of current research. Deep Neural Networks replaced Q-tables, allowing agents to generalize vast state spaces.</p>
                    <div className="space-y-2 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                      <p><strong className="text-zinc-900">Methods:</strong> Deep Q-Networks (DQN), Proximal Policy Optimization (PPO), and ultimately Multi-Agent PPO (MAPPO).</p>
                      <p><strong className="text-emerald-800">The Solution:</strong> PPO (Schulman et al., 2017) stabilized neural network training, and MAPPO (Yu et al., 2021) allowed dozens of AGVs to learn cooperatively. Instead of blindly following a rigid schedule, MAPPO agents observe the terminal in real-time and dynamically adjust their behavior to maximize global throughput.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Point 10 */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-emerald-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 bg-emerald-50 rounded-bl-3xl">
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest">The Core Problem</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl shrink-0">
                <Dices className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="w-full min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4 pr-32">
                  10. The Unsolved Piece: The Stochasticity Problem
                </h2>
                <div className="text-zinc-800 leading-relaxed space-y-6 text-justify">
                  <p>The evolutionary timeline above reveals a glaring flaw in the classical methods (Rules, MILP, GA): <strong className="text-zinc-900 font-semibold">They assume the world is predictable.</strong></p>
                  <p>In a real Automated Container Terminal, operations are fundamentally stochastic (random):</p>
                  
                  <div className="overflow-x-auto rounded-xl border border-zinc-200">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-zinc-100 text-zinc-900 font-semibold border-b border-zinc-200">
                        <tr>
                          <th className="px-4 py-3 border-r border-zinc-200 min-w-[150px]">Disruption Type</th>
                          <th className="px-4 py-3">What Happens in Reality</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 bg-white">
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Crane Cycle Time</td>
                          <td className="px-4 py-3 text-zinc-700">QC handling time is normally distributed. A container caught on a ship fitting adds 2-5 minutes unpredictably.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">AGV Breakdowns</td>
                          <td className="px-4 py-3 text-zinc-700">Any AGV can fail mid-route. Offline pre-computed schedules instantly become invalid.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Traffic Congestion</td>
                          <td className="px-4 py-3 text-zinc-700">Actual AGV travel time depends on real-time traffic physics, not mathematical shortest-path estimates.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Weather</td>
                          <td className="px-4 py-3 text-zinc-700">High winds reduce crane speed. Night fog causes sensory delays.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Vessel Arrival</td>
                          <td className="px-4 py-3 text-zinc-700">The entire terminal schedule shifts if a container ship arrives 3 hours late.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="mt-4">When classical OR methods face these disruptions, they either ignore them (causing performance to degrade severely) or they must re-solve the entire optimization from scratch - taking minutes, during which the terminal operates blindly.</p>

                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 shadow-sm mt-6">
                    <p className="text-emerald-900 font-medium leading-relaxed">
                      Deep Reinforcement Learning (specifically MAPPO) fundamentally changes this. An RL agent acts as a variance stabilizer (Choe et al., 2016). It does not compute a fragile schedule; it learns a resilient policy. When a crane breaks, the MAPPO agents instantly and organically reroute, exactly like a human brain adapting to a blocked road.
                    </p>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-bold text-zinc-900 text-lg mb-3">The Quantitative Research Gap</h3>
                    <p className="mb-4">Despite this clear theoretical advantage, a landmark review of container terminal literature by Carlo et al. (2014) highlighted a massive gap in applied research. Of the 56 routing and dispatching papers reviewed:</p>
                    
                    <ul className="list-disc pl-5 space-y-2 text-zinc-700 font-medium mb-6">
                      <li>Only 13 (23%) considered stochastic ready times.</li>
                      <li>Only 5 (9%) considered stochastic due times.</li>
                      <li className="text-red-600 font-bold bg-red-50 p-1 px-2 rounded w-fit">Papers combining AGV dispatching with deep stochastic optimization = exactly 0.</li>
                    </ul>

                    <p className="bg-zinc-900 text-white p-5 rounded-2xl font-medium shadow-sm leading-relaxed">
                      <span className="text-cyan-400 font-bold">This represents the precise research gap that this thesis aims to close.</span> By applying MAPPO to a stochastically disrupted PettingZoo port environment, this project bridges the gap between theoretical Multi-Agent Deep RL and the volatile physical realities of modern container terminals.
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>`;

const startIndex = page.indexOf('{/* Point 9 */}');

if (startIndex !== -1) {
    // We just replace everything from Point 9 to the end of the sections block.
    // Let's find the closing tags of the main flex col that contains all the points.
    // The points are inside <div className="space-y-12">.
    const altEndIndex = page.lastIndexOf('        </div>\n      </section>');
    const finalEndIndex = page.lastIndexOf('        </div>\r\n      </section>');
    const targetEnd = finalEndIndex !== -1 ? finalEndIndex : (altEndIndex !== -1 ? altEndIndex : page.lastIndexOf('</section>') - 18);
    
    if (targetEnd !== -1) {
        const newPage = page.substring(0, startIndex) + p9_p10_replacement + '\n\n' + page.substring(targetEnd);
        fs.writeFileSync('src/app/background/page.tsx', newPage, 'utf8');
        console.log('Replaced Point 9 and 10 successfully.');
    } else {
        console.log('Could not find targetEnd boundaries');
    }
} else {
    console.log('Could not find boundaries');
}
