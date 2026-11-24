import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  UtensilsCrossed,
  ArrowUpRight,
  Info,
  Calendar,
  RefreshCw,
  Scale
} from 'lucide-react';
import { api } from '../../api/apiClient';

export default function WalletTab() {
  const [walletOverview, setWalletOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWallet = async () => {
    setLoading(true);
    const res = await api.get('/student/wallet');
    if (res.success) {
      setWalletOverview(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const wallet = walletOverview?.wallet;
  const transactions = walletOverview?.transactions || [];

  return (
    <div className="space-y-8 text-left">
      {/* Hero Banner: Save Together, Benefit Together! */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white p-7 sm:p-10 shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MessMate Exclusive Innovation</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Shared Savings Wallet
            </h1>

            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-xl">
              "Save Together, Benefit Together!" Whenever you skip a meal before the cutoff, the kitchen reduces cooked food quantities. You and the mess owner both share the verified raw material cost savings!
            </p>

            <div className="flex items-center gap-4 pt-1 text-xs text-emerald-200">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Double-Reward Verification</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Transparent Audit Trail</span>
              </div>
            </div>
          </div>

          {/* Right Wallet Display Card */}
          <div className="md:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-emerald-200">
                <span>Available Balance</span>
                <Wallet className="w-4 h-4" />
              </div>
              <div className="text-3xl sm:text-4xl font-black mt-2 tracking-tight">
                ₹{wallet?.balance || 0}
              </div>
              <div className="text-[11px] text-emerald-300 mt-1">
                Redeemable on next plan renewal
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-xs">
              <span className="text-emerald-200">Total Credits Earned:</span>
              <strong className="text-white text-sm">₹{wallet?.studentCreditsEarned || 0}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Transparent Savings Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Meals Skipped */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Meals Skipped</span>
            <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {wallet?.totalMealsSkipped || 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Confirmed timely skips</p>
        </div>

        {/* Metric 2: Verified Savings Generated */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Verified Food Cost Saved</span>
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            ₹{wallet?.totalSavingsGenerated || 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Actual raw ingredient savings</p>
        </div>

        {/* Metric 3: Student Reward Credits */}
        <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-sm">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Student Reward Credits</span>
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700">
            ₹{wallet?.studentCreditsEarned || 0}
          </div>
          <p className="text-[11px] text-emerald-800 mt-1">Directly credited to your wallet</p>
        </div>

        {/* Metric 4: Mess Owner Retained Savings */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Mess Owner Savings</span>
            <Scale className="w-5 h-5 text-slate-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-800">
            ₹{wallet?.messOwnerSavings || 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Retained by mess kitchen</p>
        </div>
      </div>

      {/* How Savings are Calculated Box */}
      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 text-xs text-slate-700 space-y-2.5">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <Info className="w-4 h-4 text-emerald-600" />
          <span>How Your Reward is Verified & Calculated:</span>
        </div>
        <p className="leading-relaxed">
          1. <strong>Pre-Cutoff Notice:</strong> You inform the mess before the cutoff time so the kitchen prepares fewer portions.
        </p>
        <p className="leading-relaxed">
          2. <strong>Kitchen Headcount Reduction:</strong> The head chef cooks less rice, dal, and vegetables, saving direct raw material costs (avg ₹35/meal).
        </p>
        <p className="leading-relaxed">
          3. <strong>Actual Audit:</strong> The mess owner logs actual verified savings. The configured ratio (e.g. 50% Student / 50% Mess Owner) is applied.
        </p>
        <p className="leading-relaxed">
          4. <strong>Instant Credit:</strong> ₹17.50 to ₹35 is instantly deposited into your wallet ledger. No double rewards can ever be calculated.
        </p>
      </div>

      {/* Transparent Ledger Audit History Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Wallet Audit Ledger</h3>
            <p className="text-xs text-slate-400">Complete, transparent history of every verified credit</p>
          </div>
          <button
            onClick={fetchWallet}
            className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Transaction Details</th>
                  <th className="py-3 px-4">Verified Savings</th>
                  <th className="py-3 px-4">Sharing Ratio</th>
                  <th className="py-3 px-4 text-right">Student Credit</th>
                  <th className="py-3 px-4 text-right">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((txn) => (
                  <tr key={txn._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500">
                      {txn.createdAt ? txn.createdAt.split('T')[0] : 'Today'}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 max-w-sm">
                      {txn.description}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {txn.verifiedSavings ? `₹${txn.verifiedSavings}` : '₹35'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {txn.sharingRatio || '50% Student / 50% Mess Owner'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-600 text-sm">
                      +₹{txn.amount}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                      ₹{txn.balanceAfter}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400">
            No wallet transactions yet. Skip a meal to experience the Shared Savings Wallet!
          </div>
        )}
      </div>
    </div>
  );
}
