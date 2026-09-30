const fs = require('fs');

const pageContent = `
'use client';
import { motion } from 'framer-motion';
import TableOfContents from '@/components/TableOfContents';
import Phase1 from '@/components/methodology/Phase1';
import Phase2 from '@/components/methodology/Phase2';
import Phase3 from '@/components/methodology/Phase3';
import Phase45 from '@/components/methodology/Phase45';
import Phase6 from '@/components/methodology/Phase6';
import Phase7 from '@/components/methodology/Phase7';

const sections = [
  { id: 'phase-1', title: 'Phase 1: Environment', level: 0 },
  { id: 'pointer-1', title: '1. Terminal layout finalization', level: 1 },
  { id: 'pointer-2', title: '2. Number of QCs, AGVs, yard blocks', level: 1 },
  { id: 'pointer-3', title: '3. Real-world parameter calibration', level: 1 },
  { id: 'pointer-4', title: '4. Simulation software architecture', level: 1 },
  { id: 'phase-2', title: 'Phase 2: MDP Formulation', level: 0 },
  { id: 'pointer-5', title: '5. State space definition', level: 1 },
  { id: 'pointer-6', title: '6. Action space definition', level: 1 },
  { id: 'pointer-7', title: '7. Reward function design', level: 1 },
  { id: 'pointer-8', title: '8. Transition dynamics', level: 1 },
  { id: 'phase-3', title: 'Phase 3: Stochasticity Model', level: 0 },
  { id: 'pointer-9', title: '9. Disruption types & distributions', level: 1 },
  { id: 'phase-4', title: 'Phase 4: Simulation Validation', level: 0 },
  { id: 'pointer-10', title: '10. Sanity checks & seeding', level: 1 },
  { id: 'phase-5', title: 'Phase 5: Classical Baselines', level: 0 },
  { id: 'pointer-11', title: '11. Baseline implementation', level: 1 },
  { id: 'pointer-12', title: '12. Baseline verification', level: 1 },
  { id: 'phase-6', title: 'Phase 6: DRL Implementation', level: 0 },
  { id: 'pointer-13', title: '13. Neural network architecture', level: 1 },
  { id: 'pointer-14', title: '14. MAPPO (CTDE paradigm)', level: 1 },
  { id: 'pointer-15', title: '15. Curriculum Learning Design', level: 1 },
  { id: 'pointer-16', title: '16. Central Critic vs Local Actor', level: 1 },
  { id: 'pointer-17', title: '17. Hyperparameter tuning', level: 1 },
  { id: 'phase-7', title: 'Phase 7: Evaluation', level: 0 },
  { id: 'pointer-18', title: '18. Experiment Design', level: 1 },
  { id: 'pointer-19', title: '19. Evaluation Protocol', level: 1 },
  { id: 'pointer-20', title: '20. Ablation Study', level: 1 },
  { id: 'pointer-21', title: '21. Statistical Analysis', level: 1 },
];

export default function MethodologyPage() {
  return (
    <div className="relative bg-zinc-50 min-h-screen pb-32">
      {/* Hero */}
      <section className="pt-40 pb-16 px-4 bg-zinc-900 text-white selection:bg-cyan-500/30 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        <div className="max-w-[90rem] mx-auto relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" as const }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Methodology
          </motion.h1>
        </div>
      </section>

      <section className="px-4 max-w-[90rem] mx-auto mt-12 flex flex-col xl:flex-row gap-8 xl:items-start relative">
        {/* Sticky Sidebar */}
        <div className="hidden xl:block w-72 shrink-0 sticky top-24 z-10 self-start">
          <TableOfContents sections={sections} />
        </div>

        {/* Content Area */}
        <div className="flex-1 max-w-5xl mx-auto space-y-12 min-w-0">
          <Phase1 />
          <Phase2 />
          <Phase3 />
          <Phase45 />
          <Phase6 />
          <Phase7 />
        </div>
      </section>
    </div>
  );
}
`;

fs.writeFileSync('src/app/methodology/page.tsx', pageContent, 'utf8');
console.log('page.tsx updated with correct sections');
