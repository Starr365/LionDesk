import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const alterDb = async () => {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'liondesk_db';

  console.log(`Connecting to ${host}:${port} to alter table...`);

  try {
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database: dbName,
      ssl: process.env.DB_SSL === 'true' || host.includes('tidbcloud.com')
        ? { minVersion: 'TLSv1.2', rejectUnauthorized: true }
        : undefined
    });

    // Drop email column from student_registry if it exists
    try {
      await connection.query('ALTER TABLE student_registry DROP COLUMN email');
      console.log('Successfully dropped email column from student_registry.');
    } catch (e) {
      console.log('Could not drop email (might have already been dropped):', e.message);
    }

    await connection.end();
  } catch (error) {
    console.error('Error altering DB:', error.message);
  } finally {
    process.exit(0);
  }
};

alterDb();
