const express = require('express');
const {
  getAllUsers,
  getUserById,
  deleteUser,
  getAiLogs,
  getGeminiModelSetting,
  updateGeminiModelSetting,
  getAvailableGeminiModels
} = require('../controllers/adminController');
const { getAllTrips } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Apply protection and admin authorization globally to all routes in this router
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

router.get('/trips', getAllTrips);
router.get('/ai-logs', getAiLogs);

router.get('/settings/gemini-model', getGeminiModelSetting);
router.put('/settings/gemini-model', updateGeminiModelSetting);
router.get('/settings/gemini-available-models', getAvailableGeminiModels);

module.exports = router;
