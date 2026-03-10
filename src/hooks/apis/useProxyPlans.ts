import { useQuery } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

/**
 * Hook lấy danh sách proxy tĩnh (type=0).
 *
 * Caching strategy:
 * - staleTime 5 phút: trong 5 phút đầu, dùng cache, không gọi API lại
 * - refetchOnWindowFocus: khi user quay lại tab, NẾU data đã stale (> 5 phút)
 *   thì tự động refetch ở background (hiển thị cache cũ, cập nhật silent)
 * - Sau khi mua proxy: invalidate query → refetch ngay lập tức
 */
export const useProxyStaticPlans = (enabled = true) => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['proxyStaticPlans'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-proxy-static')

      return res?.data?.data ?? []
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true
  })
}

/**
 * Hook lấy danh sách proxy xoay (type=1).
 *
 * Caching strategy: giống useProxyStaticPlans
 */
export const useProxyRotatingPlans = (enabled = true) => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['proxyRotatingPlans'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-proxy-rotating')

      return res?.data?.data ?? []
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true
  })
}
