import { useQuery } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface OrderItemLog {
  item_key: string
  order_id: number | null
  user_id: number | null
  provider_code: string | null
  action: string
  message: string | null
  status_code: number | null
  request: any
  response: string | null
  duration_ms: number | null
  context: any
  created_at: string
}

export const useOrderItemLogs = (itemKey: string | null) => {
  const axiosAuth = useAxiosAuth()

  return useQuery<OrderItemLog[]>({
    queryKey: ['orderItemLogs', itemKey],
    queryFn: async () => {
      const res = await axiosAuth.get(`/admin/order-item-logs/${itemKey}`)

      return res?.data?.data ?? []
    },
    enabled: !!itemKey,
    staleTime: 10_000,
    refetchInterval: 15_000, // auto-refresh mỗi 15s vì log TTL 30 phút
  })
}
