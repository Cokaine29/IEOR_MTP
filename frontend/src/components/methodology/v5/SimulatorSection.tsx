'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, Gauge, CornerDownRight, Timer, Ruler, Package, Construction, TrafficCone } from 'lucide-react';
import { fade, SectionHead, Source } from './common';

const EVENTS = ['AGV becomes free', 'Dispatcher decides', 'AGV drives', 'Crane is ready', 'Handover', 'AGV drives to the yard', 'Rack visit'];

const SPECS = [
  { icon: Gauge, value: '6 / 3.5 m/s', label: 'Top speed, empty and loaded', source: 'Luo (2016); Zhao et al. (2025), Table 1' },
  { icon: CornerDownRight, value: '3 m/s, 10 m', label: 'Speed and radius in turns', source: 'Luo (2016); Luo (2016b), Table 2' },
  { icon: Timer, value: '0.5 m/s²', label: 'Speeding up and braking', source: 'Our assumption, no published value found' },
  { icon: Ruler, value: '14.8 × 3.0 m', label: 'AGV body, both axles follow the path', source: 'Luo (2016), Table 3; Konecranes LIFT AGV' },
  { icon: Construction, value: '75 s', label: 'Quay crane time per container', source: 'Zhao et al. (2025); Liu, Jula and Ioannou (2001)' },
  { icon: Package, value: '51 s', label: 'AGV sets down or picks up at a yard rack', source: 'Our assumption, driving in and out plus lifting' },
  { icon: TrafficCone, value: '4 m zones', label: 'Road booked ahead, body plus braking distance', source: 'Kim, Jeon and Ryu (2006); Li et al. (2016)' },
];

const CHECKS = [
  { stat: '190 events', text: 'In 5 small cases, every event time of the simulator matches an independent answer key, a separate script that uses none of the simulator code, to within 0.0000005 s.' },
  { stat: '308 segments', text: 'Every piece of every AGV path, straight or turning, matches the answer key to within a millionth of a metre.' },
  { stat: '7 of 7', text: 'Yard rack checks pass, for example which rack an AGV uses and how long a visit takes.' },
  { stat: '0 collisions', text: 'In 216 random runs with traffic, 2 to 16 AGVs and both kinds of randomness, no two AGVs ever touch or lock each other in.' },
  { stat: '780 tests', text: 'Automatic tests run after every change to the code. All pass on model v5.' },
];

export default function SimulatorSection() {
  return (
    <section className="border-b border-zinc-200 bg-white px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fade}>
          <SectionHead id="simulator" kicker="Step 1 · The Simulator" title="A Digital Copy of the Terminal">
            <p>
              Our simulator is a Python program that plays out the service of one ship. It does not tick second by second. It jumps
              from one event to the next, so a whole ship of 200 containers runs in about a tenth of a second. That speed is what lets
              a search test thousands of plans.
            </p>
          </SectionHead>
        </motion.div>

        <motion.div {...fade} className="mb-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <span className="mb-3 block text-sm font-semibold text-zinc-900">The events in one AGV trip</span>
          <ol className="flex flex-wrap items-center gap-1.5">
            {EVENTS.map((e, i) => (
              <li key={e} className="flex items-center gap-1.5">
                <span className={`rounded-lg px-3 py-1.5 text-sm font-medium ${i === 1 ? 'bg-teal-600 text-white' : 'border border-zinc-200 bg-white text-zinc-800'}`}>{e}</span>
                {i < EVENTS.length - 1 && <ArrowRight className="h-4 w-4 text-zinc-400" />}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-zinc-600">
            For a container being loaded, the AGV visits the yard rack first and the crane last. The dispatcher, in teal, is the only
            part that changes from one method to the next. Everything else is identical for every method.
          </p>
        </motion.div>

        <motion.div {...fade} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SPECS.map((s) => (
            <div key={s.label} className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-4">
              <s.icon className="h-5 w-5 text-teal-700" />
              <span className="text-xl font-bold tracking-tight tabular-nums text-zinc-900">{s.value}</span>
              <span className="text-sm text-zinc-700">{s.label}</span>
              <span className="mt-auto text-xs italic text-zinc-500">{s.source}</span>
            </div>
          ))}
          <Link href="/simulation" className="flex flex-col justify-center gap-2 rounded-2xl border border-dashed border-teal-300 bg-teal-50 p-4 text-teal-900 hover:bg-teal-100">
            <span className="font-semibold">Every value, with its source</span>
            <span className="inline-flex items-center gap-1 text-sm">On the Simulation tab <ArrowUpRight className="h-4 w-4" /></span>
          </Link>
        </motion.div>

        <motion.div {...fade} id="simulator-check" className="mt-12 scroll-mt-28 rounded-2xl border border-teal-300 bg-teal-50 p-6">
          <div className="mb-5 flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Step 2 · Check It</span>
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900">Does the Simulator Do What We Think It Does?</h3>
            <p className="max-w-3xl text-sm leading-relaxed text-zinc-700">
              Before trusting any result, we worked out small cases on paper, event by event, and asked the simulator to reproduce
              them. This is Experiment 1.1.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CHECKS.map((c) => (
              <div key={c.stat} className="flex flex-col gap-2 rounded-xl border border-teal-200 bg-white p-4">
                <span className="flex items-center gap-2 text-lg font-bold text-teal-900"><Check className="h-5 w-5 shrink-0" /> {c.stat}</span>
                <p className="text-sm leading-relaxed text-zinc-600">{c.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Source>Experiment 1.1 on model v5, 20 Oct 2026, results in the project repository.</Source>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
