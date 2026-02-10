'use client'

import { useState } from 'react'

import { Link, Copy } from 'lucide-react'

import { toast } from 'react-toastify'

import CustomIconButton from '@core/components/mui/IconButton'

import BoxCustom from '@/components/UI/BoxCustom'
import CustomTextField from '@/@core/components/mui/TextField'
import { useUserStore } from '@/stores'

interface AffiliatePageProps {
  dictionary: any
}

export default function AffiliatePage({ dictionary }: AffiliatePageProps) {
  const user = useUserStore((state) => state.user)
  const t = dictionary.affiliatePage

  const [copied, setCopied] = useState(false)

  const copyReferralLink = () => {
    const referralLink = `${process.env.NEXT_PUBLIC_APP_URL}?ref=${user?.id}`

    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success(t.referralLink.copied)
  }

  return (
    <BoxCustom
      sx={{
        height: 'auto !important'
      }}
    >
      <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
        <Link className='w-5 h-5 mr-2 text-orange-500' />
        {t.referralLink.title}
      </h2>

      <div className='space-y-4'>
        <div className='p-4 bg-gray-50 rounded-lg'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>{t.referralLink.yourCode}</label>
            <div className='flex space-x-3'>
              <CustomTextField
                value={`${process.env.NEXT_PUBLIC_APP_URL}?ref=${user?.id}`}
                fullWidth
                placeholder={t.referralLink.placeholder}
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

        {/* Thông tin chính sách hoa hồng */}
        <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
          <h3 className='text-base font-semibold text-blue-900 mb-3'>📋 {t.policy.title}</h3>
          <div className='space-y-2 text-sm text-gray-700'>
            <div className='flex items-start'>
              <span className='text-green-600 font-bold mr-2'>✓</span>
              <p>
                <span className='font-semibold'>{t.policy.rate}</span> {t.policy.rateDetail}
              </p>
            </div>
            <div className='flex items-start'>
              <span className='text-green-600 font-bold mr-2'>✓</span>
              <p>
                <span className='font-semibold'>{t.policy.condition}</span> {t.policy.conditionDetail}
              </p>
            </div>
            <div className='flex items-start'>
              <span className='text-green-600 font-bold mr-2'>✓</span>
              <p>
                <span className='font-semibold'>{t.policy.payment}</span> {t.policy.paymentDetail}
              </p>
            </div>
            <div className='flex items-start'>
              <span className='text-orange-600 font-bold mr-2'>⚠</span>
              <p>
                <span className='font-semibold'>{t.policy.withdrawal}</span> {t.policy.withdrawalDetail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </BoxCustom>
  )
}
