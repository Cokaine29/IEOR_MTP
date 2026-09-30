const fs = require('fs');

// Fix Progress page
let progress = fs.readFileSync('src/app/progress/page.tsx', 'utf8');
progress = progress.replace(/icon: "O"[^,]*,/g, 'icon: "O",');
fs.writeFileSync('src/app/progress/page.tsx', progress, 'utf8');

// Fix Background page missing </strong>
let bg = fs.readFileSync('src/app/background/page.tsx', 'utf8');
bg = bg.replace(/Industry 4.0 - the fourth/g, 'Industry 4.0</strong> - the fourth');
fs.writeFileSync('src/app/background/page.tsx', bg, 'utf8');

// Fix Literature page broken div
let lit = fs.readFileSync('src/app/literature/page.tsx', 'utf8');
lit = lit.replace(/-div>/g, '</div>');
lit = lit.replace(/-adding/g, '- adding');
fs.writeFileSync('src/app/literature/page.tsx', lit, 'utf8');

console.log('Fixed syntax issues manually.');
