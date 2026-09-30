
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
        <h2 className="text-3xl font-bold text-zinc-900 border-b-2 border-zinc-200 pb-2">Phase 4: Simulation Validation</h2>
      </div>
      
      {/* Pointer 10 */}
      <div id="pointer-10" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <CheckSquare className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              Sanity Checks & Seeding
            </h2>

            <div className="bg-zinc-100 rounded-2xl p-6 mb-6">
              <h4 className="font-bold text-zinc-900 mb-3 flex items-center gap-2">Validation Benchmark</h4>
              <p className="text-sm text-zinc-700 leading-relaxed text-justify mb-4">
                Because this methodology integrates parameters from multiple ports, we will validate the Python environment against a <strong>Theoretical Lower Bound</strong> of <strong>~8.57 hours</strong> (the minimum time it takes 5 QCs to clear 1,800 lifts at 42 moves/hour in a perfect, traffic-free scenario).
              </p>
              
              <div className="bg-white p-4 rounded-xl border border-zinc-200">
                <h5 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">Why is this validation strictly required?</h5>
                <ul className="text-sm text-zinc-600 space-y-3">
                  <li className="flex gap-2 items-start">
                    <span className="text-indigo-500 font-bold">1.</span> 
                    <span className="text-justify"><strong>Bug Isolation:</strong> Before we introduce complex AI, we must prove the Python physics engine (speeds, distances) works. If an RL agent performs poorly later, we will definitively know it's an AI policy issue, not a broken physics simulator.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-indigo-500 font-bold">2.</span> 
                    <span className="text-justify"><strong>Proving the Fleet Ratio:</strong> Hitting the 8.57h baseline mathematically proves that 25 AGVs (5 per crane) is enough. It proves that in a perfect scenario, AGV travel time to the yard is successfully "absorbed" by the buffer queue, meaning the Quay Crane never has to wait.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
              <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Baseline Physical Sanity Checks (σ=0)</h4>
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
                        <td className="px-4 py-3 text-zinc-900 font-semibold">Converges to ~8.57 hrs</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-zinc-800">Quay Crane idle rate</td>
                        <td className="px-4 py-3 text-zinc-900 font-semibold">Approaches 0%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-zinc-800">Throughput saturation</td>
                        <td className="px-4 py-3 text-zinc-900 font-semibold">Flattens at 25 AGVs (5:1 ratio)</td>
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
        <h2 className="text-3xl font-bold text-zinc-900 border-b-2 border-zinc-200 pb-2">Phase 5: Classical Baselines</h2>
      </div>
      
      {/* Pointers 11 & 12 */}
      <div id="pointer-11" className="relative"><div id="pointer-12" className="absolute top-1/2" /></div>
<div className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <ListChecks className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              Implementation & Verification
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Greedy */}
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 bg-zinc-200 px-2 py-1 rounded-bl-lg text-xs font-bold text-zinc-600">Egbelu 1984</div>
                <h4 className="font-bold text-zinc-900 mb-2">Greedy (Max Queue)</h4>
                <p className="text-sm text-zinc-600 mb-4 flex-grow">Assigns the AGV to the QC with the most waiting containers.</p>
                <div className="mt-auto flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-md w-fit border border-indigo-100">
                  <CheckCircle2 className="w-4 h-4"/> Category: Heuristic
                </div>
              </div>

              {/* Look-Ahead */}
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 bg-zinc-200 px-2 py-1 rounded-bl-lg text-xs font-bold text-zinc-600">Kim 2004</div>
                <h4 className="font-bold text-zinc-900 mb-2">Look-Ahead (LADP)</h4>
                <p className="text-sm text-zinc-600 mb-4 flex-grow">Evaluates future states by planning 2 jobs ahead per AGV.</p>
                <div className="mt-auto flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-md w-fit border border-indigo-100">
                  <CheckCircle2 className="w-4 h-4"/> Category: Heuristic
                </div>
              </div>

              {/* Inventory-Based */}
              <div className="bg-white p-6 rounded-2xl border-2 border-zinc-400 shadow-sm relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 bg-zinc-700 text-white px-2 py-1 rounded-bl-lg text-xs font-bold">Briskorn 2006</div>
                <h4 className="font-bold text-zinc-900 mb-2">Inventory-Based</h4>
                <p className="text-sm text-zinc-600 mb-4 flex-grow">Assigns to QC with lowest in-transit AGVs. Strongest classical baseline.</p>
                <div className="mt-auto flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-md w-fit border border-indigo-100">
                  <CheckCircle2 className="w-4 h-4"/> Category: Heuristic
                </div>
              </div>

              {/* Genetic Algorithm */}
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 bg-zinc-200 px-2 py-1 rounded-bl-lg text-xs font-bold text-zinc-600">Grunow 2006</div>
                <h4 className="font-bold text-zinc-900 mb-2">Genetic Algorithm</h4>
                <p className="text-sm text-zinc-600 mb-4 flex-grow">Offline schedule generation (DEAP). Periodically re-optimized during simulation.</p>
                <div className="mt-auto flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md w-fit border border-amber-100">
                  <CheckCircle2 className="w-4 h-4"/> Category: Meta-Heuristic
                </div>
              </div>

              {/* Q-Learning */}
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 bg-zinc-200 px-2 py-1 rounded-bl-lg text-xs font-bold text-zinc-600">Choe 2016</div>
                <h4 className="font-bold text-zinc-900 mb-2">Q-Learning</h4>
                <p className="text-sm text-zinc-600 mb-4 flex-grow">Simple discretized state space. Included to demonstrate state space explosion.</p>
                <div className="mt-auto flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md w-fit border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4"/> Category: Tabular RL
                </div>
              </div>

              {/* DQN */}
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 bg-zinc-200 px-2 py-1 rounded-bl-lg text-xs font-bold text-zinc-600">Zheng 2022</div>
                <h4 className="font-bold text-zinc-900 mb-2">DQN (Single-Agent)</h4>
                <p className="text-sm text-zinc-600 mb-4 flex-grow">Neural network baseline utilizing the full 203-feature state space.</p>
                <div className="mt-auto flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md w-fit border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4"/> Category: Deep RL
                </div>
              </div>
            </div>

            <div className="bg-zinc-100 p-6 rounded-2xl border border-zinc-200">
              <h4 className="font-bold text-zinc-900 mb-3">Deterministic Ordering Check (σ=0)</h4>
              <code className="bg-white px-4 py-3 rounded-lg border border-zinc-300 text-sm font-bold text-zinc-800 block text-center shadow-sm">
                GA (Global Opt) ≥ PPO / DQN ≥ Look-Ahead &gt; Inventory-Based &gt; Greedy
              </code>
              <p className="text-sm text-zinc-600 mt-3 text-justify leading-relaxed">
                <strong>Why this matters:</strong> In a perfectly deterministic environment, this hierarchy is mathematically expected based on existing literature. The GA searches the entire global solution space, so it must theoretically tie or beat all other methods. Properly trained Deep RL agents should approach the GA's optimal performance, while easily outperforming myopic heuristics. <em>(Note: Tabular Q-Learning is excluded from this chain as it fails to converge in this domain).</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    </>
  );
}
