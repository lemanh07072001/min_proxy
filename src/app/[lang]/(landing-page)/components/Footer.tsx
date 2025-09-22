'use client'

import React from 'react'

import Image from 'next/image'

import { Shield, Phone, Mail, MapPin, Facebook, Send, MessageCircle } from 'lucide-react'

import { useTranslation } from 'react-i18next'

import { useLanguageSync } from '@/hooks/useLanguageSync'

import { infoConfigs } from '@/configs/infoConfig'
import Link from '@/components/Link'

const Footer = () => {
  const { t } = useTranslation()

  useLanguageSync() // Sync language with URL

  return (
    <footer className='footer-main'>
      {/* CTA Section */}
      <div className='footer-cta'>
        <div className='container-lg'>
          <div className='cta-content'>
            <h2>{t('landing.footer.cta.title')}</h2>
            <p>{t('landing.footer.cta.description')}</p>
            <div className='cta-buttons'>
              <button className='btn-cta-primary'>
                <span>{t('landing.footer.cta.contactAgent')}</span>
              </button>
              <button className='btn-cta-secondary'>
                <span>{t('landing.footer.cta.registerNow')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className='footer-content'>
        <div className='container-lg'>
          <div className='row'>
            {/* Company Info */}
            <div className='col-lg-3 col-md-6 mb-4'>
              <div className='footer-section'>
                <h4>{t('landing.footer.sections.company.title')}</h4>
                <ul className='footer-links'>
                  <li>
                    <a href='#'>{t('landing.footer.sections.company.about')}</a>
                  </li>
                  <li>
                    <a href='#'>{t('landing.footer.sections.company.agentOffers')}</a>
                  </li>
                  <li>
                    <a href='#'>{t('landing.footer.sections.company.partners')}</a>
                  </li>
                  <li>
                    <a href='#'>{t('landing.footer.sections.company.sitemap')}</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Products */}
            <div className='col-lg-3 col-md-6 mb-4'>
              <div className='footer-section'>
                <h4>{t('landing.footer.sections.products.title')}</h4>
                <ul className='footer-links'>
                  <li>
                    <a href='#'>{t('landing.footer.sections.products.staticProxy')}</a>
                  </li>
                  <li>
                    <a href='#'>{t('landing.footer.sections.products.rotatingProxy')}</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Top Locations */}
            <div className='col-lg-3 col-md-6 mb-4'>
              <div className='footer-section'>
                <h4>{t('landing.footer.sections.locations.title')}</h4>
                <ul className='footer-links'>
                  <li>
                    <a href='#'>{t('landing.footer.sections.locations.hcm')}</a>
                  </li>
                  <li>
                    <a href='#'>{t('landing.footer.sections.locations.hanoi')}</a>
                  </li>
                  <li>
                    <a href='#'>{t('landing.footer.sections.locations.hungYen')}</a>
                  </li>
                  <li>
                    <a href='#'>{t('landing.footer.sections.locations.tuyenQuang')}</a>
                  </li>
                  <li>
                    <a href='#'>{t('landing.footer.sections.locations.binhDinh')}</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Get Started */}
            <div className='col-lg-3 col-md-6 mb-4'>
              <div className='footer-section'>
                <h4>{t('landing.footer.sections.getStarted.title')}</h4>
                <ul className='footer-links'>
                  <li>
                    <a href='#'>{t('landing.footer.sections.getStarted.becomeCTV')}</a>
                  </li>
                  <li>
                    <a href='#'>{t('landing.footer.sections.getStarted.becomeAgent')}</a>
                  </li>
                  <li>
                    <a href='#'>{t('landing.footer.sections.getStarted.buyCheap')}</a>
                  </li>
                  <li>
                    <a href='#'>{t('landing.footer.sections.getStarted.autoTrade')}</a>
                  </li>
                  <li>
                    <a href='#'>{t('landing.footer.sections.getStarted.help')}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className='footer-bottom'>
        <div className='container-lg'>
          <div className='row align-items-center'>
            <div className='col-md-6'>
              <div className='footer-logo'>
                <Shield size={32} />
                <div className='logo-text'>{process.env.NEXT_PUBLIC_APP_NAME}</div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='footer-legal'>
                <div className='legal-links'>
                  <a href='#'>{t('landing.footer.legal.privacy')}</a>
                  <a href='#'>{t('landing.footer.legal.service')}</a>
                  <a href='#'>{t('landing.footer.legal.refund')}</a>
                </div>
                <div className='copyright'>
                  {t('landing.footer.legal.copyright', { appName: process.env.NEXT_PUBLIC_APP_NAME })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className='contact-info'>
        <div className='container'>
          <div className='contact-text'>{t('landing.footer.contact.title')}</div>
          <div className='contact-icons'>
            <a href='#' className='contact-icon facebook'>
              <Facebook size={20} />
            </a>
            <a href='#' className='contact-icon telegram'>
              <Send size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className='payment-methods'>
        <div className='container'>
          <div className='payment-icons'>
            <div className='payment-icon'>VISA</div>
            <div className='payment-icon'>MC</div>
            <div className='payment-icon'>JCB</div>
            <div className='payment-icon'>AMEX</div>
            <div className='payment-icon'>UNION</div>
            <div className='payment-icon'>PAYPAL</div>
            <div className='payment-icon'>CRYPTO</div>
          </div>
        </div>
      </div>

      {/* Floating Contact */}
      <div className='floating-contact'>
        {infoConfigs.map(item => {
          return (
            <Link href={item.link} key={item.key} target='_blank'>
              <Image src={item.icon} alt={item.title || 'Social Icon'} width='80' height='80' />
            </Link>
          )
        })}
      </div>
    </footer>
  )
}

export default Footer
