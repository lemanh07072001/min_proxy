import { useQuery , useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export const useOrders = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['orderProxyStatic'],
    queryFn: async () => {
      const res = await axiosAuth.get('/transaction-history')

      
return res?.data?.data ?? []
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false
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
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000
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
      queryClient.invalidateQueries({ queryKey: ['orderProxyStatic'] })
      queryClient.invalidateQueries({ queryKey: ['userOrders'] })
      queryClient.invalidateQueries({ queryKey: ['adminTransactionHistory'] })
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
      queryClient.invalidateQueries({ queryKey: ['orderProxyStatic'] })
      queryClient.invalidateQueries({ queryKey: ['userOrders'] })
      queryClient.invalidateQueries({ queryKey: ['adminTransactionHistory'] })
    }
  })
}

// Hook admin thêm proxy thủ công vào đơn thiếu
export const useFillProxies = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ orderId, lines }: { orderId: number; lines: string[] }) => {
      const res = await axiosAuth.post(`/admin/fill-proxies/${orderId}`, { lines })

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] })
      queryClient.invalidateQueries({ queryKey: ['partialOrders'] })
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
      queryClient.invalidateQueries({ queryKey: ['orderProxyStatic'] })
      queryClient.invalidateQueries({ queryKey: ['userOrders'] })
    }
  })
}
