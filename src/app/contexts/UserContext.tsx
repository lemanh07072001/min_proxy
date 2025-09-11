'use client'

import { createContext, useContext, ReactNode } from 'react'

interface UserContextType {
  user: any
}

export const UserContext = createContext<UserContextType | null>(null)

interface UserProviderProps {
  children: ReactNode
  value: any
}

export const UserProvider = ({ children, value }: UserProviderProps) => {
  return (
    <UserContext.Provider value={{ user: value }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
