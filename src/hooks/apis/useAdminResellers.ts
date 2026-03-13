import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface ResellerProfile {
  id: number
  user_id: number
  api_key: string
  api_secret: string
  domain: string | null
  company_name: string | null
  default_markup_percent: number
  allowed_ips: string[] | null
  status: number // 1=active, 0=suspended
  note: string | null
  created_at: string
  updated_at: string
}

export interface AdminReseller {
  id: number
  name: string
  email: string
  sodu: number
  sotiennap: number
  is_banned: boolean
  created_at: string
  orders_count: number
  reseller_profile: ResellerProfile | null
}

export interface ResellerStats {
  total: number
  active: number
  suspended: number
  total_balance: number
}

export interface AdminResellersParams {
  page?: number
  per_page?: number
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// Hook: list resellers
export const useAdminResellers = (params: AdminResellersParams = {}) => {
  const axiosAuth = useAxiosAuth()
  const { page = 1, per_page = 50, search, sort_by, sort_order } = params

  return useQuery({
    queryKey: ['adminResellers', page, per_page, search, sort_by, sort_order],
    queryFn: async () => {
      const res = await axiosAuth.get('/admin/resellers', {
        params: { page, per_page, search, sort_by, sort_order }
      })

      return res?.data
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false
  })
}

// Hook: reseller stats
export const useAdminResellerStats = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['adminResellerStats'],
    queryFn: async () => {
      const res = await axiosAuth.get('/admin/resellers/stats')

      return res?.data?.data as ResellerStats
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false
  })
}

// Hook: create reseller
export const useCreateReseller = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosAuth.post('/admin/resellers', data)

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminResellers'] })
      queryClient.invalidateQueries({ queryKey: ['adminResellerStats'] })
    }
  })
}

// Hook: update reseller profile
export const useUpdateReseller = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: number; data: any }) => {
      const res = await axiosAuth.post(`/admin/resellers/${userId}/update`, data)

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminResellers'] })
    }
  })
}

// Hook: toggle status (suspend/activate)
export const useToggleResellerStatus = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, status }: { userId: number; status: number }) => {
      const res = await axiosAuth.post(`/admin/resellers/${userId}/toggle-status`, { status })

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminResellers'] })
      queryClient.invalidateQueries({ queryKey: ['adminResellerStats'] })
    }
  })
}

// Hook: regenerate credentials
export const useRegenerateCredentials = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: number) => {
      const res = await axiosAuth.post(`/admin/resellers/${userId}/regenerate-credentials`)

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminResellers'] })
    }
  })
}

// Hook: adjust reseller balance
export const useAdjustResellerBalance = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      amount,
      description
    }: {
      userId: number
      amount: number
      description: string
    }) => {
      const res = await axiosAuth.post(`/admin/resellers/${userId}/adjust-balance`, { amount, description })

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminResellers'] })
      queryClient.invalidateQueries({ queryKey: ['adminResellerStats'] })
    }
  })
}
