'use client'

import React from 'react'

import { Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Thanh Bình',
    initials: 'NB',
    role: 'Kinh doanh proxy full time',
    color: 'var(--primary-hover, #ef4444)',
    content: `Tôi là đại lý từ những ngày đầu ra mắt và rất bất ngờ với sự chuyên nghiệp trong cách vận hành và hỗ trợ. Website riêng được tùy chỉnh theo ý mình, chính sách rõ ràng, chăm sóc kỹ lưỡng.`
  },
  {
    id: 2,
    name: 'Nguyễn Hoa',
    initials: 'NH',
    role: 'Đại lý kinh doanh proxy tại TP.HCM',
    color: '#3b82f6',
    content: `Ban đầu tôi rất ngại bán hàng qua web vì sợ phức tạp. Từ khi tham gia chương trình đại lý, tôi được hỗ trợ tận tình, miễn phí web riêng. Giờ tôi bán proxy ổn định hàng tháng.`
  },
  {
    id: 3,
    name: 'Trần Văn Nam',
    initials: 'TN',
    role: 'Chuyên gia marketing online',
    color: '#f97316',
    content: `Sau nhiều năm sử dụng proxy từ nhiều nhà cung cấp, chất lượng ở đây ổn định nhất. IP sạch, tốc độ nhanh, ít bị block. Team support rất nhiệt tình, giải quyết vấn đề nhanh 24/7.`
  }
]

const stats = [
  { number: '1000+', label: 'Khách hàng tin tưởng' },
  { number: '99.9%', label: 'Thời gian hoạt động' },
  { number: '24/7', label: 'Hỗ trợ kỹ thuật' },
  { number: '3', label: 'Nhà mạng lớn' }
]

const TestimonialsSection = () => {
  return (
    <section style={{ padding: '60px 24px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-hover, #ef4444)', lineHeight: 1.2 }}>100+</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white', marginTop: 4 }}>Khách hàng cả nước</div>
        </div>

        {/* Testimonial Cards */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', marginBottom: 48 }}>
          {testimonials.map(item => (
            <div
              key={item.id}
              style={{
                flex: '1 1 320px',
                maxWidth: 380,
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: 16,
                padding: 24,
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {/* User */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  backgroundColor: item.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: 16, flexShrink: 0
                }}>
                  {item.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{item.role}</div>
                </div>
              </div>
              {/* Stars */}
              <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={14} fill='var(--primary-hover, #ef4444)' color='var(--primary-hover, #ef4444)' />
                ))}
              </div>
              {/* Content */}
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                {item.content}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'white' }}>{s.number}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
