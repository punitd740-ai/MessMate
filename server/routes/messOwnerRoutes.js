const express = require('express');
const router = express.Router();
const {
  getDashboardOverview,
  getStudentsList,
  getPlans,
  createPlan,
  updatePlan,
  getKitchenPlanning,
  adjustPreparation,
  saveMealMenu,
  recordFoodWaste,
  getSharedSavingsOverview,
  updateSavingsConfig,
  verifySkipRecord,
  batchVerifySkips,
  getInventory,
  createInventoryItem,
  updateInventoryStock,
  getFinancialReport,
  getComplaints,
  respondToComplaint
} = require('../controllers/messOwnerController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.use(authorize('mess_owner', 'super_admin'));

// Dashboard Overview
router.get('/overview', getDashboardOverview);

// Students & Memberships
router.get('/students', getStudentsList);
router.get('/plans', getPlans);
router.post('/plans', createPlan);
router.put('/plans/:planId', updatePlan);

// Kitchen Management
router.get('/kitchen/planning', getKitchenPlanning);
router.post('/kitchen/adjust', adjustPreparation);
router.post('/kitchen/menu', saveMealMenu);
router.post('/kitchen/waste', recordFoodWaste);

// Shared Savings Management
router.get('/savings/overview', getSharedSavingsOverview);
router.put('/savings/config', updateSavingsConfig);
router.post('/savings/verify/:skipRecordId', verifySkipRecord);
router.post('/savings/batch-verify', batchVerifySkips);

// Inventory Management
router.get('/inventory', getInventory);
router.post('/inventory', createInventoryItem);
router.put('/inventory/:itemId', updateInventoryStock);

// Financials
router.get('/financials', getFinancialReport);

// Complaints
router.get('/complaints', getComplaints);
router.put('/complaints/:complaintId', respondToComplaint);

module.exports = router;
