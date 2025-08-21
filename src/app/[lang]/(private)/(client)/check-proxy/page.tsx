import './styles.css'

// eslint-disable-next-line import/order
import { Search } from 'lucide-react'
import CheckProxyForm from '@views/Client/CheckProxy/CheckProxyForm'
import CheckProxyTable from '@views/Client/CheckProxy/CheckProxyTable'

export default function CheckProxy() {
  const checkResults = [
    {
      id: 1,
      proxy: '171.246.183.233:35403:ava634:oqg3mjczruu0ng==',
      ip: '171.246.183.233',
      protocol: 'HTTP',
      status: 'active',
      responseTime: '245ms',
      location: 'Vietnam'
    }
  ]

  return (
    <>
      <div className='check-proxy-page'>
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
      </div>
      <div className='check-proxy-content'>
        <div className='check-proxy-grid'>
          {/*  Form  */}
          <CheckProxyForm />
          {/* Table */}
          <CheckProxyTable data={checkResults} />
        </div>
      </div>
    </>
  )
}
