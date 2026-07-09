import { NextResponse } from 'next/server';
import sql, { ensureDbInitialized } from '@/lib/db';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await ensureDbInitialized();
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    let users = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase()}`;
    let user;

    if (users.length > 0) {
      user = users[0];
      // Optionally update name if needed, but we'll just use the existing one
    } else {
      // Create new user
      const dummyPassword = await bcrypt.hash('dummy_password_' + Date.now(), 10);
      const result = await sql`
        INSERT INTO users (name, email, password)
        VALUES (${name}, ${email.toLowerCase()}, ${dummyPassword})
        RETURNING id, name, email, is_admin
      `;
      user = result[0];
    }

    // Generate JWT token
    const token = signToken({
      id: user.id,
      name: user.name,
      email: user.email,
      is_admin: user.is_admin
    });

    // Set cookie
    const response = NextResponse.json({
      message: 'Ready to play!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}
