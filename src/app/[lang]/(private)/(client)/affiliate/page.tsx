import { MousePointer, DollarSign, BanknoteArrowDown } from 'lucide-react'

import { getServerSession } from 'next-auth/next'

import AffiliatePage from '@/views/Client/Affiliate/AffiliatePage'
import BoxCustom from '@/components/UI/BoxCustom'
import { authOptions } from '@/libs/auth'
import WithdrawalTable from '@/views/Client/Affiliate/WithdrawalTable'

export default async function Affiliate() {
  const session = await getServerSession(authOptions)
  let affiliateData = []

  try {
    const res = await fetch(`${process.env.API_URL}/get-affiliate`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.access_token}`, // Thêm backendToken vào header
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

  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-10 gap-6'>
        <div className='lg:col-span-7'>
          {/* Stats Overview */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8'>
            <BoxCustom>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>Thu nhập tháng này</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {new Intl.NumberFormat('vi-VN').format(affiliateData.total) + ' đ' ?? 0}
                  </p>
                </div>
                <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                  <DollarSign className='w-6 h-6 text-green-500' />
                </div>
              </div>
            </BoxCustom>

            <BoxCustom>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>Hoa Hồng Giới Thiệu</p>
                  <p className='text-2xl font-bold text-gray-900'>{affiliateData.affiliate_percent ?? 0} %</p>
                </div>
                <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <MousePointer className='w-6 h-6 text-blue-500' />
                </div>
              </div>
            </BoxCustom>

            {/*<BoxCustom>*/}
            {/*  <div className='flex items-center justify-between'>*/}
            {/*    <div>*/}
            {/*      <p className='text-sm text-gray-500 mb-1'>Chuyển đổi</p>*/}
            {/*      <p className='text-2xl font-bold text-gray-900'>312</p>*/}
            {/*    </div>*/}
            {/*    <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>*/}
            {/*      <UserPlus className='w-6 h-6 text-purple-500' />*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</BoxCustom>*/}

            {/*<BoxCustom>*/}
            {/*  <div className='flex items-center justify-between'>*/}
            {/*    <div>*/}
            {/*      <p className='text-sm text-gray-500 mb-1'>Khách hàng hoạt động</p>*/}
            {/*      <p className='text-2xl font-bold text-gray-900'>321</p>*/}
            {/*    </div>*/}
            {/*    <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center'>*/}
            {/*      <Users className='w-6 h-6 text-orange-500' />*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</BoxCustom>*/}
          </div>

          <AffiliatePage />
        </div>

        <div className='lg:col-span-3'>
          <BoxCustom>
            <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
              <BanknoteArrowDown className='w-5 h-5 mr-2 text-orange-500' />
              Lịch sử rút tiền
            </h2>

            <WithdrawalTable />
          </BoxCustom>
        </div>
      </div>
    </>
  )
}
