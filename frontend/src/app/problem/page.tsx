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
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
          >
            A complex game of <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              time and space.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-xl md:text-2xl text-zinc-400 font-medium max-w-2xl leading-relaxed"
          >
            How do you dispatch 130 autonomous vehicles to keep 26 giant cranes fed, when every second costs money and nothing goes to plan?
          </motion.p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 mt-16 space-y-32">
        
        {/* SECTION 1.5: The Architecture / Scope */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={fadeUp} className="mb-10 text-center">
            <p className="text-sm text-zinc-500 italic mb-2">In plain words: What part of the vehicle's job we control.</p>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">The Scope: Dispatching vs Routing</h2>
            <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
            <p className="text-zinc-600 mt-4 max-w-2xl mx-auto font-medium text-lg">
              We focus on one decision: which vehicle goes where next. Detailed driving paths and traffic control are handled by the vehicle manufacturer's software and appear in our simulator only as delays.
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
                  <span className="text-amber-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Methods under study</span>
                </div>
                <p className="text-xs text-indigo-200 mt-2">Standard methods in Phase 1; PPO and MAPPO in Phase 2.</p>
              </div>

              <div className="bg-zinc-100 p-5 rounded-2xl border border-zinc-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-zinc-200 text-zinc-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Level 2</span>
                  <span className="font-bold text-zinc-800 text-lg">Routing (Path Planning)</span>
                </div>
                <p className="text-zinc-600 text-sm mb-3">Which specific lanes should the AGV take?</p>
                <div className="bg-white rounded-lg px-3 py-2 text-sm font-semibold flex justify-between items-center border border-zinc-200 text-zinc-500">
                  <span>Who solves it?</span>
                  <span className="flex items-center gap-1"><XCircle className="w-4 h-4"/> Usually manufacturer software</span>
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
                  <span className="flex items-center gap-1"><XCircle className="w-4 h-4"/> Usually manufacturer software</span>
                </div>
              </div>
            </motion.div>

            {/* The Academic Justification */}
            <motion.div variants={fadeUp} className="md:col-span-7 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Scope, in Precise Terms
                  </h3>
                  
                  <p className="text-zinc-700 font-medium mb-6 text-justify leading-relaxed">
                    In the literature, dispatching (assigning vehicles to jobs) and routing (choosing driving paths) are sometimes used interchangeably. Carlo, Vis & Roodbergen (2014) treat transport operations as vehicle type, number of vehicles, and routing and dispatching. This thesis studies the dispatching (assignment) decision.
                  </p>

                  <div className="bg-zinc-50 border-l-4 border-zinc-300 p-5 rounded-r-xl">
                    <blockquote className="text-zinc-600 italic font-serif leading-relaxed text-justify">
                      "AGV dispatching usually consists of three sub-problems, namely, assigning AGVs to transportation orders, routing the AGVs, and traffic control. Algorithms for routing and traffic control are generally already included in the control software provided by the AGV manufacturer. Thus, <strong>only the assignment problem is investigated in this paper.</strong>"
                    </blockquote>
                    <div className="text-indigo-800 font-bold text-sm mt-4 text-right">
                      — Grunow, Günther & Lehmann (2006), OR Spectrum 28:587–610, Sec. 2
                    </div>
                  </div>
                </div>

                <p className="text-zinc-700 font-medium text-justify leading-relaxed mt-2 pt-6 border-t border-zinc-100">
                  Our dispatchers act only at Level 1. Lane-level paths, ordering of vehicles inside a zone and physical deadlocks are not modelled; in the simulator they appear as travel-time delays and queueing. We test how well each dispatching method copes with those delays.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* SECTION 2: Where the Decision Happens */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={fadeUp} className="mb-10 text-center">
            <p className="text-sm text-zinc-500 italic mb-2">In plain words: When does the software make a choice?</p>
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
                A dispatch decision is needed when a vehicle becomes free or a container job becomes ready. Studies use both triggers (vehicle-initiated in Kim & Bae 2004, Briskorn et al. 2006 and Choe et al. 2016; both in Zheng et al. 2022). The exact trigger is fixed in our formulation. The aim is to time the assignment so that the vehicle arrives when the crane needs it. Too early, and the vehicle waits. Too late, and the crane waits.
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* SECTION 3: Formal Problem Definition */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={fadeUp} className="mb-10 text-center">
            <p className="text-sm text-zinc-500 italic mb-2">In plain words: The options, rules and goal of the problem.</p>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">What Exactly Are We Solving?</h2>
            <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <motion.div variants={fadeUp} className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
              <h3 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">Decision Variable</h3>
              <p className="text-zinc-700 font-medium mb-3 text-justify">The dispatcher decides where an empty vehicle goes next. The exact set of choices is fixed in the formulation: in the small setting it is 'which crane's next job'; larger settings may add yard-block choice and a 'hold' option.</p>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
              <h3 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">Constraints</h3>
              <ul className="list-disc pl-5 space-y-2 text-zinc-600 font-medium text-justify">
                <li><strong className="text-zinc-800">Capacity:</strong> one container per AGV at a time.</li>
                <li><strong className="text-zinc-800">Synchronization:</strong> AGV and QC must synchronize at handoff (wait times accrue if either is late).</li>
                <li><strong className="text-zinc-800">Battery:</strong> no random treatment is described in the studies we read (Song et al. 2024 model charging; Gao et al. 2023 and Zhao et al. 2025 assume enough charge). Whether it is used in Phase 1 is fixed in the formulation.</li>
                <li><strong className="text-zinc-800">Congestion:</strong> the dispatcher does not plan lanes, but suffers queueing delays if too many vehicles are sent to the same place.</li>
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-zinc-900 text-white p-6 rounded-2xl shadow-lg border border-zinc-800">
              <h3 className="text-xl font-bold text-amber-400 mb-4 pb-2 border-b border-zinc-700">Objective</h3>
              <p className="font-medium text-lg leading-relaxed text-justify mb-4">
                Minimise the total time quay cranes sit idle during a ship's service. Idle time here means the time a crane waits for a vehicle (the 'QC waiting' of Zheng et al. 2022; crane delay in Kim & Bae 2004). The exact definition is fixed in the formulation.
              </p>
              <p className="font-medium text-sm leading-relaxed text-indigo-200 text-justify">
                QC idle time is the time a quay crane waits for an AGV.
              </p>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200 text-center">
            <div className="text-2xl md:text-3xl font-serif text-zinc-900 mb-6 bg-zinc-50 py-4 rounded-xl border border-zinc-100">
              <strong>Minimise:</strong> <span className="italic text-indigo-700">∑ T<sub>q</sub><sup>idle</sup></span>
            </div>
            <p className="text-zinc-600 mb-6 font-medium text-justify">where <span className="italic text-zinc-900 font-bold">T<sub>q</sub><sup>idle</sup></span> is the cumulative time Quay Crane <span className="italic font-bold">q</span> waits for an AGV during the vessel service episode (unloading and loading).</p>
            
            <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 text-left">
              <p className="text-zinc-800 font-medium leading-relaxed mb-3 text-justify">
                Quay cranes are widely regarded as the most critical asset in a container terminal (Garmouch et al., 2025). Every minute a crane waits for a vehicle delays the ship's turnaround.
              </p>
                          </div>
          </motion.div>
        </motion.section>

        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={fadeUp} className="my-6 bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden border border-indigo-700/50">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <AlertCircle className="w-48 h-48 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-amber-400 font-bold mb-6 tracking-widest text-sm uppercase flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> A Recent Statement of the Link (2025)
              </h3>
              <blockquote className="text-xl md:text-2xl font-serif text-white leading-relaxed italic mb-4 text-justify">
                "Delays in either the availability of AGVs or the operations of ASCs will directly increase crane idle time, as the cranes must wait for the completion of container handoffs."
              </blockquote>
              <blockquote className="text-lg font-serif text-indigo-100 leading-relaxed italic mb-6 text-justify">
                "If an AGV/ASC takes an additional 10 min to transport a container due to congestion, the quay crane remains idle for that duration, increasing total idle time."
              </blockquote>
              <div className="text-indigo-200 font-medium text-lg">
                — Garmouch, Abdoun &amp; Garmouch (2025), <cite className="text-white font-bold">Scientific Reports</cite>
              </div>
              <p className="text-xs text-indigo-300 mt-4 italic text-justify">
                ASC = automated stacking crane. The second sentence is the authors' illustrative example, not a measured result. Their study schedules crane maintenance on synthetic data.
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* SECTION 3.5: The Cascade of Losses */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={fadeUp} className="mb-14 text-center">
            <p className="text-sm text-zinc-500 italic mb-2">In plain words: How a small delay costs a lot of money.</p>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">The Cascade of Losses: Why Seconds Matter</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mt-4 rounded-full mb-4"></div>
            <p className="text-zinc-600 max-w-2xl mx-auto font-medium text-lg">
              Illustrative example using reference parameters (Liu et al., 2001): 5 cranes, 42 moves/hour, 86 s cycle. Yangshan operates more cranes; the mechanism is the same. With double-trolley cranes, a transfer platform absorbs part of such delays; the simulator treats its capacity as an assumed parameter.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto px-4">
            <div className="relative border-l-4 border-red-100 ml-4 md:ml-0 md:border-none space-y-12 pb-10">
              
              {/* Center line for desktop */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-red-100 -translate-x-1/2 rounded-full"></div>

              {/* Step 1 */}
              <motion.div variants={fadeUp} className="relative flex flex-col md:flex-row items-center md:justify-between group">
                <div className="absolute left-[-28px] md:left-1/2 md:-translate-x-1/2 w-12 h-12 bg-white border-4 border-red-500 text-red-600 font-bold rounded-full flex items-center justify-center z-10 shadow-md group-hover:scale-110 transition-transform">1</div>
                <div className="w-full md:w-5/12 ml-6 md:ml-0 md:text-right md:pr-12">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 group-hover:border-red-300 transition-colors">
                    <h3 className="font-bold text-zinc-900 text-lg mb-2">The Dispatching Error</h3>
                    <p className="text-zinc-600 font-medium text-sm leading-relaxed text-justify md:text-right">A bad assignment sends an AGV into a congested block. It is delayed by <strong>15 seconds</strong>.</p>
                    <p className="text-[10px] text-zinc-400 mt-2 italic text-center">Illustrative assumption: every container adds 15 s of crane waiting.</p>
                  </div>
                </div>
                <div className="hidden md:block w-5/12"></div>
              </motion.div>

              {/* Step 2 */}
              <motion.div variants={fadeUp} className="relative flex flex-col md:flex-row items-center md:justify-between group">
                <div className="absolute left-[-28px] md:left-1/2 md:-translate-x-1/2 w-12 h-12 bg-white border-4 border-red-500 text-red-600 font-bold rounded-full flex items-center justify-center z-10 shadow-md group-hover:scale-110 transition-transform">2</div>
                <div className="hidden md:block w-5/12"></div>
                <div className="w-full md:w-5/12 ml-6 md:ml-0 md:pl-12">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 group-hover:border-red-300 transition-colors">
                    <h3 className="font-bold text-zinc-900 text-lg mb-2">The Handoff Starvation</h3>
                    <p className="text-zinc-600 font-medium text-sm leading-relaxed text-justify">The QC finishes its 86s cycle and expects the next empty AGV. It is not there. The QC sits idle for 15s.</p>
                    <p className="text-[10px] text-zinc-400 mt-2 italic text-center">42 moves per hour is the average double-mode crane rate in Liu et al. (2001). The 86 s cycle is 3600/42 (our arithmetic).</p>
                  </div>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div variants={fadeUp} className="relative flex flex-col md:flex-row items-center md:justify-between group">
                <div className="absolute left-[-28px] md:left-1/2 md:-translate-x-1/2 w-12 h-12 bg-white border-4 border-red-500 text-red-600 font-bold rounded-full flex items-center justify-center z-10 shadow-md group-hover:scale-110 transition-transform">3</div>
                <div className="w-full md:w-5/12 ml-6 md:ml-0 md:text-right md:pr-12">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 group-hover:border-red-300 transition-colors">
                    <h3 className="font-bold text-zinc-900 text-lg mb-2">Idle Time Adds Up</h3>
                    <p className="text-zinc-600 font-medium text-sm leading-relaxed text-justify md:text-right">This error repeats across the 3,400 containers handled for one 8,000 TEU ship: 15 s × 3,400 ≈ <strong>14.2 hours</strong> of aggregate QC idle time.</p>
                    <p className="text-[10px] text-zinc-400 mt-2 italic text-center">3,400 40-ft containers per ship: Liu et al. (2001), Sec. 2.3. The multiplication is our arithmetic, using the illustrative 15 s.</p>
                  </div>
                </div>
                <div className="hidden md:block w-5/12"></div>
              </motion.div>

              {/* Step 4 */}
              <motion.div variants={fadeUp} className="relative flex flex-col md:flex-row items-center md:justify-between group">
                <div className="absolute left-[-28px] md:left-1/2 md:-translate-x-1/2 w-12 h-12 bg-zinc-900 border-4 border-red-600 text-white font-bold rounded-full flex items-center justify-center z-10 shadow-lg group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="hidden md:block w-5/12"></div>
                <div className="w-full md:w-5/12 ml-6 md:ml-0 md:pl-12">
                  <div className="bg-red-50 p-6 rounded-2xl shadow-md border-2 border-red-200 group-hover:border-red-400 transition-colors">
                    <h3 className="font-bold text-red-900 text-lg mb-2">The Cost to the Ship</h3>
                    <p className="text-red-800 font-medium text-sm leading-relaxed text-justify">If that idle time is spread evenly over the 5 cranes, each crane loses about 2.8 hours (14.2 h ÷ 5), so the ship stays at berth about that much longer. The largest container ships cost more than 100 million US dollars, and their economies of scale are lost if they have to wait in port. Ships queued behind it wait too.</p>
                    <p className="text-[10px] text-red-700/60 mt-2 italic text-center">Ship cost and waiting-in-port point: Haralambides (2019), Maritime Economics &amp; Logistics, DOI 10.1057/s41278-018-00116-0. The 2.8 h is our arithmetic.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* SECTION 4: Three Layers of Difficulty */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={fadeUp} className="mb-10 text-center">
            <p className="text-sm text-zinc-500 italic mb-2">In plain words: Why we need advanced software to solve this.</p>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Why Is This Problem Hard?</h2>
            <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Cpu className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-4">Too Many Possible Assignments</h3>
              <p className="text-zinc-600 font-medium leading-relaxed text-justify">
                With n vehicles and m waiting jobs, the number of possible assignments grows very quickly (combinatorially).
              </p>
              <div className="mt-6 pt-6 border-t border-zinc-100">
                <p className="text-xs text-zinc-500 italic text-justify leading-relaxed">
                  Choe et al. (2016) state that optimal plans need computation that grows exponentially with the number of jobs and go stale when conditions change. Their rolling-horizon search takes about 10 to 40 s per decision, against a dispatch interval of about 10 s.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-4">Decisions Come Fast</h3>
              <p className="text-zinc-600 font-medium leading-relaxed text-justify">
                In the reference terminal, a crane needs a new vehicle about every 86 seconds. With 26 cranes, requests arrive roughly every 3 seconds (86 s ÷ 26, an upper-bound illustration). But speed alone is not the whole story: simple rules and assignment methods already run in well under a second (Briskorn et al. 2006: under 0.001 s on average; Grunow et al. 2006: under 1 s). The harder question is how good the decisions stay when conditions vary.
              </p>
              <div className="mt-6 pt-6 border-t border-zinc-100">
                <p className="text-xs text-zinc-500 italic text-justify leading-relaxed">
                  Liu et al. (2001) give 42 moves per hour per crane; 86 s is 3600/42 (our arithmetic).
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <CloudLightning className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-4">Uncertainty From Many Sources</h3>
              <p className="text-zinc-600 font-medium leading-relaxed text-justify">
                The literature mentions at least seven sources of uncertainty: crane cycle time, travel and congestion, task arrival, stowage workload (how work is spread over cranes), vehicle breakdown, yard-crane delay and battery. Among the 11 dispatching and scheduling studies we reviewed, crane cycle time is modelled as random in five and yard-crane delay in three; vehicle breakdown and battery are not modelled as random in any (see Table 1 below).
              </p>
              <div className="mt-6 pt-6 border-t border-zinc-100">
                <p className="text-xs text-zinc-500 italic text-justify leading-relaxed">
                  Carlo, Vis & Roodbergen (2014) observe that most models assume deterministic (non-varying) operational times.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="bg-zinc-900 text-white p-8 rounded-3xl border border-zinc-800 shadow-xl text-center max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-amber-400 mb-4">The Setting</h3>
            <p className="text-lg font-medium leading-relaxed mb-0 text-justify">
              Phase 1 uses a small terminal (proposed: 3 quay cranes, 5 vehicles, 5 yard blocks; to be confirmed). The long-term reference is Yangshan Phase IV in Shanghai (26 double-trolley quay cranes, about 130 vehicles, 61 yard blocks, 2,350 m quay; Liu et al. (2016), Port &amp; Waterway Engineering), which is planned for Phase 2.
            </p>
            </motion.div>
        </motion.section>

        {/* SECTION 4.5: What Phase 1 Models */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="mb-16">
          <motion.div variants={fadeUp} className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-indigo-500 relative flex flex-col h-full">
              <h3 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">Modelled in Phase 1</h3>
              <ul className="list-disc pl-5 space-y-3 text-zinc-700 font-medium text-justify">
                <li>A small terminal with a few quay cranes, vehicles and yard blocks (size to be confirmed).</li>
                <li>Dispatch decisions and the quay-crane idle-time objective (exact definition fixed in the formulation).</li>
                <li>A run without disruption, then runs with increasing levels of uncertainty.</li>
                <li>Rules, a genetic algorithm, tabular Q-learning and DQN on identical scenarios.</li>
              </ul>
              <div className="mt-4 pt-4 border-t border-indigo-100">
                <h4 className="text-xs font-bold text-zinc-900 mb-2">Candidate uncertainty sources, each seen in earlier studies. The exact set and levels used in Phase 1 are fixed in the formulation.</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-500 mb-3">
                  <li>Crane cycle time varies — Briskorn et al. 2006; Grunow et al. 2006; Kim &amp; Bae 2004; Liu et al. 2001; Zhao et al. 2025</li>
                  <li>Travel time and congestion — Briskorn et al. 2006; Zheng et al. 2022 (random vehicle speed)</li>
                  <li>Task arrival timing — Zheng et al. 2022 (random ship arrival)</li>
                  <li>Stowage / workload variation — Choe et al. 2016; Grunow et al. 2006; Liu et al. 2001</li>
                  <li>Yard-crane delay — Briskorn et al. 2006; Grunow et al. 2006; Zhao et al. 2025</li>
                  <li>Vehicle breakdown, battery — no random treatment is described in the 11 dispatching and scheduling studies we read; Angeloudis &amp; Bell (2010) list maintenance and safety stops among sources of plan-versus-actual difference.</li>
                </ul>
                <p className="text-[10px] text-zinc-400 italic">Most models assume deterministic (non-varying) operational times (Carlo, Vis &amp; Roodbergen, 2014).</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 flex flex-col h-full">
              <h3 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">Simplified (appears only as delays)</h3>
              <ul className="list-disc pl-5 space-y-3 text-zinc-600 text-justify">
                <li>Driving paths and lane-level movement.</li>
                <li>Traffic control and deadlock resolution.</li>
                <li>Handling and queueing inside yard blocks, as a parameter.</li>
                <li>Transfer-platform capacity of double-trolley cranes, as an assumed parameter.</li>
              </ul>
            </div>
            <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 flex flex-col h-full">
              <h3 className="text-xl font-bold text-indigo-900 mb-4 pb-2 border-b border-indigo-100/50">Waits for Phase 2</h3>
              <ul className="list-disc pl-5 space-y-3 text-indigo-800 text-justify">
                <li>Yangshan Phase IV scale.</li>
                <li>Different behaviour of end-loading and side-loading yard blocks (real-port layout).</li>
                <li>Any uncertainty sources not selected for Phase 1.</li>
                <li>PPO and MAPPO with curriculum learning; fleet-size optimisation.</li>
              </ul>
            </div>
          </motion.div>
        </motion.section>

{/* SECTION 5: The Literature Gap */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="mb-24">
          <motion.div variants={fadeUp} className="mb-10 text-center">
            <p className="text-sm text-zinc-500 italic mb-2">In plain words: We read 14 papers (11 dispatching or scheduling studies). Table 1 shows which uncertainties each study models; Table 2 shows what each study did and did not test.</p>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">What Existing Research Has, and Has Not, Solved</h2>
            <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full mb-8"></div>
          </motion.div>

          {/* Table 1 */}
          <motion.div variants={fadeUp} className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200 overflow-hidden mb-8">
            <div className="p-4 bg-zinc-50 border-b border-zinc-200 text-sm font-medium text-zinc-700">
              <span className="font-bold mr-2">Legend:</span>
              <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs mr-2">R = randomly varied</span>
              <span className="inline-block px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs mr-2">E = emerges from sim</span>
              <span className="inline-block px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-800 text-xs mr-2">F = fixed</span>
              <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs mr-2">? = not described</span>
              <span className="inline-block px-2 py-0.5 rounded-full bg-zinc-300 text-zinc-700 text-xs">- = not applicable</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-zinc-100 text-zinc-900 text-sm">
                  <tr>
                    <th className="px-4 py-3 font-bold border-b border-zinc-200">Paper</th>
                    <th className="px-4 py-3 font-bold border-b border-zinc-200">Approach</th>
                    <th className="px-4 py-3 font-bold border-b border-zinc-200">Trigger</th>
                    <th className="px-4 py-3 font-bold border-b border-zinc-200 text-center">QC cycle</th>
                    <th className="px-4 py-3 font-bold border-b border-zinc-200 text-center">Travel/congest</th>
                    <th className="px-4 py-3 font-bold border-b border-zinc-200 text-center">Task arrival</th>
                    <th className="px-4 py-3 font-bold border-b border-zinc-200 text-center">Stowage</th>
                    <th className="px-4 py-3 font-bold border-b border-zinc-200 text-center">Breakdown</th>
                    <th className="px-4 py-3 font-bold border-b border-zinc-200 text-center">YC delay</th>
                    <th className="px-4 py-3 font-bold border-b border-zinc-200 text-center">Battery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-sm font-medium text-zinc-700">
                  {
                    [
                      ['Egbelu & Tanchoco 1984','Rules','both','-','E','?','-','?','-','?'],
                      ['Liu et al. 2001','Rules (terminal design)','vehicle','R','E','F','R','?','F','?'],
                      ['Briskorn et al. 2006','Assignment rule','vehicle','R','R','F','F','?','R','?'],
                      ['Grunow et al. 2006','Assignment rule','both','R','F','E','R','?','R','?'],
                      ['Kim & Bae 2004','Optimisation + heuristic','vehicle','R','F','F','F','?','F','?'],
                      ['Angeloudis & Bell 2010','Optimisation, rolling horizon','both','?','E','?','F','?','?','?'],
                      ['Song et al. 2024','Metaheuristic (offline)','vehicle','?','F','F','?','F','?','F'],
                      ['Zhao, Li & Yang 2025','Metaheuristic (offline)','n/a','R','F','F','?','?','R','F'],
                      ['Choe et al. 2016','Online preference learning','vehicle','?','E','F','R','?','?','?'],
                      ['Gao et al. 2023','Tabular Q-learning + contract net','task','?','E','F','?','?','?','F'],
                      ['Zheng et al. 2022','DQN','both','?','R','R','F','?','?','?'],
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-zinc-50">
                        <td className="px-4 py-3 font-bold text-zinc-900">{row[0]}</td>
                        <td className="px-4 py-3">{row[1]}</td>
                        <td className="px-4 py-3">{row[2]}</td>
                        {row.slice(3).map((val, j) => {
                          let bg = 'bg-zinc-200 text-zinc-800';
                          if (val === 'R') bg = 'bg-emerald-100 text-emerald-800';
                          else if (val === 'E') bg = 'bg-sky-100 text-sky-800';
                          else if (val === '?') bg = 'bg-amber-100 text-amber-800';
                          else if (val === '-') bg = 'bg-zinc-300 text-zinc-700';
                          return (
                            <td key={j} className="px-4 py-3 text-center">
                              <span className={`inline-block w-6 h-6 leading-6 text-center rounded-full text-xs font-bold ${bg}`}>{val}</span>
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Table 2 */}
          <motion.div variants={fadeUp} className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-zinc-100 text-zinc-900 text-sm">
                  <tr>
                    <th className="px-4 py-3 font-bold border-b border-zinc-200 sticky left-0 bg-zinc-100 z-10 shadow-[1px_0_0_rgba(0,0,0,0.1)]">Paper</th>
                    <th className="px-4 py-3 font-bold border-b border-zinc-200">Objective (crane-related?)</th>
                    <th className="px-4 py-3 font-bold border-b border-zinc-200">Learning-based?</th>
                    <th className="px-4 py-3 font-bold border-b border-zinc-200">Uncertainty level sweep?</th>
                    <th className="px-4 py-3 font-bold border-b border-zinc-200">Compared against</th>
                    <th className="px-4 py-3 font-bold border-b border-zinc-200">Seeds / intervals</th>
                    <th className="px-4 py-3 font-bold border-b border-zinc-200">Multi-agent?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-sm font-medium text-zinc-700">
                  {
                    [
                      ['Egbelu & Tanchoco 1984','Shop throughput (not crane-related)','No','No','Other rule combinations only','2 runs; no intervals','No'],
                      ['Liu et al. 2001','Design targets; crane idle rate reported as an output','No','No','None','One 24 h run','No'],
                      ['Briskorn et al. 2006','Waterside productivity (crane-related)','No','No (noise present, not varied)','Greedy and Hungarian due-time rules','100 runs of 11 h; no intervals','No'],
                      ['Grunow et al. 2006','Processing time incl. crane waiting (crane-related)','No','Yes (cycle-time variance x0.5, x1, x2)','On-line NV/FCFS rule; lower bound','10 replications; spread not shown','No'],
                      ['Kim & Bae 2004','Crane delay, then travel (crane-related)','No','Yes (noise swept)','STT/D, EDD, r-SI','10 replications; 1% tests','No'],
                      ['Angeloudis & Bell 2010','Net benefit (no crane metric)','No','No (weights and fleet size swept)','Closest, Greedy, First, mTSP','Seeds not stated; no intervals','No'],
                      ['Song et al. 2024','Longest vehicle completion time (not crane-related)','No','No (charging threshold swept)','One-threshold charging only','Runs not described','No'],
                      ['Zhao, Li & Yang 2025','Vehicle energy (not crane-related)','No','No','Greedy start; GA','10 groups; no tests','No'],
                      ['Choe et al. 2016','Crane makespan + empty travel (crane-related)','Yes (supervised preference learning)','Two scenario families, not graded','Rolling-horizon GA, policy search, Q-learning','50 scenarios; t-tests','No'],
                      ['Gao et al. 2023','Earliness + lateness; congestion (not crane-related)','Yes (tabular Q-learning for routing)','No','CNA, Dijkstra, GA, PSO','GA/PSO mean of 10 runs; own runs not described','Contract-net agents (not multi-agent RL)'],
                      ['Zheng et al. 2022','Crane waiting for vehicle + vehicle completion (crane-related)','Yes (DQN)','No (one level; sweep is over size)','Static GA; FCFS, STD, LWT','Not described; no intervals','No'],
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-zinc-50">
                        <td className="px-4 py-3 font-bold text-zinc-900 sticky left-0 bg-white shadow-[1px_0_0_rgba(0,0,0,0.05)] z-10">{row[0]}</td>
                        <td className="px-4 py-3">{row[1]}</td>
                        <td className="px-4 py-3">{row[2]}</td>
                        <td className="px-4 py-3">{row[3]}</td>
                        <td className="px-4 py-3">{row[4]}</td>
                        <td className="px-4 py-3">{row[5]}</td>
                        <td className="px-4 py-3">{row[6]}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
            <h3 className="font-bold text-zinc-900 mb-4">What the tables show</h3>
            <ul className="list-disc pl-5 space-y-2 text-zinc-700 text-sm mb-4">
              <li>Among these 11 studies, no learning-based dispatcher was evaluated across graded uncertainty levels; the two studies with level sweeps (Kim & Bae 2004; Grunow et al. 2006) are not learning-based.</li>
              <li>No study compares rules, a metaheuristic, tabular Q-learning and DQN on the same scenarios with seeds and intervals.</li>
              <li>No study in this set uses multi-agent learning.</li>
              <li>Vehicle breakdown and battery are not modelled as random in any of them.</li>
              <li>Gao et al. (2023) list deep reinforcement learning as future work for dispatching AGVs together with other equipment.</li>
            </ul>
            <p className="text-xs text-zinc-500 italic">This summarises the papers we read; it is not evidence about the wider literature. A '?' means the paper does not describe it, not that the paper is weak.</p>
          </motion.div>
        </motion.section>
{/* SECTION 6: The Research Question */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="mb-24">
          <motion.div variants={fadeUp} className="mb-10 text-center">
            <p className="text-sm text-zinc-500 italic mb-2">In plain words: The exact questions this thesis will answer.</p>
          </motion.div>
          <motion.div variants={fadeUp} className="bg-gradient-to-br from-indigo-900 to-zinc-900 text-white p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden border border-indigo-700/50">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <HelpCircle className="w-48 h-48" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-bold tracking-widest uppercase mb-6 border border-indigo-500/30">
                <Target className="w-4 h-4" /> Research Questions
              </div>
              
              <p className="text-xl md:text-2xl font-medium leading-relaxed mb-6 text-justify">
                <span className="text-amber-400 font-bold block mb-2">Phase 1:</span>
                In a small automated terminal, how do rule-based dispatching, a genetic algorithm, tabular Q-learning and DQN perform on quay-crane idle time without disruption and as uncertainty increases, and where does each stop working?
              </p>
              
              <p className="text-xl md:text-2xl font-medium leading-relaxed mb-4 text-justify">
                <span className="text-amber-400 font-bold block mb-2">Phase 2:</span>
                Do PPO and MAPPO, trained with curriculum learning, add value (better or more robust crane idle time) over the Phase 1 methods as uncertainty rises?
              </p>

              <p className="text-sm font-medium leading-relaxed text-indigo-200 mt-6 pt-6 border-t border-indigo-700/50">
                Planned for Phase 2: whether results differ between end-loading and side-loading yard blocks.
              </p>
            </div>
          </motion.div>
          
          <motion.div variants={fadeUp} className="mt-8 bg-white p-6 rounded-3xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-lg font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">Two-Step Comparison</h3>
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
                    <td className="px-4 py-4 font-bold text-zinc-900">Phase 1</td>
                    <td className="px-4 py-4 font-medium text-zinc-800">Rules, genetic algorithm, tabular Q-learning, DQN, across uncertainty levels</td>
                    <td className="px-4 py-4 text-zinc-600">Where do standard methods stop working?</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 font-bold text-zinc-900">Phase 2</td>
                    <td className="px-4 py-4 font-medium text-zinc-800">PPO against the best Phase 1 methods; MAPPO against PPO</td>
                    <td className="px-4 py-4 text-zinc-600">Does each newer learning method add value?</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.section>
{/* SECTION 7: Bridge to Methodology */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center pb-20 border-t border-zinc-200 pt-20">
          <motion.div variants={fadeUp} className="mb-10 text-center">
            <p className="text-sm text-zinc-500 italic mb-2">In plain words: How we are going to build it.</p>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Our Approach</h2>
            <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full mb-8"></div>
          </motion.div>
          
          <motion.div variants={fadeUp} className="max-w-4xl mx-auto text-lg text-zinc-700 font-medium leading-relaxed mb-10 text-left space-y-4 bg-white p-8 rounded-3xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-justify">
            <p>To answer this question, we:</p>
            <ol className="list-decimal pl-6 space-y-3 text-justify">
              <li><strong className="text-zinc-900">Formulate</strong> the dispatching decision as a Markov Decision Process (MDP), a step-by-step description of the situation, the choice and the outcome, with quay-crane idle time as the objective.</li>
              <li><strong className="text-zinc-900">Build</strong> a Python/Gymnasium simulator, first without disruption and then with adjustable uncertainty levels. Phase 1 uses a small terminal; scaling and calibration to Yangshan Phase IV (26 cranes, about 130 vehicles, 61 yard blocks; Liu et al. (2016), Port &amp; Waterway Engineering) is planned for Phase 2.</li>
              <li><strong className="text-zinc-900">Implement</strong> standard methods for comparison: rules (FCFS, STD, LWT and an Egbelu-style rule), a genetic algorithm, tabular Q-learning and DQN (Zheng et al. 2022), all on identical scenarios.</li>
              <li><strong className="text-zinc-900">Evaluate</strong> with several random seeds, interquartile mean and 95% bootstrap confidence intervals (Agarwal et al. 2021). Primary metric: total quay-crane idle time. Secondary metrics (reported, not optimised): makespan, maximum idle time of any single crane, empty travel distance, deadlock events.</li>
              <li><strong className="text-zinc-900">In Phase 2, train</strong> PPO and then extend to MAPPO with curriculum learning, and compare with the Phase 1 methods.</li>
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
