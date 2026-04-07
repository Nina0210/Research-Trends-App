import { Suspense } from 'react';
import Header from '@/components/common/Header';
import PapersList from '@/components/papers/PapersList';
import { fetchHFTrending } from '@/lib/services/hfService';
import type { Paper } from '@/lib/types';

async function PapersSection() {
  let papers: Paper[] = [];
  let error: string | null = null;

  try {
    papers = await fetchHFTrending(20);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load papers';
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (papers.length === 0) {
    return <p className="text-sm text-muted-foreground">No trending papers found.</p>;
  }

  return <PapersList papers={papers} />;
}

export default async function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
          Trending Papers Today
        </h2>

        <Suspense
          fallback={
            <div className="flex items-center gap-3 text-muted-foreground text-sm py-8">
              <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
              Loading papers…
            </div>
          }
        >
          <PapersSection />
        </Suspense>
      </main>
    </div>
  );
}
