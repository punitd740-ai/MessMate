import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  FileText,
  CheckCircle2,
  Download,
  Printer,
  ShieldCheck,
  Building,
  RefreshCw
} from 'lucide-react';
import { api } from '../../api/apiClient';
import Modal from '../../components/Modal';

export default function PaymentsTab() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    const res = await api.get('/student/payments');
    if (res.success) {
      setPayments(res.payments || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="space-y-8 text-left">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-slate-900">Payments & Invoices</h2>
          <button
            onClick={fetchPayments}
            className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <p className="text-xs text-slate-500">
          View official receipts and invoices for your campus mess memberships
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Mess Name</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {p.invoiceNumber || 'INV-2026-001'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {p.paidAt ? p.paidAt.split('T')[0] : '2026-11-20'}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {p.messName || 'MessMate Partner'}
                    </td>
                    <td className="py-3.5 px-4 uppercase font-semibold text-slate-600 text-[11px]">
                      {p.paymentMethod || 'UPI'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {p.status || 'Successful'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 text-sm">
                      ₹{p.amount}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedInvoice(p)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5 ml-auto"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400">
            No payment records found. Payments made for memberships will appear here.
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      <Modal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title="Official Mess Membership Invoice"
        maxWidth="max-w-xl"
      >
        {selectedInvoice && (
          <div className="space-y-6 text-xs text-left" id="printable-invoice">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <div className="text-base font-extrabold text-slate-900">MESSMATE TECHNOLOGIES</div>
                <div className="text-slate-500 text-[11px]">Campus Dining Management Platform</div>
                <div className="text-slate-400 text-[10px] mt-1">Tax ID: GSTIN07AAACM9928K1Z3</div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-sm text-emerald-800">
                  {selectedInvoice.invoiceNumber}
                </div>
                <div className="text-slate-500 text-[11px]">
                  Date: {selectedInvoice.paidAt?.split('T')[0] || '2026-11-20'}
                </div>
              </div>
            </div>

            {/* Bill To & Mess Info */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Issued By:
                </span>
                <div className="font-bold text-slate-800">{selectedInvoice.messName}</div>
                <div className="text-slate-500 text-[11px]">Authorized Campus Mess Partner</div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Payment Details:
                </span>
                <div className="text-slate-700">Method: <strong>{selectedInvoice.paymentMethod?.toUpperCase()}</strong></div>
                <div className="text-slate-700 font-mono text-[11px]">Ref: {selectedInvoice.transactionId}</div>
              </div>
            </div>

            {/* Line Items */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Qty</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-3 font-medium text-slate-800">
                      Standard Mess Dining Membership (Full Board with Shared Savings)
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600">1</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      ₹{selectedInvoice.amount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center text-sm font-bold border-t border-slate-200 pt-3">
              <span>Total Paid:</span>
              <span className="text-lg text-emerald-700">₹{selectedInvoice.amount}.00</span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
