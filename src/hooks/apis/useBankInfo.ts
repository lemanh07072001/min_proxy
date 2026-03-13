import { useQuery } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface BankInfo {
  bank_name: string
  bank_code: string
  account_number: string
  account_name: string
}

// Fallback cứng — dùng khi API chưa có data (backward compat)
const BANK_INFO_FALLBACK: BankInfo = {
  bank_name: 'Vietcombank',
  bank_code: '970436',
  account_number: '1056968673',
  account_name: 'LUONG VAN THUY',
}

export const useBankInfo = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['bank-info'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-bank-info')

      return (res?.data?.data ?? BANK_INFO_FALLBACK) as BankInfo
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: BANK_INFO_FALLBACK,
  })
}

export { BANK_INFO_FALLBACK }
