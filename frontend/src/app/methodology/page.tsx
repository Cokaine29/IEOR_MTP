'use client';

import Overview from '@/components/methodology/v5/Overview';
import SimulatorSection from '@/components/methodology/v5/SimulatorSection';
import SettingSection from '@/components/methodology/v5/SettingSection';
import MethodsSection from '@/components/methodology/v5/MethodsSection';
import RandomnessSection from '@/components/methodology/v5/RandomnessSection';
import FairnessSection from '@/components/methodology/v5/FairnessSection';

/* Methodology tab, rebuilt on model v5 (21 Oct 2026). The earlier Phase1 to Phase7 components stay in
   components/methodology until their real Yangshan data has moved into the Phase II section. */
export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 [&_p:not(.italic)]:text-justify [&_p]:hyphens-auto">
      <Overview />
      <SimulatorSection />
      <SettingSection />
      <MethodsSection />
      <RandomnessSection />
      <FairnessSection />
    </div>
  );
}
