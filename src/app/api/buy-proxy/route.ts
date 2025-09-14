import { NextResponse } from 'next/server'
import axiosInstance from '@/libs/axios'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const authToken = request.headers.get('Authorization')

    const response = await axiosInstance.post('/buy-proxy-rotating', body, {
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('[API PROXY ERROR]', error)

    return NextResponse.json(
      { message: error.response?.data?.message || 'Có lỗi xảy ra' },
      { status: error.response?.status || 500 }
    )
  }
}
