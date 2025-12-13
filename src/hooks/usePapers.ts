'use client';

import { useState, useEffect } from 'react';
import { Paper } from '@/lib/types';
import { paperService } from '@/lib/services/paperService';

interface UsePapersReturn {
  papers: Paper[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function usePapers(limit: number = 10, offset: number = 0): UsePapersReturn {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paperService.getTrendingPapers(limit, offset);
      setPapers(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch papers'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, [limit, offset]);

  return { papers, loading, error, refetch: fetchPapers };
}
