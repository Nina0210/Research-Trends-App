import type { Paper } from '@/lib/types';

async function fetchText(url: string) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'paper-app/1.0 (fetch-arxiv)' },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`arXiv fetch failed: ${res.status}`);
  return res.text();
}

function extractSingle(tag: string, text: string) {
  const re = new RegExp(`<${tag}[^>]*>([\s\S]*?)<\/${tag}>`, 'i');
  const m = text.match(re);
  return m ? m[1].trim() : '';
}

export async function fetchArxivTrending(
  category = 'cs',
  maxResults = 10
): Promise<Paper[]> {
  const query = `cat:${category}`;
  const url = `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(
    query
  )}&start=0&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;

  const body = await fetchText(url);

  const parts = body.split('<entry>').slice(1);

  const papers: Paper[] = parts.map((entry) => {
    const title = extractSingle('title', entry).replace(/\s+/g, ' ').trim();
    const summary = extractSingle('summary', entry).replace(/\s+/g, ' ').trim();
    const publishedRaw = extractSingle('published', entry);
    const publishedDate = publishedRaw ? new Date(publishedRaw) : new Date();

    const authorMatches = Array.from(
      entry.matchAll(/<author>\s*<name>([\s\S]*?)<\/name>\s*<\/author>/g)
    );
    const authors = authorMatches.map((m) => m[1].trim());

    // Try link rel="alternate" first, fallback to id
    let urlLink = '';
    const linkMatch = entry.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/i);
    if (linkMatch) urlLink = linkMatch[1];
    if (!urlLink) {
      const idRaw = extractSingle('id', entry);
      urlLink = idRaw;
    }

    const idMatch = urlLink.match(/([^/]+)$/);
    const id = idMatch ? idMatch[1] : urlLink;

    const catMatch = entry.match(/<category[^>]*term="([^"]+)"/i);
    const categoryTerm = catMatch ? catMatch[1] : category;

    // Simple trending score: recent papers score higher (days since published)
    const daysSince = Math.max(0, (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24));
    const trendingScore = Math.max(0, Math.round(100 - daysSince * 2 + Math.random() * 10));

    return {
      id: String(id),
      title,
      authors: authors.length ? authors : ['Unknown'],
      abstract: summary,
      url: urlLink,
      publishedDate,
      trendingScore,
      category: categoryTerm,
      citations: 0,
    } as Paper;
  });

  return papers;
}

export default { fetchArxivTrending };
