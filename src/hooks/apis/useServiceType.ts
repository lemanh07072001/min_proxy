import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

// Hook để lấy danh sách service types
export const useServiceTypes = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['service-types'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-service-types')

      return res?.data?.data ?? []
    },
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 0
  })
}

// Hook để lấy service type theo ID
export const useServiceType = (serviceId?: string | number, enabled: boolean = true) => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['service-type', serviceId],
    queryFn: async () => {
      const res = await axiosAuth.get(`/get-service-type/${serviceId}`)

      return res?.data?.data
    },
    enabled: !!serviceId && enabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000 // Cache 5 phút
  })
}

// Hook để tạo mới service type
export const useCreateServiceType = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosAuth.post('/add-service-type', data)

      return res?.data
    },
    onSuccess: () => {
      // Refresh lại danh sách service types sau khi tạo thành công
      queryClient.invalidateQueries({ queryKey: ['service-types'] })
      queryClient.invalidateQueries({ queryKey: ['orderProxyStatic'] })
    }
  })
}

// Hook để cập nhật service type
export const useUpdateServiceType = (serviceId?: string | number) => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosAuth.put(`/update-service-type/${serviceId}`, data)

      return res?.data
    },
    onSuccess: () => {
      // Refresh lại danh sách và chi tiết service type sau khi cập nhật
      queryClient.invalidateQueries({ queryKey: ['service-types'] })
      queryClient.invalidateQueries({ queryKey: ['service-type', serviceId] })
      queryClient.invalidateQueries({ queryKey: ['orderProxyStatic'] })
    }
  })
}

// Hook để xóa service type
export const useDeleteServiceType = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (serviceId: string | number) => {
      const res = await axiosAuth.delete(`/delete-service-type/${serviceId}`)

      return res?.data
    },
    onSuccess: () => {
      // Refresh lại danh sách service types sau khi xóa
      queryClient.invalidateQueries({ queryKey: ['service-types'] })
      queryClient.invalidateQueries({ queryKey: ['orderProxyStatic'] })
    }
  })
}
