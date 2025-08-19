import React from 'react'

import AboutHero from '@/app/components/abount/AboutHero'
import CompanyInfo from '@/app/components/abount/CompanyInfo'
import TeamSection from '@/app/components/abount/TeamSection'
import MissionVision from '@/app/components/abount/MissionVision'
import ContactInfo from '@/app/components/abount/ContactInfo'

export default function PageIntroduce() {
  return (
    <>
      <AboutHero />
      <CompanyInfo />
      <TeamSection />
      <MissionVision />
      <ContactInfo />
    </>
  )
}
