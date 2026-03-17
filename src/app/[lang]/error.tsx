'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[App Error]', error)
  }, [error])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>!</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Đã xảy ra lỗi</h2>
      <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24, maxWidth: 400 }}>
        Trang gặp sự cố. Vui lòng thử lại hoặc quay về trang chủ.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={reset}
          style={{ padding: '10px 24px', fontSize: 14, fontWeight: 600, color: '#fff', background: 'var(--primary-hover, #e63946)', border: 'none', borderRadius: 8, cursor: 'pointer' }}
        >
          Thử lại
        </button>
        <a
          href='/'
          style={{ padding: '10px 24px', fontSize: 14, fontWeight: 600, color: '#475569', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, textDecoration: 'none' }}
        >
          Trang chủ
        </a>
      </div>
    </div>
  )
}
