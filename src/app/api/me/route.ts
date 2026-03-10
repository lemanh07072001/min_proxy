import { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from 'next-auth/next'

import axios from 'axios'

import { authOptions } from '@/libs/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.access_token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Gọi đến backend API thực sự
    const backendUrl = process.env.NEXT_PUBLIC_API_URL
    
    const response = await axios.post(`${backendUrl}/me`, {}, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('API /me error:', error)
    
    if (error.response?.status === 401) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

