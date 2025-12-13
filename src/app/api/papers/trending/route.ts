import { NextResponse } from 'next/server';
import { fetchArxivTrending } from '@/lib/services/arxivService';

export async function GET() {
  try {
    const papers = await fetchArxivTrending('cs', 10);
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
