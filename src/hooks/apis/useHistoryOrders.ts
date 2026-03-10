import { useQuery } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

// Status đang chờ xử lý — cần polling
const PENDING_STATUSES = [0, 1, 9, 10]

export const useHistoryOrders = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['userOrders'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-order')

      return res.data.data
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    refetchInterval: (query) => {
      const orders = query.state.data
      if (!Array.isArray(orders)) return false

      const hasPending = orders.some((o: any) => PENDING_STATUSES.includes(Number(o.status)))

      // Có đơn đang chờ → poll 5s, không → tắt polling
      return hasPending ? 5000 : false
    }
  })
}

export { PENDING_STATUSES }
