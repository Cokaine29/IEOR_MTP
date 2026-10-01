'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowRight, 
  HelpCircle, 
  Cpu, 
  Clock, 
  CloudLightning,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Target
} from 'lucide-react';

/* --- Animation variants --- */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export default function ProblemPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-24">
      
      {/* SECTION 1: Hero / Hook */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-zinc-50 border-b border-zinc-200">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-sm font-bold tracking-widest uppercase mb-8 border border-rose-200">
              <AlertCircle className="w-4 h-4" /> The Bottleneck
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 mb-8 leading-[1.1]">
              Automated terminals are fast.<br />
              <span className="text-indigo-600">Until things go wrong.</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-xl text-zinc-600 font-medium leading-relaxed max-w-3xl mx-auto">
              Millions of dollars have been spent electrifying and automating port hardware. Yet, the algorithms managing Automated Guided Vehicles (AGVs) remain rigidly stuck in the past—unable to adapt when the real world inevitably deviates from the plan.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-6 space-y-32 pt-20">
        
        {/* SECTION 2: The Scale of the Problem */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight text-zinc-900 mb-8">
            The Scale of the Problem
          </motion.h2>
          
          <div className="prose prose-lg prose-zinc max-w-none text-zinc-700 font-medium text-justify">
            <motion.p variants={fadeUp}>
              Yangshan Phase IV (Shanghai) combines a 2,350 m continuous quay and seven berths with a design throughput of 6.3 million TEU, but on a deliberately narrow landside depth, which its designers identify as the binding constraint on capacity (Liu et al., 2016).
            </motion.p>
            <motion.p variants={fadeUp}>
              Horizontal transport is therefore compressed into a 167.5 m seaside cross-section running from the waterline to the yard-block ends: a 28 m loading zone, a 27 m buffer zone in which AGVs are sequenced, and a 26.5 m bidirectional driving zone, followed by a yard-front transfer area (Liu et al., 2016). A fleet on the order of 130 lift-AGVs serves 26 double-trolley quay cranes and 61 yard blocks within this space. Dispatching here is not routing on an abstract graph: decisions are coupled through shared lanes, strictly ordered functional zones and finite sequencing capacity, so a single poorly timed assignment propagates as congestion across the apron.
            </motion.p>
          </div>
        </motion.section>

        {/* SECTION 3: The New Stochastic Complexities */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight text-zinc-900 mb-8">
            The New Stochastic Complexities
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="text-xl font-bold text-zinc-900 mb-4">Heterogeneous Yard Interfaces</h3>
              <p className="text-zinc-600 font-medium leading-relaxed text-justify">
                Liu et al. (2016) describe an interleaved arrangement of non-cantilever and single-cantilever ARMG blocks, in which horizontal transport equipment does not enter the block and, in single-cantilever blocks, both ARMGs can serve the seaside. In our model, an end-loading block exchanges containers at a fixed seaside I/O point, so the AGV leg depends only on the block. In a side-loading block, the transfer point lies along the side lane, adjacent to the target bay. The same dispatch decision therefore has completely different distance, waiting, and handoff distributions by block type, and ARMG positions become a hidden, stochastic part of the state.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="text-xl font-bold text-zinc-900 mb-4">Buffer Sequencing</h3>
              <p className="text-zinc-600 font-medium leading-relaxed text-justify">
                After handoff in the loading zone, AGVs cross into the buffer zone to be sequenced before release into driving lanes. This adds a queueing stage between QC handoff and yard travel whose release order determines downstream arrivals at blocks. Under QC cycle-time variability and AGV breakdowns, the best release order changes online. Common dispatching rules assess each assignment myopically and do not anticipate this effect; whether a learned policy exploits it better is an empirical question this thesis tests.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* SECTION 4: Four Pillars of Stochasticity */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={fadeUp} className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">The Four Disruptors</h2>
            <p className="text-lg text-zinc-600 font-medium">Real-world variables that destroy classical optimisation plans.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">QC Processing Time Variability</h3>
              <p className="text-zinc-600 font-medium leading-relaxed">
                Quay cranes do not operate on fixed cycles. Constant micro-fluctuations in load/discharge times destroy rigid AGV schedules.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mb-6 text-rose-600">
                <CloudLightning className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">AGV Breakdowns</h3>
              <p className="text-zinc-600 font-medium leading-relaxed">
                When an AGV suffers a sudden fault, it removes capacity and creates an unexpected physical obstacle in the routing graph.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 text-amber-600">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Dynamic Vessel Arrivals</h3>
              <p className="text-zinc-600 font-medium leading-relaxed">
                Weather and tides mean vessels rarely arrive exactly on schedule. The TOS must dynamically reallocate AGV fleets on the fly.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Traffic Congestion</h3>
              <p className="text-zinc-600 font-medium leading-relaxed">
                As throughput density increases, shortest-path routing algorithms fail when the physical space is saturated, leading to deadlocks.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* SECTION 5: The Gap in the Literature */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight text-zinc-900 mb-8">
            The Literature Gap
          </motion.h2>
          
          <motion.div variants={fadeUp} className="bg-white rounded-3xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 text-zinc-600 text-sm">
                  <tr>
                    <th className="px-6 py-4 font-semibold border-b border-zinc-200">Approach</th>
                    <th className="px-6 py-4 font-semibold border-b border-zinc-200">Handles Stochasticity?</th>
                    <th className="px-6 py-4 font-semibold border-b border-zinc-200 text-center">Real-Time (ms)</th>
                    <th className="px-6 py-4 font-semibold border-b border-zinc-200 text-center">Scales to 100+ AGVs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm">
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-zinc-900 font-bold">MILP Optimisation</td>
                    <td className="px-6 py-4 text-red-600 font-bold flex items-center gap-2"><XCircle className="w-4 h-4"/> No (Deterministic)</td>
                    <td className="px-6 py-4 text-center text-red-600"><XCircle className="w-5 h-5 mx-auto"/></td>
                    <td className="px-6 py-4 text-center text-red-600"><XCircle className="w-5 h-5 mx-auto"/></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-zinc-900 font-bold">Classical Heuristics <span className="font-normal text-zinc-500 text-sm block">(Greedy, Look-Ahead)</span></td>
                    <td className="px-6 py-4 text-amber-600 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Reactive, but myopic</td>
                    <td className="px-6 py-4 text-center text-emerald-600"><CheckCircle2 className="w-5 h-5 mx-auto"/></td>
                    <td className="px-6 py-4 text-center text-emerald-600"><CheckCircle2 className="w-5 h-5 mx-auto"/></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-zinc-900 font-bold">Meta-Heuristics <span className="font-normal text-zinc-500 text-sm block">(Genetic Algorithms, PSO)</span></td>
                    <td className="px-6 py-4 text-amber-600 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Requires frequent re-planning</td>
                    <td className="px-6 py-4 text-center text-red-600"><XCircle className="w-5 h-5 mx-auto"/></td>
                    <td className="px-6 py-4 text-center text-red-600"><XCircle className="w-5 h-5 mx-auto"/></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-zinc-900 font-bold">Single-Agent DQN <span className="font-normal text-zinc-500 text-sm block">(Zheng 2022)</span></td>
                    <td className="px-6 py-4 text-amber-600 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Task generation only</td>
                    <td className="px-6 py-4 text-center text-emerald-600"><CheckCircle2 className="w-5 h-5 mx-auto"/></td>
                    <td className="px-6 py-4 text-center text-red-600"><XCircle className="w-5 h-5 mx-auto"/></td>
                  </tr>
                  <tr className="bg-indigo-50/50 border-t-2 border-indigo-200">
                    <td className="px-6 py-4 text-indigo-900 font-bold">PPO + MAPPO <span className="font-normal text-indigo-600 text-sm block">(This Thesis)</span></td>
                    <td className="px-6 py-4 text-indigo-700 font-bold flex items-center gap-2"><AlertCircle className="w-4 h-4 text-indigo-600"/> Hypothesised robustness</td>
                    <td className="px-6 py-4 text-center text-indigo-600"><CheckCircle2 className="w-5 h-5 mx-auto"/></td>
                    <td className="px-6 py-4 text-center text-indigo-600"><CheckCircle2 className="w-5 h-5 mx-auto"/></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-zinc-50 border-t border-zinc-200 text-sm text-zinc-700 font-medium leading-relaxed">
              To our knowledge, of the 56 papers reviewed by Carlo et al. (2014), almost none combine AGV dispatching with stochastic optimisation. Existing methods generally handle stochasticity in isolation. This thesis hypothesises that simultaneous multi-source disruptions can be addressed using a learned, real-time adaptive policy in a port-calibrated simulation.
            </div>
          </motion.div>
        </motion.section>

        {/* SECTION 6: The Research Question */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={fadeUp} className="bg-gradient-to-br from-indigo-900 to-zinc-900 text-white p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden border border-indigo-700/50">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <HelpCircle className="w-48 h-48" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-bold tracking-widest uppercase mb-6 border border-indigo-500/30">
                <Target className="w-4 h-4" /> Research Question
              </div>
              
              <p className="text-xl md:text-2xl font-medium leading-relaxed mb-4 text-justify">
                Under simultaneous stochastic disruptions (QC processing-time variability, AGV breakdowns, dynamic vessel arrivals and traffic congestion), in a Yangshan Phase IV-calibrated terminal with mixed end- and side-loading yard blocks and strict functional-zone sequencing, do deep reinforcement learning agents (DQN, PPO, MAPPO) outperform classical baselines (Greedy, Look-Ahead, Inventory-Based, GA), and <span className="text-amber-400 font-bold border-b-2 border-amber-400/50 pb-1">at what disruption intensity does the performance gap become statistically significant?</span>
              </p>
              <p className="text-lg md:text-xl font-medium leading-relaxed text-indigo-200 mt-6 pt-6 border-t border-indigo-700/50">
                <span className="text-white font-bold">Secondary Question:</span> Does the performance gap differ between end-loading and side-loading blocks?
              </p>
            </div>
          </motion.div>
          
          <motion.div variants={fadeUp} className="mt-8 bg-white p-6 rounded-3xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-lg font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">Two-Layer Comparison Structure</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 text-zinc-600 text-sm">
                  <tr>
                    <th className="px-4 py-3 font-semibold border-b border-zinc-200 w-24">Layer</th>
                    <th className="px-4 py-3 font-semibold border-b border-zinc-200">Methods Being Compared</th>
                    <th className="px-4 py-3 font-semibold border-b border-zinc-200">What It Tells Us</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm">
                  <tr>
                    <td className="px-4 py-4 font-bold text-zinc-900">Layer 1</td>
                    <td className="px-4 py-4 font-medium text-zinc-800">DRL (DQN, PPO, MAPPO) <span className="text-zinc-400 mx-1">vs</span> Classical (Greedy, Look-Ahead, Inventory-Based, GA)</td>
                    <td className="px-4 py-4 text-zinc-600">Does learning-based dispatching beat rule/optimisation-based dispatching under stochasticity?</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 font-bold text-zinc-900">Layer 2</td>
                    <td className="px-4 py-4 font-medium text-zinc-800">PPO <span className="text-zinc-400 mx-1">vs</span> DQN <span className="text-zinc-300 mx-2">?</span> MAPPO <span className="text-zinc-400 mx-1">vs</span> PPO</td>
                    <td className="px-4 py-4 text-zinc-600">Does each generation of DRL genuinely improve on the last?</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
          

        </motion.section>

        {/* SECTION 7: Bridge to Methodology */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center pb-20 border-t border-zinc-200 pt-20">
          <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight text-zinc-900 mb-8">
            Our Approach
          </motion.h2>
          
          <motion.div variants={fadeUp} className="max-w-3xl mx-auto text-lg text-zinc-700 font-medium leading-relaxed mb-10 text-left space-y-4 bg-white p-8 rounded-3xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-justify">
            <p>To answer this question, we:</p>
            <ol className="list-decimal pl-6 space-y-3 text-justify">
              <li><strong className="text-zinc-900">Formulate</strong> the dispatching problem as a Markov Decision Process (MDP) with a formally defined state space, action space, and reward function.</li>
              <li><strong className="text-zinc-900">Build</strong> a Python/Gymnasium simulation calibrated to Yangshan Phase IV: a 2,350 m quay, 26 QCs, 130 AGVs, 61 yard blocks (41 end-loading, 20 side-loading) and the 167.5 m seaside zone structure of Liu et al. (2016). Where published values are unavailable (lane geometry inside zones, bay pitch, cantilever reach, block sequence), assumptions are tagged explicitly and varied in sensitivity analysis.</li>
              <li><strong className="text-zinc-900">Implement</strong> five baselines: Greedy (Egbelu 1984), Look-Ahead (Kim & Bae 2004), Inventory-Based (Briskorn et al. 2006), Genetic Algorithm (Grunow et al. 2006), and Single-Agent DQN (Zheng et al. 2022).</li>
              <li><strong className="text-zinc-900">Train</strong> a PPO agent (Phase 1) and extend to MAPPO (Phase 2).</li>
              <li><strong className="text-zinc-900">Evaluate</strong> using rigorous multi-seed statistical protocols based on Agarwal et al. (2021), Interquartile Mean, and 95% stratified bootstrap confidence intervals.</li>
            </ol>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Link 
              href="/methodology" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-indigo-600/30"
            >
              See the Methodology <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.section>

      </div>
    </div>
  );
}
