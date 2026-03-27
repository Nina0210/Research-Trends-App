import { NextRequest, NextResponse } from 'next/server';
import { fetchArxivTrending } from '@/lib/services/arxivService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'cs.AI';
  const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 25);

  try {
    const papers = await fetchArxivTrending(category, limit);
    return NextResponse.json(
      {
        success: true,
        data: {
          papers,
          totalCount: papers.length,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'unknown' },
      { status: 500 }
    );
  }
}
