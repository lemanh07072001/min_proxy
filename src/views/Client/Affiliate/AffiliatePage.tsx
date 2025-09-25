'use client'

import { useState } from 'react'

import { BarChart3, Link, Share2, Copy, BanknoteArrowDown } from 'lucide-react'

import CustomIconButton from '@core/components/mui/IconButton'

import BoxCustom from '@/components/UI/BoxCustom'
import CustomTextField from '@/@core/components/mui/TextField'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { toast } from 'react-toastify'
import WithdrawalTable from '@views/Client/Affiliate/WithdrawalTable'

export default function AffiliatePage() {
  const user = useSelector((state: RootState) => state.user.user)


  const [copied, setCopied] = useState(false)



  const copyReferralLink = () => {
    const referralLink = `${process.env.NEXT_PUBLIC_APP_URL}?ref=${user?.id}`

    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied!')
  }

  return (
    <div className='grid lg:grid-cols-3 gap-8'>
      {/* Left Column */}
      <div className='lg:col-span-2'>
        {/* Referral Link Section */}
        <BoxCustom
          sx={{
            height: 'auto !important' // ✅ dùng !important nếu thật sự cần
          }}
        >
          <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
            <Link className='w-5 h-5 mr-2 text-orange-500' />
            Link Giới Thiệu
          </h2>

          <div className='space-y-4'>
            <div className='p-4 bg-gray-50 rounded-lg'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Mã giới thiệu của bạn</label>
                <div className='flex space-x-3'>
                  <CustomTextField
                    value={`${process.env.NEXT_PUBLIC_APP_URL}?ref=${user?.id}`}
                    fullWidth

                    placeholder='Nhập mã giới thiệu'
                  />

                  <CustomIconButton
                    color='success'
                    aria-label='capture screenshot'
                    variant='contained'
                    onClick={copyReferralLink}
                  >
                    <Copy size={16} className='w-4 h-4' />
                  </CustomIconButton>
                </div>
              </div>
            </div>
          </div>
        </BoxCustom>
      </div>

      <div className='lg:col-span-1'>
        <BoxCustom>
          <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
            <BanknoteArrowDown  className='w-5 h-5 mr-2 text-orange-500' />
            Lịch sử rút tiền
          </h2>

          <WithdrawalTable/>
        </BoxCustom>
      </div>
    </div>
  )
}
