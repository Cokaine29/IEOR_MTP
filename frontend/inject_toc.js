const fs = require('fs');

let page = fs.readFileSync('src/app/background/page.tsx', 'utf8');

// Add import
if (!page.includes("import TableOfContents")) {
  page = page.replace(
    "import { motion } from 'framer-motion';",
    "import { motion } from 'framer-motion';\nimport TableOfContents from '@/components/TableOfContents';"
  );
}

// Layout replacement
const targetLayout = '<section className="px-4">\n        <motion.div\n          variants={stagger}\n          initial="hidden"\n          animate="visible"\n          className="max-w-4xl mx-auto space-y-12"\n        >';
const targetLayoutWindows = '<section className="px-4">\r\n        <motion.div\r\n          variants={stagger}\r\n          initial="hidden"\r\n          animate="visible"\r\n          className="max-w-4xl mx-auto space-y-12"\r\n        >';

const newLayout = `<section className="px-4 max-w-[90rem] mx-auto flex flex-col lg:flex-row gap-8 lg:items-start">
        {/* Sticky Sidebar */}
        <div className="hidden lg:block w-72 shrink-0 sticky top-24 z-10">
          <TableOfContents />
        </div>

        {/* Points Content */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex-1 max-w-5xl space-y-12 min-w-0"
        >`;

if (page.includes(targetLayout)) {
    page = page.replace(targetLayout, newLayout);
} else if (page.includes(targetLayoutWindows)) {
    page = page.replace(targetLayoutWindows, newLayout);
} else {
    console.log("Could not find the main content layout block. Regex approach next:");
    page = page.replace(
        /<section className="px-4">\s*<motion\.div\s*variants=\{stagger\}\s*initial="hidden"\s*animate="visible"\s*className="max-w-4xl mx-auto space-y-12"\s*>/g,
        newLayout
    );
}

// Inject IDs and scroll-mt-32
for (let i = 1; i <= 11; i++) {
  // Use regex to catch varying whitespace and existing classes
  const regex = new RegExp(`{\\/\\* Point ${i} \\*\\/}\\s*<div className="`, "g");
  page = page.replace(regex, `{/* Point ${i} */}\n          <div id="point-${i}" className="scroll-mt-28 `);
}

fs.writeFileSync('src/app/background/page.tsx', page, 'utf8');
console.log('Added Table of Contents successfully.');
