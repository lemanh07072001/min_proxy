'use client'

import { useSession } from 'next-auth/react'
import type { Session } from 'next-auth'

// ===============================================
// DEMO: So sánh flicker giữa client-side vs server-side
// ===============================================

interface ComparisonProps {
  serverSession: Session | null // Từ getServerSession
}

export default function FlickerComparison({ serverSession }: ComparisonProps) {
  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      {/* Client-side - Có flicker */}
      <div style={{ 
        flex: 1, 
        border: '2px solid #dc2626', 
        borderRadius: '8px', 
        padding: '16px',
        background: '#fef2f2'
      }}>
        <h3 style={{ color: '#dc2626' }}>❌ Client-side (có flicker)</h3>
        <ClientSideExample />
      </div>

      {/* Server-side - Không flicker */}
      <div style={{ 
        flex: 1, 
        border: '2px solid #16a34a', 
        borderRadius: '8px', 
        padding: '16px',
        background: '#f0fdf4'
      }}>
        <h3 style={{ color: '#16a34a' }}>✅ Server-side (không flicker)</h3>
        <ServerSideExample session={serverSession} />
      </div>
    </div>
  )
}

// ===============================================
// CLIENT-SIDE: Sẽ có flicker effect
// ===============================================
function ClientSideExample() {
  const { data: session, status } = useSession()

  // 🔴 FLICKER SEQUENCE:
  // 1. First render: status = "loading", session = undefined
  // 2. API call to /api/auth/session
  // 3. Second render: status = "authenticated", session = data
  
  console.log('Client render - Status:', status, 'Session:', !!session)

  if (status === 'loading') {
    return (
      <div style={{ 
        padding: '20px', 
        background: '#fbbf24', 
        borderRadius: '4px',
        color: '#92400e'
      }}>
        🔄 Loading session... (Flicker phase 1)
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div style={{ 
        padding: '20px', 
        background: '#f87171', 
        borderRadius: '4px',
        color: '#7f1d1d'
      }}>
        🔐 Not authenticated (Flicker phase 2)
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '20px', 
      background: '#86efac', 
      borderRadius: '4px',
      color: '#14532d'
    }}>
      ✅ Hello {session?.user?.name || 'User'}! (Flicker phase 3)
      <br />
      <small>Render count: {Math.random().toFixed(3)}</small>
    </div>
  )
}

// ===============================================
// SERVER-SIDE: Không có flicker
// ===============================================
interface ServerSideExampleProps {
  session: Session | null
}

function ServerSideExample({ session }: ServerSideExampleProps) {
  // ✅ NO FLICKER:
  // - Session đã có sẵn từ server
  // - Component chỉ render 1 lần duy nhất
  // - Không có loading state
  
  console.log('Server render - Session:', !!session)

  if (!session) {
    return (
      <div style={{ 
        padding: '20px', 
        background: '#86efac', 
        borderRadius: '4px',
        color: '#14532d'
      }}>
        🔐 Not authenticated (Immediate, no flicker)
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '20px', 
      background: '#86efac', 
      borderRadius: '4px',
      color: '#14532d'
    }}>
      ✅ Hello {session.user?.name || 'User'}! (Immediate, no flicker)
      <br />
      <small>Single render: {Math.random().toFixed(3)}</small>
    </div>
  )
}

// ===============================================
// USAGE EXAMPLE trong layout hoặc page
// ===============================================

// File: app/comparison/page.tsx
/*
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/libs/auth'
import FlickerComparison from '@/components/examples/FlickerComparison'

export default async function ComparisonPage() {
  const session = await getServerSession(authOptions)

  return (
    <div>
      <h1>Flicker Comparison Demo</h1>
      <p>Mở DevTools Console để xem render behavior</p>
      
      <FlickerComparison serverSession={session} />
      
      <div style={{ marginTop: '20px', padding: '16px', background: '#f3f4f6' }}>
        <h3>Key Differences:</h3>
        <ul>
          <li><strong>Client-side:</strong> Multiple renders, API call, loading state flicker</li>
          <li><strong>Server-side:</strong> Single render, immediate data, no flicker</li>
        </ul>
      </div>
    </div>
  )
}
*/
