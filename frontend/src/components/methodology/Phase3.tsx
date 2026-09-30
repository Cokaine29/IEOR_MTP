'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CloudLightning, Clock, Truck, Layers, AlertTriangle } from 'lucide-react';

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Phase3() {
  return (
    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="space-y-12 mt-12">
      <div id="phase-3" className="scroll-mt-28">
        <h2 className="text-3xl font-bold text-zinc-900 border-b-2 border-zinc-200 pb-2">Phase 3: Stochasticity Model</h2>
      </div>
      
      {/* Pointer 9 */}
      <div id="pointer-9" className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl shrink-0">
            <CloudLightning className="w-6 h-6 text-zinc-900" />
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              Four Concurrent Disruptions
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Card 1 */}
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 flex gap-4 flex-col sm:flex-row">
                <div className="w-10 h-10 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col h-full w-full">
                  <h4 className="font-bold text-zinc-900 mb-1">Crane Cycle Variability</h4>
                  <p className="text-sm text-zinc-600 mb-3 flex-grow text-justify"><strong>Modeled via a Log-Normal distribution.</strong> Most lifts cluster near the 86s mean, but a heavy right-tail mathematically simulates occasional long delays.</p>
                  <div className="bg-white border border-zinc-200 p-3 rounded-lg mb-4 shadow-sm text-xs text-zinc-600 text-justify">
                    <span className="font-bold text-indigo-600">e.g.</span> A jammed twistlock causes the crane operator to take 180s instead of the standard 128s.
                  </div>
                  <div className="flex gap-2 text-xs font-semibold text-zinc-500 mb-3">
                    <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-700">Intensity (σ)=0: 0s</span>
                    <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-700">Intensity (σ)=3: 30s noise</span>
                  </div>
                  <div className="mt-auto pt-2 border-t border-zinc-200/60">
                    <p className="text-[11px] text-zinc-500 font-medium italic">Source: CHEC Spec 2025 + Ding et al. 2023 (real ACT4 operational data)</p>
                  </div>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 flex gap-4 flex-col sm:flex-row">
                <div className="w-10 h-10 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col h-full w-full">
                  <h4 className="font-bold text-zinc-900 mb-1">ARMG Service Variability</h4>
                  <p className="text-sm text-zinc-600 mb-3 flex-grow text-justify"><strong>Modeled via a Normal(µ=60s, σ=10s) distribution.</strong> The σ=10s is physically caused by the TMEIC MAXVIEW micro motion system making ±200mm lateral and ±5° rotation corrections on every lift.</p>
                  <div className="bg-white border border-zinc-200 p-3 rounded-lg mb-4 shadow-sm text-xs text-zinc-600 text-justify">
                    <span className="font-bold text-indigo-600">e.g.</span> A misaligned container forces the ARMG to take 80s instead of 60s to latch properly.
                  </div>
                  <div className="flex gap-2 text-xs font-semibold text-zinc-500 mb-3">
                    <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-700">Intensity (σ)=0: 60s</span>
                    <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-700">Intensity (σ)=3: ±30s noise</span>
                  </div>
                  <div className="mt-auto pt-2 border-t border-zinc-200/60">
                    <p className="text-[11px] text-zinc-500 font-medium italic">Source: Wu Zhao-yang 2016</p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 flex gap-4 flex-col sm:flex-row">
                <div className="w-10 h-10 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex flex-col h-full w-full">
                  <h4 className="font-bold text-zinc-900 mb-1">Stowage Imbalance</h4>
                  <p className="text-sm text-zinc-600 mb-3 flex-grow text-justify"><strong>Modeled via an asymmetric Multinomial distribution.</strong> Tasks distributed across 26 QCs. Total per episode depends on vessels docked (dynamic) to mathematically skew the vessel belly workload.</p>
                  <div className="bg-white border border-zinc-200 p-3 rounded-lg mb-4 shadow-sm text-xs text-zinc-600 text-justify">
                    <span className="font-bold text-indigo-600">e.g.</span> The ship's cargo is skewed, forcing QC1 to process 500 containers while QC26 only processes 220.
                  </div>
                  <div className="flex gap-2 text-xs font-semibold text-zinc-500 mb-3">
                    <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-700">Intensity (σ)=0: Evenly distributed</span>
                    <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-700">Intensity (σ)=3: ±40% Skew</span>
                  </div>
                  <div className="mt-auto pt-2 border-t border-zinc-200/60">
                    <p className="text-[11px] text-zinc-500 font-medium italic">Source: Bierwirth & Meisel (2010)</p>
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 flex gap-4 flex-col sm:flex-row">
                <div className="w-10 h-10 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex flex-col h-full w-full">
                  <h4 className="font-bold text-zinc-900 mb-1">ARMG Breakdowns</h4>
                  <p className="text-sm text-zinc-600 mb-3 flex-grow text-justify"><strong>Modeled via an Exponential distribution.</strong> Defines the time-between-failures for 1 ARMG going offline, forcing a rescue push (20 to 30 min out of service).</p>
                  <div className="bg-white border border-zinc-200 p-3 rounded-lg mb-4 shadow-sm text-xs text-zinc-600 text-justify">
                    <span className="font-bold text-indigo-600">e.g.</span> An ARMG breaks down and is pushed to the maintenance zone by its partner at 5% speed.
                  </div>
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border border-zinc-200 bg-white mb-4 mt-2">
                     <Image src="/papers/armg_maintenance.png" fill className="object-contain" alt="ARMG Maintenance Zone" />
                  </div>

                  <div className="flex gap-2 text-xs font-semibold text-zinc-500 mb-3">
                    <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-700">Intensity (σ)=0: 0% Fail</span>
                    <span className="bg-zinc-200 px-2 py-1 rounded text-zinc-700">Intensity (σ)=3: High Fail Rate</span>
                  </div>
                  <div className="mt-auto pt-2 border-t border-zinc-200/60">
                    <p className="text-[11px] text-zinc-500 font-medium italic">Source: Xie Xi-cong 2016</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-100 p-6 rounded-2xl border border-zinc-300 mb-12">
              <h4 className="font-bold text-zinc-900 mb-3">The Evaluation X-Axis (Stress-Testing the AI)</h4>
              <p className="text-sm text-zinc-700 leading-relaxed mb-6 text-justify">
                To prove that the RL agent is genuinely robust, we cannot test it on a single difficulty level. <strong>Why? Because classical algorithms (like mathematical solvers or greedy heuristics) often perform flawlessly in perfect, deterministic environments, but their performance collapses non-linearly the moment real-world chaos is introduced.</strong> If we only tested at a single difficulty, we couldn't prove exactly <em>when</em> RL becomes necessary.
              </p>
              <p className="text-sm text-zinc-700 leading-relaxed mb-6 text-justify">
                By mathematically binding all four disruptions to a single scalar intensity multiplier (<strong>σ</strong>), we create a gradient from 0 (Perfect conditions) to 3 (Extreme chaos). In our final evaluation, this scale acts as the X-Axis on our performance graphs, allowing us to map the exact "crossing point" where classical baselines break down and the RL agent's dynamic adaptability takes the lead.
              </p>
              <div className="relative max-w-2xl mx-auto px-4">
                <div className="absolute top-1/2 left-4 right-4 h-1 bg-zinc-300 -translate-y-1/2"></div>
                <div className="relative flex justify-between">
                  <div className="bg-white border-2 border-zinc-400 w-12 h-12 rounded-full flex items-center justify-center font-bold text-zinc-700 shadow-sm z-10">0</div>
                  <div className="bg-white border-2 border-zinc-400 w-12 h-12 rounded-full flex items-center justify-center font-bold text-zinc-700 shadow-sm z-10">1</div>
                  <div className="bg-white border-2 border-zinc-400 w-12 h-12 rounded-full flex items-center justify-center font-bold text-zinc-700 shadow-sm z-10">2</div>
                  <div className="bg-indigo-600 border-2 border-indigo-700 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-md z-10">3</div>
                </div>
                <div className="flex justify-between mt-3 text-xs font-bold text-zinc-600 text-center">
                  <span className="w-16">Deterministic</span>
                  <span className="w-16">Low</span>
                  <span className="w-16">Medium</span>
                  <span className="w-16 text-indigo-700">Extreme Chaos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
