import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Plus,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  Phone,
  ShieldAlert,
  Send,
  Filter,
} from 'lucide-react';
import { EmergencyRequest } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { EmptyState } from '../ui/EmptyState';
import { timeAgo, getStatusColor } from '../../lib/utils';

interface EmergencyViewProps {
  emergencies: EmergencyRequest[];
  onAddEmergency: (req: Omit<EmergencyRequest, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateStatus: (id: number, status: EmergencyRequest['status'], resolutionNotes?: string) => void;
  onUpdateAssignee: (id: number, assignedTo: string) => void;
  notify: (msg: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export function EmergencyView({
  emergencies,
  onAddEmergency,
  onUpdateStatus,
  onUpdateAssignee,
  notify,
}: EmergencyViewProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Resolved'>('Active');
  const [typeFilter, setTypeFilter] = useState('All');

  const [formData, setFormData] = useState({
    type: 'Medical' as EmergencyRequest['type'],
    priority: 'Critical' as EmergencyRequest['priority'],
    patient_name: '',
    patient_phone: '',
    description: '',
    location: '',
    assigned_to: 'Emergency Medical Officer on Duty',
  });

  const [submitting, setSubmitting] = useState(false);

  // Check if critical items exist
  const hasCritical = emergencies.some(
    (e) => e.priority === 'Critical' && (e.status === 'Open' || e.status === 'In-Progress')
  );

  const filteredEmergencies = useMemo(() => {
    return emergencies.filter((e) => {
      const matchesStatus =
        statusFilter === 'All'
          ? true
          : statusFilter === 'Active'
          ? e.status === 'Open' || e.status === 'In-Progress'
          : e.status === 'Resolved' || e.status === 'Closed';

      const matchesType = typeFilter === 'All' || e.type === typeFilter;

      return matchesStatus && matchesType;
    });
  }, [emergencies, statusFilter, typeFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.location.trim()) {
      notify('Please provide emergency description and exact location', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      onAddEmergency({
        type: formData.type,
        priority: formData.priority,
        patient_name: formData.patient_name.trim() || undefined,
        patient_phone: formData.patient_phone.trim() || undefined,
        description: formData.description.trim(),
        location: formData.location.trim(),
        status: 'Open',
        assigned_to: formData.assigned_to.trim() || undefined,
      });

      notify('Emergency case logged and dispatched to triage console!', 'success');
      setFormData({
        type: 'Medical',
        priority: 'Critical',
        patient_name: '',
        patient_phone: '',
        description: '',
        location: '',
        assigned_to: 'Emergency Medical Officer on Duty',
      });
      setIsFormOpen(false);
    } catch {
      notify('Failed to log emergency', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Critical Alert Warning Header */}
      {hasCritical && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-600 text-white shadow-xl shadow-rose-600/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-xs flex-shrink-0">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                ACTIVE CRITICAL EMERGENCIES IN QUEUE
              </h2>
              <p className="text-xs text-rose-100 mt-0.5">
                Immediate clinical triage, crash cart readiness, and attending physician assignment required.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-white text-rose-700 text-xs font-black uppercase tracking-wider self-end sm:self-center">
            Priority Tier 1
          </span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-7 h-7 text-rose-600" />
            Emergency Operations & Central Triage
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Rapid response coordination for life-threatening medical events and mass casualties
          </p>
        </div>
        <Button
          variant={isFormOpen ? 'secondary' : 'danger'}
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? 'Close Emergency Form' : '+ Log Emergency Event'}
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Show:
          </span>
          {(['Active', 'Resolved', 'All'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {st} Cases
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Type:</span>
          <select
            className="text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-slate-800 dark:text-slate-200"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Emergency Types</option>
            <option value="Medical">Medical</option>
            <option value="Ambulance">Ambulance</option>
            <option value="Blood">Blood Demand</option>
            <option value="General">General / Trauma</option>
          </select>
        </div>
      </div>

      {/* Log Emergency Form Modal / Drawer */}
      {isFormOpen && (
        <Card className="border-rose-400 dark:border-rose-800 shadow-lg animate-in slide-in-from-top-4 fade-in duration-200">
          <CardHeader className="bg-rose-50/80 dark:bg-rose-950/40 border-b border-rose-100 dark:border-rose-900/60 pb-3">
            <CardTitle className="text-base font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              Direct Emergency Incident Intake
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Emergency Category *"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  options={[
                    { label: 'Medical (Cardiac/Stroke/Seizure)', value: 'Medical' },
                    { label: 'Ambulance (Crash/Transit)', value: 'Ambulance' },
                    { label: 'Blood (Severe Hemorrhage)', value: 'Blood' },
                    { label: 'General / Trauma', value: 'General' },
                  ]}
                />
                <Select
                  label="Priority Classification *"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  options={[
                    { label: 'CRITICAL (Immediate Life Threat)', value: 'Critical' },
                    { label: 'HIGH (Urgent < 15 mins)', value: 'High' },
                    { label: 'MEDIUM (Acute < 1 hr)', value: 'Medium' },
                    { label: 'LOW (Standard Non-Urgent)', value: 'Low' },
                  ]}
                />
                <Input
                  label="Incident Location / Ward *"
                  placeholder="e.g. Baner Highway km 14 / ICU Bed 4"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Patient Name (If Identified)"
                  placeholder="e.g. Sunil Rao"
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                />
                <Input
                  label="Emergency Phone"
                  placeholder="e.g. 9822446688"
                  type="tel"
                  value={formData.patient_phone}
                  onChange={(e) => setFormData({ ...formData, patient_phone: e.target.value })}
                />
                <Input
                  label="Assigned Lead Physician / Unit"
                  placeholder="e.g. Dr. Kulkarni & Crash Team Alpha"
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                  Incident Description & Clinical Presentation *
                </label>
                <textarea
                  className="w-full h-20 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="e.g. Sudden collapse with cyanosis, CPR initiated by bystander, AED shock delivered"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="danger" isLoading={submitting}>
                  <Send className="w-4 h-4 mr-1.5" />
                  Log Emergency & Alert Medical Team
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Emergencies Queue Table */}
      {filteredEmergencies.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No emergency records in current view"
          description="All critical events have been stabilized or filtered out."
          actionLabel="Log New Emergency"
          onAction={() => setIsFormOpen(true)}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Priority & Type</TableHead>
              <TableHead>Clinical Description</TableHead>
              <TableHead>Location & Time</TableHead>
              <TableHead>Assigned Staff</TableHead>
              <TableHead>Status Tracker</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmergencies.map((em) => (
              <TableRow
                key={em.id}
                className={
                  em.priority === 'Critical' && em.status !== 'Resolved' && em.status !== 'Closed'
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-l-4 border-l-rose-600'
                    : ''
                }
              >
                <TableCell>
                  <div className="space-y-1.5 flex flex-col items-start">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${getStatusColor(
                        em.priority
                      )}`}
                    >
                      {em.priority}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {em.type}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 max-w-[280px]">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {em.description}
                    </p>
                    {(em.patient_name || em.patient_phone) && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {em.patient_name || 'Patient'}
                        </span>
                        {em.patient_phone && (
                          <span className="font-mono">({em.patient_phone})</span>
                        )}
                      </div>
                    )}
                    {em.resolution_notes && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 italic">
                        Resolution: {em.resolution_notes}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 max-w-[200px]">
                    <div className="flex items-start gap-1 text-xs font-semibold text-slate-900 dark:text-slate-100">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                      <span>{em.location}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 ml-4">
                      <Clock className="w-3 h-3" />
                      {timeAgo(em.created_at)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <input
                    type="text"
                    defaultValue={em.assigned_to || ''}
                    placeholder="Assign lead staff..."
                    onBlur={(e) => {
                      if (e.target.value !== em.assigned_to) {
                        onUpdateAssignee(em.id, e.target.value.trim());
                      }
                    }}
                    className="text-xs font-medium px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-36"
                  />
                </TableCell>
                <TableCell>
                  <select
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500 ${getStatusColor(
                      em.status
                    )}`}
                    value={em.status}
                    onChange={(e) => onUpdateStatus(em.id, e.target.value as any)}
                  >
                    <option value="Open">Open</option>
                    <option value="In-Progress">In-Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </TableCell>
                <TableCell className="text-right">
                  {em.status !== 'Resolved' && em.status !== 'Closed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const notes = prompt('Enter brief clinical resolution outcome:');
                        onUpdateStatus(em.id, 'Resolved', notes || 'Stabilized & Admitted');
                      }}
                      className="text-xs text-emerald-600 border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/40"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Resolve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
