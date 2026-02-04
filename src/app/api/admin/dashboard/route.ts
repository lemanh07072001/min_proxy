import { NextRequest, NextResponse } from 'next/server'

import axiosInstance from '@/libs/axios'

export async function GET(request: NextRequest) {
  try {
    const authToken = request.headers.get('Authorization')


    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const laravelApiUrl = 'get-dashboard'


    const response = await axiosInstance.get(laravelApiUrl, {
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })


    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('[API PROXY ERROR]', error.response?.data || error.message)

    return NextResponse.json(
      { message: error.response?.data?.message || 'Có lỗi xảy ra' },
      { status: error.response?.status || 500 }
    )
  }
}
