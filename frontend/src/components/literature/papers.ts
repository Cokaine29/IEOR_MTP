/* Literature tab data. Every entry is taken from our verified paper notes in public/literature/<id>/notes.md.
   Papers not yet read in full are kept apart in the group 'unread' and carry no claims about their content. */

export type GroupId = 'rules' | 'assignment' | 'lookahead' | 'metaheuristic' | 'learning' | 'borrowed' | 'review' | 'unread';

export type Paper = {
  id: string;
  group: GroupId;
  title: string;
  authors: string;
  venue: string;
  year: number;
  doi?: string;
  url?: string;
  approach: string;
  trigger?: string;
  objective?: string;
  summary: string;
  headline?: string;
  role: string;
  notes: boolean;
};

export const GROUPS: { id: GroupId; title: string; text: string }[] = [
  {
    id: 'rules',
    title: 'Rules and Early Simulation Studies',
    text: 'The first studies wrote down simple dispatching rules and tested them in simulation. They also gave the field its basic words, such as who starts a dispatch.',
  },
  {
    id: 'assignment',
    title: 'Assignment Rules',
    text: 'Smarter rules that look at all free AGVs and all waiting jobs together and pick the best match at each moment. They decide fast and need no plan.',
  },
  {
    id: 'lookahead',
    title: 'Optimisation With Look-Ahead',
    text: 'Mathematical models that look a few jobs ahead and choose the assignment with the least delay. They are solved again each time a decision is needed.',
  },
  {
    id: 'metaheuristic',
    title: 'Metaheuristics',
    text: 'Search methods such as genetic algorithms and neighbourhood search that build a full plan before work starts. They handle large problems but assume the times are known.',
  },
  {
    id: 'learning',
    title: 'Learning Methods',
    text: 'Methods that learn a decision rule from data or from experience in a simulator, so that each decision takes only a moment.',
  },
  {
    id: 'borrowed',
    title: 'Methods We Borrow',
    text: 'Not port papers. They give us the learning method of Phase II and the way we will report its results.',
  },
  {
    id: 'review',
    title: 'Reviews',
    text: 'Overviews of the field that we use for its vocabulary and classification.',
  },
  {
    id: 'unread',
    title: 'Not Yet Reviewed',
    text: 'Papers on our reading list. We have not read them in full yet, so we make no claims about their content here.',
  },
];

export const PAPERS: Paper[] = [
  // ---------------- rules
  {
    id: 'egbelu_1984', group: 'rules', notes: true,
    title: 'Characterization of automatic guided vehicle dispatching rules',
    authors: 'Pius J. Egbelu, Jose M. A. Tanchoco',
    venue: 'International Journal of Production Research 22(3), 359–374', year: 1984, doi: '10.1080/00207548408942459',
    approach: 'Dispatching rules', trigger: 'AGV becomes free, or a work centre calls',
    objective: 'Shop throughput',
    summary: 'Defines the two ways a dispatch can start, when an AGV becomes free or when a work centre calls for one. Tests 15 rule combinations in a simulated job shop with 13 departments.',
    headline: '9 of the 15 rule combinations locked the shop. They moved only 1 to 108 loads, against over 700 for the rest.',
    role: 'Source of the two dispatch triggers. Our dispatcher is called when an AGV becomes free. The paper studies a factory, not a port.',
  },
  {
    id: 'liu_2001', group: 'rules', notes: true,
    title: 'Design and Simulation of Automated Container Terminal Using AGVs',
    authors: 'C. I. Liu, H. Jula, P. A. Ioannou',
    venue: 'Proceedings of the European Control Conference, Porto', year: 2001,
    approach: 'Terminal design and simulation', trigger: 'AGV becomes free',
    objective: 'No optimisation objective. Equipment is sized to meet a turnaround target',
    summary: 'Sizes an AGV terminal for forecast demand, with 5 quay cranes and 80 AGVs, and reports one simulated day of work.',
    headline: 'Ship turnaround was 16.81 h against a best possible 16.2 h. The quay cranes stood idle 31.7% of the time and the AGVs 36.3%.',
    role: 'Gives the crane speed of 42 moves per hour in double mode, one of the sources for our 75 s crane time. Shows crane idle time is a real loss even in a well-sized terminal.',
  },
  // ---------------- assignment rules
  {
    id: 'briskorn_2006', group: 'assignment', notes: true,
    title: 'Inventory-based dispatching of automated guided vehicles on container terminals',
    authors: 'Dirk Briskorn, Andreas Drexl, Sönke Hartmann',
    venue: 'OR Spectrum 28, 611–630', year: 2006, doi: '10.1007/s00291-006-0033-8',
    approach: 'Assignment rule', trigger: 'AGV becomes free',
    objective: 'Waterside productivity',
    summary: 'Treats each quay crane as a customer that needs a stock of AGVs on the way to it. A free AGV goes to the crane whose stock is lowest. Compared with a rule built on due times, in a simulation based on the Altenwerder terminal.',
    headline: 'The inventory rule raised productivity by 4.5% to 7.5% over the greedy due-time rule, and by up to 22.9% when AGVs carry a container both ways.',
    role: 'One of our rule baselines, the Briskorn inventory rule with factor 1.6.',
  },
  {
    id: 'grunow_2006', group: 'assignment', notes: true,
    title: 'Strategies for dispatching AGVs at automated seaport container terminals',
    authors: 'Martin Grunow, Hans-Otto Günther, Matthias Lehmann',
    venue: 'OR Spectrum 28, 587–610', year: 2006, doi: '10.1007/s00291-006-0054-3',
    approach: 'Assignment rule against a pattern heuristic', trigger: 'AGV becomes free, or a job appears',
    objective: 'Time to finish all jobs, including quay crane waiting',
    summary: 'Compares an on-line rule, nearest vehicle with first come first served, against an off-line pattern heuristic. Crane time randomness is tested at four levels, from none to twice the normal variance.',
    headline: 'The pattern heuristic stayed 1.5% to 14% above a lower bound. The on-line rule stayed 17% to 33% above it.',
    role: 'Source of our NV/FCFS rule baseline. It also tests at several levels of randomness, as we do.',
  },
  // ---------------- look-ahead optimisation
  {
    id: 'kim_2004', group: 'lookahead', notes: true,
    title: 'A look-ahead dispatching method for automated guided vehicles in automated port container terminals',
    authors: 'Kap Hwan Kim, Jong Wook Bae',
    venue: 'Transportation Science 38(2), 224–234', year: 2004, doi: '10.1287/trsc.1030.0082',
    approach: 'Mixed-integer model and heuristic', trigger: 'AGV becomes free',
    objective: 'Quay crane delay first, AGV travel time second',
    summary: 'A mixed-integer model and a fast heuristic that dispatch AGVs by looking ahead over the next few jobs of each crane, when the crane job lists are known. Tested with crane times made random at several levels.',
    headline: 'With 7 AGVs, the crane delay under the other rules was about 4.5 times that under look-ahead.',
    role: 'Our objective, the average crane idle time per container, follows this paper. So does our look-ahead over the next jobs of each crane.',
  },
  {
    id: 'angeloudis_2010', group: 'lookahead', notes: true,
    title: 'An uncertainty-aware AGV assignment algorithm for automated container terminals',
    authors: 'Panagiotis Angeloudis, Michael G. H. Bell',
    venue: 'Transportation Research Part E 46, 354–366', year: 2010, doi: '10.1016/j.tre.2009.09.001',
    approach: 'Rolling-horizon integer program', trigger: 'AGV becomes free, or a job appears',
    objective: 'Net benefit of the assigned jobs. No quay crane measure',
    summary: 'A rolling-horizon integer program that gives each AGV up to two next jobs. Jobs whose travel time is uncertain cost more, so they are less likely to be picked.',
    headline: 'With 70 AGVs it moved 8.87 containers per AGV per hour, against 7.77 for a full routing plan and 5.43 to 5.66 for simple rules.',
    role: 'Shows one way to build uncertainty into each decision. It reports no crane idle measure, so it is context rather than a baseline.',
  },
  // ---------------- metaheuristics
  {
    id: 'song_2024', group: 'metaheuristic', notes: true,
    title: 'Novel AGV resilient scheduling for automated container terminals considering charging strategy',
    authors: 'Xiaoming Song, Ning Chen, Min Zhao, Qixiang Wu, Qijie Liao, Jun Ye',
    venue: 'Ocean and Coastal Management 250, 107014', year: 2024,
    approach: 'Adaptive large neighbourhood search, offline', trigger: 'AGV becomes free',
    objective: 'Longest AGV completion time',
    summary: 'Plans AGV jobs and battery charging before work starts, with a two-threshold charging rule and a neighbourhood search. Tested on a case from Guangzhou Nansha Phase IV.',
    headline: 'With 64 AGVs, the total completion time was 14.53 h with two thresholds against 16.63 h with one, about 12.6% lower (our arithmetic).',
    role: 'Context for battery charging, a source of uncertainty we leave to later work. The plan is made offline, not in real time.',
  },
  {
    id: 'zhao_2025', group: 'metaheuristic', notes: true,
    title: 'AGV Scheduling and Energy Consumption Optimization in Automated Container Terminals Based on Variable Neighborhood Search Algorithm',
    authors: 'Ning Zhao, Rongao Li, Xiaoming Yang',
    venue: 'Journal of Marine Science and Engineering 13, 647', year: 2025, doi: '10.3390/jmse13040647',
    approach: 'Variable neighbourhood search, offline',
    objective: 'Total AGV energy',
    summary: 'Plans AGV jobs before work starts so that the energy used is as low as possible, with a variable neighbourhood search. Tested on 100 and 500 tasks.',
    headline: 'Its plans used 13.37% less energy than a genetic algorithm, 20.54 against 23.71 kWh.',
    role: 'One of the sources for our 75 s crane time. It draws crane times at random, then plans as if they were known, the gap our work looks at.',
  },
  // ---------------- learning
  {
    id: 'choe_2016', group: 'learning', notes: true,
    title: 'Online preference learning for adaptive dispatching of AGVs in an automated container terminal',
    authors: 'Ri Choe, Jeongmin Kim, Kwang Ryel Ryu',
    venue: 'Applied Soft Computing 38, 647–660', year: 2016, doi: '10.1016/j.asoc.2015.09.027',
    approach: 'Online preference learning, supervised', trigger: 'AGV becomes free',
    objective: 'Quay crane time per job plus AGV empty travel',
    summary: 'A neural network learns which of two jobs is better and is retrained after every dispatch from look-ahead examples. This is supervised learning, not reinforcement learning.',
    headline: 'A policy search trained on a different kind of scenario gave an average crane time per job of 209.3 s, against 185.9 s for online preference learning. Trained on the same kind, the two were nearly equal.',
    role: 'Shows that a rule tuned for one situation can lose when the situation changes. Context for a dispatcher that keeps learning.',
  },
  {
    id: 'gao_2023', group: 'learning', notes: true,
    title: 'A Machine Learning-Based Approach for Multi-AGV Dispatching at Automated Container Terminals',
    authors: 'Yinping Gao, Chun-Hsien Chen, Daofang Chang',
    venue: 'Journal of Marine Science and Engineering 11, 1407', year: 2023, doi: '10.3390/jmse11071407',
    approach: 'Tabular Q-learning with a contract net', trigger: 'A job appears',
    objective: 'Earliness and lateness of tasks, then congestion',
    summary: 'Tasks are assigned by negotiation between agents, and tabular Q-learning picks the path of each AGV. Tested on a small case without randomness.',
    headline: 'On 60 tasks and 5 AGVs, the total delay was 5750.67 against 6728.90 for a genetic algorithm and 6398.50 for particle swarm.',
    role: 'A precedent for tabular Q-learning settings. It learns paths, not dispatching decisions.',
  },
  {
    id: 'zheng_2022', group: 'learning', notes: true,
    title: 'Multi-AGV Dynamic Scheduling in an Automated Container Terminal: A Deep Reinforcement Learning Approach',
    authors: 'Xiyan Zheng, Chengji Liang, Yu Wang, Jian Shi, Gino Lim',
    venue: 'Mathematics 10, 4575', year: 2022, doi: '10.3390/math10234575',
    approach: 'Deep Q-network (DQN)', trigger: 'AGV becomes free, or a crane releases a container',
    objective: 'Quay crane waiting plus AGV completion time',
    summary: 'One DQN picks a rule (first come first served, shortest distance or longest waiting) and an AGV each time a decision is needed. Compared with a genetic algorithm and the three rules alone.',
    headline: 'With 384 tasks and 12 AGVs, total crane waiting was 397.40 min against 801.61 min for the genetic algorithm. Its AGV completion time was higher than the genetic algorithm’s.',
    role: 'The closest learned dispatcher we have read. Our DQN baseline in Phase II starts from its setting.',
  },
  // ---------------- borrowed methods
  {
    id: 'schulman_2017', group: 'borrowed', notes: true,
    title: 'Proximal Policy Optimization Algorithms',
    authors: 'John Schulman, Filip Wolski, Prafulla Dhariwal, Alec Radford, Oleg Klimov',
    venue: 'arXiv:1707.06347', year: 2017, url: 'https://arxiv.org/abs/1707.06347',
    approach: 'Policy-gradient reinforcement learning (PPO)',
    summary: 'Introduces PPO, a learning method that limits how far each update can move the decision rule, so that training stays stable.',
    headline: 'On 7 simulated robot tasks, limiting the update at 0.2 scored 0.82 on average, against −0.39 with no limit.',
    role: 'The main learning method of Phase II.',
  },
  {
    id: 'agarwal_2021', group: 'borrowed', notes: true,
    title: 'Deep reinforcement learning at the edge of the statistical precipice',
    authors: 'Rishabh Agarwal, Max Schwarzer, Pablo Samuel Castro, Aaron Courville, Marc G. Bellemare',
    venue: 'NeurIPS 2021, Outstanding Paper Award', year: 2021, doi: '10.48550/arXiv.2108.13264',
    approach: 'Statistics for reporting learning results',
    summary: 'Shows that results from a few training runs are unreliable, and recommends confidence intervals, the interquartile mean and performance profiles.',
    headline: 'Its bootstrap intervals came close to their stated coverage from about 10 runs.',
    role: 'How we will report learned dispatchers in Phase II, with intervals over many training runs.',
  },
  // ---------------- review
  {
    id: 'carlo_2014', group: 'review', notes: true,
    title: 'Transport operations in container terminals: Literature overview, trends, research directions and classification scheme',
    authors: 'Héctor J. Carlo, Iris F. A. Vis, Kees Jan Roodbergen',
    venue: 'European Journal of Operational Research 236(1), 1–13', year: 2014, doi: '10.1016/j.ejor.2013.11.023',
    approach: 'Literature review',
    summary: 'Classifies 56 publications on terminal transport up to 2012 with a scheme of 30 attributes, and lists 16 directions for research.',
    headline: 'In the studies reviewed, single-load AGVs appeared about twice as often as vehicles that lift their own load.',
    role: 'Vocabulary and classification for our problem. It covers work up to 2012 only, so it says nothing about recent learning methods.',
  },
  // ---------------- not yet reviewed
  {
    id: 'hu_2023', group: 'unread', notes: false,
    title: 'Anti-conflict AGV path planning in automated container terminals based on multi-agent reinforcement learning',
    authors: 'Hongtao Hu, Xurui Yang, Shichang Xiao, Feiyang Wang',
    venue: 'International Journal of Production Research 61(1), 65–80', year: 2023,
    url: 'https://ideas.repec.org/a/taf/tprsxx/v61y2023i1p65-80.html',
    approach: 'Multi-agent reinforcement learning',
    summary: 'On our list as a port study that uses several learning agents.',
    role: 'To be read before the multi-agent part of Phase II.',
  },
  {
    id: 'yu_2022', group: 'unread', notes: false,
    title: 'The Surprising Effectiveness of PPO in Cooperative Multi-Agent Games',
    authors: 'Chao Yu, Akash Velu, Eugene Vinitsky, et al.',
    venue: 'NeurIPS 2022, Datasets and Benchmarks Track', year: 2022, url: 'https://arxiv.org/abs/2103.01955',
    approach: 'Multi-agent PPO (MAPPO)',
    summary: 'On our list as the source of MAPPO.',
    role: 'To be read before the multi-agent part of Phase II.',
  },
];
