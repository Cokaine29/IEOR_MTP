'use client';

/* Yangshan Phase IV reference data collected by Niraj (layout, vessel operations, parameter tables, further
   uncertainty sources). Moved here unchanged from the earlier Methodology components Phase1 and Phase3 on
   21 Oct 2026, for the Phase II scale-up. Only the old MDP, episode and intensity design rows were left out. */
import Image from 'next/image';
import { LayoutDashboard, Map, Layers, Anchor, Box, RefreshCw, Clock, AlertTriangle } from 'lucide-react';

export function YangshanLayout() {
  return (
    <div className="space-y-12">
      <div className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
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
                <p className="text-zinc-800 font-medium italic text-sm">“By interleaving cantilevered side-loading blocks within a standard perpendicular grid, Yangshan Phase IV achieves the density of a European terminal with the transshipment speed of an Asian parallel hub.”</p>
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
              QCs are <strong>not</strong> divided into “Import QCs” and “Export QCs”. Moving a 2,000-ton crane is slow. Instead, every QC is assigned to a specific physical <strong>Bay</strong> of the ship, handling <em>both</em> the imports (unloading) and exports (loading) for that bay <span className="italic text-zinc-400">(Li et al., 2025)</span>.
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
    </div>
  );
}

export function YangshanParameters() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-zinc-500 uppercase bg-zinc-100 border-b border-zinc-200">
          <tr>
            <th className="px-4 py-3 font-semibold w-1/3">Parameter</th>
            <th className="px-4 py-3 font-semibold w-1/3">Value</th>
            <th className="px-4 py-3 font-semibold w-1/3">Source / Logic</th>
          </tr>
        </thead>
        <tbody className="text-zinc-700">
                    <tr className="bg-zinc-100/80 border-t-2 border-zinc-200">
                      <td colSpan={3} className="px-4 py-3 font-bold text-zinc-900">🏗️ Port Infrastructure & Layout</td>
                    </tr>
                    <tr className="hover:bg-zinc-100/50 transition-colors border-b border-zinc-100">
                      <td className="px-4 py-3 font-medium text-zinc-800 align-top">Terminal Identity</td>
                      <td className="px-4 py-3 align-top"><span className="font-semibold text-indigo-600">Yangshan Phase IV, Shanghai</span></td>
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">World’s largest single fully-automated container terminal</td>
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
                      <td className="px-4 py-3 text-xs text-zinc-500 align-top">Luo 2016, Table 4 (Scheme 3 (SIPG chief engineer’s layout))</td>
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
        </tbody>
      </table>
    </div>
  );
}

export function YangshanUncertainty() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
              {/* Card 2 */}
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 flex gap-4 flex-col sm:flex-row">
                <div className="w-10 h-10 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col h-full w-full">
                  <h4 className="font-bold text-zinc-900 mb-1">ARMG Service Variability</h4>
                  <p className="text-sm text-zinc-600 mb-3 flex-grow text-justify"><strong>Modeled via a Normal(µ=60s, σ=10s) distribution.</strong> The σ=10s is physically caused by the TMEIC MAXVIEW micro motion system making ±200mm lateral and ±5° rotation corrections on every lift.</p>
                  <div className="bg-white border border-zinc-200 p-3 rounded-lg mb-4 shadow-sm text-xs text-zinc-600 text-justify">
                    <span className="font-bold text-indigo-600">e.g.</span> A misaligned container forces the ARMG to take 80s instead of 60s to latch properly.
                  </div>
                  <div className="mt-auto pt-2 border-t border-zinc-200/60">
                    <p className="text-[11px] text-zinc-500 font-medium italic">Source: Wu Zhao-yang 2016</p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 flex gap-4 flex-col sm:flex-row">
                <div className="w-10 h-10 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex flex-col h-full w-full">
                  <h4 className="font-bold text-zinc-900 mb-1">Stowage Imbalance</h4>
                  <p className="text-sm text-zinc-600 mb-3 flex-grow text-justify"><strong>Modeled via an asymmetric Multinomial distribution.</strong> Tasks distributed across 26 QCs. Total per episode depends on vessels docked (dynamic) to mathematically skew the vessel belly workload.</p>
                  <div className="bg-white border border-zinc-200 p-3 rounded-lg mb-4 shadow-sm text-xs text-zinc-600 text-justify">
                    <span className="font-bold text-indigo-600">e.g.</span> The ship’s cargo is skewed, forcing QC1 to process 500 containers while QC26 only processes 220.
                  </div>
                  <div className="mt-auto pt-2 border-t border-zinc-200/60">
                    <p className="text-[11px] text-zinc-500 font-medium italic">Source: Bierwirth & Meisel (2010)</p>
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 flex gap-4 flex-col sm:flex-row">
                <div className="w-10 h-10 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex flex-col h-full w-full">
                  <h4 className="font-bold text-zinc-900 mb-1">ARMG Breakdowns</h4>
                  <p className="text-sm text-zinc-600 mb-3 flex-grow text-justify"><strong>Modeled via an Exponential distribution.</strong> Defines the time-between-failures for 1 ARMG going offline, forcing a rescue push (20 to 30 min out of service).</p>
                  <div className="bg-white border border-zinc-200 p-3 rounded-lg mb-4 shadow-sm text-xs text-zinc-600 text-justify">
                    <span className="font-bold text-indigo-600">e.g.</span> An ARMG breaks down and is pushed to the maintenance zone by its partner at 5% speed.
                  </div>
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border border-zinc-200 bg-white mb-4 mt-2">
                     <Image src="/papers/armg_maintenance.png" fill className="object-contain" alt="ARMG Maintenance Zone" />
                  </div>
                  <div className="mt-auto pt-2 border-t border-zinc-200/60">
                    <p className="text-[11px] text-zinc-500 font-medium italic">Source: Xie Xi-cong 2016</p>
                  </div>
                </div>
              </div>
    </div>
  );
}
