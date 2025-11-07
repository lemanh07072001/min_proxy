import { useQuery } from '@tanstack/react-query'
import useAxiosAuth from '@/hocs/useAxiosAuth'
import axios from 'axios'

export const usePartners = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const res = await axios.get('/api/partners')
      return res?.data ?? []
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000 // Cache 5 phút
  })
}
