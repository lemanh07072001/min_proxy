'use client'

import React from 'react'

import { useParams } from 'next/navigation'

import { Shield } from 'lucide-react'

import Link from '@/components/Link'
import { useBranding } from '@/app/contexts/BrandingContext'
import { SOCIAL_ICON_MAP } from '@/components/icons/SocialIcons'

const linkStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.7)',
  textDecoration: 'none',
  fontSize: 14,
  display: 'block',
  marginBottom: 10,
  lineHeight: 1.6
}

const Footer = () => {
  const params = useParams()
  const locale = params.lang as string
  const {
    name: appName,
    social_links,
    organization_phone,
    organization_email,
    organization_address,
    footer_text,
    favicon,
  } = useBranding()

  const socialLinks = (social_links || []).filter((l: any) => l.url)

  return (
    <footer
      style={{
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        color: 'white',
        position: 'relative'
      }}
    >
      {/* CTA Section */}
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              marginBottom: 16,
              background: 'var(--primary-gradient, linear-gradient(135deg, #ef4444, #f97316))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Bắt đầu ngay hôm nay
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: 32, lineHeight: 1.7 }}>
            Trải nghiệm dịch vụ proxy chất lượng cao với giá cả cạnh tranh nhất thị trường
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href={`/${locale}/register`}
              style={{
                display: 'inline-block',
                textDecoration: 'none',
                background: 'var(--primary-gradient, linear-gradient(135deg, #ef4444, #f97316))',
                color: 'white',
                padding: '14px 32px',
                borderRadius: 50,
                fontWeight: 600,
                fontSize: 16
              }}
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>

      {/* Footer content */}
      <div style={{ padding: '40px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          {/* Thông tin site — full width */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            {favicon ? (
              <img src={favicon} alt='' style={{ width: 24, height: 24, objectFit: 'contain' }} />
            ) : (
              <Shield size={20} color='var(--primary-hover, #ef4444)' />
            )}
            <span style={{ fontSize: 16, fontWeight: 700 }}>{appName || 'Proxy Service'}</span>
          </div>
          <div style={{ marginBottom: 24, fontSize: 13, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)' }}>
            {organization_address && <span>📍 {organization_address}</span>}
            {organization_phone && <span style={{ marginLeft: organization_address ? 16 : 0 }}>📞 {organization_phone}</span>}
            {organization_email && <span style={{ marginLeft: 16 }}>✉️ {organization_email}</span>}
          </div>

          {/* Grid: Sản phẩm + Hỗ trợ + Kết nối — mobile 2 cột */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 24
            }}
          >
            {/* Sản phẩm */}
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'white' }}>Sản phẩm</h4>
              <Link href={`/${locale}/proxy-tinh`} style={linkStyle}>Proxy tĩnh</Link>
              <Link href={`/${locale}/proxy-xoay`} style={linkStyle}>Proxy xoay</Link>
              <Link href={`/${locale}/recharge`} style={linkStyle}>Nạp tiền</Link>
              <Link href={`/${locale}/api-docs`} style={linkStyle}>API Docs</Link>
            </div>

            {/* Hỗ trợ */}
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'white' }}>Hỗ trợ</h4>
              <Link href={`/${locale}/support-tickets`} style={linkStyle}>Ticket hỗ trợ</Link>
              <Link href={`/${locale}/contact`} style={linkStyle}>Liên hệ</Link>
            </div>

            {/* Mạng xã hội */}
            {socialLinks.length > 0 && (
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'white' }}>Kết nối</h4>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {socialLinks.map((link: any, i: number) => {
                  const SvgIcon = SOCIAL_ICON_MAP[link.platform]

                  return (
                    <a
                      key={i}
                      href={link.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      title={link.platform}
                      style={{ textDecoration: 'none' }}
                    >
                      {SvgIcon ? <SvgIcon size={36} /> : (
                        <div style={{
                          width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontSize: 12, fontWeight: 600
                        }}>
                          {link.platform?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ padding: '16px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
          {footer_text || `© ${new Date().getFullYear()} ${appName || 'Proxy Service'}. All rights reserved.`}
        </div>
      </div>
    </footer>
  )
}

export default Footer
