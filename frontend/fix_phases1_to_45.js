const fs = require('fs');

const phase1Content = `
'use client';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Zap, Layers, Server, Activity, MonitorPlay } from 'lucide-react';

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Phase1() {
  return (
    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="space-y-12">
      <div id="phase-1" className="scroll-mt-28">
        <h2 className="text-3xl font-bold text-zinc-900 border-b-2 border-zinc-200 pb-2">Phase 1 — Terminal Environment Design</h2>
      </div>
      
      {/* Pointer 1 */}
      <div id="pointer-1" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <LayoutDashboard className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
              1. Terminal Layout Finalization
            </h2>
            <div className="text-zinc-800 leading-relaxed space-y-4">
              <p><strong className="text-zinc-900 font-semibold">Decision: Layout A — Perpendicular (Rotterdam/Hamburg style)</strong></p>
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
              <div className="bg-zinc-100 p-4 rounded-xl border-l-4 border-zinc-400 mt-4">
                <p className="text-zinc-800 font-medium italic text-sm">"This study models a standard perpendicular-layout ACT calibrated to Liu et al. (2001), which remains the most widely used layout in dispatching literature. Modern parallel-layout terminals represent a promising avenue for future work."</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pointers 2 & 3 */}
      <div id="pointer-2" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <Users className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
              2 & 3. Fleet Size & Parameter Calibration
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 text-center">
                <div className="text-3xl font-bold text-zinc-900 mb-1">5</div>
                <div className="text-sm font-semibold text-zinc-700">Quay Cranes</div>
                <div className="text-xs text-zinc-500 mt-1">Liu (2001)</div>
              </div>
              <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 text-center">
                <div className="text-3xl font-bold text-zinc-900 mb-1">20</div>
                <div className="text-sm font-semibold text-zinc-700">AGVs</div>
                <div className="text-xs text-zinc-500 mt-1">4 per QC ratio</div>
              </div>
              <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 text-center">
                <div className="text-3xl font-bold text-zinc-900 mb-1">8</div>
                <div className="text-sm font-semibold text-zinc-700">Yard Blocks</div>
                <div className="text-xs text-zinc-500 mt-1">Proportional</div>
              </div>
              <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 text-center">
                <div className="text-3xl font-bold text-zinc-900 mb-1">86s</div>
                <div className="text-sm font-semibold text-zinc-700">QC Cycle</div>
                <div className="text-xs text-zinc-500 mt-1">42 moves/hr</div>
              </div>
            </div>
            <div className="bg-zinc-100 rounded-2xl p-6">
              <h4 className="font-bold text-zinc-900 mb-2 flex items-center gap-2"><MonitorPlay className="w-4 h-4"/> Validation Benchmark</h4>
              <p className="text-sm text-zinc-700 leading-relaxed">
                The simulated terminal must reproduce Liu's <strong>16.81-hour turnaround</strong> under import-only, deterministic conditions (σ=0) before any disruptions or dual cycling are introduced. 
              </p>
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
              4. Simulation Software Architecture
            </h2>
            <div className="flex flex-col gap-6 max-w-2xl mx-auto mt-6">
              
              <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl flex items-center gap-4 relative">
                <div className="w-12 h-12 bg-zinc-200 text-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Layer 3</div>
                  <h4 className="font-bold text-zinc-900">RL Agent (Stable-Baselines3)</h4>
                  <p className="text-xs text-zinc-600">PPO (Phase 1) / MAPPO (Phase 2)</p>
                </div>
              </div>

              <div className="flex justify-center -my-3 relative z-10">
                <div className="bg-white border border-zinc-200 text-xs px-3 py-1 rounded-full text-zinc-500 flex flex-col items-center shadow-sm">
                  <span>↓ action</span>
                  <span>↑ state, reward</span>
                </div>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl flex items-center gap-4 relative">
                <div className="w-12 h-12 bg-zinc-200 text-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Layer 2</div>
                  <h4 className="font-bold text-zinc-900">Gymnasium Wrapper</h4>
                  <p className="text-xs text-zinc-600">Translates simulation → MDP (S, A, R interface)</p>
                </div>
              </div>

              <div className="flex justify-center -my-3 relative z-10">
                <div className="bg-white border border-zinc-200 text-xs px-3 py-1 rounded-full text-zinc-500 flex flex-col items-center shadow-sm">
                  <span>↓ AGV assignments</span>
                  <span>↑ terminal state</span>
                </div>
              </div>

              <div className="bg-zinc-100 border border-zinc-300 p-4 rounded-xl flex items-center gap-4 relative">
                <div className="w-12 h-12 bg-zinc-300 text-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1">Layer 1</div>
                  <h4 className="font-bold text-zinc-900">Terminal Simulator (Python)</h4>
                  <p className="text-xs text-zinc-600">Physical event-driven simulation (5 QCs, 20 AGVs)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
`;

fs.writeFileSync('src/components/methodology/Phase1.tsx', phase1Content, 'utf8');

const phase2Content = `
'use client';
import { motion } from 'framer-motion';
import { BrainCircuit, Maximize, Target, GitBranch, ArrowRightLeft } from 'lucide-react';

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Phase2() {
  return (
    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="space-y-12 mt-12">
      <div id="phase-2" className="scroll-mt-28">
        <h2 className="text-3xl font-bold text-zinc-900 border-b-2 border-zinc-200 pb-2">Phase 2 — MDP Formulation</h2>
      </div>
      
      {/* Pointer 5 */}
      <div id="pointer-5" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <BrainCircuit className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              5. State Space Definition
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">QC State (25 values)</h4>
                <ul className="text-sm text-zinc-600 space-y-2">
                  <li>• Import containers waiting</li>
                  <li>• Accumulated idle time</li>
                  <li>• <strong className="text-zinc-900">AGVs in-transit TO this QC</strong> (Briskorn 2006)</li>
                  <li>• AGVs currently at QC</li>
                  <li>• Current cycle time estimate</li>
                </ul>
              </div>
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Yard State (24 values)</h4>
                <ul className="text-sm text-zinc-600 space-y-2">
                  <li>• Export containers ready</li>
                  <li>• AGVs in-transit TO this block</li>
                  <li>• AGVs currently at block</li>
                </ul>
              </div>
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">AGV State (100 values)</h4>
                <ul className="text-sm text-zinc-600 space-y-2">
                  <li>• <strong className="text-zinc-900">Position (x,y normalised)</strong></li>
                  <li>• Status (idle/moving/broken)</li>
                  <li>• Remaining travel time</li>
                  <li>• Current payload</li>
                </ul>
              </div>
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Global State (4 values)</h4>
                <ul className="text-sm text-zinc-600 space-y-2">
                  <li>• Import/Export tasks remaining</li>
                  <li>• Operational AGVs</li>
                  <li>• Episode time elapsed</li>
                </ul>
              </div>
            </div>

            <div className="bg-zinc-100 text-zinc-900 rounded-2xl p-6 flex items-center justify-between border border-zinc-300">
              <div>
                <div className="text-sm font-bold uppercase tracking-wider mb-1 text-zinc-600">Total State Vector</div>
                <div className="text-3xl font-bold">153 Features</div>
              </div>
              <Maximize className="w-10 h-10 text-zinc-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Pointers 6, 7, 8 Summary */}
      <div id="pointer-6" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <Target className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              6, 7 & 8. Action, Reward & Transitions
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Action Space */}
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Action Space</h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-bold text-zinc-500 mb-1">Event 1: Idle AGV</div>
                    <div className="text-sm font-semibold text-zinc-800">14 Actions</div>
                    <div className="text-xs text-zinc-600 mt-1">QC1-5, YB1-8, Wait</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-500 mb-1">Event 2: Dual Cycle</div>
                    <div className="text-sm font-semibold text-zinc-800">2 Actions</div>
                    <div className="text-xs text-zinc-600 mt-1">Dual Cycle, Return Empty</div>
                  </div>
                </div>
              </div>

              {/* Reward */}
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Reward</h4>
                <p className="text-sm font-medium text-zinc-700 mb-3 border-b border-zinc-200 pb-3 leading-relaxed">
                  - ∑ QC idle time<br/>
                  - α × empty distance<br/>
                  + β × dual cycle bonus
                </p>
                <p className="text-xs text-zinc-500 italic">
                  Discount factor γ=0.95 (not 0.99) based on Angeloudis & Bell (2010).
                </p>
              </div>

              {/* Transitions */}
              <div className="bg-zinc-100 p-6 rounded-2xl border border-zinc-300">
                <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-300 pb-2">Transitions</h4>
                <p className="text-sm text-zinc-700 leading-relaxed">
                  Event-driven simulation. A decision is triggered only when an AGV becomes idle or drops off a container. 153 features capture full state (Markov Property holds).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
`;

fs.writeFileSync('src/components/methodology/Phase2.tsx', phase2Content, 'utf8');

const phase3Content = `
'use client';
import { motion } from 'framer-motion';
import { CloudLightning, Clock, Truck, Ship, AlertTriangle } from 'lucide-react';

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Phase3() {
  return (
    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="space-y-12 mt-12">
      <div id="phase-3" className="scroll-mt-28">
        <h2 className="text-3xl font-bold text-zinc-900 border-b-2 border-zinc-200 pb-2">Phase 3 — Stochasticity Model</h2>
      </div>
      
      {/* Pointer 9 */}
      <div id="pointer-9" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <CloudLightning className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              9. Four Concurrent Disruptions
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 mb-1">Crane Cycle Variability</h4>
                  <p className="text-sm text-zinc-600 mb-3">Log-Normal distribution. Most lifts near 86s mean, with occasional long delays.</p>
                  <div className="flex gap-2 text-xs font-semibold text-zinc-500">
                    <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-700">σ=0: 0s</span>
                    <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-700">σ=3: 30s noise</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 mb-1">Traffic & Travel Noise</h4>
                  <p className="text-sm text-zinc-600 mb-3">Normal additive noise on shortest path estimate. Simulates intersection congestion.</p>
                  <div className="flex gap-2 text-xs font-semibold text-zinc-500">
                    <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-700">σ=0: 0s</span>
                    <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-700">σ=3: 30s noise</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center shrink-0">
                  <Ship className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 mb-1">Vessel Arrival Delay</h4>
                  <p className="text-sm text-zinc-600 mb-3">Normal distribution centered on schedule. Fleet sits idle if late.</p>
                  <div className="flex gap-2 text-xs font-semibold text-zinc-500">
                    <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-700">σ=0: On time</span>
                    <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-700">σ=3: ±2 hrs</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 mb-1">AGV Breakdown</h4>
                  <p className="text-sm text-zinc-600 mb-3">Exp(λ) failure time, Log-Normal repair time. Blocks lane in Phase 2.</p>
                  <div className="flex gap-2 text-xs font-semibold text-zinc-500">
                    <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-700">σ=0: Never</span>
                    <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-700">σ=3: ~2hr interval</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-100 p-6 rounded-2xl border border-zinc-300 mb-12">
              <h4 className="font-bold text-zinc-900 mb-4">Combined Intensity Framework (The X-Axis)</h4>
              <div className="relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-300 -translate-y-1/2"></div>
                <div className="relative flex justify-between">
                  <div className="bg-white border-2 border-zinc-400 w-12 h-12 rounded-full flex items-center justify-center font-bold text-zinc-700 shadow-sm z-10">0</div>
                  <div className="bg-white border-2 border-zinc-400 w-12 h-12 rounded-full flex items-center justify-center font-bold text-zinc-700 shadow-sm z-10">1</div>
                  <div className="bg-white border-2 border-zinc-400 w-12 h-12 rounded-full flex items-center justify-center font-bold text-zinc-700 shadow-sm z-10">2</div>
                  <div className="bg-zinc-800 border-2 border-zinc-900 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-md z-10">3</div>
                </div>
                <div className="flex justify-between mt-3 text-xs font-bold text-zinc-600 text-center">
                  <span className="w-16">Deterministic</span>
                  <span className="w-16">Low</span>
                  <span className="w-16">Medium</span>
                  <span className="w-16 text-zinc-900">High</span>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-zinc-900 mb-6">Road Network Topology</h3>
            <div className="bg-zinc-800 p-8 rounded-2xl text-zinc-400 font-mono text-sm shadow-inner overflow-x-auto whitespace-pre leading-relaxed border border-zinc-700">
  <span className="text-white font-bold">[SHIP]</span>
   <span className="text-zinc-300 font-bold">QC1    QC2    QC3    QC4    QC5</span>
    |      |      |      |      |
  ==================================  <span className="text-zinc-500">← QUAY ROAD (~498 m)</span>
    |      |      |      |      |
    ↓↑     ↓↑     ↓↑     ↓↑     ↓↑    <span className="text-zinc-500">← 5 CONNECTING LANES (~150 m)</span>
    |      |      |      |      |
  ==================================  <span className="text-zinc-500">← YARD ROAD (~498 m)</span>
    |      |      |      |      |
   <span className="text-zinc-300 font-bold">YB1   YB2   YB3   YB4   YB5  YB6  YB7  YB8</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
`;

fs.writeFileSync('src/components/methodology/Phase3.tsx', phase3Content, 'utf8');

const phase45Content = `
'use client';
import { motion } from 'framer-motion';
import { CheckSquare, ListChecks, CheckCircle2, XCircle } from 'lucide-react';

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Phase45() {
  return (
    <>
    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="space-y-12 mt-12">
      <div id="phase-4" className="scroll-mt-28">
        <h2 className="text-3xl font-bold text-zinc-900 border-b-2 border-zinc-200 pb-2">Phase 4 — Simulation Validation</h2>
      </div>
      
      {/* Pointer 10 */}
      <div id="pointer-10" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <CheckSquare className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              10. Sanity Checks & Seeding
            </h2>
            <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
              <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Layer 1 — Physical Sanity Checks (σ=0)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-zinc-100 text-zinc-700">
                    <tr>
                      <th className="px-4 py-3 font-semibold rounded-tl-lg">Check</th>
                      <th className="px-4 py-3 font-semibold rounded-tr-lg">Expected Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    <tr>
                      <td className="px-4 py-3 font-medium text-zinc-800">Turnaround time</td>
                      <td className="px-4 py-3 text-zinc-900 font-semibold">Proportional to 16.81 hrs</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-zinc-800">AGV idle rate</td>
                      <td className="px-4 py-3 text-zinc-900 font-semibold">~36.3%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-zinc-800">Throughput saturation</td>
                      <td className="px-4 py-3 text-zinc-900 font-semibold">Flattens at 48 AGVs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-zinc-600 mt-4 italic">Seeding ensures exact reproducibility: env.reset(seed=seed). Same seed = same episode.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>

    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="space-y-12 mt-12">
      <div id="phase-5" className="scroll-mt-28">
        <h2 className="text-3xl font-bold text-zinc-900 border-b-2 border-zinc-200 pb-2">Phase 5 — Classical Baselines</h2>
      </div>
      
      {/* Pointers 11 & 12 */}
      <div id="pointer-11" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <ListChecks className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              11 & 12. Implementation & Verification
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-zinc-200 px-2 py-1 rounded-bl-lg text-xs font-bold text-zinc-600">Egbelu 1984</div>
                <h4 className="font-bold text-zinc-900 mb-2">Greedy (Max Queue)</h4>
                <p className="text-sm text-zinc-600 mb-4">Assign to QC with most waiting containers.</p>
                <div className="flex items-center gap-1 text-xs font-bold text-zinc-800"><CheckCircle2 className="w-4 h-4"/> Real-time</div>
              </div>

              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-zinc-200 px-2 py-1 rounded-bl-lg text-xs font-bold text-zinc-600">Kim 2004</div>
                <h4 className="font-bold text-zinc-900 mb-2">Look-Ahead (LADP)</h4>
                <p className="text-sm text-zinc-600 mb-4">Plans 2 jobs ahead per AGV.</p>
                <div className="flex items-center gap-1 text-xs font-bold text-zinc-800"><CheckCircle2 className="w-4 h-4"/> Real-time</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border-2 border-zinc-400 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-zinc-700 text-white px-2 py-1 rounded-bl-lg text-xs font-bold">Briskorn 2006</div>
                <h4 className="font-bold text-zinc-900 mb-2">Inventory-Based</h4>
                <p className="text-sm text-zinc-600 mb-4">Assign to QC with lowest in-transit AGVs. Strongest classical baseline.</p>
                <div className="flex items-center gap-1 text-xs font-bold text-zinc-800"><CheckCircle2 className="w-4 h-4"/> Real-time</div>
              </div>

              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-zinc-200 px-2 py-1 rounded-bl-lg text-xs font-bold text-zinc-600">Grunow 2006</div>
                <h4 className="font-bold text-zinc-900 mb-2">Genetic Algorithm</h4>
                <p className="text-sm text-zinc-600 mb-4">Offline schedule generation (DEAP).</p>
                <div className="flex items-center gap-1 text-xs font-bold text-red-600"><XCircle className="w-4 h-4"/> Fails on disruption</div>
              </div>

              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-zinc-200 px-2 py-1 rounded-bl-lg text-xs font-bold text-zinc-600">Zheng 2022</div>
                <h4 className="font-bold text-zinc-900 mb-2">DQN (Single-Agent)</h4>
                <p className="text-sm text-zinc-600 mb-4">DRL baseline. 153 input nodes.</p>
                <div className="flex items-center gap-1 text-xs font-bold text-zinc-600"><CheckCircle2 className="w-4 h-4"/> Partial Stochasticity</div>
              </div>
            </div>

            <div className="bg-zinc-100 p-6 rounded-2xl border border-zinc-200">
              <h4 className="font-bold text-zinc-900 mb-3">Deterministic Ordering Check (σ=0)</h4>
              <code className="bg-white px-4 py-3 rounded-lg border border-zinc-300 text-sm font-bold text-zinc-800 block text-center shadow-sm">
                GA ≥ Look-Ahead &gt; Inventory-Based &gt; Greedy
              </code>
              <p className="text-sm text-zinc-600 mt-3 text-center">If Greedy beats Look-Ahead at σ=0, the implementation is bugged.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    </>
  );
}
`;

fs.writeFileSync('src/components/methodology/Phase45.tsx', phase45Content, 'utf8');
