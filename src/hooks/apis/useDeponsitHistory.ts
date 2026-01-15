import { useQuery } from '@tanstack/react-query'

import useAxiosAuth from '@/hooks/useAxiosAuth'

export const useDepositHistory = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['depositHistory'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-deponsit-history')

      
return res?.data ?? []
    },
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 0
  })
}
