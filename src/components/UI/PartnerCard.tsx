import React from 'react'

import Image from 'next/image'

interface Partner {
  id: number
  name: string
  logoUrl: string
  title: string
  description: string[]
  subtitle: string
}

interface PartnerCardProps {
  partner: Partner
}

export const PartnerCard: React.FC<PartnerCardProps> = ({ partner }) => {
  console.log(partner.logoUrl)

  return (
    <div className='bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group'>
      <div className='p-6'>
        <div className='flex items-start justify-between mb-6'>
          <div className='flex items-center space-x-4'>
            <Image src={partner.logoUrl} alt={`Logo của ${partner.name}`} width={100} height={48} />
            <div>
              <h3 className='font-bold text-lg text-gray-900'>{partner.name}</h3>
              <p className='text-sm text-gray-500 mt-0.5'>{partner.subtitle}</p>
            </div>
          </div>
        </div>

        <div className='space-y-3 mb-3'>
          {partner.description.map((desc, index) => (
            <p key={index} className='text-md text-gray-600 leading-relaxed'>
              {desc}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
