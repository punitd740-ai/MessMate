import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Send,
  User
} from 'lucide-react';
import { api } from '../../api/apiClient';
import Modal from '../../components/Modal';

export default function OwnerComplaintsTab() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Response Modal State
  const [respondModalOpen, setRespondModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [responseStatus, setResponseStatus] = useState('resolved');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    const res = await api.get('/owner/complaints');
    if (res.success) {
      setComplaints(res.items || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSendResponse = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setActionLoading(true);

    const res = await api.put(`/owner/complaints/${selectedComplaint._id}`, {
      status: responseStatus,
      resolutionNotes
    });

    setActionLoading(false);
    if (res.success) {
      setRespondModalOpen(false);
      setNotification({ type: 'success', message: 'Response recorded and student notified!' });
      fetchComplaints();
    } else {
      setNotification({ type: 'error', message: res.message || 'Response failed' });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Resolved
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            In Progress
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Complaints & Food Quality Feedback</h2>
          <p className="text-xs text-slate-500">
            Review feedback, maintain kitchen hygiene, and respond directly to student queries
          </p>
        </div>

        <button
          onClick={fetchComplaints}
          className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
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

      {/* Tickets Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-900">Student Submissions Queue</h3>
          <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
            {complaints.length} Tickets
          </span>
        </div>

        {complaints.length > 0 ? (
          <div className="space-y-4">
            {complaints.map((item) => (
              <div
                key={item._id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{item.subject}</span>
                      <span className="capitalize text-[10px] font-semibold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">
                        {item.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <User className="w-3 h-3 text-slate-400" />
                        {item.studentName || 'Student'}
                      </span>
                      <span>•</span>
                      <span>Category: <strong className="capitalize">{item.category?.replace('_', ' ')}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {item.rating}★
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(item.status)}
                    <button
                      onClick={() => {
                        setSelectedComplaint(item);
                        setResponseStatus(item.status || 'resolved');
                        setResolutionNotes(item.resolutionNotes || '');
                        setRespondModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      {item.resolutionNotes ? 'Update Response' : 'Reply / Resolve'}
                    </button>
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                  "{item.description}"
                </p>

                {item.resolutionNotes && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-950">
                    <strong className="block text-[11px] text-emerald-800 mb-0.5">Your Response:</strong>
                    <span>{item.resolutionNotes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400">
            No complaints or feedback submitted by students yet.
          </div>
        )}
      </div>

      {/* Response Modal */}
      <Modal isOpen={respondModalOpen} onClose={() => setRespondModalOpen(false)} title="Respond to Student Feedback">
        {selectedComplaint && (
          <form onSubmit={handleSendResponse} className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="font-bold text-slate-900 text-sm">{selectedComplaint.subject}</div>
              <div className="text-slate-500 mt-1 italic">"{selectedComplaint.description}"</div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={responseStatus}
                onChange={(e) => setResponseStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="in_progress">In Progress (Investigating)</option>
                <option value="resolved">Resolved (Corrective action taken)</option>
                <option value="rejected">Rejected / Invalid</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Resolution Notes / Action Taken
              </label>
              <textarea
                required
                rows={3}
                placeholder="Explain the corrective action taken by the kitchen team..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRespondModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow"
              >
                {actionLoading ? 'Saving...' : 'Submit Response'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
