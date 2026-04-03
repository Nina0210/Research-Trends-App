'use client';

import { Paper, TextSummary } from '@/lib/types';
import { useState, useEffect } from 'react';
import { summaryService } from '@/lib/services/summaryService';
import { X, ExternalLink } from 'lucide-react';

interface SummaryPanelProps {
  paper: Paper | null;
  onClose: () => void;
  podcastUrl: string | null;
  onPodcastGenerated: (url: string) => void;
}

export default function SummaryPanel({ paper, onClose, podcastUrl, onPodcastGenerated }: SummaryPanelProps) {
  const [summary, setSummary] = useState<TextSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [podcastLoading, setPodcastLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (!paper) return;

    const fetchOrGenerateSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        setSummary(null);

        let existingSummary = await summaryService.getTextSummary(paper.id);
        if (!existingSummary) {
          existingSummary = await summaryService.generateTextSummary(
            paper.id,
            paper.abstract,
            paper.title
          );
        }
        setSummary(existingSummary);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load summary');
      } finally {
        setLoading(false);
      }
    };

    fetchOrGenerateSummary();

    return () => {};
  }, [paper]);

  const handlePodcast = async () => {
    if (!paper || podcastLoading) return;

    try {
      setPodcastLoading(true);
      const response = await fetch('/api/summaries/podcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paperId: paper.id, title: paper.title, abstract: paper.abstract }),
      });

      if (!response.ok) throw new Error('Failed to generate podcast');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      onPodcastGenerated(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate podcast');
    } finally {
      setPodcastLoading(false);
    }
  };

  if (!paper) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-lg shadow-xl w-full sm:max-w-2xl h-[90vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-950 to-blue-800 text-white p-4 sm:p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 leading-snug">{paper.title}</h2>
            <p className="text-blue-200 text-xs sm:text-sm">{paper.authors.join(', ')}</p>
          </div>
          <div className="flex items-center gap-2 ml-4 shrink-0">
            <a href={paper.url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200">
              <ExternalLink size={18} />
            </a>
            <button onClick={onClose} className="text-white hover:text-blue-200">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
              <span className="ml-3 text-gray-600">Generating AI summary…</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {summary && !loading && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">AI Summary</h3>
                  {!podcastUrl && (
                    <button
                      onClick={handlePodcast}
                      disabled={podcastLoading}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition bg-blue-50 text-blue-900 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {podcastLoading ? '⏳ Generating…' : '🎙 Generate Podcast'}
                    </button>
                  )}
                </div>
                <p className="text-gray-700 leading-relaxed">{summary.content}</p>
                {podcastUrl && (
                  <audio
                    src={podcastUrl}
                    controls
                    className="w-full mt-4"
                  />
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Paper Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Published:</span>{' '}
                    {new Date(paper.publishedDate).toLocaleDateString('en-GB')}
                  </div>
                  <div>
                    <span className="font-medium">Citations:</span> {paper.citations}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {paper.category}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
