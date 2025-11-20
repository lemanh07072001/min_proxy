import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const res = await axios.get('/api/countries')
      return res?.data?.data ?? []
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000 // Cache 10 phút
  })
}
