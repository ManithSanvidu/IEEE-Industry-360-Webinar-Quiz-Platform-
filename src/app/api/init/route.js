import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initializeDatabase();
    return NextResponse.json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('DB init error:', error);
    return NextResponse.json(
      { error: 'Database initialization failed: ' + error.message },
      { status: 500 }
    );
  }
}
