'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';

// - DATA -

type Paper = {
  id: number;
  act: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  summary: string;
  methods: string[];
  layout: string;
  stochasticity: 'Deterministic' | 'Stochastic' | 'Partial' | 'N/A';
  relevance: string;
  notesFile?: string; // path under /literature/ to the markdown notes
};

const actsData = [
  {
    num: 1,
    title: "The Blueprint: What is an Automated Container Terminal?",
    subtitle: "Before solving the problem, researchers first had to define it. These papers established what an ACT is, how it works, and what we're optimizing."
  },
  {
    num: 2,
    title: "The Classical Era: Optimization Before AI",
    subtitle: "For the first two decades, researchers attacked AGV dispatching with mathematical programming and queueing theory. These methods were powerful but struggled with real-time decisions."
  },
  {
    num: 3,
    title: "The Metaheuristic Wave: When Math Gets Too Hard",
    subtitle: "As terminals grew complex - adding battery constraints, multi-load AGVs, and traffic congestion - pure optimization became computationally infeasible. Metaheuristics like Genetic Algorithms filled the gap."
  },
  {
    num: 4,
    title: "The Deep RL Revolution: Teaching Machines to Dispatch",
    subtitle: "Reinforcement Learning changed the game - instead of hand-crafting rules, the algorithm learns optimal dispatching through millions of simulation interactions."
  },
  {
    num: 5,
    title: "Multi-Agent Systems: Every AGV Thinks for Itself",
    subtitle: "Centralized dispatching has limits. Researchers began asking: what if each AGV had its own brain? Multi-Agent RL enables decentralized yet cooperative decision-making."
  },
  {
    num: 6,
    title: "The Gap: Where Every Paper Points Next",
    subtitle: "Despite rapid progress, a consistent gap persists across ALL papers in this field: stochastic, real-time dispatching under uncertainty remains unsolved. This is exactly where our research begins."
  }
];

const papers: Paper[] = [
  // ACT 1
  {
    id: 1, act: 1,
    title: "Design and Simulation of Automated Container Terminal Using AGVs",
    authors: "C.I. Liu, H. Jula, P.A. Ioannou", 
    journal: "European Control Conference (ECC)", 
    year: 2001,
    summary: "This paper shifts the focus from micro-routing algorithms to macro-environment physical design. It serves as the architectural blueprint for the PettingZoo simulation, providing peer-reviewed constants for Mega-Ship sizes, Quay Crane speeds (42 moves/hr), AGV velocities (10mph empty / 5mph loaded), and stochastic job generation probabilities (70% Storage, 18% Gate, 12% Train). It defines the classical 'Shortest Queue First' heuristic as a baseline competitor and provides the mathematical throughput saturation curves required to validate simulation physics.",
    methods: ["Simulation", "Queueing Theory"], 
    layout: "Perpendicular", 
    stochasticity: "Stochastic",
    relevance: "Provides the physical constants for our simulation environment and the SQF baseline.",
    notesFile: "liu_2001/notes.md"
  },
  {
    id: 2, act: 1,
    title: "A Critical Review of Automated Container Terminal Layout Designs and Handling Technologies",
    authors: "X. Li, Y. Chen, et al.", journal: "Transport Economics and Management, Vol. 3", year: 2025,
    summary: "Systematic review of 119 papers covering all terminal layout types (parallel, perpendicular, U-shaped, tower) and their operational trade-offs.",
    methods: ["Survey"], layout: "All Types", stochasticity: "Partial",
    relevance: "Justifies our choice of perpendicular layout as the dominant design in literature."
  },
  {
    id: 17, act: 1,
    title: "Transport operations in container terminals: Literature overview, trends, research directions and classification scheme",
    authors: "H-ctor J. Carlo, Iris F.A. Vis, Kees Jan Roodbergen", journal: "European Journal of Operational Research", year: 2014,
    summary: "An extensive literature review that formally classifies container terminal transport operations, highlighting the severe efficiency gap between lifting and non-lifting vehicles, and exposing the limitations of deterministic mathematical models.",
    methods: ["Literature Review", "Taxonomy"], layout: "Standard Block Layout", stochasticity: "Stochastic",
    relevance: "Provides the formal 30-attribute taxonomy to classify the thesis, mathematically proves the severe penalty of using non-lifting AGVs (justifying the need for highly efficient DRL), and dictates that the dispatching architecture must be vehicle-initiated.",
    notesFile: "carlo_2014/notes.md"
  },
  // ACT 2
  {
    id: 15, act: 2,
    title: "Characterization of automatic guided vehicle dispatching rules",
    authors: "P.J. Egbelu, J.M.A. Tanchoco", journal: "International Journal of Production Research", year: 1984,
    summary: "The foundational paper defining the Work-centre vs. Vehicle-initiated dispatching dichotomy. Proved that Shortest-Distance rules cause factory gridlock, and established the NV and MFCFS baselines.",
    methods: ["Simulation", "Heuristic"], layout: "Job Shop", stochasticity: "Deterministic",
    relevance: "Defines the exact mathematical logic for our greedy Nearest Vehicle (NV) baseline. Proves our DRL must use Work-centre initiated logic to minimize QC idle time.",
    notesFile: "egbelu_1984/notes.md"
  },
  {
    id: 3, act: 2,
    title: "A Look-Ahead Dispatching Method for Automated Guided Vehicles in Automated Port Container Terminals",
    authors: "Kap Hwan Kim, Jong Wook Bae", 
    journal: "Transportation Science", 
    year: 2004,
    summary: "Introduced the Look-Ahead Dispatching Procedure (LADP) using a Mixed-Integer Programming (MIP) model. Formally proved that looking ahead (-step) drastically reduces delays, but explicitly admitted that tracking traffic congestion and yard cranes is mathematically impossible for MIPs.",
    methods: ["MIP", "Heuristic", "Simulation"], 
    layout: "Perpendicular", 
    stochasticity: "Deterministic",
    relevance: "Provides the mathematical blueprint for our DRL Reward Function (- - - justifies limiting our state space to a -step look-ahead window, defines the STT/D baseline formulas, and explicitly calls for Yard Crane synchronization (which our DRL natively solves).",
    notesFile: "kim_2004/notes.md"
  },
  {
    id: 16, act: 2,
    title: "Inventory-based Dispatching of Automated Guided Vehicles on Container Terminals",
    authors: "Dirk Briskorn, Andreas Drexl, S-nke Hartmann", 
    journal: "OR Spectrum", 
    year: 2006,
    summary: "Rejects traditional due-time based mathematical models (which rely on highly unreliable time estimates). Introduces an inventory-based approach that treats quay cranes like factories and AGVs as buffer inventory. Proves that dispatching multiple vehicles simultaneously improves productivity by 10%.",
    methods: ["Exact Algorithm", "Heuristic", "Simulation"], 
    layout: "Perpendicular", 
    stochasticity: "Deterministic",
    relevance: "Provides our primary justification for why deterministic time-based routing fails in reality. Establishes the rule of asymmetric precedence (strict for loading, none for discharging) and provides the ultimate justification for using MAPPO over single-agent RL.",
    notesFile: "briskorn_2006/notes.md"
  },
  {
    id: 21, act: 2,
    title: "Strategies for Dispatching AGVs at Automated Seaport Container Terminals",
    authors: "Martin Grunow, Hans-Otto G-nther, Matthias Lehmann", 
    journal: "OR Spectrum", 
    year: 2006,
    summary: "This paper provides the architectural blueprint for modern terminal simulations. It explicitly justifies abstracting low-level routing and traffic control out of the simulation to focus purely on the Assignment problem. It introduces the mathematical complexity of 'Dual-Load' carriers and proves that Mixed-Integer Linear Programming (MILP) fails to scale for real-time dispatching. Crucially, it defines strict benchmarks for simulation scale (Small, Medium, Large) and provides a mathematical method for injecting weather disruptions (manipulating variance). It establishes that top-tier heuristics should aim to operate within 5% of the absolute un-capacitated CPLEX Lower Bound.",
    methods: ["MILP", "Simulation", "Heuristic"], 
    layout: "Perpendicular", 
    stochasticity: "Stochastic",
    relevance: "Provides the architectural blueprint for our terminal simulation, justifying the abstraction of low-level routing, establishing simulation scaling benchmarks, and providing the mathematical framework for our weather disruption modeling.",
    notesFile: "grunow_2006/notes.md"
  },
  {
    id: 18, act: 2,
    title: "An Uncertainty-Aware AGV Assignment Algorithm for Automated Container Terminals",
    authors: "Panagiotis Angeloudis, Michael G.H. Bell", 
    journal: "Transportation Research Part E", 
    year: 2010,
    summary: "Identifies that deterministic planning breaks down in volatile port environments. Introduces an AGV Assignment Algorithm (AAA) that explicitly penalizes routing uncertainty and limits look-ahead to a 2-step horizon. Proves mathematically that 100% fleet utilization causes gridlock and decreases overall terminal productivity.",
    methods: ["0-1 Integer Programming", "Microsimulation (Limen)"], 
    layout: "Perpendicular", 
    stochasticity: "Stochastic",
    relevance: "Provides critical DRL hyperparameter tuning logic (proving the discount factor gamma should be explicitly lowered to ~0.5 in stochastic terminal traffic). Confirms our Reward Function must penalize QC wait time to prevent starvation, and confirms our State Space needs spatial awareness to avoid congestion hotspots.",
    notesFile: "angeloudis_2010/notes.md"
  },
  {
    id: 4, act: 2,
    title: "A Hybrid Design of AGV Systems for Automated Container Terminals",
    authors: "S. Hoshino, J. Ota, A. Shinozaki, H. Hashimoto", journal: "IEEE International Conference on Automation Science and Engineering", year: 2007,
    summary: "Queueing network theory to determine minimum AGV fleet size for a given throughput target. Compared vertical vs. horizontal AGV transport systems.",
    methods: ["Queueing Theory", "Simulation"], layout: "Vertical vs. Horizontal", stochasticity: "Partial",
    relevance: "Provides fleet-sizing justification for our 10-AGV, 4-QC configuration."
  },
  // ACT 3
  {
    id: 5, act: 3,
    title: "AGV Scheduling in Automated Container Terminals Considering Task Priority and Container Handling Time",
    authors: "X. Zheng, X. Xu, et al.", journal: "Flexible Services and Manufacturing Journal", year: 2022,
    summary: "Modeled AGV scheduling as Multi-TSP with an Improved Genetic Algorithm, explicitly incorporating QC task priorities and variable handling times.",
    methods: ["Genetic Algorithm", "Multi-TSP"], layout: "Perpendicular", stochasticity: "Deterministic",
    relevance: "Our Genetic Algorithm baseline is modeled after this paper's approach."
  },
  {
    id: 6, act: 3,
    title: "AGV Scheduling with Battery Swapping and Speed Control in Automated Container Terminals",
    authors: "X. Yang, H. Chen, et al.", journal: "Journal of Marine Science and Engineering, Vol. 11", year: 2023,
    summary: "Added battery swapping stations and speed control to the AGV scheduling problem. Two-level GA + Simulated Annealing hybrid.",
    methods: ["Genetic Algorithm", "Simulated Annealing"], layout: "Perpendicular", stochasticity: "Deterministic",
    relevance: "Shows how constraints grow over time - energy management is a natural extension of our work."
  },
  {
    id: 7, act: 3,
    title: "AGV Scheduling in Automated Container Terminals Considering Multi-Load Strategy and Charging Requirements",
    authors: "X. Yang, H. Hu, et al.", journal: "International Journal of Production Research, Vol. 63, No. 23", year: 2025,
    summary: "Multi-load AGV scheduling (one AGV carries multiple containers per trip) with battery swapping using Guided Variable Neighborhood Search (GVNS).",
    methods: ["MIP", "GVNS"], layout: "Perpendicular", stochasticity: "Deterministic",
    relevance: "Our terminal scale (4 QCs, 4 blocks, 10 AGVs) and layout directly match their Figure 2a setup."
  },
  {
    id: 8, act: 3,
    title: "Resilient AGV Scheduling with Load-Dependent Power and Non-Linear Charging Under Disruptions",
    authors: "Y. Song, et al.", journal: "Ocean & Coastal Management, Vol. 244", year: 2024,
    summary: "AGV scheduling under disruptions with a dual-threshold charging strategy, validated on real data from Guangzhou Nansha port.",
    methods: ["ALNS", "Heuristic"], layout: "Parallel", stochasticity: "Partial",
    relevance: "Source of our congestion model formula - travel_time - (1 + - - lane_occupancy)."
  },
  // ACT 4
  {
    id: 20, act: 4,
    title: "Online Preference Learning for Adaptive Dispatching of AGVs in an Automated Container Terminal",
    authors: "Ri Choe, Jeongmin Kim, Kwang Ryel Ryu",
    journal: "Applied Soft Computing",
    year: 2016,
    summary: "A pivotal paper that bridges the gap between classical static formulas and modern Deep RL. It proves that Genetic Algorithms and Rolling Horizon heuristics are computationally unviable for real-time chaotic ports (taking up to 12 hours to adapt). The authors introduce an Online Preference Learning (OnPL) neural network that makes decisions in milliseconds. Crucially, they demonstrate that basic single-agent Q-Learning fails to converge in complex ports.",
    methods: ["OnPL", "Neural Network", "Q-Learning"],
    layout: "Perpendicular",
    stochasticity: "Stochastic",
    relevance: "Their use of 'Pairwise Preference' serves as the mathematical precursor to the PPO Advantage function, and their dual objective function provides empirical proof of the Makespan vs. Empty-Travel Starvation Trade-off.",
    notesFile: "choe_2016/notes.md"
  },
  {
    id: 9, act: 4,
    title: "Proximal Policy Optimization Algorithms",
    authors: "John Schulman, Filip Wolski, Prafulla Dhariwal, Alec Radford, Oleg Klimov", journal: "arXiv preprint (OpenAI)", year: 2017,
    summary: "Proposed PPO - a stable, efficient policy gradient algorithm that balances simplicity and performance. Now the dominant on-policy RL algorithm.",
    methods: ["PPO", "Policy Gradient"], layout: "N/A (Algorithm Paper)", stochasticity: "N/A",
    relevance: "PPO is our core Phase 4 algorithm - this is the paper we cite when justifying our choice."
  },
  {
    id: 10, act: 4,
    title: "AGV Scheduling in Automated Container Terminals Considering Task Priority and Container Handling Time (DQN)",
    authors: "X. Zheng, et al.", journal: "Flexible Services and Manufacturing Journal (Online First)", year: 2025,
    summary: "First application of Deep Q-Network (DQN) to AGV dispatching in ACTs. Formulated as a Markov Decision Process with state, action, and reward.",
    methods: ["DQN", "MDP", "Deep RL"], layout: "Perpendicular (One-Way Loop)", stochasticity: "Partial",
    relevance: "Our most direct baseline - we replicate their DQN approach and compare against our PPO. Their MDP formulation directly inspired ours."
  },
  {
    id: 19, act: 4,
    title: "Multi-AGV Dynamic Scheduling in an Automated Container Terminal: A Deep Reinforcement Learning Approach",
    authors: "Xiyan Zheng, Chengji Liang, Yu Wang, Jian Shi, Gino Lim",
    journal: "Mathematics",
    year: 2022,
    summary: "This paper justifies the transition from traditional Q-Learning to Deep Q-Networks (DQN) by explaining how traditional lookup tables fail due to the Curse of Dimensionality in complex ports. Crucially, it introduces the 'Meta-Controller' architecture: instead of outputting direct physical movements, the neural network acts as a heuristic selector, choosing which classical dispatching rule (e.g., FCFS or Shortest Distance) to apply at any given moment based on real-time state features like task waiting time and AGV status.",
    methods: ["DQN", "Heuristic"],
    layout: "Perpendicular",
    stochasticity: "Stochastic",
    relevance: "Provides the foundational justification for using DRL in stochastic port environments, while revealing the need for multi-agent architectures.",
    notesFile: "zheng_2022/notes.md"
  },
  // ACT 5
  {
    id: 11, act: 5,
    title: "Anti-Conflict AGV Path Planning in Automated Container Terminals Based on Multi-Agent Reinforcement Learning",
    authors: "Hongtao Hu, Xurui Yang, Shichang Xiao, Feiyang Wang", journal: "International Journal of Production Research, Vol. 61", year: 2023,
    summary: "Applied MADDPG to AGV path conflict resolution - solving head-on and same-point conflicts in real-time.",
    methods: ["MADDPG", "Multi-Agent RL"], layout: "Perpendicular", stochasticity: "Partial",
    relevance: "Motivates our Phase 5 MAPPO extension - shows MARL is viable for ACT problems."
  },
  {
    id: 12, act: 5,
    title: "The Surprising Effectiveness of PPO in Cooperative Multi-Agent Games",
    authors: "Chao Yu, Akash Velu, Eugene Vinitsky, et al.", journal: "NeurIPS 2022 / arXiv:2103.01955", year: 2022,
    summary: "Demonstrated that PPO - extended to multi-agent settings as MAPPO - achieves state-of-the-art performance in cooperative multi-agent benchmarks.",
    methods: ["MAPPO", "Multi-Agent RL", "PPO"], layout: "N/A (Algorithm Paper)", stochasticity: "N/A",
    relevance: "Theoretical justification for our Phase 5 MAPPO implementation."
  },
  // ACT 6
  {
    id: 13, act: 6,
    title: "AGV Scheduling at U-Shaped Automated Container Terminal with Charging Requirements",
    authors: "T. Xie, et al.", journal: "Flexible Services and Manufacturing Journal (Online First)", year: 2025,
    summary: "Scheduling in U-shaped terminals with charging constraints using a Dual-Threshold + Genetic-ALNS hybrid. Explicitly notes dynamic conditions as future work.",
    methods: ["Genetic Algorithm", "ALNS"], layout: "U-Shaped", stochasticity: "Partial",
    relevance: "Shows the gap persists even in very recent, specialized work."
  },
  {
    id: 14, act: 6,
    title: "Deep Reinforcement Learning for AGV Scheduling in Automated Container Terminals: A Review",
    authors: "C. Yu", journal: "AIP Conference Proceedings", year: 2026,
    summary: "Surveys the current state of DRL for ACT scheduling - identifies collaborative multi-agent coordination under uncertainty as the #1 open research direction.",
    methods: ["Survey", "Deep RL"], layout: "General", stochasticity: "Partial",
    relevance: "The most recent survey in our exact field - directly validates our research direction."
  },
  {
    id: 22, act: 6,
    title: "Deep Reinforcement Learning at the Edge of the Statistical Precipice",
    authors: "Rishabh Agarwal, Max Schwarzer, Pablo Samuel Castro, Aaron Courville, Marc G. Bellemare",
    journal: "NeurIPS (Outstanding Paper Award)",
    year: 2021,
    summary: "This paper establishes the modern rigorous statistical standards for evaluating Deep RL. It dictates new rules for RL evaluation: (1) Use the Interquartile Mean (IQM) to minimize Mean Squared Error, (2) Report 95% Confidence Intervals (computed via 50,000 percentile bootstrap resamples), and (3) Use the Mann-Whitney 'Probability of Improvement' metric. Crucially, it defines the Neyman-Pearson 0.75 upper-CI threshold for proving statistical meaningfulness. It also debunks the myth of 'fixed random seeds', proving that GPU non-determinism mandates multiple independent runs.",
    methods: ["Statistical Analysis", "Deep RL Evaluation"],
    layout: "N/A (Algorithm Paper)",
    stochasticity: "N/A",
    relevance: "Provides the exact statistical methodology used in our thesis to evaluate PPO against the GA and DQN baselines, ensuring our performance claims are scientifically rigorous.",
    notesFile: "agarwal_2021/notes.md"
  }
];

// - HELPERS -

const getMethodColor = (method: string) => {
  if (method.includes('MIP')) return 'bg-blue-50 text-blue-700 border-blue-200';
  if (method.includes('Genetic Algorithm') || method.includes('GVNS')) return 'bg-purple-50 text-purple-700 border-purple-200';
  if (method.includes('DQN')) return 'bg-orange-50 text-orange-700 border-orange-200';
  if (method.includes('MAPPO') || method.includes('MADDPG')) return 'bg-teal-50 text-teal-700 border-teal-200';
  if (method.includes('PPO') || method.includes('Policy Gradient')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (method.includes('Survey')) return 'bg-zinc-100 text-zinc-800 border-zinc-200';
  if (method.includes('Simulation')) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
  if (method.includes('Queueing')) return 'bg-pink-50 text-pink-700 border-pink-200';
  return 'bg-zinc-100 text-zinc-800 border-zinc-200';
};

const getStochasticityBadge = (level: string) => {
  if (level === 'Stochastic') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (level === 'Partial') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (level === 'N/A') return 'bg-transparent text-zinc-600 border-zinc-200';
  return 'bg-zinc-100 text-zinc-700 border-zinc-200';
};

// - NOTES MODAL -

function NotesModal({ paper, onClose }: { paper: Paper; onClose: () => void }) {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paper.notesFile) {
      setLoading(false);
      return;
    }
    fetch(`/literature/${paper.notesFile}`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load notes (${res.status})`);
        return res.text();
      })
      .then(text => {
        setMarkdown(text);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [paper.notesFile]);

  // Determine the base directory for images from the notesFile path
  const imageBase = paper.notesFile
    ? '/literature/' + paper.notesFile.substring(0, paper.notesFile.lastIndexOf('/') + 1)
    : '/literature/';

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/20 backdrop-blur-sm overflow-y-auto p-4 sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full max-w-4xl bg-white border border-zinc-200 rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.12)] my-8 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-zinc-200 px-6 sm:px-8 py-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2 mb-3">
              {paper.methods.map(m => (
                <span key={m} className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full border ${getMethodColor(m)}`}>{m}</span>
              ))}
              <span className="text-zinc-700 font-mono text-xs ml-2 font-medium">{paper.year}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 leading-snug tracking-tight">{paper.title}</h2>
            <p className="text-sm text-zinc-700 mt-2 font-medium">{paper.authors} - {paper.journal}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 border border-zinc-200 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 sm:px-8 py-8 bg-white">
          {loading && (
            <div className="flex items-center justify-center py-20 text-zinc-700 font-medium">
              <svg className="w-6 h-6 animate-spin mr-3 text-zinc-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Loading notes-
            </div>
          )}

          {error && (
            <div className="text-rose-600 bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm font-medium">{error}</div>
          )}

          {!paper.notesFile && !loading && (
            <div className="text-center py-16">
              <div className="text-zinc-300 text-3xl mb-4"></div>
              <p className="text-zinc-700 font-medium">Detailed notes for this paper haven't been written yet.</p>
              <p className="text-zinc-600 text-sm mt-1">Check back later, or contribute by analyzing this paper!</p>
            </div>
          )}

          {markdown && (
            <article className="prose prose-zinc prose-sm sm:prose-base max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-img:rounded-2xl prose-img:border prose-img:border-zinc-200 prose-img:shadow-sm
              prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-zinc-800 prose-code:font-medium
              prose-pre:bg-zinc-100 prose-pre:border prose-pre:border-zinc-200 prose-pre:text-zinc-800
              prose-blockquote:border-zinc-300 prose-blockquote:bg-zinc-100 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl
              prose-a:text-blue-600 hover:prose-a:text-blue-700
            ">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  img: ({ src, alt, ...props }) => {
                    let resolvedSrc = (src as string) || '';
                    if (resolvedSrc && !resolvedSrc.startsWith('/') && !resolvedSrc.startsWith('http')) {
                      resolvedSrc = imageBase + resolvedSrc;
                    }
                    return (
                      <span className="flex flex-col items-center my-8">
                        <img src={resolvedSrc} alt={alt} className="max-w-full rounded-2xl border border-zinc-200 shadow-sm" {...props} />
                        {alt && <span className="block text-center text-sm text-zinc-700 mt-3 font-medium">{alt}</span>}
                      </span>
                    );
                  },
                }}
              >
                {markdown}
              </ReactMarkdown>
            </article>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// - COMPONENT -

export default function LiteraturePage() {
  const [selectedMethod, setSelectedMethod] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);

  // Derive unique methods and year ranges for filters
  const allMethods = useMemo(() => {
    const methods = new Set<string>();
    papers.forEach(p => p.methods.forEach(m => methods.add(m)));
    return ['All', ...Array.from(methods).sort()];
  }, []);

  const yearRanges = ['All', 'Before 2010', '2010-2020', '2021-2026'];

  // Filter logic
  const filteredPapers = useMemo(() => {
    return papers.filter(p => {
      const methodMatch = selectedMethod === 'All' || p.methods.includes(selectedMethod);
      let yearMatch = true;
      if (selectedYear === 'Before 2010') yearMatch = p.year < 2010;
      else if (selectedYear === '2010-2020') yearMatch = p.year >= 2010 && p.year <= 2020;
      else if (selectedYear === '2021-2026') yearMatch = p.year >= 2021;
      return methodMatch && yearMatch;
    });
  }, [selectedMethod, selectedYear]);

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      {/* KaTeX CSS for math rendering */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />

      <div className="max-w-6xl mx-auto">
        
        {/* Intro */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-zinc-900 tracking-tight">The Evolution of Dispatching</h1>
          <p className="text-lg text-zinc-700 leading-relaxed font-medium">
            The field of AGV dispatching in Automated Container Terminals has evolved over 40 years - 
            from basic simulation models to cooperative multi-agent deep reinforcement learning. 
            Here is the story of that evolution, and where our research fits.
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-5 rounded-full border border-zinc-200 shadow-sm mb-20 flex flex-col md:flex-row gap-4 justify-between items-center px-8"
        >
          <div className="flex items-center gap-4 w-full md:w-auto">
            <span className="text-sm font-bold text-zinc-700 uppercase tracking-wider">Method</span>
            <select 
              className="bg-zinc-100 border border-zinc-200 text-zinc-900 text-sm font-medium rounded-full focus:ring-zinc-900 focus:border-zinc-900 block w-full p-2.5 px-4 outline-none transition-colors shadow-sm"
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
            >
              {allMethods.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <span className="text-sm font-bold text-zinc-700 uppercase tracking-wider">Era</span>
            <select 
              className="bg-zinc-100 border border-zinc-200 text-zinc-900 text-sm font-medium rounded-full focus:ring-zinc-900 focus:border-zinc-900 block w-full p-2.5 px-4 outline-none transition-colors shadow-sm"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {yearRanges.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </motion.div>

        {/* The Timeline & Acts */}
        <div className="relative pl-0 md:pl-10">
          {/* Vertical Timeline Line */}
          <div className="hidden md:block absolute left-[19px] top-4 bottom-0 w-[2px] bg-zinc-200 z-0" />

          {actsData.map((act) => {
            const actPapers = filteredPapers.filter(p => p.act === act.num);
            if (actPapers.length === 0) return null;

            return (
              <motion.div 
                key={act.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="relative mb-28 z-10"
              >
                {/* Timeline Dot */}
                <div className="hidden md:block absolute -left-[32px] top-6 w-5 h-5 rounded-full bg-white border-4 border-zinc-300 shadow-sm" />

                {/* Act Header */}
                <div className="relative mb-10 pt-2">
                  <div className="absolute -top-16 -left-6 text-[9rem] font-bold text-zinc-200 select-none pointer-events-none tracking-tighter leading-none z-[-1]">
                    0{act.num}
                  </div>
                  <h2 className="relative text-3xl font-bold text-zinc-900 mb-3 tracking-tight">{act.title}</h2>
                  <p className="relative text-zinc-700 max-w-3xl leading-relaxed font-medium text-lg">{act.subtitle}</p>
                </div>

                {/* Papers Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
                  <AnimatePresence>
                    {actPapers.map(paper => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        key={paper.id}
                        onClick={() => setSelectedPaper(paper)}
                        className={`bg-white border border-zinc-200 rounded-3xl p-8 flex flex-col justify-between group soft-shadow cursor-pointer transition-all duration-300 ${paper.notesFile ? 'hover:border-zinc-300' : 'hover:border-zinc-200'}`}
                      >
                        <div>
                          {/* Card Header: Tags & Year */}
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex flex-wrap gap-2">
                              {paper.methods.map(m => (
                                <span key={m} className={`px-3 py-1 text-[10px] uppercase font-bold rounded-full border ${getMethodColor(m)}`}>
                                  {m}
                                </span>
                              ))}
                            </div>
                            <span className="text-zinc-600 font-mono text-sm ml-4 font-bold">{paper.year}</span>
                          </div>

                          {/* Title & Author */}
                          <h3 className="text-xl font-bold text-zinc-900 mb-2 line-clamp-2 leading-snug tracking-tight group-hover:text-blue-600 transition-colors">
                            {paper.title}
                          </h3>
                          <p className="text-sm text-zinc-700 mb-5 font-medium">
                            {paper.authors} - {paper.journal}
                          </p>

                          {/* Summary */}
                          <p className="text-zinc-800 mb-8 leading-relaxed text-sm font-medium line-clamp-3">
                            {paper.summary}
                          </p>
                        </div>

                        {/* Card Footer: Metadata & Tooltip */}
                        <div className="mt-auto">
                          <div className="flex items-center gap-3 border-t border-zinc-200 pt-5">
                            <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 flex items-center gap-1.5">
                              <span className="text-zinc-600 font-bold">Layout:</span> {paper.layout}
                            </span>
                            <span className={`px-3 py-1.5 text-xs font-bold rounded-full border flex items-center gap-1.5 ${getStochasticityBadge(paper.stochasticity)}`}>
                              {paper.stochasticity}
                            </span>
                            {paper.notesFile && (
                              <span className="ml-auto px-3 py-1.5 text-xs font-bold rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Notes
                              </span>
                            )}
                          </div>

                          {/* Relevance Chip & Tooltip */}
                          <div className="mt-5 relative group/tooltip inline-block w-full">
                            <div className="w-full px-4 py-3 rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-800 text-sm font-semibold flex items-center justify-between hover:bg-zinc-100 transition-colors">
                              <span>Relevance to our work</span>
                              <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            
                            {/* Hover Reveal (Tooltip) */}
                            <div className="absolute bottom-full left-0 mb-3 w-full p-4 bg-white border border-zinc-200 text-zinc-800 text-sm font-medium rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 translate-y-2 pointer-events-none transition-all duration-200 z-20">
                              {paper.relevance}
                              <div className="absolute top-full left-6 -mt-px border-[8px] border-transparent border-t-zinc-200" />
                              <div className="absolute top-full left-[25px] -mt-2 border-[7px] border-transparent border-t-white" />
                            </div>
                          </div>
                        </div>

                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* The Final Conclusion Box */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-zinc-900 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/5 opacity-50" />
          <h3 className="relative text-2xl md:text-3xl font-bold mb-4 text-white tracking-tight">Our Research Gap</h3>
          <p className="relative text-zinc-300 md:text-lg max-w-3xl mx-auto leading-relaxed font-medium">
            This thesis bridges the exact gap between Act 4 and Act 5: applying PPO and MAPPO to <strong className="text-white font-bold">stochastic AGV dispatching</strong> - the open challenge every recent paper explicitly calls for.
          </p>
        </motion.div>

      </div>

      {/* Notes Modal */}
      <AnimatePresence>
        {selectedPaper && (
          <NotesModal paper={selectedPaper} onClose={() => setSelectedPaper(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
