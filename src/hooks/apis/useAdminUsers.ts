import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface AdminUsersParams {
  page?: number
  per_page?: number
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface UserStats {
  total_users: number
  new_users_this_month: number
  total_balance: number
  total_deposited: number
}

export interface AdminUser {
  id: number
  name: string
  email: string
  phone: string | null
  address: string | null
  sodu: number
  sotiennap: number
  affiliate_code: string | null
  affiliate_balance: number
  avatar: string | null
  is_banned: boolean
  created_at: string
  orders_count: number
}

// Hook: list users (paginated)
export const useAdminUsers = (params: AdminUsersParams = {}) => {
  const axiosAuth = useAxiosAuth()
  const { page = 1, per_page = 100, search, sort_by, sort_order } = params

  return useQuery({
    queryKey: ['adminUsers', page, per_page, search, sort_by, sort_order],
    queryFn: async () => {
      const res = await axiosAuth.get('/admin/users', {
        params: { page, per_page, search, sort_by, sort_order }
      })
      return res?.data
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false
  })
}

// Hook: user stats (riêng, gọi 1 lần)
export const useAdminUserStats = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['adminUserStats'],
    queryFn: async () => {
      const res = await axiosAuth.get('/admin/users/stats')
      return res?.data?.data as UserStats
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false
  })
}

// Hook: update user
export const useUpdateUser = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: number; data: any }) => {
      const res = await axiosAuth.post(`/admin/users/${userId}/update`, data)
      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    }
  })
}

// Hook: adjust balance
export const useAdjustBalance = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, amount, description }: { userId: number; amount: number; description: string }) => {
      const res = await axiosAuth.post(`/admin/users/${userId}/adjust-balance`, { amount, description })
      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    }
  })
}

// Hook: toggle ban
export const useToggleBan = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, is_banned }: { userId: number; is_banned: boolean }) => {
      const res = await axiosAuth.post(`/admin/users/${userId}/ban`, { is_banned })
      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    }
  })
}

// Hook: reset password
export const useResetPassword = () => {
  const axiosAuth = useAxiosAuth()

  return useMutation({
    mutationFn: async ({ userId, new_password }: { userId: number; new_password?: string }) => {
      const res = await axiosAuth.post(`/admin/users/${userId}/reset-password`, { new_password })
      return res?.data
    }
  })
}

// Hook: user transaction history
export const useUserTransactions = (userId?: number, enabled = true) => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['userTransactions', userId],
    queryFn: async () => {
      if (!userId) return []
      const res = await axiosAuth.get(`/admin/users/${userId}/transactions`)
      return res?.data?.data ?? []
    },
    enabled: enabled && !!userId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false
  })
}
