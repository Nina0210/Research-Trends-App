import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getCachedSummary, setCachedSummary } from '@/lib/cache';

const client = new Anthropic();

/**
 * POST /api/summaries/text
 * Generate an accessible text summary for a research paper using Claude.
 */
export async function POST(request: NextRequest) {
  try {
    const { paperId, title, abstract } = await request.json();

    if (!paperId || !abstract) {
      return NextResponse.json(
        { error: 'Missing required fields: paperId, abstract' },
        { status: 400 }
      );
    }

    const cached = getCachedSummary(paperId);
    if (cached) return NextResponse.json(cached);

    const stream = client.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 600,
      thinking: { type: 'adaptive' },
      messages: [
        {
          role: 'user',
          content: `You are a science communicator writing for a curious general audience. Summarize this research paper in 3–4 clear, engaging sentences. Explain what was done, why it matters, and what was discovered — no jargon.

Title: ${title ?? 'Research Paper'}
Abstract: ${abstract}

Provide only the summary text, with no preamble or labels.`,
        },
      ],
    });

    const response = await stream.finalMessage();
    const textBlock = response.content.find((b) => b.type === 'text');
    const content = textBlock && textBlock.type === 'text' ? textBlock.text : 'Summary unavailable.';

    const result = {
      id: `summary-${paperId}-${Date.now()}`,
      paperId,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCachedSummary(paperId, result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
