import { useQuery } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'
import { useTabVisible } from '@/hooks/useTabVisible'

// Status đang chờ xử lý — cần polling
const PENDING_STATUSES = [0, 1, 9, 10]

export const useHistoryOrders = () => {
  const axiosAuth = useAxiosAuth()
  const isTabVisible = useTabVisible()

  return useQuery({
    queryKey: ['userOrders'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-order')

      return res.data.data
    },
    staleTime: 5 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: (query) => {
      if (!isTabVisible) return false

      const orders = query.state.data

      if (!Array.isArray(orders)) return false

      const hasPending = orders.some((o: any) => PENDING_STATUSES.includes(Number(o.status)))

      return hasPending ? 5000 : false
    }
  })
}

export { PENDING_STATUSES }
