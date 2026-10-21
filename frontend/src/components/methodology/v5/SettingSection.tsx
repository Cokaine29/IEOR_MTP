'use client';

import { motion } from 'framer-motion';
import { fade, SectionHead, Source } from './common';

/* Experiment 2.1 on model v5: crane idle per container (s), best of the three rules and Random, 30 paired ships, no randomness */
const FLEET = [
  { n: 6, best: 30.3, rnd: 35.8 }, { n: 7, best: 20.9, rnd: 26.8 }, { n: 8, best: 14.1, rnd: 20.3 }, { n: 9, best: 9.6, rnd: 15.7 },
  { n: 10, best: 6.7, rnd: 12.3 }, { n: 11, best: 4.5, rnd: 9.8 }, { n: 12, best: 3.4, rnd: 7.8 }, { n: 13, best: 2.9, rnd: 5.9 },
  { n: 14, best: 3.1, rnd: 4.8 }, { n: 15, best: 3.5, rnd: 4.6 }, { n: 16, best: 5.0, rnd: 6.9 },
];
/* Experiment 2.2: NV/FCFS at 12 AGVs, test ships */
const WINDOW = [
  { w: 1, v: 115.1 }, { w: 2, v: 51.8 }, { w: 3, v: 23.7 }, { w: 5, v: 6.3 }, { w: 10, v: 3.4 }, { w: 20, v: 3.3 }, { w: 50, v: 3.7 },
];
/* Experiment 2.3: 12 AGVs, no randomness */
const SHIPS = [
  { label: '1 × (12 + 12)', total: 48, nv: 5.9, rnd: 8.0 },
  { label: '2 × (25 + 25)', total: 200, nv: 3.4, rnd: 7.8, ours: true },
  { label: '4 × (25 + 25)', total: 400, nv: 3.2, rnd: 8.0 },
  { label: '2 × (50 + 50)', total: 400, nv: 1.7, rnd: 7.0 },
  { label: '8 × (25 + 25)', total: 800, nv: 3.1, rnd: 8.5 },
];

function Card({ stat, title, children, source }: { stat: string; title: string; children: React.ReactNode; source: string }) {
  return (
    <motion.div {...fade} className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="flex flex-col gap-1">
        <span className="text-3xl font-bold tracking-tight text-teal-700">{stat}</span>
        <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
      </div>
      <div className="flex flex-grow flex-col gap-4">{children}</div>
      <Source>{source}</Source>
    </motion.div>
  );
}

export default function SettingSection() {
  const fmax = 36;
  return (
    <section className="bg-zinc-50 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fade}>
          <SectionHead id="setting" kicker="Step 3 · Choose the Setting" title="How Many AGVs, How Far Ahead, How Big a Ship">
            <p>
              Before comparing methods, we fixed the test setting with three experiments. Each choice was made where dispatching
              really matters, not where every method looks the same.
            </p>
          </SectionHead>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          <Card stat="12 AGVs" title="Fleet Size, 6 per Crane" source="Experiment 2.1 on model v5, best of the three rules and Random, 30 test ships, no randomness. Luo (2016): usually 5 to 8 AGVs per crane.">
            <p className="text-sm leading-relaxed text-zinc-600">
              With few AGVs the cranes wait a long time whatever we do. Beyond 13 AGVs, the roads get crowded and waiting rises
              again. We use 12, close to the lowest point and an even 6 per crane. There the best rule leaves 3.4 s per container,
              and choosing badly (Random) still costs twice as much.
            </p>
            <figure className="flex flex-col gap-2">
              <figcaption className="text-xs font-medium text-zinc-500">Crane wait per container, in seconds, by number of AGVs</figcaption>
              <div className="flex items-end gap-1.5" aria-label="Crane wait by fleet size">
                {FLEET.map((f) => (
                  <div key={f.n} className="flex flex-1 flex-col items-center justify-end gap-1">
                    <div className="flex h-28 w-full items-end justify-center gap-[2px]">
                      <span className="w-1/2 rounded-t bg-zinc-300" style={{ height: `${(f.rnd / fmax) * 100}%` }} />
                      <span className={`w-1/2 rounded-t ${f.n === 12 ? 'bg-teal-600' : 'bg-zinc-800'}`} style={{ height: `${(f.best / fmax) * 100}%` }} />
                    </div>
                    <span className={`text-[10px] tabular-nums ${f.n === 12 ? 'font-bold text-teal-700' : 'text-zinc-500'}`}>{f.n}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 text-[11px] text-zinc-500">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-zinc-800" /> Best rule</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-zinc-300" /> Random</span>
              </div>
            </figure>
          </Card>

          <Card stat="10 Containers" title="How Far Ahead the Dispatcher Sees" source="Experiment 2.2 on model v5, NV/FCFS at 12 AGVs, 30 test ships. Look-ahead of 10 as in Kim and Bae (2004).">
            <p className="text-sm leading-relaxed text-zinc-600">
              The dispatcher sees the next few containers on each crane’s list. If it sees only the next one, it cannot send AGVs
              early, and cranes wait almost two minutes per container. From 10 on, seeing further barely helps.
            </p>
            <figure className="flex flex-col gap-2">
              <figcaption className="text-xs font-medium text-zinc-500">Crane wait per container, in seconds, by how many containers it sees</figcaption>
              <ul className="flex flex-col gap-1.5">
                {WINDOW.map((w) => (
                  <li key={w.w} className="!text-left grid grid-cols-[2rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs">
                    <span className={`tabular-nums ${w.w === 10 ? 'font-bold text-teal-700' : 'text-zinc-600'}`}>{w.w}</span>
                    <span className="h-3 rounded bg-zinc-100">
                      <span className={`block h-full rounded ${w.w === 10 ? 'bg-teal-600' : 'bg-zinc-700'}`} style={{ width: `${Math.max(1.5, (w.v / 116) * 100)}%` }} />
                    </span>
                    <span className="text-right font-semibold tabular-nums text-zinc-900">{w.v.toFixed(1)}</span>
                  </li>
                ))}
              </ul>
            </figure>
          </Card>

          <Card stat="200 Containers" title="Ship Size Does Not Change the Picture" source="Experiment 2.3 on model v5, 12 AGVs, 30 test ships, no randomness. Sizes per crane, bays × (unload + load).">
            <p className="text-sm leading-relaxed text-zinc-600">
              We also ran smaller and much bigger ships. The rules keep roughly the same order, Random is always worst, and no run
              ever jams. So our test ship of 200 containers is a fair choice.
            </p>
            <figure className="flex flex-col gap-2">
              <figcaption className="text-xs font-medium text-zinc-500">Crane wait per container, in seconds</figcaption>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-zinc-500">
                    <th className="pb-1.5 font-medium">Per crane</th>
                    <th className="pb-1.5 text-right font-medium">Ship</th>
                    <th className="pb-1.5 text-right font-medium">NV/FCFS</th>
                    <th className="pb-1.5 text-right font-medium">Random</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {SHIPS.map((s) => (
                    <tr key={s.label} className={s.ours ? 'bg-teal-50 font-semibold text-teal-900' : 'text-zinc-700'}>
                      <td className="py-1.5 pl-1">{s.label}</td>
                      <td className="py-1.5 text-right tabular-nums">{s.total}</td>
                      <td className="py-1.5 text-right tabular-nums">{s.nv.toFixed(1)}</td>
                      <td className="py-1.5 pr-1 text-right tabular-nums">{s.rnd.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </figure>
          </Card>
        </div>
      </div>
    </section>
  );
}
