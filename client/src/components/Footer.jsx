import React from 'react';
import { UtensilsCrossed, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Mess<span className="text-emerald-400">Mate</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              One Platform. Two-Sided Convenience. Complete Smart Mess Management.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              "Save Food. Save Money. Manage Smartly."
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
                  How MessMate Works
                </a>
              </li>
              <li>
                <a href="#shared-savings" className="hover:text-emerald-400 transition-colors">
                  Shared Savings Wallet
                </a>
              </li>
              <li>
                <a href="#plans" className="hover:text-emerald-400 transition-colors">
                  Campus Mess Plans
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Mess Owner Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Key Capabilities
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Advance Meal Skipping</li>
              <li>Confirmed Kitchen Demand Count</li>
              <li>Verified Food Cost Split (50/50)</li>
              <li>Smart Raw Material Forecasting</li>
              <li>Automated Membership Day Tracking</li>
              <li>Zero Double-Reward Verification</li>
            </ul>
          </div>

          {/* Contact / Help */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Campus Support
            </h4>
            <p className="text-sm text-slate-400 mb-3">
              Deploy MessMate in your university or college hostel mess today.
            </p>
            <div className="space-y-2 text-sm text-slate-300">
              <div>Email: <span className="text-emerald-400 font-medium">support@messmate.com</span></div>
              <div>Hotline: <span className="text-slate-100">+91 (011) 4920-MESS</span></div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>JWT Encrypted & RBAC Protected</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            © 2026 MessMate Inc. All rights reserved. Built for Smart University Hostels & Dining.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            Engineered with <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" /> for zero food wastage.
          </div>
        </div>
      </div>
    </footer>
  );
}
