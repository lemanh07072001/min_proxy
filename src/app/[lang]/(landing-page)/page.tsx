import Hero from '@/app/[lang]/(landing-page)/components/Hero'
import ProductsSection from '@/app/[lang]/(landing-page)/components/ProductsSection'
import PartnersSection from '@/app/[lang]/(landing-page)/components/PartnersSection'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: `Chào mừng đến mới ${process.env.NEXT_PUBLIC_APP_NAME} `,
  description: 'Mô tả ngắn gọn về trang web.'
}
export default function Page({ params }: { params: { lang: string } }) {
  return (
    <div>
      <Hero />

      <ProductsSection params={params} />
      <PartnersSection />
    </div>
  )
}
