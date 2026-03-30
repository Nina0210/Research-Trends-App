import { Suspense } from 'react';
import Header from '@/components/common/Header';
import PapersList from '@/components/papers/PapersList';
import TopicSelector from '@/components/papers/TopicSelector';
import { fetchArxivTrending } from '@/lib/services/arxivService';
import type { Paper } from '@/lib/types';

interface HomeProps {
  searchParams: Promise<{ topic?: string }>;
}

async function PapersSection({ topic }: { topic: string }) {
  let papers: Paper[] = [];
  let error: string | null = null;

  try {
    papers = await fetchArxivTrending(topic, 10);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load papers';
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (papers.length === 0) {
    return <p className="text-sm text-gray-600">No trending papers found.</p>;
  }

  return <PapersList papers={papers} />;
}

export default async function Home({ searchParams }: HomeProps) {
  const { topic = 'cs.AI' } = await searchParams;

  const topicLabel: Record<string, string> = {
    'cs.AI': 'Artificial Intelligence',
    'cs.LG': 'Machine Learning',
    'cs.CL': 'Natural Language Processing',
    'cs.CV': 'Computer Vision',
    'cs.RO': 'Robotics',
    'quant-ph': 'Quantum Computing',
    'physics': 'Physics',
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Topic selector */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-blue-950">
            Trending Papers — {topicLabel[topic] ?? topic}
          </h2>
          <Suspense fallback={null}>
            <TopicSelector />
          </Suspense>
        </div>

        {/* Papers list — fetched server-side */}
        <Suspense
          fallback={
            <div className="flex items-center gap-3 text-gray-500 text-sm py-8">
              <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-900" />
              Loading papers…
            </div>
          }
        >
          <PapersSection topic={topic} />
        </Suspense>
      </main>
    </div>
  );
}
