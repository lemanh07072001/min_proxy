import type { Metadata } from 'next'

import ContactInfo from '@/app/[lang]/(landing-page)/components/hotline/ContactInfo'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dictionary = await import(`@/data/dictionaries/${lang}.json`).then(m => m.default)

  return {
    title: dictionary.landing?.header?.menu?.hotline || 'Contact us',
    description: dictionary.landing?.hotline?.hero?.subtitle || 'We are always ready to support and advise you'
  }
}

export default function PageHotline() {
  return (
    <>
      <ContactInfo />
    </>
  )
}
