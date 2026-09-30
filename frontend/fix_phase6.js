const fs = require('fs');

const content = `'use client';
import { motion } from 'framer-motion';
import { Network, TrendingUp, Cpu, Settings2, Users, ArrowDown, ChevronRight } from 'lucide-react';

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Phase6() {
  return (
    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="space-y-12 mt-12">
      <div id="phase-6" className="scroll-mt-28">
        <h2 className="text-3xl font-bold text-zinc-900 border-b-2 border-zinc-200 pb-2">Phase 6: DRL Implementation</h2>
      </div>
      
      {/* Pointer 13 & 16 */}
      <div id="pointer-13" className="relative"><div id="pointer-14" className="absolute top-1/3" /><div id="pointer-16" className="absolute top-2/3" /></div>
      <div className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <Network className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              Staged DRL Architecture
            </h2>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* PPO Architecture */}
              <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-200 shadow-sm flex flex-col h-full">
                <div className="mb-8">
                  <h4 className="font-bold text-zinc-900 mb-2 text-center text-lg">Stage 1: Centralized PPO</h4>
                  <p className="text-[11px] text-zinc-500 text-center uppercase tracking-wider font-semibold">Current Phase (Baseline)</p>
                </div>
                
                <div className="flex flex-col items-center flex-grow font-mono">
                  <div className="bg-white px-6 py-4 rounded-xl border border-zinc-300 shadow-sm w-full max-w-[280px] text-center">
                    <div className="font-bold text-zinc-800 text-sm mb-1">Global State Input</div>
                    <div className="text-[11px] text-zinc-500">203 Features</div>
                  </div>
                  
                  <div className="h-8 flex justify-center items-center">
                    <ArrowDown className="w-4 h-4 text-zinc-400" />
                  </div>
                  
                  <div className="bg-zinc-200 px-6 py-3 rounded-xl border border-zinc-300 w-full max-w-[220px] text-center text-zinc-800 font-bold text-sm">
                    Shared Hidden: 256
                  </div>
                  
                  <div className="h-8 flex justify-center items-center w-full max-w-[280px] relative">
                    <div className="absolute top-1/2 left-1/4 right-1/4 h-[2px] bg-zinc-300 -translate-y-1/2"></div>
                    <div className="absolute left-1/4 -bottom-1"><ArrowDown className="w-4 h-4 text-zinc-400" /></div>
                    <div className="absolute right-1/4 -bottom-1"><ArrowDown className="w-4 h-4 text-zinc-400" /></div>
                  </div>
                  
                  <div className="flex gap-4 w-full max-w-[320px]">
                    <div className="flex-1 bg-white border border-zinc-300 p-4 rounded-xl text-center shadow-sm flex flex-col justify-center h-20">
                      <div className="font-bold text-zinc-800 text-sm mb-1">Actor Output</div>
                      <div className="text-[10px] text-zinc-500 leading-tight">14 Nodes (Softmax)</div>
                    </div>
                    <div className="flex-1 bg-white border border-zinc-300 p-4 rounded-xl text-center shadow-sm flex flex-col justify-center h-20">
                      <div className="font-bold text-zinc-800 text-sm mb-1">Critic Output</div>
                      <div className="text-[10px] text-zinc-500 leading-tight">1 Node V(s)</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-4 border-t border-zinc-200">
                  <p className="text-xs text-zinc-500 text-center leading-relaxed">
                    A single dispatcher agent controls all AGVs using the global MDP state.
                  </p>
                </div>
              </div>

              {/* MAPPO Architecture */}
              <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-xl flex flex-col h-full">
                <div className="mb-8">
                  <h4 className="font-bold text-white mb-2 text-center text-lg flex items-center justify-center gap-2">
                    <Users className="w-5 h-5 text-indigo-400"/> Stage 2: MAPPO (CTDE)
                  </h4>
                  <p className="text-[11px] text-indigo-400 text-center uppercase tracking-wider font-semibold">Future Research Roadmap</p>
                </div>
                
                <div className="flex flex-col items-center flex-grow font-mono">
                  <div className="flex gap-4 w-full max-w-[320px]">
                    <div className="flex-1 bg-zinc-800 px-4 py-4 rounded-xl border border-zinc-700 text-center">
                      <div className="font-bold text-zinc-200 text-sm mb-1">Local Obs</div>
                      <div className="text-[11px] text-zinc-400">per AGV</div>
                    </div>
                    <div className="flex-1 bg-zinc-800 px-4 py-4 rounded-xl border border-zinc-700 text-center opacity-80">
                      <div className="font-bold text-zinc-300 text-sm mb-1">Global State</div>
                      <div className="text-[11px] text-zinc-500">203 Features</div>
                    </div>
                  </div>
                  
                  <div className="h-8 flex justify-between items-center w-full max-w-[320px] px-12 relative">
                    <ArrowDown className="w-4 h-4 text-zinc-600" />
                    <ArrowDown className="w-4 h-4 text-zinc-600" />
                  </div>

                  <div className="flex gap-4 w-full max-w-[320px]">
                    <div className="flex-1 bg-zinc-800 border border-zinc-700 p-4 rounded-xl text-center shadow-sm flex flex-col justify-center h-20">
                      <div className="font-bold text-white text-sm mb-1">Shared Actor</div>
                      <div className="text-[10px] text-zinc-400 leading-tight">Decentralized Exec</div>
                    </div>
                    <div className="flex-1 bg-zinc-800 border border-zinc-700 p-4 rounded-xl text-center shadow-sm flex flex-col justify-center h-20 opacity-80">
                      <div className="font-bold text-zinc-200 text-sm mb-1">Central Critic</div>
                      <div className="text-[10px] text-zinc-500 leading-tight">Centralized Train</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-4 border-t border-zinc-800">
                  <p className="text-xs text-zinc-400 text-center leading-relaxed italic">
                    To scale beyond 25 AGVs, we will transition to Multi-Agent PPO (CTDE). Each AGV becomes an independent actor.
                  </p>
                </div>
              </div>
            </div>

            {/* Definitions Dictionary */}
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm mt-8">
              <h3 className="text-lg font-bold text-zinc-900 mb-6 border-b border-zinc-100 pb-2 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-zinc-400" /> Architecture Components & Data Flow
              </h3>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <h5 className="font-bold text-zinc-900 text-sm mb-1 flex items-center gap-2">1. Global State Input</h5>
                  <p className="text-sm text-zinc-600 text-justify leading-relaxed">
                    A 203-dimensional vector capturing the exact real-time physics of the terminal, including every AGV\\'s coordinates, battery levels, and QC wait times.
                  </p>
                </div>
                <div>
                  <h5 className="font-bold text-zinc-900 text-sm mb-1 flex items-center gap-2">2. Shared Hidden Layer</h5>
                  <p className="text-sm text-zinc-600 text-justify leading-relaxed">
                    A 256-node dense neural layer (using ReLU activation). It acts as a feature extractor, processing the raw 203 inputs to find complex patterns (like traffic bottlenecks) before splitting the signal.
                  </p>
                </div>
                <div>
                  <h5 className="font-bold text-zinc-900 text-sm mb-1 flex items-center gap-2">3. Actor (Policy Network)</h5>
                  <p className="text-sm text-zinc-600 text-justify leading-relaxed">
                    The network head that decides <em>what to do</em>. It takes the hidden features and uses a Softmax activation to output a 14-dimensional probability distribution across all possible QC/YB assignments.
                  </p>
                </div>
                <div>
                  <h5 className="font-bold text-zinc-900 text-sm mb-1 flex items-center gap-2">4. Critic (Value Network)</h5>
                  <p className="text-sm text-zinc-600 text-justify leading-relaxed">
                    The network head that evaluates <em>how good</em> a state is. It outputs a single scalar value <code className="text-xs bg-zinc-100 px-1 rounded">V(s)</code> used to calculate mathematical advantages and guide the Actor during training.
                  </p>
                </div>
                
                <div className="md:col-span-2 mt-4 pt-6 border-t border-zinc-100">
                  <h5 className="font-bold text-zinc-900 text-sm mb-2 flex items-center gap-2">The Forward Pass (How the data flows)</h5>
                  <p className="text-sm text-zinc-600 text-justify leading-relaxed">
                    At the exact millisecond an AGV becomes idle, the simulator pauses and constructs the <strong>Global State</strong>. This 203-feature vector is fed into the <strong>Shared Hidden Layer</strong>, which extracts spatial and temporal features. This compressed representation is then fed simultaneously into both heads. During inference, the <strong>Actor</strong> outputs the final routing decision, while the <strong>Critic</strong> is only used during training to update the weights based on the actual reward received.
                  </p>
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
              Curriculum Learning Design
            </h2>
            
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden mb-8">
              <div className="p-6 bg-zinc-900 text-white">
                <h3 className="font-bold text-lg mb-2">Sequential Training Pipeline</h3>
                <p className="text-sm text-zinc-400">
                  The RL agent is trained sequentially through 7 stages. We start in a deterministic world and gradually compound the physical noise, preventing the neural network from collapsing under immediate stochastic chaos.
                </p>
              </div>
              
              <div className="p-8 bg-zinc-50">
                <div className="flex flex-wrap justify-center items-center gap-y-4 gap-x-2 lg:gap-x-3">
                  {[
                    { stage: 0, label: 'Deterministic', desc: 'No noise (σ=0)', color: 'bg-zinc-100 text-zinc-600 border-zinc-200' },
                    { stage: 1, label: '+ Crane Variance', desc: 'Log-Normal (σ=1)', color: 'bg-zinc-200 text-zinc-700 border-zinc-300' },
                    { stage: 2, label: '+ Travel Noise', desc: 'Traffic (σ=1)', color: 'bg-zinc-300 text-zinc-800 border-zinc-400' },
                    { stage: 3, label: '+ Vessel Delay', desc: 'Skew (σ=1)', color: 'bg-zinc-400 text-zinc-900 border-zinc-500' },
                    { stage: 4, label: 'All Disruptions', desc: 'Intensity (σ=1)', color: 'bg-zinc-600 text-white border-zinc-700' },
                    { stage: 5, label: 'All Disruptions', desc: 'Intensity (σ=2)', color: 'bg-zinc-800 text-zinc-100 border-zinc-900' },
                    { stage: 6, label: 'Maximum Chaos', desc: 'Intensity (σ=3)', color: 'bg-black text-white border-black ring-2 ring-indigo-500 ring-offset-2' },
                  ].map((s, i) => (
                    <div key={s.stage} className="flex items-center gap-2 lg:gap-3">
                      <div className={\`flex flex-col justify-center items-center text-center p-3 rounded-2xl border \${s.color} w-[115px] h-[90px] shadow-sm transition-transform hover:-translate-y-1\`}>
                        <div className="text-[10px] uppercase tracking-widest font-bold opacity-70 mb-1">Stage {s.stage}</div>
                        <div className="text-[11px] font-bold leading-tight mb-1">{s.label}</div>
                        <div className="text-[9px] opacity-80">{s.desc}</div>
                      </div>
                      {i < 6 && (
                        <div className="text-zinc-300 shrink-0">
                          <ChevronRight className="w-5 h-5 hidden sm:block" />
                          <ArrowDown className="w-5 h-5 sm:hidden" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-indigo-50 border-t border-indigo-100 p-5 text-sm text-indigo-900 flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-indigo-950 mb-1">Adaptive Advancement Criterion</strong>
                  The environment automatically advances to the next sequential stage when the agent\\'s 100-episode rolling average reward improvement drops below 5% (plateau detection).
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
              Hyperparameter Tuning
            </h2>
            
            <div className="bg-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-200 text-zinc-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold w-1/4">Hyperparameter</th>
                    <th className="px-6 py-4 font-semibold w-1/4">Search Range</th>
                    <th className="px-6 py-4 font-semibold w-1/2">Intuition / Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  <tr className="hover:bg-white transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">Discount factor (γ)</td>
                    <td className="px-6 py-4"><span className="font-mono text-xs bg-white border border-zinc-300 px-2 py-1 rounded shadow-sm">[0.5, 0.7, 0.95]</span></td>
                    <td className="px-6 py-4 text-zinc-600 leading-relaxed text-justify">
                      <strong className="block text-zinc-800 mb-1">Myopic vs. Long-term Horizon</strong>
                      Unlike standard RL, a high γ (0.99) fails in stochastic logistics. The agent over-optimizes for an unpredictable future. Lowering γ forces the agent to focus on clearing immediate terminal traffic.
                    </td>
                  </tr>
                  <tr className="hover:bg-white transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">Learning rate</td>
                    <td className="px-6 py-4"><span className="font-mono text-xs bg-white border border-zinc-300 px-2 py-1 rounded shadow-sm">[1e-4, 5e-4]</span></td>
                    <td className="px-6 py-4 text-zinc-600 leading-relaxed text-justify">
                      <strong className="block text-zinc-800 mb-1">Step Size of Adaptation</strong>
                      Controls how aggressively the neural network updates its beliefs. If too high, the policy forgets past knowledge; if too low, it fails to converge within the computation budget. (Tuned via Optuna).
                    </td>
                  </tr>
                  <tr className="hover:bg-white transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">Clip range (ε)</td>
                    <td className="px-6 py-4"><span className="font-mono text-xs bg-white border border-zinc-300 px-2 py-1 rounded shadow-sm">[0.1, 0.3]</span></td>
                    <td className="px-6 py-4 text-zinc-600 leading-relaxed text-justify">
                      <strong className="block text-zinc-800 mb-1">Preventing Catastrophic Forgetting</strong>
                      The core mathematical guardrail of PPO. It restricts the neural network from making drastically large changes to its policy in a single training step, ensuring safe, monotonic learning.
                    </td>
                  </tr>
                  <tr className="hover:bg-white transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">Reward weights (α, β)</td>
                    <td className="px-6 py-4"><span className="font-mono text-xs bg-white border border-zinc-300 px-2 py-1 rounded shadow-sm">[0.05, 0.5]</span></td>
                    <td className="px-6 py-4 text-zinc-600 leading-relaxed text-justify">
                      <strong className="block text-zinc-800 mb-1">Balancing Competing Objectives</strong>
                      These coefficients balance physical tradeoffs. Alpha (α) penalizes empty driving to save battery, while Beta (β) rewards complex dual-cycles. Tuning these finds the perfect operational equilibrium.
                    </td>
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
\`;

fs.writeFileSync('d:/MTP/frontend/src/components/methodology/Phase6.tsx', content);
