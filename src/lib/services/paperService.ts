import { Paper, TrendingPapersResponse } from '@/lib/types';

/**
 * Service for fetching and managing trending CS papers
 * This would typically integrate with APIs like:
 * - arXiv API
 * - Papers With Code API
 * - Semantic Scholar API
 */

export class PaperService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

  /**
   * Fetch trending papers from the backend
   */
  async getTrendingPapers(limit: number = 10, offset: number = 0): Promise<Paper[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/papers?limit=${limit}&offset=${offset}`,
        { cache: 'no-store' }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch trending papers');
      }

      const data: TrendingPapersResponse = await response.json();
      return data.papers;
    } catch (error) {
      console.error('Error fetching trending papers:', error);
      throw error;
    }
  }

  /**
   * Get a single paper by ID
   */
  async getPaperById(paperId: string): Promise<Paper | null> {
    try {
      const response = await fetch(`${this.baseUrl}/papers/${paperId}`);

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching paper:', error);
      return null;
    }
  }

  /**
   * Search papers by keyword
   */
  async searchPapers(query: string): Promise<Paper[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/papers/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error('Failed to search papers');
      }

      const data: TrendingPapersResponse = await response.json();
      return data.papers;
    } catch (error) {
      console.error('Error searching papers:', error);
      throw error;
    }
  }
}

export const paperService = new PaperService();
