'use client'

import React from 'react'

import { Star, Shield, CheckCircle } from 'lucide-react'

import { useTranslation } from 'react-i18next'

const partners = [
  { name: 'PC', display: 'PC', color: '#ef4444' },
  { name: 'GemLogin', display: 'GEMLOGIN', color: '#3b82f6' },
  { name: 'PionLogin', display: 'PionLogin', color: '#1f2937' },
  { name: 'Viettel', display: 'viettel', color: '#ef4444' },
  { name: 'FPT', display: 'FPT', color: '#f97316' },
  { name: 'VNPT', display: 'VNPT', color: '#3b82f6' }
]

const trustItems = [
  { icon: Star, number: '50+', labelKey: 'partners' },
  { icon: Shield, number: '99.9%', labelKey: 'reliability' },
  { icon: CheckCircle, number: '5+', labelKey: 'experience' }
]

const PartnersSection = () => {
  const { t } = useTranslation()

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
              color: '#ef4444'
            }}
          >
            {t('landing.partners.title')}
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: 600, margin: '0 auto' }}>
            {t('landing.partners.subtitle', { appName: process.env.NEXT_PUBLIC_APP_NAME })}
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
          {partners.map(partner => (
            <div
              key={partner.name}
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
              <span style={{ fontSize: 18, fontWeight: 700, color: partner.color }}>
                {partner.display}
              </span>
            </div>
          ))}
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
                <item.icon size={20} color='#ef4444' />
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
    </section>
  )
}

export default PartnersSection
