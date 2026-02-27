'use client'

import { useState } from 'react'

import { MousePointer, DollarSign, BanknoteArrowDown, Link, Package, ArrowLeft, Users, Clock } from 'lucide-react'

import AffiliatePage from '@/views/Client/Affiliate/AffiliatePage'
import BoxCustom from '@/components/UI/BoxCustom'
import WithdrawalTable from '@/views/Client/Affiliate/WithdrawalTable'
import UserWithdrawalTable from '@/views/Client/Affiliate/UserWithdrawalTable'
import OrderHistoryTable from '@/views/Client/Affiliate/OrderHistoryTable'

import '@/styles/affiliate-animations.css'

interface AffiliateContentProps {
  affiliateData: {
    total?: number
    pending_withdrawal?: number
    total_withdrawn?: number
    total_withdrawal_requests?: number
  }
  dictionary: any
}

export default function AffiliateContent({ affiliateData, dictionary }: AffiliateContentProps) {
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null)
  const [showOrderHistory, setShowOrderHistory] = useState(false)

  const handleViewDetails = (email: string) => {
    setSelectedUserEmail(email)
    setShowOrderHistory(true)
  }

  const handleBackToCommission = () => {
    setSelectedUserEmail(null)
    setShowOrderHistory(false)
  }

  const t = dictionary.affiliatePage

  return (
    <div className='flex flex-col gap-6'>
      {/* Stats Overview */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <BoxCustom>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-500 mb-1'>{t.stats.totalAffiliateEarnings}</p>
              <p className='text-2xl font-bold text-gray-900'>
                {new Intl.NumberFormat('vi-VN').format(affiliateData.total || 0) + ' đ'}
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
              <p className='text-sm text-gray-500 mb-1'>{t.stats.totalPendingWithdrawal}</p>
              <p className='text-2xl font-bold text-gray-900'>
                {new Intl.NumberFormat('vi-VN').format(affiliateData.pending_withdrawal || 0) + ' đ'}
              </p>
            </div>
            <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center'>
              <Clock className='w-6 h-6 text-orange-500' />
            </div>
          </div>
        </BoxCustom>

        <BoxCustom>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-500 mb-1'>{t.stats.totalWithdrawn}</p>
              <p className='text-2xl font-bold text-gray-900'>
                {new Intl.NumberFormat('vi-VN').format(affiliateData.total_withdrawn || 0) + ' đ'}
              </p>
            </div>
            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
              <BanknoteArrowDown className='w-6 h-6 text-blue-500' />
            </div>
          </div>
        </BoxCustom>

        <BoxCustom>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-500 mb-1'>{t.stats.totalWithdrawalRequests}</p>
              <p className='text-2xl font-bold text-gray-900'>{affiliateData.total_withdrawal_requests || 0}</p>
            </div>
            <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
              <Package className='w-6 h-6 text-purple-500' />
            </div>
          </div>
        </BoxCustom>
      </div>

      {/* Link Giới Thiệu + Lịch sử rút tiền - Same Row */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Link Giới Thiệu */}
        <AffiliatePage dictionary={dictionary} />

        {/* Lịch sử rút tiền */}
        <BoxCustom
          sx={{
            height: 'auto !important'
          }}
        >
          <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
            <BanknoteArrowDown className='w-5 h-5 mr-2 text-orange-500' />
            {t.withdrawalHistory.title}
          </h2>

          <div className='space-y-4'>
            <WithdrawalTable dictionary={dictionary} />
          </div>
        </BoxCustom>
      </div>

      {/* Lịch sử hoa hồng hoặc Lịch sử đơn hàng - Conditional Rendering với Animation */}
      <div className='relative'>
        {showOrderHistory ? (
          <div className='animate-fade-in'>
            <BoxCustom
              sx={{
                height: 'auto !important'
              }}
            >
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold text-gray-900 flex items-center animate-slide-in'>
                  <Package className='w-5 h-5 mr-2 text-purple-500' />
                  {t.orderHistory.title} {selectedUserEmail && `- ${selectedUserEmail}`}
                </h2>
                <button
                  onClick={handleBackToCommission}
                  className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-all duration-200 hover:scale-105 active:scale-95'
                >
                  <ArrowLeft size={16} />
                  {t.orderHistory.backButton}
                </button>
              </div>

              <div className='space-y-4'>
                <OrderHistoryTable filterEmail={selectedUserEmail} dictionary={dictionary} />
              </div>
            </BoxCustom>
          </div>
        ) : (
          <div className='animate-fade-in'>
            <BoxCustom
              sx={{
                height: 'auto !important'
              }}
            >
              <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center animate-slide-in'>
                <Link className='w-5 h-5 mr-2 text-orange-500' />
                {t.commissionHistory.title}
              </h2>

              <div className='space-y-4'>
                <UserWithdrawalTable onViewDetails={handleViewDetails} dictionary={dictionary} />
              </div>
            </BoxCustom>
          </div>
        )}
      </div>
    </div>
  )
}
