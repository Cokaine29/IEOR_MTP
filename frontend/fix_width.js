const fs = require('fs');
let file = 'src/app/background/page.tsx';
let text = fs.readFileSync(file, 'utf8');
text = text.replace(/className="w-full"/g, 'className="w-full min-w-0"');
fs.writeFileSync(file, text, 'utf8');
console.log('Fixed w-full to min-w-0');
