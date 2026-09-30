const fs = require('fs');
let text = fs.readFileSync('src/app/problem/page.tsx', 'utf8');
text = text.replace("ease: 'easeOut' }", "ease: 'easeOut' as const }");
text = text.replace('ease: "easeOut" }', 'ease: "easeOut" as const }');
fs.writeFileSync('src/app/problem/page.tsx', text, 'utf8');
console.log('Fixed easeOut TS error.');
