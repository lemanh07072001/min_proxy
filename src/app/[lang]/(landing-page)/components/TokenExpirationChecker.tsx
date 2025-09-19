'use client'

import { useTokenExpirationCheck } from '@/hooks/useTokenExpirationCheck'

/**
 * Component để kiểm tra token expiration trên landing page
 * Tự động chuyển hướng về trang login khi token hết hạn
 */
const TokenExpirationChecker = () => {
  // Sử dụng hook để kiểm tra token expiration
  useTokenExpirationCheck()

  // Component này không render gì, chỉ để chạy logic kiểm tra token
  return null
}

export default TokenExpirationChecker
