/* eslint-disable import/order */
// ===============================================
// PATTERN TỐT NHẤT: Server-side Session để tránh flicker
// ===============================================

import { getServerSession } from 'next-auth/next'

import type { Session } from 'next-auth'

import { authOptions } from '@/libs/auth'

// ===============================================
// 1. SERVER COMPONENT - Lấy session và pass xuống
// ===============================================
export default async function ParentServerComponent() {
  const session = await getServerSession(authOptions)

  return (
    <div>
      <h2>Parent Server Component</h2>
      
      {/* Pass session xuống client component */}
      <ClientComponentWithSession session={session} />
      
      {/* Hoặc conditional render ngay ở server */}
      {session ? (
        <AuthenticatedContent session={session} />
      ) : (
        <UnauthenticatedContent />
      )}
    </div>
  )
}

// ===============================================
// 2. CLIENT COMPONENT - Nhận session từ props
// ===============================================
'use client'

interface ClientComponentProps {
  session: Session | null
}

function ClientComponentWithSession({ session }: ClientComponentProps) {
  // ✅ KHÔNG có flicker vì session đã có sẵn từ server
  // ✅ Component render 1 lần duy nhất với data đúng
  
  if (!session) {
    return (
      <div className="alert alert-warning">
        <p>Bạn chưa đăng nhập</p>
        <button onClick={() => window.location.href = '/login'}>
          Đăng nhập
        </button>
      </div>
    )
  }

  return (
    <div className="user-info">
      <h3>Thông tin User (Server-side, no flicker)</h3>
      <p><strong>Name:</strong> {session.user?.name}</p>
      <p><strong>Email:</strong> {session.user?.email}</p>
      <p><strong>Access Token:</strong> {session.accessToken ? 'Available' : 'Not available'}</p>
    </div>
  )
}

// ===============================================
// 3. SERVER COMPONENT cho nội dung authenticated
// ===============================================
interface AuthenticatedContentProps {
  session: Session
}

function AuthenticatedContent({ session }: AuthenticatedContentProps) {
  return (
    <div style={{ 
      padding: '20px', 
      background: '#dcfce7', 
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h3>🎉 Welcome back, {session.user?.name || session.user?.email}!</h3>
      <p>Last login: {new Date().toLocaleString()}</p>
      
      {/* Có thể render thêm data dựa trên session */}
      <UserDashboard userId={session.user?.id} />
    </div>
  )
}

function UnauthenticatedContent() {
  return (
    <div style={{ 
      padding: '20px', 
      background: '#fee2e2', 
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h3>🔒 Access Restricted</h3>
      <p>Please log in to access this content.</p>
    </div>
  )
}

// ===============================================
// 4. LAYOUT PATTERN với session
// ===============================================
export async function LayoutWithSession({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const session = await getServerSession(authOptions)

  return (
    <div className="layout">
      {/* Header với session - NO FLICKER */}
      <HeaderWithSession session={session} />
      
      {/* Sidebar với session - NO FLICKER */}
      <SidebarWithSession session={session} />
      
      {/* Main content */}
      <main className="main-content">
        {children}
      </main>
      
      {/* Footer */}
      <footer>Footer</footer>
    </div>
  )
}

// ===============================================
// 5. HEADER COMPONENT nhận session từ props
// ===============================================
'use client'

interface HeaderProps {
  session: Session | null
}

function HeaderWithSession({ session }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-left">
        <h1>My App</h1>
      </div>
      
      <div className="header-right">
        {session ? (
          <div className="user-menu">
            <span>Xin chào, {session.user?.name || 'User'}</span>
            <button onClick={() => signOut()}>Đăng xuất</button>
          </div>
        ) : (
          <button onClick={() => signIn()}>Đăng nhập</button>
        )}
      </div>
    </header>
  )
}

// ===============================================
// 6. SIDEBAR COMPONENT với session
// ===============================================
interface SidebarProps {
  session: Session | null
}

function SidebarWithSession({ session }: SidebarProps) {
  const menuItems = session ? [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Profile', href: '/profile' },
    { label: 'Settings', href: '/settings' },
  ] : [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
  ]

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {menuItems.map(item => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      
      {session && (
        <div className="user-info">
          <img 
            src={session.user?.image || '/default-avatar.png'} 
            alt="Avatar" 
            width={40} 
            height={40}
          />
          <p>{session.user?.email}</p>
        </div>
      )}
    </aside>
  )
}

// ===============================================
// 7. COMPONENT cần user ID từ session
// ===============================================
interface UserDashboardProps {
  userId?: string
}

async function UserDashboard({ userId }: UserDashboardProps) {
  if (!userId) {
    return <div>No user ID available</div>
  }

  // Có thể fetch thêm data dựa trên userId
  // const userData = await fetchUserData(userId)

  return (
    <div className="dashboard">
      <h4>Dashboard for User ID: {userId}</h4>
      <p>Here you can display user-specific data...</p>
    </div>
  )
}

// ===============================================
// 8. PATTERN cho API calls với session
// ===============================================

// File: app/api/user-data/route.ts
/*
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/libs/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Sử dụng session data để fetch user-specific data
  const userData = await fetchUserSpecificData(session.user?.id)

  return NextResponse.json({
    user: session.user,
    data: userData,
    accessToken: session.accessToken
  })
}
*/

// ===============================================
// 9. HOOK cho client-side session (khi cần thiết)
// ===============================================
'use client'

import { useSession } from 'next-auth/react'

// Chỉ dùng khi THỰC SỰ cần reactive session changes
export function useClientSession() {
  const { data: session, status, update } = useSession()

  return {
    session,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    updateSession: update // Để refresh session khi cần
  }
}

// ===============================================
// 10. COMPONENT cần reactive session (rare cases)
// ===============================================
export function ReactiveSessionComponent() {
  const { session, isLoading, updateSession } = useClientSession()

  // Chỉ dùng pattern này khi:
  // - Cần real-time session updates
  // - Session có thể thay đổi trong quá trình sử dụng app
  // - Component cần re-render khi session thay đổi

  if (isLoading) {
    return <div>Loading session...</div> // Sẽ có flicker
  }

  return (
    <div>
      <p>Reactive session: {session?.user?.name}</p>
      <button onClick={() => updateSession()}>
        Refresh Session
      </button>
    </div>
  )
}
