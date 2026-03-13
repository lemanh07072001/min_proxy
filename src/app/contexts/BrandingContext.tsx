'use client'

import { createContext, useContext, useEffect, useMemo } from 'react'

import { siteConfig } from '@/configs/siteConfig'
import { useBrandingSettings, type SiteMode } from '@/hooks/apis/useBrandingSettings'

interface BrandingContextValue {
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
}

const BrandingContext = createContext<BrandingContextValue>(defaultBranding)

export const useBranding = () => useContext(BrandingContext)

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useBrandingSettings()

  const siteMode: SiteMode = data?.site_mode || 'child'

  const branding = useMemo<BrandingContextValue>(() => ({
    name: data?.site_name || siteConfig.name,
    description: data?.site_description || siteConfig.description,
    logo: data?.logo_url || siteConfig.logo,
    favicon: data?.favicon_url || siteConfig.favicon,
    primaryColor: data?.primary_color || siteConfig.primaryColor,
    primaryHover: data?.primary_hover || siteConfig.primaryHover,
    primaryGradient: data?.primary_gradient || siteConfig.primaryGradient,
    siteMode,
    isParent: siteMode === 'parent',
    isChild: siteMode === 'child',
    isLoading,
  }), [data, isLoading, siteMode])

  // Inject CSS variables dynamically when branding data loads from DB
  useEffect(() => {
    if (isLoading) return
    const root = document.documentElement

    root.style.setProperty('--primary-hover', branding.primaryHover, 'important')
    root.style.setProperty('--primary-gradient', branding.primaryGradient, 'important')
  }, [branding.primaryHover, branding.primaryGradient, isLoading])

  return (
    <BrandingContext.Provider value={branding}>
      {children}
    </BrandingContext.Provider>
  )
}
