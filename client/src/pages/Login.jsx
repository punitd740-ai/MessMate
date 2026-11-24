import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  UtensilsCrossed,
  Sparkles,
  Lock,
  Mail,
  GraduationCap,
  ChefHat,
  Shield,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export default function Login() {
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectByRole = (role) => {
    if (role === 'student') navigate('/student');
    else if (role === 'mess_owner') navigate('/owner');
    else if (role === 'super_admin') navigate('/admin');
    else navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      redirectByRole(res.user.role);
    } else {
      setError(res.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleQuick = async (roleName) => {
    setError('');
    setLoading(true);
    const res = await quickLogin(roleName);
    setLoading(false);
    if (res.success) {
      redirectByRole(res.user.role);
    } else {
      setError(res.message || 'Quick login failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-7 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-600/25 mb-4">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back to MessMate
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Log in to manage your mess membership, meals, and savings wallet
          </p>
        </div>

        {/* Quick Demo One-Click Login Pills */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider justify-center">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Instant Demo Logins</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuick('student')}
              className="py-2 px-1 text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors flex flex-col items-center gap-1"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuick('mess_owner')}
              className="py-2 px-1 text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors flex flex-col items-center gap-1"
            >
              <ChefHat className="w-4 h-4 text-emerald-600" />
              <span>Mess Owner</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuick('super_admin')}
              className="py-2 px-1 text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors flex flex-col items-center gap-1"
            >
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-xs text-slate-400 font-medium">Or log in with credentials</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@student.com"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-emerald-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
