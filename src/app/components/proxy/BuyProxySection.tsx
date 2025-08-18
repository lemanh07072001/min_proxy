'use client';

import React, { useState } from 'react';
import { Shield, Zap, Globe, Star, CheckCircle, Phone, Mail, Plus, Minus, ArrowRight } from 'lucide-react';

const BuyProxySection = () => {
  const [selectedProvider, setSelectedProvider] = useState('viettel');
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [selectedLocation, setSelectedLocation] = useState('random');
  const [duration, setDuration] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [protocol, setProtocol] = useState('http');

  const providers = [
    {
      id: 'viettel',
      name: 'Viettel',
      logo: 'viettel',
      color: '#e53e3e',
      provinces: '45+ tỉnh thành',
      speed: '1Gbps',
      uptime: '99.9%',
      description: 'Mạng lưới phủ sóng rộng nhất Việt Nam'
    },
    {
      id: 'fpt',
      name: 'FPT',
      logo: 'FPT',
      color: '#f56500',
      provinces: '35+ tỉnh thành',
      speed: '1Gbps',
      uptime: '99.8%',
      description: 'Tốc độ ổn định, chất lượng cao'
    },
    {
      id: 'vnpt',
      name: 'VNPT',
      logo: 'VNPT',
      color: '#3182ce',
      provinces: '40+ tỉnh thành',
      speed: '1Gbps',
      uptime: '99.9%',
      description: 'Kết nối ổn định trên toàn quốc'
    }
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Cơ Bản',
      price: 15000,
      originalPrice: 20000,
      features: [
        'IPv4 dân cư Việt Nam',
        '10+ đầu IP tùy chọn',
        'Tốc độ 300 Mbps',
        'Uptime 99.5%',
        'Hỗ trợ HTTP/HTTPS'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 18000,
      originalPrice: 25000,
      features: [
        'IPv4 dân cư Việt Nam',
        '20+ đầu IP tùy chọn',
        'Tốc độ 550 Mbps',
        'Uptime 99.9%',
        'Hỗ trợ HTTP/HTTPS/SOCKS5',
        'Hỗ trợ ưu tiên'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Doanh Nghiệp',
      price: 25000,
      originalPrice: 35000,
      features: [
        'IPv4 dân cư Việt Nam',
        '50+ đầu IP tùy chọn',
        'Tốc độ 1 Gbps',
        'Uptime 99.99%',
        'Hỗ trợ tất cả giao thức',
        'Hỗ trợ 24/7',
        'API tùy chỉnh'
      ],
      popular: false
    }
  ];

  const locations = [
    { value: 'random', label: 'Random (Ngẫu nhiên)' },
    { value: 'hanoi', label: 'Hà Nội' },
    { value: 'hcm', label: 'TP. Hồ Chí Minh' },
    { value: 'danang', label: 'Đà Nẵng' },
    { value: 'haiphong', label: 'Hải Phong' },
    { value: 'cantho', label: 'Cần Thơ' }
  ];

  const durations = [
    { value: 1, label: '1 tháng', discount: 0 },
    { value: 3, label: '3 tháng', discount: 5 },
    { value: 6, label: '6 tháng', discount: 10 },
    { value: 12, label: '12 tháng', discount: 15 }
  ];

  const selectedPlanData = plans.find(p => p.id === selectedPlan);
  const selectedDuration = durations.find(d => d.value === duration);
  const basePrice = selectedPlanData?.price || 0;
  const discountAmount = basePrice * (selectedDuration?.discount || 0) / 100;
  const finalPrice = (basePrice - discountAmount) * quantity * duration;

  return (
    <section className="buy-proxy-section">
      {/* Hero Banner */}
      <div className="buy-proxy-hero">
        <div className="hero-bg">
          <div className="grid-pattern"></div>
          <div className="hero-gradient"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Mua <span className="text-highlight">Proxy Dân Cư</span> Chất Lượng Cao
            </h1>
            <p className="hero-subtitle">
              Chọn gói proxy phù hợp với nhu cầu của bạn. Hỗ trợ 3 nhà mạng lớn với uptime 99.9%
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">5000+</div>
                <div className="stat-label">Khách hàng</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Hỗ trợ</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            {/* Chọn nhà mạng */}
            <div className="selection-section">
              <h2 className="section-title">
                <span className="step-number">1</span>
                Chọn nhà mạng
              </h2>
              <div className="providers-grid">
                {providers.map((provider) => (
                  <div
                    key={provider.id}
                    className={`provider-card ${selectedProvider === provider.id ? 'active' : ''}`}
                    onClick={() => setSelectedProvider(provider.id)}
                    style={{ '--provider-color': provider.color }}
                  >
                    <div className="provider-header">
                      <div className="provider-logo">
                        {provider.logo}
                      </div>
                      <h3 className="provider-name">{provider.name}</h3>
                    </div>
                    <div className="provider-stats">
                      <div className="stat">
                        <Globe size={16} />
                        <span>{provider.provinces}</span>
                      </div>
                      <div className="stat">
                        <Zap size={16} />
                        <span>{provider.speed}</span>
                      </div>
                      <div className="stat">
                        <Shield size={16} />
                        <span>{provider.uptime}</span>
                      </div>
                    </div>
                    <p className="provider-description">{provider.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chọn gói */}
            <div className="selection-section">
              <h2 className="section-title">
                <span className="step-number">2</span>
                Chọn gói dịch vụ
              </h2>
              <div className="plans-grid">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`plan-card ${selectedPlan === plan.id ? 'active' : ''} ${plan.popular ? 'popular' : ''}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.popular && (
                      <div className="popular-badge">
                        <Star size={16} fill="white" />
                        <span>Phổ biến nhất</span>
                      </div>
                    )}
                    <div className="plan-header">
                      <h3 className="plan-name">{plan.name}</h3>
                      <div className="plan-pricing">
                        <span className="original-price">{plan.originalPrice.toLocaleString()}đ</span>
                        <span className="current-price">{plan.price.toLocaleString()}đ</span>
                        <span className="period">/tháng</span>
                      </div>
                    </div>
                    <div className="plan-features">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="feature-item">
                          <CheckCircle size={16} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cấu hình */}
            <div className="selection-section">
              <h2 className="section-title">
                <span className="step-number">3</span>
                Cấu hình chi tiết
              </h2>
              <div className="config-grid">
                <div className="config-item">
                  <label className="config-label">Vị trí địa lý</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="config-select"
                  >
                    {locations.map((location) => (
                      <option key={location.value} value={location.value}>
                        {location.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="config-item">
                  <label className="config-label">Thời gian sử dụng</label>
                  <div className="duration-options">
                    {durations.map((dur) => (
                      <button
                        key={dur.value}
                        className={`duration-btn ${duration === dur.value ? 'active' : ''}`}
                        onClick={() => setDuration(dur.value)}
                      >
                        <span className="duration-label">{dur.label}</span>
                        {dur.discount > 0 && (
                          <span className="duration-discount">-{dur.discount}%</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="config-item">
                  <label className="config-label">Số lượng proxy</label>
                  <div className="quantity-control">
                    <button
                      className="quantity-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="quantity-input"
                      min="1"
                    />
                    <button
                      className="quantity-btn"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="config-item">
                  <label className="config-label">Giao thức</label>
                  <select
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value)}
                    className="config-select"
                  >
                    <option value="http">HTTP/HTTPS</option>
                    <option value="socks5">SOCKS5</option>
                    <option value="all">Tất cả giao thức</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="order-summary">
              <h3 className="summary-title">Tóm tắt đơn hàng</h3>

              <div className="summary-item">
                <span className="item-label">Nhà mạng:</span>
                <span className="item-value">{providers.find(p => p.id === selectedProvider)?.name}</span>
              </div>

              <div className="summary-item">
                <span className="item-label">Gói dịch vụ:</span>
                <span className="item-value">{selectedPlanData?.name}</span>
              </div>

              <div className="summary-item">
                <span className="item-label">Thời gian:</span>
                <span className="item-value">{selectedDuration?.label}</span>
              </div>

              <div className="summary-item">
                <span className="item-label">Số lượng:</span>
                <span className="item-value">{quantity} proxy</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-pricing">
                <div className="pricing-item">
                  <span>Giá gốc:</span>
                  <span>{(selectedPlanData?.originalPrice || 0 * quantity * duration).toLocaleString()}đ</span>
                </div>

                {selectedDuration?.discount && selectedDuration.discount > 0 && (
                  <div className="pricing-item discount">
                    <span>Giảm giá ({selectedDuration.discount}%):</span>
                    <span>-{(discountAmount * quantity * duration).toLocaleString()}đ</span>
                  </div>
                )}

                <div className="pricing-total">
                  <span>Tổng tiền:</span>
                  <span className="total-amount">{finalPrice.toLocaleString()}đ</span>
                </div>
              </div>

              <button className="buy-now-btn">
                <span>Mua ngay</span>
                <ArrowRight size={20} />
              </button>

              <div className="guarantee">
                <Shield size={16} />
                <span>Đảm bảo hoàn tiền 100%</span>
              </div>
            </div>

            {/* Support */}
            <div className="support-card">
              <h4 className="support-title">Cần hỗ trợ?</h4>
              <div className="support-contacts">
                <a href="tel:0399169675" className="support-item">
                  <Phone size={16} />
                  <span>0399169675</span>
                </a>
                <a href="mailto:admin@homeproxy.vn" className="support-item">
                  <Mail size={16} />
                  <span>admin@homeproxy.vn</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuyProxySection;