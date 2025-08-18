import { NextRequest, NextResponse } from 'next/server';
import { authConfig } from '@/configs/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, password_confirmation } = body;

    // Validate input
    if (!name || !email || !password || !password_confirmation) {
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

    // Call Laravel API for registration
    const response = await fetch(`${authConfig.laravel.baseUrl}${authConfig.laravel.endpoints.register}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Registration failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: 'Registration successful',
      user: data.user,
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
