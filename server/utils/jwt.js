const jwt = require('jsonwebtoken');

const SECRET     = process.env.JWT_SECRET || 'taskflow_secret_key';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const JWT = {
  sign(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
  },
  verify(token) {
    return jwt.verify(token, SECRET);
  },
  decode(token) {
    return jwt.decode(token);
  },
};

module.exports = JWT;
