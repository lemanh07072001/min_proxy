

import Hero from '@/app/[lang]/(private)/(landing-page)/components/Hero'
import ProductsSection from '@/app/[lang]/(private)/(landing-page)/components/ProductsSection'
import PartnersSection from '@/app/[lang]/(private)/(landing-page)/components/PartnersSection'

export default function Page() {
  return (
    <div className='position-relative' style={{ background: 'linear-gradient(#f8fafc 0%, #fff 100%)' }}>
      <Hero />
      <ProductsSection />
      <PartnersSection />
    </div>
  )
}
