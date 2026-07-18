import { pool } from '../config/db.js';

/**
 * GET /api/users/me
 * Retrieves current authenticated user profile payload including role specific details.
 */
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get core details
    const [users] = await pool.query(
      `SELECT id, email, role, full_name, is_active, created_at FROM users WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) return res.status(404).json({ error: 'User not found.' });

    const user = users[0];
    const profile = {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: user.role,
      isActive: !!user.is_active,
      createdAt: user.created_at
    };

    // Attach student registry matric No details if user is student
    if (user.role === 'student') {
      const [studentRows] = await pool.query(
        `SELECT matric_no, level FROM students WHERE user_id = ?`,
        [userId]
      );
      if (studentRows.length > 0) {
        profile.matricNo = studentRows[0].matric_no;
        profile.level = studentRows[0].level;
      }
    }

    // Attach staff department specialty categories if user is staff
    if (user.role === 'staff') {
      const [staffRows] = await pool.query(
        `SELECT s.workload_count, c.name AS category
         FROM staff s
         LEFT JOIN categories c ON s.category_id = c.id
         WHERE s.user_id = ?`,
        [userId]
      );
      if (staffRows.length > 0) {
        profile.workloadCount = staffRows[0].workload_count;
        profile.category = staffRows[0].category;
      }
    }

    res.json(profile);
  } catch (error) {
    console.error('[Users] getMyProfile error:', error.message);
    res.status(500).json({ error: 'Server error retrieving profile.' });
  }
};
