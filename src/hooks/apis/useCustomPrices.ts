import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export const useCustomPrices = (serviceTypeId?: number) => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['custom-prices', serviceTypeId],
    queryFn: async () => {
      const res = await axiosAuth.get('/admin/custom-prices', {
        params: { service_type_id: serviceTypeId }
      })

      return res?.data
    },
    enabled: !!serviceTypeId,
    refetchOnWindowFocus: false
  })
}

export const useCreateCustomPrice = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosAuth.post('/admin/custom-prices', data)

      return res?.data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['custom-prices', variables.service_type_id] })
    }
  })
}

export const useUpdateCustomPrice = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const res = await axiosAuth.put(`/admin/custom-prices/${id}`, data)

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-prices'] })
    }
  })
}

export const useDeleteCustomPrice = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosAuth.delete(`/admin/custom-prices/${id}`)

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-prices'] })
    }
  })
}

export const usePreviewCustomPrice = () => {
  const axiosAuth = useAxiosAuth()

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosAuth.post('/admin/custom-prices/preview', data)

      return res?.data
    }
  })
}
