import { NextResponse } from 'next/server'

import axiosInstance from '@/libs/axios'

export async function POST(request: Request) {
  try {

    const authToken = request.headers.get('Authorization')

    const laravelApiUrl = '/get-order-proxy-static'

    const response = await axiosInstance.post(laravelApiUrl, {}, {
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    console.log(response.data)
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('[API PROXY ERROR]', error)

    return NextResponse.json(
      { message: error.response?.data?.message || 'Có lỗi xảy ra' },
      { status: error.response?.status || 500 }
    )
  }
}
