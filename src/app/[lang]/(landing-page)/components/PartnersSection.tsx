'use client'

import React from 'react'

import { Star, Shield, CheckCircle, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useBranding } from '@/app/contexts/BrandingContext'
import { usePublicPartners } from '@/hooks/apis/usePartners'

const trustItems = [
  { icon: Star, number: '50+', labelKey: 'partners' },
  { icon: Shield, number: '99.9%', labelKey: 'reliability' },
  { icon: CheckCircle, number: '5+', labelKey: 'experience' }
]

const PartnersSection = () => {
  const { t } = useTranslation()
  const { name: appName } = useBranding()
  const { data: partners } = usePublicPartners()

  return (
    <section style={{ padding: '60px 24px', background: '#f8fafc' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              marginBottom: 12,
              color: 'var(--primary-hover, #ef4444)'
            }}
          >
            {t('landing.partners.title')}
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: 600, margin: '0 auto' }}>
            {t('landing.partners.subtitle', { appName: appName || '' })}
          </p>
        </div>

        {/* Partners Grid */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 20,
            marginBottom: 48
          }}
        >
          {partners?.length ? (
            partners.map(partner => {
              const hasLandingLogo = !!partner.logo_landing_url
              const hasLogo = !!partner.logo_url

              const card = (
                <div
                  key={partner.id}
                  style={{
                    width: 160,
                    height: 90,
                    backgroundColor: '#ffffff',
                    borderRadius: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    border: '1px solid #e2e8f0',
                    padding: '10px 12px',
                    cursor: partner.link ? 'pointer' : 'default',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                >
                  {hasLandingLogo ? (
                    <img
                      src={partner.logo_landing_url!}
                      alt={partner.name}
                      style={{
                        maxWidth: 130,
                        maxHeight: 50,
                        objectFit: 'contain'
                      }}
                    />
                  ) : hasLogo ? (
                    <img
                      src={partner.logo_url!}
                      alt={partner.name}
                      style={{
                        maxWidth: 120,
                        maxHeight: 36,
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary-hover, #ef4444)' }}>
                      {partner.name}
                    </span>
                  )}

                  {/* Tên hiện dưới logo nếu có ảnh */}
                  {(hasLandingLogo || hasLogo) && (
                    <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, lineHeight: 1 }}>
                      {partner.name}
                    </span>
                  )}

                  {/* External link indicator */}
                  {partner.link && (
                    <ExternalLink
                      size={10}
                      color='#cbd5e1'
                      style={{ position: 'absolute', top: 8, right: 8 }}
                    />
                  )}
                </div>
              )

              return partner.link ? (
                <a
                  key={partner.id}
                  href={partner.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{ textDecoration: 'none' }}
                >
                  {card}
                </a>
              ) : (
                <React.Fragment key={partner.id}>{card}</React.Fragment>
              )
            })
          ) : (
            // Fallback skeleton khi chưa có data
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 160,
                  height: 90,
                  backgroundColor: '#ffffff',
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{
                  width: 80,
                  height: 16,
                  borderRadius: 8,
                  background: 'linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite'
                }} />
              </div>
            ))
          )}
        </div>

        {/* Trust Indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {trustItems.map(item => (
            <div key={item.labelKey} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: 'rgba(239,68,68,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <item.icon size={20} color='var(--primary-hover, #ef4444)' />
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#1a202c' }}>{item.number}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  {t(`landing.partners.trust.${item.labelKey}`)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}} />
    </section>
  )
}

export default PartnersSection
