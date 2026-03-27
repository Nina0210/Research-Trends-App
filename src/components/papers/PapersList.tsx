'use client';

import { useState } from 'react';
import type { Paper } from '@/lib/types';
import PaperCard from './PaperCard';
import SummaryPanel from '@/components/summaries/SummaryPanel';

interface PapersListProps {
  papers: Paper[];
}

export default function PapersList({ papers }: PapersListProps) {
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {papers.map((p) => (
          <PaperCard key={p.id} paper={p} onSelectSummary={setSelectedPaper} />
        ))}
      </div>

      {selectedPaper && (
        <SummaryPanel paper={selectedPaper} onClose={() => setSelectedPaper(null)} />
      )}
    </>
  );
}
