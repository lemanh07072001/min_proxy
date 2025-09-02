'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect } from 'react'

// ===============================================
// 1. CLIENT-SIDE: Sử dụng useSession hook
// ===============================================
export function ClientSessionExample() {
  const { data: session, status } = useSession()

  useEffect(() => {
    // Log session khi có thay đổi
    console.log('Client Session:', session)
    console.log('Status:', status)
  }, [session, status])

  if (status === 'loading') {
    return <div>Đang tải...</div>
  }

  if (status === 'unauthenticated') {
    return (
      <div>
        <p>Bạn chưa đăng nhập</p>
        <button onClick={() => signIn()}>Đăng nhập</button>
      </div>
    )
  }

  if (session) {
    return (
      <div>
        <h3>Thông tin session:</h3>
        <p><strong>User:</strong> {JSON.stringify(session.user)}</p>
        <p><strong>Access Token:</strong> {session.accessToken || 'Không có'}</p>
        <p><strong>Expires:</strong> {session.expires}</p>
        
        <button onClick={() => signOut()}>Đăng xuất</button>
      </div>
    )
  }

  return null
}

// ===============================================
// 2. Lấy thông tin user từ session
// ===============================================
export function UserInfo() {
  const { data: session } = useSession()

  if (!session?.user) {
    return <div>Không có thông tin user</div>
  }

  const user = session.user

  return (
    <div style={{ 
      padding: '16px', 
      border: '1px solid #e2e8f0', 
      borderRadius: '8px',
      margin: '10px 0'
    }}>
      <h4>Thông tin User:</h4>
      <p><strong>Name:</strong> {user.name || 'Chưa có tên'}</p>
      <p><strong>Email:</strong> {user.email || 'Chưa có email'}</p>
      <p><strong>Image:</strong> {user.image || 'Chưa có avatar'}</p>
      
      {/* Nếu bạn có custom fields trong session */}
      <p><strong>ID:</strong> {user.id || 'Chưa có ID'}</p>
      <p><strong>Role:</strong> {user.role || 'Chưa có role'}</p>
    </div>
  )
}

// ===============================================
// 3. Protected Component - chỉ hiện khi đã login
// ===============================================
export function ProtectedContent() {
  const { data: session, status } = useSession()

  // Nếu đang loading
  if (status === 'loading') {
    return <div>Đang kiểm tra quyền truy cập...</div>
  }

  // Nếu chưa đăng nhập
  if (!session) {
    return (
      <div style={{ 
        padding: '20px', 
        background: '#fee2e2', 
        borderRadius: '8px',
        color: '#dc2626'
      }}>
        <p>⚠️ Bạn cần đăng nhập để xem nội dung này</p>
        <button onClick={() => signIn()}>Đăng nhập ngay</button>
      </div>
    )
  }

  // Nội dung chỉ dành cho user đã đăng nhập
  return (
    <div style={{ 
      padding: '20px', 
      background: '#dcfce7', 
      borderRadius: '8px',
      color: '#166534'
    }}>
      <h4>🎉 Nội dung bảo mật</h4>
      <p>Xin chào {session.user?.name || session.user?.email}!</p>
      <p>Đây là nội dung chỉ dành cho thành viên đã đăng nhập.</p>
    </div>
  )
}

// ===============================================
// 4. Hook custom để sử dụng session dễ dàng hơn
// ===============================================
export function useCurrentUser() {
  const { data: session, status } = useSession()

  return {
    user: session?.user || null,
    accessToken: session?.accessToken || null,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    session: session
  }
}

// ===============================================
// 5. Component sử dụng custom hook
// ===============================================
export function UserDashboard() {
  const { user, isLoading, isAuthenticated, accessToken } = useCurrentUser()

  if (isLoading) {
    return <div>Đang tải thông tin user...</div>
  }

  if (!isAuthenticated) {
    return <div>Vui lòng đăng nhập để xem dashboard</div>
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
      <h3>Dashboard của {user?.name || 'User'}</h3>
      
      <div style={{ marginTop: '16px' }}>
        <h4>Thông tin chi tiết:</h4>
        <ul>
          <li><strong>Email:</strong> {user?.email}</li>
          <li><strong>Name:</strong> {user?.name}</li>
          <li><strong>Has Access Token:</strong> {accessToken ? 'Có' : 'Không'}</li>
        </ul>
      </div>

      <div style={{ marginTop: '16px' }}>
        <button 
          onClick={() => signOut()}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  )
}
