export default function HomeLoading() {
  return (
    <div style={{ padding: '16px', display: 'flex', gap: '20px' }}>
      {/* Feed area */}
      <div style={{ flex: 1 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            style={{
              borderRadius: '12px',
              border: '1px solid var(--border-color, #e2e8f0)',
              padding: '20px',
              marginBottom: '16px',
              animation: 'skeletonPulse 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--mui-palette-action-hover, #e2e8f0)' }} />
              <div>
                <div style={{ width: 120, height: 14, borderRadius: 4, background: 'var(--mui-palette-action-hover, #e2e8f0)', marginBottom: 6 }} />
                <div style={{ width: 80, height: 10, borderRadius: 4, background: 'var(--mui-palette-action-hover, #e2e8f0)' }} />
              </div>
            </div>
            <div style={{ width: '90%', height: 14, borderRadius: 4, background: 'var(--mui-palette-action-hover, #e2e8f0)', marginBottom: 8 }} />
            <div style={{ width: '70%', height: 14, borderRadius: 4, background: 'var(--mui-palette-action-hover, #e2e8f0)', marginBottom: 8 }} />
            <div style={{ width: '50%', height: 14, borderRadius: 4, background: 'var(--mui-palette-action-hover, #e2e8f0)' }} />
          </div>
        ))}
      </div>

      {/* Sidebar skeleton */}
      <div style={{ width: 280, flexShrink: 0 }}>
        <div
          style={{
            borderRadius: '12px',
            border: '1px solid var(--border-color, #e2e8f0)',
            padding: '16px',
            animation: 'skeletonPulse 1.5s ease-in-out infinite'
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ width: '100%', height: 40, borderRadius: 8, background: 'var(--mui-palette-action-hover, #e2e8f0)', marginBottom: i < 3 ? 10 : 0 }} />
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
