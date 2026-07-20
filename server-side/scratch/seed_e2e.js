import { pool } from '../src/config/db.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const seedE2E = async () => {
  try {
    console.log('Seeding E2E users...');

    // 1. Clean existing E2E users to avoid duplicate key errors
    await pool.query("DELETE FROM users WHERE email IN ('stella.starr.student@unn.edu.ng', 'charles.uzo.staff@unn.edu.ng')");

    const staffPassword = await bcrypt.hash('staff123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    // Update Admin password to make sure it is 'admin123'
    await pool.query(
      "UPDATE users SET password = ? WHERE email = 'hod.cs@unn.edu.ng'",
      [adminPassword]
    );

    // 2. Reset student registry record for Stella Starr to make activation test repeatable
    await pool.query(
      "UPDATE student_registry SET is_used = FALSE WHERE matric_no = '2022/240456'"
    );

    // 3. Insert staff user
    const [staffResult] = await pool.query(
      "INSERT INTO users (email, password, role, full_name, is_active) VALUES ('charles.uzo.staff@unn.edu.ng', ?, 'staff', 'Dr. Charles Uzo', TRUE)",
      [staffPassword]
    );

    // Link in staff table (category_id = 1 for Academic)
    await pool.query(
      "INSERT INTO staff (user_id, category_id) VALUES (?, 1) ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)",
      [staffResult.insertId]
    );

    console.log('E2E seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding E2E:', error.message);
  } finally {
    process.exit(0);
  }
};

seedE2E();
