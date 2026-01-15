import { useQuery } from '@tanstack/react-query'

import useAxiosAuth from '@/hooks/useAxiosAuth'

export const useUserOrders = (userId?: number) => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['getUserOrder', userId],
    queryFn: async () => {
      if (!userId) return [] // tránh lỗi undefined
      const res = await axiosAuth.get(`/get-user-order/${userId}`)

      
return res?.data ?? []
    },
    enabled: !!userId, // chỉ fetch khi có userId
    refetchOnWindowFocus: false,
    keepPreviousData: false,
    staleTime: 0,
  })
}
