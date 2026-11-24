import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  ChefHat,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Lock,
  Unlock
} from 'lucide-react';
import { api } from '../../api/apiClient';

export default function UsersManagementTab() {
  const [activeSubTab, setActiveSubTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    const [stuRes, ownRes] = await Promise.all([
      api.get('/admin/students'),
      api.get('/admin/mess-owners')
    ]);

    if (stuRes.success) setStudents(stuRes.students || []);
    if (ownRes.success) setOwners(ownRes.owners || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    setActionLoading(true);

    const res = await api.put(`/admin/users/${user._id}/status`, {
      status: nextStatus
    });

    setActionLoading(false);
    if (res.success) {
      setNotification({
        type: 'success',
        message: `${user.name}'s account status has been changed to "${nextStatus}".`
      });
      fetchUsers();
    } else {
      setNotification({ type: 'error', message: res.message || 'Status update failed' });
    }
  };

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOwners = owners.filter(o =>
    o.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">User Account Governance</h2>
          <p className="text-xs text-slate-500">
            Audit, verify, and govern student accounts and partner mess owner profiles
          </p>
        </div>

        <button
          onClick={fetchUsers}
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

      {/* Filter / SubTab Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setActiveSubTab('students')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'students'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Students ({students.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('owners')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'owners'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Mess Owners ({owners.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 capitalize">
          {activeSubTab === 'students' ? 'Registered Student Accounts' : 'Registered Mess Owner Accounts'}
        </h3>

        {activeSubTab === 'students' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Active Plan</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Governance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((stu) => (
                  <tr key={stu._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{stu.name}</td>
                    <td className="py-3.5 px-4 text-slate-500">{stu.email}</td>
                    <td className="py-3.5 px-4 text-slate-500">{stu.phone || '—'}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{stu.currentPlan}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          stu.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {stu.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(stu)}
                        disabled={actionLoading}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ml-auto ${
                          stu.status === 'active'
                            ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        {stu.status === 'active' ? (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Suspend</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Activate</span>
                          </>
                        )}
                      </button>
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
                  <th className="py-3 px-4">Owner Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Assigned Mess</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Governance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOwners.map((own) => (
                  <tr key={own._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{own.name}</td>
                    <td className="py-3.5 px-4 text-slate-500">{own.email}</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-800">
                      {own.messDetails?.name || 'Mess Partner'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{own.phone || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          own.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {own.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(own)}
                        disabled={actionLoading}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ml-auto ${
                          own.status === 'active'
                            ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        {own.status === 'active' ? (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Suspend</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Activate</span>
                          </>
                        )}
                      </button>
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
