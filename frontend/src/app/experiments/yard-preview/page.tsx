import type { Metadata } from 'next';
import YardPreview from '@/components/experiments/YardPreview';

export const metadata: Metadata = { title: 'Wider yard preview - AGV Dispatching MTP', robots: { index: false } };

export default function YardPreviewPage() {
  return <YardPreview />;
}
