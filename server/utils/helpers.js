/** Sanitise a user object before sending to client (strip password) */
function sanitizeUser(user) {
  if (!user) return null;
  const { password, verificationToken, resetToken, resetTokenExpiry, ...safe } = user;
  return safe;
}

/** Build a standard API success response */
function successRes(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

/** Build a standard API error response */
function errorRes(res, message = 'Server Error', statusCode = 500) {
  return res.status(statusCode).json({ success: false, message });
}

/** Simple token generator (for email verification / password reset) */
function generateToken(len = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < len; i++) token += chars[Math.floor(Math.random() * chars.length)];
  return token;
}

/** Paginate an array */
function paginate(arr, page = 1, limit = 10) {
  const p     = Math.max(1, parseInt(page));
  const l     = Math.min(100, Math.max(1, parseInt(limit)));
  const total = arr.length;
  const pages = Math.ceil(total / l);
  const data  = arr.slice((p - 1) * l, p * l);
  return { data, total, page: p, pages, limit: l };
}

module.exports = { sanitizeUser, successRes, errorRes, generateToken, paginate };
