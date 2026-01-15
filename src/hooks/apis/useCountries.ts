import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const res = await axios.get('/api/countries')

      
return res?.data?.data ?? []
    },
    staleTime: 30 * 60 * 1000 // Cache 30 phút - data tĩnh
  })
}
