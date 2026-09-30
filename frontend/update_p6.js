const fs = require('fs');

let page = fs.readFileSync('src/app/background/page.tsx', 'utf8');

const p6_replacement = `          {/* Point 6 */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
                <AlertTriangle className="w-6 h-6 text-zinc-900" />
              </div>
              <div className="w-full">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
                  6. What Challenges Did AGV Usage Bring In?
                </h2>
                <div className="text-zinc-800 leading-relaxed space-y-6 text-justify">
                  <p>AGVs solved the labour and safety problem but created an entirely new class of engineering and optimisation challenges. A landmark survey by Vis (2006) formally categorised these into <strong className="text-zinc-900 font-semibold">distinct, interrelated sub-problems</strong>, each requiring separate research attention:</p>
                  
                  <div className="p-4 bg-zinc-100 rounded-2xl border border-zinc-200 flex gap-3">
                    <FileText className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-zinc-700 italic">Vis, I.F.A. (2006). Survey of research in the design and control of automated guided vehicle systems. European Journal of Operational Research, 170(3), 677-709. (The primary taxonomic reference for all AGV challenges).</p>
                    </div>
                  </div>

                  <div className="space-y-6 mt-6">
                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg mb-1">Challenge 1: Guide Path Layout Design</h3>
                      <p>Before any AGV moves, someone must decide <em>where the roads go</em>. In a factory or warehouse, this means designing the directed graph of paths - one-way lanes, intersections, loop structures - that all AGVs must follow. A poor layout creates structural bottlenecks that no amount of clever dispatching can fix.</p>
                      <p className="text-sm text-zinc-700 italic mt-1">Egbelu, P.J., & Tanchoco, J.M.A. (1984) demonstrated through their factory simulation that layout directly determines whether certain dispatching rules cause gridlock.</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg mb-1">Challenge 2: Fleet Sizing</h3>
                      <p>How many AGVs does a facility actually need? Too few: workstations starve, throughput collapses. Too many: AGVs interfere with each other, congestion increases, and the marginal vehicle actually <em>reduces</em> system productivity. Fleet sizing is a strategic decision that depends on the layout, the task arrival rate, and the dispatching policy - meaning all three problems are interdependent.</p>
                      <p className="text-sm text-zinc-700 italic mt-1">Carlo, H.J., Vis, I.F.A., & Roodbergen, K.J. (2014) explicitly list fleet sizing as one of the three core transport decision problems.</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg mb-1">Challenge 3: Routing and Conflict-Free Pathfinding</h3>
                      <p>Once an AGV is assigned a task, it must find a <em>path</em> from its current position to the destination. In a multi-AGV environment this is not trivial - two AGVs heading toward each other on a one-way lane create a conflict. Computing collision-free paths for an entire fleet simultaneously is computationally hard.</p>
                      <p className="mt-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-sm text-zinc-700">
                        <strong className="text-zinc-900">Note:</strong> Routing and dispatching are frequently confused but are formally distinct problems. <strong>Routing</strong> is static path planning; <strong>Dispatching</strong> is dynamic real-time task assignment (Carlo et al., 2014). They are typically decoupled, with routing handled by lower-level controllers (Grunow, M., Günther, H.O., & Lehmann, M., 2006).
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg mb-1">Challenge 4: Deadlock and Traffic Management</h3>
                      <p>Multiple AGVs sharing narrow paths can enter gridlock - a circular waiting condition where no vehicle can move because each is blocked by another. This is not a theoretical edge case; it is a real, documented failure mode.</p>
                      <p className="text-sm text-zinc-700 italic mt-1">Egbelu & Tanchoco (1984) showed the Shortest Travel Distance rule caused complete factory gridlock, dropping throughput from ~770 unit loads to near zero. They termed this the "Locking Phenomenon."</p>
                      <p className="mt-2">Two mitigation strategies exist: <strong>deadlock prevention</strong> (zone control) and <strong>deadlock resolution</strong> (detect and untangle). Both add operational overhead.</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg mb-1">Challenge 5: Dispatching Complexity</h3>
                      <p>With <em>n</em> AGVs and <em>m</em> tasks, the number of possible assignment combinations is factorial in scale. Finding the globally optimal assignment is NP-hard. Exact mathematical solvers (like MIP) can find the optimal answer - but too slowly for real-time use.</p>
                      <p className="text-sm text-zinc-700 italic mt-1">Kim, K.H., & Bae, J.W. (2004) required runtimes exceeding 1 minute per dispatching decision using exact MIP, forcing them to use a look-ahead heuristic.</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg mb-1">Challenge 6: Dynamic Re-planning Under Disruption</h3>
                      <p>Real facilities are not static. An AGV breaks down mid-route. A machine finishes early. A new urgent job arrives. Any such event can invalidate an entire pre-computed schedule, requiring expensive re-optimisation from scratch - during which the fleet operates blind.</p>
                      <p className="text-sm text-zinc-700 italic mt-1">Grunow et al. (2006) concluded that offline schedules are near-optimal in stable conditions but fragile under uncertainty.</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg mb-1">Challenge 7: Synchronisation With Other Automated Equipment</h3>
                      <p>In facilities where AGVs interact with other machines - robotic arms, cranes, conveyors - both sides must be ready simultaneously. The AGV cannot load itself; the machine cannot hold a part indefinitely. Any timing mismatch causes the more expensive piece of equipment to sit idle.</p>
                      <p className="text-sm text-zinc-700 italic mt-1">Carlo et al. (2014) noted that because AGVs are non-lifting, both the AGV and crane must be present simultaneously. "Any inefficiency here causes a complete system bottleneck."</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg mb-1">Challenge 8: Battery Management and Charging Scheduling</h3>
                      <p>AGVs are battery-powered. A vehicle running low on charge mid-task must either abandon the task or finish it before heading to a charging station. Deciding <em>when</em> to charge, <em>which</em> vehicle to recall, and <em>which</em> station to send it to - without disrupting the fleet - is a scheduling problem layered on top of dispatching.</p>
                      <p className="text-sm text-zinc-700 italic mt-1">Yang, X., Hu, H., et al. (2025). AGV Scheduling in Automated Container Terminals Considering Multi-Load Strategy and Charging Requirements. International Journal of Production Research, 63(23).</p>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-cyan-50/50 rounded-2xl border border-cyan-100">
                    <h3 className="font-bold text-cyan-900 text-lg mb-2">The Core Insight: These Challenges Are Interdependent</h3>
                    <p className="text-cyan-800">
                      The reason AGV management is genuinely hard is that none of these eight challenges can be solved in isolation. The fleet size affects deadlock probability. The routing policy affects dispatching options. The charging schedule affects vehicle availability. A dispatching decision that looks optimal right now may cause a deadlock 3 moves later.
                    </p>
                    <p className="text-cyan-800 mt-2 font-medium">
                      This interdependence is precisely why simple rules (Era 2) and even sophisticated optimisers (Era 3) eventually reach their limits - and why adaptive, learned policies (Era 4 / DRL) are the current frontier.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>`;

const startIndex = page.indexOf('{/* Point 6 */}');
const endIndex = page.indexOf('{/* Point 7 */}');

if (startIndex !== -1 && endIndex !== -1) {
    const newPage = page.substring(0, startIndex) + p6_replacement + '\n\n          ' + page.substring(endIndex);
    fs.writeFileSync('src/app/background/page.tsx', newPage, 'utf8');
    console.log('Replaced Point 6 successfully.');
} else {
    console.log('Could not find boundaries');
}
