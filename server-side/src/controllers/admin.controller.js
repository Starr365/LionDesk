import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { validateEmail } from '../utils/validators.js';
import { emitStaffChanged, emitCategoryChanged } from '../services/socket.service.js';

/**
 * GET /api/admin/staff
 * Lists all staff members with category and current workload.
 */
export const getStaffList = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.is_active, s.workload_count, c.id AS category_id, c.name AS category
       FROM users u
       JOIN staff s ON u.id = s.user_id
       LEFT JOIN categories c ON s.category_id = c.id
       WHERE u.role = 'staff'
       ORDER BY u.full_name ASC`
    );
    res.json(rows);
  } catch (error) {
    console.error('[Admin] getStaffList error:', error.message);
    res.status(500).json({ error: 'Server error retrieving staff.' });
  }
};

/**
 * POST /api/admin/staff
 * Registers a new staff specialist in the system with a default password.
 */
export const createStaff = async (req, res) => {
  try {
    const { name, email, category_id } = req.body;

    if (!name || !email || !category_id) {
      return res.status(400).json({ error: 'Name, email, and category are required.' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Verify category exists
    const [cats] = await pool.query(`SELECT id FROM categories WHERE id = ?`, [category_id]);
    if (cats.length === 0) {
      return res.status(400).json({ error: 'Category does not exist.' });
    }

    // Verify user doesn't already exist
    const [existing] = await pool.query(`SELECT id FROM users WHERE email = ?`, [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists.' });
    }

    // Hash temporary password ('staff123')
    const hashedPassword = await bcrypt.hash('staff123', 10);

    // Insert user
    const [userResult] = await pool.query(
      `INSERT INTO users (email, password, role, full_name) VALUES (?, ?, 'staff', ?)`,
      [email, hashedPassword, name]
    );

    // Insert staff
    await pool.query(
      `INSERT INTO staff (user_id, category_id) VALUES (?, ?)`,
      [userResult.insertId, category_id]
    );

    emitStaffChanged();

    res.status(201).json({
      message: 'Staff specialist created successfully.',
      staff: { id: userResult.insertId, name, email, category_id }
    });
  } catch (error) {
    console.error('[Admin] createStaff error:', error.message);
    res.status(500).json({ error: 'Server error creating staff account.' });
  }
};

/**
 * PATCH /api/admin/users/:id/toggle-active
 * Toggles user active/inactive status.
 */
export const toggleUserActive = async (req, res) => {
  try {
    const userId = req.params.id;

    // Retrieve user details
    const [users] = await pool.query(`SELECT id, is_active, role FROM users WHERE id = ?`, [userId]);
    if (users.length === 0) return res.status(404).json({ error: 'User not found.' });

    // Cannot deactivate oneself
    if (Number(userId) === req.user.id) {
      return res.status(400).json({ error: 'You cannot deactivate your own account.' });
    }

    const newActiveState = !users[0].is_active;

    await pool.query(`UPDATE users SET is_active = ? WHERE id = ?`, [newActiveState, userId]);

    if (users[0].role === 'staff') {
      emitStaffChanged();
    }

    res.json({ message: `User status updated to ${newActiveState ? 'active' : 'inactive'}.` });
  } catch (error) {
    console.error('[Admin] toggleUserActive error:', error.message);
    res.status(500).json({ error: 'Server error toggling user status.' });
  }
};

/**
 * POST /api/admin/users/:id/reset-password
 * Admin manual password reset for student/staff specialists.
 */
export const resetUserPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const [users] = await pool.query(`SELECT id FROM users WHERE id = ?`, [userId]);
    if (users.length === 0) return res.status(404).json({ error: 'User not found.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, userId]);

    res.json({ message: 'User password reset successfully.' });
  } catch (error) {
    console.error('[Admin] resetUserPassword error:', error.message);
    res.status(500).json({ error: 'Server error resetting password.' });
  }
};

/**
 * GET /api/admin/categories
 * Lists all categories (active & inactive).
 */
export const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM categories ORDER BY name ASC`);
    res.json(rows);
  } catch (error) {
    console.error('[Admin] getCategories error:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * POST /api/admin/categories
 * Creates a new category.
 */
export const createCategory = async (req, res) => {
  try {
    const { name, description, escalation_hours } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ error: 'Category name is required.' });

    const hours = escalation_hours ? Number(escalation_hours) : 48;

    await pool.query(
      `INSERT INTO categories (name, description, escalation_hours) VALUES (?, ?, ?)`,
      [name.trim(), description || '', hours]
    );

    emitCategoryChanged();

    res.status(201).json({ message: 'Category created successfully.' });
  } catch (error) {
    console.error('[Admin] createCategory error:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * PATCH /api/admin/categories/:id
 * Updates category details.
 */
export const updateCategory = async (req, res) => {
  try {
    const catId = req.params.id;
    const { name, description, escalation_hours, is_active } = req.body;

    const [cats] = await pool.query(`SELECT id FROM categories WHERE id = ?`, [catId]);
    if (cats.length === 0) return res.status(404).json({ error: 'Category not found.' });

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description;
    if (escalation_hours !== undefined) updates.escalation_hours = Number(escalation_hours);
    if (is_active !== undefined) updates.is_active = !!is_active;

    if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No fields provided to update.' });

    const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    await pool.query(`UPDATE categories SET ${setClauses} WHERE id = ?`, [...Object.values(updates), catId]);

    emitCategoryChanged();

    res.json({ message: 'Category updated successfully.' });
  } catch (error) {
    console.error('[Admin] updateCategory error:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * DELETE /api/admin/categories/:id
 * Category deletion helper. Soft deletes categories via active state toggling.
 */
export const deleteCategory = async (req, res) => {
  try {
    const catId = req.params.id;
    const [cats] = await pool.query(`SELECT id FROM categories WHERE id = ?`, [catId]);
    if (cats.length === 0) return res.status(404).json({ error: 'Category not found.' });

    // Set inactive instead of hard deleting to preserve historical ticket links
    await pool.query(`UPDATE categories SET is_active = FALSE WHERE id = ?`, [catId]);

    emitCategoryChanged();

    res.json({ message: 'Category deactivated successfully.' });
  } catch (error) {
    console.error('[Admin] deleteCategory error:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * GET /api/admin/registry
 * Lists all student registration entries pre-loaded in registry.
 */
export const getRegistryList = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM student_registry ORDER BY full_name ASC`);
    res.json(rows);
  } catch (error) {
    console.error('[Admin] getRegistryList error:', error.message);
    res.status(500).json({ error: 'Server error retrieving registry.' });
  }
};

/**
 * GET /api/admin/reports
 * Compiles stats and metrics for charts: volume by category, status, and timeline (30 days).
 */
export const getReportsData = async (req, res) => {
  try {
    // 1. Volume by Category
    const [catVolume] = await pool.query(
      `SELECT c.name, COUNT(t.id) AS count
       FROM tickets t
       JOIN categories c ON t.category_id = c.id
       GROUP BY c.name`
    );

    // 2. Volume by Status
    const [statusVolume] = await pool.query(
      `SELECT status, COUNT(*) AS count
       FROM tickets
       GROUP BY status`
    );

    // 3. Volume over time (last 30 days)
    const [timelineVolume] = await pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS date, COUNT(*) AS count
       FROM tickets
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
       ORDER BY date ASC`
    );

    res.json({
      byCategory: catVolume,
      byStatus: statusVolume,
      timeline: timelineVolume
    });
  } catch (error) {
    console.error('[Admin] getReportsData error:', error.message);
    res.status(500).json({ error: 'Server error generating reports.' });
  }
};
