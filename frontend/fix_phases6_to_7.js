const fs = require('fs');

const phase6Content = `
'use client';
import { motion } from 'framer-motion';
import { Network, TrendingUp, Cpu, Settings2, Users } from 'lucide-react';

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Phase6() {
  return (
    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="space-y-12 mt-12">
      <div id="phase-6" className="scroll-mt-28">
        <h2 className="text-3xl font-bold text-zinc-900 border-b-2 border-zinc-200 pb-2">Phase 6 — DRL Implementation</h2>
      </div>
      
      {/* Pointer 13 & 16 */}
      <div id="pointer-13" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <Network className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              13 & 16. Network Architectures (PPO & MAPPO)
            </h2>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* PPO Architecture */}
              <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-200 shadow-sm">
                <h4 className="font-bold text-zinc-900 mb-6 text-center">Phase 1: PPO Actor-Critic (Single Agent)</h4>
                <div className="flex flex-col items-center gap-4 text-sm font-mono">
                  <div className="bg-white px-6 py-3 rounded-xl border border-zinc-300 shadow-sm w-full text-center">
                    <div className="font-bold text-zinc-800">Global State Input</div>
                    <div className="text-xs text-zinc-500">153 Features</div>
                  </div>
                  <div className="text-zinc-400">↓</div>
                  <div className="bg-zinc-200 px-6 py-3 rounded-xl border border-zinc-300 w-3/4 text-center text-zinc-800 font-bold">
                    Hidden: 256 (ReLU)
                  </div>
                  <div className="text-zinc-400">↓</div>
                  <div className="bg-zinc-200 px-6 py-3 rounded-xl border border-zinc-300 w-2/3 text-center text-zinc-800 font-bold">
                    Hidden: 128 (ReLU)
                  </div>
                  <div className="flex gap-4 w-full mt-2">
                    <div className="flex-1 bg-white border border-zinc-300 p-3 rounded-xl text-center shadow-sm">
                      <div className="font-bold text-zinc-800 mb-1">Actor</div>
                      <div className="text-xs text-zinc-600">14 Nodes (Softmax)</div>
                      <div className="text-[10px] text-zinc-500 mt-1">Action Probs</div>
                    </div>
                    <div className="flex-1 bg-white border border-zinc-300 p-3 rounded-xl text-center shadow-sm">
                      <div className="font-bold text-zinc-800 mb-1">Critic</div>
                      <div className="text-xs text-zinc-600">1 Node (Linear)</div>
                      <div className="text-[10px] text-zinc-500 mt-1">Value Estimate V(s)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MAPPO Architecture */}
              <div className="bg-zinc-800 p-8 rounded-3xl border border-zinc-700 shadow-xl">
                <h4 className="font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                  <Users className="w-5 h-5 text-zinc-300"/> Phase 2: MAPPO (CTDE)
                </h4>
                <div className="flex flex-col items-center gap-4 text-sm font-mono">
                  <div className="flex gap-4 w-full">
                    <div className="flex-1 bg-zinc-900 px-4 py-3 rounded-xl border border-zinc-600 text-center">
                      <div className="font-bold text-zinc-200">Local Obs (per AGV)</div>
                      <div className="text-xs text-zinc-400">25 Features</div>
                    </div>
                    <div className="flex-1 bg-zinc-900 px-4 py-3 rounded-xl border border-zinc-600 text-center opacity-80">
                      <div className="font-bold text-zinc-300">Global State</div>
                      <div className="text-xs text-zinc-400">153 Features</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 w-full text-zinc-500 justify-around">
                    <div>↓</div>
                    <div>↓</div>
                  </div>

                  <div className="flex gap-4 w-full">
                    <div className="flex-1 bg-zinc-700 border border-zinc-600 p-3 rounded-xl text-center">
                      <div className="font-bold text-zinc-100 mb-1">Shared Actor</div>
                      <div className="text-xs text-zinc-300">64 → 64 → Probs</div>
                      <div className="text-[10px] text-zinc-400 mt-1">Decentralized Execution</div>
                    </div>
                    <div className="flex-1 bg-zinc-700 border border-zinc-600 p-3 rounded-xl text-center">
                      <div className="font-bold text-zinc-100 mb-1">Central Critic</div>
                      <div className="text-xs text-zinc-300">256 → 128 → V(s)</div>
                      <div className="text-[10px] text-zinc-400 mt-1">Centralized Training</div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-zinc-400 mt-6 text-center italic">
                  CTDE paradigm: Centralized Training, Decentralized Execution. All 20 AGVs share ONE actor network.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pointer 15: Curriculum */}
      <div id="pointer-15" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <TrendingUp className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              15. Curriculum Learning Design
            </h2>
            
            <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-200 mb-8 overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="flex items-end h-40 gap-2 mb-4 border-b border-zinc-300 pb-2">
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
                        className={\`w-full rounded-t-lg transition-all duration-300 \${s.stage === 6 ? 'bg-zinc-800' : 'bg-zinc-300 hover:bg-zinc-400'}\`} 
                        style={{ height: \`\${s.val}%\` }}
                      ></div>
                      <div className="text-xs font-bold text-zinc-600 mt-2">Stage {s.stage}</div>
                      <div className="text-[10px] text-zinc-500 text-center leading-tight mt-1 h-8">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-4 rounded-xl text-sm text-zinc-700 font-medium border border-zinc-200">
                  <strong className="text-zinc-900">Advancement criterion:</strong> Advance when 100-episode rolling average reward improvement is &lt; 5% (adaptive plateau detection).
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pointer 17: Hyperparameters */}
      <div id="pointer-17" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <Settings2 className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              17. Hyperparameter Tuning
            </h2>
            
            <div className="bg-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-200 text-zinc-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Hyperparameter</th>
                    <th className="px-6 py-4 font-semibold">Search Range</th>
                    <th className="px-6 py-4 font-semibold">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  <tr>
                    <td className="px-6 py-4 font-medium text-zinc-900">Discount factor γ</td>
                    <td className="px-6 py-4"><span className="font-mono text-xs bg-white border border-zinc-300 px-2 py-1 rounded">[0.5, 0.7, 0.95]</span></td>
                    <td className="px-6 py-4 text-zinc-600">Crucial: Do not use 0.99 (Angeloudis 2010)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-zinc-900">Learning rate</td>
                    <td className="px-6 py-4"><span className="font-mono text-xs bg-white border border-zinc-300 px-2 py-1 rounded">[1e-4, 5e-4]</span></td>
                    <td className="px-6 py-4 text-zinc-600">Optuna Bayesian search</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-zinc-900">Clip range ε</td>
                    <td className="px-6 py-4"><span className="font-mono text-xs bg-white border border-zinc-300 px-2 py-1 rounded">[0.1, 0.3]</span></td>
                    <td className="px-6 py-4 text-zinc-600">PPO specific</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-zinc-900">Reward weights α, β</td>
                    <td className="px-6 py-4"><span className="font-mono text-xs bg-white border border-zinc-300 px-2 py-1 rounded">[0.05, 0.5]</span></td>
                    <td className="px-6 py-4 text-zinc-600">Empty travel vs Dual cycle bonus</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
`;

fs.writeFileSync('src/components/methodology/Phase6.tsx', phase6Content, 'utf8');

const phase7Content = `
'use client';
import { motion } from 'framer-motion';
import { BarChart3, LineChart, TestTube, Search, FileText, Users } from 'lucide-react';

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Phase7() {
  return (
    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="space-y-12 mt-12">
      <div id="phase-7" className="scroll-mt-28">
        <h2 className="text-3xl font-bold text-zinc-900 border-b-2 border-zinc-200 pb-2">Phase 7 — Evaluation</h2>
      </div>
      
      {/* Pointers 18 & 19 */}
      <div id="pointer-18" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <BarChart3 className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              18 & 19. Experiment Design & Protocol
            </h2>

            <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-200 mb-8">
              <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Main Degradation Study</h4>
              <div className="flex flex-wrap items-center gap-4 text-lg font-mono mb-4">
                <div className="bg-white border border-zinc-300 px-4 py-2 rounded-lg text-zinc-800 shadow-sm">7 Methods</div>
                <div className="text-zinc-400">×</div>
                <div className="bg-white border border-zinc-300 px-4 py-2 rounded-lg text-zinc-800 shadow-sm">4 Levels (σ=0-3)</div>
                <div className="text-zinc-400">×</div>
                <div className="bg-zinc-200 border border-zinc-300 px-4 py-2 rounded-lg text-zinc-900 font-bold shadow-sm">20 Seeds</div>
                <div className="text-zinc-400">=</div>
                <div className="bg-zinc-800 text-white px-4 py-2 rounded-lg font-bold shadow-sm">560 Runs</div>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Minimum 20 seeds per cell required by Agarwal et al. (2021). Primary metric is Total QC Idle Time. Degradation curves plot Intensity (x) against QC Idle Time (y).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pointer 20: Ablations */}
      <div id="pointer-20" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <TestTube className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              20. Ablation Study
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><Search className="w-4 h-4 text-zinc-600"/> State Space (A1)</h4>
                <ul className="text-sm text-zinc-700 space-y-2">
                  <li>• Remove "AGVs in-transit"</li>
                  <li>• Remove Crane cycle estimate</li>
                  <li>• Remove Spatial (x,y) coords</li>
                </ul>
              </div>
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><TestTube className="w-4 h-4 text-zinc-600"/> Reward Function (A2)</h4>
                <ul className="text-sm text-zinc-700 space-y-2">
                  <li>• β=0 (No dual cycle bonus)</li>
                  <li>• γ = 0.99 vs 0.95 vs 0.7</li>
                  <li>• <strong className="text-zinc-900">Crane cycle dist: Log-Normal vs Normal</strong></li>
                </ul>
              </div>
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><LineChart className="w-4 h-4 text-zinc-600"/> Curriculum (A3) & Action (A4)</h4>
                <ul className="text-sm text-zinc-700 space-y-2">
                  <li>• Direct training at σ=3 (no curriculum)</li>
                  <li>• Wait action removed</li>
                </ul>
              </div>
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-zinc-600"/> MAPPO Components (A5)</h4>
                <ul className="text-sm text-zinc-700 space-y-2">
                  <li>• Independent PPO (no central critic)</li>
                  <li>• MAPPO w/o parameter sharing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pointer 21: Stats */}
      <div id="pointer-21" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <FileText className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              21. Statistical Analysis
            </h2>
            
            <div className="bg-zinc-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <FileText className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-white mb-4">Deep RL at the Edge of the Statistical Precipice</h4>
                <p className="text-zinc-400 text-sm mb-6">Following Agarwal et al. (2021) using the <code>rliable</code> Python library:</p>
                
                <div className="space-y-4">
                  <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl">
                    <div className="font-bold text-white mb-1">Interquartile Mean (IQM)</div>
                    <div className="text-sm text-zinc-400">Mean of the middle 50% of runs. Robust to outlier seeds while using more data than median.</div>
                  </div>
                  <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl">
                    <div className="font-bold text-white mb-1">95% Stratified Bootstrap CIs</div>
                    <div className="text-sm text-zinc-400">10,000 bootstrap iterations. Non-overlapping CIs → statistically significant difference at p &lt; 0.05.</div>
                  </div>
                  <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl">
                    <div className="font-bold text-white mb-1">Performance Profiles</div>
                    <div className="text-sm text-zinc-400">Fraction of (method, seed) pairs where score ≥ threshold τ.</div>
                  </div>
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

fs.writeFileSync('src/components/methodology/Phase7.tsx', phase7Content, 'utf8');
