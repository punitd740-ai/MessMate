import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  UtensilsCrossed,
  Sparkles,
  Shield,
  ChefHat,
  GraduationCap,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const { user, role, logout, quickLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickLoginOpen, setQuickLoginOpen] = useState(false);

  const handleQuickLogin = async (roleName) => {
    setQuickLoginOpen(false);
    setMobileMenuOpen(false);
    const res = await quickLogin(roleName);
    if (res.success) {
      if (roleName === 'student') navigate('/student');
      else if (roleName === 'mess_owner') navigate('/owner');
      else if (roleName === 'super_admin') navigate('/admin');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (role === 'student') return '/student';
    if (role === 'mess_owner') return '/owner';
    if (role === 'super_admin') return '/admin';
    return '/';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Mess<span className="text-emerald-600">Mate</span>
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                  Smart
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none hidden sm:block">
                Smart Mess Management
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-emerald-600 transition-colors">
              Home
            </Link>
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">
              How It Works
            </a>
            <a href="#shared-savings" className="hover:text-emerald-600 transition-colors flex items-center gap-1 text-emerald-700 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Shared Savings
            </a>
            <a href="#features" className="hover:text-emerald-600 transition-colors">
              Features
            </a>
            <a href="#plans" className="hover:text-emerald-600 transition-colors">
              Mess Plans
            </a>
          </div>

          {/* Right Action / Auth Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setQuickLoginOpen(!quickLoginOpen)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
                title="Quick Demo Role Login"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant Demo Login</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {quickLoginOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Test Persona
                  </div>
                  <button
                    onClick={() => handleQuickLogin('student')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5 transition-colors"
                  >
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-medium">Student (Aarav)</div>
                      <div className="text-[11px] text-slate-400">Wallet, skips & menu</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleQuickLogin('mess_owner')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5 transition-colors"
                  >
                    <ChefHat className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-medium">Mess Owner (Rajesh)</div>
                      <div className="text-[11px] text-slate-400">Kitchen, stock & savings</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleQuickLogin('super_admin')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-medium">Super Admin (Vikram)</div>
                      <div className="text-[11px] text-slate-400">Platform control & metrics</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <Link
                  to={getDashboardPath()}
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard ({user.name.split(' ')[0]})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-600/20 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-emerald-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Home
            </Link>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              How It Works
            </a>
            <a
              href="#shared-savings"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-700 hover:bg-emerald-50"
            >
              Shared Savings Wallet
            </a>
            <a
              href="#plans"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Mess Plans
            </a>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase">Quick Demo Login</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickLogin('student')}
                className="py-1.5 px-2 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200"
              >
                Student
              </button>
              <button
                onClick={() => handleQuickLogin('mess_owner')}
                className="py-1.5 px-2 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200"
              >
                Mess Owner
              </button>
              <button
                onClick={() => handleQuickLogin('super_admin')}
                className="py-1.5 px-2 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200"
              >
                Admin
              </button>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 font-medium px-3 py-2"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
