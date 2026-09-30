'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SiPython, SiNextdotjs, SiFastapi, SiPytorch } from 'react-icons/si';
import { Building2, Bot, BarChart3, ArrowRight, ArrowUpRight, Globe2, Ship, Hourglass, FileSearch, XCircle, CheckCircle2, Box, BrainCircuit, Dna, Terminal, Triangle, Users, Zap, BarChart2 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const },
  }),
};

const stakes = [
  {
    icon: <Globe2 className="w-6 h-6 text-zinc-700" />,
    stat: '700M+ TEU',
    title: 'Global Scale',
    desc: 'Handled globally per year, requiring massive operational coordination at ports.',
    citation: 'World Bank (2018) via Gharehgozli et al. (2020)',
  },
  {
    icon: <Ship className="w-6 h-6 text-zinc-700" />,
    stat: 'Up to $100k/day',
    title: 'Cost of Delay',
    desc: 'The capital cost (demurrage) for a delayed containership stuck at berth.',
    citation: 'Haralambides (2019)',
  },
  {
    icon: <Hourglass className="w-6 h-6 text-zinc-700" />,
    stat: '38–50% More AGVs',
    title: 'The Dispatch Bottleneck',
    desc: 'Extra fleet size needed compared to self-lifting vehicles due to mandatory crane wait times.',
    citation: 'Vis & Harika (2004) via Carlo et al. (2014)',
  },
  {
    icon: <FileSearch className="w-6 h-6 text-zinc-700" />,
    stat: '0 out of 56',
    title: 'The Literature Gap',
    desc: 'AGV dispatching papers successfully combine stochastic disruptions with real-time optimization.',
    citation: 'Carlo et al. (2014), Table A1',
  },
];

const architecture = [
  {
    icon: <Building2 className="w-8 h-8 text-zinc-700" />,
    title: 'Simulation Environment',
    desc: 'Single-berth operational zone (498×572m) with a perpendicular layout, 5 QCs, 25 AGVs, 8 Yard Blocks. Event-driven, 203-feature state space. Calibrated via multiple empirical sources.',
  },
  {
    icon: <Bot className="w-8 h-8 text-zinc-700" />,
    title: 'DRL Agent',
    desc: 'Centralized PPO dispatcher (Baseline) evolving into a MAPPO (CTDE) architecture for highly scalable multi-agent fleet coordination.',
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-zinc-700" />,
    title: 'Rigorous Evaluation',
    desc: '560 runs (7 methods × 4 intensities × 20 seeds). IQM + 95% stratified bootstrap CI via rliable (Agarwal et al., 2021).',
  },
];

const techStack = [
  { name: 'Python 3.10+', icon: SiPython, color: 'text-blue-500' },
  { name: 'Gymnasium', icon: Box, color: 'text-zinc-500' },
  { name: 'PettingZoo', icon: Users, color: 'text-zinc-500' },
  { name: 'Stable Baselines3', icon: SiPytorch, color: 'text-orange-500' },
  { name: 'DEAP', icon: Dna, color: 'text-zinc-500' },
  { name: 'rliable', icon: BarChart2, color: 'text-zinc-500' },
  { name: 'Next.js', icon: SiNextdotjs, color: 'text-zinc-900' },
  { name: 'FastAPI', icon: SiFastapi, color: 'text-teal-500' }
];

export default function HomePage() {
  return (
    <div className="relative bg-zinc-50 min-h-screen pt-16 selection:bg-zinc-200">
      {/* --- Hero Section --- */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Soft background accents */}
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-zinc-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-zinc-200/40 rounded-full blur-[120px]" />

        <div className="relative max-w-5xl mx-auto px-4 text-center z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {/* Badge */}
            <motion.div variants={fadeUp} custom={0} className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 text-xs font-semibold text-zinc-700 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-zinc-400" />
                M.Tech Thesis · IIT Bombay IEOR · 2025–26
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-zinc-900 mb-6"
            >
              AGV Dispatching in Automated Port Terminal
              <br />
              <span className="text-zinc-500 text-4xl sm:text-5xl lg:text-6xl mt-2 block">Under Stochastic Conditions</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg sm:text-xl text-zinc-700 mb-6 max-w-3xl mx-auto font-medium leading-relaxed"
            >
              A Deep Reinforcement Learning approach to minimise Quay Crane idle time under real-world stochastic disruptions.
            </motion.p>

            {/* Author */}
            <motion.p
              variants={fadeUp}
              custom={3}
              className="text-sm text-zinc-500 mb-12 font-medium uppercase tracking-wider"
            >
              Niraj Kamble <span className="mx-2">|</span> Guide: Prof. Jayendran Venkateswaran
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              custom={4}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/problem"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-zinc-900 text-white font-semibold text-sm hover:bg-zinc-800 transition-colors shadow-md"
              >
                Explore Problem
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/methodology"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-100 border border-zinc-200 transition-colors shadow-sm"
              >
                View Methodology
                <ArrowUpRight className="w-4 h-4 text-zinc-500" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- The Stakes Section --- */}
      <section className="relative py-24 px-4 bg-white border-t border-zinc-200">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-6 text-center">Why This Matters</h2>
            <div className="max-w-3xl mx-auto text-zinc-700 text-lg leading-relaxed text-justify font-medium">
              <p>
                At the operational core of every Automated Container Terminal, Automated Guided Vehicles (AGVs) act as the connective tissue between the ship and the storage yard. Because AGVs are non-self-lifting, a Quay Crane cannot drop its container until an assigned AGV is parked directly underneath it. Every poor dispatch decision causes the crane to pause mid-cycle and hold a container in the air, directly translating to <strong>Quay Crane idle time</strong>, and idle Quay Cranes mean ships stay docked longer. Yet many of the underlying routing algorithms in literature and practice are still strictly deterministic - a rigid assumption that Carlo et al. (2014) notes can significantly limit their reliability in real-world operations.
              </p>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stakes.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200 flex flex-col h-full"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-sm border border-zinc-200">
                  {item.icon}
                </div>
                <div className="text-2xl font-bold text-zinc-900 mb-1">{item.stat}</div>
                <h3 className="text-sm font-bold text-zinc-700 mb-3 uppercase tracking-wider">{item.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed mb-6 flex-grow">
                  {item.desc}
                </p>
                <div className="pt-4 border-t border-zinc-200 mt-auto">
                  <p className="text-xs text-zinc-400 font-medium italic">
                    {item.citation}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- The Research Gap Section --- */}
      <section className="relative py-24 px-4 bg-zinc-900 text-zinc-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">The Research Gap</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto font-medium">
              Bridging the divide between classical mathematical optimization and chaotic real-world operations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="bg-zinc-800/50 rounded-3xl p-8 border border-zinc-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-bold text-white">Limitations of Existing Literature</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Classical MIP and GA models assume a deterministic world, they break under real disruptions (Carlo 2014).',
                  'Basic Q-Learning failed to converge in this exact problem domain due to state space explosion (Choe 2016).',
                  'Recent DRL approaches (Zheng 2022) use proprietary commercial simulators with no public physical calibration.'
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2 flex-shrink-0" />
                    <span className="text-zinc-300 text-sm leading-relaxed text-justify">{text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="bg-zinc-800/50 rounded-3xl p-8 border border-zinc-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <h3 className="text-xl font-bold text-white">What This Thesis Contributes</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Open Python/Gymnasium simulator explicitly calibrated to empirical terminal physics (Liu 2001, Yang 2025, Zhao 2023).',
                  'Robust testing across 4 stochastic disruption types and 4 intensity levels (σ = 0 to 3).',
                  'Centralized PPO dispatcher evaluated against Greedy, GA, and DQN baselines, with a roadmap to MAPPO for multi-agent scaling.',
                  'Statistically rigorous evaluation using Interquartile Mean (IQM) via rliable (Agarwal 2021).'
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2 flex-shrink-0" />
                    <span className="text-zinc-300 text-sm leading-relaxed text-justify">{text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Project Architecture --- */}
      <section className="relative py-24 px-4 bg-white border-b border-zinc-200">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">Project Architecture</h2>
            <p className="text-zinc-600 max-w-2xl mx-auto font-medium">
              A comprehensive system designed from the ground up to tackle the AGV dispatching problem.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {architecture.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="bg-zinc-50 rounded-3xl p-8 border border-zinc-200 group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-zinc-200 group-hover:scale-105 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3 tracking-tight">{item.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed font-medium text-justify">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Tech Stack --- */}
      <section className="relative py-24 px-4 bg-zinc-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-3">Tech Stack</h2>
            <p className="text-zinc-500 font-medium">
              The tools powering this research
            </p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {techStack.map((tech, i) => (
              <motion.span
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-zinc-200 text-sm font-semibold text-zinc-700 shadow-sm hover:border-zinc-300 transition-colors"
              >
                <tech.icon className={`w-4 h-4 ${tech.color}`} />
                {tech.name}
              </motion.span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
