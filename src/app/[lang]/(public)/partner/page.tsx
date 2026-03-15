import { PartnerCard } from '@components/UI/PartnerCard'

import axiosInstance from '@/libs/axios'

async function getPartners() {
  try {
    const res = await axiosInstance.get('/get-partners')

    return res?.data?.data ?? []
  } catch {
    return []
  }
}

export default async function Partner() {
  const partners = await getPartners()

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {partners.map((partner: any) => (
          <PartnerCard
            key={partner.id}
            partner={{
              id: partner.id,
              name: partner.name,
              subtitle: partner.subtitle || '',
              description: partner.description || [],
              logoUrl: partner.logo_url || '',
              title: partner.name
            }}
          />
        ))}
        {partners.length === 0 && (
          <div className='col-span-3 text-center text-gray-500 py-10'>
            Chưa có đối tác nào.
          </div>
        )}
      </div>
    </>
  )
}
