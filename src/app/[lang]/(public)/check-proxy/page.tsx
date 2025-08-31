import type { Metadata } from 'next'

import CheckProxyPage from '@/app/[lang]/(public)/check-proxy/CheckPorxyPage'

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | Check proxy`,
  description: 'Mô tả ngắn gọn về trang web.'
}

export default function CheckProxy() {
  return <CheckProxyPage />
}
