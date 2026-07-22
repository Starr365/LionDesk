import jwt from 'jsonwebtoken';

/**
 * JWT authentication middleware.
 * Extracts and verifies the Bearer token from the Authorization header.
 * Attaches the decoded user payload to req.user.
 */
const auth = (req, res, next) => {
  let token = null;

  // 1. Try to extract token from cookie
  if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').map(c => c.trim().split('='));
    const tokenCookie = cookies.find(c => c[0] === 'token');
    if (tokenCookie) {
      token = tokenCookie[1];
    }
  }

  // 2. Fallback to Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

export default auth;
