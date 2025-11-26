import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import useAxiosAuth from '@/hocs/useAxiosAuth'

interface DashboardParams {
  date?: string
}

export const useDashboard = () => {
  const { data: session } = useSession() as any

  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const res = await fetch(`${baseUrl}/api/admin/dashboard`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await res.json()
      return data?.data ?? null
    },
    enabled: !!session?.access_token,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 0
  })
}

export const useDashboardMonthly = (params?: DashboardParams, enabled: boolean = true) => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['dashboardMonthly', params?.date],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-dashboard-by-date', {
        params: {
          date: params?.date
        }
      })
      return res?.data?.data ?? null
    },
    enabled: enabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}
