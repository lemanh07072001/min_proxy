import React, { useState } from 'react'

import MainHeader from '@/app/[lang]/(landing-page)/components/MainHeader'

interface HeaderProps {
  onToggleSidebar?: () => void
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  return (
    <>
      {/* Promotional Banner */}
      <div className='promo-banner'>
        <div className='container-fluid'>
          <div className='d-flex align-items-center justify-content-center flex-wrap py-2'>
            <span className='me-2'>🔥</span>
            <span className='me-3'>
              Tuyển đại lý: Trở thành đại lý cho {process.env.NEXT_PUBLIC_APP_NAME} để nhận được nhiều ưu đãi hấp dẫn
            </span>
            <button className='promo-btn'>Hợp tác ngay</button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <MainHeader />
    </>
  )
}

export default Header
