const fs = require('fs');

let page = fs.readFileSync('src/app/background/page.tsx', 'utf8');

const p8_replacement = `          {/* Point 8 */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
                <Ship className="w-6 h-6 text-zinc-900" />
              </div>
              <div className="w-full min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
                  8. AGVs in ACTs
                </h2>
                <div className="text-zinc-800 leading-relaxed space-y-4 text-justify">
                  <p>In an Automated Container Terminal (ACT), the AGV acts as the circulatory system of the port. The precise flow of an import container is a rigidly coupled chain:</p>
                  
                  <div className="py-4 flex items-center justify-start lg:justify-center gap-2 sm:gap-4 text-sm font-medium overflow-x-auto w-full pb-6 px-2">
                    <div className="flex flex-col items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 min-w-[90px] shrink-0">
                      <Ship className="w-5 h-5" />
                      <span>Ship</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-300 shrink-0" />
                    <div className="flex flex-col items-center gap-2 p-3 bg-cyan-50 text-cyan-700 rounded-xl border border-cyan-100 min-w-[90px] shrink-0">
                      <Anchor className="w-5 h-5" />
                      <span className="text-center leading-tight">Quay<br/>Crane</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-300 shrink-0" />
                    <div className="flex flex-col items-center gap-2 p-3 bg-zinc-900 text-white rounded-xl shadow-md min-w-[90px] shrink-0">
                      <Truck className="w-5 h-5 text-zinc-300" />
                      <span>AGV</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-300 shrink-0" />
                    <div className="flex flex-col items-center gap-2 p-3 bg-purple-50 text-purple-700 rounded-xl border border-purple-100 min-w-[90px] shrink-0">
                      <Box className="w-5 h-5" />
                      <span className="text-center leading-tight">I/O<br/>Point</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-300 shrink-0" />
                    <div className="flex flex-col items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 min-w-[90px] shrink-0">
                      <Construction className="w-5 h-5" />
                      <span className="text-center leading-tight">Yard<br/>Crane</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-300 shrink-0" />
                    <div className="flex flex-col items-center gap-2 p-3 bg-orange-50 text-orange-700 rounded-xl border border-orange-100 min-w-[90px] shrink-0">
                      <Layers className="w-5 h-5" />
                      <span className="text-center leading-tight">Yard<br/>Block</span>
                    </div>
                  </div>

                  <p>AGVs occupy the <strong className="text-zinc-900 font-semibold">Transport Area</strong> - the critical, high-traffic middle link between the seaside and the storage yard.</p>

                  <div className="bg-zinc-100 border border-zinc-200 p-5 rounded-2xl mt-6">
                    <p className="font-bold text-zinc-900 mb-2 text-lg">The Exact Mechanical Handoff (The Synchronisation Bottleneck):</p>
                    <p className="text-zinc-700">Because AGVs are formally classified as non-lifting transfer vehicles (Carlo et al., 2014), they cannot pick up or drop off a container on the ground. They must drive to a designated Transfer Point (I/O point) and wait. The QC must lower the container directly onto the AGV chassis, and later, the AYC must lift it directly off.</p>
                    <p className="text-zinc-900 font-medium mt-3">This creates a rigid temporal coupling: if a crane is delayed by just two minutes, the assigned AGV is paralyzed, unable to move or take new jobs.</p>
                  </div>

                  <div className="my-8 rounded-2xl overflow-hidden border border-zinc-200 shadow-sm">
                    <img 
                      src="/background/port_cranes.jpg" 
                      alt="Quay Cranes loading an automated container terminal" 
                      className="w-full object-cover max-h-96"
                    />
                    <div className="bg-zinc-100 px-4 py-3 text-xs text-zinc-700 font-medium text-center border-t border-zinc-200">
                      Quay Cranes interfacing with the transport area.
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <p className="font-bold text-zinc-900 text-lg mb-4">Key physical and kinematic constraints unique to ACTs:</p>
                    <p className="text-zinc-700 mb-4">Based on the foundational terminal blueprints by Liu et al. (2001) and Grunow et al. (2006), AGV dispatching is governed by strict physical realities:</p>
                    
                    <ul className="space-y-4 text-zinc-700">
                      <li className="flex gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-cyan-500 shrink-0"></div>
                        <div>
                          <strong className="text-zinc-900 font-semibold">Kinematic Penalties (Speed):</strong> AGV velocities are highly state-dependent. An empty AGV typically travels at ~10 mph, but once loaded with a 30-ton container, its speed drops by 50% (to ~5 mph).
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-cyan-500 shrink-0"></div>
                        <div>
                          <strong className="text-zinc-900 font-semibold">Two-Tiered Road Networks:</strong> AGVs do not move freely like cars in a parking lot. The graph is divided into Transit Roads (high-speed vertical/horizontal arteries where stopping is forbidden) and Working Roads (local lanes under the cranes where loading/unloading occurs).
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-cyan-500 shrink-0"></div>
                        <div>
                          <strong className="text-zinc-900 font-semibold">Low-Level Traffic Abstraction:</strong> To prevent empty, fast-moving AGVs from rear-ending slow, loaded AGVs, ports utilize hardware-level "Low-Speed Zones" and maintain strict 45-foot inter-vehicle safety spacings. Intersections are handled locally via "Modified First Come First Pass" rules, abstracting collision physics away from the high-level dispatcher.
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-cyan-500 shrink-0"></div>
                        <div>
                          <strong className="text-zinc-900 font-semibold">Throughput Saturation (The 48-AGV Limit):</strong> Fleet scaling is non-linear. For a terminal with 5 QCs operating at 42 moves/hour, productivity mathematically flattens at ~48 AGVs. Injecting a 49th AGV yields zero extra throughput; it merely adds to intersection congestion and queue waiting times.
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-cyan-500 shrink-0"></div>
                        <div>
                          <strong className="text-zinc-900 font-semibold">Workload Distribution:</strong> Container flow is not perfectly uniform. In a typical unloading cycle, jobs are stochastically distributed: ~70% route to the main storage yard, ~18% route directly to the truck gate buffers, and ~12% route to rail train buffers.
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="my-8 rounded-2xl overflow-hidden border border-zinc-200 shadow-sm">
                    <img 
                      src="/background/terminal_layout.png" 
                      alt="General layout of automated container terminals" 
                      className="w-full object-cover max-h-96"
                    />
                    <div className="bg-zinc-100 px-4 py-3 text-xs text-zinc-700 font-medium text-center border-t border-zinc-200">
                      The general layout of automated container terminals (Liu et al., 2001).
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;

const startIndex = page.indexOf('{/* Point 8 */}');
const endIndex = page.indexOf('{/* Point 9 */}');

if (startIndex !== -1 && endIndex !== -1) {
    const newPage = page.substring(0, startIndex) + p8_replacement + '\n\n          ' + page.substring(endIndex);
    fs.writeFileSync('src/app/background/page.tsx', newPage, 'utf8');
    console.log('Replaced Point 8 successfully.');
} else {
    console.log('Could not find boundaries');
}
