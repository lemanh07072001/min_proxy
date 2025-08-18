"use client"

import React from 'react';

import { Shield, Zap, Globe, Users, ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero-main">
      {/* Animated Background */}
      <div className="hero-background">
        <div className="network-animation">
          <div className="network-node node-1"></div>
          <div className="network-node node-2"></div>
          <div className="network-node node-3"></div>
          <div className="network-node node-4"></div>
          <div className="network-node node-5"></div>
          <div className="network-connection connection-1"></div>
          <div className="network-connection connection-2"></div>
          <div className="network-connection connection-3"></div>
          <div className="network-connection connection-4"></div>
        </div>

        <div className="floating-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
      </div>

      <div className="container">
        <div className="row align-items-center min-vh-100">
          {/* Left Content */}
          <div className="col-lg-6">
            <div className="hero-content">
              {/* Badge */}
              <div className="hero-badge">
                <Shield size={16} />
                <span>Dịch vụ Proxy #1 Việt Nam</span>
              </div>

              {/* Main Title */}
              <h1 className="hero-title">
                <span className="title-line-1">PROXY VIỆT NAM</span>
                <span className="title-line-2">Tốc độ cao - Ổn định</span>
              </h1>

              {/* Subtitle */}
              <p className="hero-subtitle">
                Dịch vụ proxy dân cư chất lượng cao với hệ thống phủ sóng toàn quốc.
                Hỗ trợ đầy đủ 3 nhà mạng lớn: Viettel, FPT, VNPT với tốc độ lên đến 1Gbps.
              </p>

              {/* Key Features */}
              <div className="hero-features">
                <div className="feature-item">
                  <div className="feature-icon">
                    <Globe size={20} />
                  </div>
                  <span>Phủ sóng 64 tỉnh thành</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <Zap size={20} />
                  </div>
                  <span>Tốc độ lên đến 1Gbps</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <Shield size={20} />
                  </div>
                  <span>Uptime 99.9%</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <Users size={20} />
                  </div>
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="hero-actions">
                <button className="btn-primary">
                  <span>Mua Proxy Ngay</span>
                  <ArrowRight size={20} />
                </button>
                <button className="btn-secondary">
                  <Play size={18} />
                  <span>Xem Demo</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="trust-indicators">
                <div className="trust-item">
                  <div className="trust-number">5000+</div>
                  <div className="trust-label">Khách hàng</div>
                </div>
                <div className="trust-item">
                  <div className="trust-number">99.9%</div>
                  <div className="trust-label">Uptime</div>
                </div>
                <div className="trust-item">
                  <div className="trust-number">24/7</div>
                  <div className="trust-label">Hỗ trợ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="col-lg-6">
            <div className="hero-visual">
              {/* Main Server Illustration */}
              <div className="server-container">
                <div className="server-main">
                  <div className="server-screen">
                    <div className="screen-content">
                      <div className="status-bar">
                        <div className="status-dot active"></div>
                        <div className="status-dot active"></div>
                        <div className="status-dot"></div>
                      </div>
                      <div className="data-flow">
                        <div className="data-line"></div>
                        <div className="data-line"></div>
                        <div className="data-line"></div>
                      </div>
                    </div>
                  </div>
                  <div className="server-base">
                    <div className="server-light"></div>
                    <div className="server-light"></div>
                    <div className="server-light"></div>
                  </div>
                </div>

                {/* Network Connections */}
                <div className="network-visual">
                  <div className="connection-point point-1">
                    <div className="point-pulse"></div>
                    <span>Viettel</span>
                  </div>
                  <div className="connection-point point-2">
                    <div className="point-pulse"></div>
                    <span>FPT</span>
                  </div>
                  <div className="connection-point point-3">
                    <div className="point-pulse"></div>
                    <span>VNPT</span>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="floating-card card-1">
                  <div className="card-icon">
                    <Shield size={24} />
                  </div>
                  <div className="card-content">
                    <div className="card-title">Bảo mật cao</div>
                    <div className="card-desc">SSL/TLS</div>
                  </div>
                </div>

                <div className="floating-card card-2">
                  <div className="card-icon">
                    <Zap size={24} />
                  </div>
                  <div className="card-content">
                    <div className="card-title">Tốc độ cao</div>
                    <div className="card-desc">1Gbps</div>
                  </div>
                </div>

                <div className="floating-card card-3">
                  <div className="card-icon">
                    <Globe size={24} />
                  </div>
                  <div className="card-content">
                    <div className="card-title">Toàn quốc</div>
                    <div className="card-desc">64 tỉnh</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;