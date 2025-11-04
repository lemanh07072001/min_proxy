import { useQuery } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosAuth from '@/hocs/useAxiosAuth'

export const useOrders = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['orderProxyStatic'],
    queryFn: async () => {
      const res = await axiosAuth.get('/transaction-history')
      return res?.data?.data ?? []
    },
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 0
  })
}

export const useCancelOrder = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderId: number) => {
      const res = await axiosAuth.post(`/orders/${orderId}/cancel`)
      return res?.data
    },
    onSuccess: () => {
      // Refresh lại danh sách orders sau khi hủy thành công
      queryClient.invalidateQueries({ queryKey: ['orderProxyStatic'] })
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
      queryClient.invalidateQueries({ queryKey: ['orderProxyStatic'] })
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
      queryClient.invalidateQueries({ queryKey: ['orderProxyStatic'] })
    }
  })
}
