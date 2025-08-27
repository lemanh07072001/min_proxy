'use client'

import React, { useState } from 'react'

import '@/app/[lang]/(private)/(landing-page)/hotline/style.css'

import { Phone, Mail, MapPin, Globe, Send, CheckCircle, Menu, X } from 'lucide-react'

const ContactInfo = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16'>
      {/* Hero Section */}
      <div className='text-center mb-12 lg:mb-16'>
        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4'>Liên hệ với chúng tôi</h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn</p>
      </div>

      {/* Contact Content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        {/* Contact Information */}
        <div className='lg:col-span-1 space-y-6'>
          {/* Hotline */}
          <div className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300'>
            <div className='flex items-start space-x-4'>
              <div className='bg-green-500 p-3 rounded-xl flex-shrink-0'>
                <Phone className='w-6 h-6 text-white' />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='text-lg font-semibold text-gray-900 mb-1'>Hotline</h3>
                <a
                  href='tel:0399169675'
                  className='text-xl font-bold text-red-500 hover:text-red-600 transition-colors block'
                >
                  0399169675
                </a>
                <p className='text-sm text-gray-500 mt-1'>Gọi ngay để được tư vấn miễn phí</p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300'>
            <div className='flex items-start space-x-4'>
              <div className='bg-blue-500 p-3 rounded-xl flex-shrink-0'>
                <Mail className='w-6 h-6 text-white' />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='text-lg font-semibold text-gray-900 mb-1'>Email</h3>
                <a
                  href='mailto:admin@homeproxy.vn'
                  className='text-lg font-medium text-red-500 hover:text-red-600 transition-colors break-all'
                >
                  admin@homeproxy.vn
                </a>
                <p className='text-sm text-gray-500 mt-1'>Gửi email để được hỗ trợ chi tiết</p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300'>
            <div className='flex items-start space-x-4'>
              <div className='bg-orange-500 p-3 rounded-xl flex-shrink-0'>
                <MapPin className='w-6 h-6 text-white' />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='text-lg font-semibold text-gray-900 mb-1'>Địa chỉ</h3>
                <p className='text-gray-700 font-medium leading-relaxed'>
                  81/2 Đường số 2, P.Trường Thọ,
                  <br />
                  TP.Thủ Đức, TP.HCM
                </p>
                <p className='text-sm text-gray-500 mt-1'>Ghé thăm văn phòng của chúng tôi</p>
              </div>
            </div>
          </div>

          {/* Website */}
          <div className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300'>
            <div className='flex items-start space-x-4'>
              <div className='bg-purple-500 p-3 rounded-xl flex-shrink-0'>
                <Globe className='w-6 h-6 text-white' />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='text-lg font-semibold text-gray-900 mb-1'>Website</h3>
                <a
                  href='https://homeproxy.vn'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-lg font-medium text-red-500 hover:text-red-600 transition-colors'
                >
                  https://homeproxy.vn
                </a>
                <p className='text-sm text-gray-500 mt-1'>Truy cập website chính thức</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className='lg:col-span-2'>
          <div className='bg-white rounded-2xl p-6 lg:p-8 shadow-sm'>
            <div className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>Gửi tin nhắn</h2>
              <p className='text-gray-600'>Điền thông tin và chúng tôi sẽ liên hệ với bạn sớm nhất có thể</p>
            </div>

            {isSubmitted ? (
              <div className='text-center py-12'>
                <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
                <h3 className='text-xl font-semibold text-green-600 mb-2'>Cảm ơn bạn đã liên hệ!</h3>
                <p className='text-gray-600'>Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
              </div>
            ) : (
              <form className='space-y-6'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  <div>
                    <input
                      type='text'
                      name='name'
                      required
                      className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors outline-none bg-gray-50 focus:bg-white'
                      placeholder='Họ và tên'
                    />
                  </div>

                  <div>
                    <input
                      type='email'
                      name='email'
                      required
                      className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors outline-none bg-gray-50 focus:bg-white'
                      placeholder='Email'
                    />
                  </div>
                </div>

                <div>
                  <input
                    type='tel'
                    name='phone'
                    required
                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors outline-none bg-gray-50 focus:bg-white'
                    placeholder='Số điện thoại'
                  />
                </div>

                <div>
                  <textarea
                    name='message'
                    required
                    rows={5}
                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors outline-none resize-vertical bg-gray-50 focus:bg-white'
                    placeholder='Nội dung tin nhắn'
                  />
                </div>

                <div className='flex justify-start'>
                  <button
                    type='submit'
                    className='bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  >
                    <span>Submit</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      <div className='mt-16 bg-white rounded-2xl p-8 shadow-sm'>
        <div className='text-center mb-8'>
          <h3 className='text-2xl font-bold text-gray-900 mb-4'>Tại sao chọn HomeProxy?</h3>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Chúng tôi cam kết mang đến dịch vụ tốt nhất với đội ngũ chuyên nghiệp và kinh nghiệm
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='text-center'>
            <div className='bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Phone className='w-8 h-8 text-blue-600' />
            </div>
            <h4 className='font-semibold text-gray-900 mb-2'>Hỗ trợ 24/7</h4>
            <p className='text-gray-600'>Luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi</p>
          </div>

          <div className='text-center'>
            <div className='bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
              <CheckCircle className='w-8 h-8 text-green-600' />
            </div>
            <h4 className='font-semibold text-gray-900 mb-2'>Chuyên nghiệp</h4>
            <p className='text-gray-600'>Đội ngũ chuyên gia giàu kinh nghiệm</p>
          </div>

          <div className='text-center'>
            <div className='bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Globe className='w-8 h-8 text-purple-600' />
            </div>
            <h4 className='font-semibold text-gray-900 mb-2'>Uy tín</h4>
            <p className='text-gray-600'>Được khách hàng tin tựởng và đánh giá cao</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ContactInfo
