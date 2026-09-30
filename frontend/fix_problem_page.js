const fs = require('fs');

let content = fs.readFileSync('src/app/problem/page.tsx', 'utf8');

// Replace em-dashes
content = content.replace(/ — /g, ', ');

// Fix up the grammar where comma doesn't fit well
content = content.replace(/At this exact moment, when a Quay Crane finishes lifting a container and is ready to hand it off, the dispatcher must decide:/g, 'At this exact moment, when a Quay Crane finishes lifting a container and is ready to hand it off, the dispatcher must decide:');
content = content.replace(/Every minute a crane sits idle, container in the air, waiting for an AGV, is revenue lost/g, 'Every minute a crane sits idle (container in the air, waiting for an AGV) is revenue lost');
content = content.replace(/exceed 1 minute per dispatching decision, far too slow/g, 'exceed 1 minute per dispatching decision, which is far too slow');
content = content.replace(/Methodology, Phase 2, Pointer 6/g, 'Methodology, Phase 2, Pointer 6');
content = content.replace(/Wait, do we need /g, 'Wait, do we need ');
// For Layer 3
content = content.replace(/real-world delays, vessel arrival noise, and crane breakdowns/g, 'real-world delays, vessel arrival noise, and crane breakdowns');
content = content.replace(/Offline planning breaks instantly, real-time adaptation is mandatory/g, 'Offline planning breaks instantly, so real-time adaptation is mandatory');

// Ensure all <p> and list items have text-justify
content = content.replace(/<p className="([^"]*)"/g, (match, classes) => {
  if (!classes.includes('text-justify')) {
    return `<p className="${classes} text-justify"`;
  }
  return match;
});

// For list items
content = content.replace(/<li([^\>]*)>([^<]*)<\/li>/g, (match, attrs, text) => {
    // skip if there is no text or there is child tags inside the text block directly, or if it already has text-justify 
    // actually, easiest is to just find specific un-justified texts. Wait, list items are usually short. 
    return match;
});

fs.writeFileSync('src/app/problem/page.tsx', content, 'utf8');
console.log('Fixed hyphens and added justify');
