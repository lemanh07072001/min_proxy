"use client"

import React, { useState } from 'react'

import Header from '@/app/[locale]/(client)/layout-client/Header'
import Sidebar from '@/app/[locale]/(client)/layout-client/Sidebar'
import { useResponsive } from '@/app/hooks/useResponsive'
import HeaderMobile from '@/app/[locale]/(client)/layout-client/mobile/HeaderMobile'

interface HeaderProps {
  onToggleSidebar: () => void;
  onPageChange: (page: string) => void;
  children: React.ReactNode;
}


export default function MainClient({ children} : HeaderProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { isMobile } = useResponsive()

return (
  <div className='app'>
    <Header
      onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
    />
    <div className='app-container'>
      <div className='app-layout'>
        <div className={`sidebar-container ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <Sidebar collapsed={sidebarCollapsed} />
        </div>
        <div className='main-container'>{children}</div>
      </div>
    </div>
  </div>
)
}