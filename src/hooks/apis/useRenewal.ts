import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

interface RenewInfo {
  can_renew: boolean
  reason?: string
  renewal_duration_mode?: 'custom' | 'original'
  original_duration?: number
  item_count?: number
}

export const useRenewInfo = (orderId: number | null) => {
  const axiosAuth = useAxiosAuth()

  return useQuery<RenewInfo>({
    queryKey: ['renew-info', orderId],
    queryFn: async () => {
      const res = await axiosAuth.get(`/renew-info/${orderId}`)

      return res?.data?.data ?? { can_renew: false }
    },
    enabled: !!orderId,
    staleTime: 30_000,
  })
}

interface RenewPayload {
  order_id: number
  duration: number
  item_keys?: string[]
}

export const useRenewOrder = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: RenewPayload) => {
      const res = await axiosAuth.post('/renew', payload)

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userOrders'] })
      queryClient.invalidateQueries({ queryKey: ['orderApiKeys'] })
      queryClient.invalidateQueries({ queryKey: ['orderProxyStatic'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    }
  })
}
