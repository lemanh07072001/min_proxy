import { siteConfig } from '@/configs/siteConfig'
import type { BrandingSettings } from '@/hooks/apis/useBrandingSettings'

/**
 * Fetch branding settings server-side (cho generateMetadata + layout).
 *
 * Cache strategy:
 * - Next.js fetch cache với tag 'branding' — revalidate mỗi 5 phút
 * - Khi admin update → gọi revalidateTag('branding') để xóa cache ngay
 * - Client-side: TanStack Query cache 10 phút riêng
 */
export async function getServerBranding(): Promise<BrandingSettings> {
  try {
    const apiUrl = process.env.API_URL || siteConfig.apiUrl
    const isDev = process.env.NODE_ENV === 'development'

    const res = await fetch(`${apiUrl}/get-branding-settings`, isDev
      ? { cache: 'no-store' }
      : { next: { revalidate: 300, tags: ['branding'] } }
    )

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const json = await res.json()

    if (json?.success && json?.data) {
      return json.data
    }
  } catch (e) {
    console.error('[getServerBranding] Failed:', e)
  }

  // Fallback → env defaults
  return {
    site_name: siteConfig.name,
    site_description: siteConfig.description,
    logo_url: siteConfig.logo,
    favicon_url: siteConfig.favicon,
    og_image_url: null,
    primary_color: siteConfig.primaryColor,
    primary_hover: siteConfig.primaryHover,
    primary_gradient: siteConfig.primaryGradient,
    seo_meta: null,
    google_verification: null,
    gtm_id: null,
    organization_name: null,
    organization_phone: null,
    organization_email: null,
    social_links: null,
    sidebar_description: null,
    footer_text: null,
    support_contact: null,
    head_scripts: null,
    body_scripts: null,
    site_mode: 'child',
  }
}
