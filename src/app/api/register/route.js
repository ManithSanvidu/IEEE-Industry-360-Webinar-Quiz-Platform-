import { NextResponse } from 'next/server';
import sql, { ensureDbInitialized } from '@/lib/db';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await ensureDbInitialized();
    const { name, phone, password, isAdminRequest } = await request.json();

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone number are required' },
        { status: 400 }
      );
    }
    
    if (isAdminRequest && !password) {
      return NextResponse.json(
        { error: 'Password is required for admin registration' },
        { status: 400 }
      );
    }

    // Check if user already exists
    let users = await sql`SELECT * FROM users WHERE phone = ${phone}`;
    let user;

    if (users.length > 0) {
      user = users[0];
      // Optionally update name if needed, but we'll just use the existing one
    } else {
      // Create new user
      let hashedPassword;
      let is_admin_pending = false;
      
      if (isAdminRequest && password) {
        hashedPassword = await bcrypt.hash(password, 12);
        is_admin_pending = true;
      } else {
        hashedPassword = await bcrypt.hash('dummy_password_' + Date.now(), 10);
      }

      const result = await sql`
        INSERT INTO users (name, phone, password, is_admin_pending)
        VALUES (${name}, ${phone}, ${hashedPassword}, ${is_admin_pending})
        RETURNING id, name, phone, is_admin, is_admin_pending
      `;
      user = result[0];
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
      message: 'Ready to play!',
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}
