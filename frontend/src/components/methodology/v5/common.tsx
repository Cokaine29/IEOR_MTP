'use client';

/* Shared pieces for the Methodology tab (model v5, rebuilt 21 Oct 2026). */
export const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
};

export function SectionHead({ id, kicker, title, children }: { id: string; kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <div id={id} className="mb-8 flex max-w-3xl scroll-mt-28 flex-col gap-3">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">{kicker}</span>
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900">{title}</h2>
      {children && <div className="text-base leading-relaxed text-zinc-700">{children}</div>}
    </div>
  );
}

export function Source({ children }: { children: React.ReactNode }) {
  return <p className="border-t border-zinc-200 pt-3 text-xs italic leading-relaxed text-zinc-500">{children}</p>;
}

export function Badge({ status }: { status: 'Done' | 'Phase II' }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status === 'Done' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'}`}>{status}</span>
  );
}
