'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, CheckCircle2, Circle, CircleDot, Globe2, Gauge, Truck, FileSearch } from 'lucide-react';
import HeroReplay from '@/components/home/HeroReplay';
import CraneWait from '@/components/home/CraneWait';
import NoiseChart from '@/components/home/NoiseChart';
import Md from '@/components/experiments/Md';
import home from '@/data/home.json';

/* Real photographs: put the file in frontend/public/home/ and fill in src and credit.
   A photo is shown only once its src is set. Use photos you may reuse (press kit, Wikimedia Commons). */
const PHOTOS: Record<'terminal' | 'quay', { src: string | null; alt: string; credit: string }> = {
  terminal: { src: null, alt: 'An automated container terminal with AGVs under the quay cranes', credit: '' },
  quay: { src: null, alt: 'An AGV waiting under a quay crane', credit: '' },
};

const REPO = 'https://github.com/Cokaine29/ACT_MTP';
const UPDATED = '19 Oct 2026';

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
  { value: '2 quay cranes', detail: 'over blocks 24 and 26, 82 m apart, 75 s per container', source: 'Zhao et al. (2025); Liu, Jula and Ioannou (2001)' },
  { value: '10 AGVs', detail: '5 per crane, the operating fleet chosen in Experiment 2.1', source: 'Luo (2016), usually 5 to 8 AGVs per crane' },
  { value: '6.0 / 3.5 m/s', detail: 'top speed of an empty and a loaded AGV, 3 m/s in turns', source: 'Luo (2016); Zhao et al. (2025), Table 1' },
  { value: '50 yard blocks', detail: 'about 2.1 km of yard, 5 transfer racks per block', source: 'Liu et al. (2016); Wu et al. (2016)' },
  { value: '200 containers', detail: '100 discharge and 100 load per ship, 2 bays per crane', source: 'Kim and Bae (2004); Zhao et al. (2025)' },
  { value: '±0% to ±40%', detail: 'random crane handling times, the same draws for every method', source: 'Kim and Bae (2004)' },
];

type Status = 'done' | 'partly' | 'next';
const PATH: { n: string; title: string; detail: string; status: Status }[] = [
  { n: '1', title: 'Simulator check', detail: 'The simulator matches a hand-built answer key to within 1e-6 s.', status: 'done' },
  { n: '2', title: 'Where decisions matter', detail: 'Fleet size, look-ahead and ship size. 10 AGVs chosen as the operating fleet.', status: 'done' },
  { n: '3', title: 'Search check', detail: 'The memetic search recovers 82% to 100% of the room for improvement at 10 AGVs, in small cases solved exactly.', status: 'done' },
  { n: '4', title: 'Crane-time randomness', detail: 'Rules, a plan made in advance and the perfect dispatcher are done. The re-planning GA and its thinking time are being re-run.', status: 'partly' },
  { n: '5', title: 'Travel-time randomness', detail: 'AGV speeds and delays become random.', status: 'next' },
  { n: '6', title: 'MDP design', detail: 'What the dispatcher sees and what it can choose, with an imitation-learning baseline.', status: 'next' },
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
  const f = home.fleet10 as Record<string, number[]>;
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
                See the experiments <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/problem" className="inline-flex items-center gap-2 rounded-full border border-zinc-600 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800">
                The problem in detail <ArrowUpRight className="h-4 w-4 text-zinc-400" />
              </Link>
              <a href={REPO} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-zinc-600 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800">
                Code and results on GitHub <ArrowUpRight className="h-4 w-4 text-zinc-400" />
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
            <SectionHead kicker="The problem" title="A crane cannot let go until an AGV is under it">
              <p>
                AGVs cannot lift a container by themselves. The quay crane must set each container straight onto an AGV, or lift it
                straight off one <i>(Carlo et al., 2014)</i>. So when no AGV is there, the crane stops and waits with the container in
                the air. That wait is <b>Crane Idle Time</b>, and idle cranes keep the ship longer at the berth.
              </p>
            </SectionHead>
          </motion.div>
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <motion.div {...fade}><CraneWait /></motion.div>
            <motion.div {...fade} className="flex flex-col gap-5">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">What the dispatcher minimises</h3>
                <Md className="text-zinc-800">{String.raw`$$\bar I \;=\; \frac{1}{N}\sum_{j=1}^{N}\bigl(h_j - r_j\bigr)$$`}</Md>
                <Md className="mt-3 text-sm leading-relaxed text-zinc-700">{String.raw`$\bar I$ is the crane idle time per container in seconds. $N$ is the number of containers of the ship (200 in every run here). $r_j$ is the time the crane is ready to hand over container $j$, and $h_j$ is the time the handover really happens. The dispatcher cannot change $r_j$, it can only bring $h_j$ closer to it.`}</Md>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm leading-relaxed text-zinc-700">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">Why it is hard</h3>
                <p>
                  The decision repeats hundreds of times per ship, and each choice changes where every AGV will be later. On top of
                  that, real crane handling times and AGV travel times vary. A plan made in advance on the planned times goes stale,
                  and searching again takes time the terminal does not have. This is why the thesis asks for a dispatcher that decides
                  in real time.
                </p>
              </div>
              <Photo p={PHOTOS.quay} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ why it matters */}
      <section className="border-y border-zinc-200 bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}><SectionHead kicker="Why it matters" title="Small waits, at a very large scale" /></motion.div>
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
            <SectionHead kicker="The simulated terminal" title="Built from published data of a real automated terminal">
              <p>
                The layout follows the automated terminal at Yangshan Phase IV in Shanghai as described by <i>Liu et al. (2016)</i> and
                {' '}<i>Wu et al. (2016)</i>. The simulator is written for this thesis in Python, is event driven, and moves every AGV
                along real lanes with acceleration and braking. Every value below has a source, listed in the repository.
              </p>
            </SectionHead>
          </motion.div>
          <motion.figure {...fade} className="mb-8 flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-3 sm:p-5">
            <Image src="/home/terminal.png" alt="Plan of the simulated yard: 50 blocks along a 2.1 km quay, with a close-up of the crane area showing the loading zone, buffer slots, driving lanes and yard blocks"
              width={1870} height={1122} className="h-auto w-full" />
            <figcaption className="text-xs leading-relaxed text-zinc-500">
              Top, the whole yard. Bottom, the crane area to scale. Discharge containers go to blocks within 10 of the five blocks
              behind the cranes, load containers come from blocks within 15. These ranges are set so that crane productivity is close
              to the simulation of <i>Luo (2016)</i>.
            </figcaption>
          </motion.figure>
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
            <SectionHead kicker="Baseline results · model v3" title="What traditional methods achieve, and what they leave">
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
                text: `Crane idle per container with 10 AGVs, the best rule (NV/FCFS, ±${f['NV/FCFS'][1].toFixed(1)}) against random dispatching (±${f['Random'][1].toFixed(1)}). Same AGVs, same ship, only the decisions differ.`,
                exp: 'Experiment 2.1',
              },
              {
                head: 'Plans Made in Advance Break',
                big: `${first.lead_of_plan[0].toFixed(1)} s → ${last.lead_of_plan[0].toFixed(1)} s`,
                text: `Lead of a plan made in advance over the best rule, with exact crane times (±${first.lead_of_plan[1].toFixed(2)}) and with ±40% randomness (±${last.lead_of_plan[1].toFixed(2)}). The plan was right for the planned times only.`,
                exp: 'Experiment 4.1',
              },
              {
                head: 'Room Left for Real-Time Decisions',
                big: `${roomLo.toFixed(1)} to ${roomHi.toFixed(1)} s`,
                text: `Extra crane idle per container of the best rule over a perfect dispatcher that knew the real crane times (±${roomCiLo.toFixed(2)} to ±${roomCiHi.toFixed(2)}). The perfect dispatcher waits only ${benchLo.toFixed(1)} to ${benchHi.toFixed(1)} s, so about half of the best rule's waiting could be avoided.`,
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
            <h3 className="mb-4 text-lg font-semibold tracking-tight">Crane idle as crane times become random</h3>
            <NoiseChart />
          </motion.div>
          <p className="mt-6 text-sm leading-relaxed text-zinc-600">
            Still to come on this model are the GA that re-plans during the ship (Experiment 4.2) and the cost of its thinking time
            (Experiment 4.3). Every experiment, with its set-up, maths and full results, is on the{' '}
            <Link href="/experiments" className="font-medium text-teal-700 underline underline-offset-2">Experiments tab</Link>.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------ research path */}
      <section className="bg-zinc-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <SectionHead kicker="Research path" title="From traditional methods to a learned dispatcher">
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
