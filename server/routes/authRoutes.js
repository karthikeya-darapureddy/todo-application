const router     = require('express').Router();
const auth       = require('../controllers/authController');
const { protect }= require('../middleware/auth');
const upload     = require('../middleware/upload');

router.post('/register',          auth.register);
router.post('/verify-email',      auth.verifyEmail);
router.post('/login',             auth.login);
router.post('/logout',            protect, auth.logout);
router.post('/forgot-password',   auth.forgotPassword);
router.post('/reset-password',    auth.resetPassword);
router.get ('/profile',           protect, auth.getProfile);
router.put ('/profile',           protect, upload.single('avatar'), auth.updateProfile);
router.put ('/change-password',   protect, auth.changePassword);
router.get ('/activity',          protect, auth.getActivity);

module.exports = router;
