const fs = require('fs');
let text = fs.readFileSync('src/app/background/page.tsx', 'utf8');
text = text.replaceAll('<table className="w-full text-sm text-left">', '<table className="w-full min-w-[900px] text-sm text-left">');
fs.writeFileSync('src/app/background/page.tsx', text, 'utf8');
console.log('Fixed table widths');
