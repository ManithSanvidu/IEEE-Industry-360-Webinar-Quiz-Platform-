import { NextResponse } from 'next/server';
import sql, { ensureDbInitialized } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    await ensureDbInitialized();
    const user = getUserFromRequest(request);
    if (!user || !user.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get top 10 leaderboard
    const leaderboard = await sql`
      SELECT 
        u.name,
        qa.score,
        qa.time_taken_seconds,
        qa.completed_at
      FROM quiz_attempts qa
      JOIN users u ON qa.user_id = u.id
      WHERE qa.is_completed = TRUE
      ORDER BY qa.score DESC, qa.time_taken_seconds ASC
      LIMIT 10
    `;

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
