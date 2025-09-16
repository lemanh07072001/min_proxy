'use client'

import React from 'react'

import { Shield, Award, Users, Globe, Star, CheckCircle } from 'lucide-react'

import { useTranslation } from 'react-i18next'

import { useLanguageSync } from '@/hooks/useLanguageSync'

const AboutHero = () => {
  const { t } = useTranslation()
  useLanguageSync() // Sync language with URL
  return (
    <section className='about-hero-modern'>
      <div className='about-hero-bg'>
        <div className='hero-gradient'></div>
        <div className='hero-particles'>
          <div className='particle particle-1'></div>
          <div className='particle particle-2'></div>
          <div className='particle particle-3'></div>
          <div className='particle particle-4'></div>
          <div className='particle particle-5'></div>
          <div className='particle particle-6'></div>
        </div>
      </div>

      <div className='container-lg'>
        <div className='row align-items-center min-vh-100'>
          <div className='col-lg-6'>
            <div className='about-hero-content'>
              <h1 className='about-hero-title-modern'>
                <span className='title-main'>{t('landing.about.hero.title.main')}</span>
                <span className='title-highlight'>{t('landing.about.hero.title.highlight')}</span>
              </h1>

              <p className='about-hero-subtitle-modern'>
                {t('landing.about.hero.subtitle', { appName: process.env.NEXT_PUBLIC_APP_NAME })}
              </p>

              <div className='hero-features-modern'>
                {t('landing.about.hero.features', { returnObjects: true }).map((feature: string, index: number) => (
                  <div key={index} className='feature-item-modern'>
                    <CheckCircle size={20} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className='hero-cta-modern'>
                <button className='btn-primary-modern'>
                  <span>{t('landing.about.hero.actions.contact')}</span>
                </button>
                <button className='btn-secondary-modern'>
                  <span>{t('landing.about.hero.actions.pricing')}</span>
                </button>
              </div>
            </div>
          </div>

          <div className='col-lg-6'>
            <div className='about-hero-visual-modern'>
              <div className='stats-grid'>
                <div className='stat-card stat-primary'>
                  <div className='stat-icon'>
                    <Users size={32} />
                  </div>
                  <div className='stat-content'>
                    <div className='stat-number'>5000+</div>
                    <div className='stat-label'>{t('landing.about.hero.stats.customers')}</div>
                  </div>
                </div>

                <div className='stat-card stat-success'>
                  <div className='stat-icon'>
                    <Globe size={32} />
                  </div>
                  <div className='stat-content'>
                    <div className='stat-number'>64</div>
                    <div className='stat-label'>{t('landing.about.hero.stats.provinces')}</div>
                  </div>
                </div>

                <div className='stat-card stat-warning'>
                  <div className='stat-icon'>
                    <Award size={32} />
                  </div>
                  <div className='stat-content'>
                    <div className='stat-number'>99.9%</div>
                    <div className='stat-label'>{t('landing.about.hero.stats.uptime')}</div>
                  </div>
                </div>

                <div className='stat-card stat-info'>
                  <div className='stat-icon'>
                    <Star size={32} />
                  </div>
                  <div className='stat-content'>
                    <div className='stat-number'>5+</div>
                    <div className='stat-label'>{t('landing.about.hero.stats.experience')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutHero
