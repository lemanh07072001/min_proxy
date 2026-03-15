import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface DepositHistoryParams {
  status?: string
  limit?: number
  order?: 'asc' | 'desc'
}

/**
 * Hook lấy lịch sử nạp tiền — chung cho admin và user.
 * API tự phân quyền: admin thấy tất cả, user chỉ thấy của mình.
 * Mặc định 100 bản ghi gần nhất (desc), không phân trang.
 */
export const useDepositHistory = (params: DepositHistoryParams = {}, enabled = true) => {
  const axiosAuth = useAxiosAuth()

  const { status, limit, order } = params

  return useQuery({
    queryKey: ['depositHistory', status, limit, order],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-deponsit-history', {
        params: {
          ...(limit ? { limit } : {}),
          ...(order ? { order } : {}),
          ...(status ? { status } : {})
        }
      })

      return res?.data?.data ?? []
    },
    enabled,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 1
  })
}

/**
 * Mutation xóa bản ghi nạp tiền (chỉ admin).
 * Soft-delete: is_deleted = true.
 */
export const useDeleteDeposit = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const res = await axiosAuth.delete('/admin/bank-auto/delete', {
        data: { ids }
      })

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depositHistory'] })
    }
  })
}
