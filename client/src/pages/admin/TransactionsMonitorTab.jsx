import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Wallet,
  Sparkles,
  RefreshCw,
  FileText,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { api } from '../../api/apiClient';

export default function TransactionsMonitorTab() {
  const [activeSubTab, setActiveSubTab] = useState('payments');
  const [payments, setPayments] = useState([]);
  const [walletTxns, setWalletTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    const res = await api.get('/admin/transactions');
    if (res.success) {
      setPayments(res.payments || []);
      setWalletTxns(res.walletTransactions || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalPaymentVolume = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalWalletCredits = walletTxns.reduce((sum, w) => sum + (Number(w.amount) || 0), 0);

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Platform Transaction Audit Ledger</h2>
          <p className="text-xs text-slate-500">
            Real-time monitoring of campus membership purchases and verified shared savings rewards
          </p>
        </div>

        <button
          onClick={fetchTransactions}
          className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Volume Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Total Membership Subscriptions Volume
            </span>
            <div className="text-3xl font-extrabold text-slate-900">₹{totalPaymentVolume}</div>
            <p className="text-[11px] text-slate-500 mt-1">{payments.length} successful transactions</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Total Shared Savings Distributed
            </span>
            <div className="text-3xl font-extrabold text-emerald-700">₹{totalWalletCredits}</div>
            <p className="text-[11px] text-slate-500 mt-1">{walletTxns.length} verified food credits</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Subtab Switcher */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveSubTab('payments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'payments'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Membership Payments ({payments.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('wallet_rewards')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'wallet_rewards'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Wallet Rewards Ledger ({walletTxns.length})</span>
        </button>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 capitalize">
          {activeSubTab === 'payments' ? 'Subscription Payment Invoices' : 'Shared Savings Reward Distributions'}
        </h3>

        {activeSubTab === 'payments' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Gateway Ref</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.invoiceNumber}</td>
                    <td className="py-3.5 px-4 text-slate-500">{p.paidAt?.split('T')[0] || 'Today'}</td>
                    <td className="py-3.5 px-4 uppercase font-semibold text-slate-700">{p.paymentMethod}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{p.transactionId}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {p.status || 'Successful'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 text-sm">
                      ₹{p.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Audit Description</th>
                  <th className="py-3 px-4">Verified Food Cost</th>
                  <th className="py-3 px-4">Sharing Ratio</th>
                  <th className="py-3 px-4 text-right">Credited Reward</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {walletTxns.map((w) => (
                  <tr key={w._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500">{w.createdAt?.split('T')[0] || 'Today'}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 max-w-sm">{w.description}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      ₹{w.verifiedSavings || 35}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{w.sharingRatio || '50% / 50%'}</td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-emerald-600 text-sm">
                      +₹{w.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
