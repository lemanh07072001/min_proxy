import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | Trang chủ`,
  description: 'Mô tả ngắn gọn về trang web.'
}

export default function Overview() {
  console.log('dsadsa', process.env.NEXT_PUBLIC_API_URL)

  return <h1>das</h1>
}
