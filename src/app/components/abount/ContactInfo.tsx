import React from 'react'

import { MapPin, Phone, Mail, Globe, Facebook, Send, MessageCircle, Clock, HeadphonesIcon } from 'lucide-react'

const ContactInfo = () => {
  const contactMethods = [
    {
      icon: <Phone size={24} />,
      title: 'Hotline',
      value: '0399169675',
      description: 'Gọi ngay để được tư vấn miễn phí',
      color: 'phone'
    },
    {
      icon: <Mail size={24} />,
      title: 'Email',
      value: 'admin@homeproxy.vn',
      description: 'Gửi email để được hỗ trợ chi tiết',
      color: 'email'
    },
    {
      icon: <MapPin size={24} />,
      title: 'Địa chỉ',
      value: '81/2 Đường số 2, P.Trường Thọ, TP.Thủ Đức, TP.HCM',
      description: 'Ghé thăm văn phòng của chúng tôi',
      color: 'address'
    },
    {
      icon: <Globe size={24} />,
      title: 'Website',
      value: 'https://homeproxy.vn',
      description: 'Truy cập website chính thức',
      color: 'website'
    }
  ]

  const supportInfo = [
    {
      icon: <Clock size={20} />,
      title: 'Thời gian hỗ trợ',
      value: '24/7 - Cả tuần'
    },
    {
      icon: <HeadphonesIcon size={20} />,
      title: 'Phương thức hỗ trợ',
      value: 'Phone, Email, Chat'
    }
  ]

  return (
    <section className='contact-info-modern'>
      <div className='container'>
        <div className='section-header text-center'>
          <h2 className='section-title-modern'>
            <span className='title-highlight'>Liên hệ</span>
            <span className='title-main'>với chúng tôi</span>
          </h2>
          <p className='section-subtitle-modern'>
            Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn. Hãy liên hệ qua bất kỳ kênh nào thuận tiện nhất.
          </p>
        </div>

        <div className='row'>
          <div className='col-lg-8'>
            {/* Contact Methods */}
            <div className='contact-methods'>
              <div className='row'>
                {contactMethods.map((method, index) => (
                  <div key={index} className='col-lg-6 col-md-6 mb-4'>
                    <div className={`contact-method-card ${method.color}`}>
                      <div className='method-icon'>{method.icon}</div>
                      <div className='method-content'>
                        <h4 className='method-title'>{method.title}</h4>
                        <div className='method-value'>{method.value}</div>
                        <p className='method-description'>{method.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Information */}
            <div className='support-info'>
              <h3 className='support-title'>Thông tin hỗ trợ</h3>
              <div className='row'>
                {supportInfo.map((info, index) => (
                  <div key={index} className='col-md-6 mb-3'>
                    <div className='support-item'>
                      <div className='support-icon'>{info.icon}</div>
                      <div className='support-content'>
                        <div className='support-label'>{info.title}</div>
                        <div className='support-value'>{info.value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className='social-section'>
              <h3 className='social-title'>Kết nối với chúng tôi</h3>
              <div className='social-buttons-modern'>
                <a href='#' className='social-btn-modern facebook'>
                  <Facebook size={20} />
                  <span>FB/homeproxy</span>
                </a>
                <a href='#' className='social-btn-modern telegram'>
                  <Send size={20} />
                  <span>Telegram</span>
                </a>
                <a href='#' className='social-btn-modern whatsapp'>
                  <MessageCircle size={20} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <div className='col-lg-4'>
            <div className='contact-form-modern'>
              <div className='form-header'>
                <h3>Gửi tin nhắn cho chúng tôi</h3>
                <p>Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại trong 24h</p>
              </div>

              <form className='contact-form'>
                <div className='form-group-modern'>
                  <label>Họ và tên *</label>
                  <input type='text' placeholder='Nhập họ và tên của bạn' required />
                </div>

                <div className='form-group-modern'>
                  <label>Email *</label>
                  <input type='email' placeholder='Nhập địa chỉ email' required />
                </div>

                <div className='form-group-modern'>
                  <label>Số điện thoại *</label>
                  <input type='tel' placeholder='Nhập số điện thoại' required />
                </div>

                <div className='form-group-modern'>
                  <label>Dịch vụ quan tâm</label>
                  <select>
                    <option value=''>Chọn dịch vụ</option>
                    <option value='viettel'>Proxy Viettel</option>
                    <option value='fpt'>Proxy FPT</option>
                    <option value='vnpt'>Proxy VNPT</option>
                    <option value='agency'>Đăng ký đại lý</option>
                  </select>
                </div>

                <div className='form-group-modern'>
                  <label>Nội dung tin nhắn *</label>
                  <textarea placeholder='Mô tả chi tiết nhu cầu của bạn...' rows={4} required></textarea>
                </div>

                <button type='submit' className='submit-btn-modern'>
                  <span>Gửi tin nhắn</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactInfo
