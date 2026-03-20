'use client'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { X, MessageCircle, ExternalLink } from 'lucide-react'

import useAxiosAuth from '@/hocs/useAxiosAuth'
import { SOCIAL_ICON_MAP } from '@/components/icons/SocialIcons'

import './FloatingContact.css'

export default function FloatingContact() {
  const [hidden, setHidden] = useState(false)
  const axiosAuth = useAxiosAuth()

  const { data: links = [] } = useQuery({
    queryKey: ['floating-contact-links'],
    queryFn: async () => {
      try {
        const res = await axiosAuth.get('/get-sidebar-settings')

        return res?.data?.data?.support_links ?? []
      } catch {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
          const res = await fetch(`${apiUrl}/get-sidebar-settings`)
          const json = await res.json()

          return json?.data?.support_links ?? []
        } catch {
          return []
        }
      }
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  if (links.length === 0) return null

  return (
    <div className='floating-contact'>
      <div className={`floating-links ${hidden ? '' : 'open'}`}>
        {links.map((link: any, i: number) => {
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
