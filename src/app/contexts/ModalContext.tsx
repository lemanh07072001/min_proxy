'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface ModalContextType {
  isAuthModalOpen: boolean
  authModalMode: 'login' | 'register' | 'reset' | 'resetpass'
  resetEmail: string | null
  resetToken: string | null
  resetPassword: string | null
  referralCode: string | null
  openAuthModal: (mode?: 'login' | 'register' | 'reset' | 'resetpass', email?: string, token?: string) => void // ✅ bỏ password
  closeAuthModal: () => void
  setAuthModalMode: (mode: 'login' | 'register' | 'reset' | 'resetpass') => void
  setResetData: (email: string, token: string) => void
  setResetPassword: (password: string) => void
  setReferralCode: (code: string | null) => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export const useModalContext = () => {
  const context = useContext(ModalContext)

  if (!context) throw new Error('useModalContext must be used within ModalContextProvider')

  return context
}

interface ModalContextProviderProps {
  children: ReactNode
}

export const ModalContextProvider = ({ children }: ModalContextProviderProps) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'reset' | 'resetpass'>('login')

  // ✅ Thêm state cho email & token
  const [resetEmail, setResetEmail] = useState<string | null>(null)
  const [resetToken, setResetToken] = useState<string | null>(null)
  const [resetPassword, setResetPassword] = useState<string | null>(null)
  // ✅ Thêm state cho referral code
  const [referralCode, setReferralCode] = useState<string | null>(null)

  // ✅ Auto open register modal when ?ref= is present
  const searchParams = useSearchParams()
  const hasHandledRef = useRef(false)

  useEffect(() => {
    if (hasHandledRef.current) return

    const ref = searchParams.get('ref')

    if (ref) {
      setReferralCode(ref)
      setAuthModalMode('register')
      setIsAuthModalOpen(true)
    }

    hasHandledRef.current = true
  }, [searchParams])

  const openAuthModal = (
    mode: 'login' | 'register' | 'reset' | 'resetpass' = 'login',
    email?: string,
    token?: string
  ) => {
    setAuthModalMode(mode)

    if (mode === 'reset' || mode === 'resetpass') {
      if (email) setResetEmail(email)
      if (token) setResetToken(token)
    }

    setIsAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  const setMode = (mode: 'login' | 'register' | 'reset' | 'resetpass') => {
    setAuthModalMode(mode)
  }

  const setResetData = (email: string, token: string) => {
    setResetEmail(email)
    setResetToken(token)
  }

  const value: ModalContextType = {
    isAuthModalOpen,
    authModalMode,
    resetEmail,
    resetToken,
    resetPassword,
    referralCode,
    openAuthModal,
    closeAuthModal,
    setAuthModalMode: setMode,
    setResetData,
    setResetPassword,
    setReferralCode
  }

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}
