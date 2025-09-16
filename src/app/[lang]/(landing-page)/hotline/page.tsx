import ContactInfo from '@/app/[lang]/(landing-page)/components/hotline/ContactInfo'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params
  const dictionary = await import(`@/locales/${lang}.json`).then(m => m.default)

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
