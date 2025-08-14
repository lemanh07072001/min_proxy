import {
  Star,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function TopBanner() {
  const [_, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="relative z-50 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
            <span className="font-semibold">🔥 HOT:</span>
          </div>
          <span>Tuyển đại lý toàn quốc - Hoa hồng lên đến 40% - Hỗ trợ marketing 24/7</span>
        </div>
        {/* eslint-disable-next-line react-dom/no-missing-button-type */}
        <button className="hidden items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 font-semibold transition-all duration-300 hover:scale-105 hover:bg-white/30 md:flex">
          <Star className="h-4 w-4" />
          Đăng ký ngay
        </button>
      </div>
    </div>
  );
}
