import { NextRequest, NextResponse } from 'next/server';
import { authConfig } from '@/configs/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, email, password, password_confirmation } = body;

    // Validate input
    if (!token || !email || !password || !password_confirmation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password !== password_confirmation) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Call Laravel API for password reset
    const response = await fetch(`${authConfig.laravel.baseUrl}${authConfig.laravel.endpoints.resetPassword}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        token,
        email,
        password,
        password_confirmation,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Password reset failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: 'Password reset successful',
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
