import { useQuery } from '@tanstack/react-query'
import useAxiosAuth from '@/hocs/useAxiosAuth'

export const useHistoryOrders = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['userOrders'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-order')
      return res.data.data
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false
  })
}
