import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface Announcement {
  id: number
  title: string
  content: string
  type: 'discount' | 'new_product' | 'price_change' | 'maintenance' | 'general'
  color: string
  display_type: 'home' | 'modal'
  display_order: number
  is_active: boolean
  published_at: string
  created_by: number
  created_at: string
  updated_at: string
}

interface AnnouncementsResponse {
  home: Announcement[]
  modal: Announcement[]
}

/**
 * Hook lấy danh sách thông báo active (cho user).
 * Trả về { home, modal } — 2 loại hiển thị khác nhau.
 */
export const useAnnouncements = () => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-announcements')

      return (res?.data?.data ?? { home: [], modal: [] }) as AnnouncementsResponse
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true
  })
}

/**
 * Hook lấy tất cả thông báo (admin, có phân trang).
 */
export const useAdminAnnouncements = (page: number = 1) => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['admin-announcements', page],
    queryFn: async () => {
      const res = await axiosAuth.get(`/admin/get-announcements?page=${page}`)

      return res?.data?.data ?? { data: [], total: 0 }
    },
    staleTime: 30 * 1000
  })
}

/**
 * Hook tạo thông báo mới.
 */
export const useCreateAnnouncement = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<Announcement>) => {
      const res = await axiosAuth.post('/admin/add-announcement', data)

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] })
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    }
  })
}

/**
 * Hook cập nhật thông báo.
 */
export const useUpdateAnnouncement = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Announcement> & { id: number }) => {
      const res = await axiosAuth.post(`/admin/edit-announcement/${id}`, data)

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] })
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    }
  })
}

/**
 * Hook xóa thông báo.
 */
export const useDeleteAnnouncement = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosAuth.delete(`/admin/delete-announcement/${id}`)

      return res?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] })
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    }
  })
}
