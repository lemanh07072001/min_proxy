

import Hero from '@/app/[lang]/(private)/(landing-page)/components/Hero'
import ProductsSection from '@/app/[lang]/(private)/(landing-page)/components/ProductsSection'
import PartnersSection from '@/app/[lang]/(private)/(landing-page)/components/PartnersSection'

export default function Page() {
  return (
    <div >
      <Hero />
      <ProductsSection />
      <PartnersSection />
    </div>
  )
}
