import { NextResponse } from 'next/server'

import axios from 'axios'

export async function POST(request: Request) {
  try {
    const { key } = await request.json()

    if (!key) {
      return NextResponse.json({ success: false, message: 'Key is required' }, { status: 400 })
    }

    const response = await axios.post('https://api.mktproxy.com/api/proxies/new', { key })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error fetching proxy:', error?.response?.data || error.message)

    return NextResponse.json(
      { success: false, message: error?.response?.data?.message || 'Failed to fetch proxy' },
      { status: error?.response?.status || 500 }
    )
  }
}
