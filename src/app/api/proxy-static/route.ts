import { NextResponse } from 'next/server'

import axiosInstance from '@/libs/axios'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const authToken = request.headers.get('Authorization')

    const laravelApiUrl = '/buy-proxy-static'

    const response = await axiosInstance.post(laravelApiUrl, body, {
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    // ✅ Nhánh thành công: Bạn đã return đúng
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('[API PROXY ERROR]', error)

    return NextResponse.json(
      { message: error.response?.data?.message || 'Có lỗi xảy ra' },
      { status: error.response?.status || 500 }
    )
  }
}
