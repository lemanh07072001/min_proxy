export default function CheckProxyLoading() {
  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
        {/* Form skeleton */}
        <div
          style={{
            borderRadius: '12px',
            border: '1px solid var(--border-color, #e2e8f0)',
            padding: '20px',
            animation: 'skeletonPulse 1.5s ease-in-out infinite'
          }}
        >
          <div style={{ width: 140, height: 18, borderRadius: 4, background: 'var(--mui-palette-action-hover, #e2e8f0)', marginBottom: 16 }} />
          <div style={{ width: '100%', height: 120, borderRadius: 8, background: 'var(--mui-palette-action-hover, #e2e8f0)', marginBottom: 12 }} />
          <div style={{ width: '100%', height: 40, borderRadius: 8, background: 'var(--mui-palette-action-hover, #e2e8f0)', marginBottom: 12 }} />
          <div style={{ width: '100%', height: 42, borderRadius: 8, background: 'var(--mui-palette-action-selected, #cbd5e1)' }} />
        </div>

        {/* Table skeleton */}
        <div
          style={{
            borderRadius: '12px',
            border: '1px solid var(--border-color, #e2e8f0)',
            overflow: 'hidden'
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '14px 16px',
                borderBottom: i < 5 ? '1px solid var(--border-color, #f1f5f9)' : 'none',
                background: i === 0 ? 'var(--mui-palette-background-default, #f8fafc)' : 'transparent',
                animation: 'skeletonPulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`
              }}
            >
              {[60, 160, 80, 80, 100].map((w, j) => (
                <div key={j} style={{ width: w, height: i === 0 ? 14 : 16, borderRadius: 4, background: i === 0 ? 'var(--mui-palette-action-selected, #cbd5e1)' : 'var(--mui-palette-action-hover, #e2e8f0)', flexShrink: 0 }} />
              ))}
            </div>
          ))}
        </div>
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
