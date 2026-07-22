import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool } from '../config/db.js';
import { validateEmail, validatePassword } from '../utils/validators.js';
import { sendPasswordResetEmail } from '../services/email.service.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
};

const setAuthCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'None' : 'Lax',
    maxAge: 8 * 60 * 60 * 1000 // 8 hours
  });
};

/**
 * POST /api/auth/verify-registry
 * Pre-activation verification step. Checks matric number, activation status, and name match.
 */
export const verifyRegistry = async (req, res) => {
  try {
    const { matric_no, full_name } = req.body;

    if (!matric_no || !full_name) {
      return res.status(400).json({ error: 'Registration number and name are required.' });
    }

    // 1. Check registry by matric_no only to provide precise error messages
    const [registryRows] = await pool.query(
      `SELECT * FROM student_registry WHERE matric_no = ?`,
      [matric_no]
    );

    if (registryRows.length === 0) {
      return res.status(404).json({ error: 'Registration number not found in student registry.' });
    }

    const record = registryRows[0];

    // 2. Check if already activated
    if (record.is_used) {
      return res.status(409).json({ error: 'This registration number has already been activated.' });
    }

    // 3. Verify name (case-insensitive)
    if (record.full_name.toLowerCase() !== full_name.trim().toLowerCase()) {
      return res.status(400).json({ error: 'The name provided does not match the official record for this registration number.' });
    }

    // 4. Return success
    res.json({
      message: 'Registration credentials verified successfully.'
    });
  } catch (error) {
    console.error('[Auth] Registry verification error:', error.message);
    res.status(500).json({ error: 'Server error during verification.' });
  }
};

/**
 * POST /api/auth/activate
 * Student self-activation via matric number verification.
 */
export const activate = async (req, res) => {
  try {
    const { matric_no, full_name, email, password } = req.body;

    if (!matric_no || !full_name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // 1. Rerun checks with precise errors (secures final registration step)
    const [registryRows] = await pool.query(
      `SELECT * FROM student_registry WHERE matric_no = ?`,
      [matric_no]
    );

    if (registryRows.length === 0) {
      return res.status(404).json({ error: 'Registration number not found in student registry.' });
    }

    const record = registryRows[0];

    if (record.is_used) {
      return res.status(409).json({ error: 'This registration number has already been activated.' });
    }

    if (record.full_name.toLowerCase() !== full_name.trim().toLowerCase()) {
      return res.status(400).json({ error: 'The name provided does not match the official record for this registration number.' });
    }

    // 2. Check if email already exists in users table
    const [existingUser] = await pool.query(`SELECT id FROM users WHERE email = ?`, [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // 3. Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult] = await pool.query(
      `INSERT INTO users (email, password, role, full_name) VALUES (?, ?, 'student', ?)`,
      [email, hashedPassword, record.full_name]
    );

    // 4. Create student record
    await pool.query(
      `INSERT INTO students (user_id, matric_no) VALUES (?, ?)`,
      [userResult.insertId, matric_no]
    );

    // 5. Mark registry entry as used
    await pool.query(
      `UPDATE student_registry SET is_used = TRUE WHERE id = ?`,
      [record.id]
    );

    // 6. Generate JWT and return
    const user = { id: userResult.insertId, role: 'student', full_name: record.full_name, email };
    const token = generateToken(user);

    // Set cookie-based authentication
    setAuthCookie(res, token);

    res.status(201).json({
      message: 'Account activated successfully.',
      token,
      user: { id: user.id, name: full_name, email, role: 'student', matricNo: matric_no }
    });
  } catch (error) {
    console.error('[Auth] Activation error:', error.message);
    res.status(500).json({ error: 'Server error during activation.' });
  }
};

/**
 * POST /api/auth/login
 * Login for all roles. Returns JWT + user profile.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user
    const [users] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = users[0];

    // Check active status
    if (!user.is_active) {
      return res.status(403).json({ error: 'Your account has been deactivated. Contact the administrator.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Build profile response based on role
    const token = generateToken(user);
    const profile = { id: user.id, name: user.full_name, email: user.email, role: user.role };

    // Attach role-specific data
    if (user.role === 'student') {
      const [studentRows] = await pool.query(`SELECT matric_no FROM students WHERE user_id = ?`, [user.id]);
      if (studentRows.length > 0) profile.matricNo = studentRows[0].matric_no;
    } else if (user.role === 'staff') {
      const [staffRows] = await pool.query(
        `SELECT s.category_id, c.name AS category FROM staff s LEFT JOIN categories c ON s.category_id = c.id WHERE s.user_id = ?`,
        [user.id]
      );
      if (staffRows.length > 0) profile.category = staffRows[0].category;
    }

    // Set cookie-based authentication
    setAuthCookie(res, token);

    res.json({ token, user: profile });
  } catch (error) {
    console.error('[Auth] Login error:', error.message);
    res.status(500).json({ error: 'Server error during login.' });
  }
};

/**
 * POST /api/auth/forgot-password
 * Request a password reset. Stores a hashed 6-digit numeric recovery code.
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    // Always return success to avoid email enumeration
    const [users] = await pool.query(`SELECT id FROM users WHERE email = ?`, [email]);

    if (users.length > 0) {
      // Generate a 6-digit numeric recovery code
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedToken = crypto.createHash('sha256').update(resetCode).digest('hex');
      const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration

      await pool.query(
        `UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?`,
        [hashedToken, expires, users[0].id]
      );

      // Send email via Resend
      await sendPasswordResetEmail(email, resetCode);
      console.log(`[Auth] Password reset 6-digit code for ${email}: ${resetCode}`);
    }

    res.json({ message: 'If an account with that email exists, a 6-digit recovery code has been sent.' });
  } catch (error) {
    console.error('[Auth] Forgot password error:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * POST /api/auth/reset-password
 * Reset password using a valid 6-digit numeric recovery code.
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, new_password } = req.body;

    if (!token || !new_password) {
      return res.status(400).json({ error: 'Recovery code and new password are required.' });
    }
    if (!validatePassword(new_password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token.trim()).digest('hex');

    const [users] = await pool.query(
      `SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()`,
      [hashedToken]
    );

    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired recovery code.' });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await pool.query(
      `UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?`,
      [hashedPassword, users[0].id]
    );

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('[Auth] Reset password error:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * POST /api/auth/logout
 * Logs out user by clearing the HTTP-Only auth cookie.
 */
export const logout = async (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'None' : 'Lax'
  });
  res.json({ message: 'Logged out successfully.' });
};
