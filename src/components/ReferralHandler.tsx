'use client'

import { useEffect } from 'react'

import { useSearchParams } from 'next/navigation'

const ReferralHandler = () => {
  const searchParams = useSearchParams()

  useEffect(() => {
    const referralCode = searchParams.get('ref')
    
    if (referralCode) {
      // Lưu referral code vào localStorage
      localStorage.setItem('referralCode', referralCode)
      
      // Có thể thêm logic khác như tracking, analytics, etc.
      console.log('Referral code detected:', referralCode)
    }
  }, [searchParams])

  return null // Component này không render gì
}

export default ReferralHandler
