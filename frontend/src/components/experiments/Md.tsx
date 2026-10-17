'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

/** Short text with inline maths ($...$), display maths ($$...$$) and *italics*, rendered without extra paragraph spacing. */
export default function Md({ children, className = '' }: { children: string; className?: string }) {
  // remark-math renders $$...$$ as display maths only when the delimiters stand on their own lines
  const src = children.replace(/\$\$([\s\S]+?)\$\$/g, (_, body) => `\n\n$$\n${body.trim()}\n$$\n\n`);
  return (
    <div className={`[&_p]:m-0 [&_p+p]:mt-2 [&_.katex-display]:my-2 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{src}</ReactMarkdown>
    </div>
  );
}
