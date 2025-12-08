import React from 'react'

import { MapPin, Globe, Shield, Zap, Clock, Users } from 'lucide-react'

const VietnamCoverageSection = () => {
  const features = [
    {
      icon: <Globe size={20} />,
      text: 'Hỗ trợ xây dựng website riêng miễn phí'
    },
    {
      icon: <Shield size={20} />,
      text: 'Nguồn proxy ổn định, đa dạng IP'
    },
    {
      icon: <Zap size={20} />,
      text: 'Gió nhẹp cạnh tranh, lợi nhuận hấp dẫn'
    },
    {
      icon: <Clock size={20} />,
      text: 'Hệ thống tự động hoàn toàn, dễ quản lý'
    },
    {
      icon: <Users size={20} />,
      text: 'Hỗ trợ kỹ thuật và marketing 24/7'
    }
  ]

  return (
    <section className='vietnam-coverage-section'>
      <div className='container-lg'>
        {/* Background Animation Elements */}
        <div className='coverage-bg-effects'>
          <div className='floating-network-node node-1'></div>
          <div className='floating-network-node node-2'></div>
          <div className='floating-network-node node-3'></div>
          <div className='floating-network-node node-4'></div>
          <div className='floating-network-node node-5'></div>

          {/* Animated Connection Lines */}
          <svg className='network-connections' width='100%' height='100%'>
            <defs>
              <linearGradient id='connectionGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                <stop offset='0%' stopColor='#ef4444' stopOpacity='0.6' />
                <stop offset='50%' stopColor='#f97316' stopOpacity='0.4' />
                <stop offset='100%' stopColor='#fbbf24' stopOpacity='0.2' />
              </linearGradient>
            </defs>

            <path
              d='M 100 100 Q 300 50 500 100 T 900 100'
              stroke='url(#connectionGradient)'
              strokeWidth='2'
              fill='none'
              className='animated-connection connection-1'
            />
            <path
              d='M 50 300 Q 250 200 450 300 T 850 300'
              stroke='url(#connectionGradient)'
              strokeWidth='2'
              fill='none'
              className='animated-connection connection-2'
            />
          </svg>
        </div>

        <div className='row align-items-center'>
          {/* Left Content */}
          <div className='col-lg-6'>
            {/* Main Title */}
            <div className='coverage-header'>
              <h2 className='coverage-main-title'>
                Có mặt hầu hết ở các tỉnh thành <span className='text-red'>Việt Nam</span>
              </h2>
              <p className='coverage-subtitle'>
                Mạng lưới máy chủ phủ sóng toàn diện, kết nối xuyên suốt 3 miền đất nước với công nghệ hiện đại nhất
              </p>
            </div>

            {/* Proxy Section */}
            <div className='proxy-info-section'>
              <h3 className='proxy-title'>Proxy Dân Cư tỉnh Việt Nam</h3>
              <p className='proxy-description'>
                Hệ thống máy chủ đặt tại nhiều khu vực trong điểm trên cả ba miền, đang từng bước mở rộng phủ sóng đủ 34
                tỉnh thành. Hạ tầng xây dựng với tiêu chuẩn ổn định cao, trang bị đầy đủ thiết bị dự phòng để luôn sẵn
                sàng, tránh tối đa mọi sự cố
              </p>

              {/* Features List */}
              <div className='features-list'>
                {features.map((feature, index) => (
                  <div key={index} className='feature-item-vietnam' style={{ '--animation-delay': `${index * 0.1}s` } as React.CSSProperties}>
                    <div className='feature-icon-vietnam'>{feature.icon}</div>
                    <span className='feature-text-vietnam'>{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className='coverage-cta'>
                <button className='btn-register-now'>
                  <span>ĐĂNG KÝ NGAY</span>
                  <div className='btn-shine-effect'></div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Vietnam Map */}
          <div className='col-lg-6'>
            <div className='vietnam-map-container'>
              {/* Vietnam Map SVG */}
              <div className='map-wrapper'>
                <svg className='vietnam-map' viewBox='0 0 400 600' width='400' height='600'>
                  <defs>
                    <linearGradient id='mapGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                      <stop offset='0%' stopColor='#374151' />
                      <stop offset='50%' stopColor='#4b5563' />
                      <stop offset='100%' stopColor='#6b7280' />
                    </linearGradient>
                    <linearGradient id='activeRegionGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                      <stop offset='0%' stopColor='#1f2937' />
                      <stop offset='100%' stopColor='#374151' />
                    </linearGradient>
                    <filter id='mapGlow'>
                      <feGaussianBlur stdDeviation='3' result='coloredBlur' />
                      <feMerge>
                        <feMergeNode in='coloredBlur' />
                        <feMergeNode in='SourceGraphic' />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Vietnam Map Shape - Simplified */}
                  <path
                    d='M200 50 L220 70 L240 90 L250 120 L260 150 L270 180 L280 210 L290 240 L300 270 L310 300 L320 330 L330 360 L340 390 L350 420 L360 450 L350 480 L340 510 L320 530 L300 540 L280 545 L260 540 L240 535 L220 525 L200 515 L180 505 L160 490 L140 470 L120 445 L110 415 L105 385 L100 355 L95 325 L90 295 L85 265 L80 235 L75 205 L70 175 L75 145 L85 115 L100 90 L120 70 L140 55 L160 45 L180 40 Z'
                    fill='url(#mapGradient)'
                    className='vietnam-outline'
                  />

                  {/* Active Regions */}
                  <path
                    d='M200 50 L220 70 L240 90 L250 120 L240 140 L220 150 L200 145 L180 140 L160 130 L150 110 L160 90 L180 70 Z'
                    fill='url(#activeRegionGradient)'
                    className='active-region region-north'
                  />

                  <path
                    d='M180 200 L200 210 L220 220 L240 230 L250 250 L240 270 L220 280 L200 275 L180 270 L160 260 L150 240 L160 220 Z'
                    fill='url(#activeRegionGradient)'
                    className='active-region region-central'
                  />

                  <path
                    d='M220 450 L240 460 L260 470 L280 480 L290 500 L280 520 L260 530 L240 525 L220 520 L200 510 L180 500 L170 480 L180 460 L200 455 Z'
                    fill='url(#activeRegionGradient)'
                    className='active-region region-south'
                  />

                  {/* Network Points */}
                  <circle cx='200' cy='100' r='8' fill='#ef4444' className='network-point point-1'>
                    <animate attributeName='r' values='8;12;8' dur='2s' repeatCount='indefinite' />
                  </circle>
                  <circle cx='200' cy='240' r='8' fill='#f97316' className='network-point point-2'>
                    <animate attributeName='r' values='8;12;8' dur='2s' repeatCount='indefinite' begin='0.7s' />
                  </circle>
                  <circle cx='230' cy='480' r='8' fill='#fbbf24' className='network-point point-3'>
                    <animate attributeName='r' values='8;12;8' dur='2s' repeatCount='indefinite' begin='1.4s' />
                  </circle>

                  {/* Connection Lines */}
                  <path
                    d='M200 100 Q215 170 200 240'
                    stroke='#ef4444'
                    strokeWidth='3'
                    fill='none'
                    className='connection-line line-1'
                    filter='url(#mapGlow)'
                  />
                  <path
                    d='M200 240 Q215 360 230 480'
                    stroke='#f97316'
                    strokeWidth='3'
                    fill='none'
                    className='connection-line line-2'
                    filter='url(#mapGlow)'
                  />

                  {/* Data Flow Particles */}
                  <circle r='3' fill='#22c55e' className='data-particle'>
                    <animateMotion dur='4s' repeatCount='indefinite'>
                      <path d='M200 100 Q215 170 200 240' />
                    </animateMotion>
                  </circle>
                  <circle r='3' fill='#3b82f6' className='data-particle'>
                    <animateMotion dur='4s' repeatCount='indefinite' begin='2s'>
                      <path d='M200 240 Q215 360 230 480' />
                    </animateMotion>
                  </circle>
                </svg>

                {/* Coverage Stats */}
                <div className='coverage-stats'>
                  <div className='stat-badge stat-64'>
                    <div className='stat-number'>64+</div>
                    <div className='stat-label'>Phủ khắp 3 miền Việt Nam</div>
                  </div>
                </div>

                {/* Floating Info Cards */}
                <div className='floating-info-card card-north'>
                  <div className='info-dot'></div>
                  <div className='info-text'>Miền Bắc</div>
                </div>
                <div className='floating-info-card card-central'>
                  <div className='info-dot'></div>
                  <div className='info-text'>Miền Trung</div>
                </div>
                <div className='floating-info-card card-south'>
                  <div className='info-dot'></div>
                  <div className='info-text'>Miền Nam</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VietnamCoverageSection
