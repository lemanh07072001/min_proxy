'use client'

import React from 'react'

import Image from 'next/image'

import { Shield, Star, CheckCircle, ArrowRight } from 'lucide-react'

import { useTranslation } from 'react-i18next'

import { useLanguageSync } from '@/hooks/useLanguageSync'

import Link from '@components/Link'

export default function ProductsSection({ local }: { local: string }) {
  const { t } = useTranslation()

  useLanguageSync() // Sync language with URL

  const products = [
    {
      id: 1,
      name: t('landing.products.cards.viettel.name'),
      provider: 'Viettel',
      img: '/images/softwares/viettel.png',
      price: '18.000',
      originalPrice: '25.000',
      period: t('time.months'),
      discount: '28%',
      features: (t('landing.products.cards.viettel.features', { returnObjects: true }) as string[] || []),
      color: '#e53e3e',
      popular: false,
      badge: t('landing.products.cards.viettel.badge')
    },
    {
      id: 2,
      name: t('landing.products.cards.fpt.name'),
      provider: 'FPT',
      img: '/images/softwares/fpt.png',
      price: '18.000',
      originalPrice: '24.000',
      period: t('time.months'),
      discount: '25%',
      features: (t('landing.products.cards.fpt.features', { returnObjects: true }) as string[] || []),
      color: '#f56500',
      popular: true,
      badge: t('landing.products.cards.fpt.badge')
    },
    {
      id: 3,
      name: t('landing.products.cards.vnpt.name'),
      provider: 'VNPT',
      img: '/images/softwares/vnpt.png',
      price: '18.000',
      originalPrice: '26.000',
      period: t('time.months'),
      discount: '31%',
      features: (t('landing.products.cards.vnpt.features', { returnObjects: true }) as string[] || []),
      color: '#3182ce',
      popular: false,
      badge: t('landing.products.cards.vnpt.badge')
    }
  ]

  return (
    <section className='products-section-new'>
      <div className='container-lg'>
        {/* Header */}
        <div className='section-header'>
          <h2 className='section-title'>{t('landing.products.title')}</h2>
          <p className='section-subtitle'>{t('landing.products.subtitle')}</p>
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
                      <span>{t('landing.products.actions.popular')}</span>
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
                  <Link href={`/${local}/proxy-tinh`} className='buy-button'>
                    <span>{t('landing.products.actions.buyNow')}</span>
                    <ArrowRight size={18} />
                  </Link>

                  {/* Guarantee */}
                  <div className='guarantee'>
                    <Shield size={14} />
                    <span>{t('landing.products.actions.guarantee')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className='section-cta'>
          <div className='cta-content'>
            <h3>{t('landing.products.cta.title')}</h3>
            <p>{t('landing.products.cta.description')}</p>
            <button className='btn-contact'>
              <span>{t('landing.products.cta.button')}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
