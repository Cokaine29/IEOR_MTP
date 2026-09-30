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
import { CheckCircle2 } from 'lucide-react';

const sections = [
  { id: 'phase-1', title: 'Phase 1: Environment' },
  { id: 'pointer-1', title: '  1. Layout Finalization' },
  { id: 'pointer-2', title: '  2 & 3. Calibration' },
  { id: 'pointer-4', title: '  4. Software Architecture' },
  { id: 'phase-2', title: 'Phase 2: MDP' },
  { id: 'pointer-5', title: '  5. State Space' },
  { id: 'pointer-6', title: '  6, 7 & 8. MDP Form' },
  { id: 'phase-3', title: 'Phase 3: Stochasticity' },
  { id: 'pointer-9', title: '  9. Disruptions' },
  { id: 'phase-4', title: 'Phase 4: Validation' },
  { id: 'pointer-10', title: '  10. Sanity Checks' },
  { id: 'phase-5', title: 'Phase 5: Baselines' },
  { id: 'pointer-11', title: '  11 & 12. Implementation' },
  { id: 'phase-6', title: 'Phase 6: DRL' },
  { id: 'pointer-13', title: '  13 & 16. Architectures' },
  { id: 'pointer-15', title: '  15. Curriculum' },
  { id: 'pointer-17', title: '  17. Hyperparameters' },
  { id: 'phase-7', title: 'Phase 7: Evaluation' },
  { id: 'pointer-18', title: '  18 & 19. Protocol' },
  { id: 'pointer-20', title: '  20. Ablations' },
  { id: 'pointer-21', title: '  21. Statistics' },
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full font-semibold"
          >
            <CheckCircle2 className="w-5 h-5" />
            All 21 methodology pointers — Complete
          </motion.div>
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
console.log('page.tsx fixed layout');
