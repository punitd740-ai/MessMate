import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Wallet,
  CreditCard,
  MessageSquare,
  UserCheck,
  Menu,
  Sparkles,
  UtensilsCrossed,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

// Subtabs
import OverviewTab from './OverviewTab';
import MembershipTab from './MembershipTab';
import MealManagementTab from './MealManagementTab';
import WalletTab from './WalletTab';
import PaymentsTab from './PaymentsTab';
import ComplaintsTab from './ComplaintsTab';
import ProfileTab from './ProfileTab';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'membership', label: 'My Membership', icon: UserCheck },
    { id: 'meals', label: 'Meal Planning & Skips', icon: Calendar },
    { id: 'wallet', label: 'Shared Savings Wallet', icon: Wallet },
    { id: 'payments', label: 'Invoices & Receipts', icon: CreditCard },
    { id: 'complaints', label: 'Complaints & Rating', icon: MessageSquare },
    { id: 'profile', label: 'Profile & Security', icon: UserCheck },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab user={user} onNavigateTab={setActiveTab} />;
      case 'membership':
        return <MembershipTab />;
      case 'meals':
        return <MealManagementTab />;
      case 'wallet':
        return <WalletTab />;
      case 'payments':
        return <PaymentsTab />;
      case 'complaints':
        return <ComplaintsTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <OverviewTab user={user} onNavigateTab={setActiveTab} />;
    }
  };

  const getTabTitle = () => {
    const item = navItems.find((i) => i.id === activeTab);
    return item ? item.label : 'Student Portal';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        items={navItems}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        roleTitle="Student Portal"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {getTabTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Shared Savings Active</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <span className="font-semibold text-slate-800 hidden md:inline">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}
