import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'liondesk_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' || (process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com'))
    ? { minVersion: 'TLSv1.2', rejectUnauthorized: true }
    : undefined
});

// Verify connection on startup
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('[DB] MySQL connected successfully');
    connection.release();
  } catch (error) {
    console.error('[DB] MySQL connection failed:', error.message);
    process.exit(1);
  }
};

export { pool, testConnection };
