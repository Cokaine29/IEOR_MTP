const fs = require('fs');
const path = require('path');

const phase45Content = `
'use client';
import { motion } from 'framer-motion';
import { CheckSquare, ListChecks, CheckCircle2, XCircle } from 'lucide-react';

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function Phase45() {
  return (
    <>
    <motion.section id="phase-4" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="scroll-mt-28 space-y-16 pt-16 border-t border-zinc-200">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900">Phase 4 — Simulation Validation</h2>
        </div>
        
        {/* Pointer 10 */}
        <div id="pointer-10" className="scroll-mt-28 mt-12">
          <h3 className="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
            <span className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded text-sm">10</span>
            Sanity Checks & Seeding
          </h3>

          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm mb-16">
            <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-2">Layer 1 — Physical Sanity Checks (σ=0)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-50 text-zinc-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold rounded-tl-lg">Check</th>
                    <th className="px-4 py-3 font-semibold rounded-tr-lg">Expected Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <tr>
                    <td className="px-4 py-3 font-medium">Turnaround time</td>
                    <td className="px-4 py-3 text-emerald-600 font-semibold">Proportional to 16.81 hrs</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">AGV idle rate</td>
                    <td className="px-4 py-3 text-emerald-600 font-semibold">~36.3%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Throughput saturation</td>
                    <td className="px-4 py-3 text-emerald-600 font-semibold">Flattens at 48 AGVs</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-zinc-500 mt-4 italic">Seeding ensures exact reproducibility: env.reset(seed=seed). Same seed = same episode.</p>
          </div>
        </div>
      </div>
    </motion.section>

    <motion.section id="phase-5" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="scroll-mt-28 space-y-16 pt-16 border-t border-zinc-200">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
            <ListChecks className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900">Phase 5 — Classical Baselines</h2>
        </div>
        
        {/* Pointers 11 & 12 */}
        <div id="pointer-11" className="scroll-mt-28 mt-12">
          <h3 className="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
            <span className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded text-sm">11 & 12</span>
            Implementation & Verification
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group hover:border-cyan-300 transition-colors">
              <div className="absolute top-0 right-0 bg-zinc-100 px-2 py-1 rounded-bl-lg text-xs font-bold text-zinc-500">Egbelu 1984</div>
              <h4 className="font-bold text-zinc-900 mb-2">Greedy (Max Queue)</h4>
              <p className="text-sm text-zinc-600 mb-4">Assign to QC with most waiting containers.</p>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600"><CheckCircle2 className="w-4 h-4"/> Real-time</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group hover:border-cyan-300 transition-colors">
              <div className="absolute top-0 right-0 bg-zinc-100 px-2 py-1 rounded-bl-lg text-xs font-bold text-zinc-500">Kim 2004</div>
              <h4 className="font-bold text-zinc-900 mb-2">Look-Ahead (LADP)</h4>
              <p className="text-sm text-zinc-600 mb-4">Plans 2 jobs ahead per AGV.</p>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600"><CheckCircle2 className="w-4 h-4"/> Real-time</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border-2 border-cyan-400 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-cyan-100 px-2 py-1 rounded-bl-lg text-xs font-bold text-cyan-700">Briskorn 2006</div>
              <h4 className="font-bold text-zinc-900 mb-2">Inventory-Based</h4>
              <p className="text-sm text-zinc-600 mb-4">Assign to QC with lowest in-transit AGVs. Strongest classical baseline.</p>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600"><CheckCircle2 className="w-4 h-4"/> Real-time</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group hover:border-cyan-300 transition-colors">
              <div className="absolute top-0 right-0 bg-zinc-100 px-2 py-1 rounded-bl-lg text-xs font-bold text-zinc-500">Grunow 2006</div>
              <h4 className="font-bold text-zinc-900 mb-2">Genetic Algorithm</h4>
              <p className="text-sm text-zinc-600 mb-4">Offline schedule generation (DEAP).</p>
              <div className="flex items-center gap-1 text-xs font-bold text-red-500"><XCircle className="w-4 h-4"/> Fails on disruption</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group hover:border-cyan-300 transition-colors">
              <div className="absolute top-0 right-0 bg-zinc-100 px-2 py-1 rounded-bl-lg text-xs font-bold text-zinc-500">Zheng 2022</div>
              <h4 className="font-bold text-zinc-900 mb-2">DQN (Single-Agent)</h4>
              <p className="text-sm text-zinc-600 mb-4">DRL baseline. 153 input nodes.</p>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500"><CheckCircle2 className="w-4 h-4"/> Partial Stochasticity</div>
            </div>
          </div>

          <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
            <h4 className="font-bold text-zinc-800 mb-2">Deterministic Ordering Check (σ=0)</h4>
            <code className="bg-white px-4 py-2 rounded border border-zinc-200 text-sm font-bold text-zinc-700 block text-center">
              GA ≥ Look-Ahead &gt; Inventory-Based &gt; Greedy
            </code>
            <p className="text-sm text-zinc-500 mt-2 text-center">If Greedy beats Look-Ahead at σ=0, the implementation is bugged.</p>
          </div>

        </div>
      </div>
    </motion.section>
    </>
  );
}
`;

fs.writeFileSync(path.join('src/components/methodology/Phase45.tsx'), phase45Content, 'utf8');
console.log('Phase 45 done');
