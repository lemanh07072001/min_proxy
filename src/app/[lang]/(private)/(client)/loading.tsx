export default function Loading() {
  const cellWidths = [50, 80, 150, 100, 100, 100, 200, 140, 130]

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

      {/* Skeleton filter bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '12px 16px',
          marginBottom: '4px',
          borderRadius: '8px 8px 0 0',
          background: 'var(--mui-palette-background-default, #f8fafc)',
          border: '1px solid var(--border-color, #e2e8f0)',
          animation: 'skeletonPulse 1.5s ease-in-out infinite'
        }}
      >
        {[200, 140, 120, 180, 110].map((w, i) => (
          <div
            key={i}
            style={{
              width: `${w}px`,
              height: '38px',
              borderRadius: '8px',
              background: 'var(--mui-palette-action-hover, #e2e8f0)'
            }}
          />
        ))}
      </div>

      {/* Skeleton table */}
      <div
        style={{
          border: '1px solid var(--border-color, #e2e8f0)',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          overflow: 'hidden'
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            padding: '12px 16px',
            background: 'var(--mui-palette-background-default, #f8fafc)',
            borderBottom: '1px solid var(--border-color, #e2e8f0)',
            animation: 'skeletonPulse 1.5s ease-in-out infinite'
          }}
        >
          {cellWidths.map((w, i) => (
            <div
              key={i}
              style={{
                width: `${w}px`,
                height: '14px',
                borderRadius: '4px',
                background: 'var(--mui-palette-action-selected, #cbd5e1)',
                flexShrink: 0
              }}
            />
          ))}
        </div>

        {/* Table rows - animate per row, not per cell */}
        {Array.from({ length: 5 }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            style={{
              display: 'flex',
              gap: '12px',
              padding: '14px 16px',
              borderBottom: rowIdx < 4 ? '1px solid var(--border-color, #f1f5f9)' : 'none',
              animation: 'skeletonPulse 1.5s ease-in-out infinite',
              animationDelay: `${rowIdx * 0.1}s`,
              opacity: 1 - rowIdx * 0.1
            }}
          >
            {cellWidths.map((w, colIdx) => (
              <div
                key={colIdx}
                style={{
                  width: `${w}px`,
                  height: '16px',
                  borderRadius: '4px',
                  background: 'var(--mui-palette-action-hover, #e2e8f0)',
                  flexShrink: 0
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Skeleton footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          marginTop: '4px',
          animation: 'skeletonPulse 1.5s ease-in-out infinite'
        }}
      >
        <div
          style={{
            width: '200px',
            height: '14px',
            borderRadius: '4px',
            background: 'var(--mui-palette-action-hover, #e2e8f0)'
          }}
        />
        <div
          style={{
            width: '160px',
            height: '32px',
            borderRadius: '6px',
            background: 'var(--mui-palette-action-hover, #e2e8f0)'
          }}
        />
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
