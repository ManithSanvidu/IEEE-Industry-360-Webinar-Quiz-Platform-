import { NextResponse } from 'next/server';
import sql, { ensureDbInitialized } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await ensureDbInitialized();
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()}`;
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email.toLowerCase()}, ${hashedPassword})
      RETURNING id, name, email, is_admin
    `;

    return NextResponse.json(
      { message: 'Registration successful! Please login.', user: result[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
