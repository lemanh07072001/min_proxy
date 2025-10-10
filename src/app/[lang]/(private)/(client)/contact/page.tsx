import Image from 'next/image'

import { Facebook, MessageCircle, Send, Mail, Phone, MapPin } from 'lucide-react'

export default function Contact() {
  const contactMethods = [
    {
      name: 'Facebook',
      imageSrc: '/images/infos/fb.png',
      value: process.env.NEXT_PUBLIC_APP_NAME,
      link: 'https://www.facebook.com/profile.php?id=61580520613559&rdid=i9CpOabA3H93IvUC&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1G4yA8H9N3%2F#',
      iconColor: 'text-white'
    },
    {
      name: 'Zalo',
      imageSrc: '/images/infos/zalo.png',
      value: '0563072397',
      link: 'https://zalo.me/0563072397',
      iconColor: 'text-white'
    },
    {
      name: 'Telegram',
      imageSrc: '/images/infos/tele.png',
      value: '@mktproxy',
      link: 'https://t.me/mktproxy',
      iconColor: 'text-white'
    }
  ]

  return (
    <div className='min-h-screen '>
      <div className='max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12'>
          {contactMethods.map(method => {
            return (
              <a
                key={method.name}
                href={method.link}
                target='_blank'
                rel='noopener noreferrer'
                className='group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1'
              >
                <div
                  className={`rounded-xl flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-300`}
                >
                  <Image src={method.imageSrc} alt={method.name} width={80} height={80} className='object-contain' />
                </div>
                <h3 className='text-base md:text-lg font-bold text-gray-800 mb-2 text-center'>{method.name}</h3>
                <p className='text-xs md:text-sm text-gray-600 text-center break-words'>{method.value}</p>
              </a>
            )
          })}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-12'>
          <div className='bg-white rounded-2xl p-6 shadow-md border border-gray-100'>
            <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
              <div className='w-2 h-2 rounded-full bg-green-500'></div>
              Giờ làm việc
            </h3>
            <div className='space-y-3 text-gray-700'>
              <div className='flex justify-between items-center'>
                <span>Thứ 2 - Thứ 7</span>
                <span className='font-semibold text-orange-600'>8:00 - 22:00</span>
              </div>
              <div className='h-px bg-gray-200'></div>
              <div className='flex justify-between items-center'>
                <span>Chủ nhật</span>
                <span className='font-semibold text-orange-600'>9:00 - 20:00</span>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl p-6 shadow-md border border-gray-100'>
            <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
              <div className='w-2 h-2 rounded-full bg-blue-500'></div>
              Hỗ trợ kỹ thuật
            </h3>
            <div className='space-y-3 text-gray-700'>
              <p>Hỗ trợ 24/7 qua Telegram & Zalo</p>
              <div className='h-px bg-gray-200'></div>
              <p className='font-semibold text-green-600'>⚡ Phản hồi trong vòng 5-10 phút</p>
            </div>
          </div>
        </div>

        {/* <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
          <div className='bg-gradient-to-r from-orange-500 to-red-500 px-6 py-8 text-center'>
            <h2 className='text-2xl md:text-3xl font-bold text-white'>Gửi tin nhắn</h2>
            <p className='text-white/90 mt-2'>Chúng tôi sẽ phản hồi trong thời gian sớm nhất</p>
          </div>

          <form className='p-6 md:p-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Họ và tên</label>
                <input
                  type='text'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none'
                  placeholder='Nhập họ và tên'
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Số điện thoại</label>
                <input
                  type='tel'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none'
                  placeholder='Nhập số điện thoại'
                />
              </div>
            </div>
            <div className='mb-4'>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Email</label>
              <input
                type='email'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none'
                placeholder='Nhập email'
              />
            </div>
            <div className='mb-6'>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Nội dung</label>
              <textarea
                rows={4}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none resize-none'
                placeholder='Nhập nội dung tin nhắn...'
              />
            </div>
            <button
              type='submit'
              className='w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg'
            >
              Gửi tin nhắn
            </button>
          </form>
        </div> */}
      </div>
    </div>
  )
}
