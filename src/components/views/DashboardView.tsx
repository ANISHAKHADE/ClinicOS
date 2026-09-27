import React, { useState } from 'react';
import {
  Users,
  Calendar,
  AlertTriangle,
  Droplet,
  Ambulance,
  CheckCircle2,
  Building2,
  HeartPulse,
  Plus,
  Clock,
  ArrowRight,
  Printer,
  CalendarPlus,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { StatCard } from '../ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { PatientAvatar } from '../patients/PatientAvatar';
import { DashboardStats, Appointment, EmergencyRequest } from '../../types';
import { TabType } from '../layout/Sidebar';
import { formatDate, getStatusColor, timeAgo } from '../../lib/utils';

interface DashboardViewProps {
  stats: DashboardStats;
  onNavigate: (tab: TabType) => void;
  onOpenNewPatient: () => void;
  onOpenNewAppointment: () => void;
  onPrintSlip: (apt: Appointment) => void;
  onUpdateAppointmentStatus: (id: number, status: Appointment['status']) => void;
}

export function DashboardView({
  stats,
  onNavigate,
  onOpenNewPatient,
  onOpenNewAppointment,
  onPrintSlip,
  onUpdateAppointmentStatus,
}: DashboardViewProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  // Weekly data calculations
  const weeklyData = [
    { day: 'Mon', count: Math.max(3, Math.round(stats.completedThisWeek * 0.18)), label: 'Monday' },
    { day: 'Tue', count: Math.max(5, Math.round(stats.completedThisWeek * 0.24)), label: 'Tuesday' },
    { day: 'Wed', count: Math.max(4, Math.round(stats.completedThisWeek * 0.19)), label: 'Wednesday' },
    { day: 'Thu', count: Math.max(6, Math.round(stats.completedThisWeek * 0.22)), label: 'Thursday' },
    { day: 'Fri', count: Math.max(7, Math.round(stats.completedThisWeek * 0.17)), label: 'Friday' },
    { day: 'Sat', count: Math.max(2, Math.round(stats.completedThisWeek * 0.12)), label: 'Saturday' },
    { day: 'Sun', count: 1, label: 'Sunday (Emergency Only)' },
  ];

  const maxWeeklyCount = Math.max(...weeklyData.map((d) => d.count), 10);

  return (
    <div className="space-y-6">
      {/* Top Banner if Active Critical Emergencies */}
      {stats.activeEmergencies > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white shadow-lg shadow-rose-600/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs flex-shrink-0 animate-pulse">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                URGENT TRIAGE ALERT: {stats.activeEmergencies} Unresolved Critical Cases
              </h3>
              <p className="text-xs text-rose-100 mt-0.5">
                Immediate clinical review and ambulance transit required.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => onNavigate('emergency')}
            className="bg-white text-rose-700 hover:bg-rose-50 font-bold border-0 shadow-md"
          >
            Open Emergency Console
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      )}

      {/* Row 1: Key Operational Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Patients"
          value={stats.totalPatients}
          icon={Users}
          colorClass="bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300"
          subtitle="Active medical records"
          trend={{ value: 12, isPositive: true }}
          onClick={() => onNavigate('patients')}
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={Calendar}
          colorClass="bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300"
          subtitle="Scheduled OPD consultations"
          onClick={() => onNavigate('appointments')}
        />
        <StatCard
          title="Active Emergencies"
          value={stats.activeEmergencies}
          icon={AlertTriangle}
          colorClass={
            stats.activeEmergencies > 0
              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 animate-pulse'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }
          subtitle="Triage & medical dispatch"
          onClick={() => onNavigate('emergency')}
        />
        <StatCard
          title="Open Blood Demands"
          value={stats.openBloodRequirements}
          icon={Droplet}
          colorClass="bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300"
          subtitle="Hospital urgent requests"
          onClick={() => onNavigate('blood-bank')}
        />
      </div>

      {/* Row 2: Secondary Facility & Flow Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Ambulance"
          value={stats.pendingAmbulance}
          icon={Ambulance}
          colorClass="bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300"
          subtitle="In transit / dispatched"
          onClick={() => onNavigate('ambulance')}
        />
        <StatCard
          title="Completed This Week"
          value={stats.completedThisWeek}
          icon={CheckCircle2}
          colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300"
          subtitle="Discharged / consulted"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Blood Banks Active"
          value={stats.totalBloodBanks}
          icon={HeartPulse}
          colorClass="bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300"
          subtitle="Pune network directory"
          onClick={() => onNavigate('blood-bank')}
        />
        <StatCard
          title="Hospitals In Network"
          value={stats.totalHospitals}
          icon={Building2}
          colorClass="bg-teal-100 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300"
          subtitle="Govt & private referral nodes"
          onClick={() => onNavigate('hospitals')}
        />
      </div>

      {/* Main Grid: Chart & Today's Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Appointments Trend + Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Appointments list */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Today's Scheduled Consultations
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live OPD queue for doctor chambers
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={onOpenNewAppointment}>
                  <Plus className="w-4 h-4 mr-1" /> Book Slot
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onNavigate('appointments')}>
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {stats.upcomingAppointments.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="No consultations pending today"
                  description="All scheduled patients have been seen or no slots booked yet."
                  actionLabel="Schedule Appointment"
                  onAction={onOpenNewAppointment}
                />
              ) : (
                <div className="space-y-3">
                  {stats.upcomingAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <PatientAvatar
                          name={apt.patient_name || 'Unknown'}
                          bloodGroup={apt.patient_blood_group}
                          size="md"
                        />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                              {apt.patient_name}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(
                                apt.status
                              )}`}
                            >
                              {apt.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {apt.doctor_name} • <span className="text-slate-700 dark:text-slate-300">{apt.reason}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <div className="text-right mr-1">
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1 font-mono">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            {apt.appointment_time}
                          </div>
                          <span className="text-[10px] text-slate-400">Today</span>
                        </div>

                        {apt.status === 'Scheduled' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUpdateAppointmentStatus(apt.id, 'Confirmed')}
                            className="h-8 text-xs text-emerald-600 hover:text-emerald-700 border-emerald-300"
                          >
                            Confirm
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onPrintSlip(apt)}
                          className="h-8 w-8 p-0"
                          title="Print Consultation Slip"
                        >
                          <Printer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interactive Weekly Patient Flow Trend Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Weekly Patient Attendance Flow
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Consultation volumes across active weekdays
                </p>
              </div>
              <Badge variant="info">Live Aggregate</Badge>
            </CardHeader>
            <CardContent>
              <div className="pt-4 space-y-4">
                <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-6 pb-2 border-b border-slate-200 dark:border-slate-800">
                  {weeklyData.map((item, idx) => {
                    const heightPercent = Math.max(15, Math.round((item.count / maxWeeklyCount) * 100));
                    const isSelected = selectedDayIndex === idx;

                    return (
                      <div
                        key={item.day}
                        onClick={() => setSelectedDayIndex(isSelected ? null : idx)}
                        className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end"
                      >
                        <div className="relative w-full flex flex-col items-center">
                          {/* Floating tooltip */}
                          <div
                            className={`absolute -top-8 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-bold transition-all pointer-events-none ${
                              isSelected
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
                            }`}
                          >
                            {item.count} pts
                          </div>

                          {/* Bar with gradient */}
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 ${
                              isSelected
                                ? 'bg-gradient-to-t from-indigo-600 to-blue-500 shadow-md shadow-indigo-500/30'
                                : 'bg-gradient-to-t from-blue-600 to-indigo-400 group-hover:from-blue-500 group-hover:to-indigo-300'
                            }`}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                  <span>Weekly total: ~{weeklyData.reduce((acc, d) => acc + d.count, 0)} consultations</span>
                  <span>Peak Day: Friday & Thursday</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column: Quick Actions + Active Emergencies */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Direct Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onOpenNewPatient}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer text-center"
                >
                  <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Add Patient
                  </span>
                </button>

                <button
                  onClick={onOpenNewAppointment}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer text-center"
                >
                  <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <CalendarPlus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Book Slot
                  </span>
                </button>

                <button
                  onClick={() => onNavigate('ambulance')}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-400 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer text-center"
                >
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400 group-hover:scale-110 transition-transform">
                    <Ambulance className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Dispatch Unit
                  </span>
                </button>

                <button
                  onClick={() => onNavigate('blood-bank')}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-400 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer text-center"
                >
                  <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400 group-hover:scale-110 transition-transform">
                    <Droplet className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Blood Request
                  </span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Active Emergencies Feed */}
          <Card className={stats.activeEmergencies > 0 ? 'border-rose-200 dark:border-rose-900/60' : ''}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                Active Emergencies ({stats.recentEmergencies.length})
              </CardTitle>
              <button
                onClick={() => onNavigate('emergency')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                All
              </button>
            </CardHeader>
            <CardContent>
              {stats.recentEmergencies.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  All clear! No active critical emergency requests.
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recentEmergencies.map((em) => (
                    <div
                      key={em.id}
                      onClick={() => onNavigate('emergency')}
                      className={`p-3 rounded-xl border cursor-pointer hover:shadow-sm transition-all ${
                        em.priority === 'Critical'
                          ? 'bg-rose-50/70 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/60'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusColor(
                            em.priority
                          )}`}
                        >
                          {em.priority}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo(em.created_at)}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                        {em.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 truncate max-w-[180px]">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          {em.location}
                        </span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {em.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
