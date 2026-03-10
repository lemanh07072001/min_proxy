import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface PendingBankQr {
  id: number
  transaction_code: string
  amount: number
  user_id: number
  status: string
  note: string
  expires_at: string
  created_at: string
  updated_at: string
}

interface CreateBankQrResponse {
  success: boolean
  message: string
  data: PendingBankQr | null
  remaining_seconds: number
}

interface PendingBankQrResponse {
  success: boolean
  data: PendingBankQr | null
  remaining_seconds?: number
}

/**
 * Hook tạo pending bank QR (thay thế useCreateCodeTransaction)
 */
export const useCreateBankQr = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: { amount: number }) => {
      const res = await axiosAuth.post('/create-bank-qr', params)

      
return res?.data as CreateBankQrResponse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-bank-qr'] })
      queryClient.invalidateQueries({ queryKey: ['depositHistory'] })
    }
  })
}

/**
 * Hook lấy pending bank QR hiện tại của user.
 * Auto refetch mỗi 5s để detect khi nạp tiền thành công.
 */
/**
 * Hook hủy (xóa) pending bank QR.
 */
export const useCancelBankQr = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosAuth.delete(`/cancel-bank-qr/${id}`)

      
return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-bank-qr'] })
      queryClient.invalidateQueries({ queryKey: ['depositHistory'] })
    }
  })
}

/**
 * Hook lấy pending bank QR hiện tại.
 * Smart polling: chỉ poll nhanh (5s) khi CÓ giao dịch đang chờ.
 * Khi KHÔNG có pending → poll chậm (60s) để detect giao dịch mới.
 * activePolling=true: dùng trên trang nạp tiền (poll 5s khi pending).
 * activePolling=false: dùng trên navbar (poll 60s luôn, tiết kiệm request).
 */
export const usePendingBankQr = (enabled: boolean = true, activePolling: boolean = false) => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['pending-bank-qr'],
    queryFn: async () => {
      const res = await axiosAuth.get('/pending-bank-qr')

      
return res?.data as PendingBankQrResponse
    },
    enabled,
    refetchInterval: (query) => {
      const hasPending = !!query.state.data?.data

      if (activePolling && hasPending) return 5000
      
return hasPending ? 30000 : 60000
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 10000
  })
}
