const fs = require('fs');
const path = require('path');

const phase1Content = `
'use client';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Zap, Layers, Server, Activity, MonitorPlay } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function Phase1() {
  return (
    <motion.section id="phase-1" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="scroll-mt-28 space-y-16">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900">Phase 1 — Terminal Environment Design</h2>
        </div>
        
        {/* Pointer 1 */}
        <div id="pointer-1" className="scroll-mt-28 mt-12">
          <h3 className="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
            <span className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded text-sm">1</span>
            Terminal Layout Finalization
          </h3>
          <p className="text-zinc-600 mb-6 font-medium"><strong>Decision: Layout A — Perpendicular (Rotterdam/Hamburg style)</strong></p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border-2 border-indigo-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">SELECTED</div>
              <h4 className="font-bold text-lg mb-2 text-zinc-900">Layout A (Perpendicular)</h4>
              <p className="text-zinc-600 text-sm mb-4">Yard blocks run perpendicular to the shoreline. AGVs travel to the short end (I/O point) of each block.</p>
              <ul className="text-sm text-zinc-500 space-y-1 list-disc pl-4">
                <li>Standard for Import/Export</li>
                <li>Used by all 6 Tier 1 papers</li>
                <li>Simpler directed road network</li>
              </ul>
            </div>
            
            <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl opacity-75">
              <h4 className="font-bold text-lg mb-2 text-zinc-500">Layout B (Parallel)</h4>
              <p className="text-zinc-500 text-sm mb-4">Yard blocks run parallel to the shoreline. AGVs approach from the long side.</p>
              <ul className="text-sm text-zinc-400 space-y-1 list-disc pl-4">
                <li>Suited for transshipment hubs</li>
                <li>Used in modern Chinese mega-ports</li>
              </ul>
            </div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl border-l-4 border-indigo-500">
            <p className="text-indigo-900 font-medium italic text-sm">"This study models a standard perpendicular-layout ACT calibrated to Liu et al. (2001), which remains the most widely used layout in dispatching literature. Modern parallel-layout terminals represent a promising avenue for future work."</p>
          </div>
        </div>

        {/* Pointer 2 & 3 Combined */}
        <div id="pointer-2" className="scroll-mt-28 mt-16">
          <h3 className="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
            <span className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded text-sm">2 & 3</span>
            Fleet Size & Parameter Calibration
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-1">5</div>
              <div className="text-sm font-semibold text-zinc-700">Quay Cranes</div>
              <div className="text-xs text-zinc-500 mt-1">Liu et al. (2001)</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-1">20</div>
              <div className="text-sm font-semibold text-zinc-700">AGVs</div>
              <div className="text-xs text-zinc-500 mt-1">4 per QC ratio</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-1">8</div>
              <div className="text-sm font-semibold text-zinc-700">Yard Blocks</div>
              <div className="text-xs text-zinc-500 mt-1">Proportional scale</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-1">86s</div>
              <div className="text-sm font-semibold text-zinc-700">QC Cycle</div>
              <div className="text-xs text-zinc-500 mt-1">42 moves/hr</div>
            </div>
          </div>
          
          <div className="bg-zinc-900 text-white rounded-2xl p-6">
            <h4 className="font-bold text-cyan-400 mb-4 flex items-center gap-2"><MonitorPlay className="w-4 h-4"/> Validation Benchmark</h4>
            <p className="text-sm text-zinc-300 leading-relaxed">
              The simulated terminal must reproduce Liu's <strong>16.81-hour turnaround</strong> under import-only, deterministic conditions (σ=0) before any disruptions or dual cycling are introduced. 
            </p>
          </div>
        </div>

        {/* Pointer 4 */}
        <div id="pointer-4" className="scroll-mt-28 mt-16">
          <h3 className="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
            <span className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded text-sm">4</span>
            Simulation Software Architecture
          </h3>
          
          {/* Architecture Diagram */}
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
            <div className="flex flex-col gap-6 max-w-2xl mx-auto">
              
              <div className="bg-indigo-50 border-2 border-indigo-200 p-4 rounded-xl flex items-center gap-4 relative">
                <div className="w-12 h-12 bg-indigo-500 text-white rounded-lg flex items-center justify-center shrink-0 shadow-lg">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Layer 3</div>
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

              <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-xl flex items-center gap-4 relative">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-lg flex items-center justify-center shrink-0 shadow-lg">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Layer 2</div>
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

              <div className="bg-zinc-900 border-2 border-zinc-700 p-4 rounded-xl flex items-center gap-4 relative">
                <div className="w-12 h-12 bg-zinc-700 text-white rounded-lg flex items-center justify-center shrink-0 shadow-lg">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Layer 1</div>
                  <h4 className="font-bold text-white">Terminal Simulator (Python)</h4>
                  <p className="text-xs text-zinc-400">Physical event-driven simulation (5 QCs, 20 AGVs)</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </motion.section>
  );
}
`;

fs.writeFileSync(path.join('src/components/methodology/Phase1.tsx'), phase1Content, 'utf8');
console.log('Phase 1 done');
