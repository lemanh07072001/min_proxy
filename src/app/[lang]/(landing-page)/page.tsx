import Hero from '@/app/[lang]/(landing-page)/components/Hero'
import ProductsSection from '@/app/[lang]/(landing-page)/components/ProductsSection'
import PartnersSection from '@/app/[lang]/(landing-page)/components/PartnersSection'

export default function Page() {
  return (
    <div>
      <Hero />

      <ProductsSection />
      <PartnersSection />
    </div>
  )
}
