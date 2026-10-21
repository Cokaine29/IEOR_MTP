'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, Check, Minus, Clock3, Route, TrafficCone, Target,
  Truck, MousePointerClick, Navigation, Handshake, Layers, Shuffle, Timer, RotateCcw,
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

/* ---------- 0. the setting in brief (values as on the Simulation tab) */
const SETTING = [
  { stat: '2', unit: 'Quay Cranes', text: 'Each one needs about 75 s to handle a container.', source: 'Zhao et al. (2025); Liu, Jula and Ioannou (2001)' },
  { stat: '12', unit: 'AGVs', text: 'Six per crane on average. Any AGV can serve either crane.', source: 'Luo (2016), usually 5 to 8 AGVs per crane' },
  { stat: '50', unit: 'Yard Blocks', text: 'AGVs set containers down on, or pick them up from, transfer racks at each block.', source: 'Liu et al. (2016); Wu et al. (2016)' },
  { stat: '200', unit: 'Containers per Ship', text: '100 to unload from the ship and 100 to load onto it.', source: 'Kim and Bae (2004); Zhao et al. (2025)' },
];

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
function Tag({ kind }: { kind: 'Unloading' | 'Loading' }) {
  return (
    <span className={`w-fit shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${kind === 'Unloading' ? 'bg-sky-100 text-sky-800' : 'bg-violet-100 text-violet-800'}`}>{kind}</span>
  );
}

function Hop({ items }: { items: string[] }) {
  return (
    <span className="flex flex-wrap items-center gap-1">
      {items.map((it, i) => (
        <span key={it} className="flex items-center gap-1">
          <span className="rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 text-xs text-zinc-700">{it}</span>
          {i < items.length - 1 && <ArrowRight className="h-3 w-3 text-zinc-400" />}
        </span>
      ))}
    </span>
  );
}

const LOOP: { icon: typeof Truck; title: string; body: React.ReactNode }[] = [
  {
    icon: Truck, title: 'An AGV Becomes Free',
    body: (
      <ul className="flex flex-col gap-2 text-sm text-zinc-600">
        <li className="flex flex-col gap-1"><Tag kind="Unloading" /> It has just set a container down on a yard rack.</li>
        <li className="flex flex-col gap-1"><Tag kind="Loading" /> It has just handed a container to the crane.</li>
      </ul>
    ),
  },
  {
    icon: MousePointerClick, title: 'The Dispatcher Chooses',
    body: (
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-teal-800">Its options for this AGV</span>
        {['Next job of Crane 1', 'Next job of Crane 2', 'Park and wait'].map((o) => (
          <span key={o} className="rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800">{o}</span>
        ))}
      </div>
    ),
  },
  {
    icon: Navigation, title: 'The AGV Drives',
    body: (
      <ul className="flex flex-col gap-2.5 text-sm text-zinc-600">
        <li className="flex flex-col gap-1.5"><Tag kind="Unloading" /><Hop items={['Drives empty', 'Crane']} /></li>
        <li className="flex flex-col gap-1.5"><Tag kind="Loading" /><Hop items={['Yard rack', 'Picks up', 'Crane']} /></li>
      </ul>
    ),
  },
  {
    icon: Handshake, title: 'Crane and AGV Meet',
    body: (
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-zinc-500">The crane’s time</span>
          <div className="flex h-7 overflow-hidden rounded-md text-[11px] font-semibold">
            <span className="flex w-[55%] items-center justify-center bg-zinc-300 text-zinc-700">Handles</span>
            <span className="flex w-[45%] items-center justify-center bg-red-500 text-white">Waits for AGV</span>
          </div>
          <div className="relative h-4 text-[11px] font-medium text-zinc-500">
            <span className="absolute left-[55%] -translate-x-1/2">↑ ready</span>
            <span className="absolute right-0">AGV arrives ↑</span>
          </div>
        </div>
        <span className="text-sm text-zinc-600">If the AGV comes late, the crane stands still. That wait is the <b className="text-zinc-900">Crane Idle Time</b>.</span>
      </div>
    ),
  },
];

/* ---------- 3. what the dispatcher may do */
const RULES = [
  { text: 'An AGV carries one container at a time.', source: '' },
  { text: 'Each crane works through its own list of containers in a fixed order, set by the ship’s stowage plan.', source: '' },
  { text: 'The dispatcher can look only a little way ahead. It sees the next 10 containers on each crane’s list.', source: 'Kim and Bae (2004)' },
  { text: 'Containers get their AGVs in list order. The dispatcher cannot send an AGV for a later container while an earlier one on the same list still has none.', source: 'Briskorn, Drexl and Hartmann (2006)' },
  { text: 'It does not send more empty AGVs to a crane than that crane has containers to unload soon.', source: '' },
  { text: 'AGVs never collide. Each one books the road ahead of it, its own length plus its braking distance.', source: 'Kim, Jeon and Ryu (2006)' },
];

/* ---------- 4. why seconds matter, Experiment 4.5 at level 1 (crane times ±20%, AGV speeds ±10%) */
const BARS = [
  { name: 'Plan, Re-optimised During Service', note: 'memetic GA', mean: 2.62, ci: 0.39, tone: 'bg-zinc-800' },
  { name: 'Plan Made in Advance', note: 'memetic GA', mean: 3.38, ci: 0.48, tone: 'bg-zinc-800' },
  { name: 'NV/FCFS Rule', note: 'Grunow et al. 2006', mean: 3.77, ci: 0.53, tone: 'bg-zinc-500' },
  { name: 'Fixed Groups Rule', note: 'AGVs tied to one crane', mean: 4.09, ci: 1.04, tone: 'bg-zinc-500' },
  { name: 'Inventory Rule', note: 'Briskorn et al. 2006', mean: 4.45, ci: 1.0, tone: 'bg-zinc-500' },
  { name: 'Random Choice', note: 'floor', mean: 7.63, ci: 0.76, tone: 'bg-zinc-300' },
];
const XMAX = 9.5;
const CRANE_ROWS = [
  { label: 'NV/FCFS rule', wait: 3.77, target: false },
  { label: 'Best method we tested', wait: 2.62, target: false },
  { label: 'Target, knows the future', wait: 1.05, target: true },
].map((r) => ({ ...r, cranes: (29 * r.wait) / (75 + r.wait) }));
const TARGET = { name: 'Knows the Future', note: 'target only, not possible in practice', mean: 1.05, ci: 0.18 };

/* ---------- 5. why it is hard */
function Row({ left, right, tone = 'zinc' }: { left: React.ReactNode; right: React.ReactNode; tone?: 'zinc' | 'red' | 'teal' | 'amber' }) {
  const c = { zinc: 'border-zinc-200 bg-zinc-50', red: 'border-red-200 bg-red-50', teal: 'border-teal-200 bg-teal-50', amber: 'border-amber-200 bg-amber-50' }[tone];
  return (
    <div className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm ${c}`}>
      <span className="text-zinc-700">{left}</span>
      <span className="shrink-0 font-semibold tabular-nums text-zinc-900">{right}</span>
    </div>
  );
}

const HARD: { icon: typeof Layers; stat: string; title: string; lead: string; body: React.ReactNode; source: string }[] = [
  {
    icon: Layers, stat: '9 × 10⁵⁸', title: 'Too Many Possible Plans',
    lead: 'Each crane’s containers come in a fixed order. So a plan only has to say which crane gets each next free AGV, as a list like this.',
    body: (
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-2.5">
          {['C1', 'C2', 'C2', 'C1', 'C2', 'C1', 'C1'].map((c, k) => (
            <span key={k} className={`rounded px-1.5 py-0.5 text-xs font-semibold ${c === 'C1' ? 'bg-zinc-800 text-white' : 'bg-teal-600 text-white'}`}>{c}</span>
          ))}
          <span className="text-xs text-zinc-400">… one entry per container</span>
        </div>
        <span className="text-xs font-medium text-zinc-500">How many different lists are possible</span>
        <Row left={<>Small test ship, <b>12</b> containers</>} right={<span className="flex items-center gap-1.5">924 <Check className="h-4 w-4 text-teal-700" /></span>} tone="teal" />
        <Md className="-mt-1 px-1 text-xs text-zinc-600">{String.raw`Pick which 6 of the 12 slots say C1, the rest say C2. $$\binom{12}{6} = \frac{12!}{6!\;6!} = 924$$`}</Md>
        <Row left={<>Our ship, <b>200</b> containers</>} right={<span className="flex items-center gap-1.5">9 × 10⁵⁸ <span className="text-red-600">✕</span></span>} tone="red" />
        <Md className="-mt-1 px-1 text-xs text-zinc-600">{String.raw`Pick which 100 of the 200 slots say C1. $$\binom{200}{100} \approx 9 \times 10^{58}$$`}</Md>
        <div className="rounded-lg bg-zinc-900 px-3 py-2.5 text-sm leading-snug text-white">
          Checking a billion lists every second would take about <b className="text-amber-300">3 × 10⁴² years</b>.
        </div>
        <p className="text-xs leading-relaxed text-zinc-500">
          So nobody can check every plan. A search tries the promising ones. On the small ship we can check all 924, and our
          search found the very best list in <b className="text-zinc-800">17 to 19 of 20</b> cases. On the real ship we have to trust it.
        </p>
      </div>
    ),
    source: 'Counts and 9 × 10⁵⁸ ÷ 10⁹ per second are our arithmetic. Search check, Experiment 3.1, 20 Oct 2026.',
  },
  {
    icon: Shuffle, stat: '30 of 30 → 17 of 30', title: 'Plans Go Stale',
    lead: 'A plan made in advance against the simple NV/FCFS rule, on the same 30 test ships.',
    body: (
      <div className="flex flex-col gap-4">
        {[
          { label: 'With exact times', plan: 1.13, rule: 3.39, wins: 30, verdict: 'The plan wins on every ship.', good: true },
          { label: 'With random times', plan: 3.38, rule: 3.77, wins: 17, verdict: 'The plan wins on only 17 ships, close to a coin toss.', good: false },
        ].map((c) => (
          <div key={c.label} className={`flex flex-col gap-2 rounded-lg border p-3 ${c.good ? 'border-teal-200 bg-teal-50' : 'border-amber-200 bg-amber-50'}`}>
            <span className="text-sm font-semibold text-zinc-900">{c.label}</span>
            {[['Plan', c.plan, 'bg-zinc-800'], ['NV/FCFS', c.rule, 'bg-zinc-400']].map(([n, v, tone]) => (
              <div key={n as string} className="flex items-center gap-2 text-xs">
                <span className="w-14 shrink-0 text-zinc-600">{n}</span>
                <span className="h-2.5 flex-1 rounded bg-white">
                  <span className={`block h-full rounded ${tone}`} style={{ width: `${((v as number) / 4) * 100}%` }} />
                </span>
                <span className="w-12 shrink-0 text-right font-semibold tabular-nums text-zinc-900">{(v as number).toFixed(2)} s</span>
              </div>
            ))}
            <div className="mt-1 flex flex-wrap gap-[3px]" aria-label={`Plan wins on ${c.wins} of 30 ships`}>
              {Array.from({ length: 30 }, (_, k) => (
                <span key={k} className={`h-2.5 w-2.5 rounded-full ${k < c.wins ? (c.good ? 'bg-teal-600' : 'bg-amber-500') : 'bg-zinc-300'}`} />
              ))}
            </div>
            <span className="text-xs text-zinc-700">Each dot is one ship, coloured where the plan waited less. {c.verdict}</span>
          </div>
        ))}
        <div className="flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-semibold text-zinc-900">Plan as a fixed timetable per AGV</span>
            <span className="shrink-0 text-sm font-bold tabular-nums text-red-700">5.33 s</span>
          </div>
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <span className="text-zinc-600">AGV 3’s own list</span>
            {['C1', 'C1', 'C2', 'C1'].map((c, k) => (
              <span key={k} className="flex items-center gap-1">
                <span className={`rounded px-1.5 py-0.5 font-semibold text-white ${c === 'C1' ? 'bg-zinc-800' : 'bg-teal-600'}`}>{c}</span>
                {k < 3 && <ArrowRight className="h-3 w-3 text-zinc-400" />}
              </span>
            ))}
          </div>
          <span className="text-xs leading-relaxed text-zinc-700">
            Many plans made in advance give each AGV its own fixed list of jobs. With random times, an AGV keeps waiting for its
            planned crane even when the other crane needs it. This does worse than every rule except Random.
          </span>
        </div>
      </div>
    ),
    source: 'Crane wait per container, average over 30 test ships. Experiments 4.1 (exact times) and 4.5 (crane times ±20%, AGV speeds ±10%), 20 to 21 Oct 2026.',
  },
  {
    icon: Timer, stat: '55 to 74 s', title: 'Little Time to Think',
    lead: 'The obvious fix for stale plans is to make a new plan during service. But that takes time.',
    body: (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-700">
          <span className="text-sm font-semibold text-zinc-900">How re-planning works</span>
          <span className="flex items-start gap-2"><b className="w-4 shrink-0 text-teal-700">1</b> After every 10 containers handed over, the memetic GA starts again from the current situation.</span>
          <span className="flex items-start gap-2"><b className="w-4 shrink-0 text-teal-700">2</b> It tests 500 new lists in the simulator, about 0.1 s each.</span>
          <span className="flex items-start gap-2"><b className="w-4 shrink-0 text-teal-700">3</b> The best list replaces the old one. That is 18 new plans per ship.</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="relative h-6 overflow-hidden rounded bg-zinc-200">
            <span className="absolute inset-y-0 left-0 bg-amber-400/80" style={{ width: `${(74 / 75) * 100}%` }} />
            <span className="absolute inset-y-0 left-0 bg-amber-500" style={{ width: `${(55 / 75) * 100}%` }} />
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-zinc-900">one new plan, 55 to 74 s</span>
          </div>
          <div className="flex justify-between text-[11px] text-zinc-500"><span>0 s</span><span>one crane cycle, 75 s</span></div>
        </div>
        <span className="text-xs font-medium text-zinc-500">Extra crane wait per container, compared with a plan that is ready at once</span>
        <Row left="Wait 54 s for each full search" right="+0.43 s" tone="amber" />
        <Row left="Use a quick search instead, 1.6 s with 15 tests" right="+0.46 s" tone="amber" />
        <Row left="And a plan ready at once still waits more than the target by" right="+1.59 s" tone="zinc" />
        <p className="text-xs leading-relaxed text-zinc-500">A dispatcher that decides in a fraction of a second is needed. Choe et al. (2016) report 10 to 40 s per decision for their own rolling search.</p>
      </div>
    ),
    source: 'All rows with crane times varying ±40%. Experiments 4.2 (plan ready at once) and 4.3 (thinking time counted), one processor per search, 21 Oct 2026. The 55 to 74 s is from Experiment 4.5.',
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
    <div className="min-h-screen bg-white text-zinc-900 [&_p:not(.italic)]:text-justify [&_p]:hyphens-auto [&_li]:text-justify [&_li]:hyphens-auto [&_blockquote]:text-justify">
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

      {/* ------------------------------------------------ 0. the setting */}
      <section className="border-b border-zinc-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <SectionHead kicker="Our Simulated Terminal" title="The Setting in Brief">
              <p>
                We study the problem on a simulated part of Yangshan Phase IV, built from published data. Two of its quay cranes
                serve one ship, and a fleet of AGVs carries every container between the cranes and the yard.
              </p>
            </SectionHead>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SETTING.map((s, i) => (
              <motion.div key={s.unit} {...fade} transition={{ duration: 0.5, delay: i * 0.06 }}
                className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight tabular-nums text-teal-700">{s.stat}</span>
                  <span className="font-semibold text-zinc-900">{s.unit}</span>
                </div>
                <p className="flex-grow text-sm leading-relaxed text-zinc-600">{s.text}</p>
                <p className="text-xs italic leading-relaxed text-zinc-500">{s.source}</p>
              </motion.div>
            ))}
          </div>
          <motion.div {...fade} className="mt-4 flex flex-col gap-3 rounded-2xl border border-teal-200 bg-teal-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-teal-900">
              <b>Each crane has a work list.</b> It handles its containers in a fixed order, set by the ship’s stowage plan, the
              plan of where every container sits on the ship. An AGV must be under the crane for each one in turn.
            </p>
            <Link href="/simulation" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-teal-800 hover:text-teal-950">
              Full set-up <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
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
                Every container needs its own AGV trip, so the dispatcher decides again and again while the ship is served. This
                is one round of that loop.
              </p>
            </SectionHead>
          </motion.div>
          <motion.ol {...fade} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LOOP.map((s, i) => (
              <li key={s.title} className={`relative flex flex-col gap-4 rounded-2xl border p-5 ${i === 1 ? 'border-teal-300 bg-teal-50 shadow-sm' : 'border-zinc-200 bg-zinc-50'}`}>
                <div className="flex items-center gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${i === 1 ? 'bg-teal-600 text-white' : 'bg-zinc-900 text-white'}`}>
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${i === 1 ? 'text-teal-700' : 'text-zinc-400'}`}>Step {i + 1}</span>
                    <span className="font-semibold text-zinc-900">{s.title}</span>
                  </span>
                </div>
                {s.body}
                {i < LOOP.length - 1 && (
                  <span className="absolute -right-3.5 top-9 z-10 hidden h-7 w-7 items-center justify-center rounded-full border border-zinc-200 bg-white lg:flex">
                    <ArrowRight className="h-4 w-4 text-zinc-400" />
                  </span>
                )}
              </li>
            ))}
          </motion.ol>
          <motion.div {...fade} className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-zinc-300 px-5 py-3.5 text-sm text-zinc-600">
            <RotateCcw className="h-5 w-5 shrink-0 text-teal-700" />
            <span>Then the AGV is free again, and the loop repeats. One ship of 200 containers needs at least 200 of these decisions, one after the other.</span>
          </motion.div>

          <motion.div {...fade} className="mt-10 grid gap-4 md:grid-cols-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 md:col-span-2">When the Dispatcher Is Asked</h3>
            <div className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white">A</span>
              <span className="flex flex-col gap-1 text-sm leading-relaxed text-zinc-600">
                <b className="text-zinc-900">An AGV Finishes Its Job</b>
                <span>This is the usual moment, and the same as in <i>Kim and Bae (2004)</i> and <i>Briskorn et al. (2006)</i>.</span>
              </span>
            </div>
            <div className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white">B</span>
              <span className="flex flex-col gap-1 text-sm leading-relaxed text-zinc-600">
                <b className="text-zinc-900">A Crane Finishes a Container</b>
                <span>The dispatcher only sees the next 10 containers of each crane. When a crane finishes one, a new container joins
                that list. So an AGV that was told to park gets another chance at a job.</span>
              </span>
            </div>
          </motion.div>
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
            <SectionHead kicker="Why Seconds Matter" title="Even the Best Method We Tested Leaves the Cranes Waiting" />
          </motion.div>
          <motion.div {...fade} className="mb-8 grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-zinc-900">What a Few Seconds Mean at Real Scale</span>
                <span className="text-sm leading-relaxed text-zinc-600">
                  Yangshan Phase IV runs <b className="text-zinc-900">29 quay cranes</b>. If its cranes waited as long as in our tests,
                  the lost time would add up to whole cranes standing still, all year round.
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {CRANE_ROWS.map((r) => (
                  <div key={r.label} className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="font-medium text-zinc-800">{r.label} <span className="text-xs font-normal text-zinc-500">{r.wait.toFixed(2)} s per container</span></span>
                      <span className={`shrink-0 font-bold tabular-nums ${r.target ? 'text-teal-700' : 'text-red-600'}`}>≈ {r.cranes.toFixed(1)} {r.cranes < 1.05 && r.cranes > 0.95 ? 'crane' : 'cranes'}</span>
                    </div>
                    <div className="flex gap-[3px]" aria-hidden>
                      {Array.from({ length: 29 }, (_, k) => {
                        const fill = Math.max(0, Math.min(1, r.cranes - k));
                        return (
                          <span key={k} className="relative h-4 flex-1 overflow-hidden rounded-sm bg-zinc-300">
                            <span className={`absolute inset-y-0 left-0 ${r.target ? 'bg-teal-500' : 'bg-red-500'}`} style={{ width: `${fill * 100}%` }} />
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs italic leading-relaxed text-zinc-500">
                Illustration, our arithmetic. Share of crane time lost = wait ÷ (75 s + wait), times 29 cranes. 29 cranes from the
                Shanghai news release (2026), 75 s per container from Zhao et al. (2025) and Liu, Jula and Ioannou (2001). Assumes
                the real cranes lose time at the rate of our simulated ones.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <span className="text-sm font-semibold text-zinc-900">The Test in the Chart</span>
              <div className="flex flex-wrap gap-2">
                {['Crane times vary ±20%', 'AGV speeds vary ±10%', '30 test ships'].map((c) => (
                  <span key={c} className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700">{c}</span>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-zinc-600">
                We simulate the same ship 30 times, each time with different random crane times and AGV speeds. Every method
                faces exactly the same 30 versions, so the comparison is fair.
              </p>
              <p className="text-sm leading-relaxed text-zinc-600">
                Each bar is the average crane wait per container over the 30 runs. How sure we are of each average is shown
                on the Results tab.
              </p>
            </div>
          </motion.div>
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <motion.figure {...fade} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <figcaption className="mb-5 text-sm font-semibold text-zinc-900">Crane Idle Time per Container, in Seconds</figcaption>
              <ul className="flex flex-col gap-3.5" aria-label="Crane idle time per container for six methods">
                {BARS.map((b) => (
                  <li key={b.name} className="!text-left grid grid-cols-[9.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[13rem_minmax(0,1fr)]">
                    <span className="flex flex-col leading-tight">
                      <span className="text-sm font-medium text-zinc-900">{b.name}</span>
                      <span className="text-xs text-zinc-500">{b.note}</span>
                    </span>
                    <span className="relative flex h-6 items-center">
                      <motion.span initial={{ width: 0 }} whileInView={{ width: `${(b.mean / XMAX) * 100}%` }} viewport={{ once: true }}
                        transition={{ duration: 0.8 }} className={`h-full rounded-r-md ${b.tone}`} />
                      <span className="absolute text-xs font-semibold tabular-nums text-zinc-900"
                        style={{ left: `calc(${(b.mean / XMAX) * 100}% + 6px)` }}>{b.mean.toFixed(2)}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="my-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-teal-700">
                <span className="h-px flex-1 bg-teal-200" /> Target Line, Not a Real Method <span className="h-px flex-1 bg-teal-200" />
              </div>
              <div className="grid grid-cols-[9.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[13rem_minmax(0,1fr)]">
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-medium text-teal-900">{TARGET.name}</span>
                  <span className="text-xs text-teal-700">{TARGET.note}</span>
                </span>
                <span className="relative flex h-6 items-center">
                  <span className="h-full rounded-r-md border-2 border-dashed border-teal-600 bg-teal-50" style={{ width: `${(TARGET.mean / XMAX) * 100}%` }} />
                  <span className="absolute text-xs font-semibold tabular-nums text-teal-900" style={{ left: `calc(${(TARGET.mean / XMAX) * 100}% + 6px)` }}>{TARGET.mean.toFixed(2)}</span>
                </span>
              </div>
              <p className="mt-5 text-xs italic leading-relaxed text-zinc-500">
                Experiment 4.5, model v5, 12 AGVs, average over 30 test ships, 21 Oct 2026. The target is the same
                kind of plan, made after seeing the real times of each ship. No real terminal can know those in advance, so it only
                shows how low the waiting could go.
              </p>
            </motion.figure>
            <motion.div {...fade} className="flex flex-col gap-5 rounded-2xl border border-teal-200 bg-teal-50 p-6">
              <div className="flex items-baseline gap-3">
                <span className="whitespace-nowrap text-4xl font-bold tracking-tight tabular-nums text-teal-900">2.5 ×</span>
                <span className="text-sm font-semibold text-teal-900">more crane waiting than the target</span>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Best method we tested', sub: 'plan re-optimised during service', v: 2.62, tone: 'bg-zinc-800' },
                  { label: 'Target', sub: 'knows the future, not possible in practice', v: 1.05, tone: 'bg-teal-600' },
                ].map((r) => (
                  <div key={r.label} className="flex flex-col gap-1">
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-medium text-zinc-900">{r.label} <span className="text-xs font-normal text-zinc-500">{r.sub}</span></span>
                      <span className="shrink-0 whitespace-nowrap font-semibold tabular-nums text-zinc-900">{r.v.toFixed(2)} s</span>
                    </div>
                    <div className="h-4 rounded bg-white">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${(r.v / 3) * 100}%` }} viewport={{ once: true }}
                        transition={{ duration: 0.8 }} className={`h-full rounded ${r.label === 'Target' ? 'border-2 border-dashed border-teal-600 bg-teal-100' : r.tone}`} />
                    </div>
                  </div>
                ))}
                <div className="relative h-6">
                  <span className="absolute top-1 h-3 border-x border-b border-amber-500" style={{ left: `${(1.05 / 3) * 100}%`, width: `${(1.57 / 3) * 100}%` }} />
                </div>
                <div className="-mt-2 rounded-xl bg-amber-100 px-4 py-3 text-sm text-amber-900">
                  <b className="tabular-nums">1.57 s per container</b> of room left. This gap is what a learned dispatcher can aim for.
                </div>
              </div>
              <p className="text-xs italic text-teal-900/70">2.62 ÷ 1.05 and 2.62 − 1.05, our arithmetic. Experiment 4.5.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ 5. why it is hard */}
      <section className="bg-zinc-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <SectionHead kicker="Why It Is Hard" title="Why Planning Ahead Is Not Enough">
              <p>
                Three things make this job hard. We saw each of them when we tested today’s methods in our simulator, so every
                number below is our own result.
              </p>
            </SectionHead>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-3">
            {HARD.map((h, i) => (
              <motion.div key={h.title} {...fade} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6">
                <h.icon className="mb-5 h-7 w-7 text-teal-700" />
                <div className="text-2xl font-bold tracking-tight tabular-nums">{h.stat}</div>
                <h3 className="mt-1 text-sm font-semibold text-zinc-800">{h.title}</h3>
                <p className="mb-4 mt-2 text-sm leading-relaxed text-zinc-600">{h.lead}</p>
                <div className="mb-5 flex-grow">{h.body}</div>
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
