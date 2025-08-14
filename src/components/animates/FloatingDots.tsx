'use client';
import { useEffect, useState } from 'react';

export function FloatingDots() {
  const [dots, setDots] = useState<{ left: number; top: number; duration: number }[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setDots(
      [...Array.from({ length: 6 })].map(() => ({
        left: 20 + Math.random() * 60,
        top: 20 + Math.random() * 60,
        duration: 2 + Math.random(),
      })),
    );
  }, []);

  return (
    <>
      {dots.map((dot, i) => (
        <div
          /* eslint-disable-next-line react/no-array-index-key */
          key={i}
          className="absolute h-3 w-3 animate-ping rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${dot.duration}s`,
          }}
        />
      ))}
    </>
  );
}
