import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface WorkerState {
  order_id?: number
  history_id?: number
  provider?: string
  item?: string
  progress?: string
  qty?: number
  retry?: number
  status?: string
  at?: string
}

export interface LogEntry {
  t: string // time HH:mm:ss
  w: string // worker name
  m: string // message
  o?: number // order_id
  h?: number // history_id
  k?: string // item_key
  p?: string // provider
}

export interface CircuitBreaker {
  at: string
  reason: string
  ttl: number // seconds remaining
}

export interface QueueStatusData {
  queues: {
    renewal: number
    placeorder: number
    rotate: number
    [key: string]: number
  }
  workers: {
    renewal: WorkerState | null
    placeorder: WorkerState | null
    rotate: WorkerState | null
    fetch: WorkerState | null
    [key: string]: WorkerState | null | undefined
  }
  logs: LogEntry[]
  circuit_breakers: Record<string, CircuitBreaker>
  error?: string
}

export const useQueueStatus = (enabled = true) => {
  const axiosAuth = useAxiosAuth()

  return useQuery<QueueStatusData>({
    queryKey: ['queueStatus'],
    queryFn: async () => {
      const res = await axiosAuth.get('/admin/queue-status')

      return res?.data?.data
    },
    refetchInterval: enabled ? 5000 : false,
    staleTime: 4000,
    refetchOnWindowFocus: false,
    // Giữ data cũ khi đang fetch → không flicker
    placeholderData: prev => prev,
    // structuralSharing (default true) → chỉ re-render khi data thật sự thay đổi
  })
}

export const useClearCircuitBreaker = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (providerCode: string) => {
      const res = await axiosAuth.post('/admin/circuit-breaker/clear', {
        provider_code: providerCode
      })

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queueStatus'] })
    }
  })
}
