import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  RefreshCw
} from 'lucide-react';
import { api } from '../../api/apiClient';

export default function ComplaintsTab() {
  const [complaints, setComplaints] = useState([]);
  const [membershipData, setMembershipData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [type, setType] = useState('complaint');
  const [category, setCategory] = useState('food_quality');
  const [rating, setRating] = useState(4);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    const [compRes, memRes] = await Promise.all([
      api.get('/student/complaints'),
      api.get('/student/membership/current')
    ]);

    if (compRes.success) setComplaints(compRes.items || []);
    if (memRes.success) setMembershipData(memRes);
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!membershipData?.membership?.messId) {
      setNotification({
        type: 'error',
        message: 'You need an active mess membership to submit feedback.'
      });
      return;
    }

    setSubmitting(true);
    const res = await api.post('/student/complaints', {
      messId: membershipData.membership.messId,
      type,
      category,
      rating,
      subject,
      description
    });

    setSubmitting(false);
    if (res.success) {
      setNotification({
        type: 'success',
        message: 'Your feedback/complaint has been submitted. The mess owner has been alerted!'
      });
      setSubject('');
      setDescription('');
      fetchComplaints();
    } else {
      setNotification({
        type: 'error',
        message: res.message || 'Submission failed'
      });
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
            Pending Review
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

      {/* Grid: Form on Left, Tickets on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Feedback & Complaints</h2>
              <p className="text-xs text-slate-400">Rate food quality or report dining issues directly</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
            {/* Type selector */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Submission Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'complaint', label: 'Complaint' },
                  { id: 'feedback', label: 'Feedback' },
                  { id: 'suggestion', label: 'Suggestion' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    className={`py-2 px-1 text-center font-semibold rounded-xl border capitalize ${
                      type === t.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800"
              >
                <option value="food_quality">Food Quality & Taste</option>
                <option value="cleanliness">Dining Hall Cleanliness & Hygiene</option>
                <option value="service">Serving Speed / Staff Behavior</option>
                <option value="billing">Billing & Membership</option>
                <option value="other">Other Inquiry</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Food Quality Rating ({rating} of 5 Stars)
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Roti queue delay on Monday lunch"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Details & Suggestions</label>
              <textarea
                required
                rows={3}
                placeholder="Provide constructive feedback so the head chef can take immediate action..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Send Feedback'}</span>
            </button>
          </form>
        </div>

        {/* Tickets List on Right */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-900">Your Past Tickets & Responses</h3>
              <button
                onClick={fetchComplaints}
                className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {complaints.length > 0 ? (
              <div className="space-y-4">
                {complaints.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2 text-left"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{item.subject}</div>
                        <div className="text-[11px] text-slate-400 capitalize mt-0.5">
                          {item.type} • {item.category?.replace('_', ' ')} • Rating: {item.rating}★
                        </div>
                      </div>
                      <div>{getStatusBadge(item.status)}</div>
                    </div>

                    <p className="text-slate-600 leading-relaxed">{item.description}</p>

                    {item.resolutionNotes ? (
                      <div className="mt-2 pt-2 border-t border-slate-200/80 bg-white p-3 rounded-xl border">
                        <div className="font-semibold text-emerald-800 text-[11px] mb-0.5">
                          Mess Owner Response:
                        </div>
                        <p className="text-slate-700 italic">{item.resolutionNotes}</p>
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400 italic">
                        Awaiting management review...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-slate-400">
                You haven't submitted any complaints or feedback yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
