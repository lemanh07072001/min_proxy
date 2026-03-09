import { useQuery } from '@tanstack/react-query'
import useAxiosAuth from '@/hocs/useAxiosAuth'

export const useOverview = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['overview'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-overview')

      return res?.data ?? null
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true
  })
}
