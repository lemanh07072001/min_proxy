import { useQuery } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface BankInfo {
  bank_name: string
  bank_code: string
  account_number: string
  account_name: string
}

export const useBankInfo = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['bank-info'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-bank-info')

      if (!res?.data?.data) return null

      return res.data.data as BankInfo
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}
