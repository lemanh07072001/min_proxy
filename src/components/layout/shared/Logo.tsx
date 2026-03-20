'use client'

/**
 * Logo component
 *
 * - Expanded: hiện logo đầy đủ (chữ + biểu tượng)
 * - Collapsed: hiện logo icon nhỏ (chỉ biểu tượng, không chữ)
 * - Site mẹ: DB → fallback default file
 * - Site con: DB only → chưa setup thì ẩn
 */

import { useBranding } from '@/app/contexts/BrandingContext'

interface LogoProps {
  isCollapsed?: boolean
}

const Logo = ({ isCollapsed = false }: LogoProps) => {
  const { logo, logoIcon, isChild, name } = useBranding()

  // Site con: chỉ dùng DB logo. Site mẹ: fallback default file
  const fullLogoSrc = logo || (!isChild ? '/images/logo/Logo_MKT_Proxy.png' : '')
  const iconLogoSrc = logoIcon || ''

  // Collapsed: hiện icon nếu có, không thì hiện chữ cái đầu
  if (isCollapsed) {
    if (iconLogoSrc) {
      return (
        <div style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={iconLogoSrc}
            alt='Logo'
            width={34}
            height={34}
            style={{ maxWidth: '100%', maxHeight: '34px', objectFit: 'contain' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
      )
    }

    // Fallback: chữ cái đầu
    const initial = (name || 'M').charAt(0).toUpperCase()

    return (
      <div style={{
        width: 34, height: 34, borderRadius: 8,
        background: 'var(--primary-gradient, linear-gradient(135deg, #FC4336, #F88A4B))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 700, fontSize: '16px'
      }}>
        {initial}
      </div>
    )
  }

  // Expanded: logo đầy đủ
  if (!fullLogoSrc) {
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
        src={fullLogoSrc}
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
