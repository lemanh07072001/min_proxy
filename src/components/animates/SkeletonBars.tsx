"use client";

import { useEffect, useState } from "react";

export default function SkeletonBars() {
  const [widths, setWidths] = useState<number[]>([]);

  useEffect(() => {
    setWidths([...Array(8)].map(() => 60 + Math.random() * 40));
  }, []);

  return (
    <div className="p-4 space-y-3">
          {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse opacity-80"
          style={{
        animationDelay: `${i * 0.2}s`,
          width: widths[i] ? `${widths[i]}%` : "60%"
      }}
      />
    ))}
  </div>
);
}