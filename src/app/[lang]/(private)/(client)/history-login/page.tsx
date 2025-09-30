
import type { Metadata } from 'next'
import HistoryLoginPage from '@views/Client/HistoryLogin/HistoryLoginPage'


export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | Lịch sử đăng nhập`,
}

export default async function OrderProxy() {

  return (
    <div className='main-page'>
      <HistoryLoginPage/>
    </div>
  )
}
