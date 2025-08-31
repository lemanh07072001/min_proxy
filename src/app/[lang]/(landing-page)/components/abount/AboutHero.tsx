import React from 'react'

import { Shield, Award, Users, Globe, Star, CheckCircle } from 'lucide-react'

const AboutHero = () => {
  return (
    <section className='about-hero-modern'>
      <div className='about-hero-bg'>
        <div className='hero-gradient'></div>
        <div className='hero-particles'>
          <div className='particle particle-1'></div>
          <div className='particle particle-2'></div>
          <div className='particle particle-3'></div>
          <div className='particle particle-4'></div>
          <div className='particle particle-5'></div>
          <div className='particle particle-6'></div>
        </div>
      </div>

      <div className='container-lg'>
        <div className='row align-items-center min-vh-100'>
          <div className='col-lg-6'>
            <div className='about-hero-content'>
              <h1 className='about-hero-title-modern'>
                <span className='title-main'>Nhà cung cấp</span>
                <span className='title-highlight'>Proxy #1 Việt Nam</span>
              </h1>

              <p className='about-hero-subtitle-modern'>
                {process.env.NEXT_PUBLIC_APP_NAME} - Nền tảng proxy dân cư hàng đầu Việt Nam, là lựa chọn tin cậy của
                hơn 5000+ doanh nghiệp và chuyên gia để tối ưu hóa hiệu suất công việc và chinh phục các dự án quan
                trọng.
              </p>

              <div className='hero-features-modern'>
                <div className='feature-item-modern'>
                  <CheckCircle size={20} />
                  <span>Uptime 99.9% - Ổn định tuyệt đối</span>
                </div>
                <div className='feature-item-modern'>
                  <CheckCircle size={20} />
                  <span>Hỗ trợ 24/7 - Luôn sẵn sàng phục vụ</span>
                </div>
                <div className='feature-item-modern'>
                  <CheckCircle size={20} />
                  <span>Phủ sóng 64 tỉnh thành - Toàn quốc</span>
                </div>
              </div>

              <div className='hero-cta-modern'>
                <button className='btn-primary-modern'>
                  <span>Liên hệ tư vấn</span>
                </button>
                <button className='btn-secondary-modern'>
                  <span>Xem bảng giá</span>
                </button>
              </div>
            </div>
          </div>

          <div className='col-lg-6'>
            <div className='about-hero-visual-modern'>
              <div className='stats-grid'>
                <div className='stat-card stat-primary'>
                  <div className='stat-icon'>
                    <Users size={32} />
                  </div>
                  <div className='stat-content'>
                    <div className='stat-number'>5000+</div>
                    <div className='stat-label'>Khách hàng</div>
                  </div>
                </div>

                <div className='stat-card stat-success'>
                  <div className='stat-icon'>
                    <Globe size={32} />
                  </div>
                  <div className='stat-content'>
                    <div className='stat-number'>64</div>
                    <div className='stat-label'>Tỉnh thành</div>
                  </div>
                </div>

                <div className='stat-card stat-warning'>
                  <div className='stat-icon'>
                    <Award size={32} />
                  </div>
                  <div className='stat-content'>
                    <div className='stat-number'>99.9%</div>
                    <div className='stat-label'>Uptime</div>
                  </div>
                </div>

                <div className='stat-card stat-info'>
                  <div className='stat-icon'>
                    <Star size={32} />
                  </div>
                  <div className='stat-content'>
                    <div className='stat-number'>5+</div>
                    <div className='stat-label'>Năm kinh nghiệm</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutHero
