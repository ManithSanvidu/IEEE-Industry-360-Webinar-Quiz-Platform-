import { NextResponse } from 'next/server';
import sql, { ensureDbInitialized } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { quizQuestions, checkAnswer } from '@/lib/questions';

export async function POST(request) {
  try {
    await ensureDbInitialized();
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { attemptId, answers } = await request.json();

    if (!attemptId || !answers) {
      return NextResponse.json(
        { error: 'Attempt ID and answers are required' },
        { status: 400 }
      );
    }

    // Verify attempt belongs to user and is not completed
    const attempts = await sql`
      SELECT id, started_at, is_completed, EXTRACT(EPOCH FROM (NOW() - started_at)) as elapsed_seconds
      FROM quiz_attempts
      WHERE id = ${attemptId} AND user_id = ${user.id}
    `;

    if (attempts.length === 0) {
      return NextResponse.json(
        { error: 'Quiz attempt not found' },
        { status: 404 }
      );
    }

    if (attempts[0].is_completed) {
      return NextResponse.json(
        { error: 'Quiz already submitted' },
        { status: 403 }
      );
    }

    // Calculate score
    let score = 0;
    const gradedAnswers = answers.map(answer => {
      const isCorrect = checkAnswer(answer.questionId, answer.answer);
      if (isCorrect) score++;
      return {
        ...answer,
        isCorrect,
        correctAnswer: quizQuestions.find(q => q.id === answer.questionId)?.correctAnswer
      };
    });

    // Calculate time taken
    const timeTakenSeconds = Math.max(0, Math.round(attempts[0].elapsed_seconds));

    // Cap at 600 seconds (10 minutes)
    const finalTime = Math.min(timeTakenSeconds, 600);

    // Update attempt
    await sql`
      UPDATE quiz_attempts
      SET score = ${score},
          time_taken_seconds = ${finalTime},
          completed_at = NOW(),
          answers = ${JSON.stringify(gradedAnswers)},
          is_completed = TRUE
      WHERE id = ${attemptId}
    `;

    return NextResponse.json({
      score,
      totalQuestions: quizQuestions.length,
      timeTaken: finalTime,
      gradedAnswers
    });
  } catch (error) {
    console.error('Quiz submit error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
