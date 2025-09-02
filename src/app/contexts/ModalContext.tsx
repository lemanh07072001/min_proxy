'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ModalContextType {
  isAuthModalOpen: boolean
  authModalMode: 'login' | 'register'
  openAuthModal: (mode?: 'login' | 'register') => void
  closeAuthModal: () => void
  setAuthModalMode: (mode: 'login' | 'register') => void
}

const ModalContext = createContext<ModalContextType | null>(null)

// Custom hook để sử dụng ModalContext
export const useModalContext = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModalContext must be used within ModalContextProvider')
  }
  return context
}

// Provider component
interface ModalContextProviderProps {
  children: ReactNode
}

export const ModalContextProvider = ({ children }: ModalContextProviderProps) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login')

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode)
    setIsAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  const setMode = (mode: 'login' | 'register') => {
    setAuthModalMode(mode)
  }

  const value: ModalContextType = {
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    setAuthModalMode: setMode
  }

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  )
}
