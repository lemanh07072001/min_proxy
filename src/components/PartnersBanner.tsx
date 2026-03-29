'use client'

import React, { useMemo } from 'react'

import type { ServerPartner } from '@/utils/getServerPartners'

interface Props {
  partners: ServerPartner[]
}

// Số item tối thiểu trên track để cuộn mượt (lấp đầy viewport + dư)
const MIN_ITEMS = 12

const PartnersBanner = ({ partners }: Props) => {
  // Nhân bản đủ để lấp đầy 2 lần viewport → cuộn infinite không bị trống
  const track = useMemo(() => {
    if (!partners?.length) return []

    const repeatCount = Math.max(Math.ceil(MIN_ITEMS / partners.length), 3)
    const oneSet = Array.from({ length: repeatCount }, () => partners).flat()

    // Cần 2 bản giống nhau liền kề để translateX(-50%) loop liền mạch
    return [...oneSet, ...oneSet]
  }, [partners])

  if (!partners?.length) return null

  // Tốc độ cuộn dựa trên số item thực (1 set)
  const oneSetCount = track.length / 2
  const duration = Math.max(oneSetCount * 3, 15)

  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        background: 'linear-gradient(90deg, #f8fafc 0%, #fff 50%, #f8fafc 100%)',
        borderBottom: '1px solid #e2e8f0',
        padding: '6px 0',
        flexShrink: 0,
        position: 'relative'
      }}
    >
      {/* Fade edges */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 60, height: '100%', background: 'linear-gradient(90deg, #f8fafc, transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: '100%', background: 'linear-gradient(270deg, #f8fafc, transparent)', zIndex: 2, pointerEvents: 'none' }} />

      {/* Scrolling track */}
      <div
        className='partners-scroll-track'
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 48,
          width: 'max-content',
          animation: `partnersScroll ${duration}s linear infinite`
        }}
      >
        {track.map((partner, index) => {
          const hasLogo = !!partner.logo_url

          const content = (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexShrink: 0,
                padding: '5px 16px',
                borderRadius: 20,
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid #f1f5f9',
                cursor: partner.link ? 'pointer' : 'default',
                transition: 'border-color 0.2s'
              }}
            >
              {hasLogo ? (
                <img
                  src={partner.logo_url!}
                  alt={partner.name}
                  loading='lazy'
                  style={{ height: 20, maxWidth: 90, objectFit: 'contain', flexShrink: 0 }}
                />
              ) : (
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--primary-color, #6366f1)', flexShrink: 0 }} />
              )}
              <span style={{ fontSize: 13, fontWeight: 600, color: '#475569', whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>
                {partner.name}
              </span>
            </div>
          )

          return partner.link ? (
            <a
              key={`p-${index}`}
              href={partner.link}
              target='_blank'
              rel='noopener noreferrer'
              style={{ textDecoration: 'none', flexShrink: 0 }}
            >
              {content}
            </a>
          ) : (
            <div key={`p-${index}`} style={{ flexShrink: 0 }}>
              {content}
            </div>
          )
        })}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes partnersScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .partners-scroll-track:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  )
}

export default PartnersBanner
