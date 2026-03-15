import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface BankSettings {
  bank_name: string | null
  bank_code: string | null
  bank_number: string | null
  bank_account: string | null
  format_chuyentien: string | null
}

export const useBankSettings = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['bank-settings'],
    queryFn: async () => {
      const res = await axiosAuth.get('/admin/bank-settings')

      return (res?.data?.data ?? {}) as BankSettings
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useUpdateBankSettings = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<BankSettings>) => {
      const res = await axiosAuth.post('/admin/bank-settings', data)

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-settings'] })
    },
  })
}
