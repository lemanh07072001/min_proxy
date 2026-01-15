import { useQuery , useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hooks/useAxiosAuth'

export const useOrders = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await axiosAuth.get('/transaction-history')

      
return res?.data?.data ?? []
    },
    staleTime: 5 * 60 * 1000 // 5 phút
  })
}

export const useApiKeys = (order_id?: string | number, enabled: boolean = true) => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['orderApiKeys', order_id],
    queryFn: async () => {
      const res = await axiosAuth.get(`/get-key-proxy/${order_id}`)

      
return res?.data?.data ?? []
    },
    enabled: !!order_id && enabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

export const useCancelOrder = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderId: number) => {
      const res = await axiosAuth.post(`/cancel-order/${orderId}`)

      
return res?.data
    },
    onSuccess: () => {
      // Refresh lại danh sách orders sau khi hủy thành công
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })
}

// Hook để gửi lại đơn hàng
export const useResendOrder = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderId: number) => {
      const res = await axiosAuth.post(`/resend-order/${orderId}`)

      
return res?.data
    },
    onSuccess: () => {
      // Refresh lại danh sách orders sau khi gửi lại thành công
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })
}

// Hook để xóa đơn hàng
export const useDeleteOrder = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderId: number) => {
      const res = await axiosAuth.delete(`/orders/${orderId}`)

      
return res?.data
    },
    onSuccess: () => {
      // Refresh lại danh sách orders sau khi xóa thành công
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })
}
