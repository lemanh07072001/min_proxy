'use client'

import React, { useState, useMemo } from 'react'

import '@/app/[lang]/(private)/(client)/components/proxy-card/styles.css'

import { MapPin, ShoppingCart, User, Shield, Wifi, Zap, Users } from 'lucide-react'

import { useSession } from 'next-auth/react'

import CheckoutModal from '@/components/checkout-modal/CheckoutModal'
import type { PriceOption } from '@/components/checkout-modal/CheckoutModal'
import { getTagStyle, shouldHideByTag, fixCountryCode } from '@/configs/tagConfig'
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

  // Giá hiển thị ở header (giá thấp nhất)
  const headerPrice = priceOptions[0]?.price || parseInt(provider?.price, 10) || 0

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
        {/* Tag badge — trên viền card */}
        {visibleTags.length > 0 && (
          <div style={{ position: 'absolute', top: '-12px', right: '14px', zIndex: 2, display: 'flex', gap: '6px' }}>
            {visibleTags.map((tag: string, i: number) => {
              const tagDef = getTagStyle(tag)

              
return <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 14px', fontSize: '11.5px', fontWeight: 700, borderRadius: '20px', background: `linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%), ${tagDef.gradient || tagDef.bgColor}`, color: tagDef.textColor, boxShadow: `0 2px 10px ${tagDef.borderColor}55, inset 0 1px 0 rgba(255,255,255,0.2)`, border: '1px solid rgba(255,255,255,0.25)', letterSpacing: '0.3px', lineHeight: 1.2 }}>{tagDef.icon && <span style={{ fontSize: '12px' }}>{tagDef.icon}</span>}{tag.trim()}</span>
            })}
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header: title + price */}
          <div className='card-header-column'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className='provider-title-column'>{provider?.name ?? provider?.code} <span style={{ fontSize: '11px', fontWeight: 500, color: '#94a3b8' }}>#{provider?.id}</span></h3>
              <div className='price-amount'>{priceOptions.length > 1 && <span style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', marginRight: '2px' }}>từ</span>}{headerPrice.toLocaleString('vi-VN')}đ</div>
            </div>
          </div>

          {/* Note preview (mô tả ngắn) */}
          {provider?.note && provider.note !== '<p></p>' && (() => {
            const text = provider.note.replace(/<[^>]+>/g, '').trim()

            if (!text) return null
            const preview = text.length > 80 ? text.substring(0, 80) + '...' : text

            
return <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px', lineHeight: 1.4 }}>{preview}</p>
          })()}

          {/* Product info as feature rows */}
          <div style={{ marginBottom: '8px' }}>
            <div className='feature-row'>
              <div className='feature-icons'><MapPin size={16} color='#6366f1' /></div>
              <div className='feature-content'>
                <span className='feature-label'>Loại IP:</span>
                <span className='feature-value' style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Static {convertIpVersion(provider.ip_version)} — {(provider?.country || provider?.country_code) && <img src={`https://flagcdn.com/w40/${fixCountryCode(provider.country || provider.country_code)}.png`} alt='' style={{ width: 18, height: 13, objectFit: 'cover', borderRadius: 2 }} />}{getCountryName() || provider?.country_name || provider?.country || 'N/A'}</span>
              </div>
            </div>
            {/* Protocol as static feature row */}
            <div className='feature-row'>
              <div className='feature-icons'><Shield size={16} color='#f97316' /></div>
              <div className='feature-content'>
                <span className='feature-label'>Hỗ trợ:</span>
                <span className='feature-value'>{protocolList.map(p => p.toUpperCase()).join('/')}</span>
              </div>
            </div>
            {provider?.auth_type && (
              <div className='feature-row'>
                <div className='feature-icons'><Shield size={16} color='#e67e22' /></div>
                <div className='feature-content'>
                  <span className='feature-label'>Xác thực:</span>
                  <span className='feature-value'>{convertAuthType(provider.auth_type)}</span>
                </div>
              </div>
            )}
            {provider?.bandwidth && (
              <div className='feature-row'>
                <div className='feature-icons'><Wifi size={16} color='#3b82f6' /></div>
                <div className='feature-content'>
                  <span className='feature-label'>Băng thông:</span>
                  <span className='feature-value'>{provider.bandwidth === 'unlimited' ? 'Không giới hạn' : provider.bandwidth}</span>
                </div>
              </div>
            )}
            {provider?.request_limit && (
              <div className='feature-row'>
                <div className='feature-icons'><Zap size={16} color='#22c55e' /></div>
                <div className='feature-content'>
                  <span className='feature-label'>Giới hạn request:</span>
                  <span className='feature-value'>{provider.request_limit}</span>
                </div>
              </div>
            )}
            {provider?.concurrent_connections && (
              <div className='feature-row'>
                <div className='feature-icons'><Users size={16} color='#ef4444' /></div>
                <div className='feature-content'>
                  <span className='feature-label'>Kết nối đồng thời:</span>
                  <span className='feature-value'>{provider.concurrent_connections}</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer: Nút mua */}
        <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
          {isAvailable ? (
            <button type='button' className='buy-button' onClick={handleBuy}>
              <ShoppingCart size={16} className='mr-2' />
              Mua Proxy
            </button>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: 600
              }}
            >
              Tạm ngừng bán
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
      />
    </>
  )
}

export default ProxyCard
