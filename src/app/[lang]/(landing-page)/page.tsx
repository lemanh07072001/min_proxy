import dynamic from 'next/dynamic'

import type { Metadata } from 'next'


import Hero from '@/app/[lang]/(landing-page)/components/Hero'

// Below-fold: lazy load để Hero render nhanh hơn
const ProductsSection = dynamic(() => import('@/app/[lang]/(landing-page)/components/ProductsSection'), {
  ssr: true
})

const VietnamCoverageSection = dynamic(
  () => import('@/app/[lang]/(landing-page)/components/VietnamCoverageSection'),
  { ssr: true }
)

const PartnersSection = dynamic(() => import('@/app/[lang]/(landing-page)/components/PartnersSection'), {
  ssr: true
})

const TestimonialsSection = dynamic(() => import('@/app/[lang]/(landing-page)/components/TestimonialsSection'), {
  ssr: true
})

export const metadata: Metadata = {
  title: `MKT Proxy - Dịch Vụ Proxy Dân Cư Chất Lượng Cao`
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  return (
    <div>
      <Hero />
      <ProductsSection local={lang} />
      <VietnamCoverageSection />
      <PartnersSection />
      <TestimonialsSection />
    </div>
  )
}
