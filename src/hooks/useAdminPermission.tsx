// src/hooks/useAdminPermission.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

/**
 * Hook để kiểm tra quyền admin của user hiện tại
 * @returns {object} - Object chứa thông tin về quyền admin
 */
export const useAdminPermission = () => {
  const { data: session, status } = useSession()

  const adminInfo = useMemo(() => {
    // Kiểm tra nếu session đang loading
    if (status === 'loading') {
      return {
        isAdmin: false,
        isLoading: true,
        userRole: null,
        hasPermission: false
      }
    }

    // Kiểm tra nếu không có session
    if (!session || !session.user) {
      return {
        isAdmin: false,
        isLoading: false,
        userRole: null,
        hasPermission: false
      }
    }

    // Lấy role từ session
    const userRole = (session as any).role || (session.user as any)?.role

    // Kiểm tra nếu user có quyền admin
    // Có thể mở rộng để kiểm tra nhiều role admin khác nhau
    const isAdmin = userRole === 'admin' || userRole === 'super_admin' || userRole === 'administrator'

    return {
      isAdmin,
      isLoading: false,
      userRole,
      hasPermission: isAdmin,
      // Thêm thông tin user để sử dụng
      user: session.user,
      session
    }
  }, [session, status])

  return adminInfo
}

/**
 * Hook để kiểm tra quyền cụ thể của admin
 * @param requiredPermission - Quyền cần kiểm tra
 * @returns {boolean} - Có quyền hay không
 */
export const useAdminRole = (requiredPermission?: string) => {
  const { isAdmin, userRole, isLoading } = useAdminPermission()

  // Nếu đang loading, trả về false
  if (isLoading) return false

  // Nếu không phải admin, trả về false
  if (!isAdmin) return false

  // Nếu không có yêu cầu quyền cụ thể, chỉ cần là admin
  if (!requiredPermission) return true

  // Kiểm tra quyền cụ thể (có thể mở rộng logic này)
  switch (requiredPermission) {
    case 'user_management':
      return userRole === 'admin' || userRole === 'super_admin'
    case 'system_management':
      return userRole === 'super_admin'
    case 'proxy_management':
      return userRole === 'admin' || userRole === 'super_admin'
    case 'order_management':
      return userRole === 'admin' || userRole === 'super_admin'
    default:
      return isAdmin
  }
}

export default useAdminPermission
