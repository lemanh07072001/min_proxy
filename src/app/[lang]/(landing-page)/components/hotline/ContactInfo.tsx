import React from 'react'

import '@/app/[lang]/(landing-page)/hotline/style.css'

import { MapPin, Phone, Mail, Globe } from 'lucide-react'

const ContactInfo = () => {

  return (
    <section id='contact' className='contact-section'>
      <div className='container'>
        <div className='section-header text-center'>
          <h2 className='section-title'>Liên hệ với chúng tôi</h2>
          <p className='section-subtitle'>Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn</p>
        </div>

        <div className='row'>
          <div className='col-lg-8 mb-4'>
            <div className='contact-info'>
              <div className='row'>
                <div className='col-md-6 mb-4'>
                  <div className='contact-item'>
                    <div className='contact-icon phone'>
                      <Phone size={24} />
                    </div>
                    <div className='contact-details'>
                      <h5>Hotline</h5>
                      <p>0399169675</p>
                      <span>Gọi ngay để được tư vấn miễn phí</span>
                    </div>
                  </div>
                </div>

                <div className='col-md-6 mb-4'>
                  <div className='contact-item'>
                    <div className='contact-icon email'>
                      <Mail size={24} />
                    </div>
                    <div className='contact-details'>
                      <h5>Email</h5>
                      <p>admin@homeproxy.vn</p>
                      <span>Gửi email để được hỗ trợ chi tiết</span>
                    </div>
                  </div>
                </div>

                <div className='col-md-6 mb-4'>
                  <div className='contact-item'>
                    <div className='contact-icon location'>
                      <MapPin size={24} />
                    </div>
                    <div className='contact-details'>
                      <h5>Địa chỉ</h5>
                      <p>81/2 Đường số 2, P.Trường Thọ, TP.Thủ Đức, TP.HCM</p>
                      <span>Ghé thăm văn phòng của chúng tôi</span>
                    </div>
                  </div>
                </div>

                <div className='col-md-6 mb-4'>
                  <div className='contact-item'>
                    <div className='contact-icon website'>
                      <Globe size={24} />
                    </div>
                    <div className='contact-details'>
                      <h5>Website</h5>
                      <p>https://homeproxy.vn</p>
                      <span>Truy cập website chính thức</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='col-lg-4'>
            <div className='contact-form'>
              <h4>Gửi tin nhắn</h4>
              <form>
                <div className='form-group'>
                  <input type='text' className='form-control' placeholder='Họ và tên' required />
                </div>
                <div className='form-group'>
                  <input type='email' className='form-control' placeholder='Email' required />
                </div>
                <div className='form-group'>
                  <input type='tel' className='form-control' placeholder='Số điện thoại' required />
                </div>
                <div className='form-group'>
                  <textarea className='form-control' rows={4} placeholder='Nội dung tin nhắn' required></textarea>
                </div>
                <button className='btn btn-gradient-primary me-2'>Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactInfo
