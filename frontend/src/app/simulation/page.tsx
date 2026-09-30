'use client';
import { motion } from 'framer-motion';

export default function SimulationPage() {
  return (
    <div className="min-h-screen flex flex-col pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-zinc-50 text-center items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <div className="w-20 h-20 mx-auto bg-zinc-100 border border-zinc-200 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
          <svg className="w-10 h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-zinc-900 mb-4 tracking-tight">Simulation Playground</h1>
        <p className="text-zinc-500 text-lg font-medium leading-relaxed">
          This module is being reset. The full 2D Digital Twin terminal simulation with real-time physics will be built out here from scratch.
        </p>
      </motion.div>
    </div>
  );
}
