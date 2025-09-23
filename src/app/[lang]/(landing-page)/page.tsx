import type { Metadata } from 'next'

import Hero from '@/app/[lang]/(landing-page)/components/Hero'
import ProductsSection from '@/app/[lang]/(landing-page)/components/ProductsSection'
import PartnersSection from '@/app/[lang]/(landing-page)/components/PartnersSection'

export const metadata: Metadata = {
  title: `Trang chủ`,
  description: 'Mô tả ngắn gọn về trang web.'
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  return (
    <div>
      <Hero />

      <ProductsSection local={lang} />
      <PartnersSection local={lang} />
    </div>
  )
}
