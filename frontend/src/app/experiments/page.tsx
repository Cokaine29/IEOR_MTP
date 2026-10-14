import type { Metadata } from 'next';
import ExperimentsView from '@/components/experiments/ExperimentsView';

export const metadata: Metadata = {
  title: 'Experiments - AGV Dispatching MTP',
  description: 'Traditional dispatching baselines under stochastic quay crane times: results, charts and how to reproduce them.',
};

export default function ExperimentsPage() {
  return <ExperimentsView />;
}
