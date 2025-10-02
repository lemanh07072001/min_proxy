'use client'

import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

// Định nghĩa các role có thể có trong hệ thống
export type UserRole = 'admin' | 'user' | 'manager'

// Định nghĩa các quyền
export type Permission = 
  | 'admin.dashboard'
  | 'admin.users'
  | 'admin.partner'
  | 'user.proxy'
  | 'user.orders'
  | 'user.profile'

// Mapping role với các quyền
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'admin.dashboard',
    'admin.users',
    'admin.partner',
    'user.proxy',
    'user.orders',
    'user.profile'
  ],
  manager: [
    // Manager sẽ có quyền hạn chế hơn admin, chỉ có một số quyền cơ bản
    // Có thể cấu hình sau khi bạn quyết định manager cần quyền gì
    'user.proxy',
    'user.orders',
    'user.profile'
  ],
  user: [
    'user.proxy',
    'user.orders',
    'user.profile'
  ]
}

export function useRole() {
  const { data: session, status } = useSession()

  const userRole = useMemo(() => {
    if (!(session as any)?.role) return 'user' as UserRole
    return (session as any).role.toLowerCase() as UserRole
  }, [(session as any)?.role])

  const isAdmin = useMemo(() => {
    return userRole === 'admin'
  }, [userRole])

  const isManager = useMemo(() => {
    return userRole === 'manager'
  }, [userRole])


  const hasPermission = useMemo(() => {
    return (permission: Permission): boolean => {
      const userPermissions = ROLE_PERMISSIONS[userRole] || []
      return userPermissions.includes(permission)
    }
  }, [userRole])

  const hasAnyPermission = useMemo(() => {
    return (permissions: Permission[]): boolean => {
      const userPermissions = ROLE_PERMISSIONS[userRole] || []
      return permissions.some(permission => userPermissions.includes(permission))
    }
  }, [userRole])

  const hasAllPermissions = useMemo(() => {
    return (permissions: Permission[]): boolean => {
      const userPermissions = ROLE_PERMISSIONS[userRole] || []
      return permissions.every(permission => userPermissions.includes(permission))
    }
  }, [userRole])

  return {
    userRole,
    isAdmin,
    isManager,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated'
  }
}

// Hook đơn giản hơn để kiểm tra role cụ thể
export function useIsAdmin() {
  const { isAdmin, isLoading } = useRole()
  return { isAdmin, isLoading }
}

export function useIsManager() {
  const { isManager, isLoading } = useRole()
  return { isManager, isLoading }
}

// Hook để kiểm tra quyền cụ thể
export function useHasPermission(permission: Permission) {
  const { hasPermission, isLoading } = useRole()
  return { 
    hasPermission: hasPermission(permission), 
    isLoading 
  }
}
