'use client'

import type { CSSProperties } from 'react'

import Image from 'next/image'

const Logo = ({ color }: { color?: CSSProperties['color'] }) => {
  return (
    <div className='flex items-center'>
      <Image 
        src='/images/logo/Logo_MKT_Proxy.png' 
        alt='Logo_MKT_Proxy' 
        width={180} 
        height={50}
        priority
        unoptimized={false}
        onError={(e) => {
          console.error('Logo image failed to load:', e)
        }}
      />
    </div>
  )
}

export default Logo
