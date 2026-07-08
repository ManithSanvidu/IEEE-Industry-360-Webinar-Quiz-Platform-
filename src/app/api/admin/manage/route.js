import { NextResponse } from 'next/server';
import sql, { ensureDbInitialized } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

// POST - Make a user an admin
export async function POST(request) {
  try {
    await ensureDbInitialized();
    const user = getUserFromRequest(request);
    if (!user || !user.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find user by email
    const users = await sql`SELECT id, name, email, is_admin FROM users WHERE email = ${email.toLowerCase()}`;
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found with this email' },
        { status: 404 }
      );
    }

    if (users[0].is_admin) {
      return NextResponse.json(
        { error: 'This user is already an admin' },
        { status: 400 }
      );
    }

    // Make user admin
    await sql`UPDATE users SET is_admin = TRUE WHERE email = ${email.toLowerCase()}`;

    return NextResponse.json({
      message: `${users[0].name} has been made an admin`,
      user: { ...users[0], is_admin: true }
    });
  } catch (error) {
    console.error('Make admin error:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}

// GET - List all admins
export async function GET(request) {
  try {
    await ensureDbInitialized();
    const user = getUserFromRequest(request);
    if (!user || !user.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const admins = await sql`
      SELECT id, name, email, created_at FROM users WHERE is_admin = TRUE ORDER BY created_at ASC
    `;

    return NextResponse.json({ admins });
  } catch (error) {
    console.error('List admins error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admins' },
      { status: 500 }
    );
  }
}
