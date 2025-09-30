import type { Metadata } from 'next'

import Hero from '@/app/[lang]/(landing-page)/components/Hero'
import ProductsSection from '@/app/[lang]/(landing-page)/components/ProductsSection'
import PartnersSection from '@/app/[lang]/(landing-page)/components/PartnersSection'

export const metadata: Metadata = {
  title: `Trang chủ`,
}

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = await params

  return (
    <div>
      <Hero />

      <ProductsSection local={lang} />
      <PartnersSection local={lang} />
    </div>
  )
}
