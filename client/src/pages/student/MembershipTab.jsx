import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  PauseCircle,
  PlayCircle,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  CreditCard,
  Building,
  RefreshCw
} from 'lucide-react';
import { api } from '../../api/apiClient';
import Modal from '../../components/Modal';

export default function MembershipTab() {
  const [membershipData, setMembershipData] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [pauseModalOpen, setPauseModalOpen] = useState(false);
  const [pauseDays, setPauseDays] = useState(5);
  const [pauseReason, setPauseReason] = useState('Home visit during festival');

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Relocating out of campus hostel');

  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchMembershipDetails = async () => {
    setLoading(true);
    const [memRes, plansRes] = await Promise.all([
      api.get('/student/membership/current'),
      api.get('/student/plans')
    ]);

    if (memRes.success) setMembershipData(memRes);
    if (plansRes.success) setAvailablePlans(plansRes.plans || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMembershipDetails();
  }, []);

  const handlePause = async (e) => {
    e.preventDefault();
    if (!membershipData?.membership?._id) return;
    setActionLoading(true);

    const res = await api.post('/student/membership/pause', {
      membershipId: membershipData.membership._id,
      pauseDays: Number(pauseDays),
      reason: pauseReason
    });

    setActionLoading(false);
    if (res.success) {
      setPauseModalOpen(false);
      setNotification({ type: 'success', message: res.message });
      fetchMembershipDetails();
    } else {
      setNotification({ type: 'error', message: res.message });
    }
  };

  const handleResume = async () => {
    if (!membershipData?.membership?._id) return;
    setActionLoading(true);

    const res = await api.post('/student/membership/resume', {
      membershipId: membershipData.membership._id
    });

    setActionLoading(false);
    if (res.success) {
      setNotification({ type: 'success', message: res.message });
      fetchMembershipDetails();
    } else {
      setNotification({ type: 'error', message: res.message });
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    if (!membershipData?.membership?._id) return;
    setActionLoading(true);

    const res = await api.post('/student/membership/cancel', {
      membershipId: membershipData.membership._id,
      cancellationReason: cancelReason
    });

    setActionLoading(false);
    if (res.success) {
      setCancelModalOpen(false);
      setNotification({ type: 'success', message: res.message });
      fetchMembershipDetails();
    } else {
      setNotification({ type: 'error', message: res.message });
    }
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setActionLoading(true);

    const res = await api.post('/student/membership/purchase', {
      planId: selectedPlan._id,
      paymentMethod
    });

    setActionLoading(false);
    if (res.success) {
      setPurchaseModalOpen(false);
      setNotification({ type: 'success', message: res.message });
      fetchMembershipDetails();
    } else {
      setNotification({ type: 'error', message: res.message });
    }
  };

  const membership = membershipData?.membership;

  return (
    <div className="space-y-8 text-left">
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

      {/* 1. Active Membership Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Current Membership Status</h2>
            <p className="text-xs text-slate-500">Live countdown, remaining days & pause management</p>
          </div>
          <button
            onClick={fetchMembershipDetails}
            className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="Refresh details"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {membership ? (
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl font-extrabold text-slate-900">{membership.planName}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      membership.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : membership.status === 'paused'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {membership.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {membership.messName}
                  </span>
                  <span>•</span>
                  <span>Price: ₹{membership.planPrice} / cycle</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                {membership.status === 'active' ? (
                  <button
                    onClick={() => setPauseModalOpen(true)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center gap-1.5"
                  >
                    <PauseCircle className="w-4 h-4" />
                    <span>Pause Plan</span>
                  </button>
                ) : membership.status === 'paused' ? (
                  <button
                    onClick={handleResume}
                    disabled={actionLoading}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Resume Plan</span>
                  </button>
                ) : null}

                {membership.status !== 'cancelled' && (
                  <button
                    onClick={() => setCancelModalOpen(true)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl text-red-600 hover:bg-red-50 border border-red-200 transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel Plan</span>
                  </button>
                )}
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-slate-500 block mb-1">Remaining Days:</span>
                <span className="text-2xl font-extrabold text-emerald-800">
                  {membership.remainingDays} Days
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Automatic live count</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block mb-1">Start Date:</span>
                <span className="text-base font-bold text-slate-800">{membership.startDate}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Activation date</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block mb-1">Expiry Date:</span>
                <span className="text-base font-bold text-slate-800">{membership.endDate}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Extended on pause</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block mb-1">Meals Covered:</span>
                <span className="text-base font-bold text-slate-800 capitalize">
                  {membership.mealsIncluded?.join(', ') || 'All Meals'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Daily dining</span>
              </div>
            </div>

            {/* Pause History if any */}
            {membership.pauseHistory?.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Pause & Leave History
                </h4>
                <div className="space-y-2">
                  {membership.pauseHistory.map((h, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 text-xs flex justify-between items-center text-slate-600"
                    >
                      <span>
                        Paused on {h.pausedAt.split('T')[0]} for <strong>{h.pauseDays} days</strong> ({h.reason})
                      </span>
                      <span className="text-emerald-700 font-medium">Days Preserved</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-3xl bg-white border border-slate-200 p-8 text-center space-y-3">
            <CalendarDays className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No Active Membership Plan</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You do not currently have an active mess plan. Choose one of our partner messes below to start dining and earning shared savings credits!
            </p>
          </div>
        )}
      </div>

      {/* 2. Available Mess Plans Catalog */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">Explore Campus Mess Memberships</h2>
          <p className="text-xs text-slate-500">
            Compare packages, cuisine types, and choose what suits your schedule best
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availablePlans.map((plan) => (
            <div
              key={plan._id}
              className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-all text-left"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                    {plan.type}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {plan.durationDays} Days
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-1">{plan.name}</h3>
                <div className="text-xs text-slate-500 mt-0.5">{plan.messName}</div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900">₹{plan.price}</span>
                  <span className="text-xs text-slate-500">/ plan cycle</span>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {plan.description}
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  {plan.features?.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPlan(plan);
                  setPurchaseModalOpen(true);
                }}
                disabled={membership?.status === 'active'}
                className="mt-6 w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-500"
              >
                {membership?.status === 'active' ? 'Active Membership Exists' : 'Activate Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- Modals --- */}

      {/* Pause Modal */}
      <Modal isOpen={pauseModalOpen} onClose={() => setPauseModalOpen(false)} title="Pause Membership Plan">
        <form onSubmit={handlePause} className="space-y-4 text-xs">
          <p className="text-slate-600">
            When your plan is paused, your daily day counter stops. When you return and resume, your expiry date is automatically extended so you never lose meal days!
          </p>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Number of Days to Pause (1 to 15 days)
            </label>
            <input
              type="number"
              min="1"
              max="15"
              required
              value={pauseDays}
              onChange={(e) => setPauseDays(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Reason for Pause</label>
            <select
              value={pauseReason}
              onChange={(e) => setPauseReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm"
            >
              <option value="Home visit during festival">Home visit during festival / holiday</option>
              <option value="Off-campus internship / practicals">Off-campus internship / practicals</option>
              <option value="Medical leave / illness">Medical leave / illness</option>
              <option value="Exam preparatory leave">Exam preparatory leave</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPauseModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow"
            >
              {actionLoading ? 'Pausing...' : 'Confirm Pause'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Cancel Modal */}
      <Modal isOpen={cancelModalOpen} onClose={() => setCancelModalOpen(false)} title="Cancel Membership">
        <form onSubmit={handleCancel} className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-red-50 text-red-800 border border-red-200">
            <strong>Cancellation Notice:</strong> Cancelling will terminate remaining meal days according to mess policy.
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Reason for Cancellation</label>
            <textarea
              required
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Relocating, changed hostel block..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCancelModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Keep Membership
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              {actionLoading ? 'Cancelling...' : 'Confirm Cancel'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Purchase Plan Modal */}
      <Modal isOpen={purchaseModalOpen} onClose={() => setPurchaseModalOpen(false)} title="Activate Mess Membership">
        {selectedPlan && (
          <form onSubmit={handlePurchase} className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="text-sm font-bold text-emerald-950">{selectedPlan.name}</div>
              <div className="text-slate-600 mt-1">Mess: {selectedPlan.messName}</div>
              <div className="text-lg font-black text-emerald-800 mt-2">
                Amount Payable: ₹{selectedPlan.price}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {['upi', 'card', 'wallet'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-3 rounded-xl border text-center uppercase font-bold text-[11px] ${
                      paymentMethod === method
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-slate-400 text-[11px]">
              Instant activation. Your remaining day counter will initialize automatically upon confirmation.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPurchaseModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow"
              >
                {actionLoading ? 'Processing...' : `Pay & Activate (₹${selectedPlan.price})`}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
