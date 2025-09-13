import React from 'react'

import AboutHero from '@/app/[lang]/(landing-page)/components/abount/AboutHero'
import CompanyInfo from '@/app/[lang]/(landing-page)/components/abount/CompanyInfo'
import TeamSection from '@/app/[lang]/(landing-page)/components/abount/TeamSection'
import MissionVision from '@/app/[lang]/(landing-page)/components/abount/MissionVision'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Giới thiệu về chúng tôi`,
  description: 'Mô tả ngắn gọn về trang web.'
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
