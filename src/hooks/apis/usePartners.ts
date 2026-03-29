import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface Partner {
  id: number
  name: string
  subtitle: string | null
  description: string[] | null
  logo: string | null
  logo_url: string | null
  logo_landing: string | null
  logo_landing_url: string | null
  link: string | null
  status: string
  order: number
  display_duration: number
}

/**
 * Lấy danh sách đối tác active (public) — dùng cho banner
 */
export const usePublicPartners = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['partners-public'],
    queryFn: async () => {
      try {
        const res = await axiosAuth.get('/get-partners')

        return (res?.data?.data ?? []) as Partner[]
      } catch {
        // Fallback nếu axiosAuth fail (chưa login)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
        const res = await fetch(`${apiUrl}/get-partners`)
        const json = await res.json()

        return (json?.data ?? []) as Partner[]
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000
  })
}

/**
 * Lấy danh sách đối tác active (admin)
 */
export const usePartners = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-all-partners')

      return (res?.data?.data ?? []) as Partner[]
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000
  })
}

/**
 * Thêm đối tác
 */
export const useCreatePartner = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await axiosAuth.post('/add-partner', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] })
    }
  })
}

/**
 * Cập nhật đối tác
 */
export const useUpdatePartner = (partnerId?: number) => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await axiosAuth.post(`/edit-partner/${partnerId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] })
    }
  })
}

/**
 * Tạo QR code nạp tiền
 */
export const useGenerateQrCode = () => {
  const axiosAuth = useAxiosAuth()

  return useMutation({
    mutationFn: async (data: { partner_code: string; amount: string }) => {
      const res = await axiosAuth.post('/generate-qr-code', data)

      return res?.data
    },
  })
}

/**
 * Lấy lịch sử giao dịch đối tác
 */
export const usePartnerTransactions = (partnerId?: number | string, enabled = true) => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['partner-transactions', partnerId],
    queryFn: async () => {
      const res = await axiosAuth.get(`/get-topup-history?partner_id=${partnerId}`)

      return (res?.data?.data ?? []) as any[]
    },
    enabled: !!partnerId && enabled,
    refetchOnWindowFocus: false,
  })
}

/**
 * Xóa đối tác
 */
export const useDeletePartner = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (partnerId: number) => {
      const res = await axiosAuth.post(`/delete-partner/${partnerId}`)

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] })
    }
  })
}
