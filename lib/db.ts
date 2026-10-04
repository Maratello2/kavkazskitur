import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://kavkazskitur_user:KavkazTur2026!@localhost/kavkazskitur_db',
});

export default pool;
