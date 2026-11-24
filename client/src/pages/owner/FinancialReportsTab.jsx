import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Scale,
  RefreshCw,
  CreditCard,
  FileText,
  PieChart
} from 'lucide-react';
import { api } from '../../api/apiClient';

export default function FinancialReportsTab() {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFinancials = async () => {
    setLoading(true);
    const res = await api.get('/owner/financials');
    if (res.success) {
      setFinancialData(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFinancials();
  }, []);

  const f = financialData?.financials;
  const recentPayments = financialData?.recentPayments || [];
  const recentPurchases = financialData?.recentPurchases || [];

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Financial Reports & Profit & Loss Statement</h2>
          <p className="text-xs text-slate-500">
            Transparent revenue tracking, procurement costs, verified savings, and net profit margins
          </p>
        </div>

        <button
          onClick={fetchFinancials}
          className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* P&L Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Revenue</span>
            <Wallet className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            ₹{f?.totalGrossRevenue || 0}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            ₹{f?.totalMembershipRevenue || 0} memberships + ₹{f?.totalOwnerSavingsRetained || 0} retained savings
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Expenses</span>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            ₹{f?.totalExpenditure || 0}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            ₹{f?.rawMaterialExpenses || 0} raw food + ₹{f?.fixedExpensesEstimated || 0} labor & gas
          </div>
        </div>

        {/* Net Profit */}
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Net Profit</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-800">
            ₹{f?.netProfit || 0}
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-bold">
            Profit Margin: {f?.profitMarginPct || 0}%
          </div>
        </div>

        {/* Retained Food Savings from Skips */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Owner Skips Retained</span>
            <Scale className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-teal-700">
            ₹{f?.totalOwnerSavingsRetained || 0}
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Direct financial benefit from zero food waste
          </p>
        </div>
      </div>

      {/* P&L Statement Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Executive Profit & Loss Breakdown
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-slate-600 font-semibold">1. Student Membership Subscriptions</span>
            <span className="font-bold text-slate-900 text-sm">+₹{f?.totalMembershipRevenue || 0}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-emerald-700 font-semibold">2. Verified Food Cost Savings Retained (from Skips)</span>
            <span className="font-bold text-emerald-700 text-sm">+₹{f?.totalOwnerSavingsRetained || 0}</span>
          </div>

          <div className="flex justify-between items-center py-2 bg-slate-50 px-3 rounded-xl font-bold text-slate-900">
            <span>Total Gross Revenue:</span>
            <span>₹{f?.totalGrossRevenue || 0}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-slate-100 text-red-600">
            <span>3. Raw Material & Ingredient Purchases (Wholesale):</span>
            <span className="font-bold">-₹{f?.rawMaterialExpenses || 0}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-slate-100 text-red-600">
            <span>4. Operational Overhead (Kitchen staff, commercial gas, utilities):</span>
            <span className="font-bold">-₹{f?.fixedExpensesEstimated || 0}</span>
          </div>

          <div className="flex justify-between items-center py-3 bg-emerald-100/70 text-emerald-950 px-4 rounded-2xl text-sm font-extrabold mt-2">
            <span>Net Operating Profit / Loss:</span>
            <span className="text-lg">₹{f?.netProfit || 0} ({f?.profitMarginPct}%)</span>
          </div>
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Student Payments</h3>
        {recentPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentPayments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.invoiceNumber}</td>
                    <td className="py-3 px-4 text-slate-500">{p.paidAt?.split('T')[0] || 'Today'}</td>
                    <td className="py-3 px-4 uppercase font-semibold text-slate-700">{p.paymentMethod}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{p.transactionId}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700 text-sm">₹{p.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">No payment records found.</div>
        )}
      </div>
    </div>
  );
}
