const {
  Messes,
  Users,
  MembershipPlans,
  MembershipRecords,
  MealMenus,
  MealSkipRecords,
  InventoryItems,
  PurchaseRecords,
  FoodWasteRecords,
  ComplaintFeedback,
  Payments,
  WalletTransactions
} = require('../config/dataStore');
const SavingsEngine = require('../services/savingsEngine');

// Helper to get owner's mess
const getOwnerMess = async (ownerId) => {
  let mess = await Messes.findOne({ ownerId });
  if (!mess) {
    // If not found, create a default mess for this owner
    mess = await Messes.create({
      name: 'Smart Campus Mess',
      ownerId,
      address: 'Main Hostel Block A, University Campus',
      phone: '9876543210',
      email: 'owner@messmate.com',
      cuisineType: 'North & South Indian',
      rating: 4.8,
      status: 'active',
      sharedSavingsConfig: {
        enabled: true,
        studentRewardPercentage: 50,
        ownerRewardPercentage: 50,
        mealCutoffHours: { breakfast: 2, lunch: 3, dinner: 3 }
      },
      mealCostBreakdown: {
        rawMaterial: 35,
        prepLabor: 15,
        fixedOverhead: 10,
        totalPerMeal: 60,
        estimatedSavingsPerSkip: 35
      }
    });
  }
  return mess;
};

// --- Dashboard Overview Stats ---
const getDashboardOverview = async (req, res) => {
  try {
    const mess = await getOwnerMess(req.user._id);
    const messId = mess._id;

    const todayStr = new Date().toISOString().split('T')[0];

    // Memberships
    const memberships = await MembershipRecords.find({ messId });
    const activeMembers = memberships.filter(m => m.status === 'active');
    const pausedMembers = memberships.filter(m => m.status === 'paused');

    // Today's skips
    const todaySkips = await MealSkipRecords.find({ messId, date: todayStr });
    const breakfastSkips = todaySkips.filter(s => s.mealType === 'breakfast').length;
    const lunchSkips = todaySkips.filter(s => s.mealType === 'lunch').length;
    const dinnerSkips = todaySkips.filter(s => s.mealType === 'dinner').length;

    // Kitchen Confirmed Demand = Active members minus skips
    const totalActive = activeMembers.length;
    const confirmedDemand = {
      breakfast: Math.max(0, totalActive - breakfastSkips),
      lunch: Math.max(0, totalActive - lunchSkips),
      dinner: Math.max(0, totalActive - dinnerSkips)
    };

    // Savings metrics
    const allSkips = await MealSkipRecords.find({ messId });
    const verifiedSkips = allSkips.filter(s => s.isWalletCredited);
    const totalVerifiedSavings = verifiedSkips.reduce((sum, s) => sum + (s.verifiedSavings || 0), 0);
    const totalStudentCreditsGiven = verifiedSkips.reduce((sum, s) => sum + (s.studentCreditAmount || 0), 0);
    const totalOwnerSavingsKept = verifiedSkips.reduce((sum, s) => sum + (s.ownerSavingsAmount || 0), 0);

    // Estimated pending savings
    const pendingSkips = allSkips.filter(s => !s.isWalletCredited && s.status !== 'rejected');
    const estimatedPendingSavings = pendingSkips.reduce((sum, s) => sum + (s.estimatedSavings || 35), 0);

    // Low stock inventory alert count
    const inventory = await InventoryItems.find({ messId });
    const lowStockCount = inventory.filter(i => Number(i.currentStock) <= Number(i.minThreshold)).length;

    // Financials
    const payments = await Payments.find({ messId, status: 'successful' });
    const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const purchases = await PurchaseRecords.find({ messId });
    const totalExpenses = purchases.reduce((sum, p) => sum + (Number(p.totalCost) || 0), 0);

    // Pending complaints
    const complaints = await ComplaintFeedback.find({ messId, status: 'pending' });

    return res.json({
      success: true,
      mess,
      stats: {
        totalActiveMembers: totalActive,
        totalPausedMembers: pausedMembers.length,
        todaySkipsCount: todaySkips.length,
        breakfastSkips,
        lunchSkips,
        dinnerSkips,
        confirmedDemand,
        totalVerifiedSavings,
        totalStudentCreditsGiven,
        totalOwnerSavingsKept,
        estimatedPendingSavings,
        pendingSkipsCount: pendingSkips.length,
        lowStockCount,
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses + totalOwnerSavingsKept,
        pendingComplaintsCount: complaints.length
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --- Student & Membership Management ---
const getStudentsList = async (req, res) => {
  try {
    const mess = await getOwnerMess(req.user._id);
    const memberships = await MembershipRecords.find({ messId: mess._id });
    const users = await Users.find({ role: 'student' });

    const studentList = memberships.map(mem => {
      const u = users.find(user => user._id === mem.studentId);
      return {
        membershipId: mem._id,
        studentId: mem.studentId,
        studentName: u?.name || 'Student',
        studentEmail: u?.email || '',
        studentPhone: u?.phone || '',
        planName: mem.planName,
        status: mem.status,
        startDate: mem.startDate,
        endDate: mem.endDate,
        remainingDays: mem.remainingDays,
        dietaryPreference: u?.dietaryPreference || 'Standard'
      };
    });

    return res.json({ success: true, students: studentList });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Membership Plans CRUD
const getPlans = async (req, res) => {
  try {
    const mess = await getOwnerMess(req.user._id);
    const plans = await MembershipPlans.find({ messId: mess._id });
    return res.json({ success: true, plans });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const createPlan = async (req, res) => {
  try {
    const mess = await getOwnerMess(req.user._id);
    const { name, type = 'monthly', durationDays = 30, price, mealsIncluded, description, features } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Plan name and price are required.' });
    }

    const plan = await MembershipPlans.create({
      messId: mess._id,
      name,
      type,
      durationDays: Number(durationDays) || 30,
      price: Number(price),
      mealsIncluded: mealsIncluded || ['breakfast', 'lunch', 'dinner'],
      description: description || '',
      features: features || ['3 Meals / Day', 'Shared Savings Wallet Eligibility', 'Skip Meal Flexibility'],
      active: true
    });

    return res.status(201).json({ success: true, message: 'Membership plan created.', plan });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updatePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const updated = await MembershipPlans.findByIdAndUpdate(planId, req.body);
    return res.json({ success: true, message: 'Plan updated.', plan: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --- Kitchen Management ---
const getKitchenPlanning = async (req, res) => {
  try {
    const mess = await getOwnerMess(req.user._id);
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Active members
    const activeMembers = await MembershipRecords.find({ messId: mess._id, status: 'active' });
    const baseCount = activeMembers.length;

    // Skips for the date
    const skips = await MealSkipRecords.find({ messId: mess._id, date: targetDate });

    const mealStats = ['breakfast', 'lunch', 'dinner'].map(mealType => {
      const mealSkips = skips.filter(s => s.mealType === mealType);
      const confirmedDemand = Math.max(0, baseCount - mealSkips.length);

      // Raw ingredient predictions (per portion estimation: ~100g grains, ~150g vegetables, ~50g lentils/dairy)
      const rawRequirements = {
        grainsKg: (confirmedDemand * 0.12).toFixed(1),
        vegetablesKg: (confirmedDemand * 0.18).toFixed(1),
        pulsesDairyKg: (confirmedDemand * 0.08).toFixed(1)
      };

      return {
        mealType,
        totalEnrolled: baseCount,
        skippedCount: mealSkips.length,
        confirmedDemand,
        rawRequirements,
        skips: mealSkips
      };
    });

    const menu = await MealMenus.findOne({ messId: mess._id, date: targetDate });
    const wasteRecords = await FoodWasteRecords.find({ messId: mess._id, date: targetDate });

    return res.json({
      success: true,
      date: targetDate,
      mealStats,
      menu,
      wasteRecords
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Adjust Kitchen Preparation
const adjustPreparation = async (req, res) => {
  try {
    const mess = await getOwnerMess(req.user._id);
    const { date, mealType } = req.body;

    const result = await SavingsEngine.adjustKitchenPreparation(mess._id, date, mealType);
    return res.json({
      success: true,
      message: `Kitchen adjusted preparation for ${mealType} on ${date}. Food quantities reduced to prevent waste!`,
      result
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Save Menu
const saveMealMenu = async (req, res) => {
  try {
    const mess = await getOwnerMess(req.user._id);
    const { date, breakfast, lunch, dinner, specialNotes } = req.body;

    const existing = await MealMenus.findOne({ messId: mess._id, date });
    let menu;
    if (existing) {
      menu = await MealMenus.findByIdAndUpdate(existing._id, {
        breakfast,
        lunch,
        dinner,
        specialNotes
      });
    } else {
      menu = await MealMenus.create({
        messId: mess._id,
        date,
        breakfast,
        lunch,
        dinner,
        specialNotes
      });
    }

    return res.json({ success: true, message: 'Menu saved successfully.', menu });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Record Food Waste
const recordFoodWaste = async (req, res) => {
  try {
    const mess = await getOwnerMess(req.user._id);
    const { date, mealType, plannedQuantityKg, consumedQuantityKg, wastedQuantityKg, wasteCostEstimated, reason } = req.body;

    const record = await FoodWasteRecords.create({
      messId: mess._id,
      date: date || new Date().toISOString().split('T')[0],
      mealType,
      plannedQuantityKg: Number(plannedQuantityKg) || 0,
      consumedQuantityKg: Number(consumedQuantityKg) || 0,
      wastedQuantityKg: Number(wastedQuantityKg) || 0,
      wasteCostEstimated: Number(wasteCostEstimated) || (Number(wastedQuantityKg) * 40),
      reason: reason || 'Unexpected student absenteeism without prior skip notice',
      recordedBy: req.user.name
    });

    return res.status(201).json({ success: true, message: 'Food waste record logged.', record });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --- Shared Savings Management ---
const getSharedSavingsOverview = async (req, res) => {
  try {
    const mess = await getOwnerMess(req.user._id);
    const skips = await MealSkipRecords.find({ messId: mess._id });
    const users = await Users.find({});

    const enrichedSkips = skips.map(s => {
      const u = users.find(user => user._id === s.studentId);
      return {
        ...s,
        studentName: u?.name || 'Student',
        studentEmail: u?.email || ''
      };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.json({
      success: true,
      config: mess.sharedSavingsConfig,
      mealCostBreakdown: mess.mealCostBreakdown,
      skips: enrichedSkips
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Update Shared Savings Split Percentage Config
const updateSavingsConfig = async (req, res) => {
  try {
    const mess = await getOwnerMess(req.user._id);
    const { studentRewardPercentage, mealCutoffHours, mealCostBreakdown } = req.body;

    const studentPct = Number(studentRewardPercentage);
    if (studentPct < 0 || studentPct > 100) {
      return res.status(400).json({ success: false, message: 'Percentage must be between 0 and 100.' });
    }

    const updated = await Messes.findByIdAndUpdate(mess._id, {
      sharedSavingsConfig: {
        ...mess.sharedSavingsConfig,
        studentRewardPercentage: studentPct,
        ownerRewardPercentage: 100 - studentPct,
        mealCutoffHours: mealCutoffHours || mess.sharedSavingsConfig.mealCutoffHours
      },
      mealCostBreakdown: mealCostBreakdown || mess.mealCostBreakdown
    });

    return res.json({
      success: true,
      message: `Reward sharing percentage updated to ${studentPct}% Student / ${100 - studentPct}% Mess Owner!`,
      mess: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Verify and Credit Savings for single skip record
const verifySkipRecord = async (req, res) => {
  try {
    const { skipRecordId } = req.params;
    const { actualVerifiedSavingsPerMeal, overridePercentage } = req.body;

    const result = await SavingsEngine.verifyAndCreditSavings(skipRecordId, {
      actualVerifiedSavingsPerMeal,
      overridePercentage
    });

    return res.json({
      success: true,
      message: 'Verified savings calculated and student wallet credited!',
      result
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// Batch verify and credit
const batchVerifySkips = async (req, res) => {
  try {
    const mess = await getOwnerMess(req.user._id);
    const { date, mealType, verifiedPerMeal } = req.body;

    const result = await SavingsEngine.batchVerifyAndCredit(mess._id, date, mealType, verifiedPerMeal);
    return res.json({
      success: true,
      message: `Batch verification completed. Processed ${result.totalProcessed} skips.`,
      result
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --- Inventory Management ---
const getInventory = async (req, res) => {
  try {
    const mess = await getOwnerMess(req.user._id);
    const items = await InventoryItems.find({ messId: mess._id });
    const purchases = await PurchaseRecords.find({ messId: mess._id });

    return res.json({ success: true, items, purchases });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const createInventoryItem = async (req, res) => {
  try {
    const mess = await getOwnerMess(req.user._id);
    const { itemName, category, currentStock, unit, minThreshold, costPerUnit } = req.body;

    if (!itemName) {
      return res.status(400).json({ success: false, message: 'Item name is required.' });
    }

    const item = await InventoryItems.create({
      messId: mess._id,
      itemName,
      category: category || 'vegetables',
      currentStock: Number(currentStock) || 0,
      unit: unit || 'kg',
      minThreshold: Number(minThreshold) || 10,
      costPerUnit: Number(costPerUnit) || 0,
      lastRestocked: new Date().toISOString()
    });

    return res.status(201).json({ success: true, message: 'Inventory item added.', item });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateInventoryStock = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { currentStock, addedStock, costPerUnit } = req.body;

    const item = await InventoryItems.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    let newStock = Number(currentStock);
    if (addedStock !== undefined) {
      newStock = (Number(item.currentStock) || 0) + Number(addedStock);
      // Log purchase if added stock
      if (Number(addedStock) > 0) {
        await PurchaseRecords.create({
          messId: item.messId,
          itemName: item.itemName,
          quantity: Number(addedStock),
          unit: item.unit,
          unitPrice: Number(costPerUnit) || item.costPerUnit || 0,
          totalCost: Number(addedStock) * (Number(costPerUnit) || item.costPerUnit || 0),
          supplier: 'Local Wholesale Mandi',
          purchaseDate: new Date().toISOString().split('T')[0],
          invoiceNumber: 'PUR-' + Math.floor(10000 + Math.random() * 90000)
        });
      }
    }

    const updated = await InventoryItems.findByIdAndUpdate(itemId, {
      currentStock: newStock,
      costPerUnit: costPerUnit ? Number(costPerUnit) : item.costPerUnit,
      lastRestocked: new Date().toISOString()
    });

    return res.json({ success: true, message: 'Stock updated.', item: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --- Financial Management & P&L ---
const getFinancialReport = async (req, res) => {
  try {
    const mess = await getOwnerMess(req.user._id);
    const messId = mess._id;

    const payments = await Payments.find({ messId, status: 'successful' });
    const purchases = await PurchaseRecords.find({ messId });
    const skips = await MealSkipRecords.find({ messId, isWalletCredited: true });

    // Revenue
    const totalMembershipRevenue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    // Verified food cost savings kept by owner
    const totalOwnerSavingsRetained = skips.reduce((sum, s) => sum + (Number(s.ownerSavingsAmount) || 0), 0);
    const totalGrossRevenue = totalMembershipRevenue + totalOwnerSavingsRetained;

    // Expenses
    const rawMaterialExpenses = purchases.reduce((sum, p) => sum + (Number(p.totalCost) || 0), 0);
    const fixedExpensesEstimated = 15000; // Utilities, gas, helper wages
    const totalExpenditure = rawMaterialExpenses + fixedExpensesEstimated;

    const netProfit = totalGrossRevenue - totalExpenditure;

    return res.json({
      success: true,
      financials: {
        totalMembershipRevenue,
        totalOwnerSavingsRetained,
        totalGrossRevenue,
        rawMaterialExpenses,
        fixedExpensesEstimated,
        totalExpenditure,
        netProfit,
        profitMarginPct: totalGrossRevenue > 0 ? ((netProfit / totalGrossRevenue) * 100).toFixed(1) : 0
      },
      recentPayments: payments.slice(-10),
      recentPurchases: purchases.slice(-10)
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --- Complaints & Feedback ---
const getComplaints = async (req, res) => {
  try {
    const mess = await getOwnerMess(req.user._id);
    const items = await ComplaintFeedback.find({ messId: mess._id });
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json({ success: true, items });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const respondToComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status, resolutionNotes } = req.body;

    const updated = await ComplaintFeedback.findByIdAndUpdate(complaintId, {
      status: status || 'resolved',
      resolutionNotes: resolutionNotes || '',
      responseDate: new Date().toISOString()
    });

    return res.json({ success: true, message: 'Response recorded.', item: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
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
};
