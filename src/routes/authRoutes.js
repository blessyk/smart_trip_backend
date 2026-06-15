const express = require('express');
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
} = require('../validators/authValidator');

const router = express.Router();

// Public routes
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileValidator, validate, updateProfile);

module.exports = router;
