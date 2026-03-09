'use client'

import type { CSSProperties } from 'react'

import { useBranding } from '@/app/contexts/BrandingContext'

const Logo = ({ color }: { color?: CSSProperties['color'] }) => {
  const { logo, name } = useBranding()

  return (
    <div className='flex items-center'>
      <img
        src={logo}
        alt={name}
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
