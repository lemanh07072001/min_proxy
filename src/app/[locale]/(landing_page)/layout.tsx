'use client';

import type { EmblaOptionsType } from 'embla-carousel';
import {
  Globe,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import AnimatedBackground from '@/components/animates/AnimatedBackground';
import HeaderLandingPage from '@/components/layout_landing_page/Header';
import TopBanner from '@/components/layout_landing_page/TopBanner';

export default function LayoutLandingPage({ children }: { children: React.ReactNode }) {

  const OPTIONS: EmblaOptionsType = { axis: 'x' };
  const SLIDE_COUNT = 5;
  const SLIDES = Array.from(Array.from({ length: SLIDE_COUNT }).keys());

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Top Banner */}
      <TopBanner slides={SLIDES} options={OPTIONS} />

      {/* Header */}
      <HeaderLandingPage />

      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50 px-4 py-16 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="mb-12 grid gap-8 md:grid-cols-4">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white">
                    <span className="font-bold text-red-600">H</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    HOME
                    <span className="text-red-400">PROXY</span>
                  </h3>
                  <p className="text-sm text-gray-400">Proxy Việt Nam #1</p>
                </div>
              </div>
              <p className="mb-6 max-w-md text-gray-400">
                Đối tác tin cậy cung cấp dịch vụ proxy chất lượng cao và cơ hội kinh doanh bền vững cho đại lý trên toàn quốc.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: <Phone className="h-5 w-5" />, color: 'bg-green-500 hover:bg-green-600' },
                  { icon: <MessageCircle className="h-5 w-5" />, color: 'bg-blue-600 hover:bg-blue-700' },
                  { icon: <Send className="h-5 w-5" />, color: 'bg-blue-500 hover:bg-blue-600' },
                ].map((social, index) => (
                  <button
                    key={index}
                    className={`h-12 w-12 ${social.color} flex items-center justify-center rounded-xl text-white transition-all duration-300 hover:scale-110`}
                  >
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-6 text-lg font-semibold text-white">Liên kết nhanh</h4>
              <ul className="space-y-3">
                {['Trang chủ', 'Giới thiệu', 'Đại lý', 'Mua Proxy', 'Hỗ trợ', 'Liên hệ'].map((link, index) => (
                  <li key={index}>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a href="#" className="text-gray-400 transition-colors duration-300 hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="mb-6 text-lg font-semibold text-white">Liên hệ</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-red-400" />
                  <span className="text-gray-400">0123.456.789</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-red-400" />
                  <span className="text-gray-400">support@homeproxy.vn</span>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="mt-0.5 h-5 w-5 text-red-400" />
                  <span className="text-gray-400">
                    Tầng 10, Tòa nhà ABC
                    <br />
                    123 Đường XYZ, Hà Nội
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
            <p className="text-sm text-gray-400">
              © 2024 HomeProxy. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex gap-6 text-sm">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" className="text-gray-400 transition-colors duration-300 hover:text-white">
                Điều khoản sử dụng
              </a>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" className="text-gray-400 transition-colors duration-300 hover:text-white">
                Chính sách bảo mật
              </a>
            </div>
          </div>
        </div>
      </footer>
      {/* Social Sidebar */}
      <div className="fixed top-1/2 right-6 z-30 -translate-y-1/2 transform space-y-3">
        {[
          { icon: <Phone className="h-5 w-5" />, color: 'bg-green-500 hover:bg-green-600', label: 'Hotline' },
          { icon: <MessageCircle className="h-5 w-5" />, color: 'bg-blue-600 hover:bg-blue-700', label: 'Facebook' },
          { icon: <Send className="h-5 w-5" />, color: 'bg-blue-500 hover:bg-blue-600', label: 'Telegram' },
        ].map((social, index) => (
          <button
            key={index}
            className={`h-14 w-14 ${social.color} group flex transform items-center justify-center rounded-2xl text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl`}
            title={social.label}
          >
            {social.icon}
            <div className="pointer-events-none absolute right-16 rounded-lg bg-black/80 px-3 py-1 text-sm whitespace-nowrap text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {social.label}
            </div>
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="fixed bottom-8 left-1/2 z-30 -translate-x-1/2 transform animate-bounce">
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/30">
          <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-white/50" />
        </div>
      </div>

      {/* Custom Styles */}

    </div>
  );
};
