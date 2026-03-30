'use client';

import { Paper } from '@/lib/types';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PaperCardProps {
  paper: Paper;
  onSelectSummary?: (paper: Paper) => void;
}

export default function PaperCard({ paper, onSelectSummary }: PaperCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <CardContent className="p-6">
        {/* Title + Trending Badge */}
        <div className="flex items-start justify-between mb-3">
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-semibold text-blue-950 hover:text-blue-700 line-clamp-2 flex-1"
          >
            {paper.title}
          </a>
          <Badge variant="secondary" className="ml-2 whitespace-nowrap bg-orange-100 text-orange-800">
            Trending {Math.round(paper.trendingScore)}%
          </Badge>
        </div>

        {/* Authors */}
        <p className="text-gray-600 text-sm mb-3">
          {paper.authors.slice(0, 3).join(', ')}
          {paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}
        </p>

        {/* Category and Date */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">{paper.category}</Badge>
          <span className="text-gray-500 text-sm">{new Date(paper.publishedDate).toLocaleDateString('en-GB')}</span>
          <span className="text-gray-500 text-sm">{paper.citations} citations</span>
        </div>

        {/* Abstract */}
        <p className={`text-gray-700 text-sm mb-4 ${isExpanded ? '' : 'line-clamp-3'}`}>
          {paper.abstract}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Show Less' : 'Show More'}
          </Button>
          {onSelectSummary && (
            <Button size="sm" className="ml-auto" onClick={() => onSelectSummary(paper)}>
              View Summary
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
