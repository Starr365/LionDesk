import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.resolve(__dirname, '..', 'students.csv');
const expectedArgument = process.argv.find((argument) => argument.startsWith('--expected='));
const expectedCount = expectedArgument ? Number(expectedArgument.split('=')[1]) : null;
const dryRun = process.argv.includes('--dry-run');

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '.env.local') });

function readStudents() {
  return new Promise((resolve, reject) => {
    const students = [];

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        const matricNo = row['Matric Number']?.trim();
        const fullName = row['Full Name']?.trim();

        if (!matricNo || !fullName) {
          reject(new Error(`Invalid row: both "Matric Number" and "Full Name" are required.`));
          return;
        }

        students.push({
          matricNo,
          fullName,
          dataCheckNote: row['Data Check Note']?.trim() ?? ''
        });
      })
      .on('end', () => resolve(students))
      .on('error', reject);
  });
}

async function main() {
  if (expectedCount !== null && (!Number.isInteger(expectedCount) || expectedCount < 1)) {
    throw new Error('--expected must be a positive integer.');
  }

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found: ${csvPath}`);
  }

  const students = await readStudents();
  const cleanStudents = students.filter((student) => !student.dataCheckNote);
  const uniqueStudents = [...new Map(cleanStudents.map((student) => [student.matricNo, student])).values()];
  const duplicateRows = cleanStudents.length - uniqueStudents.length;
  const excludedRows = students.length - cleanStudents.length;

  console.log(
    `Read ${students.length} CSV rows; excluded ${excludedRows} row(s) with data-quality notes. ` +
    `${uniqueStudents.length} clean unique matric numbers remain (${duplicateRows} duplicate clean row(s)).`
  );

  // An optional explicit count protects against importing an unintended cohort.
  if (expectedCount !== null && uniqueStudents.length !== expectedCount) {
    throw new Error(
      `Safety check failed: expected ${expectedCount} unique students, but found ${uniqueStudents.length}. ` +
      `No database changes were made. Review students.csv, then rerun with --expected=${uniqueStudents.length} if intentional.`
    );
  }

  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'liondesk_db',
    ssl: process.env.DB_SSL === 'true' || process.env.DB_HOST?.includes('tidbcloud.com')
      ? { minVersion: 'TLSv1.2', rejectUnauthorized: true }
      : undefined
  });

  try {
    const [[before]] = await pool.query('SELECT COUNT(*) AS count FROM student_registry');

    if (dryRun) {
      console.log(`Dry run only. student_registry currently contains ${before.count} row(s).`);
      return;
    }

    let inserted = 0;
    let ignored = 0;
    for (const student of uniqueStudents) {
      const [result] = await pool.execute(
        'INSERT IGNORE INTO student_registry (matric_no, full_name) VALUES (?, ?)',
        [student.matricNo, student.fullName]
      );
      if (result.affectedRows === 1) inserted += 1;
      else ignored += 1;
    }

    const [[after]] = await pool.query('SELECT COUNT(*) AS count FROM student_registry');
    console.log(`Import complete: ${inserted} inserted, ${ignored} existing entries ignored.`);
    console.log(`student_registry total: ${after.count} row(s).`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(`Import failed: ${error.message}`);
  process.exitCode = 1;
});
