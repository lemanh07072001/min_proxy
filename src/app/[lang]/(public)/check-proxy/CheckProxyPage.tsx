"use client"

import './styles.css'

import { useEffect, useState } from 'react'

// eslint-disable-next-line import/order
import { Search } from 'lucide-react'
import CheckProxyForm from '@views/Client/CheckProxy/CheckProxyForm'

import CheckProxyTable from '@views/Client/CheckProxy/CheckProxyTable'

interface ProxyData {
  id: number;
  proxy: string;
  ip: string;
  protocol: string;
  status: string;
  responseTime: number | string;
  type: string;
  message?: string;
}

export default function CheckProxyPage() {
  const [checkResults, setCheckResults] = useState<ProxyData[]>([])
  const [checkedProxy, setCheckedProxy] = useState<ProxyData[]>([])

  useEffect(() => {
    // Nếu checkedProxy chưa có dữ liệu thì không làm gì cả
    if (!checkedProxy || checkedProxy.length === 0) {
      return
    }

    // Cập nhật lại state checkResults
    setCheckResults(prevResults => {
      // Dùng .map() để tạo ra một mảng mới
      return prevResults.map(item => {
        // So sánh proxy trong mảng với proxy vừa được check xong
        const matchedProxy = checkedProxy.find(checked => checked.proxy === item.proxy)
        if (matchedProxy) {
          // Nếu tìm thấy, cập nhật item đó bằng dữ liệu mới từ checkedProxy
          return { ...item, ...matchedProxy }
        }
        // Nếu không khớp, giữ nguyên item cũ
        return item
      })
    })
  }, [checkedProxy])

  return (
    <>
      <div className='main-page'>
        {/* Page Header */}
        <div className='page-header-check'>
          <div className='header-content'>
            <div className='header-left'>
              <div className='page-icon'>
                <Search size={32} />
              </div>
              <div>
                <h1>Kiểm tra thông tin Proxy</h1>
                <p className='page-subtitle'>Kiểm tra tính khả dụng và thông tin chi tiết của proxy</p>
              </div>
            </div>
          </div>
        </div>

        <div className='check-proxy-grid'>
          {/*  Form  */}
          <CheckProxyForm onItemListChange={setCheckResults} onCheckedProxy={setCheckedProxy}/>
          {/* Table */}
          <CheckProxyTable data={checkResults} checkedProxy={checkedProxy}/>
        </div>
      </div>

    </>
  )
}
