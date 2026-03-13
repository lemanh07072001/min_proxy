import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface SupplierSettings {
  supplier_api_url: string | null
  supplier_api_key: string | null
  supplier_api_secret: string | null
  source: 'database' | 'env'
}

export const useSupplierSettings = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['supplierSettings'],
    queryFn: async () => {
      const res = await axiosAuth.get('/admin/supplier-settings')

      return (res?.data?.data ?? {}) as SupplierSettings
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false
  })
}

export const useUpdateSupplierSettings = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      supplier_api_url: string
      supplier_api_key: string
      supplier_api_secret: string
    }) => {
      const res = await axiosAuth.post('/admin/update-supplier-settings', data)

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplierSettings'] })
    }
  })
}
