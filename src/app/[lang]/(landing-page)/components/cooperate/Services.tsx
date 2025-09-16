'use client'

import React from 'react'

import { Shield, Globe, Zap, Check } from 'lucide-react'

import { useTranslation } from 'react-i18next'

import { useLanguageSync } from '@/hooks/useLanguageSync'

const Services = () => {
  const { t } = useTranslation()

  useLanguageSync()

  const services = [
    {
      id: 1,
      icon: Shield,
      title: t('landing.cooperate.services.cards.ipv4.title'),
      description: t('landing.cooperate.services.cards.ipv4.description', {
        appName: process.env.NEXT_PUBLIC_APP_NAME
      }),
      features: t('landing.cooperate.services.cards.ipv4.features', { returnObjects: true }) as string[],
      color: 'red'
    },
    {
      id: 2,
      icon: Globe,
      title: t('landing.cooperate.services.cards.ipv6.title'),
      description: t('landing.cooperate.services.cards.ipv6.description', {
        appName: process.env.NEXT_PUBLIC_APP_NAME
      }),
      features: t('landing.cooperate.services.cards.ipv6.features', { returnObjects: true }) as string[],
      color: 'blue'
    },
    {
      id: 3,
      icon: Zap,
      title: t('landing.cooperate.services.cards.ipv6Rotating.title'),
      description: t('landing.cooperate.services.cards.ipv6Rotating.description', {
        appName: process.env.NEXT_PUBLIC_APP_NAME
      }),
      features: t('landing.cooperate.services.cards.ipv6Rotating.features', { returnObjects: true }) as string[],
      color: 'green'
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red':
        return {
          bg: 'bg-red-600',
          hover: 'hover:bg-red-700',
          border: 'border-red-600/20',
          text: 'text-red-600'
        }
      case 'blue':
        return {
          bg: 'bg-blue-600',
          hover: 'hover:bg-blue-700',
          border: 'border-blue-600/20',
          text: 'text-blue-600'
        }
      case 'green':
        return {
          bg: 'bg-green-600',
          hover: 'hover:bg-green-700',
          border: 'border-green-600/20',
          text: 'text-green-600'
        }
      default:
        return {
          bg: 'bg-red-600',
          hover: 'hover:bg-red-700',
          border: 'border-red-600/20',
          text: 'text-red-600'
        }
    }
  }

  return (
    <section id='services' className='py-20 bg-gray-900 relative overflow-hidden'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div className='grid grid-cols-6 gap-4 h-full transform rotate-12'>
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className='bg-white rounded-lg'></div>
          ))}
        </div>
      </div>

      <div className='container-lg mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>{t('landing.cooperate.services.title')}</h2>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto'>{t('landing.cooperate.services.subtitle')}</p>
        </div>

        {/* Services Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {services.map((service, index) => {
            const colors = getColorClasses(service.color)

            return (
              <div
                key={service.id}
                className='group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105'
              >
                {/* Service Icon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 ${colors.bg} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <service.icon className='w-8 h-8 text-white' />
                </div>

                {/* Service Title */}
                <h3 className='text-2xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors'>
                  {service.title}
                </h3>

                {/* Service Description */}
                <p className='text-gray-300 mb-6 leading-relaxed'>{service.description}</p>

                {/* Features List */}
                <ul className='space-y-3 mb-8'>
                  {(service.features || []).map((feature, featureIndex) => (
                    <li key={featureIndex} className='flex items-center text-gray-300'>
                      <Check className='w-5 h-5 text-green-400 mr-3 flex-shrink-0' />
                      <span className='text-sm'>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full ${colors.bg} ${colors.hover} text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 group-hover:shadow-lg`}
                >
                  {t('landing.cooperate.services.actions.selectPackage')}
                </button>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className='text-center mt-16'>
          <p className='text-gray-300 mb-6'>{t('landing.cooperate.services.actions.notSure')}</p>
          <button className='bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg'>
            {t('landing.cooperate.services.actions.freeConsultation')}
          </button>
        </div>
      </div>
    </section>
  )
}

export default Services
