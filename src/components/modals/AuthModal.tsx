'use client'

import { X, Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { useTranslation } from 'react-i18next'

import { useModalContext } from '@/app/contexts/ModalContext'

import LoginForm from '@views/Auth/LoginForm'
import RegisterForm from '@views/Auth/RegisterForm'
import ForgotPasswordForm from '@views/Auth/ForgotPasswordForm'
import ResetPasswordForm from '@views/Auth/ResetPasswordForm'

const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, setAuthModalMode } = useModalContext()

  const { t } = useTranslation()

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          className='login-modal-overlay'
          onClick={closeAuthModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className='login-modal-container'
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* Close Button */}
            <button className='login-modal-close' onClick={closeAuthModal}>
              <X size={24} color='#666' />
            </button>

            {/* Logo and Header */}
            <div className='login-modal-header'>
              <div className='login-modal-logo'>
                <div className='logo-icon'>
                  <svg width='60' height='60' viewBox='0 0 60 60' fill='none'>
                    <circle cx='30' cy='30' r='30' fill='#FF4444' />
                    <path
                      d='M30 15C22.268 15 16 21.268 16 29C16 36.732 22.268 43 30 43C37.732 43 44 36.732 44 29C44 21.268 37.732 15 30 15ZM30 18C36.065 18 41 22.935 41 29C41 35.065 36.065 40 30 40C23.935 40 19 35.065 19 29C19 22.935 23.935 18 30 18Z'
                      fill='white'
                    />
                    <rect x='26' y='24' width='8' height='6' rx='1' fill='white' />
                    <rect x='24' y='28' width='12' height='8' rx='2' fill='white' />
                    <circle cx='28' cy='32' r='1' fill='#FF4444' />
                    <circle cx='32' cy='32' r='1' fill='#FF4444' />
                  </svg>
                </div>
              </div>
              <h1 className='login-modal-title'>
                {authModalMode === 'login' && t('auth.messages.welcomeBack')}
                {authModalMode === 'register' &&
                  t('auth.messages.welcomeToApp', { appName: process.env.NEXT_PUBLIC_APP_NAME })}
                {authModalMode === 'reset' && t('auth.messages.forgotPasswordTitle')}
                {authModalMode === 'resetpass' && t('auth.messages.forgotPasswordTitle')}
              </h1>
              <p className='login-modal-subtitle'>
                {authModalMode === 'login' && t('auth.messages.loginInstructions')}
                {authModalMode === 'register' && t('auth.messages.registerInstructions')}
                {authModalMode === 'reset' && t('auth.messages.forgotPasswordInstructions')}
                {authModalMode === 'resetpass' && t('auth.messages.forgotPasswordInstructions')}
              </p>
            </div>

            {/* Form */}
            {authModalMode === 'login' && <LoginForm />}
            {authModalMode === 'register' && <RegisterForm />}
            {authModalMode === 'reset' && <ForgotPasswordForm />}
            {authModalMode === 'resetpass' && <ResetPasswordForm />}

            {/* Switch Mode Buttons */}
            <div className='login-modal-switch'>
              {authModalMode === 'login' ? (
                <div>
                  <span>{t('auth.buttons.noAccount')} </span>
                  <button
                    type='button'
                    className='login-modal-switch-btn'
                    style={{
                      background: 'transparent'
                    }}
                    onClick={() => setAuthModalMode('register')}
                  >
                    {t('auth.buttons.registerNow')}
                  </button>
                </div>
              ) : (
                <div>
                  <span> {t('auth.buttons.hasAccount')} </span>
                  <button
                    type='button'
                    className='login-modal-switch-btn'
                    style={{
                      background: 'transparent'
                    }}
                    onClick={() => setAuthModalMode('login')}
                  >
                    {t('auth.buttons.loginNow')}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AuthModal
