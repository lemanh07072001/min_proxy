'use client'

/**
 * Logo component
 *
 * Site mẹ: DB → env var → file mặc định
 * Site con: DB only → chưa setup thì ẩn
 */

import { useBranding } from '@/app/contexts/BrandingContext'

const Logo = () => {
  const { logo, isChild, name } = useBranding()

  // Site con: chỉ dùng DB logo. Site mẹ: fallback default file
  const logoSrc = logo || (!isChild ? '/images/logo/Logo_MKT_Proxy.png' : '')

  if (!logoSrc) {
    // Không có logo → hiện tên site text (nếu có)
    if (name) {
      return (
        <div style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>{name}</span>
        </div>
      )
    }

    return <div style={{ minHeight: 40 }} />
  }

  return (
    <div style={{ minHeight: 40, maxHeight: 50, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      <img
        src={logoSrc}
        alt='Logo'
        width={180}
        height={50}
        style={{ maxWidth: '100%', maxHeight: '50px', height: 'auto', objectFit: 'contain' }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
    </div>
  )
}

export default Logo
