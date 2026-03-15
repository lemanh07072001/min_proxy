'use client'

/**
 * Logo component — đơn giản, đáng tin cậy
 *
 * Dùng useBranding().logo — ưu tiên DB → env var → file mặc định
 * Site mẹ: luôn có logo
 * Site con chưa setup: hiện file mặc định, admin upload sau sẽ override
 */

import { useBranding } from '@/app/contexts/BrandingContext'
import { siteConfig } from '@/configs/siteConfig'

const DEFAULT_LOGO = '/images/logo/Logo_MKT_Proxy.png'

const Logo = () => {
  // DB → env → default file
  const { logo } = useBranding()
  const logoSrc = logo || siteConfig.logo || DEFAULT_LOGO

  if (!logoSrc) return null

  return (
    <div style={{ minHeight: 40, maxHeight: 50, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      <img
        src={logoSrc}
        alt='Logo'
        width={180}
        height={50}
        style={{
          maxWidth: '100%',
          maxHeight: '50px',
          height: 'auto',
          objectFit: 'contain',
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none'
        }}
      />
    </div>
  )
}

export default Logo
