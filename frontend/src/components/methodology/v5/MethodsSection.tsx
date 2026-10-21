'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Dices, Users, Scale, Clock, Check, RefreshCw, Hourglass, Eye, ListOrdered, CalendarClock } from 'lucide-react';
import { fade, SectionHead, Source } from './common';
import Md from '@/components/experiments/Md';

function Chip({ c }: { c: 'C1' | 'C2' }) {
  return <span className={`rounded px-1.5 py-0.5 text-[11px] font-semibold text-white ${c === 'C1' ? 'bg-zinc-800' : 'bg-teal-600'}`}>{c}</span>;
}

function Crane({ name, n, pick }: { name: string; n: number; pick?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 rounded-lg border px-3 py-2 ${pick ? 'border-teal-400 bg-teal-50' : 'border-zinc-200 bg-white'}`}>
      <span className="text-xs font-semibold text-zinc-800">{name}</span>
      <span className="flex gap-0.5">{Array.from({ length: n }, (_, k) => <span key={k} className="h-2 w-3 rounded-sm bg-zinc-500" />)}</span>
      <span className="text-[10px] text-zinc-500">{n} on the way</span>
    </div>
  );
}

const RULES = [
  {
    icon: Dices, name: 'Random', role: 'The floor',
    how: 'The free AGV goes to a crane picked at random, among cranes with an open job.',
    visual: (
      <div className="flex items-center gap-2 text-xs text-zinc-600"><Dices className="h-5 w-5 text-zinc-500" /> C1 or C2, by chance</div>
    ),
    source: 'Any sensible method should beat it.',
  },
  {
    icon: Users, name: 'Fixed Groups', role: 'Common practice',
    how: 'Each AGV belongs to one crane for the whole ship, 6 AGVs per crane. It only ever serves its own crane.',
    visual: (
      <div className="flex flex-col gap-1 text-[11px] text-zinc-600">
        <span className="flex items-center gap-1">C1 <span className="flex gap-0.5">{Array.from({ length: 6 }, (_, k) => <span key={k} className="h-2.5 w-3 rounded-sm bg-zinc-800" />)}</span></span>
        <span className="flex items-center gap-1">C2 <span className="flex gap-0.5">{Array.from({ length: 6 }, (_, k) => <span key={k} className="h-2.5 w-3 rounded-sm bg-teal-600" />)}</span></span>
      </div>
    ),
    source: 'Kress et al. (2019), vehicles dedicated to a crane.',
  },
  {
    icon: Scale, name: 'Inventory Rule', role: 'Balance the cranes',
    how: 'The free AGV goes to the crane with the fewest AGVs already on the way to it. A crane that is loading counts as needing more, by a factor of 1.6.',
    visual: (
      <div className="flex items-center gap-2"><Crane name="C1" n={3} /><Crane name="C2" n={1} pick /><ArrowRight className="h-4 w-4 text-teal-600" /><span className="text-xs font-semibold text-teal-700">C2</span></div>
    ),
    source: 'Briskorn, Drexl and Hartmann (2006), Table 2.',
  },
  {
    icon: Clock, name: 'NV/FCFS Rule', role: 'First come, first served',
    how: 'The free AGV takes the container that came into view earliest, on either crane. When several AGVs are parked, each waiting job goes to the nearest one.',
    visual: (
      <div className="flex items-center gap-1.5 text-[11px]">
        {[['C2', '08:01', true], ['C1', '08:03', false], ['C2', '08:04', false]].map(([c, t, first]) => (
          <span key={t as string} className={`flex flex-col items-center rounded-md border px-2 py-1 ${first ? 'border-teal-400 bg-teal-50' : 'border-zinc-200 bg-white'}`}>
            <Chip c={c as 'C1' | 'C2'} /><span className="mt-0.5 tabular-nums text-zinc-500">{t as string}</span>
          </span>
        ))}
        <span className="ml-1 text-xs font-semibold text-teal-700">takes the first</span>
      </div>
    ),
    source: 'Grunow, Günther and Lehmann (2006), the on-line rule pair.',
  },
];

const GA_STEPS = [
  { n: '1', title: 'Start With Good Guesses', text: 'Run each rule once and write down the list it produced. Add shuffled copies until there are 12 lists.' },
  { n: '2', title: 'Pick Two Parents', text: 'Pick two lists at random and keep the better one. Do it twice to get two parents.' },
  { n: '3', title: 'Mix Them', text: 'Take the start of one parent, then fill in the rest in the order of the other. Each crane keeps its count.' },
  { n: '4', title: 'Change a Little', text: 'Move two random entries a few places. Then try moving single entries up to 4 places, keeping any move that helps.' },
  { n: '5', title: 'Test in the Simulator', text: 'Every new list is scored by running the whole ship with the planned times. Score = total crane wait.' },
  { n: '6', title: 'Keep the Better Lists', text: 'If the new list beats the worst of the 12, it replaces it. Stop after 10,000 simulator runs.' },
];

const USES = [
  { icon: ListOrdered, name: 'Plan Made in Advance', tag: 'Shared list', text: 'The best list is fixed before the ship arrives. Whichever AGV is free first takes the next entry that has an open job.', exp: '4.1, 4.4, 4.5' },
  { icon: CalendarClock, name: 'Fixed Timetable per AGV', tag: 'Strict plan', text: 'The same plan, but split into one list per AGV. An AGV waits for its planned crane, even if the other crane needs it.', exp: '4.1, 4.4, 4.5' },
  { icon: RefreshCw, name: 'Re-planning During Service', tag: 'Rolling plan', text: 'After every 10 containers handed over, the GA searches again from the current state, with 500 simulator runs. It uses the real times seen so far and planned times for the rest.', exp: '4.2, 4.5' },
  { icon: Hourglass, name: 'Re-planning With Thinking Time', tag: 'Honest clock', text: 'As above, but the new plan only takes effect once the search would have finished, about 0.1 s per simulator run. Searches of 15, 70, 500 and 1,700 runs take 1.6, 7.6, 54 and 184 s.', exp: '4.3' },
  { icon: Eye, name: 'Knows the Future', tag: 'Target only', text: 'The GA is given every real crane time and AGV speed of the ship in advance. Best of 3 searches. No terminal can do this, so it only shows how low waiting could go.', exp: '4.1, 4.4, 4.5' },
];

export default function MethodsSection() {
  return (
    <section className="border-y border-zinc-200 bg-white px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fade}>
          <SectionHead id="methods" kicker="Step 4 · The Methods" title="Today’s Methods, and How Each One Decides">
            <p>
              Every method answers the same question each time an AGV becomes free: which crane should it serve next? They differ
              only in how they choose. We test two families, simple rules that decide on the spot, and plans optimised in advance.
            </p>
          </SectionHead>
        </motion.div>

        {/* ---------------- rules */}
        <motion.h3 {...fade} className="mb-4 text-xl font-semibold text-zinc-900">Family 1. Dispatching Rules</motion.h3>
        <div className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RULES.map((r, i) => (
            <motion.div key={r.name} {...fade} transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white"><r.icon className="h-5 w-5" /></span>
                <span className="flex flex-col leading-tight">
                  <span className="font-semibold text-zinc-900">{r.name}</span>
                  <span className="text-xs text-zinc-500">{r.role}</span>
                </span>
              </div>
              <div className="flex min-h-[64px] items-center rounded-xl border border-zinc-200 bg-white p-3">{r.visual}</div>
              <p className="flex-grow text-sm leading-relaxed text-zinc-600">{r.how}</p>
              <p className="text-xs italic text-zinc-500">{r.source}</p>
            </motion.div>
          ))}
        </div>

        {/* ---------------- the GA */}
        <motion.div {...fade} className="mb-6 flex max-w-3xl flex-col gap-2">
          <h3 className="text-xl font-semibold text-zinc-900">Family 2. Plans Optimised by a Memetic Algorithm</h3>
          <p className="text-sm leading-relaxed text-zinc-700">
            A memetic algorithm is a genetic algorithm with a local search added to it. Ours does not search over every single
            decision. It searches over one simple object, the <b>order list</b>.
          </p>
        </motion.div>

        <motion.div {...fade} className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div className="flex flex-col gap-3 rounded-2xl border border-teal-300 bg-teal-50 p-5">
            <span className="text-sm font-semibold text-teal-900">What a plan is</span>
            <div className="flex flex-wrap items-center gap-1">
              {(['C1', 'C2', 'C2', 'C1', 'C2', 'C1', 'C1', 'C2'] as const).map((c, k) => <Chip key={k} c={c} />)}
              <span className="text-xs text-zinc-500">… 200 entries</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-700">
              One entry per container, saying which crane gets the next AGV. Each crane’s own containers already come in a fixed
              order, so this list is all a plan needs.
            </p>
            <span className="text-sm font-semibold text-teal-900">How the list is followed</span>
            <ol className="flex flex-col gap-1.5 text-sm text-zinc-700">
              <li className="flex gap-2"><b className="text-teal-700">1</b> An AGV becomes free.</li>
              <li className="flex gap-2"><b className="text-teal-700">2</b> Read the list from the top, and take the first entry whose crane has an open job.</li>
              <li className="flex gap-2"><b className="text-teal-700">3</b> Send the AGV to that crane’s next container, and cross the entry off.</li>
            </ol>
            <p className="text-xs text-zinc-600">So the intelligence is all in the list. Following it is mechanical.</p>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <span className="text-sm font-semibold text-zinc-900">How the best list is found</span>
            <ol className="grid gap-2.5 sm:grid-cols-2">
              {GA_STEPS.map((s) => (
                <li key={s.n} className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">{s.n}</span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-zinc-900">{s.title}</span>
                    <span className="text-xs leading-relaxed text-zinc-600">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="text-xs text-zinc-600">
              Steps 2 to 6 repeat. Because it starts from the rules’ own lists, the plan is never worse than those lists on the
              planned times.
            </p>
          </div>
        </motion.div>

        <motion.div {...fade} className="mb-14 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center">
          <span className="flex shrink-0 items-center gap-2 text-sm font-semibold text-zinc-900"><Check className="h-5 w-5 text-teal-700" /> Is the search good enough?</span>
          <Md className="text-sm leading-relaxed text-zinc-600">{String.raw`On small ships we can try every list, $\binom{12}{6} = 924$ or $\binom{16}{8} = 12{,}870$ of them. With 12 AGVs, the best of 3 searches finds the exact best list in 17 to 19 of 20 small cases and 8 to 9 of 10 larger ones (Experiment 3.1).`}</Md>
        </motion.div>

        {/* ---------------- uses of the plan */}
        <motion.div {...fade} className="mb-5 flex max-w-3xl flex-col gap-2">
          <h3 className="text-xl font-semibold text-zinc-900">Five Ways to Use a Plan</h3>
          <p className="text-sm leading-relaxed text-zinc-700">
            The same search is used in five ways. They differ in when the plan is made, what the planner knows, and how strictly
            the AGVs follow it.
          </p>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {USES.map((u, i) => (
            <motion.div key={u.name} {...fade} transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`flex flex-col gap-3 rounded-2xl border p-5 ${u.tag === 'Target only' ? 'border-dashed border-teal-500 bg-teal-50' : 'border-zinc-200 bg-zinc-50'}`}>
              <u.icon className={`h-6 w-6 ${u.tag === 'Target only' ? 'text-teal-700' : 'text-zinc-800'}`} />
              <span className="flex flex-col gap-1">
                <span className="w-fit rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-zinc-600 ring-1 ring-zinc-200">{u.tag}</span>
                <span className="font-semibold leading-tight text-zinc-900">{u.name}</span>
              </span>
              <p className="flex-grow text-sm leading-relaxed text-zinc-600">{u.text}</p>
              <span className="text-xs font-medium text-teal-700">Experiment {u.exp}</span>
            </motion.div>
          ))}
        </div>
        <div className="mt-5">
          <Source>
            Order-list search, memetic algorithm and their settings are our own implementation (12 lists, 10,000 simulator runs per
            plan, 500 per re-plan). Re-planning triggered by events, compare Günther, Grunow and Lehmann (2005).
          </Source>
        </div>
      </div>
    </section>
  );
}
