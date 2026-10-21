'use client';

/* The two study tables, from GAP_TABLES.md of the literature notes. To be replaced by visuals in Round B. */
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

export default function StudyTables() {
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mt-16">
      <motion.div variants={fadeUp} className="mb-8 text-center">
        <h3 className="text-2xl font-bold tracking-tight text-zinc-900">What the Studies We Read Model and Test</h3>
        <p className="mt-2 text-sm text-zinc-500">14 papers, 11 of them dispatching or scheduling studies.</p>
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
                      ['Egbelu & Tanchoco 1984','Shop throughput (not crane-related)','No','No','Other rule combinations only','2 runs, no intervals','No'],
                      ['Liu et al. 2001','Design targets, crane idle rate reported as an output','No','No','None','One 24 h run','No'],
                      ['Briskorn et al. 2006','Waterside productivity (crane-related)','No','No (noise present, not varied)','Greedy and Hungarian due-time rules','100 runs of 11 h, no intervals','No'],
                      ['Grunow et al. 2006','Processing time incl. crane waiting (crane-related)','No','Yes (cycle-time variance x0.5, x1, x2)','On-line NV/FCFS rule, lower bound','10 replications, spread not shown','No'],
                      ['Kim & Bae 2004','Crane delay, then travel (crane-related)','No','Yes (noise swept)','STT/D, EDD, r-SI','10 replications, 1% tests','No'],
                      ['Angeloudis & Bell 2010','Net benefit (no crane metric)','No','No (weights and fleet size swept)','Closest, Greedy, First, mTSP','Seeds not stated, no intervals','No'],
                      ['Song et al. 2024','Longest vehicle completion time (not crane-related)','No','No (charging threshold swept)','One-threshold charging only','Runs not described','No'],
                      ['Zhao, Li & Yang 2025','Vehicle energy (not crane-related)','No','No','Greedy start, GA','10 groups, no tests','No'],
                      ['Choe et al. 2016','Crane makespan + empty travel (crane-related)','Yes (supervised preference learning)','Two scenario families, not graded','Rolling-horizon GA, policy search, Q-learning','50 scenarios, t-tests','No'],
                      ['Gao et al. 2023','Earliness + lateness, congestion (not crane-related)','Yes (tabular Q-learning for routing)','No','CNA, Dijkstra, GA, PSO','GA/PSO mean of 10 runs, own runs not described','Contract-net agents (not multi-agent RL)'],
                      ['Zheng et al. 2022','Crane waiting for vehicle + vehicle completion (crane-related)','Yes (DQN)','No (one level, sweep is over size)','Static GA, FCFS, STD, LWT','Not described, no intervals','No'],
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
              <li>Among these 11 studies, no learning-based dispatcher was evaluated across graded uncertainty levels. The two studies with level sweeps, Kim & Bae (2004) and Grunow et al. (2006), are not learning-based.</li>
              <li>No study compares rules, a metaheuristic, tabular Q-learning and DQN on the same scenarios with seeds and intervals.</li>
              <li>No study in this set uses multi-agent learning.</li>
              <li>Vehicle breakdown and battery are not modelled as random in any of them.</li>
              <li>Gao et al. (2023) list deep reinforcement learning as future work for dispatching AGVs together with other equipment.</li>
            </ul>
            <p className="text-xs text-zinc-500 italic">This summarises the papers we read. It is not evidence about the wider literature. A &lsquo;?&rsquo; means the paper does not describe it, not that the paper is weak.</p>
          </motion.div>
    </motion.section>
  );
}
