import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building,
  Users,
  Wallet,
  MessageSquare,
  Cpu,
  Menu,
  Shield,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

// Subviews
import AdminOverviewTab from './AdminOverviewTab';
import MessesManagementTab from './MessesManagementTab';
import UsersManagementTab from './UsersManagementTab';
import TransactionsMonitorTab from './TransactionsMonitorTab';
import DisputesOversightTab from './DisputesOversightTab';
import AiPreviewTab from './AiPreviewTab';

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Platform Overview', icon: LayoutDashboard },
    { id: 'messes', label: 'Registered Messes', icon: Building },
    { id: 'users', label: 'User Accounts', icon: Users },
    { id: 'transactions', label: 'Financial Audits', icon: Wallet },
    { id: 'disputes', label: 'Disputes & Quality', icon: MessageSquare },
    { id: 'ai-preview', label: 'Future AI Engine', icon: Cpu },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverviewTab onNavigateTab={setActiveTab} />;
      case 'messes':
        return <MessesManagementTab />;
      case 'users':
        return <UsersManagementTab />;
      case 'transactions':
        return <TransactionsMonitorTab />;
      case 'disputes':
        return <DisputesOversightTab />;
      case 'ai-preview':
        return <AiPreviewTab />;
      default:
        return <AdminOverviewTab onNavigateTab={setActiveTab} />;
    }
  };

  const getTabTitle = () => {
    const item = navItems.find((i) => i.id === activeTab);
    return item ? item.label : 'Super Admin Portal';
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
        roleTitle="Super Admin"
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
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full System Authority</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center">
                {user?.name?.charAt(0) || 'A'}
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
