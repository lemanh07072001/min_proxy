import { NextRequest, NextResponse } from 'next/server'

import axiosInstance from '@/libs/axios'

export async function POST(request: NextRequest) {
  try {
    const authToken = request.headers.get('Authorization')

    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const response = await axiosInstance.post('admin/proxy/confirm-refund', body, {
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('[CONFIRM REFUND ERROR]', error.response?.data || error.message)

    return NextResponse.json(
      { message: error.response?.data?.message || 'Có lỗi xảy ra khi hoàn tiền' },
      { status: error.response?.status || 500 }
    )
  }
}
