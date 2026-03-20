'use client'

import { useState } from 'react'

import { MessageCircle, X, ExternalLink } from 'lucide-react'

import { useSidebarSettings } from '@/hooks/apis/useSidebarSettings'
import { SOCIAL_ICON_MAP } from '@/components/icons/SocialIcons'

import './FloatingContact.css'

export default function FloatingContact() {
  const [open, setOpen] = useState(false)
  const { data } = useSidebarSettings()
  const links = data?.support_links ?? []

  if (links.length === 0) return null

  return (
    <div className='floating-contact'>
      {/* Expanded: danh sách icon */}
      <div className={`floating-links ${open ? 'open' : ''}`}>
        {links.map((link, i) => {
          const SvgIcon = SOCIAL_ICON_MAP[link.icon]
          const FallbackIcon = ExternalLink

          return (
            <a
              key={i}
              href={link.url}
              target='_blank'
              rel='noopener noreferrer'
              className='floating-link-item'
              title={link.label}
              style={{ transitionDelay: open ? `${i * 50}ms` : '0ms' }}
            >
              {SvgIcon ? <SvgIcon size={32} /> : (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: link.color || '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FallbackIcon size={16} color='#fff' />
                </div>
              )}
            </a>
          )
        })}
      </div>

      {/* Trigger button */}
      <button
        className={`floating-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-label='Liên hệ hỗ trợ'
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}
