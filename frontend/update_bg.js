const fs = require('fs');

let page = fs.readFileSync('src/app/background/page.tsx', 'utf8');

const p1_to_p4_replacement = `          {/* Point 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
                <Factory className="w-6 h-6 text-zinc-900" />
              </div>
              <div className="w-full">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
                  1. When and Why Did the World Feel the Need for AGVs?
                </h2>
                <div className="text-zinc-800 leading-relaxed space-y-4 text-justify">
                  <p>
                    <strong className="text-zinc-900 font-semibold">The trigger: Post-WWII industrial explosion.</strong>
                  </p>
                  <p>
                    After World War II, manufacturing demand surged globally. Factories needed to move raw materials and finished goods internally - across large shop floors, between production stations, into warehouses - at a scale that human-operated forklifts and hand trucks could not sustain economically or safely.
                  </p>
                  <p>
                    The first AGV was invented in <strong className="text-zinc-900 font-semibold">1953 by Barrett Electronics Corporation (USA)</strong>. It was a simple tow tractor that followed an overhead wire, deployed at a grocery warehouse in South Carolina. The problem it solved was basic: <em>how do you move heavy loads inside a large facility continuously, without assigning a human driver to every vehicle?</em>
                  </p>

                  <div className="my-6 rounded-2xl overflow-hidden border border-zinc-200">
                    <img 
                      src="/background/barrett_1953.png" 
                      alt="1953 Barrett Electronics Guide-O-Matic Tow Tractor" 
                      className="w-full object-cover max-h-80"
                    />
                    <div className="bg-zinc-100 px-4 py-2 text-xs text-zinc-700 font-medium text-center border-t border-zinc-200">
                      The Guide-O-Matic by Barrett Electronics, widely recognized as the world's first AGV (1953).
                    </div>
                  </div>
                  
                  {/* Source block */}
                  <div className="mt-6 p-4 bg-zinc-100 rounded-2xl border border-zinc-200 flex gap-3">
                    <FileText className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-zinc-900 mb-1">Source Citation</p>
                      <p className="text-zinc-700 italic">
                        Vis, I.F.A. (2006). Survey of research in the design and control of automated guided vehicle systems. European Journal of Operational Research, 170(3), 677-709. (Widely referenced AGV survey - verify the 1953 Barrett origin detail before citing).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Point 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
                <Cpu className="w-6 h-6 text-zinc-900" />
              </div>
              <div className="w-full">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
                  2. The Industry 4.0 / Automation Wave - Why Now?
                </h2>
                <div className="text-zinc-800 leading-relaxed space-y-4 text-justify">
                  <p>
                    <strong className="text-zinc-900 font-semibold">AGVs existed since 1953. So why is this suddenly a hot research topic in the 2020s?</strong>
                  </p>
                  <p>
                    The answer is Industry 4.0 - the fourth industrial revolution, characterised by the convergence of:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-700">
                    <li><strong className="text-zinc-900 font-semibold">Cyber-Physical Systems (CPS)</strong> - physical machines connected to digital control systems</li>
                    <li><strong className="text-zinc-900 font-semibold">Internet of Things (IoT)</strong> - real-time sensor data from every device on the shop floor</li>
                    <li><strong className="text-zinc-900 font-semibold">Artificial Intelligence and Machine Learning</strong> - intelligent, adaptive decision-making</li>
                    <li><strong className="text-zinc-900 font-semibold">Cloud Computing and Big Data</strong> - processing massive operational data in real time</li>
                  </ul>
                  <p>
                    The term "Industry 4.0" was officially coined at <strong>Hannover Messe 2011</strong> as a German government strategic initiative.
                  </p>
                  
                  {/* Source block */}
                  <div className="mt-6 p-4 bg-zinc-100 rounded-2xl border border-zinc-200 flex gap-3">
                    <FileText className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
                    <div className="text-sm space-y-3">
                      <p className="font-semibold text-zinc-900 mb-1">Foundational Sources</p>
                      <p className="text-zinc-700 italic">
                        Kagermann, H., Wahlster, W., & Helbig, J. (2013). Recommendations for implementing the strategic initiative Industrie 4.0. Acatech - German Academy of Science and Engineering. (The original policy document. Freely available online.)
                      </p>
                      <p className="text-zinc-700 italic">
                        Schwab, K. (2016). The Fourth Industrial Revolution. World Economic Forum, Geneva.
                      </p>
                    </div>
                  </div>

                  <p className="p-4 bg-zinc-900 text-white rounded-2xl font-medium shadow-sm mt-6">
                    <strong>The direct connection to AGVs:</strong> Traditional AGVs followed fixed wire paths and ran on rigid pre-programmed schedules - sufficient for a stable 1980s factory floor. Industry 4.0 environments are dynamic: product lines change, demand fluctuates, machines break down. This demands <em>intelligent, adaptive</em> AGVs that respond to real-time conditions - hence the shift from rigid rule-based dispatching to AI-driven dispatching. This is the core technological motivation of this thesis.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Point 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
                <Truck className="w-6 h-6 text-zinc-900" />
              </div>
              <div className="w-full">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
                  3. What Are AGVs?
                </h2>
                <div className="text-zinc-800 leading-relaxed space-y-4 text-justify">
                  <p>
                    <strong className="text-zinc-900 font-semibold">Formal definition:</strong> 
                  </p>
                  <p>
                    An Automated Guided Vehicle (AGV) is a <em>driverless, battery-powered transport vehicle</em> that moves materials along predefined or dynamically computed paths within a facility, guided by embedded wires, magnetic strips, laser reflectors, or GPS/vision-based systems.
                  </p>
                  
                  <div className="py-2">
                    <p className="font-semibold text-zinc-900 mb-2">Key characteristics:</p>
                    <ul className="list-disc pl-5 space-y-2 text-zinc-700">
                      <li>No human operator on board</li>
                      <li>Follows navigation and task instructions from a central Fleet Management System (FMS)</li>
                      <li>Can carry loads ranging from small components in electronics manufacturing to pallets in warehouses to large heavy assemblies in automotive plants</li>
                      <li>Typically communicates wirelessly with the central controller for task assignment in real time</li>
                    </ul>
                  </div>

                  {/* Source block */}
                  <div className="mt-6 p-4 bg-zinc-100 rounded-2xl border border-zinc-200 flex gap-3">
                    <FileText className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
                    <div className="text-sm space-y-3">
                      <p className="font-semibold text-zinc-900 mb-1">Literature References</p>
                      <p className="text-zinc-700 italic">
                        Liu, C.I., Jula, H., & Ioannou, P.A. (2001). Design and simulation of automated container terminal using AGVs. European Control Conference. (Physical characteristics and navigation described in Section 2.)
                      </p>
                      <p className="text-zinc-700 italic">
                        Carlo, H.J., Vis, I.F.A., & Roodbergen, K.J. (2014). (Formally classifies AGVs as "non-lifting transfer vehicles" in Section 2.1.)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Point 4 */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
                <ShieldCheck className="w-6 h-6 text-zinc-900" />
              </div>
              <div className="w-full">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
                  4. What Problems Were Addressed by Introduction of AGVs?
                </h2>
                <div className="text-zinc-800 leading-relaxed space-y-6 text-justify">
                  <p>Three categories of problems AGVs solved in industrial settings:</p>
                  
                  <div>
                    <h3 className="font-bold text-zinc-900 text-lg mb-1">a) Safety</h3>
                    <p>
                      Human-operated forklifts are one of the leading causes of serious injuries on factory and warehouse floors. The U.S. Occupational Safety and Health Administration (OSHA) reports that forklifts cause approximately <strong className="text-zinc-900 font-semibold">85 fatalities and 34,900 serious injuries per year</strong> in the US alone. AGVs eliminate the human driver from the vehicle entirely, following fixed collision-avoidance protocols and automatically stopping when an obstacle is detected.
                    </p>
                    <div className="mt-3 p-3 bg-zinc-100 rounded-xl border border-zinc-200 flex gap-3">
                      <FileText className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-zinc-700 italic">
                        Source: OSHA (U.S. Department of Labor). Powered Industrial Trucks eTool. Freely available at osha.gov. (Verify the exact current statistics from the OSHA website before citing.)
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-zinc-900 text-lg mb-1">b) Labour Cost and Continuous Operation</h3>
                    <p>
                      A human operator requires wages, breaks, shift changes, and cannot work indefinitely. A factory running 3 shifts needs 3 forklift operators per vehicle per day. AGVs operate 24 hours a day, 7 days a week, with only scheduled maintenance downtime - significantly reducing per-unit labour cost in high-volume operations.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-zinc-900 text-lg mb-1">c) Throughput Consistency</h3>
                    <p>
                      Human operators vary in speed, take different routes, and make routing decisions that are locally sensible but globally suboptimal. In a large manufacturing plant with dozens of workstations all requesting material simultaneously, a human dispatcher making these decisions in real time will inevitably create bottlenecks. AGVs following an optimised dispatching policy are consistent, repeatable, and can coordinate across the entire fleet simultaneously.
                    </p>
                    <div className="mt-3 p-3 bg-zinc-100 rounded-xl border border-zinc-200 flex gap-3">
                      <FileText className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-zinc-700 italic">
                        Source: Egbelu, P.J., & Tanchoco, J.M.A. (1984). Characterization of automatic guided vehicle dispatching rules. International Journal of Production Research, 22(3), 359-374. (Formally demonstrated through simulation that dispatching rule choice directly determines throughput in a multi-AGV, multi-workstation setting.)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;

const startIndex = page.indexOf('{/* Point 1 */}');
const endIndex = page.indexOf('{/* Point 5 */}');

if (startIndex !== -1 && endIndex !== -1) {
    const newPage = page.substring(0, startIndex) + p1_to_p4_replacement + '\n\n          ' + page.substring(endIndex);
    fs.writeFileSync('src/app/background/page.tsx', newPage, 'utf8');
    console.log('Replaced P1 to P4');
} else {
    console.log('Could not find boundaries');
}
