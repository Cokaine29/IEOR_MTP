
'use client';
import { motion } from 'framer-motion';
import { BrainCircuit, Maximize, Target, GitBranch, ArrowRightLeft, Eye, Zap, Award } from 'lucide-react';

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Phase2() {
  return (
    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="space-y-12 mt-12">
      <div id="phase-2" className="scroll-mt-28">
        <h2 className="text-3xl font-bold text-zinc-900 border-b-2 border-zinc-200 pb-2">Phase 2: MDP Formulation</h2>
      </div>

      {/* NEW: Plain English MDP Explainer with Visuals */}
      <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-2xl shadow-sm mb-8">
        <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5"/> What is an MDP? (Markov Decision Process)
        </h3>
        <p className="text-sm text-indigo-800 leading-relaxed text-justify mb-6">
          An MDP is the mathematical framework used to teach an AI how to make decisions. Because the Neural Network cannot physically "see" the port or understand what a crane is, we must translate the physical world into raw math. We do this by defining three things: <strong>The State</strong> (what the AI sees), <strong>The Action</strong> (what the AI can do), and <strong>The Reward</strong> (how we grade the AI's performance).
        </p>

        {/* Visual MDP Loop */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-indigo-100 flex flex-col items-center text-center shadow-sm relative">
             <Eye className="w-8 h-8 text-blue-500 mb-3"/>
             <span className="font-bold text-sm text-indigo-900">1. State (Eyes)</span>
             <span className="text-xs text-zinc-500 mt-1">Snapshot of the port (1,084 features)</span>
             <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-indigo-300 font-bold">→</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-indigo-100 flex flex-col items-center text-center shadow-sm relative">
             <BrainCircuit className="w-8 h-8 text-purple-500 mb-3"/>
             <span className="font-bold text-sm text-indigo-900">2. Agent (Brain)</span>
             <span className="text-xs text-zinc-500 mt-1">Neural Network calculates best move</span>
             <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-indigo-300 font-bold">→</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-indigo-100 flex flex-col items-center text-center shadow-sm relative">
             <Zap className="w-8 h-8 text-green-500 mb-3"/>
             <span className="font-bold text-sm text-indigo-900">3. Action (Hands)</span>
             <span className="text-xs text-zinc-500 mt-1">Moves an AGV to a QC or Yard</span>
             <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-indigo-300 font-bold">→</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-indigo-100 flex flex-col items-center text-center shadow-sm">
             <Award className="w-8 h-8 text-amber-500 mb-3"/>
             <span className="font-bold text-sm text-indigo-900">4. Reward (Grade)</span>
             <span className="text-xs text-zinc-500 mt-1">Scores the action (+Bonus / -Penalty)</span>
          </div>
        </div>
      </div>
      
      {/* Pointer 5 */}
      <div id="pointer-5" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <BrainCircuit className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-2">
              State Space Definition (The AI's "Eyes")
            </h2>
            <p className="text-sm text-zinc-600 mb-6 text-justify leading-relaxed">
              Mathematically, the <strong>State Space</strong> is the complete structural blueprint of every possible situation in the terminal. Within this space, a single <strong>State</strong> acts as a real-time snapshot. We compress the physical port into an array of exactly <strong>1,084 features</strong>. Every time an AGV finishes a task, the AI reads this State of 1,084 features to instantly understand current traffic, queue lengths, and workloads before deciding where to route the vehicle. If a variable isn't defined in the State Space, the AI is completely blind to it.
            </p>

            {/* NEW: Generic Explanation & Example Block */}
            <div className="bg-sky-50 border-l-4 border-sky-500 p-5 rounded-r-xl mb-8 shadow-sm">
              <h5 className="font-bold text-sky-900 mb-2">State Space vs. State</h5>
              <p className="text-sm text-sky-800 text-justify mb-3 leading-relaxed">
                <strong>The Generic Concept:</strong> Think of the <em>State Space</em> as the physical design of a car's dashboard: it defines exactly what sensors exist (speedometer, battery gauge, radar). A single <em>State</em> is the exact reading on those sensors at one specific millisecond (e.g., 65 mph, 20% battery). 
              </p>
              <p className="text-sm text-sky-800 text-justify leading-relaxed">
                <strong>Example in our Port:</strong> Imagine the AI needs to decide where to route AGV #1. The current <em>State</em> feeds the AI this exact snapshot: <em>"AGV #1 is empty. QC #3 has 10 containers waiting. There are <strong>3 AGVs currently parked</strong> at QC #3, and <strong>3 other AGVs are driving</strong> towards it."</em> By reading this specific state, the AI calculates that 6 AGVs are already committed. It predicts that sending AGV #1 will push the queue to 7 (exceeding the strict 6-AGV capacity limit and causing a deadlock), so it intelligently routes it to QC #2 instead.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              
              {/* QC State */}
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-bl-lg">
                  26 QCs × 2 Features = 52
                </div>
                <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">QC State (52 values)</h4>
                <ul className="text-sm text-zinc-700 space-y-2">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Queue density</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Elapsed cycle time (predictive dispatching)</li>
                </ul>
              </div>

              {/* Yard State */}
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-bl-lg">
                  61 YBs × 2 Features = 122
                </div>
                <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Yard State (122 values)</h4>
                <ul className="text-sm text-zinc-700 space-y-2">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Rack fill level (0–4)</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Current ARMG service time elapsed</li>
                </ul>
              </div>

              {/* AGV State */}
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-bl-lg">
                  130 AGVs × 7 Features = 910
                </div>
                <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">AGV State (910 values)</h4>
                <ul className="text-sm text-zinc-700 space-y-2">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Position (x,y)</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Velocity (Vx, Vy)</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Status (idle/moving/charging)</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Job_ID</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Battery SOC (%)</li>
                </ul>
              </div>

              {/* Global State */}
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-bl-lg">
                  1 Port × 4 Features = 4
                </div>
                <h4 className="font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Global State (4 values)</h4>
                <ul className="text-sm text-zinc-700 space-y-2">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Import/Export tasks remaining</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Operational AGVs</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Episode time elapsed</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Current Imbalance Coefficient</li>
                </ul>
              </div>
            </div>

            <div className="bg-zinc-900 text-white p-6 rounded-2xl flex items-center justify-between shadow-lg">
              <div>
                <div className="text-sm text-zinc-400 mb-1">Total State Vector Math</div>
                <div className="font-mono text-xs text-zinc-300">52 (QC) + 122 (Yard) + 910 (AGV) + 4 (Global)</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-400">1,084</div>
                <div className="text-sm text-zinc-400">Features</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pointers 6, 7, 8 Summary */}
      <div id="pointer-6" className="relative"><div id="pointer-7" className="absolute top-1/3" /><div id="pointer-8" className="absolute top-2/3" /></div>
<div className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <Target className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              Action, Reward, Transitions & Terminal State
            </h2>
            
            <div className="flex flex-col gap-6">
              {/* Action Space */}
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 shadow-sm">
                <h4 className="font-bold text-zinc-900 text-lg mb-2">Action Space (The AI's "Hands")</h4>
                <p className="text-sm text-zinc-600 mb-4 text-justify">
                  The Action Space defines the exact buttons the AI can press to move the AGVs. The simulation is event-based, meaning the AI is only asked to make a decision when one of two specific events occurs:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-zinc-200">
                    <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Event 1: Empty AGV Needs Routing</div>
                    <div className="text-sm text-zinc-700 leading-relaxed text-justify mb-2">
                      When an AGV finishes dropping off a container and becomes empty, the AI must pick from <strong>27 possible actions: Dispatch to 1 of 26 QCs + 1 Wait</strong>:
                    </div>
                      <ul className="text-xs text-zinc-600 space-y-1 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                        <li>👉 <strong>QC 1-26:</strong> Drive to one of the 26 Quay Cranes</li>
                        <li>👉 <strong>Wait / Hold:</strong> Wait in place or staging area.</li>
                        <li className="text-zinc-500 italic mt-2">Note: YB destinations are pre-assigned by TOS stowage plan, so the agent does not choose YB.</li>
                      </ul>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-zinc-200">
                    <div className="text-xs font-bold text-green-500 uppercase tracking-wider mb-2">Event 2: Loaded AGV at Crane</div>
                    <div className="text-sm text-zinc-700 leading-relaxed text-justify mb-2">
                      When an AGV arrives at the QC carrying an Export container, the AI must pick from <strong>2 possible actions</strong>:
                    </div>
                    <ul className="text-xs text-zinc-600 space-y-1 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                      <li>• <strong>Dual-Cycle:</strong> Wait to catch an Import container</li>
                      <li>• <strong>Return Empty:</strong> Drive away empty immediately</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Reward */}
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 shadow-sm">
                <h4 className="font-bold text-zinc-900 text-lg mb-2">7. Reward Function (The "Grades")</h4>
                <p className="text-sm text-zinc-600 mb-5 text-justify leading-relaxed">
                  <strong>The Generic Concept:</strong> Think of the Reward Function as a strict grading rubric or a video game score. Every time the AI makes a dispatch decision, the simulation instantly grades it. If it does something bad (making a crane wait), it loses points. If it does something highly efficient (saving time with a dual-cycle), it earns bonus points. The AI's entire goal is to maximize this final score.
                </p>
                
                <div className="bg-white border-2 border-indigo-50 py-6 px-4 rounded-xl mb-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center gap-5 overflow-x-auto">
                  <div className="text-center">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">1. Immediate Reward (Current Grade)</div>
                    <span className="font-serif text-xl sm:text-2xl text-zinc-800 tracking-wider whitespace-nowrap">
                      <span className="italic font-bold">R<sub>t</sub></span> = 
                      <span className="mx-2">-</span><span className="text-rose-600 font-bold">∑</span>(QC<sub className="text-sm italic">wait</sub>) 
                      <span className="mx-2">-</span><span className="text-amber-500 font-bold">α</span>(Dist<sub className="text-sm italic">empty</sub>) 
                      <span className="mx-2">+</span><span className="text-emerald-500 font-bold">β</span>(Bonus<sub className="text-sm italic">dual</sub>)
                    </span>
                  </div>
                  
                  <div className="w-full h-px bg-zinc-100 max-w-md"></div>
                  
                  <div className="text-center">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">2. Cumulative Return (The AI's True Goal)</div>
                    <span className="font-serif text-xl sm:text-2xl text-zinc-800 tracking-wider whitespace-nowrap">
                      <span className="italic font-bold">G<sub>t</sub></span> = 
                      <span className="mx-2 italic">R<sub>t</sub></span> + 
                      <span className="mx-2 text-indigo-500 font-bold italic">γR<sub>t+1</sub></span> + 
                      <span className="mx-2 text-indigo-500 font-bold italic">γ<sup>2</sup>R<sub>t+2</sub></span> + ...
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 text-sm text-zinc-700 bg-white p-5 rounded-xl border border-zinc-100">
                  <li className="flex gap-3 items-start"><span className="font-bold text-amber-500 w-8 text-lg mt-0.5">α</span> <span className="text-justify leading-relaxed"><strong>(Alpha):</strong> Priority Violation Penalty. A weight applied to delay when a Gate/Reshuffle task delays a Ship task.</span></li>
                  <li className="flex gap-3 items-start"><span className="font-bold text-emerald-500 w-8 text-lg mt-0.5">λ</span> <span className="text-justify leading-relaxed"><strong>(Lambda):</strong> Deadlock Penalty. A large constant penalty (≈ 300s) triggered when an AGV is sent to a full node.</span></li>
                  <li className="flex gap-3 items-start">
                    <span className="font-bold text-indigo-500 w-8 text-lg mt-0.5">γ</span> 
                    <span className="text-justify leading-relaxed">
                      <strong>(Gamma) = 0.95:</strong> The Discount Factor. <em>(Note: Gamma does not appear in the immediate reward equation above. Instead, it is the multiplier the AI uses to calculate its long-term future score.)</em> A lower value of 0.95 forces the AI to prioritize immediate near-term QC utilization over distant future rewards.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Transitions */}
                <div className="bg-zinc-100 p-6 rounded-2xl border border-zinc-300 shadow-sm flex flex-col">
                  <h4 className="font-bold text-zinc-900 text-lg mb-3">8. Transitions (The "Clock")</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed mb-3">
                    <strong>Event-Driven vs. Time-Step:</strong> In a standard physics simulation (like a video game), the clock ticks every single millisecond and updates the world. For our port, that is computationally wasteful.
                  </p>
                  <p className="text-sm text-zinc-700 leading-relaxed mb-3">
                    Instead, we use an <strong>Event-Driven Transition</strong> model. The simulation clock "fast-forwards" directly to the exact second an AGV finishes a task or a crane becomes idle. The AI is only woken up to read the State Space when a decision is actually required.
                  </p>
                  <div className="mt-auto pt-3 border-t border-zinc-200">
                    <p className="text-xs text-zinc-500 italic">This speeds up RL training by 100x while ensuring the Markov Property holds true.</p>
                  </div>
                </div>

                {/* Episode Definition */}
                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-200 shadow-sm flex flex-col">
                  <h4 className="font-bold text-indigo-900 text-lg mb-3">9. Terminal State (The "End")</h4>
                  <p className="text-sm text-indigo-800 mb-4 leading-relaxed">
                    An <strong>Episode</strong> is one full run of the simulation (processing a single ship). The episode only terminates under two conditions:
                  </p>
                  <ul className="text-sm text-indigo-900 space-y-4">
                    <li className="flex gap-3">
                      <span className="text-xl shrink-0">🏆</span> 
                      <div className="flex flex-col">
                        <strong className="text-indigo-950 mb-0.5">Success</strong>
                        <span className="leading-relaxed opacity-90">All 1,800 container tasks are completed. The clock stops and the final time is recorded.</span>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-xl shrink-0">🛑</span> 
                      <div className="flex flex-col">
                        <strong className="text-indigo-950 mb-0.5">Truncation (Time Limit)</strong>
                        <span className="leading-relaxed opacity-90">The simulation reaches 24 simulated hours. This acts as a circuit-breaker to prevent infinite loops if the AI learns a bad deadlocking policy.</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
