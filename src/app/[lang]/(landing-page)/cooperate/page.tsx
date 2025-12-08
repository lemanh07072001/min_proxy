import type { Metadata } from 'next'

import Services from '../components/cooperate/Services'
import Agency from '../components/cooperate/Agency'
import About from '../components/cooperate/About'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dictionary = await import(`@/locales/${lang}.json`).then(m => m.default)

  return {
    title: dictionary.landing?.header?.menu?.cooperate || 'Cooperate with us',
    description: dictionary.landing?.cooperate?.about?.subtitle || 'Join us as an agent and enjoy preferential policies'
  }
}

export default function CooperatePage() {
  return (
    <div className='min-h-screen relative'>
      <div className='relative'>
        <Services />
        <Agency />
        <About />
      </div>
    </div>
  )
}
