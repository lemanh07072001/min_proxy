'use client'

import { createContext, useContext, ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import ScrollToTop from '@core/components/scroll-to-top'
import Button from '@mui/material/Button'

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

export default function LayoutProvider({ children }: LayoutProviderProps) {
  return (
    <LayoutContext.Provider value={{}}>
      {children}
      
      {/* ToastContainer được đặt ở đây để tránh re-render */}
      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
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
