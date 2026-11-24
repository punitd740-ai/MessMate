import React, { useState, useEffect } from 'react';
import {
  Building,
  Star,
  Users,
  UtensilsCrossed,
  CheckCircle2,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Sparkles
} from 'lucide-react';
import { api } from '../../api/apiClient';
import Modal from '../../components/Modal';

export default function MessesManagementTab() {
  const [messes, setMesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMess, setSelectedMess] = useState(null);

  const fetchMesses = async () => {
    setLoading(true);
    const res = await api.get('/admin/messes');
    if (res.success) {
      setMesses(res.messes || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMesses();
  }, []);

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Registered Campus Messes</h2>
          <p className="text-xs text-slate-500">
            Monitor partner mess dining facilities, active enrolled students, and ratings
          </p>
        </div>

        <button
          onClick={fetchMesses}
          className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Messes Grid / Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-900">Partner Mess Directory</h3>
          <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
            {messes.length} Registered Messes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messes.map((m) => (
            <div
              key={m._id}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/60 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ★ {m.rating || 4.8} / 5.0
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {m.status || 'Active'}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-slate-900">{m.name}</h4>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-slate-400" />
                  <span>{m.cuisineType}</span>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Enrolled Students: <strong>{m.activeEnrolledStudents || 0} active members</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{m.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>Owner: {m.ownerName} ({m.ownerEmail})</span>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                  <div className="font-semibold text-emerald-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Shared Savings Ratio:</span>
                  </div>
                  <div>
                    {m.sharedSavingsConfig?.studentRewardPercentage}% Student / {m.sharedSavingsConfig?.ownerRewardPercentage}% Mess Owner
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedMess(m)}
                className="mt-5 w-full py-2 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-slate-200 hover:border-emerald-200 transition-colors"
              >
                View Full Mess Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mess Details Modal */}
      <Modal isOpen={!!selectedMess} onClose={() => setSelectedMess(null)} title="Mess Facility Details">
        {selectedMess && (
          <div className="space-y-4 text-xs text-left">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <h4 className="text-base font-bold text-emerald-950">{selectedMess.name}</h4>
              <p className="text-slate-600 mt-1">{selectedMess.address}</p>
              <div className="mt-2 text-emerald-800 font-semibold">
                Cuisine: {selectedMess.cuisineType} • Rating: ★ {selectedMess.rating}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-slate-800">Owner Contact Information:</div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                <div>Name: <strong>{selectedMess.ownerName}</strong></div>
                <div>Email: {selectedMess.ownerEmail}</div>
                <div>Phone: {selectedMess.phone || '98200 11223'}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-slate-800">Per-Meal Cost Economics:</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-slate-50 rounded-xl border">
                  <span className="text-[10px] text-slate-400 block">Raw Ingredients:</span>
                  <strong className="text-slate-900">₹{selectedMess.mealCostBreakdown?.rawMaterial || 35}</strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border">
                  <span className="text-[10px] text-slate-400 block">Labor & Prep:</span>
                  <strong className="text-slate-900">₹{selectedMess.mealCostBreakdown?.prepLabor || 15}</strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border">
                  <span className="text-[10px] text-slate-400 block">Overhead / Gas:</span>
                  <strong className="text-slate-900">₹{selectedMess.mealCostBreakdown?.fixedOverhead || 10}</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedMess(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-semibold text-xs"
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
