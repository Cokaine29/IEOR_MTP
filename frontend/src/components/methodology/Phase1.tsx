
'use client';
import { motion } from 'framer-motion';
import { LayoutDashboard, ArrowUp, ArrowDown, Users, Zap, Layers, Server, Activity, MonitorPlay, Map, Truck, Anchor, Box, RefreshCw } from 'lucide-react';

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Phase1() {
  return (
    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="space-y-12">
      <div id="phase-1" className="scroll-mt-28">
        <h2 className="text-3xl font-bold text-zinc-900 border-b-2 border-zinc-200 pb-2">Phase 1: Terminal Environment Design</h2>
      </div>
      
      {/* Pointer 1 */}
      <div id="pointer-1" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <LayoutDashboard className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
              Terminal Layout Finalization
            </h2>
            <div className="text-zinc-800 leading-relaxed space-y-4">
              <p><strong className="text-zinc-900 font-semibold">Decision: Layout A: Perpendicular (Rotterdam/Hamburg style)</strong></p>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl relative">
                  <div className="absolute top-0 right-0 bg-zinc-200 text-zinc-700 text-xs font-bold px-3 py-1 rounded-bl-lg">SELECTED</div>
                  <h4 className="font-bold text-lg mb-2 text-zinc-900">Layout A (Perpendicular)</h4>
                  <p className="text-zinc-600 text-sm mb-4">Yard blocks run perpendicular to the shoreline. AGVs travel to the short end (I/O point) of each block.</p>
                  <ul className="text-sm text-zinc-600 space-y-1 list-disc pl-4">
                    <li>Standard for Import/Export</li>
                    <li>Used by all 6 Tier 1 papers</li>
                    <li>Simpler directed road network</li>
                  </ul>
                </div>
                
                <div className="bg-white border border-zinc-200 p-6 rounded-2xl opacity-70">
                  <h4 className="font-bold text-lg mb-2 text-zinc-500">Layout B (Parallel)</h4>
                  <p className="text-zinc-500 text-sm mb-4">Yard blocks run parallel to the shoreline. AGVs approach from the long side.</p>
                  <ul className="text-sm text-zinc-500 space-y-1 list-disc pl-4">
                    <li>Suited for transshipment hubs</li>
                    <li>Used in modern Chinese mega-ports</li>
                  </ul>
                </div>
              </div>
              <div className="bg-zinc-100 p-4 rounded-xl border-l-4 border-zinc-400 mt-4 mb-8">
                <p className="text-zinc-800 font-medium italic text-sm">"This study models a standard perpendicular-layout ACT calibrated to Liu et al. (2001), which remains the most widely used layout in dispatching literature. Modern parallel-layout terminals represent a promising avenue for future work."</p>
              </div>

              {/* NEW: Sleek Light-Mode Schematic Map */}
              <div className="border border-zinc-200 rounded-3xl overflow-hidden bg-white mt-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] font-mono">
                <div className="bg-zinc-50 p-4 flex items-center justify-between border-b border-zinc-200">
                  <h4 className="font-bold text-zinc-900 flex items-center gap-2 text-sm"><Map className="w-4 h-4 text-indigo-600"/> Terminal Layout Schematic</h4>
                  <div className="text-xs text-indigo-700 font-semibold bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">Calibrated to 5 Mega-Ships, 28 QCs, 61 YBs, 155 AGVs</div>
                </div>
                
                <div className="w-full relative py-8 px-4 flex flex-col gap-1 bg-white">
                  
                  {/* 1. VESSEL (Single Ship) */}
                  <div className="w-full flex justify-center relative z-10 mb-2">
                    <div className="w-4/5 h-14 bg-blue-50 rounded-full border-4 border-blue-200 flex items-center justify-center shadow-sm relative overflow-hidden">
                      <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#bfdbfe_10px,#bfdbfe_20px)]"></div>
                      <span className="text-blue-800 font-black tracking-[0.4em] z-10 bg-blue-50 px-4 py-1 rounded-full">VESSEL (1 SHIP)</span>
                    </div>
                  </div>

                  {/* 2. QUAY CRANES & OPERATION AREA */}
                  <div className="relative pt-4 pb-2 border-b-2 border-dashed border-zinc-300">
                    <span className="absolute left-2 top-0 text-[9px] uppercase tracking-widest text-indigo-700 font-bold bg-indigo-100 border border-indigo-300 px-2 py-1 rounded shadow-sm z-30">QC Operation Area</span>
                    <div className="flex justify-around px-8 relative z-20">
                      {[1, 2, 3, 4, 5].map(qc => (
                        <div key={qc} className="w-14 flex flex-col items-center">
                          <div className="w-2 h-8 bg-indigo-500 absolute -top-8 rounded-t-sm"></div>
                          <div className="w-full h-8 bg-indigo-600 rounded flex items-center justify-center text-white text-[11px] font-bold shadow-md border border-indigo-800 z-10">QC {qc}</div>
                          {/* QC Operation Area (4 horizontal slots) */}
                          <div className="flex flex-col gap-1 mt-2 w-12 z-0">
                            <div className="w-full h-1.5 bg-indigo-200 border border-indigo-400 rounded-[1px]"></div>
                            <div className="w-full h-1.5 bg-indigo-200 border border-indigo-400 rounded-[1px]"></div>
                            <div className="w-full h-1.5 bg-indigo-200 border border-indigo-400 rounded-[1px]"></div>
                            <div className="w-full h-1.5 bg-indigo-200 border border-indigo-400 rounded-[1px]"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. BUFFER AREA */}
                  <div className="w-full h-16 bg-zinc-50 border-b-2 border-zinc-300 flex items-center justify-center relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-widest text-zinc-800 font-bold bg-white border border-zinc-300 px-2 py-1 rounded shadow-sm z-10">Buffer Area</span>
                    <div className="flex-1 flex justify-around ml-24 mr-8">
                      {Array.from({length: 15}).map((_, i) => (
                        <div key={i} className="w-5 h-7 border-2 border-dashed border-zinc-400 rounded-[2px] bg-white shadow-sm"></div>
                      ))}
                    </div>
                  </div>

                  {/* 4. DRIVING LANE (HIGHWAY) */}
                  <div className="w-full h-20 bg-zinc-100 border-b-2 border-zinc-300 flex items-center justify-center relative shadow-inner overflow-hidden">
                    {/* Left BSS Depot */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 bg-amber-100 border-r-2 border-amber-300 flex flex-col items-center justify-center z-20 shadow-sm">
                      <Zap className="w-4 h-4 text-amber-600 mb-1" />
                      <span className="text-[8px] font-bold text-amber-800 text-center uppercase leading-tight">BSS<br/>Depot</span>
                    </div>

                    {/* Right BSS Depot */}
                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-amber-100 border-l-2 border-amber-300 flex flex-col items-center justify-center z-20 shadow-sm">
                      <Zap className="w-4 h-4 text-amber-600 mb-1" />
                      <span className="text-[8px] font-bold text-amber-800 text-center uppercase leading-tight">BSS<br/>Depot</span>
                    </div>

                    <span className="absolute top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-widest text-zinc-800 font-bold bg-white border border-zinc-300 px-3 py-1 rounded-full shadow-sm z-10">Central Driving Lane (Highway)</span>
                    <div className="w-full h-0 border-t-[3px] border-dashed border-zinc-400"></div>
                  </div>

                  {/* 5. SEASIDE TRANSFER & YARD BLOCKS */}
                  <div className="relative pt-6 pb-2 bg-zinc-50/50">
                    <div className="absolute top-2 left-0 w-full flex justify-center z-10">
                       <span className="text-[9px] uppercase tracking-widest text-green-800 font-bold bg-green-100 border border-green-300 px-3 py-1 rounded-full shadow-sm">Seaside Transfer Area</span>
                    </div>
                    
                    <div className="flex justify-around px-4 mt-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(yb => (
                        <div key={yb} className="w-16 flex flex-col items-center relative">
                          {/* 4 Seaside Transfer Slots */}
                          <div className="w-full flex justify-evenly mb-2 h-6">
                            <div className="w-1 h-full bg-green-400 border border-green-600 rounded-sm"></div>
                            <div className="w-1 h-full bg-green-400 border border-green-600 rounded-sm"></div>
                            <div className="w-1 h-full bg-green-400 border border-green-600 rounded-sm"></div>
                            <div className="w-1 h-full bg-green-400 border border-green-600 rounded-sm"></div>
                          </div>
                          {/* Yard Block Body */}
                          <div className="w-full h-40 border-2 border-zinc-400 rounded-t-lg bg-white flex flex-col items-center pt-2 relative overflow-hidden shadow-sm">
                            <span className="text-[11px] font-bold text-zinc-800">YB {yb}</span>
                            <div className="w-full flex-1 flex justify-evenly mt-2">
                              <div className="w-0.5 h-full bg-zinc-300"></div>
                              <div className="w-0.5 h-full bg-zinc-300"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="w-full flex justify-center mt-4">
                       <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-black">Automated Yard</span>
                    </div>
                  </div>

                </div>

                <div className="bg-zinc-50 p-6 border-t border-zinc-200">
                  <h4 className="font-bold text-zinc-900 mb-2 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500"/> Capacity Limits & The "Blocking Problem"</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed text-justify">
                    AGVs move horizontally along the <strong>Driving Lane</strong>. To access a Quay Crane, they turn into the Buffer area. 
                    Because the Buffer Area and QC Operation Area only span the physical width of the crane, they have a strict physical capacity of <strong className="text-indigo-600">6 AGVs</strong>. Similarly, the Seaside Transfer Area for each Yard Block has exactly <strong className="text-green-600">4 slots</strong>. If the RL dispatcher assigns an AGV to a node already at maximum capacity, the AGV overflows into the Driving Lane, triggering a massive deadlock penalty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Vessel Operations Context */}
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6 flex items-center gap-3">
          <Anchor className="w-6 h-6 text-indigo-600" /> Vessel Operations & Stowage Constraints
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-5">
            <h4 className="font-bold text-zinc-900 mb-3 flex items-center gap-2"><Map className="w-4 h-4 text-green-600"/> Bay Assignment</h4>
            <p className="text-sm text-zinc-600 leading-relaxed text-justify">
              QCs are <strong>not</strong> divided into "Import QCs" and "Export QCs". Moving a 2,000-ton crane is slow. Instead, every QC is assigned to a specific physical <strong>Bay</strong> of the ship, handling <em>both</em> the imports (unloading) and exports (loading) for that bay <span className="italic text-zinc-400">(Li et al., 2025)</span>.
            </p>
          </div>
          <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-5">
            <h4 className="font-bold text-zinc-900 mb-3 flex items-center gap-2"><Box className="w-4 h-4 text-amber-600"/> Stowage Planning</h4>
            <p className="text-sm text-zinc-600 leading-relaxed text-justify">
              Ships arrive with a strict stowage plan. Heavy containers are stored deep in the hull for stability, grouping by destination port to avoid reshuffling. This inherently creates the <strong>Workload Imbalance</strong>, giving middle QCs significantly more lifts than outer QCs <span className="italic text-zinc-400">(Goodchild & Daganzo, 2006)</span>.
            </p>
          </div>
          <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-5">
            <h4 className="font-bold text-zinc-900 mb-3 flex items-center gap-2"><RefreshCw className="w-4 h-4 text-indigo-600"/> Dual-Cycle Mechanic</h4>
            <p className="text-sm text-zinc-600 leading-relaxed text-justify">
              Because a QC handles both flows, it can <strong>Dual-Cycle</strong>: dropping an import onto a waiting AGV, then immediately picking up an export from the next AGV in one crane swing. The RL agent earns massive rewards by timing AGVs to enable this <span className="italic text-zinc-400">(Goodchild & Daganzo, 2006)</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Pointers 2 & 3 */}
      <div id="pointer-2" className="relative"><div id="pointer-3" className="absolute top-1/2" /></div>
<div className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <Users className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
              Fleet Size & Parameter Calibration
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 text-center">
                <div className="text-3xl font-bold text-zinc-900 mb-1">28</div>
                  <div className="text-sm font-semibold text-zinc-700">Quay Cranes</div>
                <div className="text-xs text-zinc-500 mt-1">Liu (2001)</div>
              </div>
              <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 text-center">
                <div className="text-3xl font-bold text-zinc-900 mb-1">145</div>
                  <div className="text-sm font-semibold text-zinc-700">AGVs</div>
                <div className="text-xs text-zinc-500 mt-1">5 per QC ratio</div>
              </div>
              <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 text-center">
                <div className="text-3xl font-bold text-zinc-900 mb-1">61</div>
                  <div className="text-sm font-semibold text-zinc-700">Yard Blocks</div>
                <div className="text-xs text-zinc-500 mt-1">Proportional</div>
              </div>
              <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 text-center">
                <div className="text-3xl font-bold text-zinc-900 mb-1">~128s</div>
                  <div className="text-sm font-semibold text-zinc-700">QC Cycle</div>
                  <div className="text-xs text-zinc-500 mt-1">28 moves/hr</div>
              </div>
            </div>
            
            {/* NEW: Detailed Simulation Parameters Matrix */}
            <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-6 mb-6">
              <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2 flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-indigo-600"/> Detailed Simulation Parameters
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-500 uppercase bg-zinc-100 border-b border-zinc-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold rounded-tl-lg">Category</th>
                      <th className="px-4 py-3 font-semibold">Parameter</th>
                      <th className="px-4 py-3 font-semibold">Value</th>
                      <th className="px-4 py-3 font-semibold rounded-tr-lg">Source / Logic</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 text-zinc-700">
                    <tr className="hover:bg-zinc-100/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-zinc-900 border-r border-zinc-100" rowSpan={3}>Workload &amp; Vessel</td>
                      <td className="px-4 py-3">Vessel Size</td>
                      <td className="px-4 py-3 font-bold text-indigo-600">20,000+ TEU</td>
                        <td className="px-4 py-3 text-xs text-zinc-500">Modern Mega-Ship (e.g. Yangshan 2026)</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors">
                      <td className="px-4 py-3 border-l border-zinc-100">Tasks per Episode</td>
                      <td className="px-4 py-3 font-bold text-indigo-600">10,080 Lifts</td>
                      <td className="px-4 py-3 text-xs text-zinc-500">Full terminal 7.2-hour shift (360 lifts per QC). Represents concurrent partial discharge across 5 docked mega-ships.</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors">
                      <td className="px-4 py-3 border-l border-zinc-100">Import/Export Ratio</td>
                      <td className="px-4 py-3 font-bold text-indigo-600">Randomized (e.g. 40/60)</td>
                      <td className="px-4 py-3 text-xs text-zinc-500">Dynamically generated per episode</td>
                    </tr>

                    <tr className="bg-zinc-100/30 hover:bg-zinc-100/80 transition-colors border-t-2 border-zinc-200">
                      <td className="px-4 py-3 font-medium text-zinc-900 border-r border-zinc-100" rowSpan={3}>Kinematics</td>
                      <td className="px-4 py-3">AGV Speed (Loaded)</td>
                        <td className="px-4 py-3 font-bold text-green-600">3 m/s</td>
                        <td className="px-4 py-3 text-xs text-zinc-500">Yang 2025 / Liu 2001 — Magnetic-nail AGV, Yangshan Phase IV</td>
                    </tr>
                    <tr className="bg-zinc-100/30 hover:bg-zinc-100/80 transition-colors">
                      <td className="px-4 py-3 border-l border-zinc-100">AGV Speed (Empty)</td>
                        <td className="px-4 py-3 font-bold text-green-600">5 m/s</td>
                        <td className="px-4 py-3 text-xs text-zinc-500">Yang 2025 / Liu 2001 — Magnetic-nail AGV, Yangshan Phase IV</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors">
                      <td className="px-4 py-3 border-l border-zinc-100">Yard Crane Cycle</td>
                      <td className="px-4 py-3 font-bold text-green-600">~106s - 120s</td>
                      <td className="px-4 py-3 text-xs text-zinc-500">Liu 2001 (34 moves/hr limit) - Slower than QC</td>
                    </tr>

                    <tr className="hover:bg-zinc-100/50 transition-colors border-t-2 border-zinc-200">
                      <td className="px-4 py-3 font-medium text-zinc-900 border-r border-zinc-100" rowSpan={3}>Energy Profile</td>
                      <td className="px-4 py-3">Battery Capacity</td>
                      <td className="px-4 py-3 font-bold text-amber-600">50 kWh</td>
                      <td className="px-4 py-3 text-xs text-zinc-500">~6-8 hrs operating time (Yang 2025)</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors">
                      <td className="px-4 py-3 border-l border-zinc-100">Low Battery Threshold</td>
                      <td className="px-4 py-3 font-bold text-amber-600">20% (10 kWh)</td>
                      <td className="px-4 py-3 text-xs text-zinc-500">Requires immediate routing to BSS (Yang 2025)</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors">
                      <td className="px-4 py-3 border-l border-zinc-100">Battery Swapping Station</td>
                      <td className="px-4 py-3 font-bold text-amber-600">5-10 min Swap</td>
                      <td className="px-4 py-3 text-xs text-zinc-500">Located at edges of Driving Lane (Zhao 2023)</td>
                    </tr>

                    <tr className="bg-zinc-100/30 hover:bg-zinc-100/80 transition-colors border-t-2 border-zinc-200">
                      <td className="px-4 py-3 font-medium text-zinc-900 border-r border-zinc-100" rowSpan={3}>Layout Limits</td>
                      <td className="px-4 py-3">Quay Road Length</td>
                      <td className="px-4 py-3 font-bold text-zinc-700">498 m</td>
                      <td className="px-4 py-3 text-xs text-zinc-500">Liu 2001</td>
                    </tr>
                    <tr className="bg-zinc-100/30 hover:bg-zinc-100/80 transition-colors">
                      <td className="px-4 py-3 border-l border-zinc-100">Driving Lane Width</td>
                      <td className="px-4 py-3 font-bold text-zinc-700">120 m</td>
                      <td className="px-4 py-3 text-xs text-zinc-500">Yang 2025 (Yangshan IV data)</td>
                    </tr>
                    <tr className="bg-zinc-100/30 hover:bg-zinc-100/80 transition-colors">
                      <td className="px-4 py-3 border-l border-zinc-100">Yard Block Depth</td>
                      <td className="px-4 py-3 font-bold text-zinc-700">80 m</td>
                      <td className="px-4 py-3 text-xs text-zinc-500">Yang 2025 (Yangshan IV data)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pointer 4 */}
      <div id="pointer-4" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <Layers className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
              Simulation Software Architecture
            </h2>
            <div className="flex flex-col lg:flex-row gap-8 mt-6">
              
              {/* Left Column: The Diagram */}
              <div className="flex flex-col gap-4 w-full lg:w-1/2">
                
                {/* Layer 3 */}
                <div className="bg-indigo-50 border-2 border-indigo-200 p-5 rounded-xl flex items-center gap-5 shadow-sm">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-lg flex items-center justify-center shrink-0 shadow-md">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">Layer 3: The Brain</div>
                    <h4 className="font-bold text-indigo-950 text-lg">RL Agent (Stable Baselines3)</h4>
                    <p className="text-sm text-indigo-800 font-medium mt-1">PPO (Phase 1) / MAPPO (Phase 2)</p>
                  </div>
                </div>

                {/* Arrows 3 -> 2 */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-12 py-4 relative z-10">
                  <div className="flex flex-col items-center">
                    <ArrowUp className="w-5 h-5 text-blue-400 mb-2" />
                    <div className="bg-blue-50 border border-blue-200 px-5 py-2 rounded-full text-blue-700 text-sm font-bold shadow-sm whitespace-nowrap">
                      178 Feature Tensor &amp; Reward
                    </div>
                    <ArrowUp className="w-5 h-5 text-blue-400 mt-2" />
                  </div>
                  <div className="flex flex-col items-center">
                    <ArrowDown className="w-5 h-5 text-indigo-400 mb-2" />
                    <div className="bg-indigo-50 border border-indigo-200 px-5 py-2 rounded-full text-indigo-700 text-sm font-bold shadow-sm whitespace-nowrap">
                      Action Integer
                    </div>
                    <ArrowDown className="w-5 h-5 text-indigo-400 mt-2" />
                  </div>
                </div>

                {/* Layer 2 */}
                <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-xl flex items-center gap-5 shadow-sm">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center shrink-0 shadow-md">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Layer 2: The Translator</div>
                    <h4 className="font-bold text-blue-950 text-lg">Gymnasium Wrapper</h4>
                    <p className="text-sm text-blue-800 font-medium mt-1">Converts Port Physics ↔ Math Tensors</p>
                  </div>
                </div>

                {/* Arrows 2 -> 1 */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-12 py-4 relative z-10">
                  <div className="flex flex-col items-center">
                    <ArrowUp className="w-5 h-5 text-green-400 mb-2" />
                    <div className="bg-green-50 border border-green-200 px-5 py-2 rounded-full text-green-700 text-sm font-bold shadow-sm whitespace-nowrap">
                      Raw Coordinates &amp; Queues
                    </div>
                    <ArrowUp className="w-5 h-5 text-green-400 mt-2" />
                  </div>
                  <div className="flex flex-col items-center">
                    <ArrowDown className="w-5 h-5 text-blue-400 mb-2" />
                    <div className="bg-blue-50 border border-blue-200 px-5 py-2 rounded-full text-blue-700 text-sm font-bold shadow-sm whitespace-nowrap">
                      "Move AGV #4 to QC"
                    </div>
                    <ArrowDown className="w-5 h-5 text-blue-400 mt-2" />
                  </div>
                </div>

                {/* Layer 1 */}
                <div className="bg-green-50 border-2 border-green-200 p-5 rounded-xl flex items-center gap-5 shadow-sm">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center shrink-0 shadow-md">
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Layer 1: The Physics Engine</div>
                    <h4 className="font-bold text-green-950 text-lg">Terminal Simulator (Python)</h4>
                    <p className="text-sm text-green-800 font-medium mt-1">Event driven logistics engine (28 QCs, 155 AGVs)</p>
                  </div>
                </div>
              </div>

              {/* Right Column: The Explanation */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl h-full">
                  <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Why strict separation?</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed text-justify mb-4">
                    To make the RL agent robust, the code must be strictly separated. The Neural Network (Layer 3) is completely "blind", it doesn't know what a container or a port is; it only understands raw matrices.
                  </p>
                  <ul className="text-sm text-zinc-700 space-y-4">
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                      <div className="text-justify leading-relaxed"><strong>Layer 1 (Physics):</strong> Handles physical collisions, distances, and battery logic. It has zero intelligence.</div>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                      <div className="text-justify leading-relaxed"><strong>Layer 2 (Translator):</strong> Observes the physical engine and translates those coordinates into the 178 feature array the AI needs. When the AI outputs a raw number, Layer 2 translates it back into a physical driving command.</div>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                      <div className="text-justify leading-relaxed"><strong>Layer 3 (Brain):</strong> The Stable Baselines3 neural network that learns the optimal routing policy through trial and error.</div>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
