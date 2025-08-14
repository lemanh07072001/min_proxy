'use client';

import { useEffect, useState } from 'react';

export default function SkeletonBars() {
  const [widths, setWidths] = useState<number[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setWidths([...Array.from({ length: 8 })].map(() => 60 + Math.random() * 40));
  }, []);

  return (
    <div className="space-y-3 p-4">
      {[...Array.from({ length: 8 })].map((_, i) => (
        <div
          /* eslint-disable-next-line react/no-array-index-key */
          key={i}
          className="h-3 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-80"
          style={{
            animationDelay: `${i * 0.2}s`,
            width: widths[i] ? `${widths[i]}%` : '60%',
          }}
        />
      ))}
    </div>
  );
}
