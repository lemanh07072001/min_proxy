"use client";
import { useEffect, useState } from "react";

export default function FloatingDots() {
  const [dots, setDots] = useState<{ left: number; top: number; duration: number }[]>([]);

  useEffect(() => {
    setDots(
      [...Array(6)].map(() => ({
        left: 20 + Math.random() * 60,
        top: 20 + Math.random() * 60,
        duration: 2 + Math.random(),
      }))
    );
  }, []);

  return (
    <>
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-ping"
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
