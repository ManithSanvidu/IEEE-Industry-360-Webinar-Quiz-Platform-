import { NextResponse } from 'next/server';
import sql, { ensureDbInitialized } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

// POST - Make a user an admin or approve pending admin
export async function POST(request) {
  try {
    await ensureDbInitialized();
    const user = getUserFromRequest(request);
    if (!user || !user.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Phone number must be exactly 10 digits' },
        { status: 400 }
      );
    }

    // Find user by phone
    const users = await sql`SELECT id, name, phone, is_admin, is_admin_pending FROM users WHERE phone = ${phone}`;
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found with this phone number' },
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
    await sql`UPDATE users SET is_admin = TRUE, is_admin_pending = FALSE WHERE phone = ${phone}`;

    return NextResponse.json({
      message: `${users[0].name} has been made an admin`,
      user: { ...users[0], is_admin: true, is_admin_pending: false }
    });
  } catch (error) {
    console.error('Make admin error:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}

// GET - List all admins and pending admins
export async function GET(request) {
  try {
    await ensureDbInitialized();
    const user = getUserFromRequest(request);
    if (!user || !user.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const admins = await sql`
      SELECT id, name, phone, created_at FROM users WHERE is_admin = TRUE ORDER BY created_at ASC
    `;
    
    const pendingAdmins = await sql`
      SELECT id, name, phone, created_at FROM users WHERE is_admin_pending = TRUE AND is_admin = FALSE ORDER BY created_at ASC
    `;

    return NextResponse.json({ admins, pendingAdmins });
  } catch (error) {
    console.error('List admins error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admins' },
      { status: 500 }
    );
  }
}
