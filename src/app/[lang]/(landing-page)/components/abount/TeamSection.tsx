'use client'

import React from 'react'

import { Users, Star, Award, Target, Heart, Zap } from 'lucide-react'

import { useTranslation } from 'react-i18next'

import { useLanguageSync } from '@/hooks/useLanguageSync'

const TeamSection = () => {
  const { t } = useTranslation()

  useLanguageSync()

  const teamValues = [
    {
      icon: (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <polygon points='12,2 15.09,8.26 22,9 17,14 18.18,21 12,17.77 5.82,21 7,14 2,9 8.91,8.26' />
        </svg>
      ),
      title: 'Xuất sắc',
      description: 'Luôn phấn đấu đạt được kết quả tốt nhất trong mọi công việc'
    },
    {
      icon: (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
        </svg>
      ),
      title: 'Tận tụy',
      description: 'Đặt lợi ích khách hàng và chất lượng dịch vụ lên hàng đầu'
    },
    {
      icon: (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <polygon points='13,2 3,14 12,14 11,22 21,10 12,10' />
        </svg>
      ),
      title: 'Linh hoạt',
      description: 'Thích ứng nhanh với thay đổi và đáp ứng mọi yêu cầu'
    },
    {
      icon: (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <circle cx='12' cy='12' r='10' />
          <circle cx='12' cy='12' r='6' />
          <circle cx='12' cy='12' r='2' />
        </svg>
      ),
      title: 'Đổi mới',
      description: 'Không ngừng học hỏi và áp dụng công nghệ tiên tiến'
    }
  ]

  return (
    <section id='team' className='py-20 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid lg:grid-cols-2 gap-16 items-center'>
          {/* Content */}
          <div className='space-y-8'>
            <div>
              <p className='text-orange-500 font-semibold text-lg mb-4'>{t('landing.about.team.title')}</p>
              <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>{process.env.NEXT_PUBLIC_APP_NAME}</h2>
              <p className='text-gray-600 text-lg leading-relaxed mb-8'>
                {t('landing.about.team.subtitle', { appName: process.env.NEXT_PUBLIC_APP_NAME })}
              </p>
            </div>

            <div className='space-y-6'>
              <h3 className='text-xl font-bold text-gray-900'>{t('landing.about.team.professionalTitle')}</h3>
              <p className='text-gray-600 leading-relaxed'>
                {t('landing.about.team.professionalDesc1', { appName: process.env.NEXT_PUBLIC_APP_NAME })}
              </p>
              <p className='text-gray-600 leading-relaxed'>
                {t('landing.about.team.professionalDesc2')}
              </p>
            </div>

            {/* Stats */}
            <div className='flex flex-wrap gap-8'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-orange-500'>25+</div>
                <div className='text-gray-600 text-sm'>{t('landing.about.team.stats.experts')}</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-orange-500'>5+</div>
                <div className='text-gray-600 text-sm'>{t('landing.about.team.stats.experience')}</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-orange-500'>24/7</div>
                <div className='text-gray-600 text-sm'>{t('landing.about.team.stats.support')}</div>
              </div>
            </div>
          </div>

          {/* Team Visual */}
          <div className='relative'>
            <div className='bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-center'>
              <div className='grid grid-cols-3 gap-4 mb-6'>
                {/* Team Avatar Grid */}
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className='w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center border-2 border-orange-500/30'
                  >
                    <Users className='w-8 h-8 text-orange-400' />
                  </div>
                ))}
              </div>
              <h3 className='text-xl font-bold text-white mb-2'>{t('landing.about.team.teamTitle')}</h3>
              <p className='text-slate-300'>{t('landing.about.team.teamSubtitle')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeamSection
