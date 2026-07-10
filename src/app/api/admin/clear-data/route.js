import { NextResponse } from 'next/server';
import sql, { ensureDbInitialized } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request) {
  try {
    await ensureDbInitialized();
    const user = getUserFromRequest(request);
    
    if (!user || !user.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { action } = await request.json();

    if (action === 'leaderboard') {
      await sql`DELETE FROM quiz_attempts`;
      return NextResponse.json({ message: 'Leaderboard cleared successfully' });
    } else if (action === 'users') {
      await sql`DELETE FROM quiz_attempts`;
      await sql`DELETE FROM users WHERE is_admin = FALSE`;
      return NextResponse.json({ message: 'All non-admin users and leaderboard cleared successfully' });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Clear data error:', error);
    return NextResponse.json(
      { error: 'Failed to clear data' },
      { status: 500 }
    );
  }
}
