'use client';
import { Server } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function OrbitingElements() {
  const [durations, setDurations] = useState<number[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setDurations([...Array.from({ length: 8 })].map(() => 3 + Math.random()));
  }, []);

  const radius = 120;

  return (
    <>
      {[...Array.from({ length: 8 })].map((_, i) => {
        const angle = (i * 45) * (Math.PI / 180);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div
            /* eslint-disable-next-line react/no-array-index-key */
            key={i}
            /* eslint-disable-next-line tailwindcss/no-custom-classname */
            className="animate-float absolute flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-500 bg-gradient-to-br from-gray-600 to-gray-700 shadow-lg"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: durations[i] ? `${durations[i]}s` : '3s',
            }}
          >
            <Server className="h-6 w-6 text-red-400" />
          </div>
        );
      })}
    </>
  );
}
