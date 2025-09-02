// ===============================================
// SERVER-SIDE: Sử dụng getServerSession
// ===============================================

import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

// ===============================================
// 1. Server Component - lấy session
// ===============================================
export default async function ServerSessionExample() {
  const session = await getServerSession(authOptions)

  console.log('Server Session:', session)

  if (!session) {
    return (
      <div>
        <h3>Chưa đăng nhập (Server-side)</h3>
        <p>Session không tồn tại trên server</p>
      </div>
    )
  }

  return (
    <div>
      <h3>Thông tin Session (Server-side)</h3>
      <pre style={{ 
        background: '#f3f4f6', 
        padding: '16px', 
        borderRadius: '8px',
        overflow: 'auto'
      }}>
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  )
}

// ===============================================
// 2. API Route - xử lý session
// ===============================================

// File: src/app/api/user/profile/route.ts
/*
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' }, 
      { status: 401 }
    )
  }

  // Trả về thông tin user
  return NextResponse.json({
    user: session.user,
    accessToken: session.accessToken,
    message: 'Profile data retrieved successfully'
  })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' }, 
      { status: 401 }
    )
  }

  const body = await request.json()
  
  // Xử lý logic với session.user.id hoặc session.accessToken
  console.log('User ID:', session.user?.id)
  console.log('Access Token:', session.accessToken)

  return NextResponse.json({ 
    message: 'Data processed successfully',
    userId: session.user?.id 
  })
}
*/

// ===============================================
// 3. Page Component với session
// ===============================================

export async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <div>
        <h1>Access Denied</h1>
        <p>Bạn cần đăng nhập để xem trang này</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Xin chào, {session.user?.name || session.user?.email}!</p>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Session Data:</h3>
        <ul>
          <li><strong>User ID:</strong> {session.user?.id || 'N/A'}</li>
          <li><strong>Email:</strong> {session.user?.email || 'N/A'}</li>
          <li><strong>Name:</strong> {session.user?.name || 'N/A'}</li>
          <li><strong>Access Token:</strong> {session.accessToken ? 'Available' : 'Not available'}</li>
          <li><strong>Expires:</strong> {session.expires}</li>
        </ul>
      </div>
    </div>
  )
}

// ===============================================
// 4. Middleware với session (nếu cần)
// ===============================================

// File: middleware.ts
/*
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Logic middleware ở đây
    console.log('Token:', req.nextauth.token)
    console.log('User:', req.nextauth.token?.user)
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Kiểm tra quyền truy cập
        return !!token
      }
    }
  }
)

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*']
}
*/

// ===============================================
// 5. Server Action với session
// ===============================================

/*
// File: src/app/actions/userActions.ts
'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

export async function updateUserProfile(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name') as string
  const email = formData.get('email') as string

  // Cập nhật thông tin user
  console.log('Updating user:', session.user?.id)
  console.log('New name:', name)
  console.log('New email:', email)

  // Logic cập nhật database ở đây...

  return { success: true, message: 'Profile updated successfully' }
}

export async function getUserData() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  // Lấy thêm data từ database dựa trên session.user.id
  return {
    user: session.user,
    accessToken: session.accessToken,
    // ... thêm data khác
  }
}
*/
