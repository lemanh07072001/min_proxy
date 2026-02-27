'use client'

import { createContext, useContext, ReactNode } from 'react'

import { ToastContainer } from 'react-toastify'

import Button from '@mui/material/Button'

import ScrollToTop from '@core/components/scroll-to-top'
import { useDepositSocket } from '@/hooks/useDepositSocket'

interface LayoutContextType {

  // Có thể thêm các giá trị context nếu cần
}

const LayoutContext = createContext<LayoutContextType | null>(null)

export const useLayout = () => {
  const context = useContext(LayoutContext)

  if (!context) {
    throw new Error('useLayout must be used within LayoutProvider')
  }

  
return context
}

interface LayoutProviderProps {
  children: ReactNode
}

function DepositSocketListener() {
  useDepositSocket()
  return null
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  return (
    <LayoutContext.Provider value={{}}>
      <DepositSocketListener />
      {children}
      
      {/* ToastContainer được đặt ở đây để tránh re-render */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"

      />

      {/* ScrollToTop được đặt ở đây để tránh re-render */}
      <ScrollToTop className='mui-fixed'>
        <Button 
          variant='contained' 
          className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
        >
          <i className='tabler-arrow-up' />
        </Button>
      </ScrollToTop>
    </LayoutContext.Provider>
  )
}
