
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
  { id: 'phase-1', title: 'Phase 1: Environment', level: 0 },
  { id: 'pointer-1', title: 'Layout Finalization', level: 1 },
  { id: 'pointer-2', title: 'Calibration', level: 1 },
  { id: 'pointer-4', title: 'Software Architecture', level: 1 },
  { id: 'phase-2', title: 'Phase 2: MDP', level: 0 },
  { id: 'pointer-5', title: 'State Space', level: 1 },
  { id: 'pointer-6', title: 'Actions, Reward, Trans', level: 1 },
  { id: 'phase-3', title: 'Phase 3: Stochasticity', level: 0 },
  { id: 'pointer-9', title: 'Disruptions', level: 1 },
  { id: 'phase-4', title: 'Phase 4: Validation', level: 0 },
  { id: 'pointer-10', title: 'Sanity Checks', level: 1 },
  { id: 'phase-5', title: 'Phase 5: Baselines', level: 0 },
  { id: 'pointer-11', title: 'Implementation', level: 1 },
  { id: 'phase-6', title: 'Phase 6: DRL', level: 0 },
  { id: 'pointer-13', title: 'Architectures', level: 1 },
  { id: 'pointer-15', title: 'Curriculum', level: 1 },
  { id: 'pointer-17', title: 'Hyperparameters', level: 1 },
  { id: 'phase-7', title: 'Phase 7: Evaluation', level: 0 },
  { id: 'pointer-18', title: 'Protocol', level: 1 },
  { id: 'pointer-20', title: 'Ablations', level: 1 },
  { id: 'pointer-21', title: 'Statistics', level: 1 },
];

export default function MethodologyPage() {
  return (
    <div className="relative bg-zinc-50 min-h-screen pb-32">
      {/* Hero */}
      <section className="pt-40 pb-16 px-4 bg-zinc-900 text-white selection:bg-indigo-500/30 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
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

      <div className="max-w-7xl mx-auto px-4 mt-12 flex flex-col xl:flex-row gap-12 relative">
        {/* Sticky Sidebar */}
        <aside className="xl:w-64 shrink-0">
          <div className="xl:sticky xl:top-28">
            <TableOfContents sections={sections} />
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0 pb-32">
          <Phase1 />
          <Phase2 />
          <Phase3 />
          <Phase45 />
          <Phase6 />
          <Phase7 />
        </div>
      </div>
    </div>
  );
}
