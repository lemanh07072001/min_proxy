'use client'

import { createContext, useContext, useEffect, useMemo } from 'react'

import { siteConfig } from '@/configs/siteConfig'
import { useBrandingSettings, type SiteMode, type BrandingSettings } from '@/hooks/apis/useBrandingSettings'

interface BrandingContextValue extends Omit<BrandingSettings, 'site_mode'> {
  name: string
  description: string
  logo: string
  favicon: string
  primaryColor: string
  primaryHover: string
  primaryGradient: string
  siteMode: SiteMode
  isParent: boolean
  isChild: boolean
  isLoading: boolean
}

const defaultBranding: BrandingContextValue = {
  name: siteConfig.name,
  description: siteConfig.description,
  logo: siteConfig.logo,
  favicon: siteConfig.favicon,
  primaryColor: siteConfig.primaryColor,
  primaryHover: siteConfig.primaryHover,
  primaryGradient: siteConfig.primaryGradient,
  siteMode: 'child',
  isParent: false,
  isChild: true,
  isLoading: false,
  // New fields defaults
  site_name: null,
  site_description: null,
  logo_url: null,
  favicon_url: null,
  og_image_url: null,
  primary_color: null,
  primary_hover: null,
  primary_gradient: null,
  seo_meta: null,
  google_verification: null,
  gtm_id: null,
  organization_name: null,
  organization_phone: null,
  organization_email: null,
  organization_address: null,
  website_url: null,
  working_hours: null,
  tax_id: null,
  social_links: null,
  sidebar_description: null,
  footer_text: null,
  support_contact: null,
  head_scripts: null,
  body_scripts: null,
}

const BrandingContext = createContext<BrandingContextValue>(defaultBranding)

export const useBranding = () => useContext(BrandingContext)

// Đọc branding từ DOM data-* attributes (server-side inject) — đồng bộ, không flash
function getServerData(key: string, fallback: string = ''): string {
  if (typeof document === 'undefined') return fallback

  return document.body.getAttribute(`data-${key}`) || fallback
}

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useBrandingSettings()

  const siteMode: SiteMode = (data?.site_mode || getServerData('site-mode', 'child')) as SiteMode

  const branding = useMemo<BrandingContextValue>(() => ({
    // Shorthand aliases — ưu tiên API > DOM > env default
    name: data?.site_name || getServerData('site-name', ''),
    description: data?.site_description || getServerData('site-description', ''),
    logo: data?.logo_url || '',
    favicon: data?.favicon_url || '',
    primaryColor: data?.primary_color || siteConfig.primaryColor,
    primaryHover: data?.primary_hover || siteConfig.primaryHover,
    primaryGradient: data?.primary_gradient || siteConfig.primaryGradient,
    siteMode,
    isParent: siteMode === 'parent',
    isChild: siteMode === 'child',
    isLoading,
    // All raw fields from API
    site_name: data?.site_name ?? null,
    site_description: data?.site_description ?? null,
    logo_url: data?.logo_url ?? null,
    favicon_url: data?.favicon_url ?? null,
    og_image_url: data?.og_image_url ?? null,
    primary_color: data?.primary_color ?? null,
    primary_hover: data?.primary_hover ?? null,
    primary_gradient: data?.primary_gradient ?? null,
    seo_meta: data?.seo_meta ?? null,
    google_verification: data?.google_verification ?? null,
    gtm_id: data?.gtm_id ?? null,
    organization_name: data?.organization_name ?? null,
    organization_phone: data?.organization_phone ?? null,
    organization_email: data?.organization_email ?? null,
    organization_address: data?.organization_address ?? null,
    website_url: data?.website_url ?? null,
    working_hours: data?.working_hours ?? null,
    tax_id: data?.tax_id ?? null,
    social_links: data?.social_links ?? null,
    sidebar_description: data?.sidebar_description ?? null,
    footer_text: data?.footer_text ?? null,
    support_contact: data?.support_contact ?? null,
    head_scripts: data?.head_scripts ?? null,
    body_scripts: data?.body_scripts ?? null,
  }), [data, isLoading, siteMode])

  // Inject CSS variables + favicon khi branding load xong
  useEffect(() => {
    if (isLoading) return
    const root = document.documentElement

    // CSS variables
    root.style.setProperty('--primary-hover', branding.primaryHover, 'important')
    root.style.setProperty('--primary-gradient', branding.primaryGradient, 'important')

    // Auto-contrast: tính luminance để chọn text trắng hoặc đen trên nền primary
    const hex = branding.primaryColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16) / 255
    const g = parseInt(hex.substring(2, 4), 16) / 255
    const b = parseInt(hex.substring(4, 6), 16) / 255
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b
    const contrastText = luminance > 0.6 ? '#1e293b' : '#ffffff'

    root.style.setProperty('--primary-contrast', contrastText)

    // Dynamic favicon
    const faviconUrl = branding.favicon

    if (faviconUrl) {
      document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').forEach(el => {
        (el as HTMLLinkElement).href = faviconUrl
      })

      if (!document.querySelector('link[rel="icon"]')) {
        const link = document.createElement('link')

        link.rel = 'icon'
        link.href = faviconUrl
        document.head.appendChild(link)
      }
    }

    // GTM + head_scripts + body_scripts đã chuyển sang server-side (layout.tsx)
  }, [branding, isLoading])

  return (
    <BrandingContext.Provider value={branding}>
      {children}
    </BrandingContext.Provider>
  )
}
