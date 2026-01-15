import React from 'react'

import type { Metadata } from 'next'

import AboutHero from '@/app/[lang]/(landing-page)/components/abount/AboutHero'
import CompanyInfo from '@/app/[lang]/(landing-page)/components/abount/CompanyInfo'
import TeamSection from '@/app/[lang]/(landing-page)/components/abount/TeamSection'
import MissionVision from '@/app/[lang]/(landing-page)/components/abount/MissionVision'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  
  // Import dictionary based on language
  const dictionary = await import(`@/data/dictionaries/${lang}.json`).then(m => m.default)
  
  return {
    title: dictionary.landing?.header?.menu?.about || 'About Us',
    description: dictionary.landing?.about?.companyInfo?.description || 'Learn more about our company'
  }
}

export default function PageAbount() {
  return (
    <>
      <AboutHero />
      <CompanyInfo />
      <TeamSection />
      <MissionVision />
    </>
  )
}
