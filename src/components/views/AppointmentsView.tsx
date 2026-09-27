import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Download,
  Printer,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  CalendarDays,
  Filter,
} from 'lucide-react';
import { Appointment } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { EmptyState } from '../ui/EmptyState';
import { PatientAvatar } from '../patients/PatientAvatar';
import { formatDate, getStatusColor } from '../../lib/utils';

interface AppointmentsViewProps {
  appointments: Appointment[];
  onOpenNewAppointment: () => void;
  onUpdateStatus: (id: number, status: Appointment['status']) => void;
  onDeleteAppointment: (id: number) => void;
  onPrintSlip: (apt: Appointment) => void;
  onViewPatientById: (patientId: number) => void;
  notify: (msg: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const DOCTORS_LIST = [
  'All Doctors',
  'Dr. Mehta',
  'Dr. Sharma',
  'Dr. Kulkarni',
  'Dr. Joshi',
];

const STATUSES = ['All', 'Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-Show'];

export function AppointmentsView({
  appointments,
  onOpenNewAppointment,
  onUpdateStatus,
  onDeleteAppointment,
  onPrintSlip,
  onViewPatientById,
  notify,
}: AppointmentsViewProps) {
  const today = new Date().toISOString().split('T')[0];

  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('All Doctors');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
      const matchesDate = !dateFilter || apt.appointment_date === dateFilter;
      const matchesDoctor = doctorFilter === 'All Doctors' || apt.doctor_name.includes(doctorFilter);
      const matchesSearch =
        apt.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctor_name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesDate && matchesDoctor && matchesSearch;
    });
  }, [appointments, statusFilter, dateFilter, doctorFilter, searchTerm]);

  const handleExportCSV = () => {
    if (filteredAppointments.length === 0) {
      notify('No appointments matching current filters', 'warning');
      return;
    }

    const headers = [
      'Appointment ID',
      'Patient Name',
      'Doctor',
      'Date',
      'Time',
      'Reason',
      'Status',
      'Follow Up Flag',
      'Notes',
    ];

    const rows = filteredAppointments.map((a) => [
      a.id,
      `"${(a.patient_name || '').replace(/"/g, '""')}"`,
      `"${a.doctor_name.replace(/"/g, '""')}"`,
      a.appointment_date,
      a.appointment_time,
      `"${a.reason.replace(/"/g, '""')}"`,
      a.status,
      a.follow_up_required ? 'Yes' : 'No',
      `"${(a.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `clinicos_appointments_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('Appointments exported successfully', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Consultations & OPD Schedule
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {appointments.length} total scheduled consultations recorded
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="flex-1 sm:flex-initial">
            <Download className="w-4 h-4 mr-1.5" />
            Export Schedule
          </Button>
          <Button variant="primary" size="sm" onClick={onOpenNewAppointment} className="flex-1 sm:flex-initial">
            <Plus className="w-4 h-4 mr-1.5" />
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Filter Matrix Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input
            placeholder="Search patient, complaint, doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            label="Doctor"
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            options={DOCTORS_LIST.map((d) => ({ label: d, value: d }))}
          />

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Date Filter
              </label>
              <button
                type="button"
                onClick={() => setDateFilter(today)}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Today
              </button>
            </div>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Reset Filters
              </label>
            </div>
            <Button
              variant="outline"
              size="md"
              className="w-full text-xs"
              onClick={() => {
                setStatusFilter('All');
                setDateFilter('');
                setDoctorFilter('All Doctors');
                setSearchTerm('');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </div>

        {/* Status Pill Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Status:
          </span>
          {STATUSES.map((st) => {
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No appointments match current filters"
          description="Try clearing your date or doctor filters, or schedule a new consultation slot."
          actionLabel="Book New Appointment"
          onAction={onOpenNewAppointment}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Date & Slot</TableHead>
              <TableHead>Consulting Doctor</TableHead>
              <TableHead>Clinical Reason</TableHead>
              <TableHead>Status (Inline)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((apt) => (
              <TableRow key={apt.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <PatientAvatar
                      name={apt.patient_name || 'Unknown'}
                      bloodGroup={apt.patient_blood_group}
                      size="sm"
                    />
                    <div>
                      <button
                        onClick={() => onViewPatientById(apt.patient_id)}
                        className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 text-left transition-colors"
                      >
                        {apt.patient_name}
                      </button>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                        <span>{apt.patient_phone}</span>
                        {apt.follow_up_required === 1 && (
                          <span className="text-amber-500 font-bold" title="Follow-up due">
                            • Follow-up
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {formatDate(apt.appointment_date)}
                    </div>
                    <div className="text-xs font-mono font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {apt.appointment_time} hrs
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                    {apt.doctor_name}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="max-w-[220px]">
                    <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2">
                      {apt.reason}
                    </p>
                    {apt.notes && (
                      <p className="text-[11px] text-slate-400 italic line-clamp-1 mt-0.5">
                        {apt.notes}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {/* Inline Status Dropdown */}
                  <select
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                      apt.status
                    )}`}
                    value={apt.status}
                    onChange={(e) => onUpdateStatus(apt.id, e.target.value as any)}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="No-Show">No-Show</option>
                  </select>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPrintSlip(apt)}
                      className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                      title="Print OPD Consultation Slip"
                    >
                      <Printer className="w-4 h-4" />
                    </Button>

                    {apt.status === 'Scheduled' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateStatus(apt.id, 'Confirmed')}
                        className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                        title="Mark Confirmed"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}

                    {(apt.status === 'Scheduled' || apt.status === 'Confirmed') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateStatus(apt.id, 'Cancelled')}
                        className="h-8 w-8 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Cancel Appointment"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm('Delete this appointment record?')) {
                          onDeleteAppointment(apt.id);
                        }
                      }}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
