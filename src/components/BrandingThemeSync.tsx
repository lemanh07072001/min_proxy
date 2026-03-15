'use client'

import { useEffect } from 'react'

import { useBranding } from '@/app/contexts/BrandingContext'
import { useSettings } from '@core/hooks/useSettings'

/**
 * Sync primaryColor từ BrandingContext (DB) → SettingsContext (MUI theme).
 * Force override mỗi lần — đảm bảo DB luôn thắng cookie cũ.
 */
export default function BrandingThemeSync() {
  const { primaryColor, isLoading } = useBranding()
  const { updateSettings } = useSettings()

  useEffect(() => {
    if (isLoading || !primaryColor) return

    // Force sync DB → MUI theme, ghi cookie mới luôn
    updateSettings({ primaryColor })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryColor, isLoading])

  return null
}
