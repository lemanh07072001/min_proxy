'use client'

import React from 'react'

import { Users, Target, Heart } from 'lucide-react'

import { useTranslation } from 'react-i18next'

import { useLanguageSync } from '@/hooks/useLanguageSync'

const About = () => {
  const { t } = useTranslation()
  useLanguageSync()
  
  const values = t('landing.cooperate.about.values', { returnObjects: true }) as Array<{
    title: string
    description: string
  }>
  
  const valueIcons = [Target, Heart, Users]
  
  return (
    <section id='about' className='py-20 bg-white'>
      <div className='container-lg mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
            {t('landing.cooperate.about.title')}
          </h2>
          <p className='text-xl text-gray-600 max-w-4xl mx-auto'>
            {t('landing.cooperate.about.subtitle')}
          </p>

          <button className='mt-8 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105'>
            {t('landing.cooperate.about.actions.cooperateNow')}
          </button>
        </div>

        {/* Company Image */}
        <div className='relative mb-16'>
          <div className='bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl p-8 shadow-2xl'>
            {/* Company Header */}
            <div className='text-center mb-8'>
              <div className='bg-gray-800 text-white py-4 px-8 rounded-xl inline-block mb-4'>
                <h3 className='text-xl font-bold'>{t('landing.cooperate.about.company.name')}</h3>
              </div>
              <div className='flex items-center justify-center space-x-4 mb-6'>
                <div className='bg-red-600 p-4 rounded-xl'>
                  <div className='w-12 h-12 bg-white rounded-lg flex items-center justify-center'>
                    <Users className='w-8 h-8 text-red-600' />
                  </div>
                </div>
                <div className='text-4xl font-bold text-red-600'>{process.env.NEXT_PUBLIC_APP_NAME}</div>
              </div>
            </div>

            {/* Team Members Illustration */}
            <div className='flex flex-wrap justify-center gap-6'>
              {[1, 2, 3, 4, 5, 6].map((member, index) => (
                <div
                  key={member}
                  className='bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Avatar */}
                  <div className='w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mb-4 mx-auto'>
                    <Users className='w-8 h-8 text-white' />
                  </div>

                  {/* Member Info */}
                  <div className='text-center'>
                    <div className='w-20 h-3 bg-gray-300 rounded mb-2 mx-auto'></div>
                    <div className='w-16 h-2 bg-red-300 rounded mx-auto'></div>
                  </div>

                  {/* Uniform Colors */}
                  <div className='mt-4 flex justify-center space-x-1'>
                    <div className={`w-3 h-6 rounded ${index % 2 === 0 ? 'bg-red-600' : 'bg-gray-800'}`}></div>
                    <div className='w-3 h-6 bg-gray-400 rounded'></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Team Stats */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-12'>
              <div className='text-center'>
                <div className='bg-red-600 p-4 rounded-xl inline-block mb-4'>
                  <Target className='w-8 h-8 text-white' />
                </div>
                <h4 className='text-2xl font-bold text-gray-900 mb-2'>500+</h4>
                <p className='text-gray-600'>{t('landing.cooperate.about.stats.successfulAgents')}</p>
              </div>

              <div className='text-center'>
                <div className='bg-red-600 p-4 rounded-xl inline-block mb-4'>
                  <Users className='w-8 h-8 text-white' />
                </div>
                <h4 className='text-2xl font-bold text-gray-900 mb-2'>10,000+</h4>
                <p className='text-gray-600'>{t('landing.cooperate.about.stats.satisfiedCustomers')}</p>
              </div>

              <div className='text-center'>
                <div className='bg-red-600 p-4 rounded-xl inline-block mb-4'>
                  <Heart className='w-8 h-8 text-white' />
                </div>
                <h4 className='text-2xl font-bold text-gray-900 mb-2'>24/7</h4>
                <p className='text-gray-600'>{t('landing.cooperate.about.stats.support')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {(values || []).map((value, index) => {
            const IconComponent = valueIcons[index]
            return (
              <div key={index} className='text-center p-8 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'>
                <div className='bg-red-600 p-4 rounded-xl inline-block mb-6'>
                  <IconComponent className='w-8 h-8 text-white' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-4'>{value.title}</h3>
                <p className='text-gray-600'>{value.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default About
