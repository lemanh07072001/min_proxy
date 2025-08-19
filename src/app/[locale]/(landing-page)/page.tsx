import BackgroundPattern from '@/app/[locale]/(landing-page)/components/BackgroundPattern'

import Hero from '@/app/[locale]/(landing-page)/components/Hero'
import SocialIcons from '@/app/[locale]/(landing-page)/components/SocialIcons'
import ProductsSection from '@/app/[locale]/(landing-page)/components/ProductsSection'
import PartnersSection from '@/app/[locale]/(landing-page)/components/PartnersSection'

export default function Page() {
  return (
    <div className='position-relative' style={{ background: 'linear-gradient(#f8fafc 0%, #fff 100%)' }}>
      <Hero />
      <ProductsSection />
      <PartnersSection />
    </div>
  )
}
