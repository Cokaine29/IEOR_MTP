'use client';

import { motion } from 'framer-motion';
import { Construction, Truck, Layers, Eye, EyeOff, Dice5 } from 'lucide-react';
import { fade, SectionHead, Source } from './common';
import Md from '@/components/experiments/Md';

const KINDS = [
  {
    icon: Construction, title: 'Random Crane Times',
    formula: String.raw`$$t_j \sim \text{Uniform}\bigl(75\,(1-\delta),\; 75\,(1+\delta)\bigr)\ \text{s}$$`,
    text: 'Each container gets its own crane time, drawn once. δ sets how wide the spread is.',
    levels: ['δ = 0', '0.1', '0.2', '0.3', '0.4'],
    source: 'Uniform noise around the planned time, swept in levels as in Kim and Bae (2004).',
  },
  {
    icon: Truck, title: 'Random AGV Speeds',
    formula: String.raw`$$f \sim \text{Uniform}(1-\varepsilon,\; 1+\varepsilon)$$`,
    text: 'Each AGV trip gets one factor that scales all its speeds. Traffic is always on, so trips also slow each other down.',
    levels: ['ε = 0', '0.05', '0.1', '0.2'],
    source: 'Li et al. (2018), Table 4, ±5% and ±10% from an actual automated terminal. 0.2 is our stress level.',
  },
  {
    icon: Layers, title: 'Both Together',
    formula: String.raw`$$\delta = 0.2 \ \text{and}\ \varepsilon = 0.1$$`,
    text: 'One realistic mix of both kinds, against no randomness at all.',
    levels: ['none', 'both'],
    source: 'Our choice of one combined level, to keep server time reasonable.',
  },
];

const EXPS = [
  { n: '4.1', what: 'Crane times random', methods: 'Rules, plan in advance, fixed timetable, target' },
  { n: '4.4', what: 'AGV speeds random', methods: 'Rules, plan in advance, fixed timetable, target' },
  { n: '4.5', what: 'Both random', methods: 'All of the above, plus re-planning' },
  { n: '4.2', what: 'Crane times random', methods: 'Re-planning during service' },
  { n: '4.3', what: 'Crane times random', methods: 'Re-planning with thinking time' },
];

export default function RandomnessSection() {
  return (
    <section className="bg-zinc-50 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fade}>
          <SectionHead id="randomness" kicker="Step 4 · Adding Randomness" title="Making the Terminal Unpredictable, Step by Step">
            <p>
              A real terminal never runs exactly to plan. We add randomness in two places, the crane and the AGV, and turn it up
              in levels. That way we see how each method degrades as the terminal gets less predictable.
            </p>
          </SectionHead>
        </motion.div>

        <div className="mb-8 grid gap-4 lg:grid-cols-3">
          {KINDS.map((k, i) => (
            <motion.div key={k.title} {...fade} transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white"><k.icon className="h-5 w-5" /></span>
                <span className="font-semibold text-zinc-900">{k.title}</span>
              </div>
              <Md className="rounded-xl bg-zinc-50 px-2 py-1 text-zinc-800">{k.formula}</Md>
              <p className="text-sm leading-relaxed text-zinc-600">{k.text}</p>
              <div className="flex flex-wrap gap-1.5">
                {k.levels.map((l, j) => (
                  <span key={l} className={`rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums ${j === 0 ? 'bg-zinc-200 text-zinc-700' : 'bg-teal-100 text-teal-800'}`}>{l}</span>
                ))}
              </div>
              <div className="mt-auto"><Source>{k.source}</Source></div>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <motion.div {...fade} className="flex flex-col gap-4 rounded-2xl border border-teal-300 bg-teal-50 p-5">
            <span className="text-sm font-semibold text-teal-900">Who Knows What</span>
            <div className="flex gap-3">
              <EyeOff className="mt-0.5 h-5 w-5 shrink-0 text-zinc-600" />
              <p className="text-sm leading-relaxed text-zinc-700"><b>Rules and plans</b> only know the planned times, 75 s per container and the normal speeds.</p>
            </div>
            <div className="flex gap-3">
              <Dice5 className="mt-0.5 h-5 w-5 shrink-0 text-zinc-600" />
              <p className="text-sm leading-relaxed text-zinc-700"><b>Re-planning</b> learns the real times as they happen, for containers already handed over and trips already started.</p>
            </div>
            <div className="flex gap-3">
              <Eye className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
              <p className="text-sm leading-relaxed text-zinc-700"><b>Only the target</b> knows every real time in advance.</p>
            </div>
            <p className="rounded-xl bg-white px-4 py-3 text-sm leading-relaxed text-zinc-700">
              Every method faces exactly the same random draws on each test ship. So when two methods differ, it is because of how
              they decide, not because one was luckier.
            </p>
          </motion.div>
          <motion.div {...fade} className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5">
            <span className="text-sm font-semibold text-zinc-900">Which Experiment Tests What</span>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-zinc-500">
                  <th className="pb-2 font-medium">Experiment</th>
                  <th className="pb-2 font-medium">Randomness</th>
                  <th className="pb-2 font-medium">Methods</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {EXPS.map((e) => (
                  <tr key={e.n} className="align-top">
                    <td className="py-2 pr-3 font-semibold text-teal-700">{e.n}</td>
                    <td className="py-2 pr-3 text-zinc-700">{e.what}</td>
                    <td className="py-2 text-zinc-600">{e.methods}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-zinc-500">All on model v5 with 12 AGVs and the 200-container ship, run between 20 and 21 Oct 2026.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
