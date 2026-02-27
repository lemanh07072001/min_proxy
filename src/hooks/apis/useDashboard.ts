import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

import useAxiosAuth from '@/hooks/useAxiosAuth'

interface DashboardParams {
  date?: string | Date | null
  startDate?: string | Date | null
  endDate?: string | Date | null
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
    staleTime: 5 * 60 * 1000 // 5 phút
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
  const formattedStartDate = formatDate(params?.startDate)
  const formattedEndDate = formatDate(params?.endDate)

  return useQuery({
    queryKey: ['dashboardMonthly', formattedDate, formattedStartDate, formattedEndDate],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      let url: URL

      // Use different endpoints based on whether it's a range or single date
      if (formattedStartDate && formattedEndDate) {
        // Use range API
        url = new URL(`${baseUrl}/api/get-dashboard-by-range`)
        url.searchParams.set('start', formattedStartDate)
        url.searchParams.set('end', formattedEndDate)
      } else if (formattedDate) {
        // Use single date API
        url = new URL(`${baseUrl}/api/get-dashboard-by-date`)
        url.searchParams.set('date', formattedDate)
      } else {
        // Fallback to single date API with today's date
        const today = formatDate(new Date())

        url = new URL(`${baseUrl}/api/get-dashboard-by-date`)
        url.searchParams.set('date', today)
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
