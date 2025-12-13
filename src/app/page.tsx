"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import PaperCard from "@/components/papers/PaperCard";
import SummaryPanel from "@/components/summaries/SummaryPanel";
import AudioPlayer from "@/components/audio/AudioPlayer";
import type { Paper } from "@/lib/types";

// fetched papers
// initial empty array; we'll load trending papers from our API route
// (falls back to empty list while loading)

export default function Home() {
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchTrending = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/papers/trending');
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const json = await res.json();
        if (json.success && json.data?.papers) {
          if (mounted) setPapers(json.data.papers);
        } else {
          throw new Error(json.error || 'Failed to load papers');
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTrending();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-semibold text-blue-600">Trending Papers</h2>
            <div className="grid grid-cols-1 gap-4">
              {loading && <div className="text-sm text-gray-600">Loading papers…</div>}
              {error && <div className="text-sm text-red-600">{error}</div>}
              {!loading && !error && papers.length === 0 && (
                <div className="text-sm text-gray-600">No trending papers found.</div>
              )}
              {!loading && !error &&
                papers.map((p) => (
                  <PaperCard key={p.id} paper={p} onSelectSummary={setSelectedPaper} />
                ))}
            </div>
          </div>

          <aside className="space-y-4">
            <h3 className="text-lg font-medium">Audio Summaries</h3>
            <AudioPlayer
              audioUrl="/audio/sample-audio.mp3"
              title={papers[0]?.title ?? 'Sample audio'}
              duration={65}
            />

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold mb-2">Quick Stats</h4>
              <p className="text-sm text-gray-600">Total trending papers: {papers.length}</p>
            </div>
          </aside>
        </section>

        {/* Summary modal/panel */}
        {selectedPaper && (
          <SummaryPanel paper={selectedPaper} onClose={() => setSelectedPaper(null)} />
        )}
      </main>
    </div>
  );
}
