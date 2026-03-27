import { TextSummary, AudioSummary } from '@/lib/types';

/**
 * Service for managing paper summaries
 * Handles both text and audio summaries
 */

export class SummaryService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

  /**
   * Generate a text summary for a paper
   */
  async generateTextSummary(paperId: string, abstract: string, title?: string): Promise<TextSummary> {
    try {
      const response = await fetch(`${this.baseUrl}/summaries/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paperId, abstract, title }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate text summary');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating text summary:', error);
      throw error;
    }
  }

  /**
   * Get an existing text summary
   */
  async getTextSummary(paperId: string): Promise<TextSummary | null> {
    try {
      const response = await fetch(`${this.baseUrl}/summaries/text/${paperId}`);

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching text summary:', error);
      return null;
    }
  }

  /**
   * Generate an audio summary from text
   */
  async generateAudioSummary(textSummaryId: string, text: string): Promise<AudioSummary> {
    try {
      const response = await fetch(`${this.baseUrl}/audio/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ textSummaryId, text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio summary');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating audio summary:', error);
      throw error;
    }
  }

  /**
   * Get an existing audio summary
   */
  async getAudioSummary(paperId: string): Promise<AudioSummary | null> {
    try {
      const response = await fetch(`${this.baseUrl}/audio/${paperId}`);

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching audio summary:', error);
      return null;
    }
  }
}

export const summaryService = new SummaryService();
