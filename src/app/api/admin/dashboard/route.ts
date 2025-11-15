import axiosInstance from '@/libs/axios'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authToken = request.headers.get('Authorization')

    console.log('[DEBUG] Auth Token:', authToken)

    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const laravelApiUrl = 'get-dashboard'

    console.log('[DEBUG] Calling:', `${axiosInstance.defaults.baseURL}/${laravelApiUrl}`)

    const response = await axiosInstance.get(laravelApiUrl, {
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    console.log('[DEBUG] Response:', response.data)

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('[API PROXY ERROR]', error.response?.data || error.message)

    return NextResponse.json(
      { message: error.response?.data?.message || 'Có lỗi xảy ra' },
      { status: error.response?.status || 500 }
    )
  }
}
