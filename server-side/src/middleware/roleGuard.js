/**
 * Role-based access control middleware.
 * Accepts one or more allowed roles and rejects requests from users without a matching role.
 * Must be used AFTER the auth middleware (req.user must exist).
 *
 * Usage: roleGuard('admin')  or  roleGuard('staff', 'admin')
 */
const roleGuard = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions for this action.' });
    }

    next();
  };
};

export default roleGuard;
