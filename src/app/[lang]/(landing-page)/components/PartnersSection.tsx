'use client'

import React from 'react'

const PartnersSection = () => {
  const partners = [
    {
      name: 'PC',
      logo: 'PC',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    },
    {
      name: 'GemLogin',
      logo: 'G',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      fullName: 'GEMLOGIN'
    },
    {
      name: 'PionLogin',
      logo: '🛡️',
      color: '#1f2937',
      bgColor: 'rgba(31, 41, 55, 0.1)',
      fullName: 'PionLogin'
    },
    {
      name: 'Viettel',
      logo: 'viettel',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      isImage: true
    },
    {
      name: 'FPT',
      logo: 'FPT',
      color: '#f97316',
      bgColor: 'rgba(249, 115, 22, 0.1)'
    },
    {
      name: 'VNPT',
      logo: 'VNPT',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    }
  ]

  return (
    <section className='partners-section'>
      {/* Background Effects */}
      <div className='partners-bg'>
        <div className='floating-shapes'>
          <div className='shape shape-1'></div>
          <div className='shape shape-2'></div>
          <div className='shape shape-3'></div>
          <div className='shape shape-4'></div>
        </div>

        {/* Animated Grid */}
        <div className='grid-pattern'>
          <svg width='100%' height='100%' className='grid-svg'>
            <defs>
              <pattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'>
                <path d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(239,68,68,0.1)' strokeWidth='1' />
              </pattern>
            </defs>
            <rect width='100%' height='100%' fill='url(#grid)' />
          </svg>
        </div>
      </div>

      <div className='container-lg'>
        {/* Header */}
        <div className='partners-header'>
          <h2 className='partners-title'>
            <span className='title-highlight'>Đối tác</span> của chúng tôi
          </h2>
          <p className='partners-subtitle'>
            Chọn chỗ gì mà không hợp tác cùng Home Proxy - Một trong những nhà cung cấp proxy uy tín và giá rẻ.
          </p>
        </div>

        {/* Partners Grid */}
        <div className='partners-grid'>
          <div className='partners-track'>
            {/* First set of partners */}
            {partners.map((partner, index) => (
              <div
                key={`${partner.name}-1`}
                className='partner-card'
                style={{
                  '--delay': `${index * 0.2}s`,
                  '--bg-color': partner.bgColor,
                  '--text-color': partner.color
                }}
              >
                <div className='partner-logo'>
                  {partner.name === 'Viettel' ? (
                    <div className='viettel-logo'>
                      <span className='viettel-text'>viettel</span>
                    </div>
                  ) : partner.name === 'GemLogin' ? (
                    <div className='gemlogin-logo'>
                      <span className='gem-icon'>G</span>
                      <span className='gem-text'>GEMLOGIN</span>
                    </div>
                  ) : partner.name === 'PionLogin' ? (
                    <div className='pion-logo'>
                      <span className='pion-icon'>🛡️</span>
                      <span className='pion-text'>PionLogin</span>
                    </div>
                  ) : partner.name === 'FPT' ? (
                    <div className='fpt-logo'>
                      <span className='fpt-text'>FPT</span>
                    </div>
                  ) : partner.name === 'VNPT' ? (
                    <div className='vnpt-logo'>
                      <span className='vnpt-text'>VNPT</span>
                    </div>
                  ) : (
                    <span className='partner-text'>{partner.logo}</span>
                  )}
                </div>
                <div className='partner-glow'></div>
              </div>
            ))}

            {/* Duplicate set for infinite scroll */}
            {partners.map((partner, index) => (
              <div
                key={`${partner.name}-2`}
                className='partner-card'
                style={{
                  '--delay': `${(index + partners.length) * 0.2}s`,
                  '--bg-color': partner.bgColor,
                  '--text-color': partner.color
                }}
              >
                <div className='partner-logo'>
                  {partner.name === 'Viettel' ? (
                    <div className='viettel-logo'>
                      <span className='viettel-text'>viettel</span>
                    </div>
                  ) : partner.name === 'GemLogin' ? (
                    <div className='gemlogin-logo'>
                      <span className='gem-icon'>G</span>
                      <span className='gem-text'>GEMLOGIN</span>
                    </div>
                  ) : partner.name === 'PionLogin' ? (
                    <div className='pion-logo'>
                      <span className='pion-icon'>🛡️</span>
                      <span className='pion-text'>PionLogin</span>
                    </div>
                  ) : partner.name === 'FPT' ? (
                    <div className='fpt-logo'>
                      <span className='fpt-text'>FPT</span>
                    </div>
                  ) : partner.name === 'VNPT' ? (
                    <div className='vnpt-logo'>
                      <span className='vnpt-text'>VNPT</span>
                    </div>
                  ) : (
                    <span className='partner-text'>{partner.logo}</span>
                  )}
                </div>
                <div className='partner-glow'></div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className='trust-indicators-partners'>
          <div className='trust-item-partner'>
            <div className='trust-icon'>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z'
                  fill='currentColor'
                />
              </svg>
            </div>
            <div className='trust-content'>
              <div className='trust-number'>50+</div>
              <div className='trust-label'>Đối tác tin cậy</div>
            </div>
          </div>

          <div className='trust-item-partner'>
            <div className='trust-icon'>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z'
                  fill='currentColor'
                />
              </svg>
            </div>
            <div className='trust-content'>
              <div className='trust-number'>99.9%</div>
              <div className='trust-label'>Độ tin cậy</div>
            </div>
          </div>

          <div className='trust-item-partner'>
            <div className='trust-icon'>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z'
                  fill='currentColor'
                />
              </svg>
            </div>
            <div className='trust-content'>
              <div className='trust-number'>5+</div>
              <div className='trust-label'>Năm kinh nghiệm</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PartnersSection
