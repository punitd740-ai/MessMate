import React, { useState, useEffect } from 'react';
import {
  Shield,
  Building,
  Users,
  Wallet,
  Sparkles,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Cpu,
  RefreshCw,
  Scale
} from 'lucide-react';
import { api } from '../../api/apiClient';

export default function AdminOverviewTab({ onNavigateTab }) {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    setLoading(true);
    const res = await api.get('/admin/overview');
    if (res.success) {
      setOverviewData(res);
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

  const stats = overviewData?.stats;
  const recentMesses = overviewData?.recentMesses || [];
  const recentStudents = overviewData?.recentStudents || [];

  return (
    <div className="space-y-8 text-left">
      {/* Platform Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-7 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Platform-Wide Governance & Oversight</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Super Admin Control Center
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 flex items-center gap-2">
              <span>MessMate Smart Mess Management System</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All Services Online
              </span>
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onNavigateTab('messes')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <Building className="w-4 h-4" />
              <span>Registered Messes</span>
            </button>
            <button
              onClick={() => onNavigateTab('ai-preview')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>AI Engine Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Platform KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Registered Messes */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Registered Messes</span>
            <Building className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {stats?.totalMesses || 0}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between items-center">
            <span>{stats?.totalMessOwners || 0} Verified Owners</span>
            <button
              onClick={() => onNavigateTab('messes')}
              className="text-emerald-700 font-bold hover:underline"
            >
              Manage &rarr;
            </button>
          </div>
        </div>

        {/* Card 2: Total Students Enrolled */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Student Enrolled</span>
            <Users className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {stats?.totalStudents || 0}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between items-center">
            <span>{stats?.activeMemberships || 0} Active Memberships</span>
            <button
              onClick={() => onNavigateTab('users')}
              className="text-emerald-700 font-bold hover:underline"
            >
              Users &rarr;
            </button>
          </div>
        </div>

        {/* Card 3: Platform Food Waste Prevented */}
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Food Waste Prevented</span>
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-800">
            {stats?.totalFoodWastePreventedKg || 0} kg
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium">
            ₹{stats?.totalVerifiedFoodSavings || 0} saved across messes
          </div>
        </div>

        {/* Card 4: Platform Revenue & Transactions */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Volume</span>
            <Wallet className="w-5 h-5 text-slate-700" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            ₹{stats?.totalPlatformRevenue || 0}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between items-center">
            <span>{stats?.totalMealsSkipped || 0} meals skipped</span>
            <button
              onClick={() => onNavigateTab('transactions')}
              className="text-emerald-700 font-bold hover:underline"
            >
              Audits &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Left Column: Recent Registered Messes */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Partner Campus Messes</h3>
              <p className="text-xs text-slate-400">Currently active on the MessMate network</p>
            </div>
            <button
              onClick={() => onNavigateTab('messes')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              View All ({recentMesses.length}) &rarr;
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {recentMesses.map((m) => (
              <div
                key={m._id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>{m.name}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      ★ {m.rating || 4.8}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {m.cuisineType} • {m.address}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Shared Savings Ratio: {m.sharedSavingsConfig?.studentRewardPercentage}% Student / {m.sharedSavingsConfig?.ownerRewardPercentage}% Owner
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Platform Dispute Resolution & AI Preview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Dispute Resolution Summary */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900">Dispute & Complaint Oversight</h4>
              <button
                onClick={() => onNavigateTab('disputes')}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Manage
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500 text-[11px] block">Total Complaints:</span>
                <strong className="text-lg font-bold text-slate-900">{stats?.totalComplaints || 0}</strong>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-emerald-800 text-[11px] block">Resolved:</span>
                <strong className="text-lg font-bold text-emerald-700">{stats?.resolvedComplaints || 0}</strong>
              </div>
            </div>
          </div>

          {/* AI Module Preview Callout */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-lg">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <Cpu className="w-5 h-5" />
              <h4 className="font-bold text-sm">Future AI Engine Architecture</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Historical meal demand telemetry pipeline is collecting advance skip trends for automated predictive forecasting.
            </p>
            <button
              onClick={() => onNavigateTab('ai-preview')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
            >
              <span>Explore AI Module Blueprint</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
