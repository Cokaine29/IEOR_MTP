const fs = require('fs');

let progress = fs.readFileSync('src/app/progress/page.tsx', 'utf8');
progress = progress.replace(/icon: "O"[^,]*,/g, 'icon: "O",');
fs.writeFileSync('src/app/progress/page.tsx', progress, 'utf8');

let bg = fs.readFileSync('src/app/background/page.tsx', 'utf8');
bg = bg.replace(/4.0.*?the/g, '4.0 - the');
bg = bg.replace(/<\/p>\r?\n\s*<ul/g, '</p>\n<ul');
// Check line 102 error: Error: Expected '</', got 'jsx text'
// In background/page.tsx, around line 102
bg = bg.replace(/the fourth industrial revolution, characterized by the convergence of:\r?\n\s*<\/p>\r?\n\s*<\/p>/g, 'the fourth industrial revolution, characterized by the convergence of:</p>');
fs.writeFileSync('src/app/background/page.tsx', bg, 'utf8');

let lit = fs.readFileSync('src/app/literature/page.tsx', 'utf8');
// Fix <div className="text-zinc-300 text-3xl mb-4">-div>
lit = lit.replace(/-div>/g, '</div>');
// Fix any broken quotes or JSX 
lit = lit.replace(/Ã[^\w\s]* adding/g, '- adding');
lit = lit.replace(/stochastic AGV dispatching<\/strong> - the/g, 'stochastic AGV dispatching</strong> - the');
fs.writeFileSync('src/app/literature/page.tsx', lit, 'utf8');
