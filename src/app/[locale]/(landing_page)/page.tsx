'use client';

import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronDown,
  Clock,
  Globe,
  Phone, PlayCircle,
  Server,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users, Wifi,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FloatingDots } from '@/components/animates/FloatingDots';
import OrbitingElements from '@/components/animates/OrbitingElements';
import SkeletonBars from '@/components/animates/SkeletonBars';

const features = [
  {
    icon: <Globe className="h-6 w-6" />,
    title: 'Phủ sóng toàn quốc',
    desc: 'Kết nối ổn định khắp 63 tỉnh thành',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: '3 nhà mạng lớn',
    desc: 'Viettel, FPT, VNPT - Tốc độ cao',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: 'Website riêng',
    desc: 'Đại lý được cấp trang bán hàng chuyên nghiệp',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: 'Ưu tiên hàng đầu',
    desc: 'Quyền lợi đại lý được đảm bảo tối đa',
    color: 'from-purple-500 to-pink-500',
  },
];

const stats = [
  { number: '15K+', label: 'Khách hàng tin tưởng', icon: <Users className="h-5 w-5" /> },
  { number: '99.9%', label: 'Thời gian hoạt động', icon: <Clock className="h-5 w-5" /> },
  { number: '24/7', label: 'Hỗ trợ không ngừng', icon: <Shield className="h-5 w-5" /> },
  { number: '500+', label: 'Đại lý thành công', icon: <TrendingUp className="h-5 w-5" /> },
];

const testimonials = [
  { name: 'Anh Minh - TP.HCM', text: 'Doanh thu tháng đầu đã đạt 50 triệu, hỗ trợ rất tận tình!', rating: 5 },
  { name: 'Chị Lan - Hà Nội', text: 'Proxy chất lượng cao, khách hàng rất hài lòng và quay lại nhiều.', rating: 5 },
  { name: 'Anh Đức - Đà Nẵng', text: 'Từ khi làm đại lý, thu nhập ổn định và tăng đều mỗi tháng.', rating: 5 },
];
export default function Page() {
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      {/* Hero Section */}
      <section className="relative px-4 py-20">
        <div className="container mx-auto">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-gradient-to-r from-red-500/20 to-orange-500/20 px-4 py-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  <span className="text-sm font-medium text-red-300">Đối tác tin cậy #1 Việt Nam</span>
                </div>

                <h1 className="text-5xl leading-tight font-bold lg:text-7xl">
                  <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                    Proxy
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-500 bg-clip-text text-transparent">
                    Việt Nam
                  </span>
                  <br />
                  <span className="text-2xl font-medium text-gray-400 lg:text-3xl">
                    Chất lượng cao
                  </span>
                </h1>

                <p className="max-w-lg text-xl leading-relaxed text-gray-300">
                  Trở thành đại lý của chúng tôi và kiếm thu nhập ổn định với hệ thống proxy chất lượng cao nhất Việt Nam.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`group cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-500 hover:bg-white/10 ${
                      activeFeature === index ? 'bg-white/10 ring-2 ring-red-500/50' : ''
                    }`}
                    onMouseEnter={() => setActiveFeature(index)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 bg-gradient-to-br ${feature.color} flex items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-110`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white transition-colors duration-300 group-hover:text-red-300">
                          {feature.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <button className="group flex transform items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 px-8 py-4 text-lg font-bold transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-red-700 hover:shadow-2xl hover:shadow-red-500/25">
                  <PlayCircle className="h-6 w-6" />
                  <span>BẮT ĐẦU NGAY</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <button className="flex items-center justify-center gap-3 rounded-2xl border-2 border-white/20 px-8 py-4 text-lg font-bold transition-all duration-300 hover:border-white/40 hover:bg-white/5">
                  <Wifi className="h-5 w-5" />
                  Xem demo
                </button>
              </div>
            </div>

            {/* Right Visualization */}
            <div className="relative flex items-center justify-center lg:h-[700px]">
              <div className="relative w-full max-w-md">
                {/* Central Server */}
                <div className="relative z-20 mx-auto">
                  <div className="h-60 w-40 overflow-hidden rounded-3xl border border-gray-600 bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 shadow-2xl">
                    {/* Server Header */}
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <div className="h-3 w-3 rounded-full bg-white/80" />
                          <div className="h-3 w-3 rounded-full bg-white/60" />
                          <div className="h-3 w-3 rounded-full bg-white/40" />
                        </div>
                        <span className="text-xs font-bold text-white">VN</span>
                      </div>
                    </div>

                    {/* Server Body */}
                    <SkeletonBars />

                    {/* Status Indicator */}
                    <div className="absolute right-4 bottom-4 left-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-green-400">● Online</span>
                        <span className="text-gray-400">99.9%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orbiting Elements */}
                <OrbitingElements />

                {/* Connection Lines */}
                <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ zIndex: 10 }}>
                  {[...Array.from({ length: 8 })].map((_, i) => {
                    const angle = (i * 45) * (Math.PI / 180);
                    const radius = 120;
                    const x = 50 + (Math.cos(angle) * radius) / 4;
                    const y = 50 + (Math.sin(angle) * radius) / 4;

                    return (
                      <line
                        key={i}
                        x1="50%"
                        y1="50%"
                        x2={`${x}%`}
                        y2={`${y}%`}
                        stroke="url(#connectionGradient)"
                        strokeWidth="2"
                        className="animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    );
                  })}
                  <defs>
                    <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#f97316" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* FloatingDots */}
                <FloatingDots />
              </div>
            </div>

          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
              >
                <div className="mb-3 flex items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white transition-transform duration-300 group-hover:scale-110">
                    {stat.icon}
                  </div>
                </div>
                <div className="mb-1 text-2xl font-bold text-white lg:text-3xl">{stat.number}</div>
                <div className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white/5 px-4 py-20 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Đại lý nói gì về chúng tôi
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              Hàng nghìn đại lý đã thành công và kiếm được thu nhập ổn định cùng HomeProxy
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
              >
                <div className="mb-4 flex items-center gap-1">
                  {[...Array.from({ length: testimonial.rating })].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 text-gray-300 italic">
                  "
                  {testimonial.text}
                  "
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">Đại lý HomeProxy</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold lg:text-5xl">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Gói Proxy Chất Lượng Cao
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-400">
              Lựa chọn gói proxy phù hợp với nhu cầu của bạn. Tất cả đều đảm bảo tốc độ cao và độ ổn định tuyệt đối.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {[
              {
                name: 'Starter',
                price: '299K',
                period: '/tháng',
                description: 'Phù hợp cho cá nhân và startup',
                features: [
                  '50 IP Việt Nam',
                  'Băng thông không giới hạn',
                  'Hỗ trợ HTTP/HTTPS',
                  'Uptime 99.5%',
                  'Hỗ trợ 24/7',
                ],
                popular: false,
                color: 'from-blue-500 to-cyan-500',
              },
              {
                name: 'Professional',
                price: '599K',
                period: '/tháng',
                description: 'Tối ưu cho doanh nghiệp vừa',
                features: [
                  '200 IP Việt Nam',
                  'Băng thông không giới hạn',
                  'HTTP/HTTPS + SOCKS5',
                  'Uptime 99.9%',
                  'Hỗ trợ ưu tiên',
                  'API Management',
                  'Thống kê chi tiết',
                ],
                popular: true,
                color: 'from-red-500 to-orange-500',
              },
              {
                name: 'Enterprise',
                price: '1.299K',
                period: '/tháng',
                description: 'Giải pháp toàn diện cho doanh nghiệp',
                features: [
                  '500+ IP Việt Nam',
                  'Băng thông không giới hạn',
                  'Tất cả protocols',
                  'Uptime 99.99%',
                  'Dedicated support',
                  'Custom API',
                  'White-label solution',
                  'SLA đảm bảo',
                ],
                popular: false,
                color: 'from-purple-500 to-pink-500',
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`group relative rounded-3xl border bg-white/5 p-8 backdrop-blur-sm transition-all duration-500 hover:scale-105 ${
                  plan.popular
                    ? 'border-red-500/50 bg-gradient-to-b from-red-500/10 to-transparent'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                    <div className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-6 py-2 text-sm font-bold text-white">
                      🔥 Phổ biến nhất
                    </div>
                  </div>
                )}

                <div className="mb-8 text-center">
                  <div className={`mx-auto mb-4 h-16 w-16 bg-gradient-to-br ${plan.color} flex items-center justify-center rounded-2xl`}>
                    <Server className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-white">{plan.name}</h3>
                  <p className="mb-4 text-sm text-gray-400">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                </div>

                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-400" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full rounded-2xl py-4 font-bold transition-all duration-300 ${
                  plan.popular
                    ? 'transform bg-gradient-to-r from-red-500 to-red-600 text-white hover:scale-105 hover:from-red-600 hover:to-red-700'
                    : 'border-2 border-white/20 text-white hover:border-white/40 hover:bg-white/5'
                }`}
                >
                  {plan.popular ? 'Chọn gói này' : 'Bắt đầu ngay'}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="mb-4 text-gray-400">Cần tư vấn gói phù hợp? Liên hệ ngay với chúng tôi</p>
            <button className="rounded-xl border-2 border-red-500/50 px-8 py-3 font-semibold transition-all duration-300 hover:bg-red-500/10">
              Tư vấn miễn phí
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white/5 px-4 py-20 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold lg:text-5xl">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Tại sao chọn HomeProxy?
                </span>
              </h2>
              <p className="mb-8 text-lg text-gray-400">
                Chúng tôi không chỉ cung cấp proxy, mà còn là đối tác tin cậy giúp bạn phát triển kinh doanh bền vững.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: <Shield className="h-6 w-6" />,
                    title: 'Bảo mật tuyệt đối',
                    desc: 'Mã hóa SSL 256-bit, không log hoạt động, đảm bảo quyền riêng tư 100%',
                  },
                  {
                    icon: <Zap className="h-6 w-6" />,
                    title: 'Tốc độ vượt trội',
                    desc: 'Hạ tầng server hiện đại, kết nối trực tiếp với ISP lớn, ping thấp',
                  },
                  {
                    icon: <Users className="h-6 w-6" />,
                    title: 'Hỗ trợ chuyên nghiệp',
                    desc: 'Đội ngũ kỹ thuật 24/7, phản hồi trong 5 phút, giải quyết mọi vấn đề',
                  },
                  {
                    icon: <Award className="h-6 w-6" />,
                    title: 'Chất lượng đảm bảo',
                    desc: 'SLA 99.9% uptime, hoàn tiền 100% nếu không hài lòng trong 7 ngày',
                  },
                ].map((item, index) => (
                  <div key={index} className="group flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white transition-transform duration-300 group-hover:scale-110">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-semibold text-white transition-colors duration-300 group-hover:text-red-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 rounded-3xl border border-white/10 bg-gradient-to-br from-gray-800 to-gray-900 p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Server Status</h3>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-green-400" />
                    <span className="text-sm font-medium text-green-400">All Systems Operational</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { location: 'Hà Nội', status: '99.9%', ping: '12ms', load: 85 },
                    { location: 'TP.HCM', status: '99.8%', ping: '8ms', load: 72 },
                    { location: 'Đà Nẵng', status: '100%', ping: '15ms', load: 68 },
                    { location: 'Cần Thơ', status: '99.9%', ping: '18ms', load: 91 },
                  ].map((server, index) => (
                    <div key={index} className="flex items-center justify-between rounded-xl bg-white/5 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                          <Globe className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-white">{server.location}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-400">{server.status}</span>
                        <span className="text-gray-400">{server.ping}</span>
                        <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-700">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-1000"
                            style={{ width: `${server.load}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-500/20 to-orange-500/20 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold lg:text-5xl">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Câu hỏi thường gặp
              </span>
            </h2>
            <p className="text-lg text-gray-400">
              Giải đáp những thắc mắc phổ biến về dịch vụ proxy của chúng tôi
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: 'Proxy của HomeProxy có gì khác biệt?',
                answer: 'Chúng tôi sử dụng hạ tầng server riêng tại Việt Nam, kết nối trực tiếp với các ISP lớn như Viettel, FPT, VNPT. Điều này đảm bảo tốc độ cao, độ ổn định tuyệt đối và IP sạch 100%.',
              },
              {
                question: 'Làm thế nào để trở thành đại lý?',
                answer: 'Rất đơn giản! Chỉ cần đăng ký tài khoản, nạp tiền và bắt đầu bán. Chúng tôi cung cấp website riêng, tài liệu marketing và hỗ trợ kỹ thuật 24/7 cho đại lý.',
              },
              {
                question: 'Hoa hồng đại lý là bao nhiêu?',
                answer: 'Hoa hồng từ 20-40% tùy theo doanh số. Càng bán nhiều, hoa hồng càng cao. Ngoài ra còn có thưởng tháng và các chương trình khuyến mãi đặc biệt.',
              },
              {
                question: 'Có hỗ trợ kỹ thuật không?',
                answer: 'Có! Chúng tôi có đội ngũ kỹ thuật 24/7 qua Hotline, Facebook, Telegram. Thời gian phản hồi trung bình dưới 5 phút, giải quyết vấn đề trong 30 phút.',
              },
              {
                question: 'Proxy có bị chặn không?',
                answer: 'IP của chúng tôi được rotate thường xuyên và có tỷ lệ sạch rất cao. Nếu gặp IP bị chặn, chúng tôi sẽ thay thế ngay lập tức miễn phí.',
              },
            ].map((faq, index) => (
              <div key={index} className="group">
                <div className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-red-300">
                      {faq.question}
                    </h3>
                    <ChevronDown className="h-5 w-5 text-gray-400 transition-all duration-300 group-hover:rotate-180 group-hover:text-white" />
                  </div>
                  <div className="mt-4 text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 px-4 py-20">
        <div className="container mx-auto text-center">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-4xl font-bold lg:text-6xl">
              <span className="bg-gradient-to-r from-white via-red-200 to-orange-200 bg-clip-text text-transparent">
                Sẵn sàng bắt đầu?
              </span>
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-300">
              Tham gia cùng hàng nghìn đại lý thành công. Bắt đầu kinh doanh proxy ngay hôm nay với HomeProxy!
            </p>

            <div className="mb-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <button className="group flex transform items-center gap-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 px-10 py-5 text-xl font-bold transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-red-700 hover:shadow-2xl hover:shadow-red-500/25">
                <span>ĐĂNG KÝ ĐẠI LÝ NGAY</span>
                <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button className="flex items-center gap-3 rounded-2xl border-2 border-white/30 px-10 py-5 text-xl font-bold transition-all duration-300 hover:border-white/50 hover:bg-white/5">
                <Phone className="h-6 w-6" />
                <span>TƯ VẤN MIỄN PHÍ</span>
              </button>
            </div>

            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-3">
              {[
                { icon: <Clock className="h-8 w-8" />, text: 'Thiết lập trong 5 phút' },
                { icon: <Shield className="h-8 w-8" />, text: 'Đảm bảo hoàn tiền 7 ngày' },
                { icon: <Users className="h-8 w-8" />, text: 'Hỗ trợ 24/7 miễn phí' },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="text-red-400">
                    {item.icon}
                  </div>
                  <span className="font-medium text-gray-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
