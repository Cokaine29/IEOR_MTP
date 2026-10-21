'use client';

/* Sections taken off the Home tab on 20 Oct 2026 (Home now ends after Why It Matters).
   Kept here unchanged so the Simulation, Results and Progress tabs can reuse them. */
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, CircleDot } from 'lucide-react';
import NoiseChart from '@/components/home/NoiseChart';
import TerminalExplorer from '@/components/home/TerminalExplorer';
import home from '@/data/home.json';

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
};

function SectionHead({ kicker, title, children }: { kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-10 flex max-w-3xl flex-col gap-3">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">{kicker}</span>
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900">{title}</h2>
      {children && <div className="text-base leading-relaxed text-zinc-700">{children}</div>}
    </div>
  );
}

const SPECS = [
  { value: '2 Quay Cranes', detail: 'Over blocks 24 and 26, 82 m apart, 75 s per container', source: 'Zhao et al. (2025); Liu, Jula and Ioannou (2001)' },
  { value: '12 AGVs', detail: 'Six per crane, the operating fleet chosen in Experiment 2.1', source: 'Luo (2016), usually 5 to 8 AGVs per crane' },
  { value: '6.0 / 3.5 m/s', detail: 'Top speed of an empty and a loaded AGV, 3 m/s in turns of 10 m radius', source: 'Luo (2016); Luo (2016b), Table 2; Zhao et al. (2025), Table 1' },
  { value: 'AGV Traffic', detail: 'Each AGV reserves the road ahead of it, its body plus its braking distance, so AGVs never collide and wait for each other', source: 'Kim, Jeon and Ryu (2006); Li et al. (2016)' },
  { value: '50 Yard Blocks', detail: 'About 2.1 km of yard, 5 transfer racks per block', source: 'Liu et al. (2016); Wu et al. (2016)' },
  { value: '200 Containers', detail: '100 discharge and 100 load per ship, 2 bays per crane', source: 'Kim and Bae (2004); Zhao et al. (2025)' },
  { value: '±0% to ±40%', detail: 'Random crane handling times, the same draws for every method', source: 'Kim and Bae (2004)' },
  { value: '±0% to ±20%', detail: 'Random AGV speed on each trip, so travel times vary too', source: 'Li et al. (2018), Table 4' },
  { value: '14.8 m × 3.0 m', detail: 'AGV body, all-wheel steering, both axles follow the path', source: 'Luo (2016), Table 3; Konecranes LIFT AGV' },
];

type Status = 'done' | 'partly' | 'next';
const PATH: { n: string; title: string; detail: string; status: Status }[] = [
  { n: '1', title: 'Simulator Check', detail: 'The simulator matches an independent answer key to within 1e-6 s, and AGVs never collide or deadlock in traffic.', status: 'done' },
  { n: '2', title: 'Where Decisions Matter', detail: 'Fleet size, look-ahead and ship size, now with AGV traffic. 12 AGVs chosen as the operating fleet.', status: 'done' },
  { n: '3', title: 'Search Check', detail: 'The memetic search recovers 90 to 100% of the room for improvement at 12 AGVs, in small cases solved exactly.', status: 'done' },
  { n: '4', title: 'Crane-Time Randomness', detail: 'Rules, a plan made in advance, the re-planning GA with its thinking time and the perfect dispatcher, all on the model with traffic.', status: 'done' },
  { n: '5', title: 'Travel-Time Randomness', detail: 'AGV speeds vary on every trip (±0% to ±20%), alone and together with random crane times.', status: 'done' },
  { n: '6', title: 'MDP Design', detail: 'What the dispatcher sees and what it can choose, with an imitation-learning baseline.', status: 'next' },
  { n: '7', title: 'DQN', detail: 'A value-based learning dispatcher.', status: 'next' },
  { n: '8', title: 'PPO, then MAPPO', detail: 'One central learned dispatcher, then one cooperating agent per AGV.', status: 'next' },
];

/** The Simulated Terminal: yard explorer and the set-up cards (model v5). */
export function SimulatedTerminal() {
  return (
      <section className="bg-zinc-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <SectionHead kicker="The Simulated Terminal" title="Built from Published Data of a Real Automated Terminal">
              <p>
                The layout follows the automated terminal at <b>Yangshan Phase IV</b> in Shanghai, as described by <i>Liu et al. (2016)</i>
                {' '}and <i>Wu et al. (2016)</i>. Hover over the yard below, or tap a block, to see what it holds.
              </p>
            </SectionHead>
            <div className="-mt-4 mb-8 flex flex-wrap gap-2">
              {['Event-Driven Python Simulator', 'AGVs Accelerate, Brake and Turn on Real Lanes', 'Every Value Has a Published Source', 'Same Random Draws for Every Method'].map((c) => (
                <span key={c} className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">{c}</span>
              ))}
            </div>
          </motion.div>
          <motion.div {...fade} className="mb-8">
            <TerminalExplorer />
            <p className="mt-3 text-xs leading-relaxed text-zinc-500">
              Discharge containers go to blocks within 10 of the five blocks behind the cranes, and load containers come from blocks
              within 15. These ranges are set so that crane productivity comes close to the simulation of <i>Luo (2016)</i>.
            </p>
          </motion.div>
          <div className="grid overflow-hidden rounded-2xl border border-zinc-200 bg-white sm:grid-cols-2 lg:grid-cols-3">
            {SPECS.map((s) => (
              <div key={s.value} className="flex flex-col gap-1.5 border-b border-zinc-200 p-5 sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(odd)]:border-r-0 lg:[&:not(:nth-child(3n))]:border-r">
                <div className="text-xl font-semibold tracking-tight tabular-nums">{s.value}</div>
                <div className="text-sm leading-snug text-zinc-600">{s.detail}</div>
                <div className="mt-auto pt-1 text-xs italic text-zinc-500">{s.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
  );
}

/** Baseline Results: three headline cards and the crane-noise chart (Experiment 4.1 on v5). */
export function BaselineResults() {
  const n = home.crane_noise;
  const f = home.fleet as Record<string, number[]>;
  const saved = Math.round(100 * Math.min(...n.map((r) => r.saved_share))), savedHi = Math.round(100 * Math.max(...n.map((r) => r.saved_share)));
  const lead = (v: number) => (Math.abs(v) < 0.05 ? '0.0' : v.toFixed(1));
  const first = n[0], last = n[n.length - 1];
  const roomLo = Math.min(...n.map((r) => r.room[0])), roomHi = Math.max(...n.map((r) => r.room[0]));
  const roomCiLo = Math.min(...n.map((r) => r.room[1])), roomCiHi = Math.max(...n.map((r) => r.room[1]));
  const benchLo = Math.min(...n.map((r) => r.benchmark[0])), benchHi = Math.max(...n.map((r) => r.benchmark[0]));
  return (
      <section className="border-y border-zinc-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <SectionHead kicker="Baseline Results · Model v5" title="What Traditional Methods Achieve, and What They Leave">
              <p>
                Before any learning, the thesis measures the methods a terminal could use today. These are the baselines the learned
                dispatcher has to beat. All numbers are means over {home.seeds} paired ships with 95% intervals.
              </p>
            </SectionHead>
          </motion.div>
          <div className="mb-10 grid gap-5 md:grid-cols-3">
            {[
              {
                head: 'Dispatching Matters',
                big: `${f['NV/FCFS'][0].toFixed(1)} s vs ${f['Random'][0].toFixed(1)} s`,
                text: `Crane idle per container with ${home.fleet_n} AGVs, the best rule (NV/FCFS, ±${f['NV/FCFS'][1].toFixed(1)}) against random dispatching (±${f['Random'][1].toFixed(1)}). Same AGVs, same ship, only the decisions differ.`,
                exp: 'Experiment 2.1',
              },
              {
                head: 'Plans Made in Advance Break',
                big: `${lead(first.lead_of_plan[0])} s → ${lead(last.lead_of_plan[0])} s`,
                text: `Lead of a plan made in advance over the best rule, with exact crane times (±${first.lead_of_plan[1].toFixed(2)}) and with ±40% randomness (±${last.lead_of_plan[1].toFixed(2)}). At ±40% the lead is gone. The plan was right for the planned times only.`,
                exp: 'Experiment 4.1',
              },
              {
                head: 'Room Left for Real-Time Decisions',
                big: `${roomLo.toFixed(1)} to ${roomHi.toFixed(1)} s`,
                text: `Extra crane idle per container of the best rule over a perfect dispatcher that knew the real crane times (±${roomCiLo.toFixed(2)} to ±${roomCiHi.toFixed(2)}). The perfect dispatcher waits only ${benchLo.toFixed(1)} to ${benchHi.toFixed(1)} s, so ${saved}% to ${savedHi}% of the best rule's waiting could be avoided.`,
                exp: 'Experiment 4.1',
              },
            ].map((c) => (
              <motion.div key={c.head} {...fade} className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                <span className="text-sm font-semibold text-teal-700">{c.head}</span>
                <span className="text-3xl font-bold tracking-tight tabular-nums">{c.big}</span>
                <p className="flex-grow text-sm leading-relaxed text-zinc-600">{c.text}</p>
                <span className="text-xs text-zinc-500">{c.exp}</span>
              </motion.div>
            ))}
          </div>
          <motion.div {...fade} className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
            <h3 className="mb-4 text-lg font-semibold tracking-tight">Crane Idle as Crane Times Become Random</h3>
            <NoiseChart />
          </motion.div>
          <p className="mt-6 text-sm leading-relaxed text-zinc-600">
            Running now on this model are random AGV speeds (Experiments 4.4 and 4.5), the GA that re-plans during the ship
            (Experiment 4.2) and the cost of its thinking time (Experiment 4.3). Every experiment, with its set-up, maths and full results, is on the{' '}
            <Link href="/experiments" className="font-medium text-teal-700 underline underline-offset-2">Experiments tab</Link>.
          </p>
        </div>
      </section>
  );
}

/** Research Path: the eight stages with their status. */
export function ResearchPath() {
  return (
      <section className="bg-zinc-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <SectionHead kicker="Research Path" title="From Traditional Methods to a Learned Dispatcher">
              <p>
                Stages 1 to 5 measure traditional methods and show why a real-time learner is needed. Stages 6 to 8 build that learner.
              </p>
            </SectionHead>
          </motion.div>
          <ol className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PATH.map((s) => {
              const Icon = s.status === 'done' ? CheckCircle2 : s.status === 'partly' ? CircleDot : Circle;
              const tone = s.status === 'done' ? 'border-teal-200 bg-teal-50/60' : s.status === 'partly' ? 'border-amber-200 bg-amber-50/70' : 'border-zinc-200 bg-white';
              const ic = s.status === 'done' ? 'text-teal-700' : s.status === 'partly' ? 'text-amber-600' : 'text-zinc-400';
              const tag = s.status === 'done' ? 'Done' : s.status === 'partly' ? 'In progress' : 'Next';
              return (
                <motion.li key={s.n} {...fade} className={`flex flex-col gap-2 rounded-2xl border p-5 ${tone}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-zinc-500">Stage {s.n}</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${ic}`}><Icon className="h-4 w-4" />{tag}</span>
                  </div>
                  <h3 className="text-base font-semibold tracking-tight">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-600">{s.detail}</p>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>
  );
}
