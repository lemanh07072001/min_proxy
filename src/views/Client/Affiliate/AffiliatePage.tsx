'use client'

import { useState } from 'react'

import { BarChart3, Link, Share2, Copy } from 'lucide-react'

import CustomIconButton from '@core/components/mui/IconButton'

import BoxCustom from '@/components/UI/BoxCustom'
import CustomTextField from '@/@core/components/mui/TextField'

export default function AffiliatePage() {
  const [referralCode, setReferralCode] = useState('MKT2024PROXY')
  const [copied, setCopied] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const copyReferralLink = () => {
    const referralLink = `https://mktproxy.com/register?ref=${referralCode}`

    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
                    value={referralCode}
                    fullWidth
                    onChange={e => setReferralCode(e.target.value)}
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
        <BoxCustom>sda</BoxCustom>
      </div>
    </div>
  )
}
