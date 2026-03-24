'use client'

import React, { useState, useMemo } from 'react'

import '@/app/[lang]/(private)/(client)/components/proxy-card/styles.css'

import { MapPin, ShoppingCart, User, Shield, Wifi, Zap, Users } from 'lucide-react'

import { useSession } from 'next-auth/react'

import CheckoutModal from '@/components/checkout-modal/CheckoutModal'
import type { PriceOption } from '@/components/checkout-modal/CheckoutModal'
import { getTagStyle, shouldHideByTag, fixCountryCode } from '@/configs/tagConfig'
import { useBranding } from '@/app/contexts/BrandingContext'
import { protocols as defaultProtocols } from '@/utils/protocolProxy'

import { useModalContext } from '@/app/contexts/ModalContext'

interface ProxyCardProps {
  provider: any
  isFirstCard?: boolean
  onPurchaseSuccess?: () => void
  countries?: any[]
}

const ProxyCard: React.FC<ProxyCardProps> = ({ provider, isFirstCard = false, countries = [] }) => {
  const session = useSession()
  const { openAuthModal } = useModalContext()
  const { show_product_code } = useBranding()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const isAvailable = provider?.is_purchasable !== false
  const hasPriceByDuration = provider?.price_by_duration && provider.price_by_duration.length > 0

  const visibleTags = useMemo(() => {
    if (!provider?.tag) return []
    
return provider.tag.split(',').filter((t: string) => {
      const tagDef = getTagStyle(t)

      
return !(tagDef && 'hidden' in tagDef && tagDef.hidden)
    })
  }, [provider?.tag])

  function convertAuthType(type: string) {
    switch (type) {
      case 'userpass': return 'User:Pass'
      case 'ip_whitelist': return 'IP Whitelist'
      case 'both': return 'User:Pass + IP'
      default: return type || ''
    }
  }

  function convertIpVersion(version: string) {
    switch (version?.toLowerCase()) {
      case 'ipv4': return 'V4'
      case 'ipv6': return 'V6'
      default: return version || ''
    }
  }

  function getCountryName() {
    if (!countries || countries.length === 0) return null
    const countryCode = (provider?.country || provider?.country_code)?.trim()?.toUpperCase()

    if (!countryCode) return null
    const country = countries.find((c: any) => c.code?.toUpperCase() === countryCode)

    return country?.name || null
  }

  function getDurationLabel(duration: string) {
    switch (duration) {
      case '1': return 'Ngày'
      case '7': return 'Tuần'
      case '30': return 'Tháng'
      case '365': return 'Năm'
      default: return `${duration} ngày`
    }
  }

  // Build price options cho CheckoutModal
  const priceOptions: PriceOption[] = useMemo(() => {
    if (hasPriceByDuration) {
      return provider.price_by_duration.map((item: any) => ({
        key: item.key,
        label: getDurationLabel(item.key),
        price: parseInt(item.value, 10) || 0
      }))
    }

    
return [{ key: '1', label: 'Ngày', price: parseInt(provider.price, 10) || 0 }]
  }, [provider.price_by_duration, provider.price, hasPriceByDuration])

  // Protocols cho CheckoutModal
  const protocolList: string[] = useMemo(() => {
    if (provider.protocols && Array.isArray(provider.protocols)) return provider.protocols
    
return defaultProtocols.map(p => p.id)
  }, [provider.protocols])

  if (shouldHideByTag(provider?.tag)) return null

  // Giá hiển thị ở header
  const isPerUnit = provider.pricing_mode === 'per_unit'
  const headerPrice = isPerUnit ? (provider.price_per_unit || 0) : (priceOptions[0]?.price || parseInt(provider?.price, 10) || 0)
  const headerPriceSuffix = isPerUnit ? `/${provider.time_unit === 'month' ? 'tháng' : 'ngày'}` : ''

  // Tính % tiết kiệm tối đa
  const maxDiscount = useMemo(() => {
    // Per_unit: max discount từ discount_tiers
    if (isPerUnit) {
      const tiers = provider.metadata?.discount_tiers || []

      if (tiers.length === 0) return 0

      return Math.max(...tiers.map((t: any) => parseInt(t.discount) || 0))
    }

    if (priceOptions.length <= 1) return 0
    const sorted = [...priceOptions].sort((a, b) => parseInt(a.key) - parseInt(b.key))
    const base = sorted[0]
    const baseDays = parseInt(base.key) || 1

    let max = 0

    sorted.slice(1).forEach(opt => {
      const days = parseInt(opt.key) || 0
      const origPrice = (base.price / baseDays) * days

      if (opt.price < origPrice) {
        const pct = Math.round((1 - opt.price / origPrice) * 100)

        if (pct > max) max = pct
      }
    })

    return max
  }, [priceOptions, isPerUnit])

  const handleBuy = () => {
    if (session.status !== 'authenticated') {
      openAuthModal('login')
      
return
    }

    setCheckoutOpen(true)
  }

  return (
    <>
      <div
        className={`proxy-card-column${checkoutOpen ? ' active' : ''}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
          ...((!isAvailable) ? { opacity: 0.7 } : {})
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header: title (trái) + tags (phải) */}
          <div className='card-header-column'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <h3 className='provider-title-column' style={{ marginBottom: 1 }}>{provider?.name ?? provider?.code}</h3>
                {show_product_code !== '0' && (
                  <span style={{ fontFamily: 'monospace', fontSize: '10.5px', fontWeight: 500, color: '#b0b8c4', lineHeight: 1, display: 'block' }}>{provider?.id}#{provider?.code || ''}</span>
                )}
              </div>
              {visibleTags.length > 0 && (
                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                  {visibleTags.map((tag: string, i: number) => {
                    const tagDef = getTagStyle(tag)

                    return <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '3px 10px', fontSize: '10.5px', fontWeight: 700, borderRadius: '6px', background: tagDef.gradient || tagDef.bgColor, color: tagDef.textColor, letterSpacing: '0.3px', lineHeight: 1.3 }}>{tagDef.icon && <span style={{ fontSize: '11px' }}>{tagDef.icon}</span>}{tag.trim()}</span>
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Note — hiện full HTML */}
          {provider?.note && provider.note !== '<p></p>' && (() => {
            const text = provider.note.replace(/<[^>]+>/g, '').trim()

            if (!text) return null

            return <div className='proxy-note-content' style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: provider.note }} />
          })()}

          {/* Product info as feature rows */}
          <div style={{ marginBottom: '8px' }}>
            <div className='feature-row'>
              <div className='feature-icons'><MapPin size={14} color='#6366f1' /></div>
              <div className='feature-content'>
                <span className='feature-label'>Loại IP:</span>
                <span className='feature-value' style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Static {convertIpVersion(provider.ip_version)} — {(provider?.country || provider?.country_code) && <img src={`https://flagcdn.com/w40/${fixCountryCode(provider.country || provider.country_code)}.png`} alt='' style={{ width: 18, height: 13, objectFit: 'cover', borderRadius: 2 }} />}{getCountryName() || provider?.country_name || provider?.country || 'N/A'}</span>
              </div>
            </div>
            {/* Protocol as static feature row */}
            <div className='feature-row'>
              <div className='feature-icons'><Shield size={14} color='#f97316' /></div>
              <div className='feature-content'>
                <span className='feature-label'>Hỗ trợ:</span>
                <span className='feature-value'>{protocolList.map(p => p.toUpperCase()).join('/')}</span>
              </div>
            </div>
            {provider?.auth_type && (
              <div className='feature-row'>
                <div className='feature-icons'><Shield size={14} color='#e67e22' /></div>
                <div className='feature-content'>
                  <span className='feature-label'>Xác thực:</span>
                  <span className='feature-value'>
                    {convertAuthType(provider.auth_type)}
                    {(provider.auth_type === 'userpass' || provider.auth_type === 'both') && (
                      <span style={{ fontSize: '10.5px', fontWeight: 500, color: provider.metadata?.allow_custom_auth ? '#2563eb' : '#16a34a', marginLeft: 4 }}>
                        ({provider.metadata?.allow_custom_auth ? 'Tự nhập' : 'Random'})
                      </span>
                    )}
                  </span>
                </div>
              </div>
            )}
            {provider?.bandwidth && (
              <div className='feature-row'>
                <div className='feature-icons'><Wifi size={14} color='#3b82f6' /></div>
                <div className='feature-content'>
                  <span className='feature-label'>Băng thông:</span>
                  <span className='feature-value'>{provider.bandwidth === 'unlimited' ? 'Không giới hạn' : provider.bandwidth}</span>
                </div>
              </div>
            )}
            {provider?.request_limit && (
              <div className='feature-row'>
                <div className='feature-icons'><Zap size={14} color='#22c55e' /></div>
                <div className='feature-content'>
                  <span className='feature-label'>Giới hạn request:</span>
                  <span className='feature-value'>{provider.request_limit}</span>
                </div>
              </div>
            )}
            {provider?.concurrent_connections && (
              <div className='feature-row'>
                <div className='feature-icons'><Users size={14} color='#ef4444' /></div>
                <div className='feature-content'>
                  <span className='feature-label'>Kết nối đồng thời:</span>
                  <span className='feature-value'>{provider.concurrent_connections}</span>
                </div>
              </div>
            )}
            {/* Custom fields — hiển thị options cho user biết */}
            {provider?.metadata?.custom_fields?.map((field: any) => (
              <div className='feature-row' key={field.key || field.param}>
                <div className='feature-icons'><Zap size={14} color='#8b5cf6' /></div>
                <div className='feature-content'>
                  <span className='feature-label'>{field.label}:</span>
                  <span className='feature-value'>
                    {field.type === 'text' || field.type === 'number'
                      ? (field.default || 'Tự nhập')
                      : field.options?.map((o: any) => o.label).join(', ')}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer: giá (trái) + button (phải) — cùng 1 hàng */}
        <div className='card-footer'>
          <div>
            <div className='price-amount'>
              {(priceOptions.length > 1 || isPerUnit) && <span style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', marginRight: '2px' }}>từ </span>}
              {headerPrice.toLocaleString('vi-VN')}đ{headerPriceSuffix}
            </div>
            {maxDiscount > 0 && (
              <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#22c55e', marginTop: 1 }}>
                Tiết kiệm đến {maxDiscount}%
              </div>
            )}
          </div>
          {isAvailable ? (
            <button type='button' className='buy-button' onClick={handleBuy} style={{ padding: '8px 18px' }}>
              <ShoppingCart size={14} className='mr-1' />
              Mua ngay
            </button>
          ) : (
            <div style={{ padding: '8px 14px', borderRadius: '8px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>
              Tạm ngừng
            </div>
          )}
        </div>
      </div>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        productName={provider?.name ?? provider?.code}
        productType='static'
        serviceTypeId={provider.id}
        priceOptions={priceOptions}
        protocols={protocolList}
        ipVersion={provider.ip_version}
        proxyType={provider.proxy_type}
        country={provider.country || provider.country_name || provider.country_code}
        authType={provider.auth_type || null}
        pricingMode={provider.pricing_mode || 'fixed'}
        timeUnit={provider.time_unit || 'day'}
        pricePerUnit={provider.price_per_unit || 0}
        allowCustomAuth={!!provider.metadata?.allow_custom_auth}
        discountTiers={provider.metadata?.discount_tiers || []}
        quantityTiers={provider.metadata?.quantity_tiers || []}
        customFields={provider.metadata?.custom_fields || undefined}
      />
    </>
  )
}

export default ProxyCard
