import type { Metadata } from 'next'

import HistoryLoginPage from '@views/Client/HistoryLogin/HistoryLoginPage'

export const metadata: Metadata = {
  title: 'Lịch sử đăng nhập'
}

export default function OrderProxy() {
  return (
    <div className='main-page'>
      <HistoryLoginPage />
    </div>
  )
}
