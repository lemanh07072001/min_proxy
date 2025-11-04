import { useQuery } from '@tanstack/react-query'
import useAxiosAuth from '@/hocs/useAxiosAuth'

export const useHistoryOrders = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['orderProxyStatic'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-order')
      return res.data.data
    },
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 0
  })
}
