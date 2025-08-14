"use client"

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Zap,
  Globe,
  Server,
  Users,
  Star,
  ArrowRight,
  Menu,
  X,
  Phone,
  MessageCircle,
  Send,
  CheckCircle2,
  TrendingUp,
  Award,
  Clock,
  Wifi,
  Lock,
  Target,
  PlayCircle,
  ChevronDown
} from 'lucide-react';
import SkeletonBars from "@/components/animates/SkeletonBars";
import OrbitingElements from "@/components/animates/OrbitingElements";
import FloatingDots from "@/components/animates/FloatingDots";


export default function Page() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [stars, setStars] = useState<Star[]>([]);

  // Hàm tạo random 1 mảng sao
  const generateStars = () =>
    Array.from({ length: 100 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${2 + Math.random() * 3}s`,
    }));

  useEffect(() => {
    // Lần đầu sau khi hydrate → sinh sao
    setStars(generateStars());

    // Cứ mỗi X giây lại random lại
    const interval = setInterval(() => {
      setStars(generateStars());
    }, 1000); // 5 giây đổi vị trí

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Phủ sóng toàn quốc",
      desc: "Kết nối ổn định khắp 63 tỉnh thành",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "3 nhà mạng lớn",
      desc: "Viettel, FPT, VNPT - Tốc độ cao",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Website riêng",
      desc: "Đại lý được cấp trang bán hàng chuyên nghiệp",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Ưu tiên hàng đầu",
      desc: "Quyền lợi đại lý được đảm bảo tối đa",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const stats = [
    { number: "15K+", label: "Khách hàng tin tưởng", icon: <Users className="w-5 h-5" /> },
    { number: "99.9%", label: "Thời gian hoạt động", icon: <Clock className="w-5 h-5" /> },
    { number: "24/7", label: "Hỗ trợ không ngừng", icon: <Shield className="w-5 h-5" /> },
    { number: "500+", label: "Đại lý thành công", icon: <TrendingUp className="w-5 h-5" /> }
  ];

  const testimonials = [
    { name: "Anh Minh - TP.HCM", text: "Doanh thu tháng đầu đã đạt 50 triệu, hỗ trợ rất tận tình!", rating: 5 },
    { name: "Chị Lan - Hà Nội", text: "Proxy chất lượng cao, khách hàng rất hài lòng và quay lại nhiều.", rating: 5 },
    { name: "Anh Đức - Đà Nẵng", text: "Từ khi làm đại lý, thu nhập ổn định và tăng đều mỗi tháng.", rating: 5 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-blue-500/10 animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full">
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-twinkle"
              style={{
                left: star.left,
                top: star.top,
                animationDelay: star.delay,
                animationDuration: star.duration
              }}
            />
          ))}
        </div>
      </div>

      {/* Top Banner */}
      <div className="relative z-50 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 py-3 px-4">
        <div className="container mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="font-semibold">🔥 HOT:</span>
            </div>
            <span>Tuyển đại lý toàn quốc - Hoa hồng lên đến 40% - Hỗ trợ marketing 24/7</span>
          </div>
          <button className="hidden md:flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-full font-semibold transition-all duration-300 hover:scale-105">
            <Star className="w-4 h-4" />
            Đăng ký ngay
          </button>
        </div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-40 transition-all duration-500 ${scrollY > 50 ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 via-red-600 to-orange-500 rounded-2xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-red-600 font-bold text-lg">H</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  HOME<span className="text-red-400">PROXY</span>
                </h1>
                <p className="text-xs text-gray-400 font-medium">Proxy Việt Nam #1</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {['Trang chủ', 'Giới thiệu', 'Đại lý', 'Mua Proxy', 'Liên hệ'].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="relative text-gray-300 hover:text-white transition-colors duration-300 font-medium group py-2"
                >
                  {item}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300 font-medium">
                Đăng nhập
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25">
                Đăng ký ngay
              </button>
            </div>

            {/* Mobile Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 p-6 bg-black/50 backdrop-blur-xl rounded-2xl border border-white/10">
              <nav className="space-y-4">
                {['Trang chủ', 'Giới thiệu', 'Đại lý', 'Mua Proxy', 'Liên hệ'].map((item, index) => (
                  <a
                    key={index}
                    href="#"
                    className="block p-3 hover:bg-white/10 rounded-xl transition-colors duration-300 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <button className="w-full p-3 text-left hover:bg-white/10 rounded-xl transition-colors duration-300">
                    Đăng nhập
                  </button>
                  <button className="w-full p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl font-semibold">
                    Đăng ký ngay
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full border border-red-500/30">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-red-300">Đối tác tin cậy #1 Việt Nam</span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                    Proxy
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-500 bg-clip-text text-transparent">
                    Việt Nam
                  </span>
                  <br />
                  <span className="text-2xl lg:text-3xl font-medium text-gray-400">
                    Chất lượng cao
                  </span>
                </h1>

                <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                  Trở thành đại lý của chúng tôi và kiếm thu nhập ổn định với hệ thống proxy chất lượng cao nhất Việt Nam.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`group p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 cursor-pointer ${
                      activeFeature === index ? 'ring-2 ring-red-500/50 bg-white/10' : ''
                    }`}
                    onMouseEnter={() => setActiveFeature(index)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white group-hover:text-red-300 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors duration-300">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="group px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 flex items-center justify-center gap-3">
                  <PlayCircle className="w-6 h-6" />
                  <span>BẮT ĐẦU NGAY</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>

                <button className="px-8 py-4 border-2 border-white/20 hover:border-white/40 rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-white/5 flex items-center justify-center gap-3">
                  <Wifi className="w-5 h-5" />
                  Xem demo
                </button>
              </div>
            </div>

            {/* Right Visualization */}
            <div className="relative lg:h-[700px] flex items-center justify-center">
              <div className="relative w-full max-w-md">
                {/* Central Server */}
                <div className="relative z-20 mx-auto">
                  <div className="w-40 h-60 bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-600 overflow-hidden">
                    {/* Server Header */}
                    <div className="p-4 bg-gradient-to-r from-red-500 to-orange-500">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <div className="w-3 h-3 bg-white/80 rounded-full" />
                          <div className="w-3 h-3 bg-white/60 rounded-full" />
                          <div className="w-3 h-3 bg-white/40 rounded-full" />
                        </div>
                        <span className="text-white text-xs font-bold">VN</span>
                      </div>
                    </div>

                    {/* Server Body */}
                    <SkeletonBars/>

                    {/* Status Indicator */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-green-400 font-medium">● Online</span>
                        <span className="text-gray-400">99.9%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orbiting Elements */}
                <OrbitingElements/>

                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
                  {[...Array(8)].map((_, i) => {
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
                <FloatingDots/>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 text-center"
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Đại lý nói gì về chúng tôi
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Hàng nghìn đại lý đã thành công và kiếm được thu nhập ổn định cùng HomeProxy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
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
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Gói Proxy Chất Lượng Cao
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Lựa chọn gói proxy phù hợp với nhu cầu của bạn. Tất cả đều đảm bảo tốc độ cao và độ ổn định tuyệt đối.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Starter",
                price: "299K",
                period: "/tháng",
                description: "Phù hợp cho cá nhân và startup",
                features: [
                  "50 IP Việt Nam",
                  "Băng thông không giới hạn",
                  "Hỗ trợ HTTP/HTTPS",
                  "Uptime 99.5%",
                  "Hỗ trợ 24/7"
                ],
                popular: false,
                color: "from-blue-500 to-cyan-500"
              },
              {
                name: "Professional",
                price: "599K",
                period: "/tháng",
                description: "Tối ưu cho doanh nghiệp vừa",
                features: [
                  "200 IP Việt Nam",
                  "Băng thông không giới hạn",
                  "HTTP/HTTPS + SOCKS5",
                  "Uptime 99.9%",
                  "Hỗ trợ ưu tiên",
                  "API Management",
                  "Thống kê chi tiết"
                ],
                popular: true,
                color: "from-red-500 to-orange-500"
              },
              {
                name: "Enterprise",
                price: "1.299K",
                period: "/tháng",
                description: "Giải pháp toàn diện cho doanh nghiệp",
                features: [
                  "500+ IP Việt Nam",
                  "Băng thông không giới hạn",
                  "Tất cả protocols",
                  "Uptime 99.99%",
                  "Dedicated support",
                  "Custom API",
                  "White-label solution",
                  "SLA đảm bảo"
                ],
                popular: false,
                color: "from-purple-500 to-pink-500"
              }
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative group p-8 bg-white/5 backdrop-blur-sm rounded-3xl border transition-all duration-500 hover:scale-105 ${
                  plan.popular
                    ? 'border-red-500/50 bg-gradient-to-b from-red-500/10 to-transparent'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                      🔥 Phổ biến nhất
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center`}>
                    <Server className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transform hover:scale-105'
                    : 'border-2 border-white/20 hover:border-white/40 text-white hover:bg-white/5'
                }`}>
                  {plan.popular ? 'Chọn gói này' : 'Bắt đầu ngay'}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">Cần tư vấn gói phù hợp? Liên hệ ngay với chúng tôi</p>
            <button className="px-8 py-3 border-2 border-red-500/50 hover:bg-red-500/10 rounded-xl font-semibold transition-all duration-300">
              Tư vấn miễn phí
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Tại sao chọn HomeProxy?
                </span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Chúng tôi không chỉ cung cấp proxy, mà còn là đối tác tin cậy giúp bạn phát triển kinh doanh bền vững.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: <Shield className="w-6 h-6" />,
                    title: "Bảo mật tuyệt đối",
                    desc: "Mã hóa SSL 256-bit, không log hoạt động, đảm bảo quyền riêng tư 100%"
                  },
                  {
                    icon: <Zap className="w-6 h-6" />,
                    title: "Tốc độ vượt trội",
                    desc: "Hạ tầng server hiện đại, kết nối trực tiếp với ISP lớn, ping thấp"
                  },
                  {
                    icon: <Users className="w-6 h-6" />,
                    title: "Hỗ trợ chuyên nghiệp",
                    desc: "Đội ngũ kỹ thuật 24/7, phản hồi trong 5 phút, giải quyết mọi vấn đề"
                  },
                  {
                    icon: <Award className="w-6 h-6" />,
                    title: "Chất lượng đảm bảo",
                    desc: "SLA 99.9% uptime, hoàn tiền 100% nếu không hài lòng trong 7 ngày"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-red-300 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Server Status</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 text-sm font-medium">All Systems Operational</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { location: "Hà Nội", status: "99.9%", ping: "12ms", load: 85 },
                    { location: "TP.HCM", status: "99.8%", ping: "8ms", load: 72 },
                    { location: "Đà Nẵng", status: "100%", ping: "15ms", load: 68 },
                    { location: "Cần Thơ", status: "99.9%", ping: "18ms", load: 91 }
                  ].map((server, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <Globe className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-medium">{server.location}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-400">{server.status}</span>
                        <span className="text-gray-400">{server.ping}</span>
                        <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-1000"
                            style={{ width: `${server.load}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Câu hỏi thường gặp
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Giải đáp những thắc mắc phổ biến về dịch vụ proxy của chúng tôi
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "Proxy của HomeProxy có gì khác biệt?",
                answer: "Chúng tôi sử dụng hạ tầng server riêng tại Việt Nam, kết nối trực tiếp với các ISP lớn như Viettel, FPT, VNPT. Điều này đảm bảo tốc độ cao, độ ổn định tuyệt đối và IP sạch 100%."
              },
              {
                question: "Làm thế nào để trở thành đại lý?",
                answer: "Rất đơn giản! Chỉ cần đăng ký tài khoản, nạp tiền và bắt đầu bán. Chúng tôi cung cấp website riêng, tài liệu marketing và hỗ trợ kỹ thuật 24/7 cho đại lý."
              },
              {
                question: "Hoa hồng đại lý là bao nhiêu?",
                answer: "Hoa hồng từ 20-40% tùy theo doanh số. Càng bán nhiều, hoa hồng càng cao. Ngoài ra còn có thưởng tháng và các chương trình khuyến mãi đặc biệt."
              },
              {
                question: "Có hỗ trợ kỹ thuật không?",
                answer: "Có! Chúng tôi có đội ngũ kỹ thuật 24/7 qua Hotline, Facebook, Telegram. Thời gian phản hồi trung bình dưới 5 phút, giải quyết vấn đề trong 30 phút."
              },
              {
                question: "Proxy có bị chặn không?",
                answer: "IP của chúng tôi được rotate thường xuyên và có tỷ lệ sạch rất cao. Nếu gặp IP bị chặn, chúng tôi sẽ thay thế ngay lập tức miễn phí."
              }
            ].map((faq, index) => (
              <div key={index} className="group">
                <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white group-hover:text-red-300 transition-colors duration-300">
                      {faq.question}
                    </h3>
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white transition-all duration-300 group-hover:rotate-180" />
                  </div>
                  <div className="mt-4 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-red-200 to-orange-200 bg-clip-text text-transparent">
                Sẵn sàng bắt đầu?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Tham gia cùng hàng nghìn đại lý thành công. Bắt đầu kinh doanh proxy ngay hôm nay với HomeProxy!
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <button className="group px-10 py-5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 flex items-center gap-3">
                <span>ĐĂNG KÝ ĐẠI LÝ NGAY</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              <button className="px-10 py-5 border-2 border-white/30 hover:border-white/50 rounded-2xl font-bold text-xl transition-all duration-300 hover:bg-white/5 flex items-center gap-3">
                <Phone className="w-6 h-6" />
                <span>TƯ VẤN MIỄN PHÍ</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {[
                { icon: <Clock className="w-8 h-8" />, text: "Thiết lập trong 5 phút" },
                { icon: <Shield className="w-8 h-8" />, text: "Đảm bảo hoàn tiền 7 ngày" },
                { icon: <Users className="w-8 h-8" />, text: "Hỗ trợ 24/7 miễn phí" }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-red-400">
                    {item.icon}
                  </div>
                  <span className="text-gray-300 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-black/50 backdrop-blur-sm border-t border-white/10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-red-600 font-bold">H</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">HOME<span className="text-red-400">PROXY</span></h3>
                  <p className="text-gray-400 text-sm">Proxy Việt Nam #1</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Đối tác tin cậy cung cấp dịch vụ proxy chất lượng cao và cơ hội kinh doanh bền vững cho đại lý trên toàn quốc.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: <Phone className="w-5 h-5" />, color: "bg-green-500 hover:bg-green-600" },
                  { icon: <MessageCircle className="w-5 h-5" />, color: "bg-blue-600 hover:bg-blue-700" },
                  { icon: <Send className="w-5 h-5" />, color: "bg-blue-500 hover:bg-blue-600" }
                ].map((social, index) => (
                  <button
                    key={index}
                    className={`w-12 h-12 ${social.color} rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110`}
                  >
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Liên kết nhanh</h4>
              <ul className="space-y-3">
                {['Trang chủ', 'Giới thiệu', 'Đại lý', 'Mua Proxy', 'Hỗ trợ', 'Liên hệ'].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Liên hệ</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-red-400" />
                  <span className="text-gray-400">0123.456.789</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-red-400" />
                  <span className="text-gray-400">support@homeproxy.vn</span>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-red-400 mt-0.5" />
                  <span className="text-gray-400">Tầng 10, Tòa nhà ABC<br />123 Đường XYZ, Hà Nội</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 HomeProxy. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Điều khoản sử dụng
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Chính sách bảo mật
              </a>
            </div>
          </div>
        </div>
      </footer>
      {/* Social Sidebar */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-30 space-y-3">
        {[
          { icon: <Phone className="w-5 h-5" />, color: "bg-green-500 hover:bg-green-600", label: "Hotline" },
          { icon: <MessageCircle className="w-5 h-5" />, color: "bg-blue-600 hover:bg-blue-700", label: "Facebook" },
          { icon: <Send className="w-5 h-5" />, color: "bg-blue-500 hover:bg-blue-600", label: "Telegram" }
        ].map((social, index) => (
          <button
            key={index}
            className={`w-14 h-14 ${social.color} rounded-2xl flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:shadow-xl group shadow-lg`}
            title={social.label}
          >
            {social.icon}
            <div className="absolute right-16 bg-black/80 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              {social.label}
            </div>
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>

      {/* Custom Styles */}

    </div>
  );
}