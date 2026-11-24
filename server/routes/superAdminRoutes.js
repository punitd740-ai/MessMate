const express = require('express');
const router = express.Router();
const {
  getPlatformOverview,
  getMessOwners,
  getStudents,
  toggleUserStatus,
  getMesses,
  getTransactions,
  getAllComplaints,
  getAiPreviewMetrics
} = require('../controllers/superAdminController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.use(authorize('super_admin'));

router.get('/overview', getPlatformOverview);
router.get('/mess-owners', getMessOwners);
router.get('/students', getStudents);
router.put('/users/:userId/status', toggleUserStatus);
router.get('/messes', getMesses);
router.get('/transactions', getTransactions);
router.get('/complaints', getAllComplaints);
router.get('/ai-preview', getAiPreviewMetrics);

module.exports = router;
