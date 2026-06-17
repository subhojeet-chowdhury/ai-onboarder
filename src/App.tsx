import React from 'react';
import { AppProvider, useAppContext } from './AppContext';
import { DemoController } from './components/DemoController';
import { ActivityLog } from './components/ActivityLog';
import { AmelieTab } from './components/AmelieTab';
import { StefanTab } from './components/StefanTab';
import { HiringTeamTab } from './components/HiringTeamTab';
import { WorksCouncilTab } from './components/WorksCouncilTab';
import { ManagerTab } from './components/ManagerTab';
import { AdminTab } from './components/AdminTab';
import { Smartphone, LayoutDashboard, FileSignature, LogOut, CheckCircle2 } from 'lucide-react';

const TABS = [
  { id: 'amelie', label: 'Amélie Laurent (FR)', icon: <Smartphone size={16}/> },
  { id: 'stefan', label: 'Stefan Meier (DE)', icon: <Smartphone size={16}/> },
  { id: 'hiring', label: 'Hiring Team', icon: <LayoutDashboard size={16}/> },
  { id: 'council', label: 'Works Council', icon: <FileSignature size={16}/> },
  { id: 'manager', label: 'Manager (Dupont)', icon: <CheckCircle2 size={16}/> },
  { id: 'admin', label: 'Admin Workspace', icon: <LayoutDashboard size={16}/> },
];

function AppContent() {
  const { state, dispatch } = useAppContext();

  return (
    <div className="min-h-screen bg-[#F5F5F3] flex flex-col font-sans text-gray-900">
      <DemoController />
      
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-[52px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
           {TABS.map(tab => (
             <button
               key={tab.id}
               onClick={() => dispatch({ type: 'SET_TAB', payload: tab.id })}
               className={`flex items-center gap-2 px-5 py-4 font-medium text-sm transition-colors border-b-2 whitespace-nowrap
                 ${state.activeTab === tab.id 
                    ? 'border-[#C74634] text-[#C74634] bg-red-50/30' 
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                 }
               `}
             >
               {tab.icon}
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto">
          {state.activeTab === 'amelie' && <AmelieTab />}
          {state.activeTab === 'stefan' && <StefanTab />}
          {state.activeTab === 'hiring' && <HiringTeamTab />}
          {state.activeTab === 'council' && <WorksCouncilTab />}
          {state.activeTab === 'manager' && <ManagerTab />}
          {state.activeTab === 'admin' && <AdminTab />}
        </div>
        
        {/* Only show Activity log over enterprise views to avoid cluttering mobile views */}
        {['hiring', 'council', 'manager', 'admin'].includes(state.activeTab) && (
          <ActivityLog />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
