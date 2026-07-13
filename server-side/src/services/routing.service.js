import { pool } from '../config/db.js';

/**
 * Auto-routing service: Least-workload + category-based (DP-02).
 * Finds the active staff member in the matching category with the fewest active tickets.
 *
 * @param {number} categoryId - The category ID of the new ticket.
 * @returns {object|null} - The assigned staff user row, or null if no staff available.
 */
export const assignStaffByCategory = async (categoryId) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.full_name, u.email, s.workload_count
     FROM staff s
     JOIN users u ON s.user_id = u.id
     WHERE s.category_id = ?
       AND u.is_active = TRUE
       AND u.role = 'staff'
     ORDER BY s.workload_count ASC
     LIMIT 1`,
    [categoryId]
  );

  return rows.length > 0 ? rows[0] : null;
};

/**
 * Increment a staff member's workload count.
 */
export const incrementWorkload = async (userId) => {
  await pool.query(
    `UPDATE staff SET workload_count = workload_count + 1 WHERE user_id = ?`,
    [userId]
  );
};

/**
 * Decrement a staff member's workload count (when ticket leaves active state).
 */
export const decrementWorkload = async (userId) => {
  await pool.query(
    `UPDATE staff SET workload_count = GREATEST(workload_count - 1, 0) WHERE user_id = ?`,
    [userId]
  );
};
