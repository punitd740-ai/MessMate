import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  RefreshCw,
  Search
} from 'lucide-react';
import { api } from '../../api/apiClient';

export default function DisputesOversightTab() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchComplaints = async () => {
    setLoading(true);
    const res = await api.get('/admin/complaints');
    if (res.success) {
      setComplaints(res.complaints || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filtered = complaints.filter(c => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Platform Complaints & Quality Oversight</h2>
          <p className="text-xs text-slate-500">
            Monitor student food quality ratings, service hygiene tickets, and mess resolution responses
          </p>
        </div>

        <button
          onClick={fetchComplaints}
          className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit text-xs font-semibold">
        {['all', 'pending', 'in_progress', 'resolved'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
              statusFilter === st
                ? 'bg-white text-emerald-800 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          All Logged Complaints ({filtered.length})
        </h3>

        {filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{item.subject}</span>
                      <span className="capitalize text-[10px] font-semibold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">
                        {item.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {item.studentName}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-emerald-900 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-emerald-700" />
                        {item.messName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {item.rating}★
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : item.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                  "{item.description}"
                </p>

                {item.resolutionNotes ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-950">
                    <strong className="block text-[11px] text-emerald-800 mb-0.5">Mess Owner Resolution:</strong>
                    <span>{item.resolutionNotes}</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 italic">
                    Awaiting response from mess kitchen...
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400">
            No complaints found matching this filter.
          </div>
        )}
      </div>
    </div>
  );
}
