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
  const { data: session } = useSession() as any

  // Format date to DD-MM-YYYY if provided, otherwise use current date
  const formatDate = (date?: string | Date | null): string => {
    if (!date) {
      const today = new Date()
      const day = String(today.getDate()).padStart(2, '0')
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const year = today.getFullYear()
      return `${day}-${month}-${year}`
    }

    if (date instanceof Date) {
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}-${month}-${year}`
    }

    // If date is string in format DD/MM/YYYY, convert to DD-MM-YYYY
    if (typeof date === 'string' && date.includes('/')) {
      return date.replace(/\//g, '-')
    }

    return date
  }

  const formattedDate = formatDate(params?.date)

  return useQuery({
    queryKey: ['dashboardMonthly', formattedDate],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const url = new URL(`${baseUrl}/api/get-dashboard-by-date`)
      if (formattedDate) {
        url.searchParams.set('date', formattedDate)
      }

      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await res.json()
      return data?.data ?? null
    },
    enabled: enabled && !!session?.access_token,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}
