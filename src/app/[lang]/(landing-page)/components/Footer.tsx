import React from 'react'

import { Shield, Phone, Mail, MapPin, Facebook, Send, MessageCircle } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='footer-main'>
      {/* CTA Section */}
      <div className='footer-cta'>
        <div className='container-lg'>
          <div className='cta-content'>
            <h2>HÃY CỘNG TÁC VỚI CHÚNG TÔI</h2>
            <p>Trở thành đại lý ngay hôm nay, hưởng chính sách giá ưu đãi và bảo vệ quyền lợi độc quyền của bạn</p>
            <div className='cta-buttons'>
              <button className='btn-cta-primary'>
                <span>Liên hệ làm cộng tác viên</span>
              </button>
              <button className='btn-cta-secondary'>
                <span>Đăng ký ngay</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className='footer-content'>
        <div className='container-lg'>
          <div className='row'>
            {/* Company Info */}
            <div className='col-lg-3 col-md-6 mb-4'>
              <div className='footer-section'>
                <h4>Company</h4>
                <ul className='footer-links'>
                  <li>
                    <a href='#'>Về chúng tôi</a>
                  </li>
                  <li>
                    <a href='#'>Ưu đãi đại lý</a>
                  </li>
                  <li>
                    <a href='#'>Đối tác</a>
                  </li>
                  <li>
                    <a href='#'>Sitemap</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Products */}
            <div className='col-lg-3 col-md-6 mb-4'>
              <div className='footer-section'>
                <h4>Products</h4>
                <ul className='footer-links'>
                  <li>
                    <a href='#'>Proxy Dân cư Tỉnh</a>
                  </li>
                  <li>
                    <a href='#'>Proxy Dân cư Xoay</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Top Locations */}
            <div className='col-lg-3 col-md-6 mb-4'>
              <div className='footer-section'>
                <h4>Top Locations</h4>
                <ul className='footer-links'>
                  <li>
                    <a href='#'>Hồ Chí Minh City</a>
                  </li>
                  <li>
                    <a href='#'>Hà Nội</a>
                  </li>
                  <li>
                    <a href='#'>Hưng Yên</a>
                  </li>
                  <li>
                    <a href='#'>Tuyên Quang</a>
                  </li>
                  <li>
                    <a href='#'>Bình Định</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Get Started */}
            <div className='col-lg-3 col-md-6 mb-4'>
              <div className='footer-section'>
                <h4>Get started</h4>
                <ul className='footer-links'>
                  <li>
                    <a href='#'>Trở thành CTV</a>
                  </li>
                  <li>
                    <a href='#'>Trở thành đại lý uy quyền</a>
                  </li>
                  <li>
                    <a href='#'>Mua proxy giá rẻ</a>
                  </li>
                  <li>
                    <a href='#'>Tương tác tự vận</a>
                  </li>
                  <li>
                    <a href='#'>Giúp đỡ</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className='footer-bottom'>
        <div className='container-lg'>
          <div className='row align-items-center'>
            <div className='col-md-6'>
              <div className='footer-logo'>
                <Shield size={32} />
                <div className='logo-text'>{process.env.NEXT_PUBLIC_APP_NAME}</div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='footer-legal'>
                <div className='legal-links'>
                  <a href='#'>Privacy Policy</a>
                  <a href='#'>Service Agreement</a>
                  <a href='#'>Refund Policy</a>
                </div>
                <div className='copyright'>© 2025 HOME PROXY COMPANY LIMITED. All Rights Reserved</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className='contact-info'>
        <div className='container'>
          <div className='contact-text'>Liên hệ với chúng tôi</div>
          <div className='contact-icons'>
            <a href='#' className='contact-icon facebook'>
              <Facebook size={20} />
            </a>
            <a href='#' className='contact-icon telegram'>
              <Send size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className='payment-methods'>
        <div className='container'>
          <div className='payment-icons'>
            <div className='payment-icon'>VISA</div>
            <div className='payment-icon'>MC</div>
            <div className='payment-icon'>JCB</div>
            <div className='payment-icon'>AMEX</div>
            <div className='payment-icon'>UNION</div>
            <div className='payment-icon'>PAYPAL</div>
            <div className='payment-icon'>CRYPTO</div>
          </div>
        </div>
      </div>

      {/* Floating Contact */}
      <div className='floating-contact'>
        <div className='contact-item phone'>
          <Phone size={20} />
        </div>
        <div className='contact-item whatsapp'>
          <MessageCircle size={20} />
        </div>
        <div className='contact-item telegram'>
          <Send size={20} />
        </div>
      </div>
    </footer>
  )
}

export default Footer
