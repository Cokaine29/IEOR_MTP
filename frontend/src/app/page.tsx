'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, CheckCircle2, Circle, CircleDot, Globe2, Gauge, Truck, FileSearch, Repeat, Shuffle, Timer } from 'lucide-react';
import HeroReplay from '@/components/home/HeroReplay';
import CraneWait from '@/components/home/CraneWait';
import NoiseChart from '@/components/home/NoiseChart';
import TerminalExplorer from '@/components/home/TerminalExplorer';
import Md from '@/components/experiments/Md';
import home from '@/data/home.json';

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
    desc: 'World container port traffic in 2021. Every one of these boxes passes under a quay crane.',
    source: 'Notteboom, Pallis and Rodrigue (2022), Port Economics, Management and Policy, data of Drewry and UNCTAD',
  },
  {
    icon: Gauge, stat: '30.5 moves/h',
    title: 'The AGVs Set the Crane’s Pace',
    desc: 'Quay crane productivity in a simulation of an automated terminal with 2 AGVs per crane. The same study reports higher crane rates only with more vehicles per crane.',
    source: 'Luo (2016), Sec. 2.3, Fig. 3',
  },
  {
    icon: Truck, stat: '38% to 50%+',
    title: 'More Vehicles Because AGVs Cannot Lift',
    desc: 'Extra vehicles an AGV fleet needs compared with self-lifting vehicles, because an AGV must wait for a crane at every handover.',
    source: 'Vis and Harika (2004) and Yang et al. (2004), as reported by Carlo et al. (2014)',
  },
  {
    icon: FileSearch, stat: '2 of 56',
    title: 'Studies That Optimise Under Uncertainty',
    desc: 'Papers on container terminal transport up to 2012 that use stochastic optimisation. Most dispatching studies assume known, fixed operation times.',
    source: 'Carlo et al. (2014), Table A1, column 22 (counted for this thesis)',
  },
];

const SPECS = [
  { value: '2 Quay Cranes', detail: 'Over blocks 24 and 26, 82 m apart, 75 s per container', source: 'Zhao et al. (2025); Liu, Jula and Ioannou (2001)' },
  { value: '12 AGVs', detail: 'Six per crane, the operating fleet chosen in Experiment 2.1', source: 'Luo (2016), usually 5 to 8 AGVs per crane' },
  { value: '6.0 / 3.5 m/s', detail: 'Top speed of an empty and a loaded AGV, 3 m/s in turns of 10 m radius', source: 'Luo (2016); Luo (2016b), Table 2; Zhao et al. (2025), Table 1' },
  { value: 'AGV Traffic', detail: 'Each AGV reserves the road ahead of it, its body plus its braking distance, so AGVs never collide and wait for each other', source: 'Kim, Jeon and Ryu (2006); Li et al. (2016)' },
  { value: '50 Yard Blocks', detail: 'About 2.1 km of yard, 5 transfer racks per block', source: 'Liu et al. (2016); Wu et al. (2016)' },
  { value: '200 Containers', detail: '100 discharge and 100 load per ship, 2 bays per crane', source: 'Kim and Bae (2004); Zhao et al. (2025)' },
  { value: '±0% to ±40%', detail: 'Random crane handling times, the same draws for every method', source: 'Kim and Bae (2004)' },
  { value: '±0% to ±20%', detail: 'Random AGV speed on each trip, so travel times vary too', source: 'Li et al. (2018), Table 4' },
  { value: '14.8 m × 3.0 m', detail: 'AGV body, all-wheel steering, both axles follow the path', source: 'Luo (2016), Table 3; Konecranes LIFT AGV' },
];

const CHAIN = [
  { title: 'Crane Is Ready', text: 'The crane has the container over the AGV lane, or is ready to take one.' },
  { title: 'No AGV Underneath', text: 'The AGV that should be there is still driving, or was sent somewhere else.' },
  { title: 'Crane Stands Idle', text: 'Every second until the AGV arrives is lost crane time, and the ship waits with it.' },
];

const HARD = [
  { icon: Repeat, title: 'Hundreds of Linked Decisions', text: 'The choice repeats about 200 times per ship here, and each one changes where every AGV will be later.' },
  { icon: Shuffle, title: 'Random Times', text: 'Real crane handling times and AGV travel times vary, so a plan made on the planned times goes stale.' },
  { icon: Timer, title: 'No Time to Re-plan', text: 'Searching for a new plan takes time the terminal does not have, so the decision must be made in real time.' },
];

const SYMBOLS = [
  { sym: String.raw`$\bar I$`, name: 'Crane Idle Time per Container', unit: 'seconds', text: 'The average wait of the crane over all containers of the ship. Lower is better.' },
  { sym: String.raw`$N$`, name: 'Containers of the Ship', unit: '', text: '200 in every run here, 100 discharge and 100 load.' },
  { sym: String.raw`$r_j$`, name: 'Crane Ready', unit: 'seconds', text: 'The time the crane is ready to hand over container $j$. Only the crane sets it.' },
  { sym: String.raw`$h_j$`, name: 'Handover', unit: 'seconds', text: 'The time the handover of container $j$ really happens, once an AGV is under the crane.' },
];

type Status = 'done' | 'partly' | 'next';
const PATH: { n: string; title: string; detail: string; status: Status }[] = [
  { n: '1', title: 'Simulator Check', detail: 'The simulator matches a hand-built answer key to within 1e-6 s.', status: 'done' },
  { n: '2', title: 'Where Decisions Matter', detail: 'Fleet size, look-ahead and ship size, now with AGV traffic. 12 AGVs chosen as the operating fleet.', status: 'done' },
  { n: '3', title: 'Search Check', detail: 'The memetic search recovers 100% of the room for improvement at 12 AGVs, in small cases solved exactly.', status: 'done' },
  { n: '4', title: 'Crane-Time Randomness', detail: 'Rules, a plan made in advance and the perfect dispatcher are done on the model with traffic. The re-planning GA and its thinking time are running.', status: 'partly' },
  { n: '5', title: 'Travel-Time Randomness', detail: 'AGV speeds vary on every trip (±0% to ±20%), alone and together with random crane times. Running.', status: 'partly' },
  { n: '6', title: 'MDP Design', detail: 'What the dispatcher sees and what it can choose, with an imitation-learning baseline.', status: 'next' },
  { n: '7', title: 'DQN', detail: 'A value-based learning dispatcher.', status: 'next' },
  { n: '8', title: 'PPO, then MAPPO', detail: 'One central learned dispatcher, then one cooperating agent per AGV.', status: 'next' },
];

const TABS = [
  { href: '/background', label: 'Background', desc: 'How an automated terminal works' },
  { href: '/problem', label: 'Problem', desc: 'The dispatching decision in detail' },
  { href: '/literature', label: 'Literature', desc: 'What earlier studies did and left open' },
  { href: '/experiments', label: 'Experiments', desc: 'Every experiment with its maths and results' },
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
  const n = home.crane_noise;
  const f = home.fleet as Record<string, number[]>;
  const saved = Math.round(100 * Math.min(...n.map((r) => r.saved_share))), savedHi = Math.round(100 * Math.max(...n.map((r) => r.saved_share)));
  const lead = (v: number) => (Math.abs(v) < 0.05 ? '0.0' : v.toFixed(1));
  const first = n[0], last = n[n.length - 1];
  const roomLo = Math.min(...n.map((r) => r.room[0])), roomHi = Math.max(...n.map((r) => r.room[0]));
  const roomCiLo = Math.min(...n.map((r) => r.room[1])), roomCiHi = Math.max(...n.map((r) => r.room[1]));
  const benchLo = Math.min(...n.map((r) => r.benchmark[0])), benchHi = Math.max(...n.map((r) => r.benchmark[0]));

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
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <motion.div {...fade}><CraneWait /></motion.div>
            <motion.div {...fade} className="flex flex-col gap-5">
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
          <motion.div {...fade}><SectionHead kicker="Why It Matters" title="Small Waits, at a Very Large Scale" /></motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STAKES.map((s, i) => (
              <motion.div key={s.title} {...fade} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                <s.icon className="mb-5 h-7 w-7 text-teal-700" />
                <div className="text-2xl font-bold tracking-tight tabular-nums">{s.stat}</div>
                <h3 className="mb-3 mt-1 text-sm font-semibold text-zinc-800">{s.title}</h3>
                <p className="mb-5 flex-grow text-sm leading-relaxed text-zinc-600">{s.desc}</p>
                <p className="border-t border-zinc-200 pt-3 text-xs italic leading-relaxed text-zinc-500">{s.source}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ the simulated terminal */}
      <section className="bg-zinc-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <SectionHead kicker="The Simulated Terminal" title="Built from Published Data of a Real Automated Terminal">
              <p>
                The layout follows the automated terminal at <b>Yangshan Phase IV</b> in Shanghai, as described by <i>Liu et al. (2016)</i>
                {' '}and <i>Wu et al. (2016)</i>. Hover over the yard below, or tap a block, to see what it holds.
              </p>
            </SectionHead>
            <div className="-mt-4 mb-8 flex flex-wrap gap-2">
              {['Event-Driven Python Simulator', 'AGVs Accelerate, Brake and Turn on Real Lanes', 'Every Value Has a Published Source', 'Same Random Draws for Every Method'].map((c) => (
                <span key={c} className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">{c}</span>
              ))}
            </div>
          </motion.div>
          <motion.div {...fade} className="mb-8">
            <TerminalExplorer />
            <p className="mt-3 text-xs leading-relaxed text-zinc-500">
              Discharge containers go to blocks within 10 of the five blocks behind the cranes, and load containers come from blocks
              within 15. These ranges are set so that crane productivity comes close to the simulation of <i>Luo (2016)</i>.
            </p>
          </motion.div>
          <div className="grid overflow-hidden rounded-2xl border border-zinc-200 bg-white sm:grid-cols-2 lg:grid-cols-3">
            {SPECS.map((s) => (
              <div key={s.value} className="flex flex-col gap-1.5 border-b border-zinc-200 p-5 sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(odd)]:border-r-0 lg:[&:not(:nth-child(3n))]:border-r">
                <div className="text-xl font-semibold tracking-tight tabular-nums">{s.value}</div>
                <div className="text-sm leading-snug text-zinc-600">{s.detail}</div>
                <div className="mt-auto pt-1 text-xs italic text-zinc-500">{s.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ baseline results */}
      <section className="border-y border-zinc-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <SectionHead kicker="Baseline Results · Model v5" title="What Traditional Methods Achieve, and What They Leave">
              <p>
                Before any learning, the thesis measures the methods a terminal could use today. These are the baselines the learned
                dispatcher has to beat. All numbers are means over {home.seeds} paired ships with 95% intervals.
              </p>
            </SectionHead>
          </motion.div>
          <div className="mb-10 grid gap-5 md:grid-cols-3">
            {[
              {
                head: 'Dispatching Matters',
                big: `${f['NV/FCFS'][0].toFixed(1)} s vs ${f['Random'][0].toFixed(1)} s`,
                text: `Crane idle per container with ${home.fleet_n} AGVs, the best rule (NV/FCFS, ±${f['NV/FCFS'][1].toFixed(1)}) against random dispatching (±${f['Random'][1].toFixed(1)}). Same AGVs, same ship, only the decisions differ.`,
                exp: 'Experiment 2.1',
              },
              {
                head: 'Plans Made in Advance Break',
                big: `${lead(first.lead_of_plan[0])} s → ${lead(last.lead_of_plan[0])} s`,
                text: `Lead of a plan made in advance over the best rule, with exact crane times (±${first.lead_of_plan[1].toFixed(2)}) and with ±40% randomness (±${last.lead_of_plan[1].toFixed(2)}). At ±40% the lead is gone. The plan was right for the planned times only.`,
                exp: 'Experiment 4.1',
              },
              {
                head: 'Room Left for Real-Time Decisions',
                big: `${roomLo.toFixed(1)} to ${roomHi.toFixed(1)} s`,
                text: `Extra crane idle per container of the best rule over a perfect dispatcher that knew the real crane times (±${roomCiLo.toFixed(2)} to ±${roomCiHi.toFixed(2)}). The perfect dispatcher waits only ${benchLo.toFixed(1)} to ${benchHi.toFixed(1)} s, so ${saved}% to ${savedHi}% of the best rule's waiting could be avoided.`,
                exp: 'Experiment 4.1',
              },
            ].map((c) => (
              <motion.div key={c.head} {...fade} className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                <span className="text-sm font-semibold text-teal-700">{c.head}</span>
                <span className="text-3xl font-bold tracking-tight tabular-nums">{c.big}</span>
                <p className="flex-grow text-sm leading-relaxed text-zinc-600">{c.text}</p>
                <span className="text-xs text-zinc-500">{c.exp}</span>
              </motion.div>
            ))}
          </div>
          <motion.div {...fade} className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
            <h3 className="mb-4 text-lg font-semibold tracking-tight">Crane Idle as Crane Times Become Random</h3>
            <NoiseChart />
          </motion.div>
          <p className="mt-6 text-sm leading-relaxed text-zinc-600">
            Running now on this model are random AGV speeds (Experiments 4.4 and 4.5), the GA that re-plans during the ship
            (Experiment 4.2) and the cost of its thinking time (Experiment 4.3). Every experiment, with its set-up, maths and full results, is on the{' '}
            <Link href="/experiments" className="font-medium text-teal-700 underline underline-offset-2">Experiments tab</Link>.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------ research path */}
      <section className="bg-zinc-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <SectionHead kicker="Research Path" title="From Traditional Methods to a Learned Dispatcher">
              <p>
                Stages 1 to 5 measure traditional methods and show why a real-time learner is needed. Stages 6 to 8 build that learner.
              </p>
            </SectionHead>
          </motion.div>
          <ol className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PATH.map((s) => {
              const Icon = s.status === 'done' ? CheckCircle2 : s.status === 'partly' ? CircleDot : Circle;
              const tone = s.status === 'done' ? 'border-teal-200 bg-teal-50/60' : s.status === 'partly' ? 'border-amber-200 bg-amber-50/70' : 'border-zinc-200 bg-white';
              const ic = s.status === 'done' ? 'text-teal-700' : s.status === 'partly' ? 'text-amber-600' : 'text-zinc-400';
              const tag = s.status === 'done' ? 'Done' : s.status === 'partly' ? 'In progress' : 'Next';
              return (
                <motion.li key={s.n} {...fade} className={`flex flex-col gap-2 rounded-2xl border p-5 ${tone}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-zinc-500">Stage {s.n}</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${ic}`}><Icon className="h-4 w-4" />{tag}</span>
                  </div>
                  <h3 className="text-base font-semibold tracking-tight">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-600">{s.detail}</p>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------ explore */}
      <section className="border-t border-zinc-200 bg-white px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TABS.map((t) => (
            <Link key={t.href} href={t.href} className="group flex flex-col gap-1 rounded-2xl border border-zinc-200 p-5 hover:border-zinc-400">
              <span className="inline-flex items-center gap-1.5 font-semibold">{t.label}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
              <span className="text-sm text-zinc-600">{t.desc}</span>
            </Link>
          ))}
          <a href={REPO} target="_blank" rel="noreferrer" className="group flex flex-col gap-1 rounded-2xl border border-zinc-900 bg-zinc-900 p-5 text-white hover:bg-zinc-800">
            <span className="inline-flex items-center gap-1.5 font-semibold">GitHub<ArrowUpRight className="h-4 w-4" /></span>
            <span className="text-sm text-zinc-300">Simulator, experiments and saved results, reproducible with fixed seeds</span>
          </a>
        </div>
        <p className="mx-auto mt-8 max-w-6xl text-xs text-zinc-500">Last updated {UPDATED}. Results from model {home.model}.</p>
      </section>
    </div>
  );
}
