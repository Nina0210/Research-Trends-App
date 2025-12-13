import { NextRequest, NextResponse } from 'next/server';
import { TextSummary } from '@/lib/types';

/**
 * POST /api/summaries/text
 * Generate a text summary for a paper
 */
export async function POST(request: NextRequest) {
  try {
    const { paperId, abstract } = await request.json();

    if (!paperId || !abstract) {
      return NextResponse.json(
        { error: 'Missing required fields: paperId, abstract' },
        { status: 400 }
      );
    }

    // TODO: Integrate with summarization service:
    // - OpenAI API (GPT-4)
    // - Anthropic Claude
    // - Open source models (Hugging Face)

    // Mock summary for now
    const summary: TextSummary = {
      id: `summary-${Date.now()}`,
      paperId,
      content: `This paper proposes a novel approach to ${abstract.substring(0, 50)}... The authors demonstrate significant improvements over existing methods through comprehensive experiments.`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/summaries/text/[paperId]
 */
export async function GET(request: NextRequest) {
  try {
    const paperId = request.nextUrl.pathname.split('/').pop();

    if (!paperId) {
      return NextResponse.json(
        { error: 'Paper ID is required' },
        { status: 400 }
      );
    }

    // TODO: Fetch from database
    // For now, return null to trigger generation
    return NextResponse.json(null);
  } catch (error) {
    console.error('Error fetching summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch summary' },
      { status: 500 }
    );
  }
}
