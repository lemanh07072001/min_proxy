'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useNavigationPending, setNavigationPending } from '@/lib/navigationState'

function NavigationSkeleton() {
  return (
    <div style={{ padding: '16px' }}>
      {/* Skeleton header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'var(--mui-palette-action-hover, #e2e8f0)',
            animation: 'skeletonPulse 1.5s ease-in-out infinite'
          }}
        />
        <div
          style={{
            width: '180px',
            height: '22px',
            borderRadius: '6px',
            background: 'var(--mui-palette-action-hover, #e2e8f0)',
            animation: 'skeletonPulse 1.5s ease-in-out infinite'
          }}
        />
      </div>

      {/* Skeleton content block */}
      <div
        style={{
          borderRadius: '12px',
          border: '1px solid var(--border-color, #e2e8f0)',
          padding: '20px',
          marginBottom: '16px',
          animation: 'skeletonPulse 1.5s ease-in-out infinite'
        }}
      >
        {[280, 220, 320, 180].map((w, i) => (
          <div
            key={i}
            style={{
              width: `${w}px`,
              maxWidth: '100%',
              height: '16px',
              borderRadius: '4px',
              background: 'var(--mui-palette-action-hover, #e2e8f0)',
              marginBottom: i < 3 ? '12px' : 0
            }}
          />
        ))}
      </div>

      {/* Skeleton table */}
      <div
        style={{
          borderRadius: '12px',
          border: '1px solid var(--border-color, #e2e8f0)',
          overflow: 'hidden'
        }}
      >
        {Array.from({ length: 5 }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            style={{
              display: 'flex',
              gap: '12px',
              padding: '14px 16px',
              borderBottom: rowIdx < 4 ? '1px solid var(--border-color, #f1f5f9)' : 'none',
              background: rowIdx === 0 ? 'var(--mui-palette-background-default, #f8fafc)' : 'transparent',
              animation: 'skeletonPulse 1.5s ease-in-out infinite',
              animationDelay: `${rowIdx * 0.1}s`,
              opacity: 1 - rowIdx * 0.1
            }}
          >
            {[60, 120, 180, 100, 140].map((w, colIdx) => (
              <div
                key={colIdx}
                style={{
                  width: `${w}px`,
                  height: rowIdx === 0 ? '14px' : '16px',
                  borderRadius: '4px',
                  background: rowIdx === 0
                    ? 'var(--mui-palette-action-selected, #cbd5e1)'
                    : 'var(--mui-palette-action-hover, #e2e8f0)',
                  flexShrink: 0
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const isPending = useNavigationPending()
  const pathname = usePathname()

  // Khi pathname thay đổi → navigation hoàn tất → tắt pending
  useEffect(() => {
    setNavigationPending(false)
  }, [pathname])

  // display:none thay vì conditional rendering
  // → page cũ KHÔNG bị unmount (tránh heavy synchronous teardown)
  // → skeleton hiển thị ngay, user vẫn tương tác được
  return (
    <>
      <div style={isPending ? { display: 'none' } : undefined}>
        {children}
      </div>
      {isPending && <NavigationSkeleton />}
    </>
  )
}
