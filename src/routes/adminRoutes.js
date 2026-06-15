const express = require('express');
const {
  getAllUsers,
  getUserById,
  deleteUser,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Apply protection and admin authorization globally to all routes in this router
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

module.exports = router;
