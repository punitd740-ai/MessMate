const bcrypt = require('bcryptjs');
const {
  Users,
  Messes,
  MembershipPlans,
  MembershipRecords,
  MealMenus,
  MealSkipRecords,
  Wallets,
  WalletTransactions,
  Payments,
  InventoryItems,
  PurchaseRecords,
  FoodWasteRecords,
  ComplaintFeedback,
  Notifications,
  saveDb
} = require('../config/dataStore');

async function seedDatabase(force = false) {
  // If users already exist and not forced, return
  const existingUsers = await Users.find({});
  if (existingUsers.length > 0 && !force) {
    console.log('🌱 [Seed] Database already populated with records.');
    return;
  }

  console.log('🌱 [Seed] Populating fresh realistic seed data for MessMate...');

  // Clear existing
  Users.clear();
  Messes.clear();
  MembershipPlans.clear();
  MembershipRecords.clear();
  MealMenus.clear();
  MealSkipRecords.clear();
  Wallets.clear();
  WalletTransactions.clear();
  Payments.clear();
  InventoryItems.clear();
  PurchaseRecords.clear();
  FoodWasteRecords.clear();
  ComplaintFeedback.clear();
  Notifications.clear();

  const salt = await bcrypt.genSalt(10);
  const passwordHashAdmin = await bcrypt.hash('admin123', salt);
  const passwordHashMess = await bcrypt.hash('mess123', salt);
  const passwordHashStudent = await bcrypt.hash('student123', salt);

  // 1. Super Admin
  const superAdmin = await Users.create({
    _id: 'usr_super_admin_01',
    name: 'Vikramaditya Sharma',
    email: 'admin@messmate.com',
    password: passwordHashAdmin,
    role: 'super_admin',
    phone: '+91 98110 00001',
    address: 'MessMate HQ, Cyber City, Gurugram',
    status: 'active'
  });

  // 2. Mess Owners
  const messOwner1 = await Users.create({
    _id: 'usr_owner_rajesh',
    name: 'Rajesh Kumar Agarwal',
    email: 'rajesh@annapurnamess.com',
    password: passwordHashMess,
    role: 'mess_owner',
    phone: '+91 98200 11223',
    address: 'Near Boys Hostel Gate 2, University Enclave',
    status: 'active'
  });

  const messOwner2 = await Users.create({
    _id: 'usr_owner_suresh',
    name: 'Suresh Patil',
    email: 'suresh@greenleafmess.com',
    password: passwordHashMess,
    role: 'mess_owner',
    phone: '+91 98300 44556',
    address: 'South Campus Food Court, Sector 4',
    status: 'active'
  });

  // 3. Messes
  const mess1 = await Messes.create({
    _id: 'mess_annapurna_01',
    ownerId: messOwner1._id,
    name: 'Annapurna Royal Smart Mess',
    address: 'Gate 2, University Enclave, North Campus',
    phone: '+91 98200 11223',
    email: 'rajesh@annapurnamess.com',
    cuisineType: 'North Indian & Punjabi Homestyle',
    rating: 4.9,
    status: 'active',
    sharedSavingsConfig: {
      enabled: true,
      studentRewardPercentage: 50,
      ownerRewardPercentage: 50,
      mealCutoffHours: {
        breakfast: 2,
        lunch: 3,
        dinner: 3
      }
    },
    mealCostBreakdown: {
      rawMaterial: 35,
      prepLabor: 15,
      fixedOverhead: 10,
      totalPerMeal: 60,
      estimatedSavingsPerSkip: 35
    }
  });

  const mess2 = await Messes.create({
    _id: 'mess_greenleaf_02',
    ownerId: messOwner2._id,
    name: 'Green Leaf Healthy Dining',
    address: 'South Campus Food Court, Sector 4',
    phone: '+91 98300 44556',
    email: 'suresh@greenleafmess.com',
    cuisineType: 'South Indian & Multi-grain Wellness',
    rating: 4.7,
    status: 'active',
    sharedSavingsConfig: {
      enabled: true,
      studentRewardPercentage: 60,
      ownerRewardPercentage: 40,
      mealCutoffHours: {
        breakfast: 2,
        lunch: 3,
        dinner: 3
      }
    },
    mealCostBreakdown: {
      rawMaterial: 38,
      prepLabor: 17,
      fixedOverhead: 15,
      totalPerMeal: 70,
      estimatedSavingsPerSkip: 38
    }
  });

  await Users.findByIdAndUpdate(messOwner1._id, { messId: mess1._id });
  await Users.findByIdAndUpdate(messOwner2._id, { messId: mess2._id });

  // 4. Students
  const student1 = await Users.create({
    _id: 'usr_student_aarav',
    name: 'Aarav Sharma',
    email: 'aarav@student.com',
    password: passwordHashStudent,
    role: 'student',
    phone: '+91 99112 33445',
    address: 'Room 304, Ganga Boys Hostel',
    dietaryPreference: 'Vegetarian',
    messId: mess1._id,
    status: 'active'
  });

  const student2 = await Users.create({
    _id: 'usr_student_priya',
    name: 'Priya Patel',
    email: 'priya@student.com',
    password: passwordHashStudent,
    role: 'student',
    phone: '+91 99223 44556',
    address: 'Room 210, Saraswati Girls Hostel',
    dietaryPreference: 'Jain Friendly / Vegetarian',
    messId: mess1._id,
    status: 'active'
  });

  const student3 = await Users.create({
    _id: 'usr_student_rohit',
    name: 'Rohit Verma',
    email: 'rohit@student.com',
    password: passwordHashStudent,
    role: 'student',
    phone: '+91 99334 55667',
    address: 'Flat 102, Green Glen PG',
    dietaryPreference: 'Non-Vegetarian / Eggitarian',
    messId: mess2._id,
    status: 'active'
  });

  // 5. Membership Plans
  const plan1 = await MembershipPlans.create({
    _id: 'plan_gold_full_01',
    messId: mess1._id,
    name: 'Gold Full Board (3 Meals/Day)',
    type: 'monthly',
    durationDays: 30,
    price: 3600,
    mealsIncluded: ['breakfast', 'lunch', 'dinner'],
    description: 'Complete nutritional balance. All 3 daily meals with unlimited roti and seasonal sabzi.',
    features: ['Breakfast + Lunch + Dinner', 'Shared Savings Wallet (50% verified savings credit)', 'Up to 10 days flexible pause', 'Festival Special Feast included'],
    active: true
  });

  const plan2 = await MembershipPlans.create({
    _id: 'plan_silver_ld_02',
    messId: mess1._id,
    name: 'Silver Lunch & Dinner Essential',
    type: 'monthly',
    durationDays: 30,
    price: 2800,
    mealsIncluded: ['lunch', 'dinner'],
    description: 'Perfect for students attending morning college lectures who only dine for lunch and dinner.',
    features: ['Lunch + Dinner', 'Shared Savings Wallet enabled', 'Up to 7 days pause', 'Transparent invoice generation'],
    active: true
  });

  const plan3 = await MembershipPlans.create({
    _id: 'plan_semester_plat_03',
    messId: mess2._id,
    name: 'Platinum Semester Health Plan',
    type: 'quarterly',
    durationDays: 90,
    price: 9800,
    mealsIncluded: ['breakfast', 'lunch', 'dinner'],
    description: 'Quarterly saver package with 60% student savings share on skipped meals and zero deduction on leaves.',
    features: ['All 3 daily wellness meals', 'High 60% student reward split on skips', 'Up to 20 days pause allowed', 'Priority meal customization'],
    active: true
  });

  // 6. Membership Records
  const today = new Date();
  const thirtyDaysLater = new Date(today.getTime() + 22 * 24 * 60 * 60 * 1000); // 22 remaining days
  const twentyFiveDaysLater = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 remaining days

  const mem1 = await MembershipRecords.create({
    _id: 'mem_aarav_gold_01',
    studentId: student1._id,
    messId: mess1._id,
    planId: plan1._id,
    planName: plan1.name,
    planPrice: plan1.price,
    mealsIncluded: plan1.mealsIncluded,
    status: 'active',
    startDate: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: thirtyDaysLater.toISOString().split('T')[0],
    totalDays: 30,
    remainingDays: 22,
    pausedDaysUsed: 0,
    pauseHistory: [],
    autoRenew: false
  });

  const mem2 = await MembershipRecords.create({
    _id: 'mem_priya_silver_02',
    studentId: student2._id,
    messId: mess1._id,
    planId: plan2._id,
    planName: plan2.name,
    planPrice: plan2.price,
    mealsIncluded: plan2.mealsIncluded,
    status: 'active',
    startDate: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: twentyFiveDaysLater.toISOString().split('T')[0],
    totalDays: 30,
    remainingDays: 15,
    pausedDaysUsed: 0,
    pauseHistory: [],
    autoRenew: true
  });

  const mem3 = await MembershipRecords.create({
    _id: 'mem_rohit_plat_03',
    studentId: student3._id,
    messId: mess2._id,
    planId: plan3._id,
    planName: plan3.name,
    planPrice: plan3.price,
    mealsIncluded: plan3.mealsIncluded,
    status: 'paused',
    startDate: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(today.getTime() + 70 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalDays: 90,
    remainingDays: 70,
    pausedAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    pausedDaysUsed: 2,
    pauseHistory: [{ pausedAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), pauseDays: 5, reason: 'Mid-term practicals home visit' }],
    autoRenew: false
  });

  // 7. Payments
  await Payments.create({
    studentId: student1._id,
    messId: mess1._id,
    membershipRecordId: mem1._id,
    amount: 3600,
    paymentMethod: 'upi',
    transactionId: 'TXN_UPI_9837194819',
    invoiceNumber: 'INV-2026-081',
    status: 'successful',
    paidAt: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString()
  });

  await Payments.create({
    studentId: student2._id,
    messId: mess1._id,
    membershipRecordId: mem2._id,
    amount: 2800,
    paymentMethod: 'card',
    transactionId: 'TXN_CRD_102948102',
    invoiceNumber: 'INV-2026-082',
    status: 'successful',
    paidAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString()
  });

  // 8. Wallets & Shared Savings Transactions
  const wallet1 = await Wallets.create({
    studentId: student1._id,
    balance: 155, // 50 welcome bonus + 105 verified skipped meals rewards
    totalCreditsEarned: 155,
    totalSavingsGenerated: 210, // 3 meals x 70 food cost savings
    totalMealsSkipped: 3,
    currency: 'INR'
  });

  const wallet2 = await Wallets.create({
    studentId: student2._id,
    balance: 120, // 50 bonus + 70 rewards
    totalCreditsEarned: 120,
    totalSavingsGenerated: 140,
    totalMealsSkipped: 2,
    currency: 'INR'
  });

  const wallet3 = await Wallets.create({
    studentId: student3._id,
    balance: 92,
    totalCreditsEarned: 92,
    totalSavingsGenerated: 70,
    totalMealsSkipped: 1,
    currency: 'INR'
  });

  // 9. Meal Skip Records
  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const twoDaysAgoStr = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const tomorrowStr = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Aarav's verified skips
  const skip1 = await MealSkipRecords.create({
    _id: 'skip_aarav_01',
    studentId: student1._id,
    messId: mess1._id,
    date: twoDaysAgoStr,
    mealType: 'dinner',
    reason: 'Attending hackathon dinner with project team',
    status: 'verified_saved',
    estimatedSavings: 35,
    verifiedSavings: 35,
    studentCreditAmount: 35,
    ownerSavingsAmount: 35,
    studentRewardPercentageUsed: 50,
    isWalletCredited: true,
    creditedAt: twoDaysAgoStr
  });

  const skip2 = await MealSkipRecords.create({
    _id: 'skip_aarav_02',
    studentId: student1._id,
    messId: mess1._id,
    date: yesterdayStr,
    mealType: 'lunch',
    reason: 'Lab experiment running overtime',
    status: 'verified_saved',
    estimatedSavings: 35,
    verifiedSavings: 35,
    studentCreditAmount: 35,
    ownerSavingsAmount: 35,
    studentRewardPercentageUsed: 50,
    isWalletCredited: true,
    creditedAt: yesterdayStr
  });

  // Aarav's skip for tomorrow (Upcoming, timely confirmed!)
  const skip3 = await MealSkipRecords.create({
    _id: 'skip_aarav_03',
    studentId: student1._id,
    messId: mess1._id,
    date: tomorrowStr,
    mealType: 'lunch',
    reason: 'Weekend library study group',
    status: 'confirmed',
    estimatedSavings: 35,
    verifiedSavings: 0,
    studentCreditAmount: 0,
    ownerSavingsAmount: 0,
    isWalletCredited: false,
    skippedAt: new Date().toISOString()
  });

  // Priya's skip for today dinner (Ready for kitchen adjustment!)
  const skip4 = await MealSkipRecords.create({
    _id: 'skip_priya_01',
    studentId: student2._id,
    messId: mess1._id,
    date: todayStr,
    mealType: 'dinner',
    reason: 'Family dining out',
    status: 'confirmed',
    estimatedSavings: 35,
    verifiedSavings: 0,
    studentCreditAmount: 0,
    ownerSavingsAmount: 0,
    isWalletCredited: false,
    skippedAt: new Date().toISOString()
  });

  // Transparent Wallet Transactions for Aarav
  await WalletTransactions.create({
    walletId: wallet1._id,
    studentId: student1._id,
    messId: mess1._id,
    mealSkipId: skip1._id,
    type: 'reward_credit',
    amount: 35,
    balanceAfter: 120,
    verifiedSavings: 70,
    ownerSavings: 35,
    sharingRatio: '50% Student / 50% Mess Owner',
    description: `Verified food cost savings reward for skipped dinner on ${twoDaysAgoStr}. Save Together, Benefit Together!`,
    status: 'completed',
    createdAt: twoDaysAgoStr
  });

  await WalletTransactions.create({
    walletId: wallet1._id,
    studentId: student1._id,
    messId: mess1._id,
    mealSkipId: skip2._id,
    type: 'reward_credit',
    amount: 35,
    balanceAfter: 155,
    verifiedSavings: 70,
    ownerSavings: 35,
    sharingRatio: '50% Student / 50% Mess Owner',
    description: `Verified food cost savings reward for skipped lunch on ${yesterdayStr}. Save Together, Benefit Together!`,
    status: 'completed',
    createdAt: yesterdayStr
  });

  // 10. Meal Menus for Today, Yesterday & Tomorrow
  await MealMenus.create({
    messId: mess1._id,
    date: todayStr,
    breakfast: {
      items: ['Aloo Paratha with Fresh Curd', 'Mint Green Chutney', 'Poha with Roasted Peanuts', 'Masala Chai / Filter Coffee'],
      startTime: '07:30',
      endTime: '09:30'
    },
    lunch: {
      items: ['Paneer Butter Masala', 'Yellow Dal Tadka', 'Jeera Rice', 'Tandoori Roti (Unlimited)', 'Boondi Raita & Fresh Green Salad'],
      startTime: '12:30',
      endTime: '14:30'
    },
    dinner: {
      items: ['Matar Mushroom Masala', 'Dal Makhani', 'Steamed Basmati Rice', 'Butter Naan / Phulka', 'Gulab Jamun (1 pc)'],
      startTime: '19:30',
      endTime: '21:30'
    },
    specialNotes: 'Fresh curd and butter churned in-house. Please inform by 10 AM if skipping lunch to save food!'
  });

  await MealMenus.create({
    messId: mess1._id,
    date: tomorrowStr,
    breakfast: {
      items: ['Idli Sambar with Coconut & Tomato Chutney', 'Medu Vada', 'Upma', 'Ginger Tea'],
      startTime: '07:30',
      endTime: '09:30'
    },
    lunch: {
      items: ['Rajma Masala (Punjabi Style)', 'Kadhi Pakora', 'Steamed Rice', 'Tawa Butter Roti', 'Pickle & Papad'],
      startTime: '12:30',
      endTime: '14:30'
    },
    dinner: {
      items: ['Palak Paneer', 'Chana Dal Fry', 'Jeera Rice', 'Tawa Phulka', 'Moong Dal Halwa'],
      startTime: '19:30',
      endTime: '21:30'
    },
    specialNotes: 'Weekend Special: Moong Dal Halwa served hot at dinner.'
  });

  // 11. Inventory Items
  const inv1 = await InventoryItems.create({
    messId: mess1._id,
    itemName: 'Royal Basmati Rice',
    category: 'grains',
    currentStock: 120,
    unit: 'kg',
    minThreshold: 50,
    costPerUnit: 75,
    lastRestocked: todayStr
  });

  const inv2 = await InventoryItems.create({
    messId: mess1._id,
    itemName: 'Toor Dal Premium',
    category: 'grains',
    currentStock: 45,
    unit: 'kg',
    minThreshold: 30,
    costPerUnit: 140,
    lastRestocked: todayStr
  });

  const inv3 = await InventoryItems.create({
    messId: mess1._id,
    itemName: 'Fresh Malai Paneer',
    category: 'dairy',
    currentStock: 14,
    unit: 'kg',
    minThreshold: 20, // Low stock trigger!
    costPerUnit: 340,
    lastRestocked: yesterdayStr
  });

  const inv4 = await InventoryItems.create({
    messId: mess1._id,
    itemName: 'Desi Mustard & Refined Oil',
    category: 'oil',
    currentStock: 8,
    unit: 'liters',
    minThreshold: 15, // Low stock trigger!
    costPerUnit: 155,
    lastRestocked: yesterdayStr
  });

  const inv5 = await InventoryItems.create({
    messId: mess1._id,
    itemName: 'Red Onions & Fresh Potatoes',
    category: 'vegetables',
    currentStock: 90,
    unit: 'kg',
    minThreshold: 40,
    costPerUnit: 28,
    lastRestocked: todayStr
  });

  // 12. Purchase Records
  await PurchaseRecords.create({
    messId: mess1._id,
    itemName: 'Royal Basmati Rice (50kg Bag)',
    quantity: 100,
    unit: 'kg',
    unitPrice: 75,
    totalCost: 7500,
    supplier: 'Aggarwal Wholesale Mandi, Delhi',
    purchaseDate: yesterdayStr,
    invoiceNumber: 'PUR-9821'
  });

  await PurchaseRecords.create({
    messId: mess1._id,
    itemName: 'Fresh Malai Paneer',
    quantity: 25,
    unit: 'kg',
    unitPrice: 340,
    totalCost: 8500,
    supplier: 'Gokul Dairy Cooperative',
    purchaseDate: yesterdayStr,
    invoiceNumber: 'PUR-9822'
  });

  // 13. Food Waste Log
  await FoodWasteRecords.create({
    messId: mess1._id,
    date: yesterdayStr,
    mealType: 'dinner',
    plannedQuantityKg: 45,
    consumedQuantityKg: 42.5,
    wastedQuantityKg: 2.5,
    wasteCostEstimated: 150,
    reason: '6 unannounced student leaves who did not skip in advance on MessMate',
    recordedBy: 'Chef Harish (Head Cook)'
  });

  // 14. Complaints & Feedback
  await ComplaintFeedback.create({
    studentId: student2._id,
    studentName: student2.name,
    messId: mess1._id,
    type: 'feedback',
    category: 'food_quality',
    rating: 5,
    subject: 'Paneer Butter Masala was exceptional!',
    description: 'The paneer was soft, fresh, and not overly spicy. Loved the homestyle flavour.',
    status: 'resolved',
    resolutionNotes: 'Thank you Priya! Our chef uses fresh morning dairy batches. Happy to serve you.',
    createdAt: yesterdayStr
  });

  await ComplaintFeedback.create({
    studentId: student1._id,
    studentName: student1.name,
    messId: mess1._id,
    type: 'complaint',
    category: 'service',
    rating: 3,
    subject: 'Roti serving queue slightly slow on Monday lunch',
    description: 'There was a 10 minute wait near the hot tandoor section around 1:15 PM.',
    status: 'in_progress',
    resolutionNotes: 'We have added a second chef on the tandoor counter starting today.',
    createdAt: todayStr
  });

  // Save to persistent file
  saveDb();
  console.log('✅ [Seed] Successfully seeded MessMate with realistic enterprise dataset.');
  console.log('   Users: Super Admin (admin@messmate.com), Mess Owner (rajesh@annapurnamess.com), Student (aarav@student.com).');
}

module.exports = { seedDatabase };
