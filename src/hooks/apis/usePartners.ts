import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import axios from 'axios'

import useAxiosAuth from '@/hooks/useAxiosAuth'

export const usePartners = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-partner')
      const data = res?.data?.data ?? res?.data ?? []

      
return data
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000 // Cache 5 phút
  })
}

// Hook để tạo mới đối tác
export const useCreatePartner = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosAuth.post('/add-partner', data)

      
return res?.data
    },
    onSuccess: () => {
      // Refresh lại danh sách partners sau khi tạo thành công
      queryClient.invalidateQueries({ queryKey: ['partners'] })
    }
  })
}

// Hook để cập nhật đối tác
export const useUpdatePartner = (partnerId?: number) => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosAuth.post(`/edit-partner/${partnerId}`, data)

      
return res?.data
    },
    onSuccess: () => {
      // Refresh lại danh sách partners sau khi cập nhật thành công
      queryClient.invalidateQueries({ queryKey: ['partners'] })
    }
  })
}

// Hook để xóa đối tác
export const useDeletePartner = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (partnerId: number) => {
      const res = await axiosAuth.post(`/delete-partner/${partnerId}`)

      
return res?.data
    },
    onSuccess: () => {
      // Refresh lại danh sách partners sau khi xóa thành công
      queryClient.invalidateQueries({ queryKey: ['partners'] })
    }
  })
}

// Hook để tạo QR code nạp tiền
export const useGenerateQrCode = () => {
  const axiosAuth = useAxiosAuth()

  return useMutation({
    mutationFn: async (data: { partner_code: string; amount: string | number }) => {
      const res = await axiosAuth.post('/create-topup-transaction', data)

      
return res?.data
    }
  })
}

// Hook để lấy lịch sử giao dịch nạp tiền của partner
export const usePartnerTransactions = (partnerId?: number | string, enabled: boolean = true) => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['topupHistory', partnerId],
    queryFn: async () => {
      if (!partnerId) return []
      
      try {
        // Gọi API get-topup-history/{id} với path parameter
        const res = await axiosAuth.get(`/get-topup-history/${partnerId}`, { 
          timeout: 10000 // Timeout 10 giây
        })

        return res?.data?.data ?? res?.data ?? []
      } catch (error: any) {
        console.error('Error fetching topup history:', error)

        // Throw error để React Query có thể xử lý
        throw error
      }
    },
    enabled: enabled && !!partnerId, // Chỉ gọi khi enabled và có partnerId
    refetchOnMount: false, // Không refetch khi mount lại
    refetchOnWindowFocus: false, // Không refetch khi focus window
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    retry: 1, // Chỉ retry 1 lần
    retryDelay: 1000
  })
}

