const fs = require('fs');
const path = require('path');

const phase6Content = `
'use client';
import { motion } from 'framer-motion';
import { Network, TrendingUp, Cpu, Settings2, Users } from 'lucide-react';

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function Phase6() {
  return (
    <motion.section id="phase-6" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="scroll-mt-28 space-y-16 pt-16 border-t border-zinc-200">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
            <Network className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900">Phase 6 — DRL Implementation</h2>
        </div>
        
        {/* Pointer 13 & 16 */}
        <div id="pointer-13" className="scroll-mt-28 mt-12">
          <h3 className="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
            <span className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded text-sm">13 & 16</span>
            Network Architectures (PPO & MAPPO)
          </h3>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* PPO Architecture */}
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
              <h4 className="font-bold text-zinc-900 mb-6 text-center">Phase 1: PPO Actor-Critic (Single Agent)</h4>
              <div className="flex flex-col items-center gap-4 text-sm font-mono">
                <div className="bg-zinc-100 px-6 py-3 rounded-xl border border-zinc-200 shadow-inner w-full text-center">
                  <div className="font-bold text-zinc-800">Global State Input</div>
                  <div className="text-xs text-zinc-500">153 Features</div>
                </div>
                <div className="text-zinc-400">↓</div>
                <div className="bg-indigo-50 px-6 py-3 rounded-xl border border-indigo-200 w-3/4 text-center text-indigo-700 font-bold">
                  Hidden: 256 (ReLU)
                </div>
                <div className="text-zinc-400">↓</div>
                <div className="bg-indigo-50 px-6 py-3 rounded-xl border border-indigo-200 w-2/3 text-center text-indigo-700 font-bold">
                  Hidden: 128 (ReLU)
                </div>
                <div className="flex gap-4 w-full mt-2">
                  <div className="flex-1 bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center">
                    <div className="font-bold text-emerald-700 mb-1">Actor</div>
                    <div className="text-xs text-emerald-600">14 Nodes (Softmax)</div>
                    <div className="text-[10px] text-emerald-500 mt-1">Action Probs</div>
                  </div>
                  <div className="flex-1 bg-blue-50 border border-blue-200 p-3 rounded-xl text-center">
                    <div className="font-bold text-blue-700 mb-1">Critic</div>
                    <div className="text-xs text-blue-600">1 Node (Linear)</div>
                    <div className="text-[10px] text-blue-500 mt-1">Value Estimate V(s)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* MAPPO Architecture */}
            <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-700 shadow-xl">
              <h4 className="font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                <Users className="w-5 h-5 text-pink-400"/> Phase 2: MAPPO (CTDE)
              </h4>
              <div className="flex flex-col items-center gap-4 text-sm font-mono">
                <div className="flex gap-4 w-full">
                  <div className="flex-1 bg-zinc-800 px-4 py-3 rounded-xl border border-zinc-600 text-center">
                    <div className="font-bold text-zinc-200">Local Obs (per AGV)</div>
                    <div className="text-xs text-zinc-400">25 Features</div>
                  </div>
                  <div className="flex-1 bg-zinc-800 px-4 py-3 rounded-xl border border-zinc-600 text-center opacity-80">
                    <div className="font-bold text-zinc-300">Global State</div>
                    <div className="text-xs text-zinc-400">153 Features</div>
                  </div>
                </div>
                
                <div className="flex gap-4 w-full text-zinc-500 justify-around">
                  <div>↓</div>
                  <div>↓</div>
                </div>

                <div className="flex gap-4 w-full">
                  <div className="flex-1 bg-pink-900/30 border border-pink-500/30 p-3 rounded-xl text-center">
                    <div className="font-bold text-pink-300 mb-1">Shared Actor</div>
                    <div className="text-xs text-pink-400/70">64 → 64 → Probs</div>
                    <div className="text-[10px] text-pink-400/50 mt-1">Execution (Decentralized)</div>
                  </div>
                  <div className="flex-1 bg-blue-900/30 border border-blue-500/30 p-3 rounded-xl text-center">
                    <div className="font-bold text-blue-300 mb-1">Central Critic</div>
                    <div className="text-xs text-blue-400/70">256 → 128 → V(s)</div>
                    <div className="text-[10px] text-blue-400/50 mt-1">Training Only (Centralized)</div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-zinc-400 mt-6 text-center italic">
                CTDE paradigm: Centralized Training, Decentralized Execution. All 20 AGVs share ONE actor network.
              </div>
            </div>
          </div>
        </div>

        {/* Pointer 15: Curriculum */}
        <div id="pointer-15" className="scroll-mt-28 mt-16">
          <h3 className="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
            <span className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded text-sm">15</span>
            Curriculum Learning Design
          </h3>
          
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 overflow-x-auto">
            <div className="min-w-[700px]">
              <div className="flex items-end h-40 gap-2 mb-4 border-b border-zinc-200 pb-2">
                {[
                  { stage: 0, label: 'Deterministic', val: 15 },
                  { stage: 1, label: 'Crane var (σ=1)', val: 30 },
                  { stage: 2, label: '+ Travel noise', val: 45 },
                  { stage: 3, label: '+ Vessel delay', val: 60 },
                  { stage: 4, label: 'All 4 (σ=1)', val: 75 },
                  { stage: 5, label: 'All 4 (σ=2)', val: 90 },
                  { stage: 6, label: 'All 4 (σ=3)', val: 100 },
                ].map((s) => (
                  <div key={s.stage} className="flex-1 flex flex-col items-center justify-end relative group">
                    <div 
                      className={\`w-full rounded-t-lg transition-all duration-300 \${s.stage === 6 ? 'bg-pink-500' : 'bg-indigo-200 hover:bg-indigo-300'}\`} 
                      style={{ height: \`\${s.val}%\` }}
                    ></div>
                    <div className="text-xs font-bold text-zinc-500 mt-2">Stage {s.stage}</div>
                    <div className="text-[10px] text-zinc-400 text-center leading-tight mt-1 h-8">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl text-sm text-zinc-600 font-medium">
                <strong className="text-zinc-900">Advancement criterion:</strong> Advance when 100-episode rolling average reward improvement is &lt; 5% (adaptive plateau detection).
              </div>
            </div>
          </div>
        </div>

        {/* Pointer 17: Hyperparameters */}
        <div id="pointer-17" className="scroll-mt-28 mt-16">
          <h3 className="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
            <span className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded text-sm">17</span>
            Hyperparameter Tuning
          </h3>
          
          <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">Hyperparameter</th>
                  <th className="px-6 py-4 font-semibold">Search Range</th>
                  <th className="px-6 py-4 font-semibold">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <td className="px-6 py-3 font-medium text-zinc-900">Discount factor γ</td>
                  <td className="px-6 py-3 font-mono text-xs bg-zinc-100 rounded inline-block m-2">[0.5, 0.7, 0.95]</td>
                  <td className="px-6 py-3 text-zinc-500">Crucial: Do not use 0.99 (Angeloudis 2010)</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-medium text-zinc-900">Learning rate</td>
                  <td className="px-6 py-3 font-mono text-xs bg-zinc-100 rounded inline-block m-2">[1e-4, 5e-4]</td>
                  <td className="px-6 py-3 text-zinc-500">Optuna Bayesian search</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-medium text-zinc-900">Clip range ε</td>
                  <td className="px-6 py-3 font-mono text-xs bg-zinc-100 rounded inline-block m-2">[0.1, 0.3]</td>
                  <td className="px-6 py-3 text-zinc-500">PPO specific</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-medium text-zinc-900">Reward weights α, β</td>
                  <td className="px-6 py-3 font-mono text-xs bg-zinc-100 rounded inline-block m-2">[0.05, 0.5]</td>
                  <td className="px-6 py-3 text-zinc-500">Empty travel vs Dual cycle bonus</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </motion.section>
  );
}
`;

fs.writeFileSync(path.join('src/components/methodology/Phase6.tsx'), phase6Content, 'utf8');
console.log('Phase 6 done');
