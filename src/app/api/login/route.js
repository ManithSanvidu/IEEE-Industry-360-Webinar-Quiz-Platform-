import { NextResponse } from 'next/server';
import sql, { ensureDbInitialized } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    await ensureDbInitialized();
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json(
        { error: 'Phone number and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const users = await sql`SELECT * FROM users WHERE phone = ${phone}`;
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid phone number or password' },
        { status: 401 }
      );
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid phone number or password' },
        { status: 401 }
      );
    }

    if (user.is_admin_pending) {
      return NextResponse.json(
        { error: 'Your admin account is pending approval' },
        { status: 403 }
      );
    }

    // Generate JWT token
    const token = signToken({
      id: user.id,
      name: user.name,
      phone: user.phone,
      is_admin: user.is_admin
    });

    // Set cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        is_admin: user.is_admin
      }
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
