'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * Section collapsible — lazy render nội dung khi mở lần đầu.
 * Giúp giảm số MUI components render cùng lúc khi mount form lớn.
 */
export default function CollapsibleSection({ title, icon: Icon, iconColor, iconBg, defaultOpen = false, children, border }: {
  title: string; icon: any; iconColor: string; iconBg: string
  defaultOpen?: boolean; children: React.ReactNode; border?: string
}) {
  const [open, setOpen] = useState(defaultOpen)
  const [rendered, setRendered] = useState(defaultOpen)

  const handleToggle = () => {
    if (!rendered) setRendered(true)
    setOpen(prev => !prev)
  }

  return (
    <div style={{ background: border ? undefined : '#fafbfc', borderRadius: '10px', padding: open ? '14px 16px' : '10px 16px', marginBottom: '14px', border: border || '1px solid #f1f5f9', transition: 'padding 0.15s' }}>
      <div
        onClick={handleToggle}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}
      >
        <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={13} color={iconColor} />
        </div>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', flex: 1 }}>{title}</span>
        <ChevronDown size={16} color='#94a3b8' style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </div>
      {rendered && (
        <div style={{ display: open ? 'block' : 'none', marginTop: 12 }}>
          {children}
        </div>
      )}
    </div>
  )
}
