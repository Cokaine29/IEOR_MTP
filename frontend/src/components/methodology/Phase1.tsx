
'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
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
              Terminal Layout: Perpendicular Architecture with Hybrid Interfaces
            </h2>
            <div className="text-zinc-800 leading-relaxed space-y-4">
              <p>
                Based on satellite analysis and operational data (Yue et al., 2023; He Ji-hong, 2016), Yangshan Phase IV employs a strictly <strong>perpendicular yard layout</strong>. All 61 yard blocks run perpendicular to the shoreline, maximizing storage density and securely separating waterside AGV traffic from landside human-driven trucks (Kemme, 2013).
              </p>
              <p>
                However, to handle a massive <strong>50% water-to-water transshipment rate</strong>, the terminal abandons the traditional homogeneous block design in favor of a <strong>Hybrid ARMG Interface</strong> system. The blocks are structurally identical in orientation but feature two distinct AGV interaction mechanics:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl relative">
                  <h4 className="font-bold text-lg mb-2 text-zinc-900">End-Loading (Non-Cantilever)</h4>
                  <div className="text-sm font-semibold text-indigo-600 mb-4">41 Blocks • Primary Import/Export</div>
                  <p className="text-zinc-600 text-sm mb-4">AGVs drive to the short waterside tip of the block. Containers are deposited into one of 4 buffer brackets directly under the main ARMG gantry.</p>
                  <ul className="text-sm text-zinc-600 space-y-1 list-disc pl-4">
                    <li>Maximizes stack density</li>
                    <li>Standard for land-to-water flow</li>
                    <li>Bottleneck risk during high transshipment</li>
                  </ul>
                </div>
                
                <div className="bg-white border border-zinc-200 p-6 rounded-2xl">
                  <h4 className="font-bold text-lg mb-2 text-zinc-900">Side-Loading (Single-Cantilever)</h4>
                  <div className="text-sm font-semibold text-amber-600 mb-4">20 Blocks • Rapid Transshipment</div>
                  <p className="text-zinc-600 text-sm mb-4">The ARMG features a cantilever extending laterally. AGVs drive into a lane alongside the block, allowing side-access transfer without entering the end-loading buffers.</p>
                  <ul className="text-sm text-zinc-600 space-y-1 list-disc pl-4">
                    <li>Distributed in pairs every 2-6 blocks</li>
                    <li>Absorbs the 50% transshipment volume</li>
                    <li>Prevents gridlock at block ends</li>
                  </ul>
                </div>
              </div>

              <div className="bg-zinc-100 p-4 rounded-xl border-l-4 border-indigo-400 mt-4 mb-8">
                <p className="text-zinc-800 font-medium italic text-sm">"By interleaving cantilevered side-loading blocks within a standard perpendicular grid, Yangshan Phase IV achieves the density of a European terminal with the transshipment speed of an Asian parallel hub."</p>
              </div>

              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 mt-8">
                <h4 className="font-bold text-zinc-900 mb-2 flex items-center gap-2"><Map className="w-4 h-4 text-indigo-600"/> Note on 2D Visualization</h4>
                <p className="text-sm text-zinc-700 leading-relaxed text-justify">
                  To view the exact scaled map of this 2350m layout, including all 26 QCs and the interleaved end-loading/side-loading yard blocks, please refer to the new full interactive 2D Terminal Map located in the Simulation tab.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      
              {/* Engineering Blueprints */}
              <div className="mt-12 grid lg:grid-cols-2 gap-6">
                <div className="bg-white border border-zinc-200 rounded-2xl p-4 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-zinc-900 mb-3 flex items-center gap-2"><Map className="w-4 h-4 text-indigo-600"/> Master Yard Blueprint</h5>
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-100 bg-zinc-50">
                        <Image src="/papers/master_yard_blueprint.png" fill className="object-contain hover:scale-105 transition-transform duration-500" alt="Master Yard Blueprint" />
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 mt-4 text-justify leading-relaxed border-t border-zinc-100 pt-3">Official SIPG engineering layout for Yangshan Phase IV (2,350m continuous berth, 61 automated yard blocks).</p>
                </div>
                <div className="bg-white border border-zinc-200 rounded-2xl p-4 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-zinc-900 mb-3 flex items-center gap-2"><Layers className="w-4 h-4 text-emerald-600"/> Zone Layout Cross-Section</h5>
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-100 bg-zinc-50">
                        <Image src="/papers/zone_layout_y_axis.png" fill className="object-contain hover:scale-105 transition-transform duration-500" alt="Zone Layout Y Axis" />
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 mt-4 text-justify leading-relaxed border-t border-zinc-100 pt-3">Physical breakdown showing the precise 117.0m AGV operating depth between the QC landside rail and the Yard Block Seaside Transfer Area.</p>
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
                <div className="text-3xl font-bold text-zinc-900 mb-1">26</div>
                  <div className="text-sm font-semibold text-zinc-700">Quay Cranes</div>
                <div className="text-xs text-zinc-500 mt-1">Gu Qin 2016</div>
              </div>
              <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 text-center">
                <div className="text-3xl font-bold text-zinc-900 mb-1">130</div>
                  <div className="text-sm font-semibold text-zinc-700">L-AGVs</div>
                <div className="text-xs text-zinc-500 mt-1">Jin et al. 2016</div>
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
                      <th className="px-4 py-3 font-semibold rounded-tl-lg w-1/3">Parameter</th>
                      <th className="px-4 py-3 font-semibold w-1/3">Value</th>
                      <th className="px-4 py-3 font-semibold rounded-tr-lg w-1/3">Source / Logic</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-700">
                    <tr className="bg-zinc-100/80 border-t-2 border-zinc-200">
                      <td colSpan={3} className="px-4 py-3 font-bold text-zinc-900">🏗️ Port Infrastructure & Layout</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Terminal Identity</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Yangshan Phase IV, Shanghai</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">World's largest single fully-automated container terminal</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">QC Safety Distance</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">1 ship bay</span> <span className="text-sm font-normal text-zinc-500">(~14m)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Yue 2023. Collision avoidance constraint between adjacent QCs.</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Berth Length (X-axis)</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">2,350 m</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">CHEC Spec Sheet 2025</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">AGV Operating Depth (Y-axis)</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">117.0 m</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Luo 2016, Table 4 (Scheme 3 (SIPG chief engineer's layout))</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Perpendicular Zone Breakdown</td>
                      <td className="px-4 py-3"><div className="flex flex-wrap gap-1 items-center"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100/50 shadow-sm">Zone 1: 25m (QC ops)</span> <span className="text-zinc-300 text-xs font-bold">+</span> <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100/50 shadow-sm">Zone 2: 22m (buffer)</span> <span className="text-zinc-300 text-xs font-bold">+</span> <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100/50 shadow-sm">Zone 3: 20m (highway)</span> <span className="text-zinc-300 text-xs font-bold">+</span> <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100/50 shadow-sm">Zone 4: 18m (turn)</span> <span className="text-zinc-300 text-xs font-bold">+</span> <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100/50 shadow-sm">Zone 5: 41m (yard)</span></div></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Luo 2016, Table 4</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Yard Block Count</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">61 blocks</span> <span className="text-sm font-normal text-zinc-500">(41 end-loading perpendicular + 20 side-loading parallel)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Yue 2023. Side-loading blocks appear in pairs after every 2-6 end-loading blocks. Each end-loading block has 4 AGV buffer brackets + 1 parking space.</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Yard Block Lateral Spacing</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">~37.5 m</span> <span className="text-sm font-normal text-zinc-500">(2,290m ÷ 61 blocks)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Derived</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Yard Block Depth</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Average 396.5 m</span> <span className="text-sm font-normal text-zinc-500">(range: 210 to 446.5 m, perpendicular to berth)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Section 1, Params file</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Yard Block Width</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">27 m</span> <span className="text-sm font-normal text-zinc-500">(10 container slots × 2.7 m)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">He Ji-hong 2016</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Number of Berths</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">7 Deep water berths</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">CHEC Spec</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Reefer Blocks</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">6 out of 61</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Wu Sha-ping 2016 (Paper 22)</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">DG / OOG Handling</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Manual perimeter yard</span> <span className="text-sm font-normal text-zinc-500">(excluded from simulation)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">8 non-automated blocks confirmed by C3S 2019 field visit</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Transshipment Ratio</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">50% water to water</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Multiple SIPG papers</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Layout Type</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Perpendicular</span> <span className="text-sm font-normal text-zinc-500">(yard blocks ⊥ to shoreline)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">All Yangshan sources</td>
                    </tr>
                    <tr className="bg-zinc-100/80 border-t-2 border-zinc-200">
                      <td colSpan={3} className="px-4 py-3 font-bold text-zinc-900">🏗️ Quay Crane (QC) System</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">QC Count</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">26 double-trolley QCs</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Gu Qin 2016; confirmed by 2019 C3S field visit</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">QC Type</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Double Trolley: Main trolley</span> <span className="text-sm font-normal text-zinc-500">(remote-controlled) + Portal trolley (fully automated)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Gu Qin 2016</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Twin-Lift Spreader</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">RAM Singflex Single Hoist Twin Spreader capable of lifting 2×40ft simultaneously</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Paper 18</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">QC Mean Cycle Time</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">~128 seconds</span> <span className="text-sm font-normal text-zinc-500">(= 28 moves/hour)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">CHEC Spec + Ding et al. 2023 (real ACT4 data)</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">QC Peak Throughput</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">57.4 TEU/hour</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">CHEC Spec</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">QC Ideal Rate (5 AGVs/QC)</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">47 moves/hour</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Luo 2016, TBA simulation</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">QC Optical Systems</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">SPSS</span> <span className="text-sm font-normal text-zinc-500">(soft-landing), TDS (trolley detection), SDS (spreader detection)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">He Guang-yuan 2016</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">QC Operation Area Capacity</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">4 operation lanes</span> <span className="text-sm font-normal text-zinc-500">(out of 7 total; 3 are bypass/crossing lanes for transit AGVs)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Wu Sha-ping 2016</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">QC Gantry Positioning</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">BTG RFM100 magnetic nail scanning, ±2 mm precision</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Huang Ju-yuan 2016</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Bay Assignment</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Each QC handles one ship bay for both import + export</span> <span className="text-sm font-normal text-zinc-500">(dual-cycle capable)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Li et al. 2025</td>
                    </tr>
                    <tr className="bg-zinc-100/80 border-t-2 border-zinc-200">
                      <td colSpan={3} className="px-4 py-3 font-bold text-zinc-900">🚛 AGV System (L-AGV)</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">AGV Fleet Size</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">130 L-AGVs</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Jin et al. 2016; confirmed by 2019 C3S field visit</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">AGV Type</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">L-AGV</span> <span className="text-sm font-normal text-zinc-500">(Lift AGV) with a hydraulic platform that raises/lowers to deposit containers without ARMG intervention</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Jin et al. 2016</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">AGV Dimensions</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">14.8 m</span> <span className="text-sm font-normal text-zinc-500">(L) × 3.0 m (W)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Luo 2016, Table 3</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Self-Weight</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">25 t</span> <span className="text-sm font-normal text-zinc-500">(standard) / 29 t (with equipment)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Jin et al. 2016, Table 1</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Load Capacity</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">70 t</span> <span className="text-sm font-normal text-zinc-500">(twin 20 ft at 35 t each)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Jin et al. 2016, Table 1</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Max Speed</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">6 m/s</span> <span className="text-sm font-normal text-zinc-500">(21.6 km/h)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Jin et al. 2016, Table 1</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Operational Speed (Loaded)</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">3 m/s</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Jin et al. 2016 / Yang 2025</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Operational Speed (Empty)</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">5 m/s</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Jin et al. 2016 / Yang 2025</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Turning Speed</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">3 m/s</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Jin et al. 2016, Table 1</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Navigation System</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Underground magnetic nail grid featuring &gt;60,000 transponders, ±25 mm precision</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Jin et al. 2016</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Deposit Mechanism</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">AGV drives into rack → lowers platform → container rests on steel platform → AGV reverses out. AGV does NOT wait for ARMG. Total deposit time ≈ 45 seconds</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Jin et al. 2016, Figure 2</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Highway Layout</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Zone 3: 6 lanes</span> <span className="text-sm font-normal text-zinc-500">(3 eastbound + 3 westbound)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Wang Shi-en 2016</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">QC Zone Entry</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Zone 1: 7 lanes total</span> <span className="text-sm font-normal text-zinc-500">(4 operation + 3 bypass/crossing). SimPy capacity = 4.</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Wu Sha-ping 2016</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Battery Model</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">GSY LIM50H-12 15S10P</span> <span className="text-sm font-normal text-zinc-500">(LFP chemistry, lithium iron phosphate)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Chen Di-mao 2016</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Total Battery Capacity</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">338 kWh</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Chen Di-mao 2016 (official SIPG battery selection paper)</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Usable Capacity</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">304 kWh</span> <span className="text-sm font-normal text-zinc-500">(at 10% to 90% SOC window)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Derived</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Energy Consumption</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">21.0 kWh/h</span> <span className="text-sm font-normal text-zinc-500">(nominal) / 35.1 kWh/h (active, 9 cycles/hr)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Jin Qi 2016 + Chen Di-mao 2016</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Operating Shift on One Charge</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">~8 hours</span> <span className="text-sm font-normal text-zinc-500">(≈ one shift)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">CHEC Spec</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Battery Swap Trigger</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">SOC &lt; 15%</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Standard industrial threshold</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Swap Duration</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Exactly 6 minutes</span> <span className="text-sm font-normal text-zinc-500">(360 seconds)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">CHEC Spec</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Swap Mechanism</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Fully automated robot in a climate controlled station</span> <span className="text-sm font-normal text-zinc-500">(20 to 35°C)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Tang Jie 2016</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Swap Station Location</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">East end of terminal</span> <span className="text-sm font-normal text-zinc-500">(Large + Small stations) + West end fallback</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Jin Qi 2016</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Fleet Swap Rate</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">13 swaps/hour</span> <span className="text-sm font-normal text-zinc-500">(fleet-wide, for 130 AGVs)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Jin Qi 2016, Table 1</td>
                    </tr>
                    <tr className="bg-zinc-100/80 border-t-2 border-zinc-200">
                      <td colSpan={3} className="px-4 py-3 font-bold text-zinc-900">🏗️ ARMG / Yard Crane System</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">ARMG Count</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">120 ARMGs</span> <span className="text-sm font-normal text-zinc-500">(2 per block × 61 blocks, accounting for shared cantilever pairs)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Multiple papers; confirmed by C3S field visit</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">ARMG Safety Distance</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">3 bays</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Yue 2023. Required distance between two YCs sharing the same block.</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">ARMG Types</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">(1) Standard, (2) Single-cantilever, (3) Double-cantilever. All 3 types work collaboratively.</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">He Ji-hong 2016</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">ARMG Rail Gauge</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">31 m</span> <span className="text-sm font-normal text-zinc-500">(spans 10 container columns with 2 m clearance each side)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">He Ji-hong 2016</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Sea-Side ARMG Service Time</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Normal</span> <span className="text-sm font-normal text-zinc-500">(µ = 60s, σ = 10s)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Derived from TMEIC MAXVIEW specs</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">ARMG Micro-Positioning</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">TMEIC MAXVIEW: 5 laser scanners + 4 micro motion push rods. Corrects ±200 mm lateral, ±5° rotation.</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Wu Zhao-yang 2016</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">ARMG Gantry Positioning</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Same magnetic nail grid as QCs and AGVs, sharing a unified coordinate system</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Huang Ju-yuan 2016</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Non-Cantilever Rack Capacity</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">4 physical rack slots per block</span> <span className="text-sm font-normal text-zinc-500">(confirmed by real video footage)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">User observation</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Cantilever Alley Capacity</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">4 logical slots per block</span> <span className="text-sm font-normal text-zinc-500">(2 ARMGs × [1 Waiting + 1 Operation])</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Wang Yan 2021 (ZPMC)</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Priority Rules</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Ship Ops &gt; Gate Ops &gt; Yard Reshuffling</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Xie Xi-cong 2016</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">ARMG Failure / Rescue</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Broken ARMG is pushed to end-of-block maintenance zone at 5% of normal speed by partner ARMG</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Xie Xi-cong 2016</td>
                    </tr>
                    <tr className="bg-zinc-100/80 border-t-2 border-zinc-200">
                      <td colSpan={3} className="px-4 py-3 font-bold text-zinc-900">🧠 MDP Formulation</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">State Space (Total Features)</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">1,084 features</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">130 AGVs × 7 + 26 QCs × 2 + 61 YBs × 2</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">AGV Features (per AGV × 130)</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">X-pos, Y-pos, Vx, Vy, Status, Job_ID, Battery SOC</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">7 features × 130 = 910</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">QC Features (per QC × 26)</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Queue density, Elapsed cycle time</span> <span className="text-sm font-normal text-zinc-500">(seconds into current lift)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">2 features × 26 = 52. Elapsed cycle time enables predictive dispatching.</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">YB Features (per YB × 61)</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Rack fill level</span> <span className="text-sm font-normal text-zinc-500">(0 to 4), Current ARMG service time elapsed</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">2 features × 61 = 122</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Action Space</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">27 discrete actions: Dispatch to one of 26 QCs + 1 Wait</span> <span className="text-sm font-normal text-zinc-500">(Hold)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">YB destinations are pre-assigned by TOS stowage plan, meaning the agent does NOT choose YB</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Decision Trigger</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">"AGV becomes free" event</span> <span className="text-sm font-normal text-zinc-500">(Event driven, not time stepped)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Speeds up training ~100×</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Reward: QC Waiting</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">−100 × (QC idle time)</span> <span className="text-sm font-normal text-zinc-500">yuan/h</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Yue 2023. The primary operational bottleneck penalty.</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Reward: AGV Waiting</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">−10 × (AGV idle time)</span> <span className="text-sm font-normal text-zinc-500">yuan/h</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Yue 2023. Agent natively learns QC time is 10x more valuable than AGV time.</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Reward: AGV Travel</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">−45 × (AGV travel time)</span> <span className="text-sm font-normal text-zinc-500">yuan/h</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Yue 2023. Penalizes inefficient routing and empty travel.</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Reward: Deadlock</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">−λ</span> <span className="text-sm font-normal text-zinc-500">(large constant)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Triggered when AGV sent to a full node</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Discount Factor γ</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">0.95</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Prioritizes near-term QC utilization</td>
                    </tr>
                    <tr className="bg-zinc-100/80 border-t-2 border-zinc-200">
                      <td colSpan={3} className="px-4 py-3 font-bold text-zinc-900">🎲 Stochasticity Model (4 Disruptions)</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">QC Cycle Variability</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Log-Normal</span> <span className="text-sm font-normal text-zinc-500">(µ = 128s, σ tunable (0 → extreme))</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">CHEC Spec / Ding 2023</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">ARMG Service Variability</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Normal</span> <span className="text-sm font-normal text-zinc-500">(µ = 60s, σ = 10s)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">TMEIC MAXVIEW spec (±200mm correction noise)</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">QC Workload Distribution (Per Vessel)</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Dirichlet distribution with bell-curve prior over the 4 to 5 assigned QCs</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Correcher et al. 2024 (BACASP). Ship hull widest at midships — middle QCs receive heavier workloads than bow or stern QCs. Flat equal-split is physically incorrect.</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">ARMG Breakdowns</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Exponential</span> <span className="text-sm font-normal text-zinc-500">(MTBF-based) where 1 ARMG going offline triggers a rescue push → rescue push (20 to 30 min out of service)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Xie Xi-cong 2016</td>
                    </tr>
                    <tr className="bg-zinc-100/80 border-t-2 border-zinc-200">
                      <td colSpan={3} className="px-4 py-3 font-bold text-zinc-900">⏱️ Episode Design</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Episode Duration</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">24 hours</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Full diurnal cycle which forces the agent to manage multi-shift battery swapping and dynamic vessel arrivals</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Vessel Arrival</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Random</span> <span className="text-sm font-normal text-zinc-500">(1 to 4 ships at t=0) along the 2,350 m berth. Each ship assigned 4 to 5 QCs with workload drawn from Dirichlet distribution (heavier at amidships bays).</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Correcher et al. 2024 (BACASP); Gu Qin 2016. Tests generalization and prevents memorization of fixed QC loading patterns.</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">YB Initial Fill</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Random</span> <span className="text-sm font-normal text-zinc-500">(0 to 4 containers per rack)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Terminal is never empty mid-operation</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Ship Bay Plan (per vessel at reset)</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Pure Stack heuristic: stacks designated as Import, Empty, ROB</span> <span className="text-sm font-normal text-zinc-500">(Remain on Board), or Mixed (1 to 2 per bay only)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Avriel &amp; Penn 1993. Real planners minimize shifting by filling columns with same-destination containers. Mixed stacks are rare remainders. Eliminates need for 3D bin-packing at reset.</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Import / Export Task Ratio</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">51% Import</span> <span className="text-sm font-normal text-zinc-500">(Discharge) / 49% Export (Load)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Bruzzone et al. 2012, Table 2. Empirical data from 30 real vessel calls at a major transshipment hub. Near-perfect balance reflects high water-to-water transshipment ratio at Yangshan.</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">QC Task Sequence (per bay)</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">3-Phase:</span> <span className="text-sm font-normal text-zinc-500">(1) Burst Imports, (2) Alternating Dual-Cycle (Import + Export), (3) Burst Exports</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Goodchild &amp; Daganzo 2006 (Transportation Science). Stack access constraint: a stack must be fully discharged before exports can be loaded into it. Phase 2 requires the RL agent to coordinate 2 AGVs simultaneously at one QC.</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">AGV Initial State</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Randomly distributed</span> <span className="text-sm font-normal text-zinc-500">(some at QCs, some in transit, some swapping)</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Avoids artificial cold-start bias</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Episode Termination</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Whichever comes first:</span> <span className="text-sm font-normal text-zinc-500">(a) All lifts completed, or (b) 24-hour clock expires</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Prevents infinite loops from bad policies</td>
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
                      1,084 Feature Tensor &amp; Reward
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
                    <p className="text-sm text-green-800 font-medium mt-1">Event driven logistics engine (26 QCs, 130 AGVs)</p>
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
