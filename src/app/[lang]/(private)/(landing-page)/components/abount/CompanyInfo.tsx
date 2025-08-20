import React from 'react'

import Image from 'next/image'

import { MapPin, Phone, Mail, Globe, FileText, Calendar, Shield, CheckCircle, Award, Users } from 'lucide-react'

const CompanyInfo = () => {


  const advantages = [
    {
      icon: '/images/softwares/bao-mat.jpg',
      title: 'Bảo mật tuyệt đối',
      description: 'Hệ thống bảo mật nhiều lớp, mã hóa SSL/TLS và IP sạch đảm bảo an toàn tuyệt đối cho mọi hoạt động trực tuyến của bạn.'
    },
    {
      icon: '/images/softwares/8502296.jpg',
      title: 'Chất lượng đảm bảo',
      description: 'IP sạch, tốc độ cao, uptime 99.9%'
    },
    {
      icon: '/images/softwares/hotline.jpg',
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ kỹ thuật chuyên nghiệp luôn sẵn sàng'
    }
  ];

  // @ts-ignore
  return (
    <section className="company-info-modern">
      <div className="container">
        {/* Company Overview */}
        <div className="company-overview">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="company-content">
                <h2 className="section-title-modern">
                  <span className="title-highlight">{process.env.NEXT_PUBLIC_APP_NAME}</span>
                  <span className="title-main">Kết Nối Tới Thành Công.</span>
                </h2>

                <p className="company-description">
                  Tại {process.env.NEXT_PUBLIC_APP_NAME}, chúng tôi hiểu rằng sự ổn định và tốc độ của kết nối internet là nền tảng cho thành công trong công việc của bạn. Chính vì vậy, chúng tôi cung cấp dịch vụ proxy dân cư chất lượng cao hàng đầu Việt Nam, được thiết kế để mang lại hiệu suất vượt trội và sự an tâm tuyệt đối.

                  Với hệ thống IP sạch, tốc độ cao và độ tin cậy đã được kiểm chứng, chúng tôi đảm bảo mọi hoạt động trực tuyến của bạn diễn ra mượt mà, không gián đoạn. Hơn cả một nhà cung cấp, {process.env.NEXT_PUBLIC_APP_NAME} là đối tác đồng hành, luôn sẵn sàng hỗ trợ bạn 24/7 để bạn có thể tập trung hoàn toàn vào việc chinh phục các mục tiêu lớn.
                </p>


              </div>
            </div>

            <div className="col-lg-6">
              <div className="company-visual">
                <div className="company-showcase">
                  <div className="company-image-container">
                    <img
                      src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                      alt="HomeProxy Office"
                      className="company-image"
                    />

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advantages */}
        <div className="advantages-section">
          <h3 className="advantages-title">Ưu điểm vượt trội</h3>
          <div className="row">
            {advantages.map((advantage, index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-4">
                <div className="advantage-card">
                  <div className="">
                    <Image
                      src={advantage.icon}
                      width={200}
                      height={200}
                      alt="Picture of the author"
                      className="advantage-icon"
                    />

                  </div>
                  <div className="advantage-content">
                    <h4 className="advantage-title">{advantage.title}</h4>
                    <p className="advantage-description">{advantage.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CompanyInfo
