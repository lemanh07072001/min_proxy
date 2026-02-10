import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/libs/auth'
import type { Locale } from '@/configs/configi18n'
import { getDictionary } from '@/utils/getDictionary'
import AffiliateManagementPage from '@/views/Client/Admin/AffiliateManagement/AffiliateManagementPage'

export default async function AdminAffiliatePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return <AffiliateManagementPage dictionary={dictionary} />
}
