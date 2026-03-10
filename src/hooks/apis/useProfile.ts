import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export const useProfile = () => {
  const { data: session } = useSession() as any
  const axiosAuth = useAxiosAuth()
  const userId = session?.user?.id

  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const res = await axiosAuth.get(`/profile/${userId}`)

      return res?.data ?? null
    },
    enabled: !!userId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false
  })
}
