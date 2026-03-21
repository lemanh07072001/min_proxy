import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface SupplierProduct {
  supplier_id: number
  supplier_code: string | null
  name: string
  type: string
  durations: string[]
  protocols: string[]
  provider_prices: Record<string, number>
  country: string | null

  // Nếu đã import
  local_id?: number
  local_name?: string
  local_prices?: any
  status?: string
}

export interface SupplierProductsResponse {
  imported: SupplierProduct[]
  available: SupplierProduct[]
}

/**
 * Lấy danh sách SP từ site mẹ + so sánh với local
 */
export const useSupplierProducts = (enabled = true) => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['supplier-products'],
    queryFn: async () => {
      const res = await axiosAuth.get('/supplier/products')

      return res?.data?.data as SupplierProductsResponse
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

/**
 * Import SP từ site mẹ → tạo local ServiceType
 */
export const useImportSupplierProduct = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      provider_product_id?: number
      provider_product_code?: string
      name: string
      sell_prices: Record<string, number>
    }) => {
      const res = await axiosAuth.post('/supplier/products/import', data)

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-products'] })
      queryClient.invalidateQueries({ queryKey: ['service-types'] })
    },
  })
}

/**
 * Số dư trên site mẹ
 */
export const useSupplierBalance = (enabled = true) => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['supplier-balance'],
    queryFn: async () => {
      const res = await axiosAuth.get('/supplier/balance')

      return res?.data?.balance as number
    },
    enabled,
    staleTime: 60 * 1000,
  })
}
