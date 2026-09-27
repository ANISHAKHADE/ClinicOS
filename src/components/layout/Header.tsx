import React, { useState, useEffect } from 'react';
import { Menu, Moon, Sun, Bell, AlertTriangle, Calendar, X } from 'lucide-react';
import { TabType } from './Sidebar';
import { DashboardStats } from '../../types';

interface HeaderProps {
  activeTab: TabType;
  setSidebarOpen: (open: boolean) => void;
  stats: DashboardStats;
  onNavigate: (tab: TabType) => void;
}

export function Header({ activeTab, setSidebarOpen, stats, onNavigate }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const isDarkMode =
      document.documentElement.classList.contains('dark') ||
      localStorage.getItem('clinicos_theme') === 'dark';
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('clinicos_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('clinicos_theme', 'light');
    }
  };

  const pageTitles: Record<TabType, { title: string; subtitle: string }> = {
    dashboard: { title: 'Clinic Dashboard', subtitle: 'Live overview of clinical and emergency operations' },
    patients: { title: 'Patient Registry', subtitle: 'Demographics, medical history & consultation records' },
    appointments: { title: 'Appointments Schedule', subtitle: 'Doctor consultation slots, bookings & OPD slips' },
    ambulance: { title: 'Ambulance Dispatch', subtitle: 'Emergency transit requests & real-time tracking' },
    'blood-bank': { title: 'Blood Bank Directory', subtitle: 'Inventory networks, hospital stocks & active requests' },
    hospitals: { title: 'Hospital Network', subtitle: 'Nearby government & private healthcare facilities' },
    emergency: { title: 'Emergency Operations', subtitle: 'Central dispatch & critical medical alert response' },
  };

  const currentMeta = pageTitles[activeTab] || { title: 'ClinicOS', subtitle: 'Management System' };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 transition-colors">
      {/* Left: Mobile hamburger & Page Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
            {currentMeta.title}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Clock */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{currentTime}</span>
        </div>

        {/* Emergency quick alert badge */}
        {stats.activeEmergencies > 0 && (
          <button
            onClick={() => onNavigate('emergency')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-bold animate-pulse hover:bg-rose-200 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{stats.activeEmergencies} Alert{stats.activeEmergencies > 1 ? 's' : ''}</span>
          </button>
        )}

        {/* Dark Mode Switch */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Toggle dark mode"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {(stats.activeEmergencies > 0 || stats.todayAppointments > 0) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Clinical Activity Feed
                  </h4>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {stats.activeEmergencies > 0 && (
                    <div
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigate('emergency');
                      }}
                      className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 cursor-pointer hover:bg-rose-100 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-xs">
                        <AlertTriangle className="w-4 h-4" />
                        {stats.activeEmergencies} Unresolved Emergencies
                      </div>
                      <p className="text-xs text-rose-800 dark:text-rose-200 mt-1">
                        Critical triage triage cases require immediate doctor review.
                      </p>
                    </div>
                  )}

                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('appointments');
                    }}
                    className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-xs">
                      <Calendar className="w-4 h-4" />
                      {stats.todayAppointments} Appointments Scheduled Today
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      Check OPD room availability and doctor consultation timing.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400">
                    System operating normal. Database sync active.
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
