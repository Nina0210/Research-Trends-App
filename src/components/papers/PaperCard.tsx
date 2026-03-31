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
    <Card className="aspect-square flex flex-col overflow-hidden border-border bg-card">
      <CardContent className="p-5 flex flex-col h-full">
        {/* Title + Trending Badge */}
        <div className="flex items-start justify-between mb-2">
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-semibold text-foreground hover:text-primary line-clamp-2 flex-1 leading-snug"
          >
            {paper.title}
          </a>
          <Badge variant="secondary" className="ml-2 whitespace-nowrap shrink-0 bg-orange-900/40 text-orange-300 border-orange-800/50">
            {Math.round(paper.trendingScore)}%
          </Badge>
        </div>

        {/* Authors */}
        <p className="text-muted-foreground text-xs mb-2 line-clamp-1">
          {paper.authors.slice(0, 3).join(', ')}
          {paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}
        </p>

        {/* Category and Date */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge variant="outline" className="text-xs border-border text-muted-foreground">{paper.category}</Badge>
          <span className="text-muted-foreground text-xs">{new Date(paper.publishedDate).toLocaleDateString('en-GB')}</span>
          <span className="text-muted-foreground text-xs">{paper.citations} citations</span>
        </div>

        {/* Abstract */}
        <p className={`text-muted-foreground text-xs flex-1 overflow-hidden ${isExpanded ? 'overflow-y-auto' : 'line-clamp-4'}`}>
          {paper.abstract}
        </p>

        {/* Actions */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-border">
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground h-7 px-2" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Show Less' : 'Show More'}
          </Button>
          {onSelectSummary && (
            <Button size="sm" className="ml-auto text-xs h-7 px-3 bg-primary hover:bg-primary/90" onClick={() => onSelectSummary(paper)}>
              Summary
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
