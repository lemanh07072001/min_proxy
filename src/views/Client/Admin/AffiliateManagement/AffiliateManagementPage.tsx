'use client'

import { useState } from 'react'

import { Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'

import BoxCustom from '@/components/UI/BoxCustom'
import AffiliateStatsCards from './AffiliateStatsCards'
import AffiliateWithdrawalTable from './AffiliateWithdrawalTable'
import AffiliateUsersTable from './AffiliateUsersTable'

interface AffiliateManagementPageProps {
  dictionary: any
}

export default function AffiliateManagementPage({ dictionary }: AffiliateManagementPageProps) {
  const [activeTab, setActiveTab] = useState<'withdrawals' | 'users'>('withdrawals')
  const t = dictionary.adminAffiliatePage || {}

  return (
    <div className='flex flex-col gap-6'>
      {/* Page Title */}
      <div>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          {t.title || 'Quản lý Affiliate'}
        </h1>
        <p className='text-gray-600'>
          {t.subtitle || 'Quản lý yêu cầu rút tiền và theo dõi hiệu suất affiliate'}
        </p>
      </div>

      {/* Stats Overview */}
      <AffiliateStatsCards dictionary={dictionary} />

      {/* Tabs */}
      <div className='border-b border-gray-200'>
        <nav className='-mb-px flex space-x-8'>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === 'withdrawals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {t.tabs?.withdrawals || 'Yêu cầu rút tiền'}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {t.tabs?.users || 'Danh sách Affiliates'}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <BoxCustom
        sx={{
          height: 'auto !important'
        }}
      >
        {activeTab === 'withdrawals' ? (
          <AffiliateWithdrawalTable dictionary={dictionary} />
        ) : (
          <AffiliateUsersTable dictionary={dictionary} />
        )}
      </BoxCustom>
    </div>
  )
}
