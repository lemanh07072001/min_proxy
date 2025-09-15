import type { Metadata } from 'next'

import { OverviewPage } from '@views/Client/Overview/OverviewPage'

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | Trang chủ`,
  description: 'Mô tả ngắn gọn về trang web.'
}

export default function Overview() {
  return <OverviewPage />
}
