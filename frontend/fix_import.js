const fs = require('fs');

let page = fs.readFileSync('src/app/background/page.tsx', 'utf8');

page = page.replace("} , Target } from 'lucide-react';", ", Target } from 'lucide-react';");

fs.writeFileSync('src/app/background/page.tsx', page, 'utf8');
console.log('Fixed import');
