'use client'

import React from 'react'
import RotatingProxyPage from '@views/Client/RotatingProxy/RotatingProxyPage'

interface ProxyPlansClientProps {
  data: any[]
}

export default function ProxyPlansClient({ data }: ProxyPlansClientProps) {
  return (
    <div className='proxy-xoay-page'>
      <div className='plans-container'>
        <RotatingProxyPage data={data} />
      </div>
    </div>
  )
}
