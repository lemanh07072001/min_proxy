import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useAxiosAuth from '@/hocs/useAxiosAuth'

interface CreateCodeTransactionParams {
  code: string
}

interface CodeTransaction {
  id: number
  code: string
  created_at: string
  updated_at: string
  [key: string]: any
}

/**
 * Hook để tạo code transaction
 */
export const useCreateCodeTransaction = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: CreateCodeTransactionParams) => {
      const res = await axiosAuth.post('/code-transactions', params)
      return res?.data
    },
    onSuccess: () => {
      // Refresh lại danh sách code transactions sau khi tạo thành công
      queryClient.invalidateQueries({ queryKey: ['code-transactions'] })
    }
  })
}

/**
 * Hook để lấy danh sách code transactions
 */
export const useCodeTransactions = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['code-transactions'],
    queryFn: async () => {
      const res = await axiosAuth.get('/code-transactions')
      return (res?.data?.data ?? res?.data ?? []) as CodeTransaction[]
    },
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 0
  })
}

