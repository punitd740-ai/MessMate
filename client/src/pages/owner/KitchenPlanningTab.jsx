import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Scale,
  Calculator,
  Save,
  Trash2,
  Plus,
  RefreshCw
} from 'lucide-react';
import { api } from '../../api/apiClient';
import Modal from '../../components/Modal';

export default function KitchenPlanningTab() {
  const todayStr = new Date().toISOString().split('T')[0];
  const [targetDate, setTargetDate] = useState(todayStr);

  const [planningData, setPlanningData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Menu Form State
  const [breakfastItems, setBreakfastItems] = useState('');
  const [breakfastStart, setBreakfastStart] = useState('07:30');
  const [breakfastEnd, setBreakfastEnd] = useState('09:30');

  const [lunchItems, setLunchItems] = useState('');
  const [lunchStart, setLunchStart] = useState('12:30');
  const [lunchEnd, setLunchEnd] = useState('14:30');

  const [dinnerItems, setDinnerItems] = useState('');
  const [dinnerStart, setDinnerStart] = useState('19:30');
  const [dinnerEnd, setDinnerEnd] = useState('21:30');

  const [specialNotes, setSpecialNotes] = useState('');

  // Food Waste Modal
  const [wasteModalOpen, setWasteModalOpen] = useState(false);
  const [wasteMealType, setWasteMealType] = useState('lunch');
  const [plannedKg, setPlannedKg] = useState(40);
  const [consumedKg, setConsumedKg] = useState(38);
  const [wastedKg, setWastedKg] = useState(2);
  const [wasteReason, setWasteReason] = useState('Students departed for weekend without advance skip notice');

  const fetchPlanning = async (dateToFetch) => {
    setLoading(true);
    const dateParam = dateToFetch || targetDate;
    const res = await api.get('/owner/kitchen/planning', { date: dateParam });
    if (res.success) {
      setPlanningData(res);
      if (res.menu) {
        setBreakfastItems(res.menu.breakfast?.items?.join(', ') || '');
        setBreakfastStart(res.menu.breakfast?.startTime || '07:30');
        setBreakfastEnd(res.menu.breakfast?.endTime || '09:30');

        setLunchItems(res.menu.lunch?.items?.join(', ') || '');
        setLunchStart(res.menu.lunch?.startTime || '12:30');
        setLunchEnd(res.menu.lunch?.endTime || '14:30');

        setDinnerItems(res.menu.dinner?.items?.join(', ') || '');
        setDinnerStart(res.menu.dinner?.startTime || '19:30');
        setDinnerEnd(res.menu.dinner?.endTime || '21:30');

        setSpecialNotes(res.menu.specialNotes || '');
      } else {
        // Clear if no menu
        setBreakfastItems('');
        setLunchItems('');
        setDinnerItems('');
        setSpecialNotes('');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlanning(targetDate);
  }, [targetDate]);

  const handleAdjustPrep = async (mealType) => {
    setActionLoading(true);
    const res = await api.post('/owner/kitchen/adjust', {
      date: targetDate,
      mealType
    });
    setActionLoading(false);

    if (res.success) {
      setNotification({
        type: 'success',
        message: `Kitchen prep adjusted for ${mealType}! ${res.result.skipsAdjustedCount} skip(s) confirmed and raw ingredients reduced by ~${res.result.estimatedIngredientsSavedKg} kg.`
      });
      fetchPlanning(targetDate);
    } else {
      setNotification({ type: 'error', message: res.message || 'Adjustment failed' });
    }
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const payload = {
      date: targetDate,
      breakfast: {
        items: breakfastItems.split(',').map(s => s.trim()).filter(Boolean),
        startTime: breakfastStart,
        endTime: breakfastEnd
      },
      lunch: {
        items: lunchItems.split(',').map(s => s.trim()).filter(Boolean),
        startTime: lunchStart,
        endTime: lunchEnd
      },
      dinner: {
        items: dinnerItems.split(',').map(s => s.trim()).filter(Boolean),
        startTime: dinnerStart,
        endTime: dinnerEnd
      },
      specialNotes
    };

    const res = await api.post('/owner/kitchen/menu', payload);
    setActionLoading(false);

    if (res.success) {
      setNotification({ type: 'success', message: 'Kitchen menu updated successfully for ' + targetDate });
      fetchPlanning(targetDate);
    } else {
      setNotification({ type: 'error', message: res.message || 'Failed to save menu' });
    }
  };

  const handleLogWaste = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const res = await api.post('/owner/kitchen/waste', {
      date: targetDate,
      mealType: wasteMealType,
      plannedQuantityKg: Number(plannedKg),
      consumedQuantityKg: Number(consumedKg),
      wastedQuantityKg: Number(wastedKg),
      wasteCostEstimated: Number(wastedKg) * 45,
      reason: wasteReason
    });

    setActionLoading(false);
    if (res.success) {
      setWasteModalOpen(false);
      setNotification({ type: 'success', message: 'Food wastage incident logged for kitchen audit.' });
      fetchPlanning(targetDate);
    } else {
      setNotification({ type: 'error', message: res.message || 'Logging waste failed' });
    }
  };

  const mealStats = planningData?.mealStats || [];
  const wasteRecords = planningData?.wasteRecords || [];

  return (
    <div className="space-y-8 text-left">
      {/* Top Header with Date Picker */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Daily Kitchen Demand & Meal Planning</h2>
          <p className="text-xs text-slate-500">
            Real-time confirmed student availability, raw ingredient calculator, and food waste logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Select Date:</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 shadow-sm"
          />
          <button
            onClick={() => fetchPlanning(targetDate)}
            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg"
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

      {/* 1. Confirmed Demand & Raw Quantities Cards */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
          Confirmed Meal Demand & Raw Ingredients Forecast
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mealStats.map((meal) => (
            <div
              key={meal.mealType}
              className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    {meal.mealType}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {meal.totalEnrolled} Total Enrolled
                  </span>
                </div>

                {/* Confirmed Headcount Display */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4 text-center">
                  <span className="text-[11px] text-slate-500 block uppercase font-medium">
                    Confirmed Kitchen Demand
                  </span>
                  <div className="text-3xl font-black text-slate-900 mt-0.5">
                    {meal.confirmedDemand} Students
                  </div>
                  <div className="text-xs text-emerald-700 font-semibold mt-1">
                    {meal.skippedCount} meal(s) skipped in advance
                  </div>
                </div>

                {/* Smart Raw Quantity Calculator */}
                <div className="space-y-2 text-xs">
                  <div className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                    <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Recommended Raw Ingredients:</span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50/70">
                    <span className="text-slate-600">Grains (Rice / Atta):</span>
                    <strong className="text-slate-900">{meal.rawRequirements.grainsKg} kg</strong>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50/70">
                    <span className="text-slate-600">Fresh Vegetables:</span>
                    <strong className="text-slate-900">{meal.rawRequirements.vegetablesKg} kg</strong>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50/70">
                    <span className="text-slate-600">Pulses & Dairy:</span>
                    <strong className="text-slate-900">{meal.rawRequirements.pulsesDairyKg} kg</strong>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleAdjustPrep(meal.mealType)}
                disabled={actionLoading || meal.skippedCount === 0}
                className="mt-6 w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all disabled:opacity-40 disabled:bg-slate-200 disabled:text-slate-500"
              >
                {meal.skippedCount > 0 ? 'Adjust Kitchen Prep' : 'No Skips to Adjust'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Menu Management & Food Waste Log Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Menu Editor Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Daily Meal Menu for {targetDate}
              </h3>
              <p className="text-xs text-slate-400">
                Published to students so they can view daily dishes and decide skips
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Published Live
            </span>
          </div>

          <form onSubmit={handleSaveMenu} className="space-y-4 text-xs">
            {/* Breakfast */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex justify-between items-center font-bold text-slate-800">
                <span className="uppercase text-emerald-700">Breakfast Menu</span>
                <div className="flex items-center gap-1 font-normal text-slate-500">
                  <input
                    type="time"
                    value={breakfastStart}
                    onChange={(e) => setBreakfastStart(e.target.value)}
                    className="px-1.5 py-0.5 bg-white border border-slate-200 rounded"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={breakfastEnd}
                    onChange={(e) => setBreakfastEnd(e.target.value)}
                    className="px-1.5 py-0.5 bg-white border border-slate-200 rounded"
                  />
                </div>
              </div>
              <input
                type="text"
                required
                placeholder="Comma separated items: Aloo Paratha, Curd, Poha, Chai"
                value={breakfastItems}
                onChange={(e) => setBreakfastItems(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm"
              />
            </div>

            {/* Lunch */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex justify-between items-center font-bold text-slate-800">
                <span className="uppercase text-emerald-700">Lunch Menu</span>
                <div className="flex items-center gap-1 font-normal text-slate-500">
                  <input
                    type="time"
                    value={lunchStart}
                    onChange={(e) => setLunchStart(e.target.value)}
                    className="px-1.5 py-0.5 bg-white border border-slate-200 rounded"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={lunchEnd}
                    onChange={(e) => setLunchEnd(e.target.value)}
                    className="px-1.5 py-0.5 bg-white border border-slate-200 rounded"
                  />
                </div>
              </div>
              <input
                type="text"
                required
                placeholder="Comma separated items: Paneer Butter Masala, Dal Tadka, Jeera Rice, Roti"
                value={lunchItems}
                onChange={(e) => setLunchItems(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm"
              />
            </div>

            {/* Dinner */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex justify-between items-center font-bold text-slate-800">
                <span className="uppercase text-emerald-700">Dinner Menu</span>
                <div className="flex items-center gap-1 font-normal text-slate-500">
                  <input
                    type="time"
                    value={dinnerStart}
                    onChange={(e) => setDinnerStart(e.target.value)}
                    className="px-1.5 py-0.5 bg-white border border-slate-200 rounded"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={dinnerEnd}
                    onChange={(e) => setDinnerEnd(e.target.value)}
                    className="px-1.5 py-0.5 bg-white border border-slate-200 rounded"
                  />
                </div>
              </div>
              <input
                type="text"
                required
                placeholder="Comma separated items: Matar Mushroom, Dal Makhani, Steamed Rice, Naan, Sweet"
                value={dinnerItems}
                onChange={(e) => setDinnerItems(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm"
              />
            </div>

            {/* Special Notes */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Special Kitchen Notes / Feast Highlights
              </label>
              <input
                type="text"
                placeholder="e.g. Festival feast with hot Gulab Jamun at dinner!"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{actionLoading ? 'Saving Menu...' : 'Publish Kitchen Menu'}</span>
            </button>
          </form>
        </div>

        {/* Food Waste Logger & Audit */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Food Wastage Tracking</h3>
                <p className="text-xs text-slate-400">Audit surplus leftovers to optimize future prep</p>
              </div>
              <button
                onClick={() => setWasteModalOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Waste</span>
              </button>
            </div>

            {wasteRecords.length > 0 ? (
              <div className="space-y-3 text-xs">
                {wasteRecords.map((w) => (
                  <div
                    key={w._id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5"
                  >
                    <div className="flex justify-between items-center font-bold text-slate-800">
                      <span className="capitalize text-emerald-800">{w.mealType}</span>
                      <span className="text-red-600">{w.wastedQuantityKg} kg Wasted (~₹{w.wasteCostEstimated})</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Prepared: {w.plannedQuantityKg} kg • Consumed: {w.consumedQuantityKg} kg
                    </div>
                    <div className="text-[11px] text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100">
                      Reason: "{w.reason}"
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-slate-400">
                No food wastage logged for {targetDate}. Zero waste achieved!
              </div>
            )}
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 mt-4">
            💡 <strong>MessMate Impact:</strong> Mms with advance meal skip mechanisms reduce cooked wastage by up to <strong>34%</strong> in the first month.
          </div>
        </div>

      </div>

      {/* Waste Logging Modal */}
      <Modal isOpen={wasteModalOpen} onClose={() => setWasteModalOpen(false)} title="Log Kitchen Food Waste">
        <form onSubmit={handleLogWaste} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Meal Slot</label>
            <select
              value={wasteMealType}
              onChange={(e) => setWasteMealType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Planned (kg)</label>
              <input
                type="number"
                required
                value={plannedKg}
                onChange={(e) => setPlannedKg(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Consumed (kg)</label>
              <input
                type="number"
                required
                value={consumedKg}
                onChange={(e) => setConsumedKg(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Wasted (kg)</label>
              <input
                type="number"
                required
                value={wastedKg}
                onChange={(e) => setWastedKg(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-red-600 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Primary Reason for Waste</label>
            <textarea
              required
              rows={2}
              value={wasteReason}
              onChange={(e) => setWasteReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setWasteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              {actionLoading ? 'Logging...' : 'Save Incident'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
