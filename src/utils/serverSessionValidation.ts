import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/libs/auth'

/**
 * Server-side utility để validate session với API check
 * Sử dụng cho các route cần xác thực chặt chẽ
 */
export async function validateServerSessionWithAPI() {
  const session = await getServerSession(authOptions as any) as any

  // Kiểm tra session cơ bản
  if (!session) {
    return null
  }

  // Kiểm tra nếu session có error
  if (session.error === 'TokenExpiredError') {
    return null
  }

  // Kiểm tra nếu không có access_token
  if (!session.access_token) {
    return null
  }

  // Kiểm tra token validity bằng cách gọi API
  try {
    const response = await fetch(`${process.env.API_URL || 'https://api.minhan.online/api'}/me`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`
      },
      cache: 'no-store' // Không cache để đảm bảo fresh data
    })

    if (response.status === 401) {
      return null
    }

    if (!response.ok) {
      return null
    }

    return session
  } catch (error) {
    return null
  }
}

/**
 * Server-side utility để validate session nhanh (không gọi API)
 * Sử dụng cho các route cần kiểm tra nhanh
 */
export async function validateServerSessionBasic() {
  const session = await getServerSession(authOptions as any) as any

  // Kiểm tra session cơ bản
  if (!session) {
    return null
  }

  // Kiểm tra nếu session có error
  if (session.error === 'TokenExpiredError') {
    return null
  }

  // Kiểm tra nếu không có access_token
  if (!session.access_token) {
    return null
  }

  return session
}

/**
 * Server-side utility để lấy user data từ API
 * Sử dụng trong layout để pass user data xuống client
 */
export async function getServerUserData() {
  const session = await getServerSession(authOptions as any) as any

  try {
    const response = await fetch(`${process.env.API_URL || 'https://api.minhan.online/api'}/me`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`
      },
      cache: 'no-store'
    })

    if (response.ok) {
      return await response.json()
    }
  } catch (error) {}

  return null
}
