import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  CheckCheck,
  RefreshCw,
  Sliders,
  DollarSign
} from 'lucide-react';
import { api } from '../../api/apiClient';
import Modal from '../../components/Modal';

export default function SharedSavingsManagementTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Config State
  const [studentRewardPct, setStudentRewardPct] = useState(50);
  const [rawCost, setRawCost] = useState(35);
  const [laborCost, setLaborCost] = useState(15);
  const [overheadCost, setOverheadCost] = useState(10);

  // Single Verification Modal State
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedSkip, setSelectedSkip] = useState(null);
  const [actualVerifiedSavings, setActualVerifiedSavings] = useState(35);

  // Batch Verification Modal State
  const todayStr = new Date().toISOString().split('T')[0];
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchDate, setBatchDate] = useState(todayStr);
  const [batchMealType, setBatchMealType] = useState('all');
  const [batchSavingsPerMeal, setBatchSavingsPerMeal] = useState(35);

  const fetchSavingsData = async () => {
    setLoading(true);
    const res = await api.get('/owner/savings/overview');
    if (res.success) {
      setData(res);
      if (res.config) {
        setStudentRewardPct(res.config.studentRewardPercentage || 50);
      }
      if (res.mealCostBreakdown) {
        setRawCost(res.mealCostBreakdown.rawMaterial || 35);
        setLaborCost(res.mealCostBreakdown.prepLabor || 15);
        setOverheadCost(res.mealCostBreakdown.fixedOverhead || 10);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSavingsData();
  }, []);

  const handleUpdateConfig = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const totalPerMeal = Number(rawCost) + Number(laborCost) + Number(overheadCost);

    const res = await api.put('/owner/savings/config', {
      studentRewardPercentage: Number(studentRewardPct),
      mealCostBreakdown: {
        rawMaterial: Number(rawCost),
        prepLabor: Number(laborCost),
        fixedOverhead: Number(overheadCost),
        totalPerMeal,
        estimatedSavingsPerSkip: Number(rawCost)
      }
    });

    setActionLoading(false);
    if (res.success) {
      setNotification({
        type: 'success',
        message: `Shared savings ratio updated to ${studentRewardPct}% Student / ${100 - studentRewardPct}% Mess Owner!`
      });
      fetchSavingsData();
    } else {
      setNotification({ type: 'error', message: res.message || 'Config update failed' });
    }
  };

  const handleVerifySingle = async (e) => {
    e.preventDefault();
    if (!selectedSkip) return;
    setActionLoading(true);

    const res = await api.post(`/owner/savings/verify/${selectedSkip._id}`, {
      actualVerifiedSavingsPerMeal: Number(actualVerifiedSavings)
    });

    setActionLoading(false);
    if (res.success) {
      setVerifyModalOpen(false);
      setNotification({
        type: 'success',
        message: `Verified savings of ₹${actualVerifiedSavings} applied. Student wallet credited with ₹${res.result.wallet.creditedAmount}!`
      });
      fetchSavingsData();
    } else {
      setNotification({ type: 'error', message: res.message || 'Verification failed' });
    }
  };

  const handleBatchVerify = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const res = await api.post('/owner/savings/batch-verify', {
      date: batchDate,
      mealType: batchMealType,
      verifiedPerMeal: Number(batchSavingsPerMeal)
    });

    setActionLoading(false);
    if (res.success) {
      setBatchModalOpen(false);
      setNotification({
        type: 'success',
        message: `Batch verification complete! Successfully processed ${res.result.totalProcessed} meal skips.`
      });
      fetchSavingsData();
    } else {
      setNotification({ type: 'error', message: res.message || 'Batch verification failed' });
    }
  };

  const skips = data?.skips || [];
  const verifiedSkips = skips.filter(s => s.isWalletCredited);
  const pendingSkips = skips.filter(s => !s.isWalletCredited && s.status !== 'rejected');

  const totalVerifiedSavings = verifiedSkips.reduce((sum, s) => sum + (s.verifiedSavings || 0), 0);
  const totalStudentDistributed = verifiedSkips.reduce((sum, s) => sum + (s.studentCreditAmount || 0), 0);
  const totalOwnerRetained = verifiedSkips.reduce((sum, s) => sum + (s.ownerSavingsAmount || 0), 0);

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Shared Savings Management</h2>
          <p className="text-xs text-slate-500">
            Configure reward percentage, verify actual kitchen food savings, and approve meal credits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBatchModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Batch Verify Skips</span>
          </button>
          <button
            onClick={fetchSavingsData}
            className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-medium border ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-700">
            &times;
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Verified Food Savings
          </span>
          <div className="text-3xl font-black text-slate-900">₹{totalVerifiedSavings}</div>
          <p className="text-[11px] text-slate-500 mt-1">{verifiedSkips.length} meals audited</p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
            Student Credits Distributed
          </span>
          <div className="text-3xl font-black text-emerald-700">₹{totalStudentDistributed}</div>
          <p className="text-[11px] text-emerald-800 mt-1">Credited to student wallets</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Mess Owner Kept Savings
          </span>
          <div className="text-3xl font-black text-slate-800">₹{totalOwnerRetained}</div>
          <p className="text-[11px] text-slate-500 mt-1">Direct kitchen savings retained</p>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block mb-1">
            Pending Verification
          </span>
          <div className="text-3xl font-black text-amber-900">{pendingSkips.length} Skips</div>
          <p className="text-[11px] text-amber-800 mt-1">Awaiting cook verification</p>
        </div>
      </div>

      {/* Configuration Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-2.5 mb-2 border-b border-slate-100 pb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Shared Savings Percentage & Meal Cost Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Set the fair sharing ratio and direct raw material costs per skipped meal
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateConfig} className="space-y-6 text-xs mt-4">
          {/* Ratio Slider */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-sm font-bold text-slate-800">
              <span>Savings Split Ratio:</span>
              <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs">
                {studentRewardPct}% Student / {100 - studentRewardPct}% Mess Owner
              </span>
            </div>

            <input
              type="range"
              min="20"
              max="80"
              step="5"
              value={studentRewardPct}
              onChange={(e) => setStudentRewardPct(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />

            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Min Student: 20%</span>
              <span className="font-semibold text-emerald-700">Recommended: 50% / 50%</span>
              <span>Max Student: 80%</span>
            </div>
          </div>

          {/* Cost Breakdown Inputs */}
          <div>
            <h4 className="font-bold text-slate-700 mb-2">Per-Meal Cost Breakdown (₹)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-500 mb-1">Raw Material (Saved on Skip)</label>
                <input
                  type="number"
                  required
                  value={rawCost}
                  onChange={(e) => setRawCost(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Prep Labor (Fixed)</label>
                <input
                  type="number"
                  required
                  value={laborCost}
                  onChange={(e) => setLaborCost(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Overhead / Gas (Fixed)</label>
                <input
                  type="number"
                  required
                  value={overheadCost}
                  onChange={(e) => setOverheadCost(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Total Meal Price</label>
                <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-black text-emerald-800">
                  ₹{Number(rawCost) + Number(laborCost) + Number(overheadCost)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={actionLoading}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{actionLoading ? 'Updating...' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Skips Verification Ledger */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Student Meal Skips & Verification Queue</h3>
            <p className="text-xs text-slate-400">
              Verify actual savings to credit student wallets. Never credit on estimates.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {skips.length} Records
          </span>
        </div>

        {skips.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Meal</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Verified Savings</th>
                  <th className="py-3 px-4">Split (Student / Owner)</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {skips.map((skip) => (
                  <tr key={skip._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {skip.studentName || 'Student'}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{skip.date}</td>
                    <td className="py-3.5 px-4 font-semibold capitalize text-emerald-800">{skip.mealType}</td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{skip.reason}</td>
                    <td className="py-3.5 px-4">
                      {skip.isWalletCredited ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Credited
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          Pending Audit
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {skip.verifiedSavings > 0 ? `₹${skip.verifiedSavings}` : `Est. ₹${skip.estimatedSavings || 35}`}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {skip.isWalletCredited ? (
                        <span>₹{skip.studentCreditAmount} / ₹{skip.ownerSavingsAmount}</span>
                      ) : (
                        <span className="text-slate-400 italic">Upon verification</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {!skip.isWalletCredited ? (
                        <button
                          onClick={() => {
                            setSelectedSkip(skip);
                            setActualVerifiedSavings(skip.estimatedSavings || 35);
                            setVerifyModalOpen(true);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all"
                        >
                          Verify & Credit
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Done
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400">
            No meal skips recorded yet.
          </div>
        )}
      </div>

      {/* --- Modals --- */}

      {/* Single Verification Modal */}
      <Modal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        title="Verify Actual Food Savings"
      >
        {selectedSkip && (
          <form onSubmit={handleVerifySingle} className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="text-sm font-bold text-emerald-950">
                {selectedSkip.studentName} — {selectedSkip.mealType?.toUpperCase()} on {selectedSkip.date}
              </div>
              <p className="text-slate-600 mt-1">
                Reason given: "{selectedSkip.reason}"
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Actual Verified Raw Ingredient Savings (₹)
              </label>
              <input
                type="number"
                required
                value={actualVerifiedSavings}
                onChange={(e) => setActualVerifiedSavings(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Rule: Rewards must be calculated from actual saved food cost, not estimates.
              </span>
            </div>

            {/* Split Preview */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2 text-center">
              <div>
                <span className="text-[10px] text-slate-500 block">Student Wallet Credit ({studentRewardPct}%):</span>
                <strong className="text-emerald-700 text-sm">
                  ₹{Math.round(Number(actualVerifiedSavings) * (studentRewardPct / 100))}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Mess Owner Retained ({100 - studentRewardPct}%):</span>
                <strong className="text-slate-800 text-sm">
                  ₹{Number(actualVerifiedSavings) - Math.round(Number(actualVerifiedSavings) * (studentRewardPct / 100))}
                </strong>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setVerifyModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow"
              >
                {actionLoading ? 'Crediting...' : 'Confirm & Credit Student Wallet'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Batch Verification Modal */}
      <Modal
        isOpen={batchModalOpen}
        onClose={() => setBatchModalOpen(false)}
        title="Batch Verify Meal Skips"
      >
        <form onSubmit={handleBatchVerify} className="space-y-4 text-xs">
          <p className="text-slate-600">
            Batch-verify all confirmed skips for a specific shift or day. Each student wallet will receive their configured share automatically.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Date</label>
              <input
                type="date"
                required
                value={batchDate}
                onChange={(e) => setBatchDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Meal Slot</label>
              <select
                value={batchMealType}
                onChange={(e) => setBatchMealType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="all">All Meals</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Verified Savings Per Skipped Meal (₹)
            </label>
            <input
              type="number"
              required
              value={batchSavingsPerMeal}
              onChange={(e) => setBatchSavingsPerMeal(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setBatchModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow"
            >
              {actionLoading ? 'Processing Batch...' : 'Execute Batch Credit'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
