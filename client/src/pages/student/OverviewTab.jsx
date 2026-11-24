import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Wallet,
  Clock,
  Sparkles,
  TrendingUp,
  AlertCircle,
  UtensilsCrossed,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';
import { api } from '../../api/apiClient';

export default function OverviewTab({ user, onNavigateTab }) {
  const [membershipData, setMembershipData] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [todayMenu, setTodayMenu] = useState(null);
  const [recentSkips, setRecentSkips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [memRes, walRes, menuRes, skipsRes] = await Promise.all([
      api.get('/student/membership/current'),
      api.get('/student/wallet'),
      api.get('/student/menu/daily'),
      api.get('/student/meal/skips')
    ]);

    if (memRes.success) setMembershipData(memRes);
    if (walRes.success) setWalletData(walRes);
    if (menuRes.success && menuRes.menu) setTodayMenu(menuRes.menu);
    if (skipsRes.success) setRecentSkips(skipsRes.skips || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-slate-200 rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const membership = membershipData?.membership;
  const wallet = walletData?.wallet;
  const transactions = walletData?.transactions || [];

  return (
    <div className="space-y-7 text-left">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 text-white p-7 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-emerald-200 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Student Convenience Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {user?.name}! 🥗
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1">
              Dining at <strong className="text-white">{membership?.messName || 'Annapurna Royal Smart Mess'}</strong>
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onNavigateTab('meals')}
              className="px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Skip a Meal</span>
            </button>
            <button
              onClick={() => onNavigateTab('wallet')}
              className="px-4 py-2 bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Wallet className="w-4 h-4" />
              <span>View Wallet</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Membership Days */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Remaining Days</span>
            <CalendarDays className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {membership ? membership.remainingDays : 0}
            </span>
            <span className="text-xs text-slate-500">/ {membership?.totalDays || 30} days</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">
              {membership?.status === 'active' ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active Plan
                </span>
              ) : (
                <span className="text-amber-600 font-semibold">{membership?.status || 'No Plan'}</span>
              )}
            </span>
            <button
              onClick={() => onNavigateTab('membership')}
              className="text-emerald-700 font-bold hover:underline"
            >
              Manage &rarr;
            </button>
          </div>
        </div>

        {/* Card 2: Shared Savings Wallet */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Wallet Balance</span>
            <Wallet className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-emerald-600">
              ₹{wallet?.balance || 0}
            </span>
            <span className="text-xs text-slate-500 font-medium">Credits</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
            <span>Verified Savings Split</span>
            <button
              onClick={() => onNavigateTab('wallet')}
              className="text-emerald-700 font-bold hover:underline"
            >
              Details &rarr;
            </button>
          </div>
        </div>

        {/* Card 3: Total Food Waste Saved */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Food Saved</span>
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-slate-900">
              ₹{wallet?.totalSavingsGenerated || 0}
            </span>
            <span className="text-xs text-slate-500">food cost</span>
          </div>
          <div className="mt-2.5 text-[11px] text-slate-500">
            Mess Owner Kept: <strong className="text-slate-700">₹{wallet?.messOwnerSavings || 0}</strong>
          </div>
        </div>

        {/* Card 4: Meals Skipped */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Meals Skipped</span>
            <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-slate-900">
              {wallet?.totalMealsSkipped || 0}
            </span>
            <span className="text-xs text-slate-500">meals in advance</span>
          </div>
          <div className="mt-2.5 text-[11px] text-emerald-700 font-medium">
            Zero food was wasted!
          </div>
        </div>
      </div>

      {/* Main Row: Today's Menu & Live Skip Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Left Column: Today's Fresh Menu */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Today's Daily Menu</h3>
                <p className="text-xs text-slate-400">Fresh hot meals prepared according to confirmed headcount</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('meals')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Full Week &rarr;
            </button>
          </div>

          {todayMenu ? (
            <div className="space-y-4">
              {/* Breakfast */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                    Breakfast
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {todayMenu.breakfast?.startTime || '07:30'} - {todayMenu.breakfast?.endTime || '09:30'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {todayMenu.breakfast?.items?.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium bg-white text-slate-700 rounded-lg border border-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lunch */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                    Lunch
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {todayMenu.lunch?.startTime || '12:30'} - {todayMenu.lunch?.endTime || '14:30'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {todayMenu.lunch?.items?.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium bg-white text-slate-700 rounded-lg border border-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dinner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                    Dinner
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {todayMenu.dinner?.startTime || '19:30'} - {todayMenu.dinner?.endTime || '21:30'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {todayMenu.dinner?.items?.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium bg-white text-slate-700 rounded-lg border border-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No menu published yet for today. Check back shortly.
            </div>
          )}
        </div>

        {/* Right Column: Recent Wallet Rewards & Skips */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Skip Promo */}
          <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-slate-800">
            <div className="flex items-center gap-2 mb-2 text-emerald-800">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-sm">Save Together, Benefit Together!</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Planning to dine outside with friends tomorrow? Skip your meal before the cutoff time so the kitchen prepares less food, and get your 50% food savings credited directly!
            </p>
            <button
              onClick={() => onNavigateTab('meals')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
            >
              Skip Next Meal in Advance
            </button>
          </div>

          {/* Recent Audit Credits */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-900">Recent Wallet Credits</h4>
              <button
                onClick={() => onNavigateTab('wallet')}
                className="text-xs text-emerald-700 font-semibold hover:underline"
              >
                View Ledger
              </button>
            </div>

            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.slice(0, 3).map((txn) => (
                  <div
                    key={txn._id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">{txn.description}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Ratio: {txn.sharingRatio || '50% Student / 50% Mess Owner'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600 text-sm">
                        +₹{txn.amount}
                      </div>
                      <div className="text-[10px] text-slate-400">Balance: ₹{txn.balanceAfter}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                No credits yet. Skip a meal to start earning rewards!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
