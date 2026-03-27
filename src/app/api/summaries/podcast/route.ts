import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { getCachedPodcast, setCachedPodcast } from '@/lib/cache';

const anthropic = new Anthropic();
const openai = new OpenAI();

const VOICES = { HOST1: 'alloy', HOST2: 'nova' } as const;

export async function POST(request: NextRequest) {
  try {
    const { paperId, title, abstract } = await request.json();

    if (!paperId || !abstract) {
      return NextResponse.json({ error: 'Missing required fields: paperId, abstract' }, { status: 400 });
    }

    const cached = getCachedPodcast(paperId);
    if (cached) {
      return new NextResponse(cached.buffer as ArrayBuffer, {
        headers: { 'Content-Type': 'audio/mpeg', 'Content-Length': String(cached.length) },
      });
    }

    // 1. Generate podcast script with Claude
    const scriptResponse = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `Write a 2-3 minute podcast script for two hosts (HOST1 and HOST2) discussing this research paper. Make it natural, engaging, and accessible — cover what the paper is about, why it's interesting, key findings, and real-world implications. No jargon.

Title: ${title ?? 'Research Paper'}
Abstract: ${abstract}

Format every line exactly like this (no other text):
HOST1: [dialogue]
HOST2: [dialogue]`,
        },
      ],
    });

    const script = scriptResponse.content.find((b) => b.type === 'text')?.text ?? '';

    // 2. Parse into speaker segments
    const segments = script
      .split('\n')
      .map((line) => {
        const match = line.match(/^(HOST1|HOST2):\s*(.+)$/);
        return match ? { speaker: match[1] as 'HOST1' | 'HOST2', text: match[2] } : null;
      })
      .filter((s): s is { speaker: 'HOST1' | 'HOST2'; text: string } => s !== null);

    if (segments.length === 0) {
      return NextResponse.json({ error: 'Failed to parse podcast script' }, { status: 500 });
    }

    // 3. Generate TTS audio for each segment
    const audioChunks: Buffer[] = [];
    for (const segment of segments) {
      const ttsResponse = await openai.audio.speech.create({
        model: 'tts-1',
        voice: VOICES[segment.speaker],
        input: segment.text,
      });
      audioChunks.push(Buffer.from(await ttsResponse.arrayBuffer()));
    }

    // 4. Concatenate, cache, and return as audio
    const combined = Buffer.concat(audioChunks);
    setCachedPodcast(paperId, combined);
    return new NextResponse(combined, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(combined.length),
      },
    });
  } catch (error) {
    console.error('Error generating podcast:', error);
    return NextResponse.json({ error: 'Failed to generate podcast' }, { status: 500 });
  }
}
