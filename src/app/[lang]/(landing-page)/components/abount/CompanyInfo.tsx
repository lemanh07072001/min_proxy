'use client'

import React from 'react'

import Image from 'next/image'

import { MapPin, Phone, Mail, Globe, FileText, Calendar, Shield, CheckCircle, Award, Users } from 'lucide-react'

import { useTranslation } from 'react-i18next'

import { useLanguageSync } from '@/hooks/useLanguageSync'

const CompanyInfo = () => {
  const { t } = useTranslation()

  useLanguageSync()

  const advantages = [
    {
      icon: '/images/softwares/bao-mat.jpg',
      title: 'Bảo mật tuyệt đối',
      description:
        'Hệ thống bảo mật nhiều lớp, mã hóa SSL/TLS và IP sạch đảm bảo an toàn tuyệt đối cho mọi hoạt động trực tuyến của bạn.'
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
  ]

  // @ts-ignore
  return (
    <section id='about' className='py-20 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid lg:grid-cols-2 gap-16 items-center'>
          {/* Content */}
          <div className='space-y-8'>
            <div>
              <p className='text-orange-500 font-semibold text-lg mb-4'>{process.env.NEXT_PUBLIC_APP_NAME}</p>
              <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>{t('landing.about.companyInfo.title')}</h2>
              <p className='text-gray-600 text-lg leading-relaxed'>
                {t('landing.about.companyInfo.description', { appName: process.env.NEXT_PUBLIC_APP_NAME })}
              </p>
            </div>

            <p className='text-gray-600 leading-relaxed'>
              {t('landing.about.companyInfo.subDescription', { appName: process.env.NEXT_PUBLIC_APP_NAME })}
            </p>
          </div>

          {/* Image */}
          <div className='relative'>
            <div className='bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-8 text-center text-white'>
              <div className='mb-6'>
                <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Users className='w-10 h-10 text-white' />
                </div>
                <h3 className='text-2xl font-bold'>{t('landing.about.companyInfo.successTitle')}</h3>
              </div>
              <p className='text-white/90'>{t('landing.about.companyInfo.successSubtitle')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CompanyInfo
