import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const runMigration = async () => {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'liondesk_db';

  console.log(`[Migration] Connecting to MySQL at ${host}:${port} as ${user}...`);

  try {
    const sslConfig = process.env.DB_SSL === 'true' || host.includes('tidbcloud.com')
      ? { minVersion: 'TLSv1.2', rejectUnauthorized: true }
      : undefined;

    // 1. Connect without database to ensure it exists
    const connection = await mysql.createConnection({ host, port, user, password, ssl: sslConfig });
    
    console.log(`[Migration] Creating database "${dbName}" if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.end();

    // 2. Re-connect directly to the database
    const dbConnection = await mysql.createConnection({ host, port, user, password, database: dbName, multipleStatements: true, ssl: sslConfig });
    console.log(`[Migration] Connected to database "${dbName}".`);

    // 3. Read and execute the SQL file
    const sqlFilePath = path.join(__dirname, '001_create_tables.sql');
    console.log(`[Migration] Reading schema from ${sqlFilePath}...`);
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('[Migration] Executing database schema migration...');
    await dbConnection.query(sql);
    console.log('[Migration] Schema migration executed successfully!');

    await dbConnection.end();
    console.log('[Migration] Connection closed.');
  } catch (error) {
    console.error('[Migration] Migration failed:', error.message);
    process.exit(1);
  }
};

runMigration();
