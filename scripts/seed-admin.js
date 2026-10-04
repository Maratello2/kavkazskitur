// Creates (or updates the password of) an admin_users record for the
// Telegram-2FA-protected admin panel.
//
// Usage:
//   node scripts/seed-admin.js <username> <password> <telegram_chat_id>
//
// Requires DATABASE_URL (or the default connection string in lib/db.ts) to
// point at a running Postgres instance with schema.sql already applied.

require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function main() {
  const [, , username, password, telegramChatId] = process.argv;
  if (!username || !password) {
    console.error('Usage: node scripts/seed-admin.js <username> <password> [telegram_chat_id]');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://kavkazskitur_user:KavkazTur2026!@localhost/kavkazskitur_db',
  });

  const passwordHash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO admin_users (username, password_hash, telegram_chat_id, role, is_active)
     VALUES ($1, $2, $3, 'superadmin', true)
     ON CONFLICT (username) DO UPDATE SET password_hash = $2, telegram_chat_id = $3`,
    [username, passwordHash, telegramChatId || null]
  );

  console.log(`Admin user "${username}" created/updated.`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
