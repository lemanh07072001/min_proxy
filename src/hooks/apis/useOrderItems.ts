import { useQuery } from '@tanstack/react-query'
import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface OrderItemRecord {
  _id: string
  key: string
  order_id: number
  user_id: number
  service_type_id: number
  type: 'ROTATING' | 'STATIC'
  status: number // 0=active, 1=inactive, 2=expired
  protocol: string
  proxy?: Record<string, any>
  allow_ips?: string[]
  expired_at?: string
  created_at?: string
  provider_key?: string
  provider_order_code?: string
  next_rotate_seconds?: number
}

interface OrderItemsMeta {
  total: number
  page: number
  limit: number
  last_page: number
}

interface OrderItemsResponse {
  data: OrderItemRecord[]
  meta: OrderItemsMeta
}

interface OrderItemsParams {
  page?: number
  limit?: number
  type?: string
  status?: string
  search?: string
  user_id?: number
}

export const useOrderItems = (params: OrderItemsParams, isAdmin = false, enabled = true) => {
  const axiosAuth = useAxiosAuth()
  const endpoint = isAdmin ? '/admin/order-items' : '/order-items'

  return useQuery<OrderItemsResponse>({
    queryKey: ['orderItems', isAdmin, params],
    queryFn: async () => {
      const res = await axiosAuth.get(endpoint, { params })
      return { data: res?.data?.data ?? [], meta: res?.data?.meta ?? { total: 0, page: 1, limit: 100, last_page: 1 } }
    },
    enabled,
    staleTime: 15_000,
  })
}
