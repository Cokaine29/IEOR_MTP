'use client';

import Overview from '@/components/methodology/v5/Overview';
import SimulatorSection from '@/components/methodology/v5/SimulatorSection';
import SettingSection from '@/components/methodology/v5/SettingSection';
import MethodsSection from '@/components/methodology/v5/MethodsSection';
import RandomnessSection from '@/components/methodology/v5/RandomnessSection';
import FairnessSection from '@/components/methodology/v5/FairnessSection';
import PhaseTwoSection from '@/components/methodology/v5/PhaseTwoSection';

/* Methodology tab, rebuilt on model v5 (21 Oct 2026). The real Yangshan data of the earlier Phase1 and Phase3
   components now lives in v5/YangshanReference.tsx. The old Phase1 to Phase7 files are kept, unused, for reference. */
export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 [&_p:not(.italic)]:text-justify [&_p]:hyphens-auto">
      <Overview />
      <SimulatorSection />
      <SettingSection />
      <MethodsSection />
      <RandomnessSection />
      <FairnessSection />
      <PhaseTwoSection />
    </div>
  );
}
