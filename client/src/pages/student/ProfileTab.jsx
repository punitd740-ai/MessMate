import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  CheckCircle2,
  AlertCircle,
  Save,
  KeyRound
} from 'lucide-react';
import { api } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';

export default function ProfileTab() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [dietaryPreference, setDietaryPreference] = useState(user?.dietaryPreference || 'Vegetarian');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    const res = await api.put('/auth/profile', {
      name,
      phone,
      address,
      dietaryPreference
    });
    setSavingProfile(false);

    if (res.success) {
      setNotification({ type: 'success', message: 'Profile details updated successfully!' });
      refreshUser();
    } else {
      setNotification({ type: 'error', message: res.message || 'Profile update failed' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setNotification({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    setSavingPassword(true);
    const res = await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    });
    setSavingPassword(false);

    if (res.success) {
      setNotification({ type: 'success', message: 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setNotification({ type: 'error', message: res.message || 'Password change failed' });
    }
  };

  return (
    <div className="space-y-8 text-left">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Account & Preferences</h2>
        <p className="text-xs text-slate-500">
          Manage your personal dining details, dietary preference, and security
        </p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
        {/* Personal Details Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
              <p className="text-xs text-slate-400">Hostel room, contact, and meal preference</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email (Cannot be modified)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 99112 33445"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hostel Room / Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Room 304, Ganga Boys Hostel"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dietary Preference</label>
              <select
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
              >
                <option value="Vegetarian">Vegetarian (Homestyle)</option>
                <option value="Jain Friendly / Vegetarian">Jain Friendly (No Onion / Garlic)</option>
                <option value="Non-Vegetarian / Eggitarian">Non-Vegetarian / Eggitarian</option>
                <option value="Vegan">Vegan (Plant-based)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Change Password</h3>
                <p className="text-xs text-slate-400">Keep your mess account safe and secure</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Lock className="w-4 h-4" />
                <span>{savingPassword ? 'Updating...' : 'Update Password'}</span>
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-slate-100 text-[11px] text-slate-400">
            Account Role: <strong className="text-emerald-700 uppercase">{user?.role}</strong> • Status: <strong className="text-emerald-700">{user?.status || 'Active'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
