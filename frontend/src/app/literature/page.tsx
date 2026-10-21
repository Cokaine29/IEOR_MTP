'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { BookOpen, ArrowUpRight, Target, Zap, Lightbulb, FileText } from 'lucide-react';
import StudyTables from '@/components/literature/StudyTables';
import { GROUPS, PAPERS, type Paper } from '@/components/literature/papers';

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5 },
};

// - NOTES MODAL -

function NotesModal({ paper, onClose }: { paper: Paper; onClose: () => void }) {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(paper.notes);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paper.notes) return;
    fetch(`/literature/${paper.id}/notes.md`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load notes (${res.status})`);
        return res.text();
      })
      .then(text => {
        // Our notes start with a metadata block between two '---' lines. The card already shows it, so it is cut off here.
        const match = text.match(/^---\r?\n[\s\S]*?\r?\n---\r?(?:\n|$)/);
        setMarkdown(match ? text.slice(match[0].length) : text);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [paper.notes, paper.id]);

  const imageBase = `/literature/${paper.id}/`;

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/20 backdrop-blur-sm overflow-y-auto p-4 sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full max-w-4xl bg-white border border-zinc-200 rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.12)] my-8 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-zinc-200 px-6 sm:px-8 py-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full border border-teal-200 bg-teal-50 text-teal-800">{paper.approach}</span>
              <span className="text-zinc-700 font-mono text-xs ml-2 font-medium">{paper.year}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 leading-snug tracking-tight">{paper.title}</h2>
            <p className="text-sm text-zinc-700 mt-2 font-medium">{paper.authors} · {paper.venue}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 border border-zinc-200 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 sm:px-8 py-8 bg-white">
          {loading && (
            <div className="flex items-center justify-center py-20 text-zinc-700 font-medium">
              <svg className="w-6 h-6 animate-spin mr-3 text-zinc-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Loading notes...
            </div>
          )}

          {error && (
            <div className="text-rose-600 bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm font-medium">{error}</div>
          )}

          {!paper.notes && (
            <div className="text-center py-16">
              <p className="text-zinc-700 font-medium">We have not read this paper in full yet, so there are no notes.</p>
            </div>
          )}

          {markdown && (
            <article className="prose prose-zinc prose-sm sm:prose-base max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-img:rounded-2xl prose-img:border prose-img:border-zinc-200 prose-img:shadow-sm
              prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-zinc-800 prose-code:font-medium
              prose-pre:bg-zinc-100 prose-pre:border prose-pre:border-zinc-200 prose-pre:text-zinc-800
              prose-blockquote:border-zinc-300 prose-blockquote:bg-zinc-100 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl
              prose-a:text-blue-600 hover:prose-a:text-blue-700
            ">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  img: ({ src, alt, ...props }) => {
                    let resolvedSrc = (src as string) || '';
                    if (resolvedSrc && !resolvedSrc.startsWith('/') && !resolvedSrc.startsWith('http')) {
                      resolvedSrc = imageBase + resolvedSrc;
                    }
                    return (
                      <span className="flex flex-col items-center my-8">
                        <img src={resolvedSrc} alt={alt} className="max-w-full rounded-2xl border border-zinc-200 shadow-sm" {...props} />
                        {alt && <span className="block text-center text-sm text-zinc-700 mt-3 font-medium">{alt}</span>}
                      </span>
                    );
                  },
                }}
              >
                {markdown}
              </ReactMarkdown>
            </article>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
// - COMPONENT -

function PaperCard({ paper, onOpen }: { paper: Paper; onOpen: () => void }) {
  const unread = paper.group === 'unread';
  const link = paper.url ?? (paper.doi ? `https://doi.org/${paper.doi}` : undefined);
  return (
    <motion.article {...fade} className={`flex flex-col gap-4 rounded-3xl border bg-white p-6 sm:p-7 ${unread ? 'border-dashed border-zinc-300' : 'border-zinc-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-teal-800">{paper.approach}</span>
        <span className="font-mono text-sm font-bold text-zinc-600">{paper.year}</span>
      </div>
      <div>
        <h3 className="text-lg font-bold leading-snug tracking-tight text-zinc-900">{paper.title}</h3>
        <p className="mt-1.5 text-sm text-zinc-600">{paper.authors} · <span className="italic">{paper.venue}</span></p>
      </div>
      <p className="text-sm leading-relaxed text-zinc-800">{paper.summary}</p>

      {(paper.trigger || paper.objective) && (
        <div className="grid gap-2 sm:grid-cols-2">
          {paper.trigger && (
            <div className="flex gap-2 rounded-xl bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-700">
              <Zap className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
              <span><b className="block text-zinc-900">Dispatch Starts When</b>{paper.trigger}</span>
            </div>
          )}
          {paper.objective && (
            <div className="flex gap-2 rounded-xl bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-700">
              <Target className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
              <span><b className="block text-zinc-900">Optimises</b>{paper.objective}</span>
            </div>
          )}
        </div>
      )}

      {paper.headline && (
        <div className="rounded-xl border-l-4 border-teal-500 bg-teal-50/60 px-4 py-3 text-sm leading-relaxed text-zinc-800">
          <b className="mb-0.5 block text-xs uppercase tracking-wide text-teal-800">Key Result</b>
          {paper.headline}
        </div>
      )}

      <div className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-relaxed text-amber-950">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <span><b className="block text-xs uppercase tracking-wide text-amber-800">In Our Thesis</b>{paper.role}</span>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-4">
        {paper.notes && (
          <button onClick={onOpen} className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700">
            <FileText className="h-3.5 w-3.5" /> Read Our Notes
          </button>
        )}
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50">
            The Paper <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </motion.article>
  );
}

export default function LiteraturePage() {
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const read = PAPERS.filter((p) => p.notes);
  const years = read.map((p) => p.year);
  const families = GROUPS.filter((g) => !['borrowed', 'review', 'unread'].includes(g.id)).length;

  return (
    <div className="min-h-screen bg-zinc-100 px-4 pb-16 pt-32 text-zinc-900 sm:px-6 lg:px-8">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />

      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mb-10 max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Literature</span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">What Others Have Tried</h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-700">
            Researchers have dispatched AGVs with simple rules, mathematical models, search methods and learning. Here are the
            papers we have read in full, what each one found, and how each one shapes our work.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mx-auto mb-12 grid max-w-3xl grid-cols-3 gap-3">
          {[
            { v: `${read.length}`, l: 'Papers read in full' },
            { v: `${Math.min(...years)} to ${Math.max(...years)}`, l: 'Years covered' },
            { v: `${families}`, l: 'Families of dispatching methods' },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-zinc-200 bg-white p-4 text-center">
              <span className="block text-2xl font-bold tabular-nums text-zinc-900">{s.v}</span>
              <span className="text-xs text-zinc-600">{s.l}</span>
            </div>
          ))}
        </motion.div>

        <nav className="mb-16 flex flex-wrap justify-center gap-2" aria-label="Paper groups">
          {GROUPS.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50">
              {g.title}
            </a>
          ))}
        </nav>

        {GROUPS.map((g, gi) => {
          const list = PAPERS.filter((p) => p.group === g.id).sort((a, b) => a.year - b.year);
          if (list.length === 0) return null;
          return (
            <section key={g.id} id={g.id} className="mb-20 scroll-mt-28">
              <motion.div {...fade} className="mb-8 flex max-w-3xl gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-sm font-bold text-white">{gi + 1}</span>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">{g.title}</h2>
                  <p className="mt-2 leading-relaxed text-zinc-700">{g.text}</p>
                </div>
              </motion.div>
              <div className="grid gap-6 lg:grid-cols-2">
                {list.map((p) => <PaperCard key={p.id} paper={p} onOpen={() => setSelectedPaper(p)} />)}
              </div>
            </section>
          );
        })}

        <StudyTables />

        <motion.div {...fade} className="mt-16 rounded-3xl bg-zinc-900 p-8 text-center md:p-12">
          <BookOpen className="mx-auto mb-4 h-7 w-7 text-teal-400" />
          <h3 className="mb-4 text-2xl font-bold tracking-tight text-white md:text-3xl">Where This Leaves Us</h3>
          <p className="mx-auto max-w-3xl leading-relaxed text-zinc-300 md:text-lg">
            Among the 11 dispatching studies we read, none tests a learned dispatcher across graded levels of randomness. The two
            that do grade randomness, Kim and Bae (2004) and Grunow et al. (2006), use rules and optimisation. Our experiments start
            from this point.
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedPaper && <NotesModal paper={selectedPaper} onClose={() => setSelectedPaper(null)} />}
      </AnimatePresence>
    </div>
  );
}
