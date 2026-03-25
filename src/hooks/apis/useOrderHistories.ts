import { useQuery } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface OrderHistoryItem {
  id: number
  type: 'buy' | 'renewal' | 'refund_renewal'
  amount: number
  duration: number
  status: number // 0=pending, 1=processing, 2=success, 3=failed, 4=in_use, 5=expired
  old_expired_at: string | null
  new_expired_at: string | null
  note: string | null
  created_at: string
  updated_at: string
  // admin only
  cost_amount?: number
  metadata?: any
}

export const useOrderHistories = (orderId: number | null, enabled = true) => {
  const axiosAuth = useAxiosAuth()

  return useQuery<OrderHistoryItem[]>({
    queryKey: ['orderHistories', orderId],
    queryFn: async () => {
      const res = await axiosAuth.get(`/order-histories/${orderId}`)

      return res?.data?.data ?? []
    },
    enabled: enabled && !!orderId,
    staleTime: 10_000,
  })
}
