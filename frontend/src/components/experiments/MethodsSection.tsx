'use client';

import Md from './Md';

/* How each traditional baseline decides. The formulas follow the code in ACT_MTP agvsim/dispatchers.py. */

type Rule = {
  name: string;
  source?: string;
  words: string;
  formula: string;
  symbols: [string, string][];
  example: string;
};

const RULES: Rule[] = [
  {
    name: 'Briskorn inventory rule',
    source: 'Briskorn, Drexl and Hartmann (2006)',
    words: 'Send the AGV to the crane that has the fewest AGVs already on their way to it. A crane about to load counts as having fewer, because a load trip starts with a drive to the yard.',
    formula: String.raw`$$q^{*}=\arg\min_{q\in\mathcal{Q}}\ \frac{I_q}{\varphi_q}$$ $$\varphi_q=\begin{cases}1.6 & \text{next job of } q \text{ is a load}\\[2pt] 1 & \text{next job is a discharge}\end{cases}$$`,
    symbols: [
      [String.raw`$I_q$`, 'AGVs working for crane q that have not reached it yet'],
      [String.raw`$\varphi_q$`, 'phase factor, 1.6 as in Table 2 of Briskorn et al. (2006)'],
      ['Ties', 'the crane that was last sent an AGV longest ago'],
    ],
    example: String.raw`QC1 has 2 AGVs on their way and its next job is a discharge, so its level is $2/1=2$. QC2 also has 2 on their way but its next job is a load, so its level is $2/1.6=1.25$. The free AGV goes to **QC2**.`,
  },
  {
    name: 'Nearest vehicle, first come first served (NV/FCFS)',
    source: 'Grunow, Günther and Lehmann (2006)',
    words: 'Serve the job that has been waiting longest. When several AGVs are parked, the nearest one takes it.',
    formula: String.raw`$$j^{*}=\arg\min_{j}\ r_j$$ $$a^{*}=\arg\min_{a}\ \big(|x_a-x_{j^*}|+|y_a-y_{j^*}|\big)$$`,
    symbols: [
      [String.raw`$r_j$`, 'the moment job j became visible to the rule, which is when the job three places earlier was handed over (window of 3 jobs)'],
      [String.raw`$(x,y)$`, 'positions in metres. The pick-up point of a job is the crane for a discharge and the block for a load'],
      ['Distance', 'measured along the lanes (rectilinear), since AGVs drive on a grid'],
    ],
    example: String.raw`The next open job of QC1 became visible at 300 s and that of QC2 at 320 s, so QC1's job comes first. Of two parked AGVs, 40 m and 120 m from QC1, the one **40 m** away takes it.`,
  },
  {
    name: 'Fixed groups',
    words: 'Split the fleet in half and give each crane its own AGVs. An AGV never helps the other crane.',
    formula: String.raw`$$q(a)=(a-1)\bmod 2$$`,
    symbols: [
      [String.raw`$a$`, 'AGV number, from 1 to 8'],
      [String.raw`$q(a)$`, 'the only crane AGV a serves, 0 for QC1 and 1 for QC2'],
    ],
    example: String.raw`With 8 AGVs, AGVs 1, 3, 5 and 7 serve **QC1**, and AGVs 2, 4, 6 and 8 serve **QC2**.`,
  },
  {
    name: 'Random dispatching',
    words: 'Pick any crane that needs an AGV, with equal chance. It uses no information and marks how a dispatcher without intelligence performs.',
    formula: String.raw`$$P(q)=\frac{1}{|\mathcal{Q}|}\quad\text{for every } q\in\mathcal{Q}$$`,
    symbols: [[String.raw`$|\mathcal{Q}|$`, 'number of cranes that need an AGV at this moment']],
    example: String.raw`If both cranes need an AGV, each is chosen with probability $1/2$.`,
  },
];

export default function MethodsSection() {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">How each method decides</h2>
        <div className="leading-relaxed text-zinc-700">
          <Md>{String.raw`Every method answers the same question each time an AGV becomes free. **Which crane should it serve next?** The AGV then takes the first job of that crane that has no AGV yet. A method may only choose a crane in $\mathcal{Q}$, the set of cranes that still need an AGV among the next 10 jobs they will handle, as in the look-ahead dispatching of *Kim and Bae (2004)*.`}</Md>
        </div>
        <p className="text-sm text-zinc-500">The traditional baselines are shown here. The search methods and the learning methods are added as they are tested.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {RULES.map((r) => (
          <article key={r.name} className="flex min-w-0 flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">{r.name}</h3>
              {r.source && <div className="text-sm italic text-zinc-500">{r.source}</div>}
            </div>
            <p className="leading-relaxed text-zinc-700">{r.words}</p>
            <div className="min-w-0 rounded-xl bg-zinc-50 px-3 py-1 text-zinc-900">
              <Md>{r.formula}</Md>
            </div>
            <dl className="grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-1.5 text-sm">
              {r.symbols.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-zinc-900"><Md>{k}</Md></dt>
                  <dd className="leading-snug text-zinc-600">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-auto rounded-xl border border-dashed border-zinc-300 px-4 py-3 text-sm leading-relaxed text-zinc-700">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">Example</div>
              <Md>{r.example}</Md>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
