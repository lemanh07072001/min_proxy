import React from 'react';
import { Users, Star, Award, Target, Heart, Zap } from 'lucide-react';

const TeamSection = () => {
  const teamValues = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12,2 15.09,8.26 22,9 17,14 18.18,21 12,17.77 5.82,21 7,14 2,9 8.91,8.26"/>
        </svg>
      ),
      title: 'Xuất sắc',
      description: 'Luôn phấn đấu đạt được kết quả tốt nhất trong mọi công việc'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
      title: 'Tận tụy',
      description: 'Đặt lợi ích khách hàng và chất lượng dịch vụ lên hàng đầu'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
        </svg>
      ),
      title: 'Linh hoạt',
      description: 'Thích ứng nhanh với thay đổi và đáp ứng mọi yêu cầu'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="6"/>
          <circle cx="12" cy="12" r="2"/>
        </svg>
      ),
      title: 'Đổi mới',
      description: 'Không ngừng học hỏi và áp dụng công nghệ tiên tiến'
    }
  ];

  return (
    <section className="team-section-modern">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title-modern">
            <span className="title-highlight">Đội ngũ</span>
            <span className="title-main">{process.env.NEXT_PUBLIC_APP_NAME}</span>
          </h2>
          <p className="section-subtitle-modern">
            Đội ngũ {process.env.NEXT_PUBLIC_APP_NAME} gồm những chuyên gia công nghệ giàu kinh nghiệm, tận tâm và nhiệt huyết.
            Chúng tôi cam kết mang đến dịch vụ proxy chất lượng cao và hỗ trợ khách hàng tận tình 24/7.
          </p>
        </div>

        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="team-content">
              <div className="team-description">
                <h3>Đội ngũ chuyên nghiệp - Kinh nghiệm 5+ năm</h3>
                <p>
                  Đội ngũ {process.env.NEXT_PUBLIC_APP_NAME} được tuyển chọn kỹ lưỡng từ những chuyên gia hàng đầu trong lĩnh vực
                  mạng và bảo mật. Với kinh nghiệm trung bình 5+ năm, chúng tôi hiểu rõ nhu cầu và thách thức
                  của khách hàng, từ đó đưa ra những giải pháp tối ưu nhất.
                </p>

                <p>
                  Chúng tôi không chỉ cung cấp dịch vụ mà còn đồng hành cùng khách hàng trong suốt
                  quá trình sử dụng. Đội ngũ kỹ thuật luôn sẵn sàng hỗ trợ, tư vấn và giải quyết mọi
                  vấn đề một cách nhanh chóng và hiệu quả.
                </p>

                <div className="team-stats">
                  <div className="stat-item">
                    <div className="stat-number">25+</div>
                    <div className="stat-label">Chuyên gia</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">5+</div>
                    <div className="stat-label">Năm kinh nghiệm</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">24/7</div>
                    <div className="stat-label">Hỗ trợ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="team-visual">
              <div className="team-image-modern">
                <img
                  src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                  alt="HomeProxy Team"
                  className="team-main-image"
                />
                <div className="team-grid">
                  <div className="team-member member-1">
                    <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop&crop=face" alt="Team Member" />
                  </div>
                  <div className="team-member member-2">
                    <img src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop&crop=face" alt="Team Member" />
                  </div>
                  <div className="team-member member-3">
                    <img src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop&crop=face" alt="Team Member" />
                  </div>
                  <div className="team-member member-4">
                    <img src="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop&crop=face" alt="Team Member" />
                  </div>
                  <div className="team-member member-5">
                    <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop&crop=face" alt="Team Member" />
                  </div>
                  <div className="team-member member-6">
                    <img src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop&crop=face" alt="Team Member" />
                  </div>
                </div>
                <div className="team-overlay-modern">
                  <div className="team-info">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span>25+ Chuyên gia</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};

export default TeamSection;