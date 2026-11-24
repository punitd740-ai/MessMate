import React, { useState, useEffect } from 'react';
import {
  Users,
  UtensilsCrossed,
  TrendingUp,
  Package,
  Wallet,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  RefreshCw,
  ChefHat,
  MessageSquare
} from 'lucide-react';
import { api } from '../../api/apiClient';

export default function OwnerOverviewTab({ onNavigateTab }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    setLoading(true);
    const res = await api.get('/owner/overview');
    if (res.success) {
      setData(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOverview();
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

  const mess = data?.mess;
  const stats = data?.stats;
  const demand = stats?.confirmedDemand || { breakfast: 0, lunch: 0, dinner: 0 };

  return (
    <div className="space-y-7 text-left">
      {/* Top Mess Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 text-white p-7 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-emerald-300 text-xs font-semibold mb-2">
              <ChefHat className="w-3.5 h-3.5" />
              <span>Mess Owner & Kitchen Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {mess?.name || 'Smart Campus Mess'}
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 flex items-center gap-2">
              <span>{mess?.cuisineType || 'Homestyle Dining'}</span>
              <span>•</span>
              <span className="text-amber-300 font-bold">★ {mess?.rating || 4.9} Customer Rating</span>
              <span>•</span>
              <span className="text-slate-300">{mess?.address}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigateTab('kitchen')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Kitchen Demand</span>
            </button>
            <button
              onClick={() => onNavigateTab('savings')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Verify Skips & Savings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Critical Alert Bar: Low Stock & Pending Skips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats?.lowStockCount > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong>Low Stock Warning:</strong> {stats.lowStockCount} ingredient(s) are below the reorder threshold.
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-amber-800 font-bold hover:underline shrink-0"
            >
              Restock &rarr;
            </button>
          </div>
        )}

        {stats?.pendingSkipsCount > 0 && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Shared Savings:</strong> {stats.pendingSkipsCount} skipped meal(s) ready for kitchen verification.
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('savings')}
              className="text-emerald-800 font-bold hover:underline shrink-0"
            >
              Verify Now &rarr;
            </button>
          </div>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Enrolled Students */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Students</span>
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {stats?.totalActiveMembers || 0}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between items-center">
            <span>+{stats?.totalPausedMembers || 0} currently on paused leave</span>
            <button
              onClick={() => onNavigateTab('students')}
              className="text-emerald-700 font-bold hover:underline"
            >
              View &rarr;
            </button>
          </div>
        </div>

        {/* Card 2: Today's Confirmed Demand */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Headcount</span>
            <UtensilsCrossed className="w-5 h-5 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {demand.lunch} Lunch
            </span>
            <span className="text-xs text-slate-500">/ {demand.dinner} Dinner</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Reduced by {stats?.todaySkipsCount || 0} confirmed skips
          </p>
        </div>

        {/* Card 3: Verified Food Savings Retained */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Owner Savings Retained</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-emerald-700">
              ₹{stats?.totalOwnerSavingsKept || 0}
            </span>
            <span className="text-xs text-slate-500">retained</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            +₹{stats?.totalStudentCreditsGiven || 0} shared with students
          </p>
        </div>

        {/* Card 4: Net Revenue & Profit */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Revenue</span>
            <Wallet className="w-5 h-5 text-slate-700" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-slate-900">
              ₹{stats?.totalRevenue || 0}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Est. Profit: <strong className="text-emerald-700">₹{stats?.netProfit || 0}</strong></span>
            <button
              onClick={() => onNavigateTab('financials')}
              className="text-emerald-700 font-bold hover:underline"
            >
              P&L &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Live Kitchen Confirmed Demand & Preparation Adjustment Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Confirmed Demand Breakdown */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Live Kitchen Headcount for Today</h3>
              <p className="text-xs text-slate-400">
                Active enrolled students minus confirmed timely meal skips
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('kitchen')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Adjust Prep &rarr;
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3.5 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">
                Breakfast
              </span>
              <div className="text-2xl font-black text-slate-900">{demand.breakfast}</div>
              <div className="text-[10px] text-slate-500 mt-1">
                {stats?.breakfastSkips || 0} skipped
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-xs font-bold uppercase text-emerald-700 block mb-1">
                Lunch
              </span>
              <div className="text-2xl font-black text-emerald-950">{demand.lunch}</div>
              <div className="text-[10px] text-emerald-800 mt-1">
                {stats?.lunchSkips || 0} skipped
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">
                Dinner
              </span>
              <div className="text-2xl font-black text-slate-900">{demand.dinner}</div>
              <div className="text-[10px] text-slate-500 mt-1">
                {stats?.dinnerSkips || 0} skipped
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Estimated Raw Ingredients Saved Today: <strong>~{(stats?.todaySkipsCount * 0.35 || 0).toFixed(2)} kg</strong></span>
            </div>
            <button
              onClick={() => onNavigateTab('kitchen')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors"
            >
              Kitchen Planning
            </button>
          </div>
        </div>

        {/* Quick Operations Panel */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Quick Mess Operations</h3>
            <p className="text-xs text-slate-400 mb-4">Direct shortcuts to frequent management tasks</p>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigateTab('savings')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 text-left transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Shared Savings Split Config</div>
                    <div className="text-[10px] text-slate-500">
                      Currently {mess?.sharedSavingsConfig?.studentRewardPercentage || 50}% Student / {mess?.sharedSavingsConfig?.ownerRewardPercentage || 50}% Mess Owner
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateTab('inventory')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 text-left transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Restock Ingredients</div>
                    <div className="text-[10px] text-slate-500">Log procurement & auto update purchase records</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateTab('complaints')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 text-left transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Student Feedback Tickets</div>
                    <div className="text-[10px] text-slate-500">
                      {stats?.pendingComplaintsCount || 0} unresolved issues awaiting cook response
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>MessMate Platform Status:</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Fully Synchronized
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
