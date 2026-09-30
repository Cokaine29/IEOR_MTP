const fs = require('fs');
let text = fs.readFileSync('src/app/background/page.tsx', 'utf8');

const target = `<section className="px-4">
        <div className="max-w-4xl mx-auto space-y-12">`;
const targetWindows = `<section className="px-4">\r\n        <div className="max-w-4xl mx-auto space-y-12">`;

const replacement = `<section className="px-4 max-w-[90rem] mx-auto flex flex-col xl:flex-row gap-8 xl:items-start">
        {/* Sticky Sidebar */}
        <div className="hidden xl:block w-72 shrink-0 sticky top-24 z-10 self-start">
          <TableOfContents />
        </div>

        {/* Points Content */}
        <div className="flex-1 max-w-5xl mx-auto space-y-12 min-w-0">`;

if (text.includes(target)) {
  text = text.replace(target, replacement);
  fs.writeFileSync('src/app/background/page.tsx', text);
  console.log('Replaced layout (Unix)');
} else if (text.includes(targetWindows)) {
  text = text.replace(targetWindows, replacement);
  fs.writeFileSync('src/app/background/page.tsx', text);
  console.log('Replaced layout (Windows)');
} else {
  // try regex
  const regex = /<section className="px-4">\s*<div className="max-w-4xl mx-auto space-y-12">/g;
  if(regex.test(text)){
    text = text.replace(regex, replacement);
    fs.writeFileSync('src/app/background/page.tsx', text);
    console.log('Replaced layout (Regex)');
  } else {
    console.log('Target string not found at all');
  }
}
