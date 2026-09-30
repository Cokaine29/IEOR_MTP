const fs = require('fs');

let p1 = fs.readFileSync('src/components/methodology/Phase1.tsx', 'utf8');
p1 = p1.replace('<div id="pointer-2"', '<div id="pointer-2" className="relative"><div id="pointer-3" className="absolute top-1/2" /></div>\n<div className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200"');
fs.writeFileSync('src/components/methodology/Phase1.tsx', p1, 'utf8');

let p2 = fs.readFileSync('src/components/methodology/Phase2.tsx', 'utf8');
p2 = p2.replace('<div id="pointer-6"', '<div id="pointer-6" className="relative"><div id="pointer-7" className="absolute top-1/3" /><div id="pointer-8" className="absolute top-2/3" /></div>\n<div className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200"');
fs.writeFileSync('src/components/methodology/Phase2.tsx', p2, 'utf8');

let p45 = fs.readFileSync('src/components/methodology/Phase45.tsx', 'utf8');
p45 = p45.replace('<div id="pointer-11"', '<div id="pointer-11" className="relative"><div id="pointer-12" className="absolute top-1/2" /></div>\n<div className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200"');
fs.writeFileSync('src/components/methodology/Phase45.tsx', p45, 'utf8');

let p6 = fs.readFileSync('src/components/methodology/Phase6.tsx', 'utf8');
p6 = p6.replace('<div id="pointer-13"', '<div id="pointer-13" className="relative"><div id="pointer-14" className="absolute top-1/3" /><div id="pointer-16" className="absolute top-2/3" /></div>\n<div className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200"');
fs.writeFileSync('src/components/methodology/Phase6.tsx', p6, 'utf8');

let p7 = fs.readFileSync('src/components/methodology/Phase7.tsx', 'utf8');
p7 = p7.replace('<div id="pointer-18"', '<div id="pointer-18" className="relative"><div id="pointer-19" className="absolute top-1/2" /></div>\n<div className="scroll-mt-28 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200"');
fs.writeFileSync('src/components/methodology/Phase7.tsx', p7, 'utf8');

console.log('Fixed missing IDs');
