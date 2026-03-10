import { useQuery } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export const useAffiliate = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['affiliate'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-affiliate')

      return res?.data ?? null
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false
  })
}
