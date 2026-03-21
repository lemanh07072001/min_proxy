import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export const useUserProviderPricing = (userId?: number) => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['user-provider-pricing', userId],
    queryFn: async () => {
      const res = await axiosAuth.get('/admin/user-provider-pricing', {
        params: { user_id: userId }
      })

      return res?.data
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
    staleTime: 30_000
  })
}

export const useCreateUserProviderPricing = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosAuth.post('/admin/user-provider-pricing', data)

      return res?.data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-provider-pricing', variables.user_id] })
    }
  })
}

export const useUpdateUserProviderPricing = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const res = await axiosAuth.put(`/admin/user-provider-pricing/${id}`, data)

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-provider-pricing'] })
    }
  })
}

export const useDeleteUserProviderPricing = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosAuth.delete(`/admin/user-provider-pricing/${id}`)

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-provider-pricing'] })
    }
  })
}
