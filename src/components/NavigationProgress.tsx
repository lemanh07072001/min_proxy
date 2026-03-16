'use client'

import { useEffect, useRef, useState } from 'react'

import { usePathname } from 'next/navigation'

/**
 * Top loading bar — hiển thị khi pathname thay đổi (navigation).
 * Không dùng custom pending state — detect bằng pathname diff.
 */
export default function NavigationProgress() {
  const pathname = usePathname()
  const [phase, setPhase] = useState<'idle' | 'loading' | 'finishing'>('idle')
  const prevPathRef = useRef(pathname)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname

      // Nếu đang idle → flash finishing ngay (navigation đã xong)
      // Nếu đang loading → chuyển sang finishing
      setPhase('finishing')
      timeoutRef.current = setTimeout(() => setPhase('idle'), 200)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [pathname])

  if (phase === 'idle') return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 99999,
        overflow: 'hidden',
        opacity: phase === 'finishing' ? 0 : 1,
        transition: 'opacity 0.3s ease'
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          background: 'var(--primary-gradient, linear-gradient(90deg, #FC4336, #FF6B35, #FC4336))',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.15)'
        }}
      />
    </div>
  )
}
