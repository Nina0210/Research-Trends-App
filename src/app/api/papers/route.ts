import { NextRequest, NextResponse } from 'next/server';
import { TrendingPapersResponse, Paper } from '@/lib/types';

/**
 * GET /api/papers
 * Fetch trending CS papers
 * 
 * Query parameters:
 * - limit: number of papers to return (default: 10)
 * - offset: number of papers to skip (default: 0)
 * - category: filter by category (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // TODO: Implement integration with paper sources:
    // - arXiv API for recent papers
    // - Papers With Code API for trending papers
    // - Semantic Scholar API for citations

    // Mock data for now
    const mockPapers: Paper[] = [
      {
        id: '1',
        title: 'Attention Is All You Need',
        authors: ['Ashish Vaswani', 'Noam Shazeer', 'Parmar Ankur'],
        abstract:
          'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. The best performing models also connect the encoder and decoder through an attention mechanism.',
        url: 'https://arxiv.org/abs/1706.03762',
        publishedDate: new Date('2023-01-15'),
        trendingScore: 95,
        category: 'Machine Learning',
        citations: 75000,
      },
      {
        id: '2',
        title: 'BERT: Pre-training of Deep Bidirectional Transformers',
        authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee'],
        abstract:
          'We introduce BERT, a new method of pre-training language representations from unlabeled text. Unlike previous work, our approach jointly conditions on both left and right context.',
        url: 'https://arxiv.org/abs/1810.04805',
        publishedDate: new Date('2023-01-10'),
        trendingScore: 88,
        category: 'Natural Language Processing',
        citations: 60000,
      },
    ];

    const response: TrendingPapersResponse = {
      papers: mockPapers.slice(offset, offset + limit),
      totalCount: mockPapers.length,
      timestamp: new Date(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching papers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch papers' },
      { status: 500 }
    );
  }
}
