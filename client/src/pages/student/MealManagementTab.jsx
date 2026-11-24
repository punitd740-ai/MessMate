import React, { useState, useEffect } from 'react';
import {
  Calendar,
  UtensilsCrossed,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  XCircle,
  CalendarCheck,
  RefreshCw
} from 'lucide-react';
import { api } from '../../api/apiClient';

export default function MealManagementTab() {
  const [dailyMenu, setDailyMenu] = useState(null);
  const [skipsList, setSkipsList] = useState([]);
  const [membershipData, setMembershipData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Skip Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [skipDate, setSkipDate] = useState(tomorrowStr);
  const [skipMealType, setSkipMealType] = useState('lunch');
  const [skipReason, setSkipReason] = useState('Dining out with friends');
  const [customReason, setCustomReason] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchMealsData = async () => {
    setLoading(true);
    const [menuRes, skipsRes, memRes] = await Promise.all([
      api.get('/student/menu/daily'),
      api.get('/student/meal/skips'),
      api.get('/student/membership/current')
    ]);

    if (menuRes.success && menuRes.menu) setDailyMenu(menuRes.menu);
    if (skipsRes.success) setSkipsList(skipsRes.skips || []);
    if (memRes.success) setMembershipData(memRes);
    setLoading(false);
  };

  useEffect(() => {
    fetchMealsData();
  }, []);

  const handleSkipSubmit = async (e) => {
    e.preventDefault();
    if (!membershipData?.membership?.messId) {
      setNotification({
        type: 'error',
        message: 'You need an active mess membership to skip meals.'
      });
      return;
    }

    setSubmitting(true);
    const reasonToSend = skipReason === 'Other' ? customReason : skipReason;

    const res = await api.post('/student/meal/skip', {
      messId: membershipData.membership.messId,
      date: skipDate,
      mealType: skipMealType,
      reason: reasonToSend
    });

    setSubmitting(false);
    if (res.success) {
      setNotification({
        type: 'success',
        message: `Meal skip registered for ${skipMealType} on ${skipDate}. Kitchen will reduce food preparation!`
      });
      fetchMealsData();
    } else {
      setNotification({
        type: 'error',
        message: res.message || 'Could not register meal skip.'
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified_saved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Verified & Credited
          </span>
        );
      case 'kitchen_adjusted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
            Kitchen Adjusted
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Timely Confirmed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

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

      {/* Main Grid: Skip Form on Left, Today's Menu on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Advance Meal Skip Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Skip a Meal in Advance</h2>
              <p className="text-xs text-slate-400">Help the mess owner save food and earn shared savings credits</p>
            </div>
          </div>

          {/* Cutoff Policy Notice */}
          <div className="my-4 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Cutoff Times for Skips:</strong>
              Breakfast: 2h prior (by 05:30 AM) • Lunch: 3h prior (by 09:30 AM) • Dinner: 3h prior (by 04:30 PM).
            </div>
          </div>

          <form onSubmit={handleSkipSubmit} className="space-y-4 text-xs">
            {/* Date Selection */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Select Date
              </label>
              <input
                type="date"
                min={todayStr}
                required
                value={skipDate}
                onChange={(e) => setSkipDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-800"
              />
            </div>

            {/* Meal Slot Selection */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Meal Slot to Skip
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'breakfast', label: 'Breakfast', time: '07:30 - 09:30' },
                  { id: 'lunch', label: 'Lunch', time: '12:30 - 14:30' },
                  { id: 'dinner', label: 'Dinner', time: '19:30 - 21:30' }
                ].map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSkipMealType(slot.id)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      skipMealType === slot.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold text-xs">{slot.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{slot.time}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Reason for Skipping
              </label>
              <select
                value={skipReason}
                onChange={(e) => setSkipReason(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800"
              >
                <option value="Dining out with friends">Dining out with friends / family</option>
                <option value="Late college class or practicals">Late college class or practicals</option>
                <option value="Exam revision / library stay">Exam revision / library stay</option>
                <option value="Fasting / dietary preference">Fasting / dietary preference</option>
                <option value="Traveling / weekend departure">Traveling / weekend departure</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {skipReason === 'Other' && (
              <div>
                <input
                  type="text"
                  required
                  placeholder="Please specify reason..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            )}

            {/* Savings preview */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[11px]">Estimated Food Savings:</span>
                <span className="font-bold text-slate-900 text-sm">~₹35.00 raw ingredients</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-700 font-bold block text-sm">~₹17.50 Reward</span>
                <span className="text-[10px] text-slate-400">Credited upon verification</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              {submitting ? 'Confirming Skip...' : 'Confirm Meal Skip'}
            </button>
          </form>
        </div>

        {/* Today's Menu Highlight on Right */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Today's Kitchen Menu</h3>
              <span className="text-xs text-slate-400">{todayStr}</span>
            </div>

            {dailyMenu ? (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between items-center text-slate-500 font-semibold mb-1">
                    <span className="uppercase text-emerald-700 font-bold">Breakfast</span>
                    <span>{dailyMenu.breakfast?.startTime} - {dailyMenu.breakfast?.endTime}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                    {dailyMenu.breakfast?.items?.join(' • ')}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-slate-500 font-semibold mb-1">
                    <span className="uppercase text-emerald-700 font-bold">Lunch</span>
                    <span>{dailyMenu.lunch?.startTime} - {dailyMenu.lunch?.endTime}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                    {dailyMenu.lunch?.items?.join(' • ')}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-slate-500 font-semibold mb-1">
                    <span className="uppercase text-emerald-700 font-bold">Dinner</span>
                    <span>{dailyMenu.dinner?.startTime} - {dailyMenu.dinner?.endTime}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                    {dailyMenu.dinner?.items?.join(' • ')}
                  </div>
                </div>

                {dailyMenu.specialNotes && (
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/80 text-[11px]">
                    <strong>Note:</strong> {dailyMenu.specialNotes}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                Menu details for today will be loaded shortly.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
            💡 <em>Always skip in advance. Last minute no-shows prevent the kitchen from saving food!</em>
          </div>
        </div>

      </div>

      {/* Skips History & Audit Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Your Skipped Meals & Status</h3>
            <p className="text-xs text-slate-400">Track kitchen adjustment status and verified food cost savings</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            {skipsList.length} Total Records
          </span>
        </div>

        {skipsList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Meal</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Verified Savings</th>
                  <th className="py-3 px-4 text-right">Your Wallet Reward</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {skipsList.map((skip) => (
                  <tr key={skip._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{skip.date}</td>
                    <td className="py-3.5 px-4 font-medium capitalize text-slate-700">{skip.mealType}</td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{skip.reason}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(skip.status)}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {skip.verifiedSavings > 0 ? `₹${skip.verifiedSavings}` : 'Pending cook audit'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {skip.isWalletCredited ? (
                        <span className="font-bold text-emerald-600 text-sm">
                          +₹{skip.studentCreditAmount}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">
                          Credited after meal
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center text-xs text-slate-400">
            No skipped meals logged yet. If you have upcoming leaves, skip in advance above!
          </div>
        )}
      </div>
    </div>
  );
}
