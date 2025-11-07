import { NextResponse } from 'next/server'

import axiosInstance from '@/libs/axios'

// Enable caching for this route (optional)
export const dynamic = 'force-static'
export const revalidate = 300 // Revalidate every 5 minutes

export async function GET(request: Request) {
  try {
    const laravelApiUrl = '/get-partner'

    // Fetch directly from Laravel API without auth
    const response = await axiosInstance.get(laravelApiUrl, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('[API PARTNERS ERROR]', error)

    return NextResponse.json(
      { message: error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách đối tác' },
      { status: error.response?.status || 500 }
    )
  }
}
