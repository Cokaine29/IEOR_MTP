const fs = require('fs');
let content = fs.readFileSync('src/components/TableOfContents.tsx', 'utf8');

content = content.replace(
  'export interface TOCSection {\n  id: string;\n  title: string;\n}',
  'export interface TOCSection {\n  id: string;\n  title: string;\n  level?: number;\n}'
);

content = content.replace(
  '{sections.map(({ id, title }) => {',
  '{sections.map(({ id, title, level }) => {'
);

content = content.replace(
  '<li key={id} className="relative z-10 flex items-center gap-3">',
  '<li key={id} className={`relative z-10 flex items-center gap-3 ${level === 1 ? \'ml-4\' : \'\'}`}>'
);

content = content.replace(
  'const isActive = activeId === id;',
  `const isActive = activeId === id;
          if (level === 0) {
            return (
              <li key={id} className="relative z-10 flex items-center gap-3 mt-4 mb-2 first:mt-0">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                <span className="block text-xs font-bold uppercase tracking-wider text-zinc-900">
                  {title}
                </span>
              </li>
            );
          }`
);

fs.writeFileSync('src/components/TableOfContents.tsx', content, 'utf8');
console.log('TOC updated');
