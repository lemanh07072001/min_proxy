import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export type SiteMode = 'parent' | 'child'

export interface SeoMeta {
  title?: string
  description?: string
  keywords?: string
}

export interface SocialLink {
  platform: string
  url: string
}

export interface BrandingSettings {
  site_name: string | null
  site_description: string | null
  logo_url: string | null
  favicon_url: string | null
  og_image_url: string | null

  // Theme
  primary_color: string | null
  primary_hover: string | null
  primary_gradient: string | null

  // SEO đa ngôn ngữ { vi: { title, description, keywords }, en: { ... } }
  seo_meta: Record<string, SeoMeta> | null

  // Technical
  google_verification: string | null
  gtm_id: string | null

  // Schema
  organization_name: string | null
  organization_phone: string | null
  organization_email: string | null
  organization_address: string | null
  website_url: string | null
  working_hours: string | null
  tax_id: string | null
  social_links: SocialLink[] | null

  // Content
  sidebar_description: string | null
  footer_text: string | null
  support_contact: string | null

  // Scripts
  head_scripts: string | null
  body_scripts: string | null

  // Pay2s
  pay2s_webhook_token: string | null

  // Telegram
  telegram_bot_token_system: string | null
  telegram_chat_id_system: string | null
  telegram_bot_token_deposit: string | null
  telegram_chat_id_deposit: string | null
  telegram_bot_token_error: string | null
  telegram_chat_id_error: string | null

  // Mode
  site_mode: SiteMode | null
}

export const useBrandingSettings = () => {
  return useQuery({
    queryKey: ['branding-settings'],
    queryFn: async () => {
      // Public API — không cần auth, fetch ngay khi app mount
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const res = await fetch(`${apiUrl}/get-branding-settings`)
      const json = await res.json()

      return (json?.data ?? {}) as BrandingSettings
    },
    staleTime: Infinity,       // không bao giờ stale — chỉ invalidate khi admin update
    gcTime: Infinity,           // giữ cache vĩnh viễn trong session
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
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
      // Invalidate client cache (TanStack Query)
      queryClient.invalidateQueries({ queryKey: ['branding-settings'] })

      // Invalidate server cache (Next.js) → SEO metadata cập nhật ngay
      fetch('/api/revalidate?tag=branding', { method: 'POST' }).catch(() => {})
    },
  })
}
