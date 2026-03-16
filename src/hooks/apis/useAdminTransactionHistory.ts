import { useQuery } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface AdminTransactionParams {
  search?: string
  status?: string
  type?: string
  limit?: number
  order?: 'asc' | 'desc'
}

/**
 * Hook lấy lịch sử giao dịch (admin).
 * Mặc định lấy 100 giao dịch gần nhất (desc), không phân trang.
 * Hỗ trợ search (tên, email, nội dung), filter (status, type), limit, order.
 */
export const useAdminTransactionHistory = (params: AdminTransactionParams = {}, enabled = true) => {
  const axiosAuth = useAxiosAuth()

  const { search, status, type, limit, order } = params

  return useQuery({
    queryKey: ['adminTransactionHistory', search, status, type, limit, order],
    queryFn: async () => {
      const res = await axiosAuth.get('/transaction-history', {
        params: {
          ...(limit ? { limit } : {}),
          ...(order ? { order } : {}),
          ...(search ? { search } : {}),
          ...(status ? { status } : {}),
          ...(type ? { type } : {})
        }
      })

      return res?.data
    },
    enabled,
    staleTime: 10 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: (query) => {
      const records = query.state.data?.data

      if (!Array.isArray(records)) return false

      // Pending statuses: 0=pending, 1=processing, 9=retry, 10=awaiting
      const hasPending = records.some((r: any) => [0, 1, 9, 10].includes(Number(r.order?.status)))

      return hasPending ? 10000 : false
    }
  })
}
