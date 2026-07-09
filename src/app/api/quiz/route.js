import { NextResponse } from 'next/server';
import sql, { ensureDbInitialized } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { getClientQuestions } from '@/lib/questions';

export const dynamic = 'force-dynamic';

// GET - Start quiz / get questions
export async function GET(request) {
  try {
    await ensureDbInitialized();
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check global quiz active status
    const setting = await sql`SELECT value FROM settings WHERE key = 'is_quiz_active'`;
    const isActive = setting.length > 0 && setting[0].value === 'true';

    // Admins can always access the quiz for testing, regular users are blocked if not active
    if (!isActive && !user.is_admin) {
      return NextResponse.json({ 
        notStarted: true, 
        error: 'The admin has not started the quiz yet. Please wait.' 
      }, { status: 403 });
    }

    // Check if user already has an active or completed attempt
    const existingAttempts = await sql`
      SELECT id, is_completed, started_at, score, time_taken_seconds,
             EXTRACT(EPOCH FROM (NOW() - started_at)) as elapsed_seconds
      FROM quiz_attempts 
      WHERE user_id = ${user.id}
      ORDER BY started_at DESC
      LIMIT 1
    `;

    if (existingAttempts.length > 0 && existingAttempts[0].is_completed) {
      return NextResponse.json({
        error: 'You have already completed the quiz',
        completed: true,
        score: existingAttempts[0].score,
        timeTaken: existingAttempts[0].time_taken_seconds
      }, { status: 403 });
    }

    let attemptId;
    let startedAt;
    let elapsedSeconds = 0;

    if (existingAttempts.length > 0 && !existingAttempts[0].is_completed) {
      // Resume existing attempt
      attemptId = existingAttempts[0].id;
      startedAt = existingAttempts[0].started_at;
      elapsedSeconds = Math.max(0, Math.floor(existingAttempts[0].elapsed_seconds));
    } else {
      // Create new attempt
      const newAttempt = await sql`
        INSERT INTO quiz_attempts (user_id, started_at)
        VALUES (${user.id}, NOW())
        RETURNING id, started_at, EXTRACT(EPOCH FROM (NOW() - started_at)) as elapsed_seconds
      `;
      attemptId = newAttempt[0].id;
      startedAt = newAttempt[0].started_at;
      elapsedSeconds = Math.max(0, Math.floor(newAttempt[0].elapsed_seconds || 0));
    }

    const questions = getClientQuestions();

    return NextResponse.json({
      attemptId,
      startedAt,
      elapsedSeconds,
      questions,
      totalTime: 600 // 10 minutes in seconds
    });
  } catch (error) {
    console.error('Quiz GET error:', error);
    return NextResponse.json(
      { error: 'Failed to load quiz' },
      { status: 500 }
    );
  }
}
