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
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export default function ProblemPage() {
  return (
    <div className="relative bg-zinc-50 min-h-screen pb-32">
      {/* SECTION 1: Hook */}
      <section className="pt-40 pb-20 px-4 bg-zinc-900 text-white selection:bg-cyan-500/30 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" as const }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight text-center"
          >
            "How do you dispatch a dense fleet of Automated Guided Vehicles (AGVs) across a multi-billion dollar terminal sector, in real time, when crane speeds vary, traffic congestion is unpredictable, and <span className="text-amber-400">every second of Quay Crane idle time costs money?</span>"
          </motion.h1>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 mt-20 space-y-32">
        {/* SECTION 1.5: The Architecture / Scope */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={fadeUp} className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">The Scope: Dispatching vs Routing</h2>
            <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
            <p className="text-zinc-600 mt-4 max-w-2xl mx-auto font-medium text-lg">
              We operate exclusively at the assignment layer, abstracting lower-level physical routing to the simulation environment.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-12 gap-8 items-start">
            {/* The Hierarchy Visual */}
            <motion.div variants={fadeUp} className="md:col-span-5 space-y-4">
              <div className="bg-indigo-600 text-white p-5 rounded-2xl shadow-lg border-2 border-indigo-400 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Target className="w-20 h-20"/></div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Level 1</span>
                  <span className="font-bold text-lg">Dispatching (Assignment)</span>
                </div>
                <p className="text-indigo-100 text-sm mb-3">Where should each free AGV go next: which quay crane, which yard block, or hold?</p>
                <div className="bg-indigo-800/50 rounded-lg px-3 py-2 text-sm font-semibold flex justify-between items-center border border-indigo-500/30">
                  <span>Who solves it?</span>
                  <span className="text-amber-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Our DRL Agent</span>
                </div>
              </div>

              <div className="bg-zinc-100 p-5 rounded-2xl border border-zinc-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-zinc-200 text-zinc-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Level 2</span>
                  <span className="font-bold text-zinc-800 text-lg">Routing (Path Planning)</span>
                </div>
                <p className="text-zinc-600 text-sm mb-3">Which specific lanes should the AGV take?</p>
                <div className="bg-white rounded-lg px-3 py-2 text-sm font-semibold flex justify-between items-center border border-zinc-200 text-zinc-500">
                  <span>Who solves it?</span>
                  <span className="flex items-center gap-1"><XCircle className="w-4 h-4"/> Manufacturer Software</span>
                </div>
              </div>

              <div className="bg-zinc-100 p-5 rounded-2xl border border-zinc-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-zinc-200 text-zinc-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Level 3</span>
                  <span className="font-bold text-zinc-800 text-lg">Traffic Control</span>
                </div>
                <p className="text-zinc-600 text-sm mb-3">Who brakes at intersections to avoid collisions?</p>
                <div className="bg-white rounded-lg px-3 py-2 text-sm font-semibold flex justify-between items-center border border-zinc-200 text-zinc-500">
                  <span>Who solves it?</span>
                  <span className="flex items-center gap-1"><XCircle className="w-4 h-4"/> Manufacturer Software</span>
                </div>
              </div>
            </motion.div>

            {/* The Academic Justification */}
            <motion.div variants={fadeUp} className="md:col-span-7 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Mathematical Scope
                  </h3>
                  
                  <p className="text-zinc-700 font-medium mb-6 text-justify leading-relaxed">
                    In literature, <span className="font-bold text-indigo-700">Dispatching</span> and <span className="font-bold text-zinc-600">Routing</span> are often incorrectly used interchangeably. Carlo, Vis & Roodbergen (2014) establish a strict distinction: routing is the static pre-planning of paths, while dispatching is the dynamic assignment of vehicles in real time.
                  </p>

                  <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-2xl mb-6">
                    <blockquote className="text-lg font-serif text-indigo-900 leading-relaxed italic text-justify">
                      The AGV control problem consists of assignment, routing, and traffic control. Because routing and traffic control are generally handled by the manufacturer's proprietary software, "<strong>only the assignment problem is investigated in this paper.</strong>"
                    </blockquote>
                    <div className="text-indigo-800 font-bold text-sm mt-4 text-right">
                      — Grunow, Günther & Lehmann (2006)
                    </div>
                  </div>
                </div>

                <p className="text-zinc-700 font-medium text-justify leading-relaxed mt-2 pt-6 border-t border-zinc-100">
                  Our RL agent acts purely at Level 1. It does not compute lane-level paths, sequence vehicles inside the seaside buffer, or resolve physical deadlocks; those layers appear in the simulator as travel-time delays and queueing. Because such delays increase QC idle time (our objective), we expect, and test, that the agent learns spatial load balancing, assigning AGVs to less congested yard blocks to avoid bottlenecks.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* SECTION 2: Where the Decision Happens */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={fadeUp} className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">The Dispatching Decision Point</h2>
            <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
            {/* Flow Diagram */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 overflow-x-auto pb-4">
              <div className="flex-1 bg-zinc-100 p-4 rounded-xl text-center font-semibold text-zinc-700 min-w-[120px]">Vessel</div>
              <ArrowRight className="w-6 h-6 text-zinc-400 shrink-0" />
              <div className="flex-1 bg-zinc-100 p-4 rounded-xl text-center font-semibold text-zinc-700 min-w-[120px]">Quay Crane</div>
              <ArrowRight className="w-6 h-6 text-zinc-400 shrink-0" />
              <div className="flex-[1.5] bg-indigo-600 text-white p-4 rounded-xl text-center font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 min-w-[200px] border-2 border-indigo-400">
                <HelpCircle className="w-5 h-5" /> DISPATCH DECISION
              </div>
              <ArrowRight className="w-6 h-6 text-zinc-400 shrink-0" />
              <div className="flex-1 bg-zinc-100 p-4 rounded-xl text-center font-semibold text-zinc-700 min-w-[140px]">Transport Area</div>
              <ArrowRight className="w-6 h-6 text-zinc-400 shrink-0" />
              <div className="flex-1 bg-zinc-100 p-4 rounded-xl text-center font-semibold text-zinc-700 min-w-[120px]">Yard Block</div>
            </div>

            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-2xl">
              <p className="text-indigo-900 text-lg font-medium leading-relaxed text-justify">
                At this exact moment, when an AGV completes its current task and becomes free, the dispatcher must decide: where should this vehicle go next, to which quay crane or yard block? The goal is to time the assignment so the AGV arrives at the crane's handoff point exactly when the crane needs it. Too early, and the AGV sits idle. Too late, and the crane waits. With stochastic travel times and unpredictable crane cycles, perfect synchronization is never guaranteed.
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* SECTION 3: Formal Problem Definition */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={fadeUp} className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">What Exactly Are We Solving?</h2>
            <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <motion.div variants={fadeUp} className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
              <h3 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">Decision Variable</h3>
              <p className="text-zinc-700 font-medium mb-3 text-justify">Because loaded destinations are strictly fixed by the Terminal Operating System, the RL agent acts purely as an <strong>Empty-Vehicle Dispatcher</strong>. When an AGV becomes empty, the agent outputs a single action (<code className="text-sm bg-zinc-100 px-1 rounded">a_t</code>):</p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-600 text-justify">
                <li><strong className="text-zinc-800">Quay Cranes (1–26):</strong> dispatching an EMPTY AGV to a quay crane to fetch an import container.</li>
                <li><strong className="text-zinc-800">Yard Blocks (1–61):</strong> dispatching an EMPTY AGV to a yard block's seaside I/O point to fetch an export container (end-loading blocks: fixed bracket; side-loading blocks: along the side lane).</li>
                <li><strong className="text-zinc-800">Holding (Buffer Zone):</strong> holding an EMPTY AGV in the seaside buffer zone.</li>
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
              <h3 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">Constraints</h3>
              <ul className="list-disc pl-5 space-y-2 text-zinc-600 font-medium text-justify">
                <li><strong className="text-zinc-800">Capacity:</strong> one container per AGV at a time.</li>
                <li><strong className="text-zinc-800">Synchronization:</strong> AGV and QC must synchronize at handoff (wait times accrue if either is late).</li>
                <li><strong className="text-zinc-800">Battery limits:</strong> AGVs cannot accept tasks if charge falls below a critical threshold. {/* TODO: charging/swap rule and parameters to be defined in Methodology; no source yet */}</li>
                <li><strong className="text-zinc-800">Congestion penalties:</strong> the agent does not map lane coordinates, but suffers emergent queueing delays if it sends too many AGVs to the same block transfer area or seaside buffer.</li>
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-zinc-900 text-white p-6 rounded-2xl shadow-lg border border-zinc-800">
              <h3 className="text-xl font-bold text-amber-400 mb-4 pb-2 border-b border-zinc-700">Objective</h3>
              <p className="font-medium text-lg leading-relaxed text-justify mb-4">
                Minimise total accumulated Quay Crane idle time across all cranes over a full vessel service episode (import unloading + export loading).
              </p>
              <p className="font-medium text-sm leading-relaxed text-indigo-200 text-justify">
                QC idle time is the time a quay crane is blocked or starved at its handoff because no AGV is available.
              </p>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200 text-center">
            <div className="text-2xl md:text-3xl font-serif text-zinc-900 mb-6 bg-zinc-50 py-4 rounded-xl border border-zinc-100">
              <strong>Minimise:</strong> <span className="italic text-indigo-700">∑ T<sub>q</sub><sup>idle</sup></span>
            </div>
            <p className="text-zinc-600 mb-6 font-medium text-justify">where <span className="italic text-zinc-900 font-bold">T<sub>q</sub><sup>idle</sup></span> is the cumulative time Quay Crane <span className="italic font-bold">q</span> is blocked or starved because no AGV is available during the vessel service episode (unloading and loading).</p>
            
            <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 text-left">
              <p className="text-zinc-800 font-medium leading-relaxed mb-3 text-justify">
                Quay Cranes are the most capital-intensive equipment in a terminal. Every minute a crane is blocked or starved waiting for an AGV is revenue lost and vessel turnaround delayed.
              </p>
              <p className="text-sm text-zinc-500 italic text-justify">Source: Carlo, Vis & Roodbergen (2014), European Journal of Operational Research.</p>
            </div>
          </motion.div>
        </motion.section>

        {/* 2025 ACADEMIC CONSENSUS BLOCKQUOTE */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={fadeUp} className="my-6 bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden border border-indigo-700/50">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <AlertCircle className="w-48 h-48 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-amber-400 font-bold mb-6 tracking-widest text-sm uppercase flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Recent Evidence (2025)
              </h3>
              <p className="text-xl md:text-2xl font-serif text-white leading-relaxed italic mb-6 text-justify">
                Delays in either the availability of AGVs or the operations of yard cranes directly increase Quay Crane idle time. For example, if an AGV is delayed by congestion in the transport area, the quay crane remains idle for the entirety of that delay.
              </p>
              <div className="text-indigo-200 font-medium text-lg">
                - Garmouch et al. (2025), <cite className="text-white font-bold">Scientific Reports (Nature Portfolio)</cite>
                {/* TODO verify quote verbatim */}
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* SECTION 3.5: The Cascade of Losses */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={fadeUp} className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">The Cascade of Losses: Why Seconds Matter</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mt-4 rounded-full mb-4"></div>
            <p className="text-zinc-600 max-w-2xl mx-auto font-medium text-lg">
              A mathematically grounded breakdown of how a tiny dispatching error snowballs into massive financial penalties.
            </p>
            <p className="text-zinc-600 mt-2 max-w-2xl mx-auto font-medium text-sm">
              Illustrative example using reference parameters (C.I. Liu et al., 2001): 5 cranes, 42 moves/hour, 86 s cycle. Yangshan operates more cranes; the mechanism is the same. With double-trolley cranes, a transfer platform absorbs part of such delays; the simulator treats its capacity as an assumed parameter.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto px-4">
            <div className="relative border-l-4 border-red-100 ml-4 md:ml-0 md:border-none space-y-12 pb-10">
              
              {/* Center line for desktop */}
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-1 bg-gradient-to-b from-red-100 via-orange-200 to-red-600 -translate-x-1/2 z-0"></div>

              {/* Step 1 */}
              <motion.div variants={fadeUp} className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="hidden md:flex flex-1 justify-end text-right pr-8">
                  <h3 className="text-xl font-bold text-zinc-900">1. The Micro-Delay</h3>
                </div>
                <div className="absolute left-[-22px] md:relative md:left-0 w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold border-4 border-white shadow-sm z-10">1</div>
                <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 ml-6 md:ml-8">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2 md:hidden">1. The Micro-Delay</h3>
                  <p className="text-zinc-700 font-medium">Suppose poor dispatching causes the Quay Crane to wait an average of just <strong className="text-red-600">15 extra seconds</strong> per container for the AGV.</p>
                  <p className="text-xs text-zinc-500 italic mt-3 border-t border-zinc-100 pt-2">Literature widely recognises QC waiting time as the core bottleneck dictating terminal efficiency.</p>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div variants={fadeUp} className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 ml-6 md:ml-0 md:mr-8 order-2 md:order-1">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2 md:hidden">2. The Throughput Drop</h3>
                  <p className="text-zinc-700 font-medium">Cycle time increases from 86s to 101s. Crane productivity drops from <strong className="text-red-600">42 down to 35.6 moves/hour</strong>.</p>
                  <p className="text-xs text-zinc-500 italic mt-3 border-t border-zinc-100 pt-2">C.I. Liu et al. (2002): 42 moves/hour established as baseline QC capacity.</p>
                </div>
                <div className="absolute left-[-22px] md:relative md:left-0 w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold border-4 border-white shadow-sm z-10 order-1 md:order-2">2</div>
                <div className="hidden md:flex flex-1 justify-start text-left pl-8 order-3">
                  <h3 className="text-xl font-bold text-zinc-900">2. The Throughput Drop</h3>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div variants={fadeUp} className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="hidden md:flex flex-1 justify-end text-right pr-8">
                  <h3 className="text-xl font-bold text-zinc-900">3. The Vessel Delay</h3>
                </div>
                <div className="absolute left-[-22px] md:relative md:left-0 w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold border-4 border-white shadow-sm z-10">3</div>
                <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 ml-6 md:ml-8">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2 md:hidden">3. The Vessel Delay</h3>
                  <p className="text-zinc-700 font-medium">Processing an assumed standard 1,800-container exchange takes 10.1 hours instead of the theoretical 8.57 hours. The vessel is delayed by <strong className="text-red-600">~1.5 hours</strong>.</p>
                  <p className="text-xs text-zinc-500 italic mt-3 border-t border-zinc-100 pt-2">Illustrative arithmetic (5-crane reference case).</p>
                </div>
              </motion.div>

              {/* Step 4 */}
              <motion.div variants={fadeUp} className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-1 bg-rose-50 p-6 rounded-2xl shadow-lg border border-red-200 ml-6 md:ml-0 md:mr-8 order-2 md:order-1">
                  <h3 className="text-xl font-bold text-red-700 mb-2 md:hidden">4. The Financial Blow</h3>
                  <p className="text-rose-900 font-medium text-lg leading-relaxed">At an assumed charter rate of $100,000/day, a 1.5-hour delay burns <strong className="text-red-700 font-bold bg-red-100 px-1 rounded">up to ~$6,400 in charter costs</strong> for a single ship call.</p>
                  <p className="text-xs text-rose-700/80 italic mt-4 border-t border-rose-200 pt-2">Haralambides (2019): Mega-ship capital intensity costs up to $100k/day.</p>
                </div>
                <div className="absolute left-[-26px] md:relative md:left-0 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold border-4 border-white shadow-md z-10 order-1 md:order-2 text-xl">$</div>
                <div className="hidden md:flex flex-1 justify-start text-left pl-8 order-3">
                  <h3 className="text-2xl font-black text-red-600 tracking-tight">4. The Financial Blow</h3>
                </div>
              </motion.div>

            </div>
          </div>
        </motion.section>

        {/* SECTION 4: Three Layers of Difficulty */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={fadeUp} className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Why Is This Problem Hard?</h2>
            <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200 flex flex-col h-full">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-4">Combinatorial Complexity</h3>
              <p className="text-zinc-700 font-medium mb-6 flex-1 text-justify">
                With <span className="italic font-bold">n</span> AGVs and <span className="italic font-bold">m</span> pending tasks, the number of possible assignment combinations grows factorially. A Yangshan-scale fleet of about 130 AGVs serving up to 26 cranes makes exact optimisation computationally intractable in real time.
              </p>
              <div className="border-t border-zinc-100 pt-4 mt-auto">
                <p className="text-xs text-zinc-500 italic leading-relaxed text-justify">
                  Kim & Bae (2004) showed that exact Mixed-Integer Programming solutions exceed 1 minute per dispatching decision, which is far too slow for live terminal operations.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200 flex flex-col h-full">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-4">The Real-Time Constraint</h3>
              <p className="text-zinc-700 font-medium mb-6 flex-1 text-justify">
                In the reference benchmark, a Quay Crane requires a new AGV approximately every <strong className="text-zinc-900">86 seconds</strong>. With up to 26 cranes active, requests arrive system-wide roughly every 3 seconds (86 s ÷ 26), an upper-bound illustration. If a traditional solver (like MILP) takes minutes to compute an exact schedule, the terminal's physical state will have already changed multiple times before the answer is ready, rendering the solution obsolete.
              </p>
              <div className="border-t border-zinc-100 pt-4 mt-auto">
                <p className="text-xs text-zinc-500 italic leading-relaxed text-justify">
                  C.I. Liu et al. (2001) established the 86s operational rhythm. Kim & Bae (2004) showed exact MILP solutions scale poorly, making them computationally intractable for live operations.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200 flex flex-col h-full">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <CloudLightning className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-4">Simultaneous Disruptions</h3>
              <p className="text-zinc-700 font-medium mb-6 flex-1 text-sm space-y-3 text-justify">
                <span className="block">Real terminals face at least four concurrent sources of uncertainty:</span>
                <span className="block pl-2 border-l-2 border-zinc-200">1. <strong className="text-zinc-900">Crane cycle time variability</strong></span>
                <span className="block pl-2 border-l-2 border-zinc-200">2. <strong className="text-zinc-900">Traffic congestion and travel time noise</strong></span>
                <span className="block pl-2 border-l-2 border-zinc-200">3. <strong className="text-zinc-900">Stowage imbalance</strong> (uneven crane workloads; import/export mix differs by vessel)</span>
                <span className="block pl-2 border-l-2 border-zinc-200">4. <strong className="text-zinc-900">AGV breakdowns</strong></span>
                <span className="block">These do not occur one at a time. Any dispatching policy optimised for one will degrade when the others co-occur. Each source is parameterised by an intensity level in our simulator.</span>
              </p>
              <div className="border-t border-zinc-100 pt-4 mt-auto">
                <p className="text-xs text-zinc-500 italic leading-relaxed text-justify">
                  Carlo, Vis & Roodbergen (2014) note that relying on deterministic operational times can severely jeopardise the practical viability of dispatching solutions.
                </p>
              </div>
            </motion.div>
          </div>
          
          <motion.div variants={fadeUp} className="w-full bg-zinc-100 rounded-2xl p-6 text-zinc-700 text-justify border border-zinc-200 shadow-sm">
            <h3 className="font-bold text-zinc-900 text-lg mb-3">The Setting: Yangshan Phase IV</h3>
            <p className="leading-relaxed">
              We calibrate the environment to Yangshan Phase IV (Shanghai): a 2,350 m continuous quay (G. Liu et al., 2016) served by 26 double-trolley quay cranes and a fleet of about 130 lift-AGVs (Gu, 2016), with 61 yard blocks (Wang, 2021). The layout features interleaved end-loading and side-loading (single-cantilever) blocks (Yue et al., 2023), where AGVs queue in seaside buffer zones before reaching a block (G. Liu et al., 2016). These are fixed features of the layout, not sources of randomness. They matter because the same disruption, a late AGV or a slow crane cycle, has different consequences by block type. Routing and sequencing inside the buffer zones stay at Levels 2–3 and appear in our environment as delays.
              {/* TODO verify exact numbers and side-lane transfer points against the cited papers */}
            </p>
          </motion.div>
        </motion.section>

        {/* SECTION 5: The Literature Gap */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={fadeUp} className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">What Existing Research Has, and Has Not, Solved</h2>
            <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-zinc-100 text-zinc-900">
                  <tr>
                    <th className="px-6 py-4 font-bold border-b border-zinc-200">Approach</th>
                    <th className="px-6 py-4 font-bold border-b border-zinc-200">Handles Stochasticity?</th>
                    <th className="px-6 py-4 font-bold border-b border-zinc-200 text-center">Real-Time?</th>
                    <th className="px-6 py-4 font-bold border-b border-zinc-200 text-center">Multi-Source?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 font-medium text-zinc-700">
                  <tr className="hover:bg-zinc-50 transition-colors bg-amber-50/30">
                    <td className="px-6 py-4 text-zinc-900 font-bold">Maintenance GA <span className="font-normal text-zinc-500 text-sm block">(Garmouch et al. 2025)</span></td>
                    <td className="px-6 py-4 text-amber-600 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> AGV delays assumed fixed</td>
                    <td className="px-6 py-4 text-center text-red-600 font-bold">Weekly planning</td>
                    <td className="px-6 py-4 text-center text-red-600"><XCircle className="w-5 h-5 mx-auto"/></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-zinc-900 font-bold">Rule-Based <span className="font-normal text-zinc-500 text-sm block">(Egbelu 1984)</span></td>
                    <td className="px-6 py-4 text-red-600 flex items-center gap-2"><XCircle className="w-4 h-4"/> None</td>
                    <td className="px-6 py-4 text-center text-emerald-600"><CheckCircle2 className="w-5 h-5 mx-auto"/></td>
                    <td className="px-6 py-4 text-center text-red-600"><XCircle className="w-5 h-5 mx-auto"/></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-zinc-900 font-bold">Look-Ahead Heuristic <span className="font-normal text-zinc-500 text-sm block">(Kim & Bae 2004)</span></td>
                    <td className="px-6 py-4 text-red-600 flex items-center gap-2"><XCircle className="w-4 h-4"/> None</td>
                    <td className="px-6 py-4 text-center text-emerald-600"><CheckCircle2 className="w-5 h-5 mx-auto"/></td>
                    <td className="px-6 py-4 text-center text-red-600"><XCircle className="w-5 h-5 mx-auto"/></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-zinc-900 font-bold">Uncertainty-Aware <span className="font-normal text-zinc-500 text-sm block">(Angeloudis 2010)</span></td>
                    <td className="px-6 py-4 text-amber-600 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Traffic only</td>
                    <td className="px-6 py-4 text-center text-emerald-600"><CheckCircle2 className="w-5 h-5 mx-auto"/></td>
                    <td className="px-6 py-4 text-center text-red-600"><XCircle className="w-5 h-5 mx-auto"/></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-zinc-900 font-bold">Tabular Q-Learning <span className="font-normal text-zinc-500 text-sm block">Documented as failed baseline in Choe et al. (2016)</span></td>
                    <td className="px-6 py-4 text-amber-600 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> QC variance only</td>
                    <td className="px-6 py-4 text-center text-emerald-600"><CheckCircle2 className="w-5 h-5 mx-auto"/></td>
                    <td className="px-6 py-4 text-center text-red-600"><XCircle className="w-5 h-5 mx-auto"/></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-zinc-900 font-bold">Online Preference Learning (MLP) <span className="font-normal text-zinc-500 text-sm block">Choe et al. (2016), their actual method</span></td>
                    <td className="px-6 py-4 text-amber-600 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> QC variance only</td>
                    <td className="px-6 py-4 text-center text-emerald-600"><CheckCircle2 className="w-5 h-5 mx-auto"/></td>
                    <td className="px-6 py-4 text-center text-red-600"><XCircle className="w-5 h-5 mx-auto"/></td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-zinc-900 font-bold">Single-Agent DQN <span className="font-normal text-zinc-500 text-sm block">(Zheng 2022)</span></td>
                    <td className="px-6 py-4 text-amber-600 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Partial (to verify) {/* TODO check exact stochasticity in Zheng 2022 */}</td>
                    <td className="px-6 py-4 text-center text-emerald-600"><CheckCircle2 className="w-5 h-5 mx-auto"/></td>
                    <td className="px-6 py-4 text-center text-red-600"><XCircle className="w-5 h-5 mx-auto"/></td>
                  </tr>
                  <tr className="bg-indigo-50/50 border-t-2 border-indigo-200">
                    <td className="px-6 py-4 text-indigo-900 font-bold">PPO + MAPPO <span className="font-normal text-indigo-600 text-sm block">(This Thesis)</span></td>
                    <td className="px-6 py-4 text-indigo-700 font-bold flex items-center gap-2"><AlertCircle className="w-4 h-4 text-indigo-600"/> Hypothesised: all four</td>
                    <td className="px-6 py-4 text-center text-indigo-600">
                      <AlertCircle className="w-5 h-5 mx-auto"/>
                      <span className="block text-[10px] text-indigo-600 uppercase tracking-wider mt-1">to be tested</span>
                    </td>
                    <td className="px-6 py-4 text-center text-indigo-600">
                      <CheckCircle2 className="w-5 h-5 mx-auto"/>
                      <span className="block text-[10px] text-indigo-600 uppercase tracking-wider mt-1">by design</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-zinc-50 border-t border-zinc-200 text-sm text-zinc-700 font-medium leading-relaxed text-justify">
              Carlo et al. (2014) review the AGV dispatching literature, and the methods in the table treat uncertainty one source at a time. To our knowledge, none handles all four sources simultaneously; this thesis hypothesises that a learned, real-time adaptive policy can.
              {/* TODO verify table-row characterisations and whether any existing paper handles all four sources */}
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
                Under simultaneous stochastic disruptions (crane cycle-time variability, traffic congestion, stowage imbalance and AGV breakdowns), in a Yangshan Phase IV-calibrated terminal, do Deep Reinforcement Learning agents (DQN, PPO, MAPPO) outperform classical baselines (Greedy, Look-Ahead, Inventory-Based, GA) in minimising total QC idle time, and <span className="text-amber-400 font-bold border-b-2 border-amber-400/50 pb-1">at what disruption intensity does the performance gap become statistically significant?</span>
              </p>
              <p className="text-lg font-medium leading-relaxed text-indigo-200 mt-6 pt-6 border-t border-indigo-700/50">
                <span className="text-white font-bold">Secondary question:</span> does the gap differ between end-loading and side-loading blocks?
                {/* TODO keep only if Methodology gives the two block types distinct handoff behaviour */}
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
                    <td className="px-4 py-4 font-medium text-zinc-800">PPO <span className="text-zinc-400 mx-1">vs</span> DQN <span className="text-zinc-300 mx-2">•</span> MAPPO <span className="text-zinc-400 mx-1">vs</span> PPO</td>
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
              <li><strong className="text-zinc-900">Formulate</strong> the dispatching problem as a Markov Decision Process (MDP) with a formally defined state space, action space, and a reward function aligned with minimising QC idle time.</li>
              <li><strong className="text-zinc-900">Build</strong> a Python/Gymnasium simulation calibrated to Yangshan Phase IV (2,350 m quay, 26 QCs, about 130 AGVs, 61 yard blocks, and the seaside zone structure of Liu et al. (2016)); where published values are unavailable (lane geometry, bay pitch, cantilever reach, block sequence, QC transfer-platform capacity, battery parameters), assumptions are tagged and varied in sensitivity analysis.</li>
              <li><strong className="text-zinc-900">Implement</strong> four classical baselines: Greedy (Egbelu 1984), Look-Ahead (Kim & Bae 2004), Inventory-Based (Briskorn et al. 2006), and Genetic Algorithm (Grunow et al. 2006).</li>
              <li><strong className="text-zinc-900">Train</strong> Deep RL agents starting with a Single-Agent DQN (Zheng et al. 2022) baseline, advancing to PPO (Phase 1), and extending to MAPPO (Phase 2).</li>
              <li><strong className="text-zinc-900">Evaluate</strong> using rigorous multi-seed statistical protocols based on Agarwal et al. (2021), Interquartile Mean and 95% stratified bootstrap confidence intervals. Primary metric: total QC idle time; secondary metrics (reported, not optimised): makespan, maximum per-QC idle time, AGV empty travel and deadlock events.</li>
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
