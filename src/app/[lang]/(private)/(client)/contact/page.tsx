'use client'

import Image from 'next/image'

import { useBranding } from '@/app/contexts/BrandingContext'

export default function Contact() {
  const branding = useBranding()

  const phone = branding.organization_phone || ''
  const email = branding.organization_email || ''
  const address = branding.organization_address || ''
  const workingHours = branding.working_hours || ''
  const appName = branding.name
  const ph = branding.primaryHover

  // Social links từ DB, fallback hardcode
  const socialLinks = branding.social_links && branding.social_links.length > 0
    ? branding.social_links.filter(l => l.url)
    : []

  const platformConfig: Record<string, { image: string; displayValue: string }> = {
    facebook: { image: '/images/infos/fb.png', displayValue: appName },
    zalo: { image: '/images/infos/zalo.png', displayValue: phone },
    telegram: { image: '/images/infos/tele.png', displayValue: socialLinks.find(l => l.platform === 'telegram')?.url?.replace('https://t.me/', '@') || '' },
    tiktok: { image: '/images/infos/tiktok.png', displayValue: 'TikTok' },
    youtube: { image: '/images/infos/youtube.png', displayValue: 'YouTube' },
  }

  return (
    <div className='min-h-screen'>
      <div className='max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8'>
        {/* Social links */}
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12'>
          {socialLinks.map((link, i) => {
            const config = platformConfig[link.platform] || { image: '', displayValue: link.platform }

            return (
              <a
                key={i}
                href={link.url}
                target='_blank'
                rel='noopener noreferrer'
                className='group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1'
              >
                {config.image && (
                  <div className='rounded-xl flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-300'>
                    <Image src={config.image} alt={link.platform} width={80} height={80} className='object-contain' />
                  </div>
                )}
                <h3 className='text-base md:text-lg font-bold text-gray-800 mb-2 text-center capitalize'>{link.platform}</h3>
                <p className='text-xs md:text-sm text-gray-600 text-center break-words'>{config.displayValue}</p>
              </a>
            )
          })}
        </div>

        {/* Giờ làm việc + Hỗ trợ */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-12'>
          <div className='bg-white rounded-2xl p-6 shadow-md border border-gray-100'>
            <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
              <div className='w-2 h-2 rounded-full bg-green-500' />
              Giờ làm việc
            </h3>
            <div className='space-y-3 text-gray-700'>
              {workingHours ? (
                <p style={{ color: ph, fontWeight: 600 }}>{workingHours}</p>
              ) : (
                <>
                  <div className='flex justify-between items-center'>
                    <span>Thứ 2 - Thứ 7</span>
                    <span className='font-semibold' style={{ color: ph }}>8:00 - 22:00</span>
                  </div>
                  <div className='h-px bg-gray-200' />
                  <div className='flex justify-between items-center'>
                    <span>Chủ nhật</span>
                    <span className='font-semibold' style={{ color: ph }}>9:00 - 20:00</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className='bg-white rounded-2xl p-6 shadow-md border border-gray-100'>
            <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
              <div className='w-2 h-2 rounded-full bg-blue-500' />
              Hỗ trợ kỹ thuật
            </h3>
            <div className='space-y-3 text-gray-700'>
              <p>{branding.support_contact || 'Hỗ trợ 24/7 qua Telegram & Zalo'}</p>
              <div className='h-px bg-gray-200' />
              <p className='font-semibold text-green-600'>Phản hồi trong vòng 5-10 phút</p>
            </div>
          </div>
        </div>

        {/* Thông tin bổ sung */}
        {(address || email || phone) && (
          <div className='bg-white rounded-2xl p-6 shadow-md border border-gray-100'>
            <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
              <div className='w-2 h-2 rounded-full' style={{ background: ph }} />
              Thông tin liên hệ
            </h3>
            <div className='space-y-2 text-gray-700'>
              {phone && <p>Điện thoại: <strong>{phone}</strong></p>}
              {email && <p>Email: <strong>{email}</strong></p>}
              {address && <p>Địa chỉ: <strong>{address}</strong></p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
