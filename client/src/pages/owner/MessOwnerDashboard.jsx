import React, { useState } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Sparkles,
  Package,
  Users,
  DollarSign,
  MessageSquare,
  Menu,
  ChefHat,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

// Subviews
import OwnerOverviewTab from './OwnerOverviewTab';
import KitchenPlanningTab from './KitchenPlanningTab';
import SharedSavingsManagementTab from './SharedSavingsManagementTab';
import InventoryManagementTab from './InventoryManagementTab';
import StudentManagementTab from './StudentManagementTab';
import FinancialReportsTab from './FinancialReportsTab';
import OwnerComplaintsTab from './OwnerComplaintsTab';

export default function MessOwnerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'kitchen', label: 'Kitchen & Meal Planning', icon: UtensilsCrossed },
    { id: 'savings', label: 'Shared Savings Mgmt', icon: Sparkles },
    { id: 'inventory', label: 'Inventory & Stock', icon: Package },
    { id: 'students', label: 'Students & Memberships', icon: Users },
    { id: 'financials', label: 'Financials & P&L', icon: DollarSign },
    { id: 'complaints', label: 'Student Complaints', icon: MessageSquare },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OwnerOverviewTab onNavigateTab={setActiveTab} />;
      case 'kitchen':
        return <KitchenPlanningTab />;
      case 'savings':
        return <SharedSavingsManagementTab />;
      case 'inventory':
        return <InventoryManagementTab />;
      case 'students':
        return <StudentManagementTab />;
      case 'financials':
        return <FinancialReportsTab />;
      case 'complaints':
        return <OwnerComplaintsTab />;
      default:
        return <OwnerOverviewTab onNavigateTab={setActiveTab} />;
    }
  };

  const getTabTitle = () => {
    const item = navItems.find((i) => i.id === activeTab);
    return item ? item.label : 'Mess Owner Portal';
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
        roleTitle="Mess Owner Portal"
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
              <ChefHat className="w-3.5 h-3.5 text-emerald-600" />
              <span>Annapurna Royal Smart Mess</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center">
                {user?.name?.charAt(0) || 'M'}
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
