import { NextResponse } from 'next/server'

import axios from 'axios'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'static'
    const search = searchParams.get('search') || ''

    const params = new URLSearchParams({ type })
    if (search) {
      params.append('search', search)
      params.append('search_fields', 'proxy,partner,email')
    }

    const response = await axios.get(`https://api.mktproxy.com/api/proxies?${params.toString()}`)

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error fetching proxies:', error?.response?.data || error.message)

    return NextResponse.json(
      { success: false, message: error?.response?.data?.message || 'Failed to fetch proxies' },
      { status: error?.response?.status || 500 }
    )
  }
}
