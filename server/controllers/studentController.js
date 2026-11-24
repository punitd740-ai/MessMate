const {
  Messes,
  MembershipPlans,
  MembershipRecords,
  MealMenus,
  MealSkipRecords,
  Wallets,
  WalletTransactions,
  Payments,
  ComplaintFeedback,
  Notifications
} = require('../config/dataStore');
const SavingsEngine = require('../services/savingsEngine');

// --- Membership Management ---

// View all available mess memberships
const getAvailablePlans = async (req, res) => {
  try {
    const plans = await MembershipPlans.find({ active: true });
    const messes = await Messes.find({ status: 'active' });

    // Attach mess details to plans
    const enrichedPlans = plans.map(plan => {
      const mess = messes.find(m => m._id === plan.messId);
      return {
        ...plan,
        messName: mess?.name || 'MessMate Partner',
        messAddress: mess?.address || '',
        messRating: mess?.rating || 4.5,
        sharedSavingsConfig: mess?.sharedSavingsConfig
      };
    });

    return res.json({ success: true, plans: enrichedPlans, messes });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Purchase and activate a membership plan
const purchaseMembership = async (req, res) => {
  try {
    const { planId, paymentMethod = 'upi' } = req.body;
    const studentId = req.user._id;

    const plan = await MembershipPlans.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Membership plan not found.' });
    }

    const mess = await Messes.findById(plan.messId);
    if (!mess) {
      return res.status(404).json({ success: false, message: 'Mess not found.' });
    }

    // Check if student already has an active membership
    const activeExisting = await MembershipRecords.findOne({
      studentId,
      status: 'active'
    });

    if (activeExisting) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active membership. You can renew after it expires or cancel it first.'
      });
    }

    const startDate = new Date();
    const durationDays = plan.durationDays || 30;
    const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    // Create Membership Record
    const membership = await MembershipRecords.create({
      studentId,
      messId: plan.messId,
      planId: plan._id,
      planName: plan.name,
      planPrice: plan.price,
      mealsIncluded: plan.mealsIncluded || ['breakfast', 'lunch', 'dinner'],
      status: 'active',
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      totalDays: durationDays,
      remainingDays: durationDays,
      pausedDaysUsed: 0,
      pauseHistory: [],
      autoRenew: false
    });

    // Create Payment Record
    const invoiceNum = 'INV-' + Math.floor(100000 + Math.random() * 900000);
    const payment = await Payments.create({
      studentId,
      messId: plan.messId,
      membershipRecordId: membership._id,
      amount: plan.price,
      paymentMethod,
      transactionId: 'TXN_' + Date.now().toString(36).toUpperCase(),
      invoiceNumber: invoiceNum,
      status: 'successful',
      paidAt: new Date().toISOString()
    });

    // Notify student
    await Notifications.create({
      userId: studentId,
      title: 'Membership Activated! 🥗',
      message: `Your membership for ${plan.name} at ${mess.name} is now active for ${durationDays} days.`,
      type: 'membership',
      isRead: false
    });

    return res.status(201).json({
      success: true,
      message: 'Membership activated successfully!',
      membership,
      payment
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// View current active membership with live day counting
const getCurrentMembership = async (req, res) => {
  try {
    const studentId = req.user._id;
    const memberships = await MembershipRecords.find({ studentId });
    
    // Sort by createdAt descending
    const current = memberships.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    if (!current) {
      return res.json({ success: true, hasMembership: false, membership: null });
    }

    // Dynamic remaining days calculation
    let remainingDays = current.remainingDays;
    if (current.status === 'active') {
      const now = new Date();
      const end = new Date(current.endDate);
      const diffMs = end.getTime() - now.getTime();
      const calculatedRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      remainingDays = calculatedRemaining;

      // Auto-expire if days are 0
      if (calculatedRemaining <= 0 && current.status === 'active') {
        await MembershipRecords.findByIdAndUpdate(current._id, {
          status: 'expired',
          remainingDays: 0
        });
        current.status = 'expired';
        current.remainingDays = 0;
      }
    }

    const mess = await Messes.findById(current.messId);

    return res.json({
      success: true,
      hasMembership: true,
      membership: {
        ...current,
        remainingDays,
        messName: mess?.name || 'MessMate Partner',
        messPhone: mess?.phone,
        messAddress: mess?.address
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Pause membership
const pauseMembership = async (req, res) => {
  try {
    const { membershipId, pauseDays = 7, reason } = req.body;
    const studentId = req.user._id;

    const membership = await MembershipRecords.findById(membershipId);
    if (!membership || membership.studentId !== studentId) {
      return res.status(404).json({ success: false, message: 'Membership not found.' });
    }

    if (membership.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Cannot pause membership in '${membership.status}' state.`
      });
    }

    const maxPauseAllowed = 15;
    const currentPausedUsed = membership.pausedDaysUsed || 0;
    if (currentPausedUsed + Number(pauseDays) > maxPauseAllowed) {
      return res.status(400).json({
        success: false,
        message: `Policy limit: Maximum cumulative pause allowed is ${maxPauseAllowed} days. You have used ${currentPausedUsed} days.`
      });
    }

    const updated = await MembershipRecords.findByIdAndUpdate(membership._id, {
      status: 'paused',
      pausedAt: new Date().toISOString(),
      pausedDaysUsed: currentPausedUsed + Number(pauseDays),
      pauseHistory: [
        ...(membership.pauseHistory || []),
        {
          pausedAt: new Date().toISOString(),
          pauseDays: Number(pauseDays),
          reason: reason || 'Travel / Exam leave'
        }
      ]
    });

    return res.json({
      success: true,
      message: `Membership paused for ${pauseDays} days. Days will not be deducted while paused.`,
      membership: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Resume membership
const resumeMembership = async (req, res) => {
  try {
    const { membershipId } = req.body;
    const studentId = req.user._id;

    const membership = await MembershipRecords.findById(membershipId);
    if (!membership || membership.studentId !== studentId) {
      return res.status(404).json({ success: false, message: 'Membership not found.' });
    }

    if (membership.status !== 'paused') {
      return res.status(400).json({ success: false, message: 'Membership is not currently paused.' });
    }

    // Push out endDate by actual paused duration
    const pausedDate = new Date(membership.pausedAt || new Date());
    const now = new Date();
    const pauseDurationDays = Math.max(1, Math.ceil((now.getTime() - pausedDate.getTime()) / (1000 * 60 * 60 * 24)));

    const currentEndDate = new Date(membership.endDate);
    const newEndDate = new Date(currentEndDate.getTime() + pauseDurationDays * 24 * 60 * 60 * 1000);

    const updated = await MembershipRecords.findByIdAndUpdate(membership._id, {
      status: 'active',
      pausedAt: null,
      endDate: newEndDate.toISOString().split('T')[0]
    });

    return res.json({
      success: true,
      message: `Membership resumed! Expiry date extended by ${pauseDurationDays} days.`,
      membership: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Cancel membership
const cancelMembership = async (req, res) => {
  try {
    const { membershipId, cancellationReason } = req.body;
    const studentId = req.user._id;

    const membership = await MembershipRecords.findById(membershipId);
    if (!membership || membership.studentId !== studentId) {
      return res.status(404).json({ success: false, message: 'Membership not found.' });
    }

    if (['cancelled', 'expired'].includes(membership.status)) {
      return res.status(400).json({ success: false, message: 'Membership is already closed.' });
    }

    const updated = await MembershipRecords.findByIdAndUpdate(membership._id, {
      status: 'cancelled',
      cancellationReason: cancellationReason || 'Student requested cancellation',
      cancelledAt: new Date().toISOString()
    });

    return res.json({
      success: true,
      message: 'Membership cancelled according to mess policy.',
      membership: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --- Meal Management ---

// View daily menus
const getDailyMenu = async (req, res) => {
  try {
    const { messId, date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const query = { date: targetDate };
    if (messId) query.messId = messId;

    const menu = await MealMenus.findOne(query);
    return res.json({ success: true, date: targetDate, menu });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// View weekly menu
const getWeeklyMenu = async (req, res) => {
  try {
    const { messId } = req.query;
    const query = messId ? { messId } : {};
    const menus = await MealMenus.find(query);
    return res.json({ success: true, menus });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Skip a meal in advance
const skipMeal = async (req, res) => {
  try {
    const { messId, date, mealType, reason } = req.body;
    const studentId = req.user._id;

    if (!messId || !date || !mealType) {
      return res.status(400).json({
        success: false,
        message: 'Mess ID, date, and meal type (breakfast/lunch/dinner) are required.'
      });
    }

    const skipRecord = await SavingsEngine.requestMealSkip(studentId, messId, {
      date,
      mealType,
      reason
    });

    return res.status(201).json({
      success: true,
      message: `Meal skip registered for ${mealType} on ${date}. Food preparation will be adjusted and verified savings will be credited to your wallet!`,
      skipRecord
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// View upcoming and historical skipped meals
const getMealSkipHistory = async (req, res) => {
  try {
    const studentId = req.user._id;
    const skips = await MealSkipRecords.find({ studentId });
    const messes = await Messes.find({});

    const enrichedSkips = skips.map(skip => {
      const mess = messes.find(m => m._id === skip.messId);
      return {
        ...skip,
        messName: mess?.name || 'MessMate Partner'
      };
    });

    // Sort descending by date
    enrichedSkips.sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.json({ success: true, skips: enrichedSkips });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --- Shared Savings Wallet ---

// Get wallet overview with transparent savings calculations
const getWalletOverview = async (req, res) => {
  try {
    const studentId = req.user._id;
    let wallet = await Wallets.findOne({ studentId });

    if (!wallet) {
      wallet = await Wallets.create({
        studentId,
        balance: 0,
        totalCreditsEarned: 0,
        totalSavingsGenerated: 0,
        totalMealsSkipped: 0,
        currency: 'INR'
      });
    }

    const transactions = await WalletTransactions.find({ studentId });
    transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Calculate transparent totals
    const studentCreditsEarned = wallet.totalCreditsEarned || 0;
    const totalSavingsGenerated = wallet.totalSavingsGenerated || 0;
    const messOwnerSavings = Math.max(0, totalSavingsGenerated - studentCreditsEarned);

    return res.json({
      success: true,
      tagline: 'Save Together, Benefit Together!',
      wallet: {
        ...wallet,
        studentCreditsEarned,
        totalSavingsGenerated,
        messOwnerSavings,
        totalMealsSkipped: wallet.totalMealsSkipped || 0
      },
      transactions
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --- Payments & Invoices ---

const getPaymentHistory = async (req, res) => {
  try {
    const studentId = req.user._id;
    const payments = await Payments.find({ studentId });
    const messes = await Messes.find({});

    const enriched = payments.map(p => {
      const mess = messes.find(m => m._id === p.messId);
      return {
        ...p,
        messName: mess?.name || 'MessMate Partner'
      };
    }).sort((a, b) => new Date(b.paidAt || b.createdAt) - new Date(a.paidAt || a.createdAt));

    return res.json({ success: true, payments: enriched });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --- Complaints & Feedback ---

const submitComplaintFeedback = async (req, res) => {
  try {
    const { messId, type = 'complaint', category, rating, subject, description } = req.body;
    const studentId = req.user._id;

    if (!messId || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Mess ID, subject, and description are required.'
      });
    }

    const item = await ComplaintFeedback.create({
      studentId,
      studentName: req.user.name,
      messId,
      type,
      category: category || 'food_quality',
      rating: rating ? Number(rating) : 5,
      subject,
      description,
      status: 'pending',
      resolutionNotes: '',
      createdAt: new Date().toISOString()
    });

    // Notify mess owner
    const mess = await Messes.findById(messId);
    if (mess) {
      await Notifications.create({
        userId: mess.ownerId,
        title: `New ${type.toUpperCase()} Submitted`,
        message: `${req.user.name} posted: "${subject}" (${category})`,
        type: 'system',
        isRead: false
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Submitted successfully! The mess management will review and respond.',
      item
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getMyComplaints = async (req, res) => {
  try {
    const studentId = req.user._id;
    const items = await ComplaintFeedback.find({ studentId });
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json({ success: true, items });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
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
};
