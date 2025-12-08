import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/libs/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ 
        error: 'No session found',
        message: 'User not authenticated'
      }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      session: {
        user: session.user,
        accessToken: session.accessToken ? 'Available' : 'Not available',
        error: session.error || 'None',
        expires: session.expires
      },
      message: 'Token test successful'
    })
  } catch (error) {
    console.error('Token test error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
