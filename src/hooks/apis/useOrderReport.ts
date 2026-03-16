import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

import useAxiosAuth from '@/hocs/useAxiosAuth'

interface OrderReportParams {
  start: string // DD-MM-YYYY
  end: string // DD-MM-YYYY
  provider_id?: number | null
}

interface OrderDetailParams extends OrderReportParams {
  status?: number | null
  per_page?: number
}

// ═══════════════════════════════════════════════════════
// Hooks
// ═══════════════════════════════════════════════════════

export const useOrderReportSummary = (params: OrderReportParams, enabled = true) => {
  const { data: session } = useSession() as any
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['orderReportSummary', params.start, params.end, params.provider_id],
    queryFn: async () => {
      const res = await axiosAuth.get('/order-report/summary', {
        params: {
          start: params.start,
          end: params.end,
          ...(params.provider_id ? { provider_id: params.provider_id } : {})
        }
      })

      return res.data?.data ?? null
    },
    enabled: enabled && !!session?.access_token && !!params.start && !!params.end,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false
  })
}

export const useOrderReportDetail = (params: OrderDetailParams, enabled = true) => {
  const { data: session } = useSession() as any
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['orderReportDetail', params.start, params.end, params.provider_id, params.status, params.per_page ?? 100],
    queryFn: async () => {
      const res = await axiosAuth.get('/order-report/detail', {
        params: {
          start: params.start,
          end: params.end,
          ...(params.provider_id ? { provider_id: params.provider_id } : {}),
          ...(params.status !== null && params.status !== undefined ? { status: params.status } : {}),
          per_page: params.per_page ?? 100
        }
      })

      return res.data?.data ?? null
    },
    enabled: enabled && !!session?.access_token && !!params.start && !!params.end,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false
  })
}

// ═══════════════════════════════════════════════════════
// Admin Orders — server-side pagination
// ═══════════════════════════════════════════════════════

export interface AdminOrdersParams {
  start: string
  end: string
  page?: number
  per_page?: number
  status?: number | null
  provider_id?: number | null
  order_type?: number | null
  sort_by?: string
  sort_order?: string
}

export const useAdminOrders = (params: AdminOrdersParams, enabled = true) => {
  const { data: session } = useSession() as any
  const axiosAuth = useAxiosAuth()

  const { start, end, page = 1, per_page = 100, status, provider_id, order_type, sort_by = 'created_at', sort_order = 'desc' } = params

  return useQuery({
    queryKey: ['adminOrders', start, end, page, per_page, status, provider_id, order_type, sort_by, sort_order],
    queryFn: async () => {
      const res = await axiosAuth.get('/order-report/detail', {
        params: {
          start,
          end,
          page,
          per_page,
          sort_by,
          sort_order,
          ...(status !== null && status !== undefined ? { status } : {}),
          ...(provider_id ? { provider_id } : {}),
          ...(order_type !== null && order_type !== undefined ? { order_type } : {})
        }
      })

      return res.data?.data ?? null
    },
    enabled: enabled && !!session?.access_token && !!start && !!end,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false
  })
}
