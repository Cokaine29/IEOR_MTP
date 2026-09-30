const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'background', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Update the sections array
content = content.replace(
  "{ id: 'point-9', title: '9. The Evolution of Dispatching: A 40-Year Quest for Optimality' },",
  "{ id: 'point-9', title: '9. The Modern Scale: $20 Billion Terminals & The AIV Transition' },\n    { id: 'point-10', title: '10. The Evolution of Dispatching: A 40-Year Quest for Optimality' },"
);
content = content.replace(
  "{ id: 'point-10', title: '10. The Unsolved Piece: The Stochasticity Problem' },",
  "{ id: 'point-11', title: '11. The Unsolved Piece: The Stochasticity Problem' },"
);
content = content.replace(
  "{ id: 'point-11', title: '11. State of the Art in Stochastic AGV Dispatching, and the Gap' },",
  "{ id: 'point-12', title: '12. State of the Art in Stochastic AGV Dispatching, and the Gap' },"
);

// 2. Add the Target icon to lucide-react imports if it's missing (it was already there according to the previous output, but let's be safe).

// 3. Shift the HTML IDs and Titles for existing points 9, 10, 11
// We do this backwards to avoid double replacement.
content = content.replace(/id="point-11"/g, 'id="point-12"');
content = content.replace(/11\. State of the Art/g, '12. State of the Art');
content = content.replace(/\{\/\* Point 11 \*\/\}/g, '{/* Point 12 */}');

content = content.replace(/id="point-10"/g, 'id="point-11"');
content = content.replace(/10\. The Unsolved Piece/g, '11. The Unsolved Piece');
content = content.replace(/\{\/\* Point 10 \*\/\}/g, '{/* Point 11 */}');

content = content.replace(/id="point-9"/g, 'id="point-10"');
content = content.replace(/9\. The Evolution of Dispatching/g, '10. The Evolution of Dispatching');
content = content.replace(/\{\/\* Point 9 \*\/\}/g, '{/* Point 10 */}');


// 4. Inject the new Point 9 block right before the now-renamed Point 10
const newPoint9 = `
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

`;

content = content.replace('{/* Point 10 */}', newPoint9 + '{/* Point 10 */}');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully updated Background page!');
