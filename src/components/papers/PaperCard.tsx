'use client';

import { Paper } from '@/lib/types';
import { useState } from 'react';


interface PaperCardProps {
  paper: Paper;
  onSelectSummary?: (paper: Paper) => void;
}

export default function PaperCard({ paper, onSelectSummary }: PaperCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
      <div className="p-6">
        {/* Trending Badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-semibold text-blue-600 hover:text-blue-800 line-clamp-2"
            >
              {paper.title}
            </a>
          </div>
          <div className="ml-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
            Trending {Math.round(paper.trendingScore)}%
          </div>
        </div>

        {/* Authors */}
        <p className="text-gray-600 text-sm mb-3">
          {paper.authors.slice(0, 3).join(', ')}
          {paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}
        </p>

        {/* Category and Date */}
        <div className="flex items-center space-x-4 mb-3 text-gray-500 text-sm">
          <span className="bg-blue-50 px-3 py-1 rounded-full">{paper.category}</span>
          <span>{new Date(paper.publishedDate).toLocaleDateString()}</span>
          <span>{paper.citations} citations</span>
        </div>

        {/* Abstract */}
        <p className={`text-gray-700 text-sm mb-4 ${isExpanded ? '' : 'line-clamp-3'}`}>
          {paper.abstract}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
          {onSelectSummary && (
            <button
              onClick={() => onSelectSummary(paper)}
              className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              View Summary
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
