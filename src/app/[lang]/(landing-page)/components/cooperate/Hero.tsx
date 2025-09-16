'use client'

import React from 'react'

import { ArrowRight, Shield, Zap, Globe } from 'lucide-react'

import { useTranslation } from 'react-i18next'

import { useLanguageSync } from '@/hooks/useLanguageSync'

const Hero = () => {
  const { t } = useTranslation()

  useLanguageSync() // Sync language with URL

  return (
    <section
      id='home'
      className='relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-red-900'
    >
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent'></div>
        <div className='grid grid-cols-8 md:grid-cols-12 gap-4 h-full'>
          {Array.from({ length: 96 }).map((_, i) => (
            <div
              key={i}
              className='bg-white/5 rounded-lg transform rotate-12 animate-pulse'
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>

      <div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10'>
        <div className='max-w-4xl mx-auto'>
          {/* Badge */}
          <div className='inline-flex items-center bg-red-600/20 border border-red-600/30 rounded-full px-4 py-2 mb-8'>
            <span className='text-red-400 text-sm font-medium'>{t('landing.cooperate.hero.badge')}</span>
          </div>

          {/* Main Title */}
          <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight'>
            {t('landing.cooperate.hero.title.line1')}
            <span className='text-red-400 block'>{t('landing.cooperate.hero.title.line2')}</span>
          </h1>

          {/* Subtitle */}
          <p className='text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed'>
            {t('landing.cooperate.hero.subtitle', { appName: process.env.NEXT_PUBLIC_APP_NAME })}
          </p>

          {/* Features */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
            {t('landing.cooperate.hero.features', { returnObjects: true }).map(
              (feature: { title: string; desc: string }, index: number) => {
                const icons = [Shield, Zap, Globe]
                const IconComponent = icons[index]

                return (
                  <div
                    key={index}
                    className='flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300'
                  >
                    <IconComponent className='w-8 h-8 text-red-400 mb-3' />
                    <h3 className='text-white font-semibold mb-2'>{feature.title}</h3>
                    <p className='text-gray-400 text-sm'>{feature.desc}</p>
                  </div>
                )
              }
            )}
          </div>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button className='group bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center'>
              {t('landing.cooperate.hero.actions.startNow')}
              <ArrowRight className='w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform' />
            </button>
            <button className='border-2 border-white/30 hover:border-red-400 text-white hover:text-red-400 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm'>
              {t('landing.cooperate.hero.actions.learnMore')}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2'>
        <div className='animate-bounce'>
          <div className='w-6 h-10 border-2 border-white/30 rounded-full flex justify-center'>
            <div className='w-1 h-3 bg-white rounded-full mt-2 animate-pulse'></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
