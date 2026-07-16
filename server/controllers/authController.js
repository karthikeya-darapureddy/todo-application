const bcrypt  = require('bcryptjs');
const Store   = require('../storage/store');
const JWT     = require('../utils/jwt');
const { sanitizeUser, successRes, errorRes, generateToken } = require('../utils/helpers');

// ─── Register ────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)  return errorRes(res, 'Name, email and password are required.', 400);
    if (password.length < 6)           return errorRes(res, 'Password must be at least 6 characters.', 400);
    if (Store.getUserByEmail(email))   return errorRes(res, 'Email is already registered.', 409);

    const hash  = await bcrypt.hash(password, 10);
    const vToken = generateToken();

    const user = Store.createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hash,
      avatar: null,
      bio: '',
      isVerified: false,
      verificationToken: vToken,
      resetToken: null,
      resetTokenExpiry: null,
    });

    // Console-print the verification link (email fallback)
    const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${vToken}`;
    console.log('\n[Auth] Email verification link (no SMTP configured):');
    console.log('  →', verifyUrl, '\n');

    Store.logActivity(user.id, 'REGISTER', 'Account created');

    const token = JWT.sign({ id: user.id });
    return successRes(res, { token, user: sanitizeUser(user) }, 'Registration successful!', 201);
  } catch (err) {
    return errorRes(res, err.message);
  }
};

// ─── Verify Email ────────────────────────────────────────────────────
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return errorRes(res, 'Verification token is required.', 400);

    const user = Store.getUserByVerifyToken(token);
    if (!user) return errorRes(res, 'Invalid or expired verification token.', 400);

    Store.updateUser(user.id, { isVerified: true, verificationToken: null });
    Store.logActivity(user.id, 'VERIFY_EMAIL', 'Email verified');

    const jwt = JWT.sign({ id: user.id });
    return successRes(res, { token: jwt, user: sanitizeUser(Store.getUserById(user.id)) }, 'Email verified!');
  } catch (err) {
    return errorRes(res, err.message);
  }
};

// ─── Login ───────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return errorRes(res, 'Email and password are required.', 400);

    const user = Store.getUserByEmail(email);
    if (!user) return errorRes(res, 'Invalid email or password.', 401);

    const match = await bcrypt.compare(password, user.password);
    if (!match)  return errorRes(res, 'Invalid email or password.', 401);

    Store.logActivity(user.id, 'LOGIN', 'Logged in');

    const token = JWT.sign({ id: user.id });
    return successRes(res, { token, user: sanitizeUser(user) }, 'Login successful!');
  } catch (err) {
    return errorRes(res, err.message);
  }
};

// ─── Logout ──────────────────────────────────────────────────────────
exports.logout = (req, res) => {
  Store.logActivity(req.user.id, 'LOGOUT', 'Logged out');
  res.clearCookie('token');
  return successRes(res, null, 'Logged out successfully.');
};

// ─── Forgot Password ─────────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return errorRes(res, 'Email is required.', 400);

    const user = Store.getUserByEmail(email);
    // Always respond with 200 to prevent user enumeration
    if (!user) return successRes(res, null, 'If that email is registered, a reset link has been sent.');

    const resetToken  = generateToken(40);
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
    Store.updateUser(user.id, { resetToken, resetTokenExpiry: resetExpiry });

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    console.log('\n[Auth] Password reset link (no SMTP configured):');
    console.log('  →', resetUrl, '\n');

    return successRes(res, null, 'If that email is registered, a reset link has been sent.');
  } catch (err) {
    return errorRes(res, err.message);
  }
};

// ─── Reset Password ──────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return errorRes(res, 'Token and new password are required.', 400);
    if (password.length < 6) return errorRes(res, 'Password must be at least 6 characters.', 400);

    const user = Store.getUserByResetToken(token);
    if (!user) return errorRes(res, 'Invalid or expired reset token.', 400);
    if (new Date(user.resetTokenExpiry) < new Date()) return errorRes(res, 'Reset token has expired.', 400);

    const hash = await bcrypt.hash(password, 10);
    Store.updateUser(user.id, { password: hash, resetToken: null, resetTokenExpiry: null });
    Store.logActivity(user.id, 'RESET_PASSWORD', 'Password reset');

    return successRes(res, null, 'Password reset successful! You can now log in.');
  } catch (err) {
    return errorRes(res, err.message);
  }
};

// ─── Get Profile ─────────────────────────────────────────────────────
exports.getProfile = (req, res) => {
  return successRes(res, { user: sanitizeUser(req.user) });
};

// ─── Update Profile ──────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const updates = {};

    if (name && name.trim()) updates.name = name.trim();
    if (bio !== undefined)   updates.bio  = bio.trim();

    // Handle avatar upload
    if (req.file) {
      updates.avatar = `/uploads/${req.file.filename}`;
    }

    const updated = Store.updateUser(req.user.id, updates);
    Store.logActivity(req.user.id, 'UPDATE_PROFILE', 'Profile updated');

    return successRes(res, { user: sanitizeUser(updated) }, 'Profile updated successfully!');
  } catch (err) {
    return errorRes(res, err.message);
  }
};

// ─── Change Password ─────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return errorRes(res, 'Current and new password are required.', 400);
    if (newPassword.length < 6)           return errorRes(res, 'New password must be at least 6 characters.', 400);

    const user  = Store.getUserById(req.user.id);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return errorRes(res, 'Current password is incorrect.', 400);

    const hash = await bcrypt.hash(newPassword, 10);
    Store.updateUser(user.id, { password: hash });
    Store.logActivity(user.id, 'CHANGE_PASSWORD', 'Password changed');

    return successRes(res, null, 'Password changed successfully!');
  } catch (err) {
    return errorRes(res, err.message);
  }
};

// ─── Get Activity ─────────────────────────────────────────────────────
exports.getActivity = (req, res) => {
  const activity = Store.getActivity(req.user.id);
  return successRes(res, { activity });
};
