import { useQuery } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface MyCredentials {
  api_key: string
  api_secret: string
  domain: string | null
  company_name: string | null
  status: number
  allowed_ips: string[] | null
  default_markup_percent: number
}

export const useMyCredentials = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['myCredentials'],
    queryFn: async () => {
      const res = await axiosAuth.get('/my-credentials')

      return res?.data?.data as MyCredentials
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
