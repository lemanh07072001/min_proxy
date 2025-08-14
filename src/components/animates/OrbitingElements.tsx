"use client";
import { useEffect, useState } from "react";
import { Server } from "lucide-react";

export default function OrbitingElements() {
  const [durations, setDurations] = useState<number[]>([]);

  useEffect(() => {
    setDurations([...Array(8)].map(() => 3 + Math.random()));
  }, []);

  const radius = 120;

  return (
    <>
      {[...Array(8)].map((_, i) => {
        const angle = (i * 45) * (Math.PI / 180);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div
            key={i}
            className="absolute w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl shadow-lg border border-gray-500 flex items-center justify-center animate-float"
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: durations[i] ? `${durations[i]}s` : "3s"
            }}
          >
            <Server className="w-6 h-6 text-red-400" />
          </div>
        );
      })}
    </>
  );
}
