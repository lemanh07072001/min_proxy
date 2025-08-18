import { NextRequest, NextResponse } from 'next/server';
import { authConfig } from '@/configs/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Call Laravel API for forgot password
    const response = await fetch(`${authConfig.laravel.baseUrl}${authConfig.laravel.endpoints.forgotPassword}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Password reset request failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: 'Password reset link sent to your email',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
