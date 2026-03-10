import type { Metadata } from 'next'

import EmptyAuthPage from '@/components/EmptyAuthPage'

export const metadata: Metadata = {
  title: 'Yêu cầu đăng nhập',
  description: 'Bạn cần đăng nhập để truy cập trang này.'
}

interface EmptyPageProps {
  params: {
    lang: string
  }
}

export default function EmptyPage({ params }: EmptyPageProps) {
  return <EmptyAuthPage lang={params.lang} />
}
