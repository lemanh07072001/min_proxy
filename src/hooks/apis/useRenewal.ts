import { useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

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
