'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, MousePointerClick, Award, ArrowRight, ArrowUpRight, Brain, Network, Users, GraduationCap, Database, Wrench } from 'lucide-react';
import { fade, SectionHead, Source } from './common';
import { YangshanLayout, YangshanParameters, YangshanUncertainty } from './YangshanReference';

const MDP = [
  { icon: Eye, title: 'What It Sees', text: 'The situation at the moment an AGV becomes free. For example where each AGV is and what it is doing, the next containers on each crane’s list, and how far each crane has got.' },
  { icon: MousePointerClick, title: 'What It Chooses', text: 'Exactly the same options as every other method. The next job of Crane 1, the next job of Crane 2, or park.' },
  { icon: Award, title: 'What It Is Rewarded For', text: 'Less crane waiting. Each choice is scored by the crane idle time that follows it, so the learner is pushed towards the same goal as the thesis.' },
];

const LEARNERS = [
  { icon: Brain, name: 'DQN', what: 'Learns how good each choice is in each situation, then picks the best one.', why: 'The value-based baseline. Used for AGV dispatching by Zheng et al. (2022).', source: 'Mnih et al. (2015)' },
  { icon: Network, name: 'PPO', what: 'Learns the decision rule directly, as one central dispatcher for all AGVs.', why: 'Stable to train and widely used. The main learned dispatcher of the thesis.', source: 'Schulman et al. (2017)' },
  { icon: Users, name: 'MAPPO', what: 'One learning agent per AGV. They train together but each decides on its own.', why: 'Scales to a large fleet, where one central dispatcher becomes hard.', source: 'Yu et al. (2022)' },
];

const CURRICULUM = ['No randomness, our 2 cranes', 'Add crane and AGV randomness', 'More cranes and AGVs', 'The whole of Yangshan Phase IV'];

export default function PhaseTwoSection() {
  return (
    <>
      <section className="bg-zinc-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <SectionHead id="phase-ii" kicker="Step 5 · MTP Phase II" title="From Today’s Methods to a Learned Dispatcher">
              <p>
                Phase I measured how much today’s methods lose. Phase II builds a dispatcher that learns from experience in the
                simulator, decides in a fraction of a second, and then grows to the size of the real terminal. Everything here is
                planned, and the details are still being designed.
              </p>
            </SectionHead>
          </motion.div>

          {/* ---------------- the learning loop */}
          <motion.div {...fade} className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-5 text-sm">
            <span className="font-semibold text-zinc-900">The learning loop</span>
            {['Simulator', 'situation', 'Learner', 'choice', 'Simulator', 'crane waiting, as the score'].map((s, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className={`rounded-lg px-3 py-1.5 ${i % 2 === 0 ? (s === 'Learner' ? 'bg-amber-400 font-semibold text-zinc-900' : 'bg-zinc-900 font-semibold text-white') : 'text-zinc-600'}`}>{s}</span>
                {i < 5 && <ArrowRight className="h-4 w-4 text-zinc-400" />}
              </span>
            ))}
            <span className="w-full text-xs text-zinc-500">Repeated over many thousands of simulated ships, the learner finds which choices lead to less waiting.</span>
          </motion.div>
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            {MDP.map((m, i) => (
              <motion.div key={m.title} {...fade} transition={{ duration: 0.5, delay: i * 0.06 }}
                className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-zinc-900"><m.icon className="h-5 w-5" /></span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">Design in progress</span>
                </div>
                <span className="font-semibold text-zinc-900">{m.title}</span>
                <p className="text-sm leading-relaxed text-zinc-600">{m.text}</p>
              </motion.div>
            ))}
          </div>
          <motion.div {...fade} className="mb-14 grid gap-4 md:grid-cols-2">
            <div className="flex gap-3 rounded-2xl border border-teal-300 bg-teal-50 p-5">
              <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
              <p className="text-sm leading-relaxed text-zinc-700">
                <b>Already built.</b> A Gymnasium wrapper around our simulator, with the three choices and a check that only allowed
                choices are offered. What it observes and its reward are still placeholders.
              </p>
            </div>
            <div className="flex gap-3 rounded-2xl border border-zinc-200 bg-white p-5">
              <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-zinc-700" />
              <p className="text-sm leading-relaxed text-zinc-700">
                <b>A first baseline.</b> Before learning from scratch, a model that simply copies the choices of the target plan. It
                shows how far plain imitation gets.
              </p>
            </div>
          </motion.div>

          {/* ---------------- learners */}
          <motion.h3 {...fade} className="mb-4 text-xl font-semibold text-zinc-900">The Learners, in Order</motion.h3>
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            {LEARNERS.map((l, i) => (
              <motion.div key={l.name} {...fade} transition={{ duration: 0.5, delay: i * 0.06 }}
                className="relative flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white"><l.icon className="h-5 w-5" /></span>
                  <span className="text-xl font-bold text-zinc-900">{l.name}</span>
                </div>
                <p className="text-sm leading-relaxed text-zinc-700">{l.what}</p>
                <p className="flex-grow text-sm leading-relaxed text-zinc-500">{l.why}</p>
                <Source>{l.source}</Source>
                {i < 2 && (
                  <span className="absolute -right-3.5 top-9 z-10 hidden h-7 w-7 items-center justify-center rounded-full border border-zinc-200 bg-white md:flex">
                    <ArrowRight className="h-4 w-4 text-zinc-400" />
                  </span>
                )}
              </motion.div>
            ))}
          </div>
          <motion.div {...fade} className="mb-14 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5">
            <span className="text-sm font-semibold text-zinc-900">Curriculum Learning, From Easy to Hard</span>
            <ol className="flex flex-wrap items-center gap-2">
              {CURRICULUM.map((c, i) => (
                <li key={c} className="flex items-center gap-2">
                  <span className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-800">
                    <b className="text-teal-700">{i + 1}</b> {c}
                  </span>
                  {i < CURRICULUM.length - 1 && <ArrowRight className="h-4 w-4 text-zinc-400" />}
                </li>
              ))}
            </ol>
            <p className="text-xs text-zinc-500">Like a student, the learner first masters easy cases and only then meets harder ones. Tools: Python, Gymnasium and Stable Baselines3.</p>
          </motion.div>

          {/* ---------------- Yangshan scale-up */}
          <motion.div {...fade} id="yangshan" className="mb-6 flex max-w-3xl scroll-mt-28 flex-col gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900">Scaling Up to the Real Yangshan Phase IV</h3>
            <p className="text-base leading-relaxed text-zinc-700">
              Our simulator covers a slice of the terminal. For the scale-up we have already collected the data for the whole of it,
              from engineering papers, specification sheets and field reports.
            </p>
          </motion.div>
          <motion.div {...fade} className="mb-8 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <Database className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
            <p className="text-sm leading-relaxed text-amber-900">
              Most figures below come from the 2016 design papers of the terminal, for example 26 quay cranes and 130 AGVs. The
              terminal has grown since. In 2025 it ran 29 quay cranes and 155 AGVs (Shanghai news release, 14 Aug 2026). The scale-up
              will use the latest figures where they exist.
            </p>
          </motion.div>
          <motion.div {...fade}><YangshanLayout /></motion.div>
          <motion.details {...fade} className="mt-10 rounded-2xl border border-zinc-200 bg-white p-5 [&_summary]:cursor-pointer">
            <summary className="text-lg font-semibold text-zinc-900">The Full Parameter Table, With Sources</summary>
            <p className="mb-4 mt-2 text-sm text-zinc-600">Port layout, quay cranes, AGVs and yard cranes of Yangshan Phase IV.</p>
            <YangshanParameters />
          </motion.details>
          <motion.div {...fade} className="mt-10 mb-5 flex max-w-3xl flex-col gap-2">
            <h3 className="text-xl font-semibold text-zinc-900">More Uncertainty at Full Scale</h3>
            <p className="text-sm leading-relaxed text-zinc-700">
              With the whole terminal come sources of randomness that our slice leaves out. These are the candidates, each from a
              published source.
            </p>
          </motion.div>
          <motion.div {...fade}><YangshanUncertainty /></motion.div>
        </div>
      </section>

      {/* ---------------- closing */}
      <section className="bg-zinc-900 px-4 py-20 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <motion.div {...fade} className="flex max-w-3xl flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-400">Where to Go Next</span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">See What the Methods Actually Did</h2>
            <p className="text-lg leading-relaxed text-zinc-300">
              The steps above describe how we test. The Experiments tab shows every run in detail, and the Results tab brings the
              findings together.
            </p>
          </motion.div>
          <motion.div {...fade} className="flex flex-wrap gap-3">
            <Link href="/experiments" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-200">
              See the Experiments <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/results" className="inline-flex items-center gap-2 rounded-full border border-zinc-600 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800">
              The Results <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </Link>
            <Link href="/simulation" className="inline-flex items-center gap-2 rounded-full border border-zinc-600 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800">
              The Simulated Terminal <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </Link>
          </motion.div>
          <p className="text-xs text-zinc-500">Last updated 21 Oct 2026.</p>
        </div>
      </section>
    </>
  );
}
