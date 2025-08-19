import React from 'react'

import { Target, Eye, Heart, Zap, Shield, Users, Globe, Award } from 'lucide-react'

const MissionVision = () => {
  const commitments = [
    {
      icon: <Shield size={20} />,
      text: 'Uptime 99.9% cho tất cả dịch vụ'
    },
    {
      icon: <Users size={20} />,
      text: 'Hỗ trợ kỹ thuật chuyên nghiệp 24/7'
    },
    {
      icon: <Award size={20} />,
      text: 'Giá cả cạnh tranh và chính sách ưu đãi'
    },
    {
      icon: <Globe size={20} />,
      text: 'Bảo mật thông tin khách hàng tuyệt đối'
    }
  ]

  return (
    <section className='mission-vision-modern'>
      <div className='container'>
        <div className='section-header text-center'>
          <h2 className='section-title-modern'>
            <span className='title-highlight'>Sứ mệnh</span>
            <span className='title-main'>& Tầm nhìn</span>
          </h2>
          <p className='section-subtitle-modern'>
            Chúng tôi cam kết mang đến dịch vụ proxy chất lượng cao nhất, xây dựng niềm tin và sự hài lòng của khách
            hàng.
          </p>
        </div>

        <div className='mission-vision-content'>
          <div className='row'>
            <div className='col-lg-6 mb-4'>
              <div className='mission-card-modern'>
                <div className='card-header-modern'>
                  <div className='card-icon-modern mission-icon'>
                    <Target size={32} />
                  </div>
                  <h3>Sứ mệnh</h3>
                </div>
                <div className='card-content-modern'>
                  <p>
                    Cung cấp dịch vụ proxy chất lượng cao, ổn định và đáng tin cậy nhất tại Việt Nam. Chúng tôi cam kết
                    mang đến những giải pháp proxy tối ưu, giúp khách hàng đạt được mục tiêu kinh doanh và công việc một
                    cách hiệu quả nhất.
                  </p>
                </div>
              </div>
            </div>

            <div className='col-lg-6 mb-4'>
              <div className='vision-card-modern'>
                <div className='card-header-modern'>
                  <div className='card-icon-modern vision-icon'>
                    <Eye size={32} />
                  </div>
                  <h3>Tầm nhìn</h3>
                </div>
                <div className='card-content-modern'>
                  <p>
                    Trở thành nhà cung cấp dịch vụ proxy hàng đầu Việt Nam, được khách hàng tin tưởng và lựa chọn. Xây
                    dựng hệ sinh thái proxy toàn diện, phủ sóng toàn quốc với công nghệ tiên tiến và dịch vụ chăm sóc
                    khách hàng xuất sắc.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-6 mb-4'>
              <div className='values-card-modern'>
                <div className='card-header-modern'>
                  <div className='card-icon-modern values-icon'>
                    <Heart size={32} />
                  </div>
                  <h3>Giá trị cốt lõi</h3>
                </div>
                <div className='card-content-modern'>
                  <div className='values-list'>
                    <div className='value-item'>
                      <div className='value-dot'></div>
                      <span>Chất lượng dịch vụ là ưu tiên hàng đầu</span>
                    </div>
                    <div className='value-item'>
                      <div className='value-dot'></div>
                      <span>Minh bạch trong mọi giao dịch và chính sách</span>
                    </div>
                    <div className='value-item'>
                      <div className='value-dot'></div>
                      <span>Hỗ trợ khách hàng tận tâm 24/7</span>
                    </div>
                    <div className='value-item'>
                      <div className='value-dot'></div>
                      <span>Không ngừng đổi mới và cải tiến</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='col-lg-6 mb-4'>
              <div className='commitment-card-modern'>
                <div className='card-header-modern'>
                  <div className='card-icon-modern commitment-icon'>
                    <Zap size={32} />
                  </div>
                  <h3>Cam kết của chúng tôi</h3>
                </div>
                <div className='card-content-modern'>
                  <div className='commitments-list'>
                    {commitments.map((commitment, index) => (
                      <div key={index} className='commitment-item'>
                        <div className='commitment-icon-small'>{commitment.icon}</div>
                        <span>{commitment.text}</span>
                      </div>
                    ))}
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

export default MissionVision
