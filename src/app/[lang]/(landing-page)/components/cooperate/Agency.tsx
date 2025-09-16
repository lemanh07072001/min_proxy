'use client'

import React from 'react'

import { QrCode, Users, TrendingUp, Award } from 'lucide-react'

import { useTranslation } from 'react-i18next'

import { useLanguageSync } from '@/hooks/useLanguageSync'

const Agency = () => {
  const { t } = useTranslation()

  useLanguageSync()

  const benefits = t('landing.cooperate.agency.benefits', { returnObjects: true }) as Array<{
    title: string
    description: string
  }>

  const benefitIcons = [TrendingUp, Users, Award]

  return (
    <section id='agency' className='py-20 bg-gray-900 relative overflow-hidden'>
      <div className='container-lg mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          {/* Left Content */}
          <div className='text-center lg:text-left'>
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>{t('landing.cooperate.agency.title')}</h2>
            <p className='text-xl text-gray-200 mb-8'>{t('landing.cooperate.agency.subtitle')}</p>

            {/* Benefits */}
            <div className='space-y-6 mb-10'>
              {(benefits || []).map((benefit, index) => {
                const IconComponent = benefitIcons[index]

                return (
                  <div key={index} className='flex items-start space-x-4 group'>
                    <div className='bg-red-600/20 p-3 rounded-lg group-hover:bg-red-600/30 transition-colors'>
                      <IconComponent className='w-6 h-6 text-red-300' />
                    </div>
                    <div>
                      <h3 className='text-lg font-semibold text-white mb-1'>{benefit.title}</h3>
                      <p className='text-gray-300'>{benefit.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <button className='bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg'>
                {t('landing.cooperate.agency.actions.registerNow')}
              </button>
              <button className='border-2 border-red-300 hover:bg-red-300 hover:text-red-900 text-red-300 px-8 py-4 rounded-xl font-semibold transition-all duration-300'>
                {t('landing.cooperate.agency.actions.learnMore')}
              </button>
            </div>
          </div>

          {/* Right Content - QR Code & Servers */}
          <div className='relative'>
            {/* QR Code Section */}
            <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 mb-8'>
              <div className='bg-white rounded-2xl p-8 text-center'>
                <div className='bg-gray-100 p-4 rounded-xl inline-block mb-4'>
                  <QrCode className='w-32 h-32 text-gray-800' />
                </div>
                <div className='text-red-600 font-bold text-lg mb-2'>{t('landing.cooperate.agency.qrCode.title')}</div>
                <p className='text-gray-600'>{t('landing.cooperate.agency.qrCode.description')}</p>
              </div>
            </div>

            {/* Server Illustration */}
            <div className='relative'>
              {/* Main Server Stack */}
              <div className='space-y-4'>
                {[1, 2, 3].map((server, index) => (
                  <div
                    key={server}
                    className='bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl p-4 transform transition-all duration-500 hover:scale-105'
                    style={{
                      animationDelay: `${index * 0.2}s`,
                      transform: `perspective(600px) rotateX(${index * 5}deg) translateZ(${index * 10}px)`
                    }}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex space-x-2'>
                        <div className='w-3 h-3 bg-green-400 rounded-full animate-pulse'></div>
                        <div className='w-3 h-3 bg-red-400 rounded-full'></div>
                        <div className='w-3 h-3 bg-yellow-400 rounded-full'></div>
                      </div>
                      <div className='text-gray-300 text-sm'>Server {server}</div>
                    </div>
                    <div className='mt-3 grid grid-cols-4 gap-2'>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className='h-2 bg-red-600/30 rounded animate-pulse'
                          style={{ animationDelay: `${i * 0.1}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cloud Element */}
              <div className='absolute -top-16 -right-8 text-red-300/30'>
                <div className='w-24 h-16 bg-current rounded-full relative'>
                  <div className='absolute -left-4 top-2 w-16 h-12 bg-current rounded-full'></div>
                  <div className='absolute -right-4 top-2 w-16 h-12 bg-current rounded-full'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Agency
