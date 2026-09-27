import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Ambulance,
  Droplet,
  Building2,
  AlertTriangle,
  RotateCcw,
  X,
  HeartPulse,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export type TabType =
  | 'dashboard'
  | 'patients'
  | 'appointments'
  | 'ambulance'
  | 'blood-bank'
  | 'hospitals'
  | 'emergency';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  emergencyCount: number;
  ambulancePendingCount: number;
  onResetDemo: () => void;
}

export function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  emergencyCount,
  ambulancePendingCount,
  onResetDemo,
}: SidebarProps) {
  const navItems: {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: CalendarDays },
    {
      id: 'ambulance',
      label: 'Ambulance',
      icon: Ambulance,
      badge: ambulancePendingCount > 0 ? ambulancePendingCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    { id: 'blood-bank', label: 'Blood Bank', icon: Droplet },
    { id: 'hospitals', label: 'Hospitals', icon: Building2 },
    {
      id: 'emergency',
      label: 'Emergency',
      icon: AlertTriangle,
      badge: emergencyCount > 0 ? emergencyCount : undefined,
      badgeColor: 'bg-rose-500 text-white animate-pulse',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                ClinicOS
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  PRO
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Healthcare Management
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Core Modules
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group cursor-pointer text-left',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 transition-transform group-hover:scale-110 flex-shrink-0',
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={cn(
                      'text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-wider',
                      item.badgeColor || 'bg-blue-500 text-white'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Reset & Hackathon Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/30">
          <button
            onClick={() => {
              if (confirm('Reset database to default seed data? (Useful for live presentations)')) {
                onResetDemo();
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors cursor-pointer"
            title="Reset data to pristine hackathon demo baseline"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
            Reset Demo Data
          </button>

          <div className="text-center space-y-0.5">
            <p className="text-[11px] font-semibold text-slate-300">
              FIT-FEST 2026 Hackathon
            </p>
            <p className="text-[10px] text-slate-400">
              Flora Institute of Technology, Pune
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
