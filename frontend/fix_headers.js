const fs = require('fs');
['Phase1.tsx', 'Phase2.tsx', 'Phase3.tsx', 'Phase45.tsx', 'Phase6.tsx', 'Phase7.tsx'].forEach(file => {
  const p = 'src/components/methodology/' + file;
  let content = fs.readFileSync(p, 'utf8');
  
  content = content.replace(/(<h[234][^>]*>)\s*(?:\d+(?:,\s*\d+)*\s*(?:&\s*\d+)?\.)\s*(.*?)(<\/h[234]>)/g, '$1$2$3');
  
  fs.writeFileSync(p, content, 'utf8');
});
console.log('Fixed headers in components');
