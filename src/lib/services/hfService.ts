import type { Paper } from '@/lib/types';

interface HFPaper {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  upvotes: number;
  authors: { name: string }[];
  ai_keywords?: string[];
  ai_summary?: string;
}

export async function fetchHFTrending(maxResults = 20): Promise<Paper[]> {
  const res = await fetch('https://huggingface.co/api/daily_papers', {
    headers: { 'User-Agent': 'paper-app/1.0' },
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error(`HF fetch failed: ${res.status}`);

  const json: { paper: HFPaper }[] = await res.json();

  return json
    .map((item) => item.paper)
    .filter(Boolean)
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, maxResults)
    .map((p) => ({
      id: p.id,
      title: p.title,
      authors: p.authors.map((a) => a.name),
      abstract: p.summary,
      url: `https://arxiv.org/abs/${p.id}`,
      publishedDate: new Date(p.publishedAt),
      trendingScore: p.upvotes,
      category: (p.ai_keywords?.slice(0, 3).join(', ') ?? 'Research'),
      citations: 0,
      aiSummary: p.ai_summary,
    })) as Paper[];
}
