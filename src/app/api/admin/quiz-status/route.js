import { NextResponse } from 'next/server';
import sql, { ensureDbInitialized } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await ensureDbInitialized();
    const user = getUserFromRequest(request);
    
    // Non-admins shouldn't need to check via this specific admin endpoint, but they can.
    // However, it's safer to just return the status publically or restrict to admin.
    // Let's restrict POST to admin, but GET could be public or admin. We'll leave it public-ish,
    // though the quiz route checks it directly.
    const setting = await sql`SELECT value FROM settings WHERE key = 'is_quiz_active'`;
    const isActive = setting.length > 0 && setting[0].value === 'true';

    return NextResponse.json({ isActive });
  } catch (error) {
    console.error('Quiz status GET error:', error);
    return NextResponse.json({ error: 'Failed to get quiz status' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await ensureDbInitialized();
    const user = getUserFromRequest(request);
    
    if (!user || !user.is_admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { isActive } = await request.json();
    const valueStr = isActive ? 'true' : 'false';

    await sql`
      INSERT INTO settings (key, value)
      VALUES ('is_quiz_active', ${valueStr})
      ON CONFLICT (key) DO UPDATE SET value = ${valueStr}, updated_at = NOW()
    `;

    return NextResponse.json({ success: true, isActive });
  } catch (error) {
    console.error('Quiz status POST error:', error);
    return NextResponse.json({ error: 'Failed to update quiz status' }, { status: 500 });
  }
}
