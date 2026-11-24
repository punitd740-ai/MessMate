import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Wallet,
  CreditCard,
  MessageSquare,
  UserCheck,
  ChefHat,
  Package,
  DollarSign,
  Users,
  Shield,
  UtensilsCrossed,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ items, activeTab, onSelectTab, isOpen, onClose, roleTitle }) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-base">
                  Mess<span className="text-emerald-600">Mate</span>
                </span>
                <span className="block text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">
                  {roleTitle}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info snippet */}
          <div className="p-4 mx-3 my-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-800 truncate">{user?.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1 mt-2">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
