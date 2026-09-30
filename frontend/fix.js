
const fs = require('fs');
let text = fs.readFileSync('src/app/background/page.tsx', 'utf8');

// Fix text-justify
text = text.replace(/text-zinc-800 leading-relaxed space-y-4/g, 'text-zinc-800 leading-relaxed space-y-4 text-justify');
text = text.replace(/text-zinc-800 leading-relaxed space-y-6/g, 'text-zinc-800 leading-relaxed space-y-6 text-justify');

// Fix the mangled characters
text = text.replace(/20.*?40 feet/g, '20-40 feet');
text = text.replace(/38.*?50%/g, '38-50%');
text = text.replace(/1950s.*?1980s/g, '1950s-1980s');
text = text.replace(/1980s.*?1990s/g, '1980s-1990s');
text = text.replace(/1990s.*?2000s/g, '1990s-2000s');
text = text.replace(/2010s.*?Present/g, '2010s-Present');
text = text.replace(/1993.*?2012/g, '1993-2012');
text = text.replace(/677.*?709/g, '677-709');
text = text.replace(/50,000.*?100,000/g, '50,000-100,000');
text = text.replace(/20.*?48/g, '20-48');
text = text.replace(/Industry 4.0.*?the fourth/g, 'Industry 4.0 — the fourth');
text = text.replace(/real-time conditions.*?hence/g, 'real-time conditions — hence');
text = text.replace(/equipment.*?quay cranes/g, 'equipment — quay cranes');
text = text.replace(/yard cranes.*?/g, 'yard cranes —');
text = text.replace(/Transport Area.*?the critical/g, 'Transport Area — the critical');
text = text.replace(/16.81 hours.*?a benchmark/g, '16.81 hours — a benchmark');
text = text.replace(/simple rules.*?first-come/g, 'simple rules — first-come');
text = text.replace(/real-time traffic.*?not shortest/g, 'real-time traffic — not shortest');

fs.writeFileSync('src/app/background/page.tsx', text, 'utf8');

