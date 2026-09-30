'use client';

import { useState, useEffect } from 'react';

export interface TOCSection {
  id: string;
  title: string;
  level?: number;
}

interface TableOfContentsProps {
  sections: TOCSection[];
}

export default function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200">
      <h3 className="font-bold text-zinc-900 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        Contents
      </h3>
      <div className="max-h-[calc(100vh-14rem)] overflow-y-auto pr-4 -mr-4 custom-scrollbar">
        <ul className="space-y-3 relative before:absolute before:inset-y-0 before:left-[7px] before:w-[2px] before:bg-zinc-100">
          {sections.map(({ id, title, level }) => {
          const isActive = activeId === id;
          if (level === 0) {
            return (
              <li key={id} className="relative z-10 flex items-center gap-3 mt-4 mb-2 first:mt-0">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                <span className="block text-xs font-bold uppercase tracking-wider text-zinc-900">
                  {title}
                </span>
              </li>
            );
          }
          return (
            <li key={id} className={`relative z-10 flex items-center gap-3 ${level === 1 ? 'ml-4' : ''}`}>
              <div className={`w-4 h-4 rounded-full border-2 bg-white transition-colors duration-300 ${isActive ? 'border-indigo-600 border-4' : 'border-zinc-300'}`} />
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`block text-sm font-medium transition-all duration-300 flex-1 ${
                  isActive
                    ? 'text-indigo-600 translate-x-1'
                    : 'text-zinc-500 hover:text-zinc-800 hover:translate-x-1'
                }`}
              >
                {title}
              </a>
            </li>
          );
        })}
        </ul>
      </div>
    </nav>
  );
}
