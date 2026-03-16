import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

// ── Types ──

export interface AdminDepositsParams {
  status?: string
  deposit_type?: string
  search?: string
  start?: string
  end?: string
  page?: number
  per_page?: number
}

export interface InvestigateStep {
  step: number
  key: string
  label: string
  status: 'pass' | 'fail' | 'skip' | 'pending'
  detail: string
  timestamp: string | null
  data: Record<string, any> | null
}

export interface InvestigateResult {
  checklist: InvestigateStep[]
  diagnosis: {
    overall: 'pass' | 'fail'
    failed_at_step: number | null
    suggestion: string | null
  }
  context: {
    bank_auto: any
    transaction_bank: any
    user: any
  }
}

// ── Hooks ──

/**
 * Tab 2: Danh sách lệnh nạp tiền (bank_auto) cho admin.
 */
export const useAdminDeposits = (params: AdminDepositsParams = {}, enabled = true) => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['adminDeposits', params],
    queryFn: async () => {
      const res = await axiosAuth.get('/admin/deposit-management/deposits', {
        params: Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== '' && v !== undefined)
        )
      })

      return res?.data
    },
    enabled,
    staleTime: 10 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: (query) => {
      const records = query.state.data?.data

      if (!Array.isArray(records)) return false

      const hasPending = records.some((r: any) => r.status === 'pending')

      return hasPending ? 10000 : false
    }
  })
}

/**
 * Chuỗi bằng chứng điều tra nạp tiền — 6 bước.
 */
export const useInvestigateFull = (
  source: 'transaction_bank' | 'bank_auto' | null,
  id: number | null
) => {
  const axiosAuth = useAxiosAuth()

  return useQuery<InvestigateResult>({
    queryKey: ['investigateFull', source, id],
    queryFn: async () => {
      const res = await axiosAuth.get('/admin/deposit-management/investigate', {
        params: { source, id }
      })

      return res?.data?.data
    },
    enabled: !!source && !!id,
    staleTime: 0,
    refetchOnWindowFocus: false
  })
}

/**
 * Bỏ qua GD (spam/không liên quan).
 */
export const useDismissTransaction = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason?: string }) => {
      const res = await axiosAuth.post(`/admin/transaction-bank/${id}/dismiss`, { reason })

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactionBank'] })
      queryClient.invalidateQueries({ queryKey: ['transactionBankSummary'] })
    }
  })
}

/**
 * Hủy bỏ qua GD.
 */
export const useUndismissTransaction = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosAuth.post(`/admin/transaction-bank/${id}/undismiss`)

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactionBank'] })
      queryClient.invalidateQueries({ queryKey: ['transactionBankSummary'] })
    }
  })
}
