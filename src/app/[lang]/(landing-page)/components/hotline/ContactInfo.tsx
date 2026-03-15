'use client'

import React, { useState } from 'react'

import '@/app/[lang]/(landing-page)/hotline/style.css'

import { Phone, Mail, MapPin, Globe, Send, CheckCircle, Menu, X } from 'lucide-react'

import { useTranslation } from 'react-i18next'

import { useLanguageSync } from '@/hooks/useLanguageSync'
import { useBranding } from '@/app/contexts/BrandingContext'

const ContactInfo = () => {
  const { t } = useTranslation()
  const branding = useBranding()

  useLanguageSync()
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Use branding values with translation fallbacks
  const phone = branding.organization_phone || t('landing.hotline.contactInfo.hotline.phone')
  const email = branding.organization_email || t('landing.hotline.contactInfo.email.address')
  const address = branding.organization_address || t('landing.hotline.contactInfo.address.location')
  const websiteUrl = branding.website_url || t('landing.hotline.contactInfo.website.url')
  const appName = branding.name

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16'>
      {/* Hero Section */}
      <div className='text-center mb-12 lg:mb-16'>
        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4'>
          {t('landing.hotline.hero.title')}
        </h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>{t('landing.hotline.hero.subtitle')}</p>
      </div>

      {/* Contact Content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        {/* Contact Information */}
        <div className='lg:col-span-1 space-y-6'>
          {/* Hotline */}
          <div className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300'>
            <div className='flex items-start space-x-4'>
              <div className='bg-green-500 p-3 rounded-xl flex-shrink-0'>
                <Phone className='w-6 h-6 text-white' />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                  {t('landing.hotline.contactInfo.hotline.title')}
                </h3>
                <a
                  href={`tel:${phone}`}
                  className='text-xl font-bold transition-colors block'
                  style={{ color: 'var(--primary-hover, #ef4444)' }}
                >
                  {phone}
                </a>
                <p className='text-sm text-gray-500 mt-1'>{t('landing.hotline.contactInfo.hotline.description')}</p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300'>
            <div className='flex items-start space-x-4'>
              <div className='bg-blue-500 p-3 rounded-xl flex-shrink-0'>
                <Mail className='w-6 h-6 text-white' />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                  {t('landing.hotline.contactInfo.email.title')}
                </h3>
                <a
                  href={`mailto:${email}`}
                  className='text-lg font-medium transition-colors break-all'
                  style={{ color: 'var(--primary-hover, #ef4444)' }}
                >
                  {email}
                </a>
                <p className='text-sm text-gray-500 mt-1'>{t('landing.hotline.contactInfo.email.description')}</p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300'>
            <div className='flex items-start space-x-4'>
              <div className='bg-orange-500 p-3 rounded-xl flex-shrink-0'>
                <MapPin className='w-6 h-6 text-white' />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                  {t('landing.hotline.contactInfo.address.title')}
                </h3>
                <p className='text-gray-700 font-medium leading-relaxed'>
                  {address}
                </p>
                <p className='text-sm text-gray-500 mt-1'>{t('landing.hotline.contactInfo.address.description')}</p>
              </div>
            </div>
          </div>

          {/* Website */}
          <div className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300'>
            <div className='flex items-start space-x-4'>
              <div className='bg-purple-500 p-3 rounded-xl flex-shrink-0'>
                <Globe className='w-6 h-6 text-white' />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                  {t('landing.hotline.contactInfo.website.title')}
                </h3>
                <a
                  href={websiteUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-lg font-medium transition-colors'
                  style={{ color: 'var(--primary-hover, #ef4444)' }}
                >
                  {websiteUrl}
                </a>
                <p className='text-sm text-gray-500 mt-1'>{t('landing.hotline.contactInfo.website.description')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className='lg:col-span-2'>
          <div className='bg-white rounded-2xl p-6 lg:p-8 shadow-sm'>
            <div className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>{t('landing.hotline.contactForm.title')}</h2>
              <p className='text-gray-600'>{t('landing.hotline.contactForm.subtitle')}</p>
            </div>

            {isSubmitted ? (
              <div className='text-center py-12'>
                <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
                <h3 className='text-xl font-semibold text-green-600 mb-2'>
                  {t('landing.hotline.contactForm.success.title')}
                </h3>
                <p className='text-gray-600'>{t('landing.hotline.contactForm.success.message')}</p>
              </div>
            ) : (
              <form className='space-y-6'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  <div>
                    <input
                      type='text'
                      name='name'
                      required
                      className='w-full px-4 py-3 border border-gray-200 rounded-xl input-brand-focus transition-colors outline-none bg-gray-50 focus:bg-white'
                      placeholder={t('landing.hotline.contactForm.fields.name')}
                    />
                  </div>

                  <div>
                    <input
                      type='email'
                      name='email'
                      required
                      className='w-full px-4 py-3 border border-gray-200 rounded-xl input-brand-focus transition-colors outline-none bg-gray-50 focus:bg-white'
                      placeholder={t('landing.hotline.contactForm.fields.email')}
                    />
                  </div>
                </div>

                <div>
                  <input
                    type='tel'
                    name='phone'
                    required
                    className='w-full px-4 py-3 border border-gray-200 rounded-xl input-brand-focus transition-colors outline-none bg-gray-50 focus:bg-white'
                    placeholder={t('landing.hotline.contactForm.fields.phone')}
                  />
                </div>

                <div>
                  <textarea
                    name='message'
                    required
                    rows={5}
                    className='w-full px-4 py-3 border border-gray-200 rounded-xl input-brand-focus transition-colors outline-none resize-vertical bg-gray-50 focus:bg-white'
                    placeholder={t('landing.hotline.contactForm.fields.message')}
                  />
                </div>

                <div className='flex justify-start'>
                  <button
                    type='submit'
                    className='text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    style={{ background: 'var(--primary-hover, #ef4444)' }}
                  >
                    <span>{t('landing.hotline.contactForm.submit')}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      <div className='mt-16 bg-white rounded-2xl p-8 shadow-sm'>
        <div className='text-center mb-8'>
          <h3 className='text-2xl font-bold text-gray-900 mb-4'>
            {t('landing.hotline.features.title', { appName })}
          </h3>
          <p className='text-gray-600 max-w-2xl mx-auto'>{t('landing.hotline.features.subtitle')}</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {(
            (t('landing.hotline.features.items', { returnObjects: true }) as Array<{
              title: string
              description: string
            }>) || []
          ).map((feature, index) => {
            const icons = [Phone, CheckCircle, Globe]
            const IconComponent = icons[index]
            const bgColors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100']
            const textColors = ['text-blue-600', 'text-green-600', 'text-purple-600']

            return (
              <div key={index} className='text-center'>
                <div
                  className={`${bgColors[index]} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <IconComponent className={`w-8 h-8 ${textColors[index]}`} />
                </div>
                <h4 className='font-semibold text-gray-900 mb-2'>{feature.title}</h4>
                <p className='text-gray-600'>{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default ContactInfo
