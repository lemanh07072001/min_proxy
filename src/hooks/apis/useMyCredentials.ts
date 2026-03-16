import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface MyCredentials {
  api_key: string | null
}

export const useMyCredentials = (enabled: boolean = true) => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['myCredentials'],
    queryFn: async () => {
      const res = await axiosAuth.get('/my-credentials')

      return res?.data?.data as MyCredentials
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useRegenerateMyCredentials = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await axiosAuth.post('/my-credentials/regenerate')

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCredentials'] })
    }
  })
}
