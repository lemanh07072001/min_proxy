import axiosInstance from '@/libs/axios'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authToken = request.headers.get('Authorization')

    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    const laravelApiUrl = 'get-dashboard-by-date'

    const response = await axiosInstance.get(laravelApiUrl, {
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      params: {
        date
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
