// Paper types
export interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  url: string;
  publishedDate: Date;
  trendingScore: number;
  category: string;
  citations: number;
}

// Summary types
export interface TextSummary {
  id: string;
  paperId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AudioSummary {
  id: string;
  paperId: string;
  textSummaryId: string;
  audioUrl: string;
  duration: number;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Trending papers response
export interface TrendingPapersResponse {
  papers: Paper[];
  totalCount: number;
  timestamp: Date;
}
