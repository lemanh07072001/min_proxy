'use client'

import { useState } from 'react'

import { X, MessageCircle, ExternalLink } from 'lucide-react'

import { useSidebarSettings } from '@/hooks/apis/useSidebarSettings'
import { SOCIAL_ICON_MAP } from '@/components/icons/SocialIcons'

import './FloatingContact.css'

export default function FloatingContact() {
  const [hidden, setHidden] = useState(false)
  const { data } = useSidebarSettings()
  const links = data?.support_links ?? []

  if (links.length === 0) return null

  return (
    <div className='floating-contact'>
      {/* Links — mặc định hiện, click trigger để ẩn */}
      <div className={`floating-links ${hidden ? '' : 'open'}`}>
        {links.map((link, i) => {
          const SvgIcon = SOCIAL_ICON_MAP[link.icon]

          return (
            <a
              key={i}
              href={link.url}
              target='_blank'
              rel='noopener noreferrer'
              className='floating-link-item'
              title={link.label}
              style={{ transitionDelay: hidden ? '0ms' : `${(links.length - 1 - i) * 60}ms` }}
            >
              {SvgIcon ? <SvgIcon size={34} /> : (
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: link.color || '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ExternalLink size={16} color='#fff' />
                </div>
              )}
            </a>
          )
        })}
      </div>

      {/* Trigger — click để ẩn/hiện */}
      <button
        className={`floating-trigger ${hidden ? '' : 'open'}`}
        onClick={() => setHidden(v => !v)}
        aria-label={hidden ? 'Hiện liên hệ' : 'Ẩn liên hệ'}
      >
        {hidden ? <MessageCircle size={22} /> : <X size={20} />}
      </button>
    </div>
  )
}
