import React from 'react'

import Image from 'next/image'

import { Shield, Star, CheckCircle, ArrowRight } from 'lucide-react'

const ProductsSection = () => {
  const products = [
    {
      id: 1,
      name: 'Viettel Proxy',
      provider: 'Viettel',
      img: '/images/softwares/viettel.png',
      price: '18.000',
      originalPrice: '25.000',
      period: 'tháng',
      discount: '28%',
      features: ['IPv4 dân cư Việt Nam', 'Hơn 20 đầu IP tùy chọn', 'Tốc độ 550 Mbps', 'Uptime 99.9%'],
      color: '#e53e3e',
      popular: false,
      badge: 'Ổn định'
    },
    {
      id: 2,
      name: 'FPT Proxy',
      provider: 'FPT',
      img: '/images/softwares/fpt.png',
      price: '18.000',
      originalPrice: '24.000',
      period: 'tháng',
      discount: '25%',
      features: ['IPv4 dân cư Việt Nam', 'Hơn 14 đầu IP tùy chọn', 'Tốc độ 550 Mbps', 'Bảo mật cao'],
      color: '#f56500',
      popular: true,
      badge: 'Phổ biến'
    },
    {
      id: 3,
      name: 'VNPT Proxy',
      provider: 'VNPT',
      img: '/images/softwares/vnpt.png',
      price: '18.000',
      originalPrice: '26.000',
      period: 'tháng',
      discount: '31%',
      features: ['IPv4 dân cư Việt Nam', 'Hơn 45 đầu IP tùy chọn', 'Tốc độ 550 Mbps', 'Kết nối ổn định'],
      color: '#3182ce',
      popular: false,
      badge: 'Nhanh'
    }
  ]

  return (
    <section className='products-section-new'>
      <div className='container-lg'>
        {/* Header */}
        <div className='section-header'>
          <h2 className='section-title'>
            Gói Proxy <span className='text-highlight'>Phù Hợp</span> Với Bạn
          </h2>
          <p className='section-subtitle'>
            Chọn gói proxy phù hợp với nhu cầu của bạn. Tất cả gói đều đảm bảo chất lượng cao và hỗ trợ 24/7.
          </p>
        </div>

        {/* Products Grid */}
        <div className='products-grid-new'>
          <div className='row justify-content-center gap-4 gap-lg-0'>
            {products.map((product, index) => (
              <div key={product.id} className='col-lg-4 col-md-6 mb-4'>
                <div
                  className={`product-card-modern ${product.popular ? 'popular' : ''}`}
                  style={{ '--delay': `${index * 0.1}s` }}
                >
                  {/* Popular Badge */}
                  {product.popular && (
                    <div className='popular-badge'>
                      <Star size={16} fill='white' />
                      <span>Phổ biến nhất</span>
                    </div>
                  )}

                  {/* Discount Badge */}
                  <div className='discount-badge'>-{product.discount}</div>

                  {/* Card Header */}
                  <div className='card-header'>
                    <div className='provider-info'>
                      <Image className='mb-3' src={product.img} alt={product.name} width={100} height={40} />
                      <h3 className='product-name'>{product.name}</h3>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className='pricing'>
                    <div className='price-old'>{product.originalPrice}đ</div>
                    <div className='price-current'>
                      <span className='price-amount'>{product.price}đ</span>
                      <span className='price-period'>/{product.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className='features-list'>
                    {product.features.map((feature, idx) => (
                      <div key={idx} className='feature-item'>
                        <CheckCircle size={16} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button className='buy-button'>
                    <span>Mua ngay</span>
                    <ArrowRight size={18} />
                  </button>

                  {/* Guarantee */}
                  <div className='guarantee'>
                    <Shield size={14} />
                    <span>Đảm bảo hoàn tiền 100%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className='section-cta'>
          <div className='cta-content'>
            <h3>Cần tư vấn thêm?</h3>
            <p>Liên hệ với chúng tôi để được tư vấn gói proxy phù hợp nhất</p>
            <button className='btn-contact'>
              <span>Liên hệ tư vấn</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductsSection
