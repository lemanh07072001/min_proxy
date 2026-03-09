import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface BrandingSettings {
  site_name: string | null
  site_description: string | null
  logo_url: string | null
  favicon_url: string | null
  primary_color: string | null
  primary_hover: string | null
  primary_gradient: string | null
}

export const useBrandingSettings = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['branding-settings'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-branding-settings')

      return (res?.data?.data ?? {}) as BrandingSettings
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useUpdateBrandingSettings = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<BrandingSettings>) => {
      const res = await axiosAuth.post('/admin/update-branding-settings', data)

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branding-settings'] })
    },
  })
}
