'use client'

import React from 'react'

import { Star, Shield, CheckCircle } from 'lucide-react'

import { useTranslation } from 'react-i18next'

import { useLanguageSync } from '@/hooks/useLanguageSync'

const partners = [
  { name: 'PC', display: 'PC', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  { name: 'GemLogin', display: 'GEMLOGIN', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
  { name: 'PionLogin', display: 'PionLogin', color: '#1f2937', bg: 'rgba(31,41,55,0.08)' },
  { name: 'Viettel', display: 'viettel', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  { name: 'FPT', display: 'FPT', color: '#f97316', bg: 'rgba(249,115,22,0.08)' },
  { name: 'VNPT', display: 'VNPT', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' }
]

const trustItems = [
  { icon: Star, number: '50+', key: 'partners' },
  { icon: Shield, number: '99.9%', key: 'reliability' },
  { icon: CheckCircle, number: '5+', key: 'experience' }
]

const PartnersSection = () => {
  const { t } = useTranslation()

  useLanguageSync()

  return (
    <section
      style={{
        padding: '60px 0',
        background: '#f8fafc'
      }}
    >
      <div className='container-lg'>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              marginBottom: 12,
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
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
                background: 'white',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid rgba(0,0,0,0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default'
              }}
            >
              <span
                style={{
                  fontSize: partner.name === 'PC' ? 24 : 18,
                  fontWeight: 700,
                  color: partner.color,
                  letterSpacing: partner.name === 'Viettel' ? 1 : 0
                }}
              >
                {partner.display}
              </span>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 48,
            flexWrap: 'wrap'
          }}
        >
          {trustItems.map(item => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'rgba(239,68,68,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <item.icon size={20} style={{ color: '#ef4444' }} />
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#1a202c' }}>{item.number}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  {t(`landing.partners.trust.${item.key}`)}
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
