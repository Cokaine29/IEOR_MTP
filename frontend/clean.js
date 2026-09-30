const fs = require('fs');

let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
layout = layout.replace(/AGV Dispatching.*?MTP/g, 'AGV Dispatching - MTP');
fs.writeFileSync('src/app/layout.tsx', layout, 'utf8');

let progress = fs.readFileSync('src/app/progress/page.tsx', 'utf8');
progress = progress.replace(/icon:\s*\"[^\"]*\"/g, 'icon: "O"');
fs.writeFileSync('src/app/progress/page.tsx', progress, 'utf8');

let lit = fs.readFileSync('src/app/literature/page.tsx', 'utf8');
lit = lit.replace(/Ã[^a-zA-Z0-9\s]*adding/g, '- adding');
lit = lit.replace(/Ã[^a-zA-Z0-9\s]*/g, '-');
fs.writeFileSync('src/app/literature/page.tsx', lit, 'utf8');

let bg = fs.readFileSync('src/app/background/page.tsx', 'utf8');
bg = bg.replace(/4\.0.*?the/g, '4.0 - the');
bg = bg.replace(/conditions.*?hence/g, 'conditions - hence');
fs.writeFileSync('src/app/background/page.tsx', bg, 'utf8');
