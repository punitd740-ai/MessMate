import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  Calendar,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Tag,
  Clock,
  Phone,
  Mail
} from 'lucide-react';
import { api } from '../../api/apiClient';
import Modal from '../../components/Modal';

export default function StudentManagementTab() {
  const [students, setStudents] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // New Plan Modal State
  const [newPlanModalOpen, setNewPlanModalOpen] = useState(false);
  const [planName, setPlanName] = useState('');
  const [planType, setPlanType] = useState('monthly');
  const [planDuration, setPlanDuration] = useState(30);
  const [planPrice, setPlanPrice] = useState(3200);
  const [planDesc, setPlanDesc] = useState('Nutritious dining with flexible meal skip credits');
  const [planMeals, setPlanMeals] = useState(['breakfast', 'lunch', 'dinner']);

  const fetchData = async () => {
    setLoading(true);
    const [stuRes, plansRes] = await Promise.all([
      api.get('/owner/students'),
      api.get('/owner/plans')
    ]);

    if (stuRes.success) setStudents(stuRes.students || []);
    if (plansRes.success) setPlans(plansRes.plans || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleMeal = (meal) => {
    if (planMeals.includes(meal)) {
      if (planMeals.length === 1) return; // At least 1 meal required
      setPlanMeals(planMeals.filter(m => m !== meal));
    } else {
      setPlanMeals([...planMeals, meal]);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const res = await api.post('/owner/plans', {
      name: planName,
      type: planType,
      durationDays: Number(planDuration),
      price: Number(planPrice),
      mealsIncluded: planMeals,
      description: planDesc,
      features: [
        `${planMeals.length} Meals / Day (${planMeals.join(', ')})`,
        'Shared Savings Wallet Enabled',
        'Flexible Pause Allowed on Leave'
      ]
    });

    setActionLoading(false);
    if (res.success) {
      setNewPlanModalOpen(false);
      setNotification({ type: 'success', message: `Plan "${planName}" created successfully!` });
      setPlanName('');
      fetchData();
    } else {
      setNotification({ type: 'error', message: res.message || 'Plan creation failed' });
    }
  };

  const activeCount = students.filter(s => s.status === 'active').length;

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student & Membership Administration</h2>
          <p className="text-xs text-slate-500">
            Track student memberships, dietary preferences, days remaining, and configure pricing plans
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNewPlanModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Dining Plan</span>
          </button>
          <button
            onClick={fetchData}
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

      {/* Enrolled Students Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Enrolled Students & Active Memberships</h3>
            <p className="text-xs text-slate-400">Dietary preferences and live membership expiration dates</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            {activeCount} Active / {students.length} Total
          </span>
        </div>

        {students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Plan Name</th>
                  <th className="py-3 px-4">Dietary Preference</th>
                  <th className="py-3 px-4">Remaining Days</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((stu) => (
                  <tr key={stu.membershipId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                          {stu.studentName.charAt(0)}
                        </div>
                        <span>{stu.studentName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      <div>{stu.studentPhone || 'No phone'}</div>
                      <div className="text-[10px] text-slate-400">{stu.studentEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{stu.planName}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {stu.dietaryPreference || 'Standard'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-700 text-sm">
                      {stu.remainingDays} Days
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{stu.endDate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          stu.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : stu.status === 'paused'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {stu.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400">
            No students enrolled yet. Students who purchase your plans will appear here.
          </div>
        )}
      </div>

      {/* Configured Membership Plans Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Your Configured Membership Packages</h3>
            <p className="text-xs text-slate-400">Available for students to browse and activate</p>
          </div>
          <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
            {plans.length} Active Plans
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p._id}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between text-left"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                    {p.type}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{p.durationDays} Days</span>
                </div>

                <h4 className="text-base font-bold text-slate-900">{p.name}</h4>
                <div className="text-2xl font-black text-slate-900 mt-2">
                  ₹{p.price}
                  <span className="text-xs font-normal text-slate-500"> / cycle</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{p.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-1 text-xs text-slate-600">
                  <div className="font-semibold text-slate-700 mb-1">
                    Meals: <span className="capitalize font-normal">{p.mealsIncluded?.join(', ')}</span>
                  </div>
                  {p.features?.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200/60 text-right">
                <span className="text-[11px] font-bold text-emerald-700">● Live on Student Catalog</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Plan Modal */}
      <Modal isOpen={newPlanModalOpen} onClose={() => setNewPlanModalOpen(false)} title="Create New Dining Membership Plan">
        <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Plan Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Gold Full Board (3 Meals/Day)"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Plan Cycle Type</label>
              <select
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="monthly">Monthly (30 Days)</option>
                <option value="quarterly">Quarterly / Semester (90 Days)</option>
                <option value="annual">Annual (365 Days)</option>
                <option value="custom">Custom Duration</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Duration (Days)</label>
              <input
                type="number"
                min="1"
                required
                value={planDuration}
                onChange={(e) => setPlanDuration(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pricing (₹)</label>
            <input
              type="number"
              min="500"
              required
              value={planPrice}
              onChange={(e) => setPlanPrice(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Meals Included</label>
            <div className="flex gap-4">
              {['breakfast', 'lunch', 'dinner'].map((m) => (
                <label key={m} className="flex items-center gap-2 cursor-pointer capitalize font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={planMeals.includes(m)}
                    onChange={() => handleToggleMeal(m)}
                    className="accent-emerald-600 rounded"
                  />
                  <span>{m}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              required
              rows={2}
              value={planDesc}
              onChange={(e) => setPlanDesc(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setNewPlanModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow"
            >
              {actionLoading ? 'Creating...' : 'Create Plan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
