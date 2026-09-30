'use client';

import { motion } from 'framer-motion';
import TableOfContents from '@/components/TableOfContents';

const sections = [
  { id: 'point-1', title: '1. When and Why Did the World Feel the Need for AGVs?' },
  { id: 'point-2', title: '2. The Industry 4.0 / Automation Wave, Why Now?' },
  { id: 'point-3', title: '3. What Are AGVs?' },
  { id: 'point-4', title: '4. What Problems Were Addressed by Introduction of AGVs?' },
  { id: 'point-5', title: '5. How Were AGVs Controlled? Evolution of Dispatching and Control Architecture' },
  { id: 'point-6', title: '6. What Challenges Did AGV Usage Bring In?' },
  { id: 'point-7', title: '7. Why Ports and ACTs Specifically?' },
  { id: 'point-8', title: '8. AGVs in ACTs' },
  { id: 'point-9', title: '9. The Modern Scale: $20 Billion Terminals & The AIV Transition' },
    { id: 'point-10', title: '10. The Evolution of Dispatching: A 40-Year Quest for Optimality' },
  { id: 'point-11', title: '11. The Unsolved Piece: The Stochasticity Problem' },
  { id: 'point-12', title: '12. State of the Art in Stochastic AGV Dispatching, and the Gap' },
];

import { BookOpen, Factory, Cpu, Truck, ShieldCheck, FileText, History, AlertTriangle, Ship, Box, Dices, Anchor, ArrowRight, Layers, Construction , Target } from 'lucide-react';

/* -¢"â‚¬-¢"â‚¬ Animation variants -¢"â‚¬-¢"â‚¬ */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function BackgroundPage() {
  return (
    <div className="relative bg-zinc-100 min-h-screen pb-24">
      {/* -¢"â‚¬-¢"â‚¬ Page Header -¢"â‚¬-¢"â‚¬ */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="flex justify-center mb-4">
              <div className="p-3 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <BookOpen className="w-6 h-6 text-zinc-900" />
              </div>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 mb-6">
              Background & Evolution
            </motion.h1>
            <motion.p variants={fadeUp} className="text-zinc-700 text-lg font-medium leading-relaxed">
              Tracing the journey from Industry 4.0, the specific stochastic challenges of Automated Container Terminals.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* -¢"â‚¬-¢"â‚¬ Timeline / Pointers Container -¢"â‚¬-¢"â‚¬ */}
      <section className="px-4 max-w-[90rem] mx-auto flex flex-col xl:flex-row gap-8 xl:items-start">
        {/* Sticky Sidebar */}
        <div className="hidden xl:block w-72 shrink-0 sticky top-24 z-10 self-start">
          <TableOfContents sections={sections} />
        </div>

        {/* Points Content */}
        <div className="flex-1 max-w-5xl mx-auto space-y-12 min-w-0">
          
                    {/* Point 1 */}
          <div id="point-1" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
                <Factory className="w-6 h-6 text-zinc-900" />
              </div>
              <div className="w-full min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
                  1. When and Why Did the World Feel the Need for AGVs?
                </h2>
                <div className="text-zinc-800 leading-relaxed space-y-4 text-justify">
                  <p>
                    <strong className="text-zinc-900 font-semibold">The trigger: Post-WWII industrial explosion.</strong>
                  </p>
                  <p>
                    After World War II, manufacturing demand surged globally. Factories needed to move raw materials and finished goods internally, across large shop floors, between production stations, into warehouses, at a scale that human-operated forklifts and hand trucks could not sustain economically or safely.
                  </p>
                  <p>
                    The first AGV was invented in <strong className="text-zinc-900 font-semibold">1953 by Barrett Electronics Corporation (USA)</strong>. It was a simple tow tractor that followed an overhead wire, deployed at a grocery warehouse in South Carolina. The problem it solved was basic: <em>how do you move heavy loads inside a large facility continuously, without assigning a human driver to every vehicle?</em>
                  </p>

                  <div className="my-6 rounded-2xl overflow-hidden border border-zinc-200">
                    <img 
                      src="/background/barrett_1953.png" 
                      alt="1953 Barrett Electronics Guide-O-Matic Tow Tractor" 
                      className="w-full h-auto object-contain bg-zinc-100"
                    />
                    <div className="bg-zinc-100 px-4 py-2 text-xs text-zinc-700 font-medium text-center border-t border-zinc-200">
                      The Guide-O-Matic by Barrett Electronics, widely recognized as the world's first AGV (1953).
                    </div>
                  </div>
                  
                  {/* Source block */}
                  <div className="mt-6 p-4 bg-zinc-100 rounded-2xl border border-zinc-200 flex gap-3">
                    <FileText className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-zinc-900 mb-1 text-justify">Source Citation</p>
                      <p className="text-zinc-700 italic text-justify">
                        Vis, I.F.A. (2006). Survey of research in the design and control of automated guided vehicle systems. European Journal of Operational Research, 170(3), 677-709. (Widely referenced AGV survey, verify the 1953 Barrett origin detail before citing).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Point 2 */}
          <div id="point-2" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
                <Cpu className="w-6 h-6 text-zinc-900" />
              </div>
              <div className="w-full min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
                  2. The Industry 4.0 / Automation Wave, Why Now?
                </h2>
                <div className="text-zinc-800 leading-relaxed space-y-4 text-justify">
                  <p>
                    <strong className="text-zinc-900 font-semibold">AGVs existed since 1953. So why is this suddenly a hot research topic in the 2020s?</strong>
                  </p>
                  <p>
                    The answer is Industry 4.0, the fourth industrial revolution, characterised by the convergence of:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-700">
                    <li><strong className="text-zinc-900 font-semibold">Cyber-Physical Systems (CPS)</strong>, physical machines connected to digital control systems</li>
                    <li><strong className="text-zinc-900 font-semibold">Internet of Things (IoT)</strong>, real-time sensor data from every device on the shop floor</li>
                    <li><strong className="text-zinc-900 font-semibold">Artificial Intelligence and Machine Learning</strong>, intelligent, adaptive decision-making</li>
                    <li><strong className="text-zinc-900 font-semibold">Cloud Computing and Big Data</strong>, processing massive operational data in real time</li>
                  </ul>
                  <p>
                    The term "Industry 4.0" was officially coined at <strong>Hannover Messe 2011</strong> as a German government strategic initiative.
                  </p>
                  
                  {/* Source block */}
                  <div className="mt-6 p-4 bg-zinc-100 rounded-2xl border border-zinc-200 flex gap-3">
                    <FileText className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
                    <div className="text-sm space-y-3">
                      <p className="font-semibold text-zinc-900 mb-1 text-justify">Foundational Sources</p>
                      <p className="text-zinc-700 italic text-justify">
                        Kagermann, H., Wahlster, W., & Helbig, J. (2013). Recommendations for implementing the strategic initiative Industrie 4.0. Acatech, German Academy of Science and Engineering. (The original policy document. Freely available online.)
                      </p>
                      <p className="text-zinc-700 italic text-justify">
                        Schwab, K. (2016). The Fourth Industrial Revolution. World Economic Forum, Geneva.
                      </p>
                    </div>
                  </div>

                  <p className="p-4 bg-zinc-900 text-white rounded-2xl font-medium shadow-sm mt-6">
                    <strong>The direct connection to AGVs:</strong> Traditional AGVs followed fixed wire paths and ran on rigid pre-programmed schedules, sufficient for a stable 1980s factory floor. Industry 4.0 environments are dynamic: product lines change, demand fluctuates, machines break down. This demands <em>intelligent, adaptive</em> AGVs that respond to real-time conditions, hence the shift from rigid rule-based dispatching to AI-driven dispatching. This is the core technological motivation of this thesis.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Point 3 */}
          <div id="point-3" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
                <Truck className="w-6 h-6 text-zinc-900" />
              </div>
              <div className="w-full min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
                  3. What Are AGVs?
                </h2>
                <div className="text-zinc-800 leading-relaxed space-y-4 text-justify">
                  <p>
                    <strong className="text-zinc-900 font-semibold">Formal definition:</strong> 
                  </p>
                  <p>
                    An Automated Guided Vehicle (AGV) is a <em>driverless, battery-powered transport vehicle</em> that moves materials along predefined or dynamically computed paths within a facility, guided by embedded wires, magnetic strips, laser reflectors, or GPS/vision-based systems.
                  </p>
                  
                  <div className="py-2">
                    <p className="font-semibold text-zinc-900 mb-2 text-justify">Key characteristics:</p>
                    <ul className="list-disc pl-5 space-y-2 text-zinc-700">
                      <li>No human operator on board</li>
                      <li>Follows navigation and task instructions from a central Fleet Management System (FMS)</li>
                      <li>Can carry loads ranging from small components in electronics manufacturing to pallets in warehouses to large heavy assemblies in automotive plants</li>
                      <li>Typically communicates wirelessly with the central controller for task assignment in real time</li>
                    </ul>
                  </div>

                  {/* Source block */}
                  <div className="mt-6 p-4 bg-zinc-100 rounded-2xl border border-zinc-200 flex gap-3">
                    <FileText className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
                    <div className="text-sm space-y-3">
                      <p className="font-semibold text-zinc-900 mb-1 text-justify">Literature References</p>
                      <p className="text-zinc-700 italic text-justify">
                        Liu, C.I., Jula, H., & Ioannou, P.A. (2001). Design and simulation of automated container terminal using AGVs. European Control Conference. (Physical characteristics and navigation described in Section 2.)
                      </p>
                      <p className="text-zinc-700 italic text-justify">
                        Carlo, H.J., Vis, I.F.A., & Roodbergen, K.J. (2014). (Formally classifies AGVs as "non-lifting transfer vehicles" in Section 2.1.)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Point 4 */}
          <div id="point-4" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
                <ShieldCheck className="w-6 h-6 text-zinc-900" />
              </div>
              <div className="w-full min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
                  4. What Problems Were Addressed by Introduction of AGVs?
                </h2>
                <div className="text-zinc-800 leading-relaxed space-y-6 text-justify">
                  <p>Three categories of problems AGVs solved in industrial settings:</p>
                  
                  <div>
                    <h3 className="font-bold text-zinc-900 text-lg mb-1">a) Safety</h3>
                    <p>
                      Human-operated forklifts are one of the leading causes of serious injuries on factory and warehouse floors. The U.S. Occupational Safety and Health Administration (OSHA) reports that forklifts cause approximately <strong className="text-zinc-900 font-semibold">85 fatalities and 34,900 serious injuries per year</strong> in the US alone. AGVs eliminate the human driver from the vehicle entirely, following fixed collision-avoidance protocols and automatically stopping when an obstacle is detected.
                    </p>
                    <div className="mt-3 p-3 bg-zinc-100 rounded-xl border border-zinc-200 flex gap-3">
                      <FileText className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-zinc-700 italic text-justify">
                        Source: OSHA (U.S. Department of Labor). Powered Industrial Trucks eTool. Freely available at osha.gov. (Verify the exact current statistics from the OSHA website before citing.)
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-zinc-900 text-lg mb-1">b) Labour Cost and Continuous Operation</h3>
                    <p>
                      A human operator requires wages, breaks, shift changes, and cannot work indefinitely. A factory running 3 shifts needs 3 forklift operators per vehicle per day. AGVs operate 24 hours a day, 7 days a week, with only scheduled maintenance downtime, significantly reducing per-unit labour cost in high-volume operations.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-zinc-900 text-lg mb-1">c) Throughput Consistency</h3>
                    <p>
                      Human operators vary in speed, take different routes, and make routing decisions that are locally sensible but globally suboptimal. In a large manufacturing plant with dozens of workstations all requesting material simultaneously, a human dispatcher making these decisions in real time will inevitably create bottlenecks. AGVs following an optimised dispatching policy are consistent, repeatable, and can coordinate across the entire fleet simultaneously.
                    </p>
                    <div className="mt-3 p-3 bg-zinc-100 rounded-xl border border-zinc-200 flex gap-3">
                      <FileText className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-zinc-700 italic text-justify">
                        Source: Egbelu, P.J., & Tanchoco, J.M.A. (1984). Characterization of automatic guided vehicle dispatching rules. International Journal of Production Research, 22(3), 359-374. (Formally demonstrated through simulation that dispatching rule choice directly determines throughput in a multi-AGV, multi-workstation setting.)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

                    {/* Point 5 */}
          <div id="point-5" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
                <History className="w-6 h-6 text-zinc-900" />
              </div>
              <div className="w-full min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
                  5. How Were AGVs Controlled? Evolution of Dispatching and Control Architecture
                </h2>
                <div className="text-zinc-800 leading-relaxed space-y-6 text-justify">
                  <p>The evolution happened in <strong className="text-zinc-900 font-semibold">4 clear eras</strong>, with dispatching intelligence and control architecture co-evolving together:</p>
                  
                  <div className="space-y-8">
                    {/* Era 1 */}
                    <div className="pl-4 border-l-2 border-zinc-200">
                      <h3 className="font-bold text-zinc-900 mb-2">Era 1, Wire-Guided, Centralized Human Control (1950s-1980s)</h3>
                      <ul className="space-y-2 text-zinc-700">
                        <li><strong className="text-zinc-900 font-semibold">Navigation:</strong> AGVs followed a physical wire embedded in the factory floor. The wire carried an electromagnetic signal; the AGV simply steered to stay above it. No onboard intelligence whatsoever.</li>
                        <li><strong className="text-zinc-900 font-semibold">Control Architecture:</strong> A <strong className="text-zinc-900 font-semibold">central human operator</strong> (or a rudimentary computer) had full authority. The operator could see the floor and manually radio instructions to individual vehicles. Think of it as a traffic policeman directing each car individually.</li>
                        <li><strong className="text-zinc-900 font-semibold">Dispatching Logic:</strong> Purely reactive. First-come-first-served, or send the nearest vehicle. No optimisation.</li>
                        <li><strong className="text-zinc-900 font-semibold">The fundamental limitation:</strong> All intelligence, and all information, had to sit in one place. If the central controller was slow or wrong, the entire fleet suffered.</li>
                      </ul>
                    </div>

                    {/* Era 2 */}
                    <div className="pl-4 border-l-2 border-zinc-200">
                      <h3 className="font-bold text-zinc-900 mb-2">Era 2, Rule-Based Dispatching, Centralised Fleet Management Systems (1980s-1990s)</h3>
                      <ul className="space-y-2 text-zinc-700">
                        <li><strong className="text-zinc-900 font-semibold">Navigation:</strong> Still wire or magnetic strip guided, but onboard microcontrollers now allowed AGVs to execute basic decisions locally, stop, turn, report position.</li>
                        <li><strong className="text-zinc-900 font-semibold">Control Architecture:</strong> The <strong className="text-zinc-900 font-semibold">Fleet Management System (FMS)</strong> emerged, a dedicated central computer that tracked all AGV positions (via floor sensors or RF check-ins) and assigned tasks. This was still fundamentally centralised: every dispatching decision came from the FMS. AGVs were executors, not thinkers.</li>
                        <li><strong className="text-zinc-900 font-semibold">Dispatching Logic:</strong> This is where Egbelu & Tanchoco (1984) made their landmark contribution. They formally characterised and mathematically defined all dispatching rules, Nearest Vehicle, Longest Idle Vehicle, Minimum Remaining Queue Space, First-Come-First-Served, giving the FMS a structured playbook to follow.</li>
                      </ul>
                      <div className="mt-3 p-3 bg-zinc-100 rounded-xl border border-zinc-200 flex gap-3">
                        <FileText className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-zinc-700 italic text-justify">Egbelu, P.J., & Tanchoco, J.M.A. (1984). Characterization of automatic guided vehicle dispatching rules. International Journal of Production Research, 22(3), 359-374.</p>
                      </div>
                      <p className="mt-3 text-zinc-700 text-justify"><strong className="text-zinc-900 font-semibold">The fundamental limitation:</strong> The FMS had a complete picture but used simple rules. The rules worked well in small, stable factories. As fleet sizes grew and layouts became complex, simple rules caused deadlocks and throughput collapse, documented precisely in Egbelu & Tanchoco's "Locking Phenomenon."</p>
                    </div>

                    {/* Era 3 */}
                    <div className="pl-4 border-l-2 border-zinc-200">
                      <h3 className="font-bold text-zinc-900 mb-2">Era 3, Optimisation-Based Dispatching, Hierarchical Control (1990s-2000s)</h3>
                      <ul className="space-y-2 text-zinc-700">
                        <li><strong className="text-zinc-900 font-semibold">Navigation:</strong> Laser-guided and vision-based AGVs emerged. AGVs could now navigate on open floors without wires, computing their own local paths from a map.</li>
                        <li><strong className="text-zinc-900 font-semibold">Control Architecture:</strong> A <strong className="text-zinc-900 font-semibold">hierarchical two-layer architecture</strong> became standard. The <em>Top layer (Central)</em> FMS handles global task assignment (which AGV goes where). The <em>Bottom layer (Onboard)</em> handles local navigation and obstacle avoidance (how to get there).</li>
                        <li><strong className="text-zinc-900 font-semibold">Dispatching Logic:</strong> Operations Research took over, Mixed-Integer Programming (MIP), Genetic Algorithms. The goal was mathematically optimal global assignment.</li>
                      </ul>
                      <div className="mt-3 p-3 bg-zinc-100 rounded-xl border border-zinc-200 flex gap-3">
                        <FileText className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-zinc-700 italic text-justify">Kim, K.H., & Bae, J.W. (2004). A look-ahead dispatching method for AGVs in automated port container terminals. Transportation Science, 38(2), 224-240. (Their look-ahead MIP got within 2.8% of optimal but required runtimes exceeding 1 minute per decision, making real-time use infeasible.)</p>
                      </div>
                      <p className="mt-3 text-zinc-700 text-justify"><strong className="text-zinc-900 font-semibold">The fundamental limitation:</strong> The central FMS now had a powerful brain but it was <em>slow</em>. Solving a MIP takes minutes. A factory floor cannot wait minutes for a dispatching decision. More critically, both the FMS and the optimisation models assumed they had perfect, accurate, real-time information, an assumption that real factory floors violate constantly.</p>
                    </div>

                    {/* Era 4 */}
                    <div className="pl-4 border-l-2 border-zinc-200">
                      <h3 className="font-bold text-zinc-900 mb-2">Era 4, AI/ML Dispatching, Edge Intelligence and Decentralised Control (2010s-Present)</h3>
                      <ul className="space-y-2 text-zinc-700">
                        <li><strong className="text-zinc-900 font-semibold">Navigation:</strong> LiDAR, camera-based SLAM (Simultaneous Localisation and Mapping), GPS-fused systems. AGVs now build and update their own maps in real time.</li>
                        <li><strong className="text-zinc-900 font-semibold">Control Architecture:</strong> The shift from pure centralisation to <strong className="text-zinc-900 font-semibold">Edge Computing</strong>. Processing happens <em>at or near the vehicle</em>, on the AGV's own onboard computer or on a nearby edge server. This dramatically reduces latency. In the most advanced systems, individual AGVs negotiate with each other directly via <strong className="text-zinc-900 font-semibold">vehicle-to-vehicle (V2V) communication</strong>.</li>
                      </ul>
                      <div className="mt-3 p-3 bg-zinc-100 rounded-xl border border-zinc-200 flex gap-3">
                        <FileText className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-zinc-700 italic text-justify">Shi, W., Cao, J., Zhang, Q., Li, Y., & Xu, L. (2016). Edge computing: Vision and challenges. IEEE Internet of Things Journal, 3(5), 637-646.</p>
                      </div>
                      <div className="mt-3">
                        <p className="font-semibold text-zinc-900 text-justify">Dispatching Logic (Machine Learning replaces rules & slow optimisers):</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-700">
                          <li><strong className="text-zinc-900">Online Preference Learning (Choe et al., 2016):</strong> A neural network trained in real time, generating dispatching decisions in under 1 millisecond.</li>
                          <li><strong className="text-zinc-900">Deep Q-Networks / DRL (Zheng et al., 2022):</strong> A DQN agent learning dispatching policy through trial and error in simulation.</li>
                        </ul>
                      </div>
                      <div className="mt-3 p-3 bg-zinc-100 rounded-xl border border-zinc-200 space-y-2">
                        <div className="flex gap-3">
                          <FileText className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-zinc-700 italic text-justify">Choe, R., Kim, J., & Ryu, K.R. (2016). Online preference learning for adaptive dispatching of AGVs. Applied Soft Computing, 48, 285-296.</p>
                        </div>
                        <div className="flex gap-3">
                          <FileText className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-zinc-700 italic text-justify">Zheng, X. et al. (2022). Multi-AGV dynamic scheduling: A deep reinforcement learning approach. Mathematics, 10(22), 4575.</p>
                        </div>
                      </div>
                      
                      <p className="mt-4 p-4 bg-zinc-900 text-white rounded-2xl font-medium shadow-sm">
                        <strong className="text-amber-400">The connection to Industry 4.0:</strong> The Kagermann et al. (2013) Industry 4.0 blueprint explicitly called for <em>decentralised decision-making</em>, moving control closer to the physical process. Modern AI-driven AGV dispatching, where each vehicle can hold an intelligent policy and make local decisions informed by global fleet state, is the direct realisation of this vision.
                      </p>
                    </div>
                  </div>

                  {/* Summary Table */}
                  <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-zinc-100 text-zinc-900 font-semibold border-b border-zinc-200">
                        <tr>
                          <th className="px-4 py-3 border-r border-zinc-200">Era</th>
                          <th className="px-4 py-3 border-r border-zinc-200">Period</th>
                          <th className="px-4 py-3 border-r border-zinc-200">Navigation</th>
                          <th className="px-4 py-3 border-r border-zinc-200">Control Architecture</th>
                          <th className="px-4 py-3">Dispatching Logic</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 text-zinc-700 bg-white">
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-medium">1</td>
                          <td className="px-4 py-3 border-r border-zinc-200">1950s-80s</td>
                          <td className="px-4 py-3 border-r border-zinc-200">Wire-guided</td>
                          <td className="px-4 py-3 border-r border-zinc-200">Central human operator</td>
                          <td className="px-4 py-3">FCFS, Nearest</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-medium">2</td>
                          <td className="px-4 py-3 border-r border-zinc-200">1980s-90s</td>
                          <td className="px-4 py-3 border-r border-zinc-200">Wire/magnetic</td>
                          <td className="px-4 py-3 border-r border-zinc-200">Central FMS</td>
                          <td className="px-4 py-3">Rule-based (Egbelu 1984)</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-medium">3</td>
                          <td className="px-4 py-3 border-r border-zinc-200">1990s-2000s</td>
                          <td className="px-4 py-3 border-r border-zinc-200">Laser/vision</td>
                          <td className="px-4 py-3 border-r border-zinc-200">Hierarchical (Central + Local)</td>
                          <td className="px-4 py-3">MIP, GA (Kim & Bae 2004)</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-medium">4</td>
                          <td className="px-4 py-3 border-r border-zinc-200">2010s-Now</td>
                          <td className="px-4 py-3 border-r border-zinc-200">LiDAR/SLAM</td>
                          <td className="px-4 py-3 border-r border-zinc-200">Edge + Decentralised (V2V)</td>
                          <td className="px-4 py-3">Online ML, DRL (Zheng 2022)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </div>
          </div>

                    {/* Point 6 */}
          <div id="point-6" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
                <AlertTriangle className="w-6 h-6 text-zinc-900" />
              </div>
              <div className="w-full min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
                  6. What Challenges Did AGV Usage Bring In?
                </h2>
                <div className="text-zinc-800 leading-relaxed space-y-6 text-justify">
                  <p>AGVs solved the labour and safety problem but created an entirely new class of engineering and optimisation challenges. A landmark survey by Vis (2006) formally categorised these into <strong className="text-zinc-900 font-semibold">distinct, interrelated sub-problems</strong>, each requiring separate research attention:</p>
                  
                  <div className="p-4 bg-zinc-100 rounded-2xl border border-zinc-200 flex gap-3">
                    <FileText className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-zinc-700 italic text-justify">Vis, I.F.A. (2006). Survey of research in the design and control of automated guided vehicle systems. European Journal of Operational Research, 170(3), 677-709. (The primary taxonomic reference for all AGV challenges).</p>
                    </div>
                  </div>

                  <div className="my-6 rounded-2xl overflow-hidden border border-zinc-200 shadow-sm">
                    <img 
                      src="/background/agv_8_challenges.jpg" 
                      alt="The Eight Key Challenges of AGV Usage" 
                      className="w-full object-contain"
                    />
                    <div className="bg-zinc-100 px-4 py-3 text-xs text-zinc-700 font-medium text-center border-t border-zinc-200">
                      Visual taxonomy of the eight interdependent challenges introduced by AGV usage.
                    </div>
                  </div>

                  <div className="space-y-6 mt-6">
                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg mb-1">Challenge 1: Guide Path Layout Design</h3>
                      <p>Before any AGV moves, someone must decide <em>where the roads go</em>. In a factory or warehouse, this means designing the directed graph of paths, one-way lanes, intersections, loop structures, that all AGVs must follow. A poor layout creates structural bottlenecks that no amount of clever dispatching can fix.</p>
                      <p className="text-sm text-zinc-700 italic mt-1 text-justify">Egbelu, P.J., & Tanchoco, J.M.A. (1984) demonstrated through their factory simulation that layout directly determines whether certain dispatching rules cause gridlock.</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg mb-1">Challenge 2: Fleet Sizing</h3>
                      <p>How many AGVs does a facility actually need? Too few: workstations starve, throughput collapses. Too many: AGVs interfere with each other, congestion increases, and the marginal vehicle actually <em>reduces</em> system productivity. Fleet sizing is a strategic decision that depends on the layout, the task arrival rate, and the dispatching policy, meaning all three problems are interdependent.</p>
                      <p className="text-sm text-zinc-700 italic mt-1 text-justify">Carlo, H.J., Vis, I.F.A., & Roodbergen, K.J. (2014) explicitly list fleet sizing as one of the three core transport decision problems.</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg mb-1">Challenge 3: Routing and Conflict-Free Pathfinding</h3>
                      <p>Once an AGV is assigned a task, it must find a <em>path</em> from its current position to the destination. In a multi-AGV environment this is not trivial, two AGVs heading toward each other on a one-way lane create a conflict. Computing collision-free paths for an entire fleet simultaneously is computationally hard.</p>
                      <p className="mt-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-sm text-zinc-700 text-justify">
                        <strong className="text-zinc-900">Note:</strong> Routing and dispatching are frequently confused but are formally distinct problems. <strong>Routing</strong> is static path planning; <strong>Dispatching</strong> is dynamic real-time task assignment (Carlo et al., 2014). They are typically decoupled, with routing handled by lower-level controllers (Grunow, M., Günther, H.O., & Lehmann, M., 2006).
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg mb-1">Challenge 4: Deadlock and Traffic Management</h3>
                      <p>Multiple AGVs sharing narrow paths can enter gridlock, a circular waiting condition where no vehicle can move because each is blocked by another. This is not a theoretical edge case; it is a real, documented failure mode.</p>
                      <p className="text-sm text-zinc-700 italic mt-1 text-justify">Egbelu & Tanchoco (1984) showed the Shortest Travel Distance rule caused complete factory gridlock, dropping throughput from ~770 unit loads to near zero. They termed this the "Locking Phenomenon."</p>
                      <p className="mt-2">Two mitigation strategies exist: <strong>deadlock prevention</strong> (zone control) and <strong>deadlock resolution</strong> (detect and untangle). Both add operational overhead.</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg mb-1">Challenge 5: Dispatching Complexity</h3>
                      <p>With <em>n</em> AGVs and <em>m</em> tasks, the number of possible assignment combinations is factorial in scale. Finding the globally optimal assignment is NP-hard. Exact mathematical solvers (like MIP) can find the optimal answer, but too slowly for real-time use.</p>
                      <p className="text-sm text-zinc-700 italic mt-1 text-justify">Kim, K.H., & Bae, J.W. (2004) required runtimes exceeding 1 minute per dispatching decision using exact MIP, forcing them to use a look-ahead heuristic.</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg mb-1">Challenge 6: Dynamic Re-planning Under Disruption</h3>
                      <p>Real facilities are not static. An AGV breaks down mid-route. A machine finishes early. A new urgent job arrives. Any such event can invalidate an entire pre-computed schedule, requiring expensive re-optimisation from scratch, during which the fleet operates blind.</p>
                      <p className="text-sm text-zinc-700 italic mt-1 text-justify">Grunow et al. (2006) concluded that offline schedules are near-optimal in stable conditions but fragile under uncertainty.</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg mb-1">Challenge 7: Synchronisation With Other Automated Equipment</h3>
                      <p>In facilities where AGVs interact with other machines, robotic arms, cranes, conveyors, both sides must be ready simultaneously. The AGV cannot load itself; the machine cannot hold a part indefinitely. Any timing mismatch causes the more expensive piece of equipment to sit idle.</p>
                      <p className="text-sm text-zinc-700 italic mt-1 text-justify">Carlo et al. (2014) noted that because AGVs are non-lifting, both the AGV and crane must be present simultaneously. "Any inefficiency here causes a complete system bottleneck."</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg mb-1">Challenge 8: Battery Management and Charging Scheduling</h3>
                      <p>AGVs are battery-powered. A vehicle running low on charge mid-task must either abandon the task or finish it before heading to a charging station. Deciding <em>when</em> to charge, <em>which</em> vehicle to recall, and <em>which</em> station to send it to, without disrupting the fleet, is a scheduling problem layered on top of dispatching.</p>
                      <p className="text-sm text-zinc-700 italic mt-1 text-justify">Yang, X., Hu, H., et al. (2025). AGV Scheduling in Automated Container Terminals Considering Multi-Load Strategy and Charging Requirements. International Journal of Production Research, 63(23).</p>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-cyan-50/50 rounded-2xl border border-cyan-100">
                    <h3 className="font-bold text-cyan-900 text-lg mb-2">The Core Insight: These Challenges Are Interdependent</h3>
                    <p className="text-cyan-800">
                      The reason AGV management is genuinely hard is that none of these eight challenges can be solved in isolation. The fleet size affects deadlock probability. The routing policy affects dispatching options. The charging schedule affects vehicle availability. A dispatching decision that looks optimal right now may cause a deadlock 3 moves later.
                    </p>
                    <p className="text-cyan-800 mt-2 font-medium">
                      This interdependence is precisely why simple rules (Era 2) and even sophisticated optimisers (Era 3) eventually reach their limits, and why adaptive, learned policies (Era 4 / DRL) are the current frontier.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Point 7 */}
          <div id="point-7" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
                <Anchor className="w-6 h-6 text-zinc-900" />
              </div>
              <div className="w-full min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
                  7. Why Ports and ACTs Specifically?
                </h2>
                <div className="text-zinc-800 leading-relaxed space-y-4 text-justify">
                  <p>Three reasons why container ports represent one of the most critical and most studied application of AGV technology:</p>
                  
                  <div>
                    <h3 className="font-bold text-zinc-900 text-lg mb-1">a) The Scale is Unprecedented</h3>
                    <p>Modern Ultra-Large Container Ships (ULCS) carry up to 24,000 TEU in a single voyage. A typical port call involves offloading thousands of containers within a tight schedule. No other industry operates AGVs at this volume. (Approximately 80% of global trade by volume is carried by sea, UNCTAD).</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-zinc-900 text-lg mb-1">b) The Economic Penalty for Delay is Enormous</h3>
                    <p>A large container vessel costs approximately $50,000-100,000 per day in port fees and charter rates. Every minute a Quay Crane sits idle waiting for an AGV translates directly into dollar losses. No other AGV application has this level of economic urgency.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-zinc-900 text-lg mb-1">c) Ports Were Early and Aggressive Adopters</h3>
                    <p>The ECT Delta Terminal in Rotterdam (1993) was the world's first fully automated container terminal using AGVs. Since then, major ports (HHLA Hamburg, PSA Singapore, Port of LA) have invested heavily in full automation, providing decades of real operational data.</p>
                  </div>
                  
                  <div className="my-6 rounded-2xl overflow-hidden border border-zinc-200">
                    <img 
                      src="/background/port_scale.jpg" 
                      alt="Massive automated container terminal highlighting scale" 
                      className="w-full h-auto object-contain"
                    />
                    <div className="bg-zinc-100 px-4 py-2 text-xs text-zinc-700 font-medium text-center border-t border-zinc-200">
                      The unprecedented scale of modern Automated Container Terminals.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

                    {/* Point 8 */}
          <div id="point-8" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
                <Ship className="w-6 h-6 text-zinc-900" />
              </div>
              <div className="w-full min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
                  8. AGVs in ACTs
                </h2>
                <div className="text-zinc-800 leading-relaxed space-y-4 text-justify">
                  <p>In an Automated Container Terminal (ACT), the AGV acts as the circulatory system of the port. The precise flow of an import container is a rigidly coupled chain:</p>
                  
                  <div className="py-2 flex items-center justify-start lg:justify-center gap-1 sm:gap-2 text-xs font-medium overflow-x-auto w-full pb-4 px-1">
                    <div className="flex flex-col items-center gap-1.5 p-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 min-w-[70px] shrink-0">
                      <Ship className="w-4 h-4" />
                      <span>Ship</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-zinc-300 shrink-0" />
                    <div className="flex flex-col items-center gap-1.5 p-2 bg-cyan-50 text-cyan-700 rounded-xl border border-cyan-100 min-w-[70px] shrink-0">
                      <Anchor className="w-4 h-4" />
                      <span className="text-center leading-tight">Quay<br/>Crane</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-zinc-300 shrink-0" />
                    <div className="flex flex-col items-center gap-1.5 p-2 bg-zinc-900 text-white rounded-xl shadow-md min-w-[70px] shrink-0">
                      <Truck className="w-4 h-4 text-zinc-300" />
                      <span>AGV</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-zinc-300 shrink-0" />
                    <div className="flex flex-col items-center gap-1.5 p-2 bg-purple-50 text-purple-700 rounded-xl border border-purple-100 min-w-[70px] shrink-0">
                      <Box className="w-4 h-4" />
                      <span className="text-center leading-tight">I/O<br/>Point</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-zinc-300 shrink-0" />
                    <div className="flex flex-col items-center gap-1.5 p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 min-w-[70px] shrink-0">
                      <Construction className="w-4 h-4" />
                      <span className="text-center leading-tight">Yard<br/>Crane</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-zinc-300 shrink-0" />
                    <div className="flex flex-col items-center gap-1.5 p-2 bg-orange-50 text-orange-700 rounded-xl border border-orange-100 min-w-[70px] shrink-0">
                      <Layers className="w-4 h-4" />
                      <span className="text-center leading-tight">Yard<br/>Block</span>
                    </div>
                  </div>

                  <p>AGVs occupy the <strong className="text-zinc-900 font-semibold">Transport Area</strong>, the critical, high-traffic middle link between the seaside and the storage yard.</p>

                  <div className="bg-zinc-100 border border-zinc-200 p-5 rounded-2xl mt-6">
                    <p className="font-bold text-zinc-900 mb-2 text-lg text-justify">The Exact Mechanical Handoff (The Synchronisation Bottleneck):</p>
                    <p className="text-zinc-700 text-justify">Because AGVs are formally classified as non-lifting transfer vehicles (Carlo et al., 2014), they cannot pick up or drop off a container on the ground. They must drive to a designated Transfer Point (I/O point) and wait. The QC must lower the container directly onto the AGV chassis, and later, the AYC must lift it directly off.</p>
                    <p className="text-zinc-900 font-medium mt-3 text-justify">This creates a rigid temporal coupling: if a crane is delayed by just two minutes, the assigned AGV is paralyzed, unable to move or take new jobs.</p>
                  </div>

                  <div className="my-8 rounded-2xl overflow-hidden border border-zinc-200 shadow-sm">
                    <img 
                      src="/background/port_cranes.jpg" 
                      alt="Quay Cranes loading an automated container terminal" 
                      className="w-full h-auto object-contain"
                    />
                    <div className="bg-zinc-100 px-4 py-3 text-xs text-zinc-700 font-medium text-center border-t border-zinc-200">
                      Quay Cranes interfacing with the transport area.
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <p className="font-bold text-zinc-900 text-lg mb-4 text-justify">Key physical and kinematic constraints unique to ACTs:</p>
                    <p className="text-zinc-700 mb-4 text-justify">Based on the foundational terminal blueprints by Liu et al. (2001) and Grunow et al. (2006), AGV dispatching is governed by strict physical realities:</p>
                    
                    <ul className="space-y-4 text-zinc-700">
                      <li className="flex gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-cyan-500 shrink-0"></div>
                        <div>
                          <strong className="text-zinc-900 font-semibold">Kinematic Penalties (Speed):</strong> AGV velocities are highly state-dependent. An empty AGV typically travels at ~10 mph, but once loaded with a 30-ton container, its speed drops by 50% (to ~5 mph).
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-cyan-500 shrink-0"></div>
                        <div>
                          <strong className="text-zinc-900 font-semibold">Two-Tiered Road Networks:</strong> AGVs do not move freely like cars in a parking lot. The graph is divided into Transit Roads (high-speed vertical/horizontal arteries where stopping is forbidden) and Working Roads (local lanes under the cranes where loading/unloading occurs).
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-cyan-500 shrink-0"></div>
                        <div>
                          <strong className="text-zinc-900 font-semibold">Low-Level Traffic Abstraction:</strong> To prevent empty, fast-moving AGVs from rear-ending slow, loaded AGVs, ports utilize hardware-level "Low-Speed Zones" and maintain strict 45-foot inter-vehicle safety spacings. Intersections are handled locally via "Modified First Come First Pass" rules, abstracting collision physics away from the high-level dispatcher.
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-cyan-500 shrink-0"></div>
                        <div>
                          <strong className="text-zinc-900 font-semibold">Throughput Saturation (The 48-AGV Limit):</strong> Fleet scaling is non-linear. For a terminal with 5 QCs operating at 42 moves/hour, productivity mathematically flattens at ~48 AGVs. Injecting a 49th AGV yields zero extra throughput; it merely adds to intersection congestion and queue waiting times.
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-cyan-500 shrink-0"></div>
                        <div>
                          <strong className="text-zinc-900 font-semibold">Workload Distribution:</strong> Container flow is not perfectly uniform. In a typical unloading cycle, jobs are stochastically distributed: ~70% route to the main storage yard, ~18% route directly to the truck gate buffers, and ~12% route to rail train buffers.
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="my-8 rounded-2xl overflow-hidden border border-zinc-200 shadow-sm">
                    <img 
                      src="/background/terminal_layout.png" 
                      alt="General layout of automated container terminals" 
                      className="w-full object-contain"
                    />
                    <div className="bg-zinc-100 px-4 py-3 text-xs text-zinc-700 font-medium text-center border-t border-zinc-200">
                      The general layout of automated container terminals (Liu et al., 2001).
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

                    
          {/* Point 9 */}
          <div id="point-9" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-zinc-900 rounded-xl shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="w-full min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
                  9. The Modern Scale: $20 Billion Terminals & The AIV Transition
                </h2>
                
                <div className="text-zinc-800 leading-relaxed space-y-6 text-justify">
                  <p>
                    As global trade explodes, Automated Container Terminals are reaching unprecedented scales. Shanghai's Yangshan Port, built on offshore islands in the East China Sea for over <strong>$20 Billion</strong>, handled nearly <strong>49 million TEUs</strong> in a single year. At this magnitude, the <em>dispatching problem</em> ceases to be an academic exercise and becomes a critical macroeconomic bottleneck.
                  </p>

                  <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                    <h3 className="font-bold text-indigo-950 mb-3 text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-indigo-600" /> The Butterfly Effect of Dispatching
                    </h3>
                    <p className="text-indigo-900 mb-3 text-justify text-sm">
                      At a scale of 25,000 containers processed a day, traditional port management margins vanish. A sub-optimal dispatching rule that delays an AGV by a mere <strong>1 second per container</strong> compounds into nearly <strong>7 hours of lost time</strong> across the terminal within 24 hours. This compounding delay is enough to disrupt the transfer of goods from multiple cargo ships, threatening to jam an entire regional supply chain.
                    </p>
                  </div>

                  <p>
                    To combat this, the bleeding edge of port automation is actively shifting away from traditional magnetic-guided AGVs to the next generation of autonomous hardware:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                      <h4 className="font-bold text-zinc-900 mb-3 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-zinc-500" /> Traditional AGVs (Legacy)
                      </h4>
                      <ul className="space-y-2 text-sm text-zinc-600 list-disc pl-4">
                        <li><strong>Blind Navigation:</strong> Strictly follow magnetic nails embedded in the concrete.</li>
                        <li><strong>Rigid Layouts:</strong> Susceptible to single-file deadlocks.</li>
                        <li><strong>High Infrastructure Cost:</strong> Rebar cannot be placed within 30cm of the surface.</li>
                      </ul>
                    </div>

                    <div className="bg-zinc-900 text-white p-6 rounded-2xl border border-zinc-800 shadow-lg">
                      <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-indigo-400" /> AIVs (The 2026 Reality)
                      </h4>
                      <ul className="space-y-2 text-sm text-zinc-300 list-disc pl-4">
                        <li><strong>Smart Navigation:</strong> LIDAR/GPS based, capable of mixed-traffic routing.</li>
                        <li><strong>45 km/h Top Speeds:</strong> Highly kinetic parallel layouts drastically cut cycle times.</li>
                        <li><strong>75% Cheaper:</strong> Economy of scale allows massive, high-density fleets.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 border-l-4 border-emerald-500 pl-4 py-2 bg-emerald-50/50 rounded-r-xl">
                    <p className="text-sm text-zinc-800 font-medium text-justify">
                      <em>Note for this research:</em> While this thesis adheres to the traditional industry acronym "AGV", the simulated kinematic constraints, fleet densities, and absence of rigid single-lane deadlocks are mathematically modeled on the capabilities of modern AIVs operating in state-of-the-art parallel terminals (like Shanghai's Luo Jing port).
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>

{/* Point 10 */}
          <div id="point-10" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
                <History className="w-6 h-6 text-zinc-900" />
              </div>
              <div className="w-full min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
                  10. The Evolution of Dispatching: A 40-Year Quest for Optimality
                </h2>
                <div className="text-zinc-800 leading-relaxed text-justify mb-8">
                  <p>How do you assign <span className="font-semibold italic">N</span> tasks to <span className="font-semibold italic">M</span> AGVs? Over the last four decades, the approach to this problem has evolved through five distinct eras, driven by the increasing complexity of Automated Container Terminals.</p>
                </div>

                {/* Vertical Flowchart */}
                <div className="relative border-l-2 border-zinc-200 ml-4 md:ml-8 space-y-8 pb-4">
                  
                  {/* Era 1 */}
                  <div className="relative pl-6 md:pl-8">
                    <div className="absolute w-4 h-4 rounded-full bg-blue-500 -left-[9px] top-1 ring-4 ring-white" />
                    <h3 className="font-bold text-zinc-900 text-lg mb-1">
                      1. The Reactive Rule-Based Era <span className="text-sm font-medium text-zinc-500 ml-2">(1980s to 1990s)</span>
                    </h3>
                    <p className="text-zinc-700 mb-2 text-justify">Early dispatching relied on static, human-designed heuristics.</p>
                    <div className="space-y-2 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                      <p className="text-justify"><strong className="text-zinc-900">Methods:</strong> First-Come-First-Serve (FCFS), Nearest Vehicle, and Shortest Queue First (SQF).</p>
                      <p className="text-justify"><strong className="text-red-700">The Problem:</strong> While computationally instant, these rules are purely "myopic" (short-sighted). Egbelu & Tanchoco (1984) proved that acting locally without seeing the global picture eventually leads to systemic bottlenecks and terminal deadlocks.</p>
                    </div>
                  </div>

                  {/* Era 2 */}
                  <div className="relative pl-6 md:pl-8">
                    <div className="absolute w-4 h-4 rounded-full bg-cyan-500 -left-[9px] top-1 ring-4 ring-white" />
                    <h3 className="font-bold text-zinc-900 text-lg mb-1">
                      2. The Operations Research (OR) Era <span className="text-sm font-medium text-zinc-500 ml-2">(1990s to 2000s)</span>
                    </h3>
                    <p className="text-zinc-700 mb-2 text-justify">To fix the short-sightedness of basic rules, engineers turned to exact mathematical optimization.</p>
                    <div className="space-y-2 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                      <p className="text-justify"><strong className="text-zinc-900">Methods:</strong> Mixed-Integer Linear Programming (MILP) and Discrete Event Simulation (DES).</p>
                      <p className="text-justify"><strong className="text-red-700">The Problem:</strong> MILP guarantees a mathematically perfect, globally optimal schedule (Grunow et al., 2006). However, the computation time grows exponentially. Solving a large port assignment takes minutes to hours, making it impossible to use for split-second, real-time routing.</p>
                    </div>
                  </div>

                  {/* Era 3 */}
                  <div className="relative pl-6 md:pl-8">
                    <div className="absolute w-4 h-4 rounded-full bg-purple-500 -left-[9px] top-1 ring-4 ring-white" />
                    <h3 className="font-bold text-zinc-900 text-lg mb-1">
                      3. The Meta-Heuristic Era <span className="text-sm font-medium text-zinc-500 ml-2">(2000s to 2010s)</span>
                    </h3>
                    <p className="text-zinc-700 mb-2 text-justify">To speed up the math, researchers traded "perfect" optimization for "good enough" approximations.</p>
                    <div className="space-y-2 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                      <p className="text-justify"><strong className="text-zinc-900">Methods:</strong> Genetic Algorithms (GA), Simulated Annealing, and Greedy Search.</p>
                      <p className="text-justify"><strong className="text-red-700">The Problem:</strong> While much faster than MILP, GAs still compute offline, rigid schedules. They assume the terminal will behave exactly as predicted. If a single AGV is delayed by 30 seconds, the entire pre-computed schedule shatters, forcing the system to pause and re-calculate.</p>
                    </div>
                  </div>

                  {/* Era 4 */}
                  <div className="relative pl-6 md:pl-8">
                    <div className="absolute w-4 h-4 rounded-full bg-orange-500 -left-[9px] top-1 ring-4 ring-white" />
                    <h3 className="font-bold text-zinc-900 text-lg mb-1">
                      4. The Early Reinforcement Learning Era <span className="text-sm font-medium text-zinc-500 ml-2">(2010s)</span>
                    </h3>
                    <p className="text-zinc-700 mb-2 text-justify">The paradigm shifted from pre-computing schedules to learning dynamic policies.</p>
                    <div className="space-y-2 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                      <p className="text-justify"><strong className="text-zinc-900">Methods:</strong> Tabular Q-Learning.</p>
                      <p className="text-justify"><strong className="text-red-700">The Problem:</strong> Early RL agents successfully learned to adapt in real-time (Choe et al., 2016). However, they relied on lookup tables. As the number of AGVs and containers increased, they suffered from the Curse of Dimensionality (Zheng et al., 2022), the state space grew so massive that computers literally ran out of memory trying to store the Q-table.</p>
                    </div>
                  </div>

                  {/* Era 5 */}
                  <div className="relative pl-6 md:pl-8">
                    <div className="absolute w-4 h-4 rounded-full bg-emerald-500 -left-[9px] top-1 ring-4 ring-white shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <h3 className="font-bold text-zinc-900 text-lg mb-1">
                      5. The Multi-Agent Deep RL Era <span className="text-sm font-medium text-zinc-500 ml-2">(2020s, Present)</span>
                    </h3>
                    <p className="text-zinc-700 mb-2 text-justify">This brings us to the bleeding edge of current research. Deep Neural Networks replaced Q-tables, allowing agents to generalize vast state spaces.</p>
                    <div className="space-y-2 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                      <p className="text-justify"><strong className="text-zinc-900">Methods:</strong> Deep Q-Networks (DQN), Proximal Policy Optimization (PPO), and ultimately Multi-Agent PPO (MAPPO).</p>
                      <p className="text-justify"><strong className="text-emerald-800">The Solution:</strong> PPO (Schulman et al., 2017) stabilized neural network training, and MAPPO (Yu et al., 2021) allowed dozens of AGVs to learn cooperatively. Instead of blindly following a rigid schedule, MAPPO agents observe the terminal in real-time and dynamically adjust their behavior to maximize global throughput.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

                    {/* Point 11 */}
          <div id="point-11" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-emerald-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 bg-emerald-50 rounded-bl-3xl">
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest">The Core Problem</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl shrink-0">
                <Dices className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="w-full min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4 pr-32">
                  11. The Unsolved Piece: The Stochasticity Problem
                </h2>
                <div className="text-zinc-800 leading-relaxed space-y-6 text-justify">
                  <p>The evolutionary timeline above reveals a glaring flaw in the classical methods (Rules, MILP, GA): <strong className="text-zinc-900 font-semibold">They assume the world is mathematically predictable.</strong></p>
                  <p>In a real Automated Container Terminal, operations are governed by severe stochastic (random) disruptions, all of which have been thoroughly documented in the literature:</p>
                  
                  <div className="overflow-x-auto rounded-xl border border-zinc-200">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-zinc-100 text-zinc-900 font-semibold border-b border-zinc-200">
                        <tr>
                          <th className="px-4 py-3 border-r border-zinc-200">Disruption Type</th>
                          <th className="px-4 py-3 border-r border-zinc-200">The Physical Reality</th>
                          <th className="px-4 py-3">Academic Proof / Citation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 bg-white">
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Crane Cycle Time Variability</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">QC handling times fluctuate. A container caught on a ship fitting adds unpredictable delay minutes.</td>
                          <td className="px-4 py-3 text-zinc-700 italic text-xs">Grunow et al. (2006) explicitly proved offline models fail by showing how doubling crane cycle variance shatters pre-computed schedules.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Container Reshuffling (Yard Delays)</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">To retrieve a bottom-tier container, the Yard Crane must move the boxes above it. This adds massive, random wait times for the AGV at the I/O point.</td>
                          <td className="px-4 py-3 text-zinc-700 italic text-xs">Liu et al. (2001) identified lack of reshuffling logic as the primary cause of severe Yard Crane idle times (70.2%) in terminal simulations.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Traffic Congestion & Deadlocks</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Actual AGV travel time depends on dynamic intersection bottlenecks, not mathematical shortest-path estimates.</td>
                          <td className="px-4 py-3 text-zinc-700 italic text-xs">Egbelu & Tanchoco (1984) documented the "Locking Phenomenon" where static dispatching causes total gridlock in high-traffic.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Battery Degradation & Failures</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">AGVs experience mid-route hardware failures or must abruptly drop out of the fleet for opportunistic charging.</td>
                          <td className="px-4 py-3 text-zinc-700 italic text-xs">Zheng et al. (2022) explicitly includes the real-time "working/idle status" as a required dynamic input for neural networks due to unpredictable AGV availability.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Weather & Environmental Constraints</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">High winds physically force QCs to operate at reduced speeds, while heavy rain or fog forces AGV sensor-guidance systems to slow down.</td>
                          <td className="px-4 py-3 text-zinc-700 italic text-xs">Grunow et al. (2006) specifically cited extreme weather variations as the primary motivation for needing reactive, online dispatching.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Vessel Arrival Uncertainty</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Ships rarely arrive exactly on schedule due to ocean weather. A 3-hour delay invalidates an entire 24-hour pre-computed port assignment.</td>
                          <td className="px-4 py-3 text-zinc-700 italic text-xs">Carlo et al. (2014) highlights that stochastic ready times are one of the most critical, yet ignored, variables in port routing.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">External Truck Gate Cascades</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Highway trucks arrive randomly at the city-side gate. This queueing unpredictability cascades backward into the AGV transport area.</td>
                          <td className="px-4 py-3 text-zinc-700 italic text-xs">Liu et al. (2001) proved using M/M/n Queueing Theory that gate arrival randomness directly impacts the required minimum buffer lanes.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="mt-4">When classical Operations Research methods face these disruptions, they either ignore them (causing performance to degrade severely) or they must re-solve the entire optimization from scratch, taking minutes to hours, during which the terminal operates blindly.</p>

                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 shadow-sm mt-6">
                    <p className="text-emerald-900 font-medium leading-relaxed">
                      Deep Reinforcement Learning (specifically MAPPO) fundamentally changes this. An RL agent acts as a variance stabilizer (Choe et al., 2016). It does not compute a fragile schedule; it learns a resilient policy. When a crane breaks, the MAPPO agents instantly and organically reroute, exactly like a human brain adapting to a blocked road.
                    </p>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-bold text-zinc-900 text-lg mb-3">The Quantitative Research Gap</h3>
                    <p className="mb-4">Despite this clear theoretical advantage, a landmark review of container terminal literature by Carlo et al. (2014) highlighted a massive gap in applied research. Of the 56 routing and dispatching papers reviewed:</p>
                    
                    <ul className="list-disc pl-5 space-y-2 text-zinc-700 font-medium mb-6">
                      <li>Only 13 (23%) considered stochastic ready times.</li>
                      <li>Only 5 (9%) considered stochastic due times.</li>
                      <li className="text-red-600 font-bold bg-red-50 p-1 px-2 rounded w-fit">Papers combining AGV dispatching with deep stochastic optimization = exactly 0.</li>
                    </ul>

                    <p className="bg-zinc-900 text-white p-5 rounded-2xl font-medium shadow-sm leading-relaxed">
                      <span className="text-amber-400 font-bold">This represents the precise research gap that this thesis aims to close.</span> In Phase 1, a single-agent <strong className="text-cyan-300">PPO</strong> policy is applied, for the first time in the ACT dispatching context, to a Gymnasium-based simulation with simultaneous stochastic disruptions, benchmarked against verified classical baselines. In Phase 2, this is extended to <strong className="text-cyan-300">MAPPO</strong> for decentralised multi-agent coordination across a full AGV fleet, evaluated under NeurIPS 2021 statistical standards (Agarwal et al.).
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>


                                        {/* Point 12 */}
          <div id="point-12" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-indigo-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 bg-indigo-50 rounded-bl-3xl">
              <span className="text-indigo-700 font-bold text-xs uppercase tracking-widest">State of the Art</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-indigo-100 rounded-xl shrink-0">
                <BookOpen className="w-6 h-6 text-indigo-700" />
              </div>
              <div className="w-full min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4 pr-32">
                  12. State of the Art in Stochastic AGV Dispatching, and the Gap
                </h2>
                <div className="text-zinc-800 leading-relaxed space-y-6 text-justify">
                  <p>The table below maps the complete evolutionary chain of AGV dispatching research, what stochasticity each approach handled, and the critical limitation that drove the next generation of research:</p>
                  
                  <div className="overflow-x-auto rounded-xl border border-zinc-200">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-zinc-100 text-zinc-900 font-semibold border-b border-zinc-200">
                        <tr>
                          <th className="px-4 py-3 border-r border-zinc-200 w-12 text-center">#</th>
                          <th className="px-4 py-3 border-r border-zinc-200">Methodology</th>
                          <th className="px-4 py-3 border-r border-zinc-200">Representative Work</th>
                          <th className="px-4 py-3 border-r border-zinc-200">Stochasticity Handled</th>
                          <th className="px-4 py-3">Critical Limitation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 bg-white">
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 text-center font-semibold text-zinc-500">1</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Rule-Based Dispatching</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Egbelu & Tanchoco (1984)</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">None, fully deterministic</td>
                          <td className="px-4 py-3 text-red-700">Collapses under disruption. The "Locking Phenomenon" proved the Nearest Vehicle rule causes complete gridlock under heavy load.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 text-center font-semibold text-zinc-500">2</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Mathematical Optimisation (MILP / OR)</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Kim & Bae (2004); Grunow et al. (2006)</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Empirical crane cycle variance modelled offline</td>
                          <td className="px-4 py-3 text-red-700">Runtimes exceed 1 minute per dispatching decision, computationally infeasible for real-time port use. Fragile: any disruption requires a full re-solve from scratch.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 text-center font-semibold text-zinc-500">3</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Meta-Heuristics (Genetic Algorithm / VNS)</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Grunow et al. (2006) benchmarks against GA; Yang et al. (2025) uses Variable Neighbourhood Search</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">None, GA computes rigid offline schedules under deterministic assumptions</td>
                          <td className="px-4 py-3 text-red-700">Produces near-optimal schedules in stable conditions but shatters the moment a disruption occurs. Cannot replan in real-time, any deviation requires rerunning the entire evolutionary search from scratch. Runtimes remain too slow for live port operations.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 text-center font-semibold text-zinc-500">4</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Uncertainty-Aware Optimisation</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Angeloudis & Bell (2010)</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Traffic uncertainty via a formal Uncertainty Index embedded in the objective function</td>
                          <td className="px-4 py-3 text-red-700">Only a 2-step look-ahead; no equipment failure or weather modelling. Still an offline optimiser, not a reactive real-time policy.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 text-center font-semibold text-zinc-500">5</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Tabular Q-Learning</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Failed baseline documented in Choe et al. (2016)</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Two-mode crane variance (stable T1 vs chaotic T2)</td>
                          <td className="px-4 py-3 text-red-700">Curse of Dimensionality, Q-table explodes exponentially with fleet size. Dominated by simple heuristics in all chaotic-condition tests. Cannot generalise to unseen terminal states.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 text-center font-semibold text-zinc-500">6</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Online Preference Learning (Neural Network)</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Choe et al. (2016), their proposed method</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Two-mode crane variance (stable T1 vs chaotic T2)</td>
                          <td className="px-4 py-3 text-red-700">Only one disruption source. Purely single-agent. Requires computationally expensive simulation rollouts at every decision step.</td>
                        </tr>
                        <tr className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 text-center font-semibold text-zinc-500">7</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-semibold text-zinc-900">Single-Agent DRL, DQN</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Zheng et al. (2022)</td>
                          <td className="px-4 py-3 border-r border-zinc-200 text-zinc-700">Dynamic task arrival timing</td>
                          <td className="px-4 py-3 text-red-700">No physical equipment failures, no cascading disruptions, no weather. Authors explicitly acknowledge action space explosion caps the method at ~12 AGVs. Centralised single controller.</td>
                        </tr>
                        <tr className="bg-indigo-50/50 hover:bg-indigo-50 transition-colors border-t-2 border-indigo-200">
                          <td className="px-4 py-3 border-r border-zinc-200 text-center font-bold text-indigo-600">8</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-bold text-indigo-900">Single-Agent DRL, PPO</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-bold text-indigo-700">This Thesis, Phase 1</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-medium text-indigo-800">Crane cycle variability + travel time noise + stochastic task arrivals, simultaneously</td>
                          <td className="px-4 py-3 text-indigo-600 font-semibold text-center">—</td>
                        </tr>
                        <tr className="bg-indigo-100/50 hover:bg-indigo-100/70 transition-colors">
                          <td className="px-4 py-3 border-r border-zinc-200 text-center font-bold text-indigo-700">9</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-bold text-indigo-950">Multi-Agent DRL, MAPPO</td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-bold text-indigo-800">This Thesis, Phase 2 <span className="block text-xs font-normal mt-1 opacity-80">(Yu et al. (2021) framework applied to ACT domain)</span></td>
                          <td className="px-4 py-3 border-r border-zinc-200 font-medium text-indigo-900">Simultaneous multi-source disruptions across a full decentralised AGV fleet</td>
                          <td className="px-4 py-3 text-indigo-600 font-semibold text-center">—</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8 space-y-6">
                    <h3 className="text-xl font-bold text-zinc-900 border-b border-zinc-200 pb-2">Three Structural Gaps That Emerge</h3>
                    
                    <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                      <h4 className="text-lg font-bold text-indigo-700 mb-2">Gap 1: Stochasticity Has Always Been Single-Source</h4>
                      <p className="text-zinc-700 mb-3 text-justify">Every paper from Row 1 to Row 7 introduces at most one type of disruption in isolation. No existing study simultaneously models crane cycle variability, AGV travel time noise, and stochastic task arrivals as co-occurring events, which is the reality of every operational shift in a live port.</p>
                      <div className="border-l-4 border-indigo-300 pl-4 py-2 text-sm bg-indigo-50/50 text-indigo-900 rounded-r-lg shadow-sm">
                        <strong className="font-semibold">Evidence:</strong> Carlo et al. (2014) reviewed 56 ACT papers published between 1993–2012. Papers combining AGV dispatching with stochastic optimisation = <strong>exactly zero.</strong>
                      </div>
                    </div>

                    <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                      <h4 className="text-lg font-bold text-indigo-700 mb-2">Gap 2: Neither GA nor DQN Has Been Replaced by PPO in the ACT Domain</h4>
                      <p className="text-zinc-700 mb-3 text-justify">Classical meta-heuristics (GA, VNS) compute rigid offline schedules that shatter under disruption. The only Deep RL attempt to break this pattern in the ACT dispatching context (Zheng, 2022) uses DQN, an older, less stable algorithm. PPO (Schulman et al., 2017) was developed precisely to address DQN's training instability and poor sample efficiency in high-dimensional environments, yet it has <strong className="text-zinc-900">never been applied to the ACT dispatching problem.</strong></p>
                      <div className="border-l-4 border-indigo-300 pl-4 py-2 text-sm bg-indigo-50/50 text-indigo-900 rounded-r-lg shadow-sm">
                        <strong className="font-semibold">Evidence:</strong> Zheng et al. (2022) themselves acknowledge their DQN formulation restricts the system to ~12 AGVs due to action space explosion, far below the 20–48 AGVs required by a real 5-QC terminal (Liu et al., 2001).
                      </div>
                    </div>

                    <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                      <h4 className="text-lg font-bold text-indigo-700 mb-2">Gap 3: Multi-Agent Coordination Has Never Been Applied to ACT Dispatching</h4>
                      <p className="text-zinc-700 text-justify">MAPPO (Yu et al., 2021) has been rigorously proven to outperform IPPO, QMIX, and MADDPG under chaotic cooperative multi-agent conditions. However, this has been demonstrated exclusively in game-theoretic benchmarks (StarCraft II, multi-robot coordination). Its application to the ACT domain, with port-realistic reward structures, crane synchronisation bottlenecks, I/O point constraints, and simultaneous stochastic disruptions, has never been attempted.</p>
                    </div>
                  </div>

                  <div className="mt-10 bg-indigo-50/50 border border-indigo-200 p-6 md:p-8 rounded-2xl shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                    <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
                      <Target className="w-6 h-6 text-indigo-600" />
                      The Proposed Contribution (Phased)
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-bold text-indigo-800 text-lg flex items-center gap-2 mb-2">
                          <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded shadow-sm">Phase 1</span> 
                          Thesis Core <span className="opacity-75 text-sm ml-1">(Target: October 2026)</span>
                        </h4>
                        <p className="text-indigo-900/80 leading-relaxed mb-3 font-medium">
                          Apply <strong className="text-indigo-900 font-bold">PPO</strong>, for the first time in the ACT dispatching context, to a reproducible Gymnasium-based simulation with simultaneous multi-source stochastic disruptions (crane cycle variability + travel time noise + dynamic task arrivals). Benchmark against three verified classical baselines:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-indigo-900/80 font-medium mb-3">
                          <li><strong>Greedy / Egbelu baseline</strong> <em className="opacity-80">(Egbelu & Tanchoco, 1984)</em></li>
                          <li><strong>Look-Ahead MIP baseline</strong> <em className="opacity-80">(Kim & Bae, 2004)</em></li>
                          <li><strong>Inventory-Based dispatching baseline</strong> <em className="opacity-80">(Briskorn et al., 2006)</em></li>
                        </ul>
                        <p className="text-indigo-900/80 leading-relaxed font-medium">
                          Generate <strong className="text-indigo-900 font-bold">degradation curves</strong>, showing how each approach degrades as stochasticity intensity increases, to provide a clean, visual proof of PPO's robustness advantage over all classical methods including GA.
                        </p>
                      </div>

                      <div className="border-t border-indigo-200/60 pt-6">
                        <h4 className="font-bold text-indigo-800 text-lg flex items-center gap-2 mb-2">
                          <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded shadow-sm">Phase 2</span> 
                          Thesis Extension <span className="opacity-75 text-sm ml-1">(October 2026 → May 2027)</span>
                        </h4>
                        <p className="text-indigo-900/80 leading-relaxed font-medium">
                          Extend the Phase 1 environment to <strong className="text-indigo-900 font-bold">MAPPO</strong> for decentralised multi-agent dispatching across a full fleet of 20–48 AGVs. Evaluate under Agarwal et al. (2021) statistical standards, <strong className="text-indigo-900 font-bold">Interquartile Mean (IQM)</strong> and <strong className="text-indigo-900 font-bold">95% stratified bootstrap confidence intervals</strong> across a minimum of 20 independent seeds, to rigorously prove statistical meaningfulness under the Neyman-Pearson 0.75 upper-CI criterion.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
