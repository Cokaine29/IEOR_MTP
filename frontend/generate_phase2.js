const fs = require('fs');
const path = require('path');

const phase2Content = `
'use client';
import { motion } from 'framer-motion';
import { BrainCircuit, Maximize, Target, GitBranch, ArrowRightLeft } from 'lucide-react';

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function Phase2() {
  return (
    <motion.section id="phase-2" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="scroll-mt-28 space-y-16 pt-16 border-t border-zinc-200">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900">Phase 2 — MDP Formulation</h2>
        </div>
        
        {/* Pointer 5 */}
        <div id="pointer-5" className="scroll-mt-28 mt-12">
          <h3 className="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
            <span className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded text-sm">5</span>
            State Space Definition
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-2">QC State (25 values)</h4>
              <ul className="text-sm text-zinc-600 space-y-2">
                <li>• Import containers waiting</li>
                <li>• Accumulated idle time</li>
                <li>• <strong className="text-zinc-900">AGVs in-transit TO this QC</strong> (Briskorn 2006)</li>
                <li>• AGVs currently at QC</li>
                <li>• Current cycle time estimate</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-2">Yard State (24 values)</h4>
              <ul className="text-sm text-zinc-600 space-y-2">
                <li>• Export containers ready</li>
                <li>• AGVs in-transit TO this block</li>
                <li>• AGVs currently at block</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-2">AGV State (100 values)</h4>
              <ul className="text-sm text-zinc-600 space-y-2">
                <li>• <strong className="text-zinc-900">Position (x,y normalised)</strong> — prevents false ordinal relationships</li>
                <li>• Status (idle/moving/broken)</li>
                <li>• Remaining travel time</li>
                <li>• Current payload</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-2">Global State (4 values)</h4>
              <ul className="text-sm text-zinc-600 space-y-2">
                <li>• Import/Export tasks remaining</li>
                <li>• Operational AGVs</li>
                <li>• Episode time elapsed</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-6 flex items-center justify-between shadow-lg">
            <div>
              <div className="text-sm font-bold opacity-80 uppercase tracking-wider mb-1">Total State Vector</div>
              <div className="text-3xl font-bold">153 Features</div>
            </div>
            <Maximize className="w-10 h-10 opacity-50" />
          </div>
        </div>

        {/* Pointers 6, 7, 8 Summary */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {/* Action Space */}
          <div id="pointer-6" className="scroll-mt-28 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-purple-500"/> Action Space</h4>
            <div className="space-y-4">
              <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                <div className="text-xs font-bold text-zinc-500 mb-1">Event 1: Idle AGV</div>
                <div className="text-sm font-semibold text-zinc-800">14 Actions</div>
                <div className="text-xs text-zinc-600 mt-1">QC1-5, YB1-8, Wait</div>
              </div>
              <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                <div className="text-xs font-bold text-zinc-500 mb-1">Event 2: Dual Cycle</div>
                <div className="text-sm font-semibold text-zinc-800">2 Actions</div>
                <div className="text-xs text-zinc-600 mt-1">Dual Cycle, Return Empty</div>
              </div>
            </div>
          </div>

          {/* Reward */}
          <div id="pointer-7" className="scroll-mt-28 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><ArrowRightLeft className="w-5 h-5 text-emerald-500"/> Reward</h4>
            <p className="text-sm font-medium text-zinc-600 mb-3 border-b border-zinc-100 pb-3">
              - ∑ QC idle time<br/>
              - α × empty distance<br/>
              + β × dual cycle bonus
            </p>
            <p className="text-xs text-zinc-500 italic">
              Discount factor γ=0.95 (not 0.99) based on Angeloudis & Bell (2010).
            </p>
          </div>

          {/* Transitions */}
          <div id="pointer-8" className="scroll-mt-28 bg-zinc-900 p-6 rounded-2xl border border-zinc-800 text-white shadow-lg">
            <h4 className="font-bold text-cyan-400 mb-4 flex items-center gap-2"><GitBranch className="w-5 h-5"/> Transitions</h4>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Event-driven simulation. A decision is triggered only when an AGV becomes idle or drops off a container. 153 features capture full state (Markov Property holds).
            </p>
          </div>
        </div>

      </div>
    </motion.section>
  );
}
`;

fs.writeFileSync(path.join('src/components/methodology/Phase2.tsx'), phase2Content, 'utf8');
console.log('Phase 2 done');
