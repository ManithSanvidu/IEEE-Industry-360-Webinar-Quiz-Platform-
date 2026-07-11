import { NextResponse } from 'next/server';
import sql, { ensureDbInitialized } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

// GET - Get leaderboard and all quiz results
export async function GET(request) {
  try {
    await ensureDbInitialized();
    const user = getUserFromRequest(request);
    if (!user || !user.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get all completed quiz attempts with user details
    const results = await sql`
      SELECT 
        u.id as user_id,
        u.name,
        u.phone,
        qa.id as attempt_id,
        qa.score,
        qa.total_questions,
        qa.time_taken_seconds,
        qa.started_at,
        qa.completed_at,
        qa.is_completed,
        qa.answers
      FROM users u
      LEFT JOIN quiz_attempts qa ON u.id = qa.user_id
      WHERE u.is_admin = FALSE
      ORDER BY qa.score DESC NULLS LAST, qa.time_taken_seconds ASC NULLS LAST
    `;

    // Get total user count
    const userCount = await sql`SELECT COUNT(*) as count FROM users WHERE is_admin = FALSE`;

    // Get completed quiz count
    const completedCount = await sql`
      SELECT COUNT(*) as count FROM quiz_attempts WHERE is_completed = TRUE
    `;

    return NextResponse.json({
      results,
      totalUsers: parseInt(userCount[0].count),
      completedQuizzes: parseInt(completedCount[0].count)
    });
  } catch (error) {
    console.error('Admin results error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
