'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, Globe2, Gauge, Truck, FileSearch, Repeat, Shuffle, Timer } from 'lucide-react';
import HeroReplay from '@/components/home/HeroReplay';
import CraneWait from '@/components/home/CraneWait';
import Md from '@/components/experiments/Md';

/* Real photographs: put the file in frontend/public/home/ and fill in src and credit.
   A photo is shown only once its src is set. Use photos you may reuse (press kit, Wikimedia Commons). */
const PHOTOS: Record<'terminal' | 'quay', { src: string | null; alt: string; credit: string }> = {
  terminal: { src: null, alt: 'An automated container terminal with AGVs under the quay cranes', credit: '' },
  quay: { src: null, alt: 'An AGV waiting under a quay crane', credit: '' },
};

const REPO = 'https://github.com/Cokaine29/ACT_MTP';
const UPDATED = '20 Oct 2026';

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
};

const STAKES = [
  {
    icon: Globe2, stat: '849 million TEU',
    title: 'Containers Handled at the World’s Ports',
    desc: 'The total for 2021, counted in TEU (one TEU is one standard 20-foot container). Every one of them passes under a quay crane.',
    source: 'Notteboom, Pallis and Rodrigue (2022), Port Economics, Management and Policy, data of Drewry and UNCTAD',
  },
  {
    icon: Gauge, stat: '7% to 15% Lower',
    title: 'Crane Productivity After Automation',
    desc: 'A crane move is one container lifted on or off the ship. At fully automated terminals a quay crane averages moves in the low 20s per hour. At many conventional terminals it is in the high 30s. Operators surveyed said automation lowered their productivity by 7% to 15%.',
    source: 'Chu, Gailus, Liu and Ni (2018), The Future of Automated Ports, McKinsey & Company',
  },
  {
    icon: Truck, stat: '155 AGVs',
    title: 'One System Dispatches Them All',
    desc: 'At Yangshan Phase IV in Shanghai, one central system dispatches 155 AGVs serving 29 quay cranes. The terminal handled more than 8 million TEU in 2025, and its fastest crane handles over 60 containers an hour. Each of those containers needed an AGV chosen for it.',
    source: 'Shanghai Municipal People’s Government, Yangshan Port Phase IV Boasts World-Class Efficiency, news release, 14 Aug 2026',
    href: 'https://english.shanghai.gov.cn/en-Latest-WhatsNew/20260814/f4427a05be154fc4957a5f62d67d6f2e.html',
  },
  {
    icon: FileSearch, stat: '1 of 20 Studies',
    title: 'Learns Its Decisions Under Uncertainty',
    desc: 'A 2024 review of research from 2000 to 2024 found only 20 studies that schedule quay cranes together with their vehicles under uncertainty. Just one of them learns its decisions with reinforcement learning. The authors add that most published methods are hard to use in real ports because they leave out this uncertainty.',
    source: 'Li, Cai, He and Guo (2024), Applied Soft Computing 162, 111820, Tables 4 and 6, Sec. 6.3',
  },
];

const CHAIN = [
  { title: 'Crane Is Ready', text: 'The crane has the container over the AGV lane, or is ready to take one.' },
  { title: 'No AGV Underneath', text: 'The AGV that should be there is still driving, or was sent somewhere else.' },
  { title: 'Crane Stands Idle', text: 'Every second until the AGV arrives is lost crane time, and the ship waits with it.' },
];

const HARD = [
  { icon: Repeat, title: 'Hundreds of Linked Decisions', text: 'Each container that comes off or goes onto a ship needs its own AGV trip. So a single ship brings hundreds of these decisions, one after the other. And no decision stands alone. Where an AGV is sent now decides where it will be later, and which AGVs are still free when the next containers come up.' },
  { icon: Shuffle, title: 'Random Times', text: 'Real crane handling times and AGV travel times vary, so a plan made on the planned times goes stale.' },
  { icon: Timer, title: 'No Time to Re-plan', text: 'Searching for a new plan takes time the terminal does not have, so the decision must be made in real time.' },
];

const SYMBOLS = [
  { sym: String.raw`$\bar I$`, name: 'Crane Idle Time per Container', unit: 'seconds', text: 'The average wait of the crane over all containers of the ship. Lower is better.' },
  { sym: String.raw`$N$`, name: 'Containers of the Ship', unit: '', text: 'All containers the cranes unload from and load onto the ship.' },
  { sym: String.raw`$r_j$`, name: 'Crane Ready', unit: 'seconds', text: 'The time at which the crane is ready to hand over container $j$ to an AGV. Only the crane sets it.' },
  { sym: String.raw`$h_j$`, name: 'Handover', unit: 'seconds', text: 'The time the handover of container $j$ really happens, once an AGV is under the crane.' },
];

const STEPS: { title: string; status: 'Done' | 'In Progress' | 'Next'; points: string[] }[] = [
  { title: 'Build a Realistic Terminal', status: 'Done', points: [
    'Layout of a real automated terminal, Yangshan Phase IV',
    'AGVs accelerate, turn and keep safe braking gaps',
    'Every value taken from a published source',
  ] },
  { title: 'Test Today’s Methods', status: 'In Progress', points: [
    'Dispatching rules and plans optimised in advance',
    'Random crane times and random AGV speeds',
    'Compared with a dispatcher that knows the future',
  ] },
  { title: 'Train a Learned Dispatcher', status: 'Next', points: [
    'Deep reinforcement learning, deciding in real time',
    'PPO with one central dispatcher',
    'MAPPO with one cooperating agent per AGV',
  ] },
];

function Photo({ p }: { p: (typeof PHOTOS)['terminal'] }) {
  if (!p.src) return null;
  return (
    <figure className="flex flex-col gap-1.5">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-zinc-200">
        <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
      {p.credit && <figcaption className="text-xs text-zinc-500">Photo: {p.credit}</figcaption>}
    </figure>
  );
}

function SectionHead({ kicker, title, children }: { kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-10 flex max-w-3xl flex-col gap-3">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">{kicker}</span>
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900">{title}</h2>
      {children && <div className="text-base leading-relaxed text-zinc-700">{children}</div>}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* ------------------------------------------------ hero */}
      <section className="bg-zinc-900 px-4 pb-16 pt-28 text-white sm:pt-32">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 text-xs font-semibold text-zinc-200">
              <span className="h-2 w-2 rounded-full bg-teal-400" />
              M.Tech Thesis · IEOR · IIT Bombay · 2025–27
            </span>
            <h1 className="max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Real-Time AGV Dispatching in an Automated Container Terminal
              <span className="mt-2 block text-zinc-400">under Stochastic Conditions</span>
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-zinc-300">
              Every time an AGV becomes free, a dispatcher decides which quay crane and which container it serves next. This thesis
              builds a learned dispatcher (deep reinforcement learning, PPO and then MAPPO) that makes this decision in real time,
              to cut <b className="text-white">Quay Crane Idle Time</b> when crane handling times and AGV travel times are random.
            </p>
            <p className="text-sm font-medium uppercase tracking-wider text-zinc-400">
              Niraj Kamble <span className="mx-2 text-zinc-600">|</span> Guided by Prof. Jayendran Venkateswaran
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/experiments" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-200">
                See the Experiments <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/problem" className="inline-flex items-center gap-2 rounded-full border border-zinc-600 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800">
                The Problem in Detail <ArrowUpRight className="h-4 w-4 text-zinc-400" />
              </Link>
              <a href={REPO} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-zinc-600 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800">
                Code and Results on GitHub <ArrowUpRight className="h-4 w-4 text-zinc-400" />
              </a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <HeroReplay dark />
          </motion.div>
          <Photo p={PHOTOS.terminal} />
        </div>
      </section>

      {/* ------------------------------------------------ the problem */}
      <section className="bg-zinc-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <SectionHead kicker="The Problem" title="A Crane Cannot Let Go Until an AGV Is Under It">
              <p>
                AGVs cannot lift a container by themselves <i>(Carlo et al., 2014)</i>. The quay crane must set each container straight
                onto an AGV, or lift it straight off one. Every second the crane waits for an AGV is <b>Crane Idle Time</b>, and idle
                cranes keep the ship longer at the berth.
              </p>
            </SectionHead>
          </motion.div>
          <motion.ol {...fade} className="mb-10 grid gap-3 sm:grid-cols-3">
            {CHAIN.map((c, i) => (
              <li key={c.title} className={`relative flex items-start gap-3 rounded-2xl border p-4 ${i === 2 ? 'border-red-200 bg-red-50' : 'border-zinc-200 bg-white'}`}>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${i === 2 ? 'bg-red-600 text-white' : 'bg-zinc-900 text-white'}`}>{i + 1}</span>
                <span className="flex flex-col gap-0.5">
                  <span className={`font-semibold ${i === 2 ? 'text-red-700' : 'text-zinc-900'}`}>{c.title}</span>
                  <span className="text-sm leading-snug text-zinc-600">{c.text}</span>
                </span>
              </li>
            ))}
          </motion.ol>
          <div className="grid items-start gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <motion.div {...fade}><CraneWait /></motion.div>
            <motion.div {...fade} className="lg:row-span-2">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">What the Dispatcher Minimises</h3>
                <Md className="text-zinc-800">{String.raw`$$\bar I \;=\; \frac{1}{N}\sum_{j=1}^{N}\bigl(h_j - r_j\bigr)$$`}</Md>
                <dl className="mt-4 divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200">
                  {SYMBOLS.map((v) => (
                    <div key={v.name} className="flex items-start gap-4 px-4 py-3">
                      <dt className="flex h-9 w-12 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-900">
                        <Md>{v.sym}</Md>
                      </dt>
                      <dd className="text-sm leading-relaxed text-zinc-600">
                        <b className="text-zinc-900">{v.name}</b>
                        {v.unit && <span className="ml-1.5 rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500">{v.unit}</span>}
                        <Md className="block">{v.text}</Md>
                      </dd>
                    </div>
                  ))}
                </dl>
                <Md className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">{String.raw`The dispatcher cannot change $r_j$. It can only bring $h_j$ closer to it.`}</Md>
                <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                  The delay of one handover, actual time minus earliest possible time, is defined as in <i>Kim and Bae (2004), Fig. 2</i>,
                  who minimise the total crane delay. Here it is averaged over the containers, so ships of any size compare. The bar is the
                  usual sign for an average.
                </p>
              </div>
            </motion.div>
            <motion.div {...fade}>
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">Why It Is Hard</h3>
                <ul className="flex flex-col gap-4">
                  {HARD.map((h) => (
                    <li key={h.title} className="flex gap-3">
                      <h.icon className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                      <span className="text-sm leading-relaxed text-zinc-600"><b className="text-zinc-900">{h.title}.</b> {h.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Photo p={PHOTOS.quay} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ why it matters */}
      <section className="border-y border-zinc-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <SectionHead kicker="Why It Matters" title="Small Waits, at a Very Large Scale">
              <p>
                A few seconds of crane waiting per container looks small. But it repeats for every container of every ship, and the
                ship cannot leave until its last container is handled.
              </p>
            </SectionHead>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STAKES.map((s, i) => (
              <motion.div key={s.title} {...fade} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                <s.icon className="mb-5 h-7 w-7 text-teal-700" />
                <div className="text-2xl font-bold tracking-tight tabular-nums">{s.stat}</div>
                <h3 className="mb-3 mt-1 text-sm font-semibold text-zinc-800">{s.title}</h3>
                <p className="mb-5 flex-grow text-sm leading-relaxed text-zinc-600">{s.desc}</p>
                <p className="border-t border-zinc-200 pt-3 text-xs italic leading-relaxed text-zinc-500">
                  {'href' in s && s.href
                    ? <a href={s.href} target="_blank" rel="noreferrer" className="underline decoration-zinc-300 underline-offset-2 hover:text-zinc-700">{s.source}</a>
                    : s.source}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ closing */}
      <section className="bg-zinc-900 px-4 py-20 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <motion.div {...fade} className="flex max-w-3xl flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-400">What This Thesis Does</span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Can a Dispatcher Learn to Keep the Cranes Busy?</h2>
            <p className="text-lg leading-relaxed text-zinc-300">
              Plans made in advance work well only while every time goes as planned. This thesis tests the methods terminals use
              today under random crane and travel times, and builds a dispatcher that learns to decide in real time.
            </p>
          </motion.div>
          <motion.ol {...fade} className="grid gap-4 md:grid-cols-3">
            {STEPS.map((st, i) => (
              <li key={st.title} className="flex flex-col gap-4 rounded-2xl border border-zinc-700 bg-zinc-800/60 p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-400 text-sm font-bold text-zinc-900">{i + 1}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${st.status === 'Done' ? 'bg-teal-400/15 text-teal-300' : st.status === 'In Progress' ? 'bg-amber-400/15 text-amber-300' : 'bg-zinc-700 text-zinc-300'}`}>{st.status}</span>
                </div>
                <span className="text-lg font-semibold">{st.title}</span>
                <ul className="flex flex-col gap-2.5 border-t border-zinc-700 pt-4">
                  {st.points.map((pt) => (
                    <li key={pt} className="flex gap-2.5 text-sm leading-snug text-zinc-300">
                      {st.status === 'Done'
                        ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                        : <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${st.status === 'In Progress' ? 'bg-amber-300' : 'bg-zinc-500'}`} />}
                      {pt}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </motion.ol>
          <motion.div {...fade} className="flex flex-wrap gap-3">
            <Link href="/problem" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-200">
              The Problem in Detail <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/experiments" className="inline-flex items-center gap-2 rounded-full border border-zinc-600 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800">
              See the Experiments <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </Link>
            <Link href="/literature" className="inline-flex items-center gap-2 rounded-full border border-zinc-600 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800">
              What Earlier Studies Did <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </Link>
            <a href={REPO} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-zinc-600 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800">
              Code and Results on GitHub <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </a>
          </motion.div>
          <p className="text-xs text-zinc-500">Last updated {UPDATED}.</p>
        </div>
      </section>
    </div>
  );
}