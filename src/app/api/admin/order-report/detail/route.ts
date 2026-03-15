import { NextRequest, NextResponse } from 'next/server'

import axiosInstance from '@/libs/axios'

export async function GET(request: NextRequest) {
  try {
    const authToken = request.headers.get('Authorization')

    if (!authToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)

    const response = await axiosInstance.get('order-report/detail', {
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      params: {
        start: searchParams.get('start'),
        end: searchParams.get('end'),
        provider_id: searchParams.get('provider_id'),
        status: searchParams.get('status'),
        page: searchParams.get('page'),
        per_page: searchParams.get('per_page'),
      }
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('[ORDER REPORT DETAIL ERROR]', error.response?.data || error.message)

    return NextResponse.json(
      { message: error.response?.data?.message || 'Có lỗi xảy ra' },
      { status: error.response?.status || 500 }
    )
  }
}
