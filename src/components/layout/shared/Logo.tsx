'use client'

import type { CSSProperties } from 'react'

const Logo = ({ color }: { color?: CSSProperties['color'] }) => {
  return (
    <div className='flex items-center'>
      <img 
        src='/images/logo/Logo_MKT_Proxy.png' 
        alt='Logo_MKT_Proxy' 
        width={180} 
        height={50}
        style={{ maxWidth: '100%', height: 'auto' }}
        onError={(e) => {
          console.error('Logo image failed to load:', e)
          const target = e.target as HTMLImageElement
          if (target) {
            target.style.display = 'none'
          }
        }}
      />
    </div>
  )
}

export default Logo
