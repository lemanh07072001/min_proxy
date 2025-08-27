import React from 'react'

import { Target, Eye, Heart, Zap, Shield, Users, Globe, Award } from 'lucide-react'

const MissionVision = () => {
  return (
    <section id='about' className='py-20 bg-gray-50'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl sm:text-4xl font-bold mb-4'>
            <span className='bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent'>Sứ mệnh</span>
            <span className='text-gray-900'> & Tầm nhìn</span>
          </h2>
          <p className='text-gray-600 text-lg max-w-3xl mx-auto'>
            Chúng tôi cam kết mang đến dịch vụ proxy chất lượng cao nhất, xây dựng niềm tin và sự hài lòng của khách
            hàng.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto'>
          {/* Sứ mệnh */}
          <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'>
            <div className='flex items-center mb-6'>
              <div className='w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4'>
                <Target className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900'>Sứ mệnh</h3>
            </div>
            <p className='text-gray-600 leading-relaxed text-lg'>
              Cung cấp dịch vụ proxy chất lượng cao, ổn định và đáng tin cậy nhất tại Việt Nam. Chúng tôi cam kết mang
              đến những giải pháp proxy tối ưu, giúp khách hàng đạt được mục tiêu kinh doanh và công việc một cách hiệu
              quả nhất.
            </p>
          </div>

          {/* Tầm nhìn */}
          <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'>
            <div className='flex items-center mb-6'>
              <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4'>
                <Eye className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900'>Tầm nhìn</h3>
            </div>
            <p className='text-gray-600 leading-relaxed text-lg'>
              Trở thành nhà cung cấp dịch vụ proxy hàng đầu Việt Nam, được khách hàng tin tưởng và lựa chọn. Xây dựng hệ
              sinh thái proxy toàn diện, phủ sóng toàn quốc với công nghệ tiên tiến và dịch vụ chăm sóc khách hàng xuất
              sắc.
            </p>
          </div>

          {/* Giá trị cốt lõi */}
          <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'>
            <div className='flex items-center mb-6'>
              <div className='w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4'>
                <Heart className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900'>Giá trị cốt lõi</h3>
            </div>
            <ul className='space-y-3 text-gray-600'>
              <li className='flex items-center'>
                <div className='w-2 h-2 bg-red-500 rounded-full mr-3'></div>
                Chất lượng dịch vụ là ưu tiên hàng đầu
              </li>
              <li className='flex items-center'>
                <div className='w-2 h-2 bg-red-500 rounded-full mr-3'></div>
                Minh bạch trong mọi giao dịch và chính sách
              </li>
              <li className='flex items-center'>
                <div className='w-2 h-2 bg-red-500 rounded-full mr-3'></div>
                Hỗ trợ khách hàng tận tâm 24/7
              </li>
              <li className='flex items-center'>
                <div className='w-2 h-2 bg-red-500 rounded-full mr-3'></div>
                Không ngừng đổi mới và cải tiến
              </li>
            </ul>
          </div>

          {/* Cam kết của chúng tôi */}
          <div className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'>
            <div className='flex items-center mb-6'>
              <div className='w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mr-4'>
                <Award className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900'>Cam kết của chúng tôi</h3>
            </div>
            <ul className='space-y-3 text-gray-600'>
              <li className='flex items-center'>
                <div className='w-2 h-2 bg-red-500 rounded-full mr-3'></div>
                Uptime 99.9% cho tất cả dịch vụ
              </li>
              <li className='flex items-center'>
                <div className='w-2 h-2 bg-red-500 rounded-full mr-3'></div>
                Hỗ trợ kỹ thuật chuyên nghiệp 24/7
              </li>
              <li className='flex items-center'>
                <div className='w-2 h-2 bg-red-500 rounded-full mr-3'></div>
                Giá cả cạnh tranh và chính sách ưu đãi
              </li>
              <li className='flex items-center'>
                <div className='w-2 h-2 bg-red-500 rounded-full mr-3'></div>
                Bảo mật thông tin khách hàng tuyệt đối
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MissionVision
