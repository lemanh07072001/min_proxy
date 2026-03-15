'use client'

import { useState } from 'react'

import { Link, Copy } from 'lucide-react'

import { useSelector } from 'react-redux'

import { toast } from 'react-toastify'

import CustomIconButton from '@core/components/mui/IconButton'

import BoxCustom from '@/components/UI/BoxCustom'
import CustomTextField from '@/@core/components/mui/TextField'
import type { RootState } from '@/store'

import UserWithdrawalTable from '@views/Client/Affiliate/UserWithdrawalTable'

export default function AffiliatePage() {
  const user = useSelector((state: RootState) => state.user.user)

  const [copied, setCopied] = useState(false)

  // Dùng window.location.origin — luôn đúng domain hiện tại, không phụ thuộc env
  const referralLink = typeof window !== 'undefined'
    ? `${window.location.origin}?ref=${user?.id}`
    : `?ref=${user?.id}`

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied!')
  }

  return (
    <div className='flex flex-col gap-4'>
      <BoxCustom
        sx={{
          height: 'auto !important'
        }}
      >
        <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
          <Link className='w-5 h-5 mr-2' style={{ color: 'var(--primary-hover, #f97316)' }} />
          Link Giới Thiệu
        </h2>

        <div className='space-y-4'>
          <div className='p-4 bg-gray-50 rounded-lg'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Mã giới thiệu của bạn</label>
              <div className='flex space-x-3'>
                <CustomTextField
                  value={referralLink}
                  fullWidth
                  placeholder='Link giới thiệu'
                  slotProps={{ input: { readOnly: true } }}
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

      <BoxCustom
        sx={{
          height: 'auto !important' // ✅ dùng !important nếu thật sự cần
        }}
      >
        <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
          <Link className='w-5 h-5 mr-2' style={{ color: 'var(--primary-hover, #f97316)' }} />
          Lịch sử hoa hồng
        </h2>

        <div className='space-y-4'>
          <UserWithdrawalTable />
        </div>
      </BoxCustom>
    </div>
  )
}
