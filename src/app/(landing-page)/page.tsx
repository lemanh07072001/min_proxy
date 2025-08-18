import Hero from '@/app/components/Hero'
import ProductsSection from '@/app/components/ProductsSection'
import PartnersSection from '@/app/components/PartnersSection'

export default function Page() {
  return (
    <div className='position-relative' style={{ background: 'linear-gradient(#f8fafc 0%, #fff 100%)' }}>
      <Hero />
      <ProductsSection />
      <PartnersSection />
    </div>
  )
}
