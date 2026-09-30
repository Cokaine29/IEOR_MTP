'use client';
import { motion } from 'framer-motion';

export default function ProgressPage() {
  return (
    <div className="min-h-screen flex flex-col pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-zinc-50 text-center items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <div className="w-20 h-20 mx-auto bg-zinc-100 border border-zinc-200 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
          <svg className="w-10 h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-zinc-900 mb-4 tracking-tight">Progress Tracker</h1>
        <p className="text-zinc-500 text-lg font-medium leading-relaxed">
          This section is currently being reset. The methodology timeline and project phase tracking will be built out systematically from scratch.
        </p>
      </motion.div>
    </div>
  );
}
