const fs = require('fs');
let content = fs.readFileSync('src/app/background/page.tsx', 'utf8');

// The specific tags inside the Eras
content = content.replace(/<p><strong /g, '<p className="text-justify"><strong ');

fs.writeFileSync('src/app/background/page.tsx', content, 'utf8');
console.log('Fixed justify');
