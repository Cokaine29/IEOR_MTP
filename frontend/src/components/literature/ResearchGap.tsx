'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, FlaskConical, Rocket, ArrowRight, ArrowUpRight } from 'lucide-react';

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5 },
};

type Bar = { label: string; value: number; tone: 'dark' | 'light' };
type Gap = {
  title: string;
  lit: { stat: string; text: string; source: string };
  ours: { stat: string; text: string; bars?: Bar[]; unit?: string; links: { href: string; label: string }[] } | null;
  next: { text: string; href: string; label: string };
};

/* Literature facts come from the comparison visuals above (our verified notes) and from the papers named in each source line.
   Phase I facts come from the v5 results in the ACT_MTP repository (results_reference/v5). */
const GAPS: Gap[] = [
  {
    title: 'Plans Made in Advance Go Stale, and No Learned Dispatcher Has Been Tested Against It',
    lit: {
      stat: '0 of 11',
      text: 'None of the 11 studies reviewed tests a learned dispatcher at several levels of randomness. Only two test at several levels at all, and neither of them learns. A 2024 review found just 1 of 20 studies under uncertainty that learns with reinforcement learning.',
      source: 'Kim and Bae (2004), Grunow et al. (2006), Li, Cai, He and Guo (2024), Applied Soft Computing 162, 111820',
    },
    ours: {
      stat: '2.26 s to none',
      text: 'A plan made once beats the NV/FCFS rule by 2.26 s per container when nothing varies. With crane times varying by ±40%, the lead is gone, and the plan is ahead on only 16 of 30 ships.',
      bars: [
        { label: 'No randomness', value: 2.26, tone: 'dark' },
        { label: '±40% crane times', value: -0.02, tone: 'light' },
      ],
      unit: 'Lead of the plan over NV/FCFS, seconds per container',
      links: [{ href: '/experiments#E41', label: 'Experiment 4.1' }, { href: '/experiments#E44', label: 'Experiment 4.4' }],
    },
    next: { text: 'Train DQN and PPO on the same ships and test them at the same levels of randomness.', href: '/methodology#phase-ii', label: 'Phase II plan' },
  },
  {
    title: 'A Good Plan Needs Search Time That Real-Time Dispatching Does Not Have',
    lit: {
      stat: '13 s to 70 min',
      text: 'The search methods reviewed build their plan before work starts, as if all times were known. Zhao et al. report 12.91 to 41.04 s per run, Song et al. about 4190 s.',
      source: 'Zhao, Li and Yang (2025), Tables 3 and 5, Song et al. (2024), Sec. 4.1',
    },
    ours: {
      stat: '43 to 57 s',
      text: 'Re-planning with the genetic algorithm takes 43 to 57 s each time. Once that thinking time is counted, it is no better than the best rule chosen for each ship. It still beats NV/FCFS by 0.65 s.',
      bars: [
        { label: 'Thinking time ignored', value: 1.09, tone: 'dark' },
        { label: 'Thinking time counted', value: 0.65, tone: 'light' },
      ],
      unit: 'Lead of re-planning over NV/FCFS at ±40% crane times, seconds per container',
      links: [{ href: '/experiments#E42', label: 'Experiment 4.2' }, { href: '/experiments#E43', label: 'Experiment 4.3' }],
    },
    next: { text: 'A learned dispatcher does its slow work in training, so each decision is meant to take only a moment.', href: '/methodology#phase-ii', label: 'Phase II plan' },
  },
  {
    title: 'No Common Test Bench for Rules, Search and Learning',
    lit: {
      stat: '0 of 11',
      text: 'No study reviewed compares rules, a search method, tabular Q-learning and DQN on the same ships. Only 2 of the 11 report repeated runs with intervals or tests.',
      source: 'Comparison visuals above, from our notes on each paper',
    },
    ours: {
      stat: '30 paired ships',
      text: 'Every method in Phase I meets the same 30 ships with the same random draws, and every difference is reported with a 95% interval.',
      links: [{ href: '/methodology#fairness', label: 'How we compare' }],
    },
    next: { text: 'Add DQN, PPO and MAPPO to this same bench, so every method meets the same ships.', href: '/methodology#fairness', label: 'Our comparison rules' },
  },
  {
    title: 'No Study Lets Each AGV Learn for Itself',
    lit: {
      stat: '0 of 11',
      text: 'None of the dispatching studies reviewed uses several learning agents. Gao et al. use negotiating agents, but they follow fixed rules.',
      source: 'Comparison visuals above, from our notes on each paper',
    },
    ours: null,
    next: { text: 'Extend PPO to MAPPO, with one learning agent per AGV, once the single dispatcher works.', href: '/methodology#phase-ii', label: 'Phase II plan' },
  },
];

function MiniBars({ bars, unit }: { bars: Bar[]; unit: string }) {
  const max = Math.max(...bars.map((b) => Math.abs(b.value)));
  return (
    <div className="mt-3 flex flex-col gap-2">
      {bars.map((b) => (
        <div key={b.label} className="grid grid-cols-[150px_1fr_44px] items-center gap-2 text-xs">
          <span className="text-zinc-600">{b.label}</span>
          <div className="h-3 rounded-full bg-zinc-100">
            <div className={`h-3 rounded-full ${b.tone === 'dark' ? 'bg-teal-600' : 'bg-teal-200'}`}
              style={{ width: `${Math.max(2, (Math.max(0, b.value) / max) * 100)}%` }} />
          </div>
          <span className="text-right font-semibold tabular-nums text-zinc-900">{b.value.toFixed(2).replace('-', '−')}</span>
        </div>
      ))}
      <span className="text-[11px] text-zinc-500">{unit}</span>
    </div>
  );
}

export default function ResearchGap() {
  return (
    <section id="gap" className="mt-8 scroll-mt-28">
      <motion.div {...fade} className="mb-10 max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">The Research Gap</span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Where the Literature Stops, and Where We Start</h2>
        <p className="mt-3 leading-relaxed text-zinc-700">
          Four gaps, each built the same way. What the papers show, what our own Phase I experiments found, and how the thesis
          closes the gap.
        </p>
      </motion.div>

      <div className="flex flex-col gap-6">
        {GAPS.map((g, i) => (
          <motion.article key={g.title} {...fade} className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-sm font-bold text-white">G{i + 1}</span>
              <h3 className="text-xl font-bold leading-snug tracking-tight text-zinc-900 sm:text-2xl">{g.title}</h3>
            </div>
            <div className="grid gap-3 lg:grid-cols-[1fr_auto_1.2fr_auto_1fr]">
              {/* literature */}
              <div className="flex flex-col gap-2 rounded-2xl bg-zinc-50 p-5">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-600"><BookOpen className="h-4 w-4" /> The Literature</span>
                <span className="text-3xl font-bold tracking-tight text-zinc-900">{g.lit.stat}</span>
                <p className="text-sm leading-relaxed text-zinc-700">{g.lit.text}</p>
                <span className="mt-auto pt-2 text-[11px] italic leading-snug text-zinc-500">{g.lit.source}</span>
              </div>
              <ArrowRight className="hidden h-5 w-5 self-center text-zinc-300 lg:block" />
              {/* ours */}
              <div className="flex flex-col gap-2 rounded-2xl border border-teal-200 bg-teal-50/60 p-5">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-800"><FlaskConical className="h-4 w-4" /> Our Phase I</span>
                {g.ours ? (
                  <>
                    <span className="text-3xl font-bold tracking-tight text-teal-900">{g.ours.stat}</span>
                    <p className="text-sm leading-relaxed text-zinc-700">{g.ours.text}</p>
                    {g.ours.bars && g.ours.unit && <MiniBars bars={g.ours.bars} unit={g.ours.unit} />}
                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                      {g.ours.links.map((l) => (
                        <Link key={l.href} href={l.href} className="inline-flex items-center gap-1 rounded-full border border-teal-300 bg-white px-3 py-1 text-xs font-semibold text-teal-800 hover:bg-teal-50">
                          {l.label} <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm leading-relaxed text-zinc-600">Not tested in Phase I. Our Phase I dispatcher is one central decision maker for all 12 AGVs.</p>
                )}
              </div>
              <ArrowRight className="hidden h-5 w-5 self-center text-zinc-300 lg:block" />
              {/* next */}
              <div className="flex flex-col gap-2 rounded-2xl bg-zinc-900 p-5 text-white">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-300"><Rocket className="h-4 w-4" /> How We Close It</span>
                <p className="text-sm leading-relaxed text-zinc-200">{g.next.text}</p>
                <Link href={g.next.href} className="mt-auto inline-flex w-fit items-center gap-1 rounded-full border border-zinc-600 px-3 py-1 text-xs font-semibold text-white hover:bg-zinc-800">
                  {g.next.label} <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div {...fade} className="mt-6 rounded-2xl border border-dashed border-zinc-300 bg-white p-5 text-sm leading-relaxed text-zinc-600">
        <b className="text-zinc-900">Also open, but outside this thesis.</b> No study reviewed makes AGV breakdowns or battery random. Our
        model leaves them out too, and they are candidates for later work.
      </motion.div>

      <motion.div {...fade} className="mt-10 rounded-3xl bg-zinc-900 p-8 text-center md:p-12">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-400">Our Thesis in One Line</span>
        <p className="mx-auto mt-4 max-w-3xl text-xl font-semibold leading-relaxed text-white md:text-2xl">
          A dispatcher that learns, decides in real time, and is tested against today&rsquo;s methods on the same ships as the
          randomness grows.
        </p>
      </motion.div>
    </section>
  );
}
