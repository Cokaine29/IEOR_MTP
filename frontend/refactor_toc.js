const fs = require('fs');

const content = `'use client';

import { useState, useEffect } from 'react';

export interface TOCSection {
  id: string;
  title: string;
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
      <ul className="space-y-3 relative before:absolute before:inset-y-0 before:left-[7px] before:w-[2px] before:bg-zinc-100">
        {sections.map(({ id, title }) => {
          const isActive = activeId === id;
          return (
            <li key={id} className="relative z-10 flex items-center gap-3">
              <div className={\`w-4 h-4 rounded-full border-2 bg-white transition-colors duration-300 \${isActive ? 'border-indigo-600 border-4' : 'border-zinc-300'}\`} />
              <a
                href={\`#\${id}\`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={\`block text-sm font-medium transition-all duration-300 flex-1 \${
                  isActive
                    ? 'text-indigo-600 translate-x-1'
                    : 'text-zinc-500 hover:text-zinc-800 hover:translate-x-1'
                }\`}
              >
                {title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
`;
fs.writeFileSync('src/components/TableOfContents.tsx', content, 'utf8');

const bgPath = 'src/app/background/page.tsx';
let bgContent = fs.readFileSync(bgPath, 'utf8');
const oldImport = `import TableOfContents from '@/components/TableOfContents';`;
if (!bgContent.includes('const sections = [')) {
    const sectionsCode = `
const sections = [
  { id: 'point-1', title: '1. What is an AGV?' },
  { id: 'point-2', title: '2. The Operational Problem' },
  { id: 'point-3', title: '3. Scope of Automation' },
  { id: 'point-4', title: '4. The Global Impact' },
  { id: 'point-5', title: '5. Evolution of Control' },
  { id: 'point-6', title: '6. The 8 Core Challenges' },
  { id: 'point-7', title: '7. Cost of Inefficiency' },
  { id: 'point-8', title: '8. AGVs in ACTs' },
  { id: 'point-9', title: '9. 5 Eras of Dispatching' },
  { id: 'point-10', title: '10. Stochasticity Problem' },
  { id: 'point-11', title: '11. State of the Art Gap' },
];
`;
    bgContent = bgContent.replace(oldImport, oldImport + '\n' + sectionsCode);
    bgContent = bgContent.replace('<TableOfContents />', '<TableOfContents sections={sections} />');
    fs.writeFileSync(bgPath, bgContent, 'utf8');
}
console.log('done refactoring toc');
