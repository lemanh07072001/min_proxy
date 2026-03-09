'use client'

import { useState, useEffect } from 'react'

import CheckProxyForm from '@views/Client/CheckProxy/CheckProxyForm'
import CheckProxyTable from '@views/Client/CheckProxy/CheckProxyTable'

interface ProxyData {
  id: number
  proxy: string
  ip: string
  protocol: string
  status: string
  responseTime: number | string
  type: string
  message?: string
}

export default function CheckProxyPage() {
  const [checkResults, setCheckResults] = useState<ProxyData[]>([])
  const [checkedProxy, setCheckedProxy] = useState<ProxyData[]>([])

  useEffect(() => {
    if (!checkedProxy || checkedProxy.length === 0) return

    setCheckResults(prevResults =>
      prevResults.map(item => {
        const matchedProxy = checkedProxy.find(checked => checked.proxy === item.proxy)

        return matchedProxy ? { ...item, ...matchedProxy } : item
      })
    )
  }, [checkedProxy])

  return (
    <div className='main-page'>
      <div className='check-proxy-grid'>
        <CheckProxyForm onItemListChange={setCheckResults} onCheckedProxy={setCheckedProxy} />
        <CheckProxyTable data={checkResults} checkedProxy={checkedProxy} />
      </div>
    </div>
  )
}
