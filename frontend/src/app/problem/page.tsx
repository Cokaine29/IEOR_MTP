'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, Check, Minus, Clock3, Route, TrafficCone, Target,
  Truck, MousePointerClick, Navigation, Handshake, Layers, Shuffle, Timer,
} from 'lucide-react';
import Md from '@/components/experiments/Md';

const UPDATED = '21 Oct 2026';

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

function Source({ children }: { children: React.ReactNode }) {
  return <p className="border-t border-zinc-200 pt-3 text-xs italic leading-relaxed text-zinc-500">{children}</p>;
}

/* ---------- 1. the decision we make */
const LEVELS = [
  {
    icon: Target, level: 'Dispatching', ours: true,
    question: 'Which job does a free AGV take next, or should it wait?',
    who: 'Decided by the dispatcher we study',
  },
  {
    icon: Route, level: 'Routing', ours: false,
    question: 'Which lanes does the AGV drive along to get there?',
    who: 'Done by our simulator, AGVs follow set lanes',
  },
  {
    icon: TrafficCone, level: 'Traffic Control', ours: false,
    question: 'Which AGV goes first where two paths cross?',
    who: 'Done by our simulator, AGVs book the road ahead',
  },
];

/* ---------- 2. when a decision happens */
const LOOP = [
  { icon: Truck, title: 'An AGV Becomes Free', text: 'It has just set a container on a yard rack, or handed one to the crane.' },
  { icon: MousePointerClick, title: 'The Dispatcher Chooses', text: 'It gives the AGV the next job of one crane, or tells it to park.' },
  { icon: Navigation, title: 'The AGV Drives', text: 'Empty to the crane to collect a container, or to the yard first to fetch one for loading.' },
  { icon: Handshake, title: 'Crane and AGV Meet', text: 'The container changes hands. If the crane was ready first, its wait counts as idle time.' },
];

/* ---------- 3. what the dispatcher may do */
const RULES = [
  { text: 'An AGV carries one container at a time.', source: '' },
  { text: 'Each crane handles its containers in a fixed order, set by the ship’s stowage plan.', source: '' },
  { text: 'The dispatcher sees the next 10 containers of each crane.', source: 'Kim and Bae (2004)' },
  { text: 'It may only give out the first container of a crane that has no AGV yet.', source: 'Briskorn, Drexl and Hartmann (2006)' },
  { text: 'It sends no more empty AGVs to a crane than that crane will soon unload.', source: '' },
  { text: 'AGVs never collide. Each one reserves the road ahead of it, its body plus its braking distance.', source: 'Kim, Jeon and Ryu (2006)' },
];

/* ---------- 4. why seconds matter, Experiment 4.5 at level 1 (crane times ±20%, AGV speeds ±10%) */
const BARS = [
  { name: 'Knows the Future', note: 'benchmark', mean: 1.05, ci: 0.18, tone: 'bg-teal-600' },
  { name: 'Plan, Re-optimised During Service', note: 'memetic GA', mean: 2.62, ci: 0.39, tone: 'bg-zinc-800' },
  { name: 'Plan Made in Advance', note: 'memetic GA', mean: 3.38, ci: 0.48, tone: 'bg-zinc-800' },
  { name: 'NV/FCFS Rule', note: 'Grunow et al. 2006', mean: 3.77, ci: 0.53, tone: 'bg-zinc-500' },
  { name: 'Fixed Groups Rule', note: 'AGVs tied to one crane', mean: 4.09, ci: 1.04, tone: 'bg-zinc-500' },
  { name: 'Inventory Rule', note: 'Briskorn et al. 2006', mean: 4.45, ci: 1.0, tone: 'bg-zinc-500' },
  { name: 'Random Choice', note: 'floor', mean: 7.63, ci: 0.76, tone: 'bg-zinc-300' },
];
const XMAX = 9.5;

/* ---------- 5. why it is hard */
const HARD = [
  {
    icon: Layers, stat: '9 × 10⁵⁸', title: 'Too Many Possible Orders',
    text: 'Our simulated ship has 2 cranes with 100 containers each. The containers can get their AGVs in about 9 × 10⁵⁸ different orders, far too many to try. On small ships of 12 containers, where all 924 orders can be tried, our search finds the best one in 17 to 19 of 20 cases.',
    source: 'Number of orders is 200 choose 100 (our arithmetic). Search check, Experiment 3.1, 20 Oct 2026.',
  },
  {
    icon: Shuffle, stat: '2.26 s → 0.39 s', title: 'Plans Go Stale',
    text: 'With exact times, a plan made in advance saves 2.26 s per container against the NV/FCFS rule. With random crane times and AGV speeds, the saving drops to 0.39 s, and that is no longer a clear result (±0.57 s). A plan followed rigidly does worse than every rule except Random, at 5.33 s.',
    source: 'Experiments 4.1 and 4.5, 30 paired seeds, 95% intervals, 20 to 21 Oct 2026.',
  },
  {
    icon: Timer, stat: '55 to 74 s', title: 'Little Time to Think',
    text: 'Finding a new plan takes 55 to 74 s on one processor, almost a full 75 s crane cycle. Re-planning during service helps, but the cranes still wait 1.57 s per container longer than with a dispatcher that knows the future.',
    source: 'Experiment 4.5, 21 Oct 2026. Choe et al. (2016) report 10 to 40 s per decision for their rolling search.',
  },
];

/* ---------- 6. what we model */
const SCOPE: { title: string; tone: 'yes' | 'simple' | 'later'; items: string[] }[] = [
  { title: 'Modelled', tone: 'yes', items: [
    'Layout of Yangshan Phase IV, 2 quay cranes and 50 yard blocks',
    '12 AGVs that accelerate, brake and turn on real lanes',
    'AGV traffic, AGVs wait for each other and never collide',
    'Unloading and loading, 200 containers per ship',
    'Random crane times, ±0% to ±40%',
    'Random AGV speed on every trip, ±0% to ±20%',
  ] },
  { title: 'Simplified', tone: 'simple', items: [
    'Yard cranes are not simulated. The AGV sets each container on a transfer rack by itself',
    'AGVs follow a fixed lane grid, the dispatcher does not plan paths',
    'No battery charging. AGVs are assumed to have enough charge, as in Gao et al. (2023) and Zhao et al. (2025)',
    'No breakdowns',
    'One ship at a time',
  ] },
  { title: 'Next', tone: 'later', items: [
    'A learned dispatcher, first DQN, then PPO',
    'MAPPO, one cooperating agent per AGV',
    'Curriculum learning, from easy cases to harder ones',
  ] },
];

/* ---------- 7. research questions */
const QUESTIONS = [
  {
    n: 'RQ1', title: 'How Much Do Today’s Methods Lose?',
    text: 'How much crane idle time do dispatching rules, a plan made in advance and a plan re-optimised during service lose as crane times and AGV speeds grow more random, compared with a dispatcher that knows the future?',
    status: 'Answered for model v5, the last runs finish on 21 Oct',
  },
  {
    n: 'RQ2', title: 'Can a Learned Dispatcher Do Better?',
    text: 'Can a dispatcher trained with deep reinforcement learning (DQN, PPO, then MAPPO) close part of that gap, while deciding in real time?',
    status: 'Next',
  },
];

export default function ProblemPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* ------------------------------------------------ hero */}
      <section className="bg-zinc-900 px-4 pb-16 pt-28 text-white sm:pt-32">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 text-xs font-semibold text-zinc-200">
            <span className="h-2 w-2 rounded-full bg-teal-400" /> The Problem in Detail
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Which AGV Goes Where Next?
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-3xl text-lg leading-relaxed text-zinc-300">
            At Yangshan Phase IV in Shanghai, one central system dispatches <b className="text-white">155 AGVs</b> to{' '}
            <b className="text-white">29 quay cranes</b>. Each time an AGV becomes free, the system must choose its next job at once.
            And crane handling times and AGV travel times never go exactly as planned.
          </motion.p>
          <p className="text-xs italic text-zinc-500">
            <a href="https://english.shanghai.gov.cn/en-Latest-WhatsNew/20260814/f4427a05be154fc4957a5f62d67d6f2e.html" target="_blank" rel="noreferrer" className="underline decoration-zinc-600 underline-offset-2 hover:text-zinc-300">
              Shanghai Municipal People’s Government, Yangshan Port Phase IV Boasts World-Class Efficiency, news release, 14 Aug 2026
            </a>
          </p>
        </div>
      </section>

      {/* ------------------------------------------------ 1. the decision */}
      <section className="bg-zinc-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <SectionHead kicker="The Decision" title="We Choose the Job, Not the Path">
              <p>
                Moving AGVs around a terminal takes three kinds of decisions. This thesis studies only the first, <b>Dispatching</b>.
                Routing and traffic control are still simulated, so a poor choice also costs time in traffic. The dispatcher feels
                those delays but does not control them.
              </p>
            </SectionHead>
          </motion.div>
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <motion.ol {...fade} className="flex flex-col gap-3">
              {LEVELS.map((l, i) => (
                <li key={l.level} className={`flex gap-4 rounded-2xl border p-5 ${l.ours ? 'border-teal-300 bg-teal-50' : 'border-zinc-200 bg-white'}`}>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${l.ours ? 'bg-teal-600 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                    <l.icon className="h-5 w-5" />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Level {i + 1}</span>
                    <span className="text-lg font-semibold text-zinc-900">{l.level}</span>
                    <span className="text-sm text-zinc-600">{l.question}</span>
                    <span className={`mt-1 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${l.ours ? 'bg-teal-600 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
                      {l.ours ? <Check className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />} {l.who}
                    </span>
                  </span>
                </li>
              ))}
            </motion.ol>
            <motion.figure {...fade} className="flex h-full flex-col justify-between gap-5 rounded-2xl border border-zinc-200 bg-white p-7">
              <blockquote className="font-serif text-lg italic leading-relaxed text-zinc-700">
                “AGV dispatching usually consists of three sub-problems, namely, assigning AGVs to transportation orders, routing the
                AGVs, and traffic control. Algorithms for routing and traffic control are generally already included in the control
                software provided by the AGV manufacturer. Thus, <b className="not-italic text-zinc-900">only the assignment problem is
                investigated in this paper.</b>”
              </blockquote>
              <figcaption className="text-sm font-semibold text-zinc-900">
                Grunow, Günther and Lehmann (2006)
                <span className="block text-xs font-normal italic text-zinc-500">OR Spectrum 28, 587–610, Sec. 2</span>
              </figcaption>
              <p className="rounded-xl bg-zinc-50 px-4 py-3 text-sm leading-relaxed text-zinc-600">
                We follow the same split. Our dispatchers only make the assignment. The simulator does the rest, as the
                manufacturer’s software would. Every AGV drives along set lanes, like cars on marked roads. Before it moves,
                it books the stretch of road just ahead of it, long enough to brake to a stop, and no other AGV may enter
                that stretch until it has passed. So AGVs never collide, but one may have to wait for another.
              </p>
            </motion.figure>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ 2. when a decision happens */}
      <section className="border-y border-zinc-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <SectionHead kicker="The Moment of Choice" title="A Decision Every Time an AGV Becomes Free">
              <p>
                The dispatcher is asked when an AGV finishes a job, as in <i>Kim and Bae (2004)</i> and <i>Briskorn et al. (2006)</i>.
                A parked AGV is asked again whenever a crane completes a handover, because new jobs then come into view.
              </p>
            </SectionHead>
          </motion.div>
          <motion.ol {...fade} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LOOP.map((s, i) => (
              <li key={s.title} className={`relative flex flex-col gap-3 rounded-2xl border p-5 ${i === 1 ? 'border-teal-300 bg-teal-50' : 'border-zinc-200 bg-zinc-50'}`}>
                <div className="flex items-center justify-between">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${i === 1 ? 'bg-teal-600 text-white' : 'bg-zinc-900 text-white'}`}>{i + 1}</span>
                  <s.icon className={`h-5 w-5 ${i === 1 ? 'text-teal-700' : 'text-zinc-400'}`} />
                </div>
                <span className="font-semibold text-zinc-900">{s.title}</span>
                <span className="text-sm leading-relaxed text-zinc-600">{s.text}</span>
                {i < LOOP.length - 1 && (
                  <ArrowRight className="absolute -right-3.5 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-zinc-300 lg:block" />
                )}
              </li>
            ))}
          </motion.ol>
          <motion.p {...fade} className="mt-5 text-sm text-zinc-500">
            Then the AGV is free again, and the loop starts over. A ship of 200 containers needs 200 of these decisions or more.
          </motion.p>
        </div>
      </section>

      {/* ------------------------------------------------ 3. what the dispatcher may do */}
      <section className="bg-zinc-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <SectionHead kicker="The Problem, Precisely" title="What the Dispatcher Can Do, Must Respect and Is Judged On" />
          </motion.div>
          <div className="grid gap-5 lg:grid-cols-3">
            <motion.div {...fade} className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Its Choices</h3>
              <ul className="flex flex-col gap-3 text-sm leading-relaxed text-zinc-700">
                <li className="rounded-xl border border-zinc-200 p-3"><b className="text-zinc-900">Serve a Crane.</b> The free AGV takes the next open job of one of the cranes. For unloading it drives empty to the crane. For loading it first fetches the container from the yard.</li>
                <li className="rounded-xl border border-zinc-200 p-3"><b className="text-zinc-900">Park.</b> The AGV waits, ready for a later job.</li>
              </ul>
              <p className="mt-auto text-xs leading-relaxed text-zinc-500">With 2 cranes, that is at most 3 options per decision. The difficulty is not one choice but the long chain of them.</p>
            </motion.div>
            <motion.div {...fade} className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Rules It Must Respect</h3>
              <ul className="flex flex-col gap-3">
                {RULES.map((r) => (
                  <li key={r.text} className="flex gap-2.5 text-sm leading-relaxed text-zinc-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                    <span>{r.text}{r.source && <i className="text-zinc-500"> {r.source}</i>}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...fade} className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-white">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-400">What It Is Judged On</h3>
              <Md className="text-white">{String.raw`$$\bar I \;=\; \frac{1}{N}\sum_{j=1}^{N}\bigl(h_j - r_j\bigr)$$`}</Md>
              <Md className="text-sm leading-relaxed text-zinc-300">{String.raw`**Crane Idle Time per Container**, in seconds. For each of the $N$ containers, the time from when the crane is ready ($r_j$) to when the handover really happens ($h_j$), averaged over the ship. Lower is better.`}</Md>
              <p className="text-xs leading-relaxed text-zinc-400">
                The delay of one handover is defined as in <i>Kim and Bae (2004), Fig. 2</i>. The same measure is shown on the Home tab.
              </p>
              <p className="mt-auto rounded-xl bg-zinc-800 px-4 py-3 text-xs leading-relaxed text-zinc-300">
                Every method is run on the same 30 ships with the same random draws. Results are the mean with a 95% interval of the
                paired differences.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ 4. why seconds matter */}
      <section className="border-y border-zinc-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <SectionHead kicker="Why Seconds Matter" title="Today’s Best Methods Still Leave the Cranes Waiting">
              <p>
                A quay crane in our simulator needs 75 s per container. So every second of waiting per container is about 1.3% of
                the crane’s working time (1 ÷ 75, our arithmetic). The chart shows what each method loses on our simulated ship when
                crane times vary by ±20% and AGV speeds by ±10%.
              </p>
            </SectionHead>
          </motion.div>
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <motion.figure {...fade} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <figcaption className="mb-5 text-sm font-semibold text-zinc-900">Crane Idle Time per Container, in Seconds</figcaption>
              <ul className="flex flex-col gap-3.5" aria-label="Crane idle time per container for seven methods">
                {BARS.map((b) => (
                  <li key={b.name} className="grid grid-cols-[9.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[13rem_minmax(0,1fr)]">
                    <span className="flex flex-col leading-tight">
                      <span className="text-sm font-medium text-zinc-900">{b.name}</span>
                      <span className="text-xs text-zinc-500">{b.note}</span>
                    </span>
                    <span className="relative flex h-6 items-center">
                      <motion.span initial={{ width: 0 }} whileInView={{ width: `${(b.mean / XMAX) * 100}%` }} viewport={{ once: true }}
                        transition={{ duration: 0.8 }} className={`h-full rounded-r-md ${b.tone}`} />
                      <span className="absolute h-3 border-x border-zinc-900/60"
                        style={{ left: `${((b.mean - b.ci) / XMAX) * 100}%`, width: `${((2 * b.ci) / XMAX) * 100}%` }}>
                        <span className="absolute left-0 right-0 top-1/2 border-t border-zinc-900/60" />
                      </span>
                      <span className="absolute text-xs font-semibold tabular-nums text-zinc-900"
                        style={{ left: `calc(${((b.mean + b.ci) / XMAX) * 100}% + 6px)` }}>{b.mean.toFixed(2)}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs italic leading-relaxed text-zinc-500">
                Experiment 4.5, model v5, 12 AGVs, 30 paired seeds, mean with 95% interval, 21 Oct 2026. The dispatcher that knows
                the future is the best plan our search found with the real times known in advance.
              </p>
            </motion.figure>
            <div className="flex flex-col gap-5">
              <motion.div {...fade} className="rounded-2xl border border-teal-200 bg-teal-50 p-6">
                <div className="text-3xl font-bold tracking-tight tabular-nums text-teal-900">2.5 ×</div>
                <p className="mt-2 text-sm leading-relaxed text-teal-900">
                  The best method available today, a plan re-optimised during service, still makes the cranes wait 2.62 s per
                  container. A dispatcher that knew the future would need only 1.05 s (our arithmetic, 2.62 ÷ 1.05). This gap is the
                  room a learned dispatcher can aim for.
                </p>
              </motion.div>
              <motion.figure {...fade} className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6">
                <blockquote className="font-serif text-base italic leading-relaxed text-zinc-700">
                  “Longer turnaround times reduce effective shipping capacity and propagate delays across global networks.”
                </blockquote>
                <Source>
                  World Bank (2026), The Container Port Performance Index 2025, data of S&amp;P Global Market Intelligence,{' '}
                  <a href="https://trid.trb.org/View/2712643" target="_blank" rel="noreferrer" className="underline hover:text-zinc-700">abstract</a>
                </Source>
              </motion.figure>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ 5. why it is hard */}
      <section className="bg-zinc-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <SectionHead kicker="Why It Is Hard" title="Three Reasons, Each Measured in Our Simulator" />
          </motion.div>
          <div className="grid gap-5 md:grid-cols-3">
            {HARD.map((h, i) => (
              <motion.div key={h.title} {...fade} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6">
                <h.icon className="mb-5 h-7 w-7 text-teal-700" />
                <div className="text-2xl font-bold tracking-tight tabular-nums">{h.stat}</div>
                <h3 className="mb-3 mt-1 text-sm font-semibold text-zinc-800">{h.title}</h3>
                <p className="mb-5 flex-grow text-sm leading-relaxed text-zinc-600">{h.text}</p>
                <Source>{h.source}</Source>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ 6. what we model */}
      <section className="border-y border-zinc-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <SectionHead kicker="Scope" title="What the Simulator Includes, Simplifies and Leaves for Later">
              <p>
                Every value in the simulator comes from a published source or is marked as our own assumption. The full list is on
                the Simulation tab.
              </p>
            </SectionHead>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-3">
            {SCOPE.map((c) => (
              <motion.div key={c.title} {...fade}
                className={`flex flex-col gap-4 rounded-2xl border p-6 ${c.tone === 'yes' ? 'border-teal-300 bg-teal-50' : c.tone === 'later' ? 'border-amber-200 bg-amber-50' : 'border-zinc-200 bg-zinc-50'}`}>
                <h3 className={`text-lg font-semibold ${c.tone === 'yes' ? 'text-teal-900' : c.tone === 'later' ? 'text-amber-900' : 'text-zinc-900'}`}>{c.title}</h3>
                <ul className="flex flex-col gap-2.5">
                  {c.items.map((it) => (
                    <li key={it} className="flex gap-2.5 text-sm leading-snug text-zinc-700">
                      {c.tone === 'yes' ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                        : c.tone === 'later' ? <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                        : <Minus className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />}
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ 7. research questions, closing */}
      <section className="bg-zinc-900 px-4 py-20 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <motion.div {...fade} className="flex max-w-3xl flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-400">Research Questions</span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Two Questions This Thesis Answers</h2>
          </motion.div>
          <motion.ol {...fade} className="grid gap-4 md:grid-cols-2">
            {QUESTIONS.map((q) => (
              <li key={q.n} className="flex flex-col gap-4 rounded-2xl border border-zinc-700 bg-zinc-800/60 p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-teal-400 px-3 py-1 text-sm font-bold text-zinc-900">{q.n}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${q.status === 'Next' ? 'bg-zinc-700 text-zinc-300' : 'bg-amber-400/15 text-amber-300'}`}>{q.status}</span>
                </div>
                <span className="text-xl font-semibold">{q.title}</span>
                <p className="border-t border-zinc-700 pt-4 text-sm leading-relaxed text-zinc-300">{q.text}</p>
              </li>
            ))}
          </motion.ol>
          <motion.div {...fade} className="flex flex-wrap gap-3">
            <Link href="/methodology" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-200">
              How We Answer Them <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/simulation" className="inline-flex items-center gap-2 rounded-full border border-zinc-600 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800">
              The Simulated Terminal <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </Link>
            <Link href="/experiments" className="inline-flex items-center gap-2 rounded-full border border-zinc-600 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800">
              See the Experiments <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </Link>
            <Link href="/literature" className="inline-flex items-center gap-2 rounded-full border border-zinc-600 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800">
              What Earlier Studies Did <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </Link>
          </motion.div>
          <p className="text-xs text-zinc-500">Last updated {UPDATED}.</p>
        </div>
      </section>
    </div>
  );
}
