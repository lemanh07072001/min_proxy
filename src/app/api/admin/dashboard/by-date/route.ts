import { NextRequest, NextResponse } from 'next/server'

import axiosInstance from '@/libs/axios'

export async function GET(request: NextRequest) {
  try {
    const authToken = request.headers.get('Authorization')

    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    let date = searchParams.get('date')

    // Nếu không có date, lấy ngày hiện tại theo format DD-MM-YYYY
    if (!date) {
      const today = new Date()
      const day = String(today.getDate()).padStart(2, '0')
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const year = today.getFullYear()

      date = `${day}-${month}-${year}`
    }

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
