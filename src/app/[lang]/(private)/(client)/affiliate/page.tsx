import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/libs/auth'
import type { Locale } from '@/configs/configi18n'
import { getDictionary } from '@/utils/getDictionary'
import AffiliateContent from '@/views/Client/Affiliate/AffiliateContent'

export default async function Affiliate({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const session = await getServerSession(authOptions)
  let affiliateData = []

  try {
    const res = await fetch(`${process.env.API_URL}/get-affiliate`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    affiliateData = await res.json()

    if (!res.ok) {
      throw new Error(`Lỗi API: ${res}`)
    }
  } catch (err) {
    console.error('Fetch error on server:', err)
  }

  const dictionary = await getDictionary(lang)

  return <AffiliateContent affiliateData={affiliateData} dictionary={dictionary} />
}
