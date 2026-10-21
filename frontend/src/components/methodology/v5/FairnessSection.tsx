'use client';

import { motion } from 'framer-motion';
import { Ship, GitCompare, Trophy, FolderGit2 } from 'lucide-react';
import { fade, SectionHead, Source } from './common';
import Md from '@/components/experiments/Md';

/* Experiment 4.5, level 1: re-planned minus NV/FCFS, crane wait per container (s), one value per test ship */
const DIFFS = [-1.63, -0.28, -1.62, -0.71, -0.6, -0.35, -0.25, -5.12, -0.58, 0.45, 0.42, -1.23, -6.6, -4.47, -0.68, -0.42, 1.49, -1.56, -0.63, -0.88, -2.34, -1.4, -0.75, -0.42, -2.54, -0.99, 0.31, -1.76, -0.04, 0.76];
const DMAX = 7;
const REPO = 'https://github.com/Cokaine29/ACT_MTP';

const RULES = [
  { icon: Ship, title: '30 Test Ships', text: 'Each test ship is the same 200-container ship with its own random crane times and AGV speeds. Every method runs all 30.' },
  { icon: GitCompare, title: 'Compared Ship by Ship', text: 'For each ship we take the difference between two methods. The average of the 30 differences is the result.' },
  { icon: Trophy, title: 'Wins Counted', text: 'We also count on how many of the 30 ships one method waited less. That is easy to read and hard to misread.' },
  { icon: FolderGit2, title: 'Anyone Can Re-run It', text: 'Fixed random seeds, code and every result file are public. Selected runs were re-computed on a second machine and matched exactly.' },
];

export default function FairnessSection() {
  return (
    <section className="border-y border-zinc-200 bg-white px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fade}>
          <SectionHead id="fairness" kicker="Step 4 · Comparing Fairly" title="How We Decide That One Method Is Really Better">
            <p>
              Random times make every run a little different. So one run proves nothing. We judge methods over many ships, in a way
              that removes luck as far as possible.
            </p>
          </SectionHead>
        </motion.div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RULES.map((r, i) => (
            <motion.div key={r.title} {...fade} transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <r.icon className="h-6 w-6 text-teal-700" />
              <span className="font-semibold text-zinc-900">{r.title}</span>
              <p className="text-sm leading-relaxed text-zinc-600">{r.text}</p>
              {r.title === 'Anyone Can Re-run It' && (
                <a href={REPO} target="_blank" rel="noreferrer" className="mt-auto text-sm font-semibold text-teal-700 underline underline-offset-2">Code and results on GitHub</a>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div {...fade} className="grid gap-5 rounded-2xl border border-teal-300 bg-teal-50 p-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <figure className="flex flex-col gap-3">
            <figcaption className="text-sm font-semibold text-teal-900">A Real Example, One Bar per Test Ship</figcaption>
            <p className="text-xs text-zinc-600">Re-planning minus the NV/FCFS rule, crane wait per container in seconds, with both kinds of randomness. Below the line, re-planning waited less.</p>
            <div className="relative flex h-40 items-center gap-[3px] rounded-xl bg-white px-2" aria-label="Difference per test ship">
              <span className="absolute inset-x-2 top-1/2 border-t border-zinc-400" />
              {DIFFS.map((d, k) => (
                <span key={k} className="relative flex h-full flex-1 flex-col justify-center">
                  <span className={`absolute left-0 right-0 rounded-sm ${d < 0 ? 'bg-teal-600' : 'bg-red-500'}`}
                    style={d < 0 ? { top: '50%', height: `${(-d / DMAX) * 50}%` } : { bottom: '50%', height: `${(d / DMAX) * 50}%` }} />
                </span>
              ))}
            </div>
            <Source>Experiment 4.5, crane times ±20% and AGV speeds ±10%, 21 Oct 2026.</Source>
          </figure>
          <div className="flex flex-col justify-center gap-3">
            <div className="rounded-xl bg-white p-4">
              <span className="text-xs font-medium text-zinc-500">Ships where re-planning waited less</span>
              <div className="text-3xl font-bold tabular-nums text-teal-800">25 of 30</div>
            </div>
            <div className="rounded-xl bg-white p-4">
              <span className="text-xs font-medium text-zinc-500">Average difference, with its 95% range</span>
              <div className="text-3xl font-bold tabular-nums text-teal-800">−1.15 ± 0.64 s</div>
            </div>
            <Md className="text-sm leading-relaxed text-zinc-700">{String.raw`The range is the mean $\pm\, t \cdot s/\sqrt{30}$, where $s$ is the spread of the 30 differences and $t = 2.045$ for 30 ships. If the whole range stays on one side of zero, as here, we call the difference clear.`}</Md>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
