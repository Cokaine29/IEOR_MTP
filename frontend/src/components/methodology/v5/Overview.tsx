'use client';

import { motion } from 'framer-motion';
import { Hammer, ShieldCheck, SlidersHorizontal, FlaskConical, BrainCircuit, ArrowRight } from 'lucide-react';
import { Badge } from './common';

const STEPS = [
  { icon: Hammer, title: 'Build the Simulator', text: 'A digital copy of a slice of Yangshan Phase IV, with real AGV motion and traffic.', exp: 'Model v5', status: 'Done' as const, href: '#simulator' },
  { icon: ShieldCheck, title: 'Check It', text: 'Compare the simulator against answers worked out by hand.', exp: 'Experiment 1.1', status: 'Done' as const, href: '#simulator-check' },
  { icon: SlidersHorizontal, title: 'Choose the Setting', text: 'How many AGVs, how far ahead the dispatcher can see, and how big a ship.', exp: 'Experiments 2.1 to 2.3', status: 'Done' as const, href: '#setting' },
  { icon: FlaskConical, title: 'Test Today’s Methods', text: 'Rules and optimised plans, with crane times and AGV speeds made random.', exp: 'Experiments 3.1 to 4.5', status: 'Done' as const, href: '#methods' },
  { icon: BrainCircuit, title: 'Train a Learned Dispatcher', text: 'Deep reinforcement learning, then scale up to the whole terminal.', exp: 'MTP Phase II', status: 'Phase II' as const, href: '#phase-ii' },
];

export default function Overview() {
  return (
    <section className="bg-zinc-900 px-4 pb-16 pt-28 text-white sm:pt-32">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex max-w-3xl flex-col gap-5">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 text-xs font-semibold text-zinc-200">
            <span className="h-2 w-2 rounded-full bg-teal-400" /> Methodology
          </span>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">How We Answer the Two Questions</h1>
          <p className="text-lg leading-relaxed text-zinc-300">
            We cannot test new dispatchers on a real terminal. So we build a faithful simulator, check that it is right, and then
            let every method run the same ships, with the same random delays. Five steps take us from the simulator to a learned
            dispatcher.
          </p>
        </motion.div>
        <motion.ol initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative">
              <a href={s.href} className={`flex h-full flex-col gap-3 rounded-2xl border p-5 transition-colors ${s.status === 'Done' ? 'border-zinc-700 bg-zinc-800/60 hover:border-teal-500' : 'border-amber-400/40 bg-amber-400/5 hover:border-amber-400'}`}>
                <div className="flex items-center justify-between">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.status === 'Done' ? 'bg-teal-400 text-zinc-900' : 'bg-amber-400 text-zinc-900'}`}><s.icon className="h-5 w-5" /></span>
                  <Badge status={s.status} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Step {i + 1}</span>
                <span className="text-lg font-semibold leading-tight">{s.title}</span>
                <span className="text-sm leading-relaxed text-zinc-300">{s.text}</span>
                <span className="mt-auto text-xs font-medium text-teal-300">{s.exp}</span>
              </a>
              {i < STEPS.length - 1 && (
                <span className="absolute -right-3 top-9 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 lg:flex">
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
                </span>
              )}
            </li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
