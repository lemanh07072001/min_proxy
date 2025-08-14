import {
  Menu,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function HeaderLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <header className={`sticky top-0 z-40 transition-all duration-500 ${scrollY > 50 ? 'border-b border-white/10 bg-black/80 backdrop-blur-xl' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="group flex cursor-pointer items-center gap-4">
            <div className="relative">
              <div className="flex h-14 w-14 transform items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 via-red-600 to-orange-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                  <span className="text-lg font-bold text-red-600">H</span>
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 opacity-50 blur-lg transition-opacity duration-300 group-hover:opacity-75" />
            </div>
            <div className="hidden sm:block">
              <h1 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-2xl font-bold text-transparent">
                HOME
                <span className="text-red-400">PROXY</span>
              </h1>
              <p className="text-xs font-medium text-gray-400">Proxy Việt Nam #1</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {['Trang chủ', 'Giới thiệu', 'Đại lý', 'Mua Proxy', 'Liên hệ'].map((item, index) => (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a
                key={index}
                href="#"
                className="group relative py-2 font-medium text-gray-300 transition-colors duration-300 hover:text-white"
              >
                {item}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden items-center gap-4 lg:flex">
            <button className="px-4 py-2 font-medium text-gray-300 transition-colors duration-300 hover:text-white">
              Đăng nhập
            </button>
            <button className="transform rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-2.5 font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-red-700 hover:shadow-red-500/25">
              Đăng ký ngay
            </button>
          </div>

          {/* Mobile Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-xl p-2 transition-colors duration-300 hover:bg-white/10 lg:hidden"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-xl lg:hidden">
            <nav className="space-y-4">
              {['Trang chủ', 'Giới thiệu', 'Đại lý', 'Mua Proxy', 'Liên hệ'].map((item, index) => (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a
                  key={index}
                  href="#"
                  className="block rounded-xl p-3 font-medium transition-colors duration-300 hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <button className="w-full rounded-xl p-3 text-left transition-colors duration-300 hover:bg-white/10">
                  Đăng nhập
                </button>
                <button className="w-full rounded-xl bg-gradient-to-r from-red-500 to-red-600 p-3 font-semibold">
                  Đăng ký ngay
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
