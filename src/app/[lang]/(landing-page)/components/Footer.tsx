'use client'

import React from 'react'

import Image from 'next/image'

import { useParams } from 'next/navigation'

import { Shield, Facebook, Send } from 'lucide-react'

import { infoConfigs } from '@/configs/infoConfig'
import Link from '@/components/Link'

const companyLinks = [
  { label: 'Giới thiệu', href: '#' },
  { label: 'Chương trình đại lý', href: '#' },
  { label: 'Đối tác', href: '#' },
  { label: 'Sitemap', href: '#' }
]

const productLinks = [
  { label: 'Proxy tĩnh', href: '#' },
  { label: 'Proxy xoay', href: '#' }
]

const locationLinks = [
  { label: 'TP. Hồ Chí Minh', href: '#' },
  { label: 'Hà Nội', href: '#' },
  { label: 'Hưng Yên', href: '#' },
  { label: 'Tuyên Quang', href: '#' },
  { label: 'Bình Định', href: '#' }
]

const getStartedLinks = [
  { label: 'Trở thành CTV', href: '#' },
  { label: 'Trở thành đại lý', href: '#' },
  { label: 'Mua proxy giá rẻ', href: '#' },
  { label: 'Giao dịch tự động', href: '#' },
  { label: 'Trợ giúp', href: '#' }
]

const paymentMethods = ['VISA', 'MC', 'JCB', 'AMEX', 'UNION', 'PAYPAL', 'CRYPTO']

const linkStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.7)',
  textDecoration: 'none',
  fontSize: 14,
  display: 'block',
  marginBottom: 10,
  lineHeight: 1.6
}

const LinkColumn = ({ title, links }: { title: string; links: { label: string; href: string }[] }) => (
  <div>
    <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'white' }}>{title}</h4>
    {links.map(l => (
      <a key={l.label} href={l.href} style={linkStyle}>
        {l.label}
      </a>
    ))}
  </div>
)

const Footer = () => {
  const params = useParams()
  const locale = params.lang as string
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'MKT Proxy'

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
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
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
                background: 'linear-gradient(135deg, #ef4444, #f97316)',
                color: 'white',
                padding: '14px 32px',
                borderRadius: 50,
                fontWeight: 600,
                fontSize: 16
              }}
            >
              Đăng ký ngay
            </Link>
            <a
              href='#'
              style={{
                display: 'inline-block',
                textDecoration: 'none',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '12px 30px',
                borderRadius: 50,
                fontWeight: 600,
                fontSize: 16
              }}
            >
              Liên hệ tư vấn
            </a>
          </div>
        </div>
      </div>

      {/* Footer Links Grid */}
      <div style={{ padding: '48px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div
          style={{
            maxWidth: 1140,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 32
          }}
        >
          <LinkColumn title='Công ty' links={companyLinks} />
          <LinkColumn title='Sản phẩm' links={productLinks} />
          <LinkColumn title='Địa điểm nổi bật' links={locationLinks} />
          <LinkColumn title='Bắt đầu' links={getStartedLinks} />
        </div>
      </div>

      {/* Bottom Footer */}
      <div style={{ padding: '24px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div
          style={{
            maxWidth: 1140,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Shield size={28} color='#ef4444' />
            <span style={{ fontSize: 18, fontWeight: 700 }}>{appName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <a href='#' style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 13 }}>
              Chính sách bảo mật
            </a>
            <a href='#' style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 13 }}>
              Điều khoản dịch vụ
            </a>
            <a href='#' style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 13 }}>
              Chính sách hoàn tiền
            </a>
          </div>
        </div>
      </div>

      {/* Contact + Social */}
      <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <div style={{ marginBottom: 12, color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
          Liên hệ với chúng tôi
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <a
            href='#'
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: '#1877f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              textDecoration: 'none'
            }}
          >
            <Facebook size={18} />
          </a>
          <a
            href='#'
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: '#0088cc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              textDecoration: 'none'
            }}
          >
            <Send size={18} />
          </a>
        </div>
      </div>

      {/* Payment Methods */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {paymentMethods.map(m => (
            <div
              key={m}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              {m}
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div style={{ padding: '16px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
          © {new Date().getFullYear()} {appName}. All rights reserved.
        </div>
      </div>

      {/* Floating Contact Icons */}
      <div
        style={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginBottom: 100
        }}
      >
        {infoConfigs.map(item => (
          <Link href={item.link} key={item.key} target='_blank'>
            <Image src={item.icon} alt={item.title || 'Social Icon'} width={80} height={80} />
          </Link>
        ))}
      </div>
    </footer>
  )
}

export default Footer
