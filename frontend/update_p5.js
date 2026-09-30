const fs = require('fs');

let page = fs.readFileSync('src/app/background/page.tsx', 'utf8');

const p5_replacement = `          {/* Point 5 */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
                <History className="w-6 h-6 text-zinc-900" />
              </div>
              <div className="w-full">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
                  5. How Were AGVs Controlled? Evolution of Dispatching and Control Architecture
                </h2>
                <div className="text-zinc-800 leading-relaxed space-y-6 text-justify">
                  <p>The evolution happened in <strong className="text-zinc-900 font-semibold">4 clear eras</strong>, with dispatching intelligence and control architecture co-evolving together:</p>
                  
                  <div className="space-y-8">
                    {/* Era 1 */}
                    <div className="pl-4 border-l-2 border-zinc-200">
                      <h3 className="font-bold text-zinc-900 mb-2">Era 1 - Wire-Guided, Centralized Human Control (1950s-1980s)</h3>
                      <ul className="space-y-2 text-zinc-700">
                        <li><strong className="text-zinc-900 font-semibold">Navigation:</strong> AGVs followed a physical wire embedded in the factory floor. The wire carried an electromagnetic signal; the AGV simply steered to stay above it. No onboard intelligence whatsoever.</li>
                        <li><strong className="text-zinc-900 font-semibold">Control Architecture:</strong> A <strong className="text-zinc-900 font-semibold">central human operator</strong> (or a rudimentary computer) had full authority. The operator could see the floor and manually radio instructions to individual vehicles. Think of it as a traffic policeman directing each car individually.</li>
                        <li><strong className="text-zinc-900 font-semibold">Dispatching Logic:</strong> Purely reactive. First-come-first-served, or send the nearest vehicle. No optimisation.</li>
                        <li><strong className="text-zinc-900 font-semibold">The fundamental limitation:</strong> All intelligence - and all information - had to sit in one place. If the central controller was slow or wrong, the entire fleet suffered.</li>
                      </ul>
                    </div>

                    {/* Era 2 */}
                    <div className="pl-4 border-l-2 border-zinc-200">
                      <h3 className="font-bold text-zinc-900 mb-2">Era 2 - Rule-Based Dispatching, Centralised Fleet Management Systems (1980s-1990s)</h3>
                      <ul className="space-y-2 text-zinc-700">
                        <li><strong className="text-zinc-900 font-semibold">Navigation:</strong> Still wire or magnetic strip guided, but onboard microcontrollers now allowed AGVs to execute basic decisions locally - stop, turn, report position.</li>
                        <li><strong className="text-zinc-900 font-semibold">Control Architecture:</strong> The <strong className="text-zinc-900 font-semibold">Fleet Management System (FMS)</strong> emerged - a dedicated central computer that tracked all AGV positions (via floor sensors or RF check-ins) and assigned tasks. This was still fundamentally centralised: every dispatching decision came from the FMS. AGVs were executors, not thinkers.</li>
                        <li><strong className="text-zinc-900 font-semibold">Dispatching Logic:</strong> This is where Egbelu & Tanchoco (1984) made their landmark contribution. They formally characterised and mathematically defined all dispatching rules - Nearest Vehicle, Longest Idle Vehicle, Minimum Remaining Queue Space, First-Come-First-Served - giving the FMS a structured playbook to follow.</li>
                      </ul>
                      <div className="mt-3 p-3 bg-zinc-100 rounded-xl border border-zinc-200 flex gap-3">
                        <FileText className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-zinc-700 italic">Egbelu, P.J., & Tanchoco, J.M.A. (1984). Characterization of automatic guided vehicle dispatching rules. International Journal of Production Research, 22(3), 359-374.</p>
                      </div>
                      <p className="mt-3 text-zinc-700"><strong className="text-zinc-900 font-semibold">The fundamental limitation:</strong> The FMS had a complete picture but used simple rules. The rules worked well in small, stable factories. As fleet sizes grew and layouts became complex, simple rules caused deadlocks and throughput collapse - documented precisely in Egbelu & Tanchoco's "Locking Phenomenon."</p>
                    </div>

                    {/* Era 3 */}
                    <div className="pl-4 border-l-2 border-zinc-200">
                      <h3 className="font-bold text-zinc-900 mb-2">Era 3 - Optimisation-Based Dispatching, Hierarchical Control (1990s-2000s)</h3>
                      <ul className="space-y-2 text-zinc-700">
                        <li><strong className="text-zinc-900 font-semibold">Navigation:</strong> Laser-guided and vision-based AGVs emerged. AGVs could now navigate on open floors without wires, computing their own local paths from a map.</li>
                        <li><strong className="text-zinc-900 font-semibold">Control Architecture:</strong> A <strong className="text-zinc-900 font-semibold">hierarchical two-layer architecture</strong> became standard. The <em>Top layer (Central)</em> FMS handles global task assignment (which AGV goes where). The <em>Bottom layer (Onboard)</em> handles local navigation and obstacle avoidance (how to get there).</li>
                        <li><strong className="text-zinc-900 font-semibold">Dispatching Logic:</strong> Operations Research took over - Mixed-Integer Programming (MIP), Genetic Algorithms. The goal was mathematically optimal global assignment.</li>
                      </ul>
                      <div className="mt-3 p-3 bg-zinc-100 rounded-xl border border-zinc-200 flex gap-3">
                        <FileText className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-zinc-700 italic">Kim, K.H., & Bae, J.W. (2004). A look-ahead dispatching method for AGVs in automated port container terminals. Transportation Science, 38(2), 224-240. (Their look-ahead MIP got within 2.8% of optimal but required runtimes exceeding 1 minute per decision, making real-time use infeasible.)</p>
                      </div>
                      <p className="mt-3 text-zinc-700"><strong className="text-zinc-900 font-semibold">The fundamental limitation:</strong> The central FMS now had a powerful brain but it was <em>slow</em>. Solving a MIP takes minutes. A factory floor cannot wait minutes for a dispatching decision. More critically, both the FMS and the optimisation models assumed they had perfect, accurate, real-time information - an assumption that real factory floors violate constantly.</p>
                    </div>

                    {/* Era 4 */}
                    <div className="pl-4 border-l-2 border-zinc-200">
                      <h3 className="font-bold text-zinc-900 mb-2">Era 4 - AI/ML Dispatching, Edge Intelligence and Decentralised Control (2010s-Present)</h3>
                      <ul className="space-y-2 text-zinc-700">
                        <li><strong className="text-zinc-900 font-semibold">Navigation:</strong> LiDAR, camera-based SLAM (Simultaneous Localisation and Mapping), GPS-fused systems. AGVs now build and update their own maps in real time.</li>
                        <li><strong className="text-zinc-900 font-semibold">Control Architecture:</strong> The shift from pure centralisation to <strong className="text-zinc-900 font-semibold">Edge Computing</strong>. Processing happens <em>at or near the vehicle</em> - on the AGV's own onboard computer or on a nearby edge server. This dramatically reduces latency. In the most advanced systems, individual AGVs negotiate with each other directly via <strong className="text-zinc-900 font-semibold">vehicle-to-vehicle (V2V) communication</strong>.</li>
                      </ul>
                      <div className="mt-3 p-3 bg-zinc-100 rounded-xl border border-zinc-200 flex gap-3">
                        <FileText className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-zinc-700 italic">Shi, W., Cao, J., Zhang, Q., Li, Y., & Xu, L. (2016). Edge computing: Vision and challenges. IEEE Internet of Things Journal, 3(5), 637-646.</p>
                      </div>
                      <div className="mt-3">
                        <p className="font-semibold text-zinc-900">Dispatching Logic (Machine Learning replaces rules & slow optimisers):</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-700">
                          <li><strong className="text-zinc-900">Online Preference Learning (Choe et al., 2016):</strong> A neural network trained in real time, generating dispatching decisions in under 1 millisecond.</li>
                          <li><strong className="text-zinc-900">Deep Q-Networks / DRL (Zheng et al., 2022):</strong> A DQN agent learning dispatching policy through trial and error in simulation.</li>
                        </ul>
                      </div>
                      <div className="mt-3 p-3 bg-zinc-100 rounded-xl border border-zinc-200 space-y-2">
                        <div className="flex gap-3">
                          <FileText className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-zinc-700 italic">Choe, R., Kim, J., & Ryu, K.R. (2016). Online preference learning for adaptive dispatching of AGVs. Applied Soft Computing, 48, 285-296.</p>
                        </div>
                        <div className="flex gap-3">
                          <FileText className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-zinc-700 italic">Zheng, X. et al. (2022). Multi-AGV dynamic scheduling: A deep reinforcement learning approach. Mathematics, 10(22), 4575.</p>
                        </div>
                      </div>
                      
                      <p className="mt-4 p-4 bg-zinc-900 text-white rounded-2xl font-medium shadow-sm">
                        <strong className="text-cyan-400">The connection to Industry 4.0:</strong> The Kagermann et al. (2013) Industry 4.0 blueprint explicitly called for <em>decentralised decision-making</em> - moving control closer to the physical process. Modern AI-driven AGV dispatching, where each vehicle can hold an intelligent policy and make local decisions informed by global fleet state, is the direct realisation of this vision.
                      </p>
                    </div>
                  </div>

                  {/* Summary Table */}
                  <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-zinc-100 text-zinc-900 font-semibold border-b border-zinc-200">
                        <tr>
                          <th className="px-4 py-3 border-r border-zinc-200">Era</th>
                          <th className="px-4 py-3 border-r border-zinc-200 min-w-[100px]">Period</th>
                          <th className="px-4 py-3 border-r border-zinc-200 min-w-[120px]">Navigation</th>
                          <th className="px-4 py-3 border-r border-zinc-200 min-w-[180px]">Control Architecture</th>
                          <th className="px-4 py-3 min-w-[180px]">Dispatching Logic</th>
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
          </div>`;

const startIndex = page.indexOf('{/* Point 5 */}');
const endIndex = page.indexOf('{/* Point 6 */}');

if (startIndex !== -1 && endIndex !== -1) {
    const newPage = page.substring(0, startIndex) + p5_replacement + '\n\n          ' + page.substring(endIndex);
    fs.writeFileSync('src/app/background/page.tsx', newPage, 'utf8');
    console.log('Replaced Point 5 successfully.');
} else {
    console.log('Could not find boundaries');
}
