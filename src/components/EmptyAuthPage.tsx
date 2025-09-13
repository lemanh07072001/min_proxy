'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface EmptyAuthPageProps {
  lang: string
}

const EmptyAuthPage = ({ lang }: EmptyAuthPageProps) => {
  const router = useRouter()
  const pathname = usePathname()

  // Tạo một content area cho việc hiển thị trong layout
  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)', // Trừ đi space cho navbar/footer
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      color: '#64748b',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: '12px',
      margin: '20px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        maxWidth: '500px'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '1rem',
          opacity: 0.3
        }}>
          🔒
        </div>
        
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '1rem',
          color: '#475569'
        }}>
          Yêu cầu đăng nhập
        </h1>
        
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          marginBottom: '2rem',
          opacity: 0.8
        }}>
          Bạn cần đăng nhập để truy cập trang này.
        </p>

        {/*<button*/}
        {/*  onClick={() => router.push(`/${lang}`)}*/}
        {/*  style={{*/}
        {/*    background: 'var(--primary-gradient)',*/}
        {/*    color: 'white',*/}
        {/*    border: 'none',*/}
        {/*    padding: '12px 24px',*/}
        {/*    borderRadius: '8px',*/}
        {/*    fontSize: '1rem',*/}
        {/*    fontWeight: '500',*/}
        {/*    cursor: 'pointer',*/}
        {/*    transition: 'all 0.3s ease',*/}
        {/*    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'*/}
        {/*  }}*/}

        {/*>*/}
        {/*  Đến trang đăng nhập*/}
        {/*</button>*/}


      </div>
    </div>
  )
}

export default EmptyAuthPage
