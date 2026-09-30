const fs = require('fs');
let content = fs.readFileSync('src/app/problem/page.tsx', 'utf8');

content = content.replace(/<p className="([^"]*)"/g, (match, classes) => {
  if (!classes.includes('text-justify') && 
      (classes.includes('text-zinc-600') || 
       classes.includes('text-zinc-700') || 
       classes.includes('text-zinc-800') || 
       classes.includes('text-zinc-900') ||
       classes.includes('text-zinc-500'))) {
    
    // We probably don't want to justify small captions or italic text blindly, 
    // but paragraphs inside cards are fine. 
    return `<p className="${classes} text-justify"`;
  }
  return match;
});

// Let's also check for any <div> that contains paragraph-like text and add text-justify if it is not a flex container
content = content.replace(/<div className="([^"]*text-zinc-800 leading-relaxed[^"]*)"/g, (match, classes) => {
    if (!classes.includes('text-justify')) {
        return `<div className="${classes} text-justify"`;
    }
    return match;
});

fs.writeFileSync('src/app/problem/page.tsx', content, 'utf8');
console.log('Added text-justify to problem tab');
