const JWT          = require('../utils/jwt');
const Store        = require('../storage/store');
const { errorRes } = require('../utils/helpers');

/** Protect routes — verify Bearer JWT from Authorization header */
function protect(req, res, next) {
  try {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) return errorRes(res, 'Not authenticated. Please log in.', 401);

    const decoded = JWT.verify(token);
    const user    = Store.getUserById(decoded.id);
    if (!user) return errorRes(res, 'User no longer exists.', 401);

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return errorRes(res, 'Session expired. Please log in again.', 401);
    return errorRes(res, 'Invalid token. Please log in.', 401);
  }
}

module.exports = { protect };
