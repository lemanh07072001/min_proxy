'use client'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>!</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Đã xảy ra lỗi hệ thống</h2>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24, maxWidth: 400 }}>
          Vui lòng tải lại trang. Nếu lỗi tiếp tục, hãy liên hệ hỗ trợ.
        </p>
        <button
          onClick={reset}
          style={{ padding: '10px 24px', fontSize: 14, fontWeight: 600, color: '#fff', background: '#e63946', border: 'none', borderRadius: 8, cursor: 'pointer' }}
        >
          Tải lại trang
        </button>
      </body>
    </html>
  )
}
