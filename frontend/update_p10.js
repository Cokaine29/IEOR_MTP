const fs = require('fs');

let page = fs.readFileSync('src/app/background/page.tsx', 'utf8');

const p10_replacement = `          {/* Point 10 */}
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
                  <p>The evolutionary timeline above reveals a glaring flaw in the classical methods (Rules, MILP, GA): <strong className="text-zinc-900 font-semibold">They assume the world is mathematically predictable.</strong></p>
                  <p>In a real Automated Container Terminal, operations are governed by severe stochastic (random) disruptions, all of which have been thoroughly documented in the literature:</p>
                  
                  <div className="overflow-x-auto rounded-xl border border-zinc-200">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-zinc-100 text-zinc-900 font-semibold border-b border-zinc-200">
                        <tr>
                          <th className="px-4 py-3 border-r border-zinc-200 min-w-[160px]">Disruption Type</th>
                          <th className="px-4 py-3 border-r border-zinc-200 min-w-[200px]">The Physical Reality</th>
                          <th className="px-4 py-3 min-w-[200px]">Academic Proof / Citation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 bg-white">
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Crane Cycle Time Variability</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">QC handling times fluctuate. A container caught on a ship fitting adds unpredictable delay minutes.</td>
                          <td className="px-4 py-3 text-zinc-700 italic text-xs">Grunow et al. (2006) explicitly proved offline models fail by showing how doubling crane cycle variance shatters pre-computed schedules.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Container Reshuffling (Yard Delays)</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">To retrieve a bottom-tier container, the Yard Crane must move the boxes above it. This adds massive, random wait times for the AGV at the I/O point.</td>
                          <td className="px-4 py-3 text-zinc-700 italic text-xs">Liu et al. (2001) identified lack of reshuffling logic as the primary cause of severe Yard Crane idle times (70.2%) in terminal simulations.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Traffic Congestion & Deadlocks</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Actual AGV travel time depends on dynamic intersection bottlenecks, not mathematical shortest-path estimates.</td>
                          <td className="px-4 py-3 text-zinc-700 italic text-xs">Egbelu & Tanchoco (1984) documented the "Locking Phenomenon" where static dispatching causes total gridlock in high-traffic.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Battery Degradation & Failures</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">AGVs experience mid-route hardware failures or must abruptly drop out of the fleet for opportunistic charging.</td>
                          <td className="px-4 py-3 text-zinc-700 italic text-xs">Zheng et al. (2022) explicitly includes the real-time "working/idle status" as a required dynamic input for neural networks due to unpredictable AGV availability.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Weather & Environmental Constraints</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">High winds physically force QCs to operate at reduced speeds, while heavy rain or fog forces AGV sensor-guidance systems to slow down.</td>
                          <td className="px-4 py-3 text-zinc-700 italic text-xs">Grunow et al. (2006) specifically cited extreme weather variations as the primary motivation for needing reactive, online dispatching.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Vessel Arrival Uncertainty</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Ships rarely arrive exactly on schedule due to ocean weather. A 3-hour delay invalidates an entire 24-hour pre-computed port assignment.</td>
                          <td className="px-4 py-3 text-zinc-700 italic text-xs">Carlo et al. (2014) highlights that stochastic ready times are one of the most critical, yet ignored, variables in port routing.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">External Truck Gate Cascades</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Highway trucks arrive randomly at the city-side gate. This queueing unpredictability cascades backward into the AGV transport area.</td>
                          <td className="px-4 py-3 text-zinc-700 italic text-xs">Liu et al. (2001) proved using M/M/n Queueing Theory that gate arrival randomness directly impacts the required minimum buffer lanes.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="mt-4">When classical Operations Research methods face these disruptions, they either ignore them (causing performance to degrade severely) or they must re-solve the entire optimization from scratch - taking minutes to hours, during which the terminal operates blindly.</p>

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

const startIndex = page.indexOf('{/* Point 10 */}');

if (startIndex !== -1) {
    const altEndIndex = page.lastIndexOf('        </div>\n      </section>');
    const finalEndIndex = page.lastIndexOf('        </div>\r\n      </section>');
    const targetEnd = finalEndIndex !== -1 ? finalEndIndex : (altEndIndex !== -1 ? altEndIndex : page.lastIndexOf('</section>') - 18);
    
    if (targetEnd !== -1) {
        const newPage = page.substring(0, startIndex) + p10_replacement + '\n\n' + page.substring(targetEnd);
        fs.writeFileSync('src/app/background/page.tsx', newPage, 'utf8');
        console.log('Replaced Point 10 successfully.');
    } else {
        console.log('Could not find targetEnd boundaries');
    }
} else {
    console.log('Could not find boundaries');
}
