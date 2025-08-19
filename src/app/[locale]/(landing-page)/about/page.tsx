import React from 'react'

import AboutHero from '@/app/[locale]/(landing-page)/components/abount/AboutHero'
import CompanyInfo from '@/app/[locale]/(landing-page)/components/abount/CompanyInfo'
import TeamSection from '@/app/[locale]/(landing-page)/components/abount/TeamSection'
import MissionVision from '@/app/[locale]/(landing-page)/components/abount/MissionVision'

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
