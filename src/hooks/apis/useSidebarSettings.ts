import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface SupportLink {
  label: string
  url: string
  icon: string
  color: string
}

export interface YoutubeVideo {
  title: string
  url: string
}

export interface SidebarSettings {
  support_links: SupportLink[]
  youtube_videos: YoutubeVideo[]
}

const defaultData: SidebarSettings = { support_links: [], youtube_videos: [] }

// Public fetch — dùng axios instance không cần token
export const useSidebarSettings = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['sidebar-settings'],
    queryFn: async () => {
      try {
        const res = await axiosAuth.get('/get-sidebar-settings')

        return (res?.data?.data ?? defaultData) as SidebarSettings
      } catch {
        // Fallback: plain fetch nếu axios fail (chưa login)
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
          const res = await fetch(`${apiUrl}/get-sidebar-settings`)
          const json = await res.json()

          return (json?.data ?? defaultData) as SidebarSettings
        } catch {
          return defaultData
        }
      }
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useUpdateSidebarSettings = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SidebarSettings) => {
      const res = await axiosAuth.post('/admin/update-sidebar-settings', data)

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sidebar-settings'] })
      queryClient.invalidateQueries({ queryKey: ['sidebar-settings-public'] })
    }
  })
}
