const fs = require('fs');
let text = fs.readFileSync('src/app/problem/page.tsx', 'utf8');

// Replace Section 6 Question
const oldQ = `does a Deep Reinforcement Learning agent (PPO, MAPPO) outperform strong classical baselines (Greedy, Look-Ahead, Inventory-Based), and <span className="text-cyan-400 font-bold border-b-2 border-cyan-400/50 pb-1">at what disruption intensity does the performance gap become significant?</span>`;
const newQ = `do Deep Reinforcement Learning agents (DQN, PPO, MAPPO) outperform classical baselines (Greedy, Look-Ahead, Inventory-Based, GA), and <span className="text-cyan-400 font-bold border-b-2 border-cyan-400/50 pb-1">at what disruption intensity does the performance gap become statistically significant?</span>`;
text = text.replace(oldQ, newQ);

// Replace the old degradation section with the new two-layer table + degradation section
const oldDegradation = `<motion.div variants={fadeUp} className="mt-6 text-center max-w-3xl mx-auto">
            <p className="text-zinc-600 font-medium italic text-lg leading-relaxed">
              This framing generates <strong className="text-zinc-900 not-italic">degradation curves</strong> — showing not just whether DRL wins, but <strong className="text-zinc-900 not-italic">when</strong> and <strong className="text-zinc-900 not-italic">by how much</strong> — which is a more honest and more rigorous contribution than a simple "DRL beats Greedy" claim.
            </p>
          </motion.div>`;
// Also handle the slight variant in wording just in case
const oldDegradationRegex = /<motion\.div variants={fadeUp} className="mt-6 text-center max-w-3xl mx-auto">[\s\S]*?<\/motion\.div>/;

const newStructure = `<motion.div variants={fadeUp} className="mt-8 bg-white p-6 rounded-3xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
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
          
          <motion.div variants={fadeUp} className="mt-6 text-center max-w-3xl mx-auto">
            <p className="text-zinc-600 font-medium italic text-lg leading-relaxed">
              This framing generates <strong className="text-zinc-900 not-italic">degradation curves</strong> — showing not just whether DRL wins, but <strong className="text-zinc-900 not-italic">when</strong> and <strong className="text-zinc-900 not-italic">by how much</strong> — which is a more honest and rigorous contribution than a simple "DRL beats Greedy" claim.
            </p>
          </motion.div>`;

if (text.includes(oldDegradation)) {
    text = text.replace(oldDegradation, newStructure);
} else {
    text = text.replace(oldDegradationRegex, newStructure);
}

// Replace Section 7 Baseline list
const oldBaselines = `<li><strong className="text-zinc-900">Implement</strong> three classical baselines — Greedy (Egbelu 1984), Look-Ahead (Kim & Bae 2004), and Inventory-Based (Briskorn et al. 2006)</li>`;
const newBaselines = `<li><strong className="text-zinc-900">Implement</strong> four classical baselines — Greedy (Egbelu 1984), Look-Ahead (Kim & Bae 2004), Inventory-Based (Briskorn et al. 2006), and Genetic Algorithm (Grunow et al. 2006)</li>`;
text = text.replace(oldBaselines, newBaselines);

fs.writeFileSync('src/app/problem/page.tsx', text, 'utf8');
console.log('Updated Problem tab successfully.');
