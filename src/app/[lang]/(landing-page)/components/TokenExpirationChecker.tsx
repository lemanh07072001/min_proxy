'use client'

import { useTokenExpirationCheck } from '@/hooks/useTokenExpirationCheck'
import { useSessionCleanup } from '@/hooks/useSessionCleanup'

/**
 * Component để kiểm tra token expiration và cleanup session trên landing page
 * Tự động chuyển hướng về trang login khi token hết hạn
 */
const TokenExpirationChecker = () => {
  // Sử dụng hook để kiểm tra token expiration
  useTokenExpirationCheck()
  
  // Sử dụng hook để cleanup session cũ
  useSessionCleanup()

  // Component này không render gì, chỉ để chạy logic kiểm tra token
  return null
}

export default TokenExpirationChecker
