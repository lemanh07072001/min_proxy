import { PartnerCard } from '@components/UI/PartnerCard'

async function getPartners() {
  try {
    const res = await fetch(`${process.env.API_URL}/get-partner`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching partner data:", error);
    return [];
  }
}

export default async function Partner(){
  const partners = await getPartners();

  return (
    <>
      {/* Welcome Section */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>{`Đối tác ${process.env.NEXT_PUBLIC_APP_NAME}`} </h1>
        <p className='text-gray-600'>
          Tham gia hệ sinh thái của chúng tôi. Chúng tôi cung cấp các công cụ và hỗ trợ tốt nhất để bạn tối đa hóa lợi nhuận.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
      </div>
    </>
  )
}