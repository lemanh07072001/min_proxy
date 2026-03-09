'use client'
import React from 'react'

import RotatingProxyPage from '@views/Client/RotatingProxy/RotatingProxyPage'

interface ProxyPlansClientProps {
  data: any[]
}

export default function ProxyPlansClient({ data }: ProxyPlansClientProps) {
  return <RotatingProxyPage data={data} />
}
