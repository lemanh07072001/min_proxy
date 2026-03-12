'use client'

import { useEffect, useRef, useState } from 'react'

import { usePathname } from 'next/navigation'

import { useNavigationPending } from '@/lib/navigationState'

export default function NavigationProgress() {
  const pathname = usePathname()
  const isPending = useNavigationPending()
  const [phase, setPhase] = useState<'idle' | 'loading' | 'finishing'>('idle')
  const prevPathRef = useRef(pathname)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Khi navigationPending = true → bắt đầu loading (từ VerticalMenu click)
  useEffect(() => {
    if (isPending && phase === 'idle') {
      setPhase('loading')
    }
  }, [isPending, phase])

  // Khi pathname thay đổi → navigation hoàn tất → finishing animation
  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname
      setPhase('finishing')
      timeoutRef.current = setTimeout(() => setPhase('idle'), 150)
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
          background: 'linear-gradient(90deg, #FC4336, #FF6B35, #FC4336)',
          backgroundSize: '200% 100%',
          width: phase === 'finishing' ? '100%' : undefined,
          animation:
            phase === 'loading'
              ? 'navGrow 4s cubic-bezier(0.1, 0.5, 0.3, 1) forwards, navShimmer 1.5s linear infinite'
              : 'none',
          transition: phase === 'finishing' ? 'width 0.2s ease' : undefined,
          boxShadow: '0 0 10px rgba(252, 67, 54, 0.5)'
        }}
      />
      <style>{`
        @keyframes navGrow {
          0% { width: 0; }
          10% { width: 30%; }
          30% { width: 55%; }
          60% { width: 75%; }
          80% { width: 85%; }
          100% { width: 92%; }
        }
        @keyframes navShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}
