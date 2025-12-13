'use client';

import { useState, useCallback } from 'react';
import { TextSummary } from '@/lib/types';
import { summaryService } from '@/lib/services/summaryService';

interface UseSummaryReturn {
  summary: TextSummary | null;
  loading: boolean;
  error: Error | null;
  generateSummary: (paperId: string, abstract: string) => Promise<void>;
}

export function useSummary(): UseSummaryReturn {
  const [summary, setSummary] = useState<TextSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateSummary = useCallback(
    async (paperId: string, abstract: string) => {
      try {
        setLoading(true);
        setError(null);
        const newSummary = await summaryService.generateTextSummary(paperId, abstract);
        setSummary(newSummary);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to generate summary'));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { summary, loading, error, generateSummary };
}
