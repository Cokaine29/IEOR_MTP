const fs = require('fs');

const files = [
  'src/components/methodology/Phase1.tsx',
  'src/components/methodology/Phase2.tsx',
  'src/components/methodology/Phase45.tsx',
  'src/components/methodology/Phase6.tsx',
  'src/components/methodology/Phase7.tsx',
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  // Find all instances of: className="..." className="..."
  // and remove the second one.
  const regex = /(<div[^>]*className="[^"]*")[ \n\r\t]*className="[^"]*"/g;
  content = content.replace(regex, '$1');
  fs.writeFileSync(file, content, 'utf8');
}
console.log('Fixed duplicate classNames');
