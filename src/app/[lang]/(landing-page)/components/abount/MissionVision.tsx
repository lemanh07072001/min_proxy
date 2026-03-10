'use client'

import React from 'react'

import { Target, Eye, Heart, Zap, Shield, Users, Globe, Award } from 'lucide-react'

import { useTranslation } from 'react-i18next'

import { useLanguageSync } from '@/hooks/useLanguageSync'

const MissionVision = () => {
  const { t } = useTranslation()

  useLanguageSync()
  
return (
    <section id='about' className='py-20 bg-gray-50'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl sm:text-4xl font-bold mb-4'>
            <span className='bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent'>{t('landing.about.missionVision.title')}</span>
          </h2>
          <p className='text-gray-600 text-lg max-w-3xl mx-auto'>
            {t('landing.about.missionVision.subtitle')}
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto'>
          {/* Sứ mệnh */}
          <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'>
            <div className='flex items-center mb-6'>
              <div className='w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4'>
                <Target className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900'>{t('landing.about.missionVision.mission.title')}</h3>
            </div>
            <p className='text-gray-600 leading-relaxed text-lg'>
              {t('landing.about.missionVision.mission.description')}
            </p>
          </div>

          {/* Tầm nhìn */}
          <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'>
            <div className='flex items-center mb-6'>
              <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4'>
                <Eye className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900'>{t('landing.about.missionVision.vision.title')}</h3>
            </div>
            <p className='text-gray-600 leading-relaxed text-lg'>
              {t('landing.about.missionVision.vision.description')}
            </p>
          </div>

          {/* Giá trị cốt lõi */}
          <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'>
            <div className='flex items-center mb-6'>
              <div className='w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4'>
                <Heart className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900'>{t('landing.about.missionVision.values.title')}</h3>
            </div>
            <ul className='space-y-3 text-gray-600'>
              {(t('landing.about.missionVision.values.items', { returnObjects: true }) as string[] || []).map((item: string, index: number) => (
                <li key={index} className='flex items-center'>
                  <div className='w-2 h-2 bg-red-500 rounded-full mr-3'></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Cam kết của chúng tôi */}
          <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'>
            <div className='flex items-center mb-6'>
              <div className='w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mr-4'>
                <Award className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900'>{t('landing.about.missionVision.commitment.title')}</h3>
            </div>
            <ul className='space-y-3 text-gray-600'>
              {(t('landing.about.missionVision.commitment.items', { returnObjects: true }) as string[] || []).map((item: string, index: number) => (
                <li key={index} className='flex items-center'>
                  <div className='w-2 h-2 bg-red-500 rounded-full mr-3'></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MissionVision
