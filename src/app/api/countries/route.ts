import { NextResponse } from 'next/server'

import axiosInstance from '@/libs/axios'

export async function GET(request: Request) {
  try {
    const laravelApiUrl = '/countries'

    const response = await axiosInstance.get(laravelApiUrl, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('[API COUNTRIES ERROR]', error)

    return NextResponse.json(
      { message: error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách quốc gia' },
      { status: error.response?.status || 500 }
    )
  }
}
