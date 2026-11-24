const {
  Messes,
  MealSkipRecords,
  Wallets,
  WalletTransactions,
  Notifications
} = require('../config/dataStore');

/**
 * Shared Savings Engine
 * Implements the core business logic of MessMate's "Save Together, Benefit Together" model.
 */
class SavingsEngine {
  /**
   * Check if meal can still be skipped based on mess cutoff time
   */
  static isBeforeCutoff(mess, mealDateStr, mealType) {
    const cutoffHours = mess.sharedSavingsConfig?.mealCutoffHours?.[mealType] || 2;
    
    // Meal default times (24h format)
    const mealTimes = {
      breakfast: '08:00',
      lunch: '12:30',
      dinner: '20:00'
    };

    const mealTimeStr = mealTimes[mealType] || '12:00';
    const targetMealDateTime = new Date(`${mealDateStr}T${mealTimeStr}:00`);
    const cutoffDateTime = new Date(targetMealDateTime.getTime() - cutoffHours * 60 * 60 * 1000);
    
    const now = new Date();
    return now <= cutoffDateTime;
  }

  /**
   * Calculate estimated raw material savings for a meal
   */
  static getEstimatedSavings(mess) {
    const rawCost = mess.mealCostBreakdown?.rawMaterial || 35;
    return rawCost;
  }

  /**
   * Request / record a meal skip by student
   */
  static async requestMealSkip(studentId, messId, { date, mealType, reason }) {
    const mess = await Messes.findById(messId);
    if (!mess) {
      throw new Error('Mess not found');
    }

    // Check existing skip for same date and meal
    const existing = await MealSkipRecords.findOne({
      studentId,
      messId,
      date,
      mealType
    });

    if (existing) {
      throw new Error(`You have already registered a skip request for ${mealType} on ${date}.`);
    }

    const estimatedSavings = this.getEstimatedSavings(mess);
    const isTimely = this.isBeforeCutoff(mess, date, mealType);

    const record = await MealSkipRecords.create({
      studentId,
      messId,
      date,
      mealType,
      reason: reason || 'Planned absence',
      status: isTimely ? 'confirmed' : 'requested_late',
      estimatedSavings,
      verifiedSavings: 0,
      studentCreditAmount: 0,
      ownerSavingsAmount: 0,
      isWalletCredited: false,
      skippedAt: new Date().toISOString()
    });

    // Notify mess owner about updated meal demand
    await Notifications.create({
      userId: mess.ownerId,
      title: 'Meal Demand Updated',
      message: `A student skipped ${mealType} on ${date}. Kitchen preparation demand reduced by 1 meal.`,
      type: 'meal',
      isRead: false
    });

    return record;
  }

  /**
   * Head Chef / Mess Owner updates kitchen preparation based on confirmed skips
   */
  static async adjustKitchenPreparation(messId, date, mealType) {
    const confirmedSkips = await MealSkipRecords.find({
      messId,
      date,
      mealType,
      status: 'confirmed'
    });

    const updated = [];
    for (const skip of confirmedSkips) {
      const up = await MealSkipRecords.findByIdAndUpdate(skip._id, {
        status: 'kitchen_adjusted'
      });
      updated.push(up);
    }

    return {
      date,
      mealType,
      skipsAdjustedCount: updated.length,
      estimatedIngredientsSavedKg: (updated.length * 0.35).toFixed(2)
    };
  }

  /**
   * Verify actual food cost savings and credit both student wallet and mess owner records
   * Strict anti-double-reward guard: checks `isWalletCredited` is false
   */
  static async verifyAndCreditSavings(skipRecordId, { actualVerifiedSavingsPerMeal, overridePercentage }) {
    const record = await MealSkipRecords.findById(skipRecordId);
    if (!record) {
      throw new Error('Meal skip record not found');
    }

    // Guard: Prevent double crediting
    if (record.isWalletCredited) {
      throw new Error('This skipped meal has already been verified and credited to the student wallet.');
    }

    const mess = await Messes.findById(record.messId);
    if (!mess) {
      throw new Error('Mess not found');
    }

    // Verified savings calculation
    // Never calculate rewards using estimated savings as actual savings; must be verified.
    const verifiedSavings = Number(actualVerifiedSavingsPerMeal) || record.estimatedSavings || 35;

    // Configured split percentage (Mess owner configurable)
    const studentSharePct = overridePercentage !== undefined 
      ? Number(overridePercentage) 
      : (mess.sharedSavingsConfig?.studentRewardPercentage || 50);

    const studentCreditAmount = Math.round(verifiedSavings * (studentSharePct / 100));
    const ownerSavingsAmount = verifiedSavings - studentCreditAmount;

    // 1. Update MealSkipRecord
    const updatedRecord = await MealSkipRecords.findByIdAndUpdate(record._id, {
      status: 'verified_saved',
      verifiedSavings,
      studentCreditAmount,
      ownerSavingsAmount,
      studentRewardPercentageUsed: studentSharePct,
      isWalletCredited: true,
      creditedAt: new Date().toISOString()
    });

    // 2. Fetch or initialize Student Wallet
    let wallet = await Wallets.findOne({ studentId: record.studentId });
    if (!wallet) {
      wallet = await Wallets.create({
        studentId: record.studentId,
        balance: 0,
        totalCreditsEarned: 0,
        totalSavingsGenerated: 0,
        totalMealsSkipped: 0,
        currency: 'INR'
      });
    }

    const newBalance = (Number(wallet.balance) || 0) + studentCreditAmount;
    const newTotalCredits = (Number(wallet.totalCreditsEarned) || 0) + studentCreditAmount;
    const newTotalSavings = (Number(wallet.totalSavingsGenerated) || 0) + verifiedSavings;
    const newTotalSkips = (Number(wallet.totalMealsSkipped) || 0) + 1;

    await Wallets.findByIdAndUpdate(wallet._id, {
      balance: newBalance,
      totalCreditsEarned: newTotalCredits,
      totalSavingsGenerated: newTotalSavings,
      totalMealsSkipped: newTotalSkips,
      lastUpdated: new Date().toISOString()
    });

    // 3. Create transparent audit transaction
    const transaction = await WalletTransactions.create({
      walletId: wallet._id,
      studentId: record.studentId,
      messId: record.messId,
      mealSkipId: record._id,
      type: 'reward_credit',
      amount: studentCreditAmount,
      balanceAfter: newBalance,
      verifiedSavings,
      ownerSavings: ownerSavingsAmount,
      sharingRatio: `${studentSharePct}% Student / ${100 - studentSharePct}% Mess Owner`,
      description: `Verified food cost savings reward for skipped ${record.mealType} on ${record.date}. Save Together, Benefit Together!`,
      status: 'completed'
    });

    // 4. Send Student Notification
    await Notifications.create({
      userId: record.studentId,
      title: 'Shared Savings Reward Credited! 🎉',
      message: `₹${studentCreditAmount} credited to your wallet (${studentSharePct}% of ₹${verifiedSavings} verified food savings) for skipping ${record.mealType} on ${record.date}.`,
      type: 'wallet',
      isRead: false
    });

    return {
      skipRecord: updatedRecord,
      transaction,
      wallet: {
        balance: newBalance,
        creditedAmount: studentCreditAmount,
        ownerSavedAmount: ownerSavingsAmount
      }
    };
  }

  /**
   * Batch verification for an entire shift / day of skipped meals
   */
  static async batchVerifyAndCredit(messId, date, mealType, verifiedPerMeal) {
    const query = {
      messId,
      date,
      isWalletCredited: false
    };
    if (mealType && mealType !== 'all') {
      query.mealType = mealType;
    }

    const eligibleSkips = await MealSkipRecords.find(query);
    const results = [];
    const errors = [];

    for (const skip of eligibleSkips) {
      try {
        const res = await this.verifyAndCreditSavings(skip._id, {
          actualVerifiedSavingsPerMeal: verifiedPerMeal
        });
        results.push(res);
      } catch (err) {
        errors.push({ skipId: skip._id, error: err.message });
      }
    }

    return {
      totalProcessed: results.length,
      totalErrors: errors.length,
      results,
      errors
    };
  }
}

module.exports = SavingsEngine;
