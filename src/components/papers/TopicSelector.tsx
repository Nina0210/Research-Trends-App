'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export const TOPICS = [
  { label: 'AI', value: 'cs.AI' },
  { label: 'Machine Learning', value: 'cs.LG' },
  { label: 'NLP', value: 'cs.CL' },
  { label: 'Computer Vision', value: 'cs.CV' },
  { label: 'Robotics', value: 'cs.RO' },
  { label: 'Quantum', value: 'quant-ph' },
  { label: 'Physics', value: 'physics' },
] as const;

export default function TopicSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('topic') || 'cs.AI';

  const select = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('topic', value);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {TOPICS.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => select(value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            current === value
              ? 'bg-blue-950 text-white shadow-sm'
              : 'bg-white text-blue-900 border border-blue-200 hover:bg-blue-50'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
