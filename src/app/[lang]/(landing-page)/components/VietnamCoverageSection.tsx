'use client'

import React from 'react'

import { useParams } from 'next/navigation'

import { Globe, Shield, Zap, Clock, Users } from 'lucide-react'

import Link from '@/components/Link'

const features = [
  { icon: Globe, text: 'Hỗ trợ xây dựng website riêng miễn phí' },
  { icon: Shield, text: 'Nguồn proxy ổn định, đa dạng IP' },
  { icon: Zap, text: 'Giá cạnh tranh, lợi nhuận hấp dẫn' },
  { icon: Clock, text: 'Hệ thống tự động hoàn toàn, dễ quản lý' },
  { icon: Users, text: 'Hỗ trợ kỹ thuật và marketing 24/7' }
]

const regions = [
  { name: 'Miền Bắc', provinces: 'Hà Nội, Hải Phòng, Quảng Ninh...', color: '#ef4444' },
  { name: 'Miền Trung', provinces: 'Đà Nẵng, Huế, Khánh Hòa...', color: '#f97316' },
  { name: 'Miền Nam', provinces: 'TP.HCM, Bình Dương, Đồng Nai...', color: '#eab308' }
]

const VietnamCoverageSection = () => {
  const params = useParams()
  const locale = params.lang as string

  return (
    <section style={{ padding: '60px 24px', background: '#ffffff' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
          {/* Left: Content */}
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a202c', marginBottom: 8, lineHeight: 1.3 }}>
              Có mặt hầu hết ở các tỉnh thành <span style={{ color: '#ef4444' }}>Việt Nam</span>
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', marginBottom: 24, lineHeight: 1.7 }}>
              Mạng lưới máy chủ phủ sóng toàn diện, kết nối xuyên suốt 3 miền đất nước với công nghệ hiện đại nhất
            </p>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a202c', marginBottom: 16 }}>
              Proxy Dân Cư tỉnh Việt Nam
            </h3>

            {/* Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    backgroundColor: 'rgba(239,68,68,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <f.icon size={16} color='#ef4444' />
                  </div>
                  <span style={{ fontSize: 14, color: '#475569' }}>{f.text}</span>
                </div>
              ))}
            </div>

            <Link href={`/${locale}/register`} style={{
              display: 'inline-block', textDecoration: 'none',
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              color: 'white', border: 'none', padding: '12px 28px',
              borderRadius: 50, fontWeight: 600, fontSize: 15, cursor: 'pointer'
            }}>
              ĐĂNG KÝ NGAY
            </Link>
          </div>

          {/* Right: Region Cards */}
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              textAlign: 'center', padding: 20, borderRadius: 16,
              background: 'linear-gradient(135deg, #1e293b, #334155)', color: 'white', marginBottom: 8
            }}>
              <div style={{ fontSize: 36, fontWeight: 800 }}>64+</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Phủ khắp 3 miền Việt Nam</div>
            </div>
            {regions.map(r => (
              <div key={r.name} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '16px 20px', borderRadius: 12,
                backgroundColor: '#f8fafc', border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%', backgroundColor: r.color, flexShrink: 0
                }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: '#1a202c' }}>{r.name}</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>{r.provinces}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default VietnamCoverageSection
