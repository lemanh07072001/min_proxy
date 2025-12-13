'use client'

import React from 'react'
import Image from 'next/image'

import { Star, Quote } from 'lucide-react'

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Nguyễn Thanh Bình',
      role: 'Kinh doanh proxy full time',
      avatar:
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      rating: 5,
      content: `Tôi là đại lý từ những ngày đầu ${process.env.NEXT_PUBLIC_APP_NAME} ra mắt và rất bất ngờ với sự chuyên nghiệp trong cách vận hành và hỗ trợ. Tôi có website riêng được tùy chỉnh theo ý mình, chính sách rõ ràng, chăm sóc kỹ lưỡng. Đây là nền tảng đáng tin cậy và nghiêm túc trong mảng proxy.`
    },
    {
      id: 2,
      name: 'Nguyễn Hoa',
      role: 'Đại lý kinh doanh proxy tại TP.HCM',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      rating: 5,
      content: `Ban đầu tôi rất ngại bán hàng qua web vì sợ phức tạp và chi phí cao. Nhưng từ khi tham gia chương trình đại lý web riêng của ${process.env.NEXT_PUBLIC_APP_NAME}, tôi được hỗ trợ tận tình, miễn phí web riêng và tăng hẳn 3 triệu trải nghiệm. Giờ tôi bán proxy ổn định hàng tháng, khởi đầu nhẹ nhàng đồng thú.`
    },
    {
      id: 3,
      name: 'Vũ Huy',
      role: `Đối tác web riêng ${process.env.NEXT_PUBLIC_APP_NAME}`,
      avatar:
        'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      rating: 5,
      content: `Tôi hài lòng khi tìm đại lý ${process.env.NEXT_PUBLIC_APP_NAME} vì cảm giác được đồng hành thật sự. Không chỉ lấy sản phẩm bán lại, tôi được hỗ trợ thiết kế web riêng chuyên nghiệp, xây dựng thương hiệu có nhận rõ ràng, tạo sự tin tưởng với khách hàng và luôn được ${process.env.NEXT_PUBLIC_APP_NAME} hỗ trợ khi cần.`
    },
    {
      id: 4,
      name: 'Trần Văn Nam',
      role: 'Chuyên gia marketing online',
      avatar:
        'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      rating: 5,
      content: `Sau nhiều năm sử dụng proxy từ nhiều nhà cung cấp khác nhau, tôi thấy ${process.env.NEXT_PUBLIC_APP_NAME} có chất lượng ổn định nhất. IP sạch, tốc độ nhanh, ít bị block. Đặc biệt là team support rất nhiệt tình, giải quyết vấn đề nhanh chóng 24/7.`
    },
    {
      id: 5,
      name: 'Phạm Thị Lan',
      role: 'Quản lý dự án digital',
      avatar:
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      rating: 5,
      content: `${process.env.NEXT_PUBLIC_APP_NAME} đã giúp công ty chúng tôi tiết kiệm rất nhiều chi phí và thời gian. Hệ thống proxy ổn định, dễ sử dụng, và quan trọng nhất là có đội ngũ kỹ thuật hỗ trợ chuyên nghiệp. Chúng tôi rất hài lòng với dịch vụ này.`
    }
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'star-filled' : 'star-empty'}
        fill={index < rating ? '#ff4444' : 'none'}
        color='#ff4444'
      />
    ))
  }

  // @ts-ignore
  return (
    <section className='testimonials-section'>
      {/* Animated Background */}
      <div className='testimonials-bg'>
        {/* Geometric Shapes */}
        <div className='bg-shape shape-1'></div>
        <div className='bg-shape shape-2'></div>
        <div className='bg-shape shape-3'></div>
        <div className='bg-shape shape-4'></div>
        <div className='bg-shape shape-5'></div>

        {/* Network Lines */}
        <svg className='network-lines' width='100%' height='100%'>
          <defs>
            <linearGradient id='lineGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stopColor='rgba(255,255,255,0.3)' />
              <stop offset='50%' stopColor='rgba(255,255,255,0.1)' />
              <stop offset='100%' stopColor='rgba(255,255,255,0.05)' />
            </linearGradient>
          </defs>

          <path
            d='M 0 100 Q 200 50 400 100 T 800 100'
            stroke='url(#lineGradient)'
            strokeWidth='1'
            fill='none'
            className='animated-line line-1'
          />
          <path
            d='M 100 0 Q 300 150 500 0 T 900 0'
            stroke='url(#lineGradient)'
            strokeWidth='1'
            fill='none'
            className='animated-line line-2'
          />
          <path
            d='M 0 300 Q 250 200 500 300 T 1000 300'
            stroke='url(#lineGradient)'
            strokeWidth='1'
            fill='none'
            className='animated-line line-3'
          />
        </svg>

        {/* Floating Particles */}
        <div className='floating-particles'>
          <div className='particle particle-1'></div>
          <div className='particle particle-2'></div>
          <div className='particle particle-3'></div>
          <div className='particle particle-4'></div>
          <div className='particle particle-5'></div>
          <div className='particle particle-6'></div>
          <div className='particle particle-7'></div>
          <div className='particle particle-8'></div>
        </div>
      </div>

      <div className='container-lg'>
        {/* Header */}
        <div className='testimonials-header'>
          <h2 className='testimonials-title'>
            <span className='title-number'>100+</span>
            <span className='title-text'>Khách hàng cả nước</span>
          </h2>
        </div>

        {/* Testimonials Slider */}
        <div className='testimonials-grid'>
          <div className='row'>
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div key={testimonial.id} className='col-lg-4 col-md-6 mb-4'>
                <div className='testimonial-card' style={{ '--animation-delay': `${index * 0.2}s` } as React.CSSProperties}>
                  {/* Quote Icon */}
                  <div className='quote-icon'>
                    <Quote size={24} color='rgba(255,68,68,0.3)' />
                  </div>

                  {/* User Info */}
                  <div className='user-info'>
                    <div className='user-avatar'>
                      <Image src={testimonial.avatar} alt={testimonial.name} width={100} height={100} />
                      <div className='avatar-ring'></div>
                    </div>
                    <div className='user-details'>
                      <h4 className='user-name'>{testimonial.name}</h4>
                      <p className='user-role'>{testimonial.role}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className='rating'>{renderStars(testimonial.rating)}</div>

                  {/* Content */}
                  <div className='testimonial-content'>
                    <p>{testimonial.content}</p>
                  </div>

                  {/* Card Shine Effect */}
                  <div className='card-shine'></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Stats */}
        <div className='trust-stats'>
          <div className='row'>
            <div className='col-md-3 col-6'>
              <div className='stat-item'>
                <div className='stat-icon'>
                  <svg width='32' height='32' viewBox='0 0 32 32' fill='none'>
                    <circle cx='16' cy='16' r='16' fill='rgba(255,255,255,0.1)' />
                    <path
                      d='M16 8C12.686 8 10 10.686 10 14C10 17.314 12.686 20 16 20C19.314 20 22 17.314 22 14C22 10.686 19.314 8 16 8ZM16 18C13.791 18 12 16.209 12 14C12 11.791 13.791 10 16 10C18.209 10 20 11.791 20 14C20 16.209 18.209 18 16 18Z'
                      fill='white'
                    />
                    <circle cx='16' cy='14' r='2' fill='white' />
                    <path d='M8 24C8 20.686 10.686 18 14 18H18C21.314 18 24 20.686 24 24V26H8V24Z' fill='white' />
                  </svg>
                </div>
                <div className='stat-number'>1000+</div>
                <div className='stat-label'>Khách hàng tin tưởng</div>
              </div>
            </div>
            <div className='col-md-3 col-6'>
              <div className='stat-item'>
                <div className='stat-icon'>
                  <svg width='32' height='32' viewBox='0 0 32 32' fill='none'>
                    <circle cx='16' cy='16' r='16' fill='rgba(255,255,255,0.1)' />
                    <path
                      d='M16 4C9.373 4 4 9.373 4 16C4 22.627 9.373 28 16 28C22.627 28 28 22.627 28 16C28 9.373 22.627 4 16 4ZM16 26C10.486 26 6 21.514 6 16C6 10.486 10.486 6 16 6C21.514 6 26 10.486 26 16C26 21.514 21.514 26 16 26Z'
                      fill='white'
                    />
                    <path
                      d='M21 11L14 18L11 15'
                      stroke='white'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                <div className='stat-number'>99.9%</div>
                <div className='stat-label'>Thời gian hoạt động</div>
              </div>
            </div>
            <div className='col-md-3 col-6'>
              <div className='stat-item'>
                <div className='stat-icon'>
                  <svg width='32' height='32' viewBox='0 0 32 32' fill='none'>
                    <circle cx='16' cy='16' r='16' fill='rgba(255,255,255,0.1)' />
                    <path
                      d='M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2ZM16 28C9.373 28 4 22.627 4 16C4 9.373 9.373 4 16 4C22.627 4 28 9.373 28 16C28 22.627 22.627 28 16 28Z'
                      fill='white'
                    />
                    <path
                      d='M16 8V16L22 19'
                      stroke='white'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                <div className='stat-number'>24/7</div>
                <div className='stat-label'>Hỗ trợ kỹ thuật</div>
              </div>
            </div>
            <div className='col-md-3 col-6'>
              <div className='stat-item'>
                <div className='stat-icon'>
                  <svg width='32' height='32' viewBox='0 0 32 32' fill='none'>
                    <circle cx='16' cy='16' r='16' fill='rgba(255,255,255,0.1)' />
                    <rect x='8' y='10' width='16' height='12' rx='2' fill='none' stroke='white' strokeWidth='2' />
                    <rect x='10' y='12' width='12' height='2' fill='white' />
                    <rect x='10' y='16' width='8' height='2' fill='white' />
                    <rect x='10' y='20' width='6' height='2' fill='white' />
                    <path
                      d='M12 10V8C12 6.895 12.895 6 14 6H18C19.105 6 20 6.895 20 8V10'
                      stroke='white'
                      strokeWidth='2'
                      strokeLinecap='round'
                    />
                  </svg>
                </div>
                <div className='stat-number'>3</div>
                <div className='stat-label'>Nhà mạng lớn</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
