const fs = require('fs');
let content = fs.readFileSync('src/app/background/page.tsx', 'utf8');

// The section is in Phase 9 or "9. The Evolution of Dispatching"
// To fix it, we can globally add text-justify to all <p> with text-zinc-700/800/900
content = content.replace(/<p className="([^"]*)"/g, (match, classes) => {
  if (!classes.includes('text-justify') && classes.includes('text-zinc-')) {
    return `<p className="${classes} text-justify"`;
  }
  return match;
});

// There might be some <div> containing text that are not paragraphs.
// The user explicitly mentions "How do you assign N tasks..." and "Methods: First-Come-First-Serve..."
// Let's also check for specific blocks that use <div> or <li>
content = content.replace(/<div className="([^"]*text-zinc-700[^"]*)"/g, (match, classes) => {
    // Only add text-justify if it looks like a text block (e.g. leading-relaxed) and not a flex container
    if (!classes.includes('text-justify') && classes.includes('leading-relaxed') && !classes.includes('flex')) {
        return `<div className="${classes} text-justify"`;
    }
    return match;
});

// Since the user pointed to text like "Methods: First-Come-First-Serve..." let's just make sure everything in that section is justified
fs.writeFileSync('src/app/background/page.tsx', content, 'utf8');
console.log('Fixed justify on background page');
