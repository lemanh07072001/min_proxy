"use client"

import React from 'react';

const BackgroundPattern = () => {
  return (
    <div className="bg-pattern">
      {/* Hexagonal Grid SVG */}
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <pattern id="hexagons" width="60" height="52" patternUnits="userSpaceOnUse">
            <polygon
              points="30,2 50,15 50,37 30,50 10,37 10,15"
              fill="none"
              stroke="#ef4444"
              strokeWidth="1"
              opacity="0.3"
            />
          </pattern>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="50%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bgGradient)" />
        <rect width="100%" height="100%" fill="url(#hexagons)" />
      </svg>

      {/* Gradient Overlays */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)',
        animation: 'pulse 8s ease-in-out infinite'
      }}></div>

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)',
        animation: 'pulse 10s ease-in-out infinite 2s'
      }}></div>
    </div>
  );
};

export default BackgroundPattern;