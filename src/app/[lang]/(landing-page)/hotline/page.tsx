import ContactInfo from '@/app/[lang]/(landing-page)/components/hotline/ContactInfo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Liên hệ`,
  description: 'Mô tả ngắn gọn về trang web.'
}

export default function PageHotline() {
  return (
    <>
      <ContactInfo />
    </>
  )
}
