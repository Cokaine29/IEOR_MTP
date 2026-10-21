/* Data for the comparison visuals of the Literature tab.
   Uncertainty statuses and testing facts come from the frontmatter and Sec. 3 of our verified notes
   (summarised in GAP_TABLES.md of the literature folder). 'ours' rows describe model v5 of this thesis. */

import type { GroupId } from './papers';

export const SHORT: Record<string, string> = {
  egbelu_1984: 'Egbelu & Tanchoco',
  liu_2001: 'Liu et al.',
  kim_2004: 'Kim & Bae',
  briskorn_2006: 'Briskorn et al.',
  grunow_2006: 'Grunow et al.',
  angeloudis_2010: 'Angeloudis & Bell',
  carlo_2014: 'Carlo et al.',
  choe_2016: 'Choe et al.',
  schulman_2017: 'Schulman et al.',
  agarwal_2021: 'Agarwal et al.',
  zheng_2022: 'Zheng et al.',
  yu_2022: 'Yu et al.',
  gao_2023: 'Gao et al.',
  hu_2023: 'Hu et al.',
  song_2024: 'Song et al.',
  zhao_2025: 'Zhao et al.',
};

/* Family colours, validated as a categorical palette in this lane order (dataviz validator, light mode, adjacent pairs). */
export const GROUP_STYLE: Record<GroupId, { label: string; dot: string }> = {
  rules: { label: 'Rules', dot: '#65a30d' },
  assignment: { label: 'Assignment rules', dot: '#0284c7' },
  lookahead: { label: 'Look-ahead optimisation', dot: '#d97706' },
  metaheuristic: { label: 'Metaheuristics', dot: '#4f46e5' },
  learning: { label: 'Learning', dot: '#0d9488' },
  borrowed: { label: 'Methods we borrow', dot: '#9333ea' },
  review: { label: 'Review', dot: '#e11d48' },
  unread: { label: 'Not yet reviewed', dot: '#a1a1aa' },
};

/* The 11 dispatching and scheduling studies, in the order of the method families. */
export const STUDIES = [
  'egbelu_1984', 'liu_2001', 'briskorn_2006', 'grunow_2006', 'kim_2004', 'angeloudis_2010',
  'song_2024', 'zhao_2025', 'choe_2016', 'gao_2023', 'zheng_2022',
];

/* ---------------- what each study optimises */
export const OBJECTIVES: { title: string; crane: boolean; ids: string[]; note: string }[] = [
  { title: 'Quay crane waiting, delay or output', crane: true, ids: ['kim_2004', 'grunow_2006', 'briskorn_2006', 'choe_2016', 'zheng_2022', 'ours'], note: 'The same goal as ours. The crane is the bottleneck, so its lost time is the target.' },
  { title: 'Throughput or benefit of the vehicles', crane: false, ids: ['egbelu_1984', 'angeloudis_2010'], note: 'Moves per vehicle or per shop. Crane waiting is not measured.' },
  { title: 'Time for the last AGV to finish', crane: false, ids: ['song_2024'], note: 'A plan made before work starts, with battery charging.' },
  { title: 'Energy used by the AGVs', crane: false, ids: ['zhao_2025'], note: 'A plan made before work starts. Crane waiting is not measured.' },
  { title: 'Task time windows and congestion', crane: false, ids: ['gao_2023'], note: 'Earliness and lateness of tasks, then waiting on the roads.' },
  { title: 'No objective, sizing only', crane: false, ids: ['liu_2001'], note: 'Equipment is sized to meet a turnaround target. Crane idle time is reported as a result.' },
];

/* ---------------- uncertainty heatmap */
export type Status = 'R' | 'E' | 'F' | '?' | '-';
export const SOURCES = [
  { key: 'qc', label: 'Crane handling time' },
  { key: 'travel', label: 'AGV travel and congestion' },
  { key: 'task', label: 'When jobs appear' },
  { key: 'stowage', label: 'Where jobs go' },
  { key: 'breakdown', label: 'AGV breakdown' },
  { key: 'yard', label: 'Yard crane delay' },
  { key: 'battery', label: 'Battery' },
] as const;
export type SourceKey = (typeof SOURCES)[number]['key'];

export const STATUS_STYLE: Record<Status, { name: string; cell: string; text: string; meaning: string }> = {
  R: { name: 'Random', cell: 'bg-emerald-500', text: 'text-white', meaning: 'Drawn at random or given added noise in the experiments.' },
  E: { name: 'Emerges', cell: 'bg-sky-300', text: 'text-sky-950', meaning: 'Not drawn at random, but varies because of what happens in the simulation, for example traffic.' },
  F: { name: 'Fixed', cell: 'bg-zinc-300', text: 'text-zinc-700', meaning: 'A fixed, known input, or left out by assumption.' },
  '?': { name: 'Not described', cell: 'bg-amber-100', text: 'text-amber-800', meaning: 'The paper does not say. This is not a criticism of the paper.' },
  '-': { name: 'Not applicable', cell: 'bg-white', text: 'text-zinc-400', meaning: 'Does not exist in this setting, for example cranes in a factory.' },
};

type Row = Record<SourceKey, Status>;
export const HEAT: Record<string, Row> = {
  egbelu_1984: { qc: '-', travel: 'E', task: '?', stowage: '-', breakdown: '?', yard: '-', battery: '?' },
  liu_2001: { qc: 'R', travel: 'E', task: 'F', stowage: 'R', breakdown: '?', yard: 'F', battery: '?' },
  briskorn_2006: { qc: 'R', travel: 'R', task: 'F', stowage: 'F', breakdown: '?', yard: 'R', battery: '?' },
  grunow_2006: { qc: 'R', travel: 'F', task: 'E', stowage: 'R', breakdown: '?', yard: 'R', battery: '?' },
  kim_2004: { qc: 'R', travel: 'F', task: 'F', stowage: 'F', breakdown: '?', yard: 'F', battery: '?' },
  angeloudis_2010: { qc: '?', travel: 'E', task: '?', stowage: 'F', breakdown: '?', yard: '?', battery: '?' },
  song_2024: { qc: '?', travel: 'F', task: 'F', stowage: '?', breakdown: 'F', yard: '?', battery: 'F' },
  zhao_2025: { qc: 'R', travel: 'F', task: 'F', stowage: '?', breakdown: '?', yard: 'R', battery: 'F' },
  choe_2016: { qc: '?', travel: 'E', task: 'F', stowage: 'R', breakdown: '?', yard: '?', battery: '?' },
  gao_2023: { qc: '?', travel: 'E', task: 'F', stowage: '?', breakdown: '?', yard: '?', battery: 'F' },
  zheng_2022: { qc: '?', travel: 'R', task: 'R', stowage: 'F', breakdown: '?', yard: '?', battery: '?' },
  ours: { qc: 'R', travel: 'R', task: 'F', stowage: 'F', breakdown: 'F', yard: 'F', battery: 'F' },
};

/* What the paper says, in plain words, for cells marked Random or Emerges, and for every cell of our own row. */
export const HEAT_NOTES: Record<string, Partial<Record<SourceKey, string>>> = {
  egbelu_1984: { travel: 'Travel time depends on speed and congestion in the shop. No randomness is stated.' },
  liu_2001: {
    qc: 'A 15% variance in crane capacity is assumed. Its form is not described.',
    travel: 'Speeds are fixed, but queues arise from the traffic rules of the simulation.',
    stowage: 'Each AGV trip draws a random destination, the gate, the train or storage.',
  },
  briskorn_2006: {
    qc: 'Crane times are drawn from distributions based on Altenwerder data.',
    travel: 'A driving-time distribution for every route, which covers congestion.',
    yard: 'Stacking-crane times are drawn from distributions.',
  },
  grunow_2006: {
    qc: 'Crane times are drawn from measured distributions, at four levels from none to twice the variance.',
    task: 'Jobs are released by the random crane cycle, so their timing varies.',
    stowage: 'The yard block of each job is chosen at random.',
    yard: 'Stacking-crane times are drawn from the same measured distributions.',
  },
  kim_2004: { qc: 'Crane times get uniform noise of up to ±δ of the mean, with δ from 0 to 0.4.' },
  angeloudis_2010: { travel: 'Delays arise from collision-avoidance rules at junctions and buffers.' },
  zhao_2025: {
    qc: 'Crane times are drawn from a normal distribution, mean 75 s and spread 15 s, and then planned as if known.',
    yard: 'Yard crane times are drawn the same way and then planned as if known.',
  },
  choe_2016: {
    travel: 'Traffic is simulated in detail, so congestion arises on its own.',
    stowage: 'The number of jobs per ship bay varies, with a mean of 125.',
  },
  gao_2023: { travel: 'AGVs wait where routes meet. All AGVs drive at the same speed.' },
  zheng_2022: {
    travel: 'AGV speed is random. The distribution is not given.',
    task: 'Ship arrival times and task data are random. The distributions are not given.',
  },
  ours: {
    qc: 'Crane times vary by up to ±δ of 75 s, with δ from 0 to 0.4, following Kim and Bae.',
    travel: 'Each trip’s speed varies by up to ±ε, with ε from 0 to 0.2, and congestion arises from road bookings between AGVs.',
    task: 'The job list of each crane is fixed and known, as in Kim and Bae.',
    stowage: 'A fixed ship of 200 containers on 2 cranes.',
    breakdown: 'Not modelled in Phase I.',
    yard: 'A rack visit takes a fixed 51 s.',
    battery: 'Not modelled in Phase I.',
  },
};

/* ---------------- how each study was tested */
export type Mark = 'yes' | 'part' | 'no' | 'plan';
export const TESTS = [
  { key: 'learn', label: 'Learns its decisions' },
  { key: 'levels', label: 'Randomness tested at several levels' },
  { key: 'stats', label: 'Repeated runs with intervals or tests' },
  { key: 'agents', label: 'Several learning agents' },
] as const;
export type TestKey = (typeof TESTS)[number]['key'];

export const TESTED: Record<string, Record<TestKey, [Mark, string]>> = {
  egbelu_1984: { learn: ['no', 'Fixed rules'], levels: ['no', 'One setting'], stats: ['no', '2 runs per rule, no intervals'], agents: ['no', 'No'] },
  liu_2001: { learn: ['no', 'Fixed control logic'], levels: ['no', 'One setting'], stats: ['no', 'One 24-hour run'], agents: ['no', 'No'] },
  briskorn_2006: { learn: ['no', 'Assignment rule'], levels: ['no', 'Noise is present but not varied'], stats: ['part', '100 runs of 11 h, no intervals'], agents: ['no', 'No'] },
  grunow_2006: { learn: ['no', 'Rule and heuristic'], levels: ['yes', 'Crane-time variance at four levels'], stats: ['part', '10 runs, spread not shown'], agents: ['no', 'No'] },
  kim_2004: { learn: ['no', 'Model and heuristic'], levels: ['yes', 'Noise δ swept from 0 to 0.4'], stats: ['yes', '10 runs per case, tests at 1%'], agents: ['no', 'No'] },
  angeloudis_2010: { learn: ['no', 'Integer program'], levels: ['no', 'Weights and fleet size are swept, not noise'], stats: ['no', 'Seeds not stated, no intervals'], agents: ['no', 'No'] },
  song_2024: { learn: ['no', 'Search method'], levels: ['no', 'Charging threshold is swept, not noise'], stats: ['no', 'Runs not described'], agents: ['no', 'No'] },
  zhao_2025: { learn: ['no', 'Search method'], levels: ['no', 'Crane times drawn once per case'], stats: ['part', '10 cases per setting, no tests'], agents: ['no', 'No'] },
  choe_2016: { learn: ['part', 'Supervised learning, not reinforcement learning'], levels: ['part', 'Two kinds of scenario, not graded levels'], stats: ['yes', '50 scenarios, t-tests'], agents: ['no', 'No'] },
  gao_2023: { learn: ['part', 'Tabular Q-learning, for paths only'], levels: ['no', 'No randomness'], stats: ['part', 'Mean of 10 runs for the GA and PSO only'], agents: ['part', 'Negotiating agents that follow rules, not learning agents'] },
  zheng_2022: { learn: ['yes', 'DQN'], levels: ['no', 'One level, the sweep is over problem size'], stats: ['no', 'Runs not described, no intervals'], agents: ['no', 'One central learner'] },
  ours: { learn: ['plan', 'DQN, PPO and MAPPO in Phase II'], levels: ['yes', 'Crane noise at five levels, speed noise at four, and both together'], stats: ['yes', '30 paired ships, 95% intervals'], agents: ['plan', 'MAPPO in Phase II'] },
};
