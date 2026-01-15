import { useQuery } from '@tanstack/react-query'

import useAxiosAuth from '@/hooks/useAxiosAuth'

export const useHistoryOrders = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['history-orders'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-order')

      
return res.data.data
    },
    staleTime: 5 * 60 * 1000 // 5 phút
  })
}
