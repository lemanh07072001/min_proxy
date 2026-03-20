import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { PUBLIC_API_URL } from '@/config/api'
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

// Dùng axios trực tiếp (không cần auth) — public endpoint
export const useSidebarSettings = () => {
  return useQuery({
    queryKey: ['sidebar-settings'],
    queryFn: async () => {
      const res = await axios.get(`${PUBLIC_API_URL}/get-sidebar-settings`)

      return (res?.data?.data ?? defaultData) as SidebarSettings
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
    }
  })
}
