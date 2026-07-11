import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default sql;

let _initialized = false;

export async function ensureDbInitialized() {
  if (_initialized) return;
  try {
    await initializeDatabase();
    _initialized = true;
  } catch (err) {
    console.error('DB auto-init error:', err);
  }
}

export async function initializeDatabase() {
  // Attempt to rename the column if it exists to preserve data
  try {
    await sql`ALTER TABLE users RENAME COLUMN email TO phone`;
  } catch (err) {
    // Ignore if column doesn't exist or already renamed
  }

  // Create users table
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      is_admin BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin_pending BOOLEAN DEFAULT FALSE
  `;

  // Create settings table
  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key VARCHAR(255) UNIQUE NOT NULL,
      value VARCHAR(255) NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Insert default is_quiz_active setting if not exists
  await sql`
    INSERT INTO settings (key, value)
    VALUES ('is_quiz_active', 'false')
    ON CONFLICT (key) DO NOTHING
  `;

  // Create quiz_attempts table
  await sql`
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      score INTEGER DEFAULT 0,
      total_questions INTEGER DEFAULT 10,
      time_taken_seconds INTEGER,
      started_at TIMESTAMP DEFAULT NOW(),
      completed_at TIMESTAMP,
      answers JSONB DEFAULT '[]'::jsonb,
      is_completed BOOLEAN DEFAULT FALSE
    )
  `;

  // Create default admin user if not exists
  const adminPhone = process.env.ADMIN_PHONE || '+1234567890';
  const adminExists = await sql`SELECT id FROM users WHERE phone = ${adminPhone}`;
  
  if (adminExists.length === 0) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 12);
    await sql`
      INSERT INTO users (name, phone, password, is_admin)
      VALUES (${process.env.ADMIN_NAME || 'Super Admin'}, ${adminPhone}, ${hashedPassword}, TRUE)
    `;
  }

  _initialized = true;
}
