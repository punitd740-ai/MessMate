const express = require('express');
const router = express.Router();
const {
  getAvailablePlans,
  purchaseMembership,
  getCurrentMembership,
  pauseMembership,
  resumeMembership,
  cancelMembership,
  getDailyMenu,
  getWeeklyMenu,
  skipMeal,
  getMealSkipHistory,
  getWalletOverview,
  getPaymentHistory,
  submitComplaintFeedback,
  getMyComplaints
} = require('../controllers/studentController');
const { authenticate, authorize } = require('../middleware/auth');

// Public/Semi-public for browsing
router.get('/plans', getAvailablePlans);
router.get('/menu/daily', getDailyMenu);
router.get('/menu/weekly', getWeeklyMenu);

// Student Protected Routes
router.use(authenticate);
router.use(authorize('student'));

// Membership
router.get('/membership/current', getCurrentMembership);
router.post('/membership/purchase', purchaseMembership);
router.post('/membership/pause', pauseMembership);
router.post('/membership/resume', resumeMembership);
router.post('/membership/cancel', cancelMembership);

// Meal Management & Skipping
router.post('/meal/skip', skipMeal);
router.get('/meal/skips', getMealSkipHistory);

// Shared Savings Wallet
router.get('/wallet', getWalletOverview);

// Payments
router.get('/payments', getPaymentHistory);

// Complaints & Feedback
router.post('/complaints', submitComplaintFeedback);
router.get('/complaints', getMyComplaints);

module.exports = router;
