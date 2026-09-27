import React, { useState } from 'react';
import {
  Ambulance,
  Phone,
  MapPin,
  Clock,
  Plus,
  Share2,
  ShieldAlert,
  Send,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { AmbulanceRequest } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { EmptyState } from '../ui/EmptyState';
import { timeAgo, getStatusColor } from '../../lib/utils';
import { ClinicStore } from '../../lib/storage';

interface AmbulanceViewProps {
  requests: AmbulanceRequest[];
  onAddRequest: (req: Omit<AmbulanceRequest, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateStatus: (id: number, status: AmbulanceRequest['status'], assignedUnit?: string) => void;
  notify: (msg: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export function AmbulanceView({
  requests,
  onAddRequest,
  onUpdateStatus,
  notify,
}: AmbulanceViewProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    requester_name: '',
    requester_phone: '',
    patient_name: '',
    pickup_location: '',
    destination: 'Ruby Hall Clinic, Sassoon Road',
    urgency_level: 'High' as AmbulanceRequest['urgency_level'],
    notes: '',
    assigned_unit: 'Unit-01 (ALS)',
  });

  const [submitting, setSubmitting] = useState(false);

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'Pending').length,
    active: requests.filter((r) => r.status === 'Dispatched' || r.status === 'En-Route').length,
    completed: requests.filter((r) => r.status === 'Completed').length,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.requester_name.trim() || !formData.requester_phone.trim() || !formData.pickup_location.trim()) {
      notify('Please enter requester name, phone, and pickup location', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      onAddRequest({
        requester_name: formData.requester_name.trim(),
        requester_phone: formData.requester_phone.trim(),
        patient_name: formData.patient_name.trim() || undefined,
        pickup_location: formData.pickup_location.trim(),
        destination: formData.destination.trim() || undefined,
        urgency_level: formData.urgency_level,
        status: 'Dispatched',
        assigned_unit: formData.assigned_unit,
        notes: formData.notes.trim() || undefined,
      });

      notify('Ambulance emergency dispatch order recorded!', 'success');
      setFormData({
        requester_name: '',
        requester_phone: '',
        patient_name: '',
        pickup_location: '',
        destination: 'Ruby Hall Clinic, Sassoon Road',
        urgency_level: 'High',
        notes: '',
        assigned_unit: 'Unit-03 (ALS)',
      });
      setIsFormOpen(false);
    } catch {
      notify('Failed to dispatch ambulance', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const shareViaWhatsApp = (req: AmbulanceRequest) => {
    const text = `🚨 *CLINICOS AMBULANCE EMERGENCY DISPATCH*\n\n*Urgency:* ${req.urgency_level.toUpperCase()}\n*Patient:* ${
      req.patient_name || req.requester_name
    }\n*Pickup Address:* ${req.pickup_location}\n*Destination Hospital:* ${
      req.destination || 'Nearest Emergency Center'
    }\n*Contact:* ${req.requester_phone} (${req.requester_name})\n*Assigned Unit:* ${
      req.assigned_unit || 'Pending Allocation'
    }\n*Status:* ${req.status}\n*Dispatch Time:* ${new Date(req.created_at).toLocaleTimeString()}`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    notify('WhatsApp alert template prepared', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Ambulance className="w-7 h-7 text-amber-500" />
            Ambulance Rapid Transit Dispatch
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time ambulance fleet coordination and hospital transit routing
          </p>
        </div>
        <Button
          variant={isFormOpen ? 'secondary' : 'danger'}
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? 'Close Dispatch Form' : '+ New Emergency Dispatch'}
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Requests</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              {stats.total}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending Unit</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
              {stats.pending}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">En-Route / Dispatched</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-1">
              {stats.active}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Completed Safe Transit</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
              {stats.completed}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dispatch Form Card */}
      {isFormOpen && (
        <Card className="border-rose-300 dark:border-rose-900 shadow-md animate-in slide-in-from-top-4 fade-in duration-200">
          <CardHeader className="bg-rose-50/70 dark:bg-rose-950/30 border-b border-rose-100 dark:border-rose-900/50 pb-3">
            <CardTitle className="text-base font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              Emergency Ambulance Dispatch Voucher
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="Requester Name *"
                  placeholder="e.g. Inspector Deshpande / Relative"
                  value={formData.requester_name}
                  onChange={(e) => setFormData({ ...formData, requester_name: e.target.value })}
                  required
                />
                <Input
                  label="Requester Phone *"
                  placeholder="e.g. 9822011223"
                  type="tel"
                  value={formData.requester_phone}
                  onChange={(e) => setFormData({ ...formData, requester_phone: e.target.value })}
                  required
                />
                <Input
                  label="Patient Name (If Known)"
                  placeholder="e.g. Manoj Jadhav"
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Triage Urgency Level *"
                  value={formData.urgency_level}
                  onChange={(e) => setFormData({ ...formData, urgency_level: e.target.value as any })}
                  options={[
                    { label: 'Critical (Cardiac / Trauma / Arrest)', value: 'Critical' },
                    { label: 'High (Fracture / Breathlessness)', value: 'High' },
                    { label: 'Medium (Inter-hospital transfer)', value: 'Medium' },
                    { label: 'Low (Scheduled routine transfer)', value: 'Low' },
                  ]}
                />
                <Select
                  label="Assign Ambulance Unit"
                  value={formData.assigned_unit}
                  onChange={(e) => setFormData({ ...formData, assigned_unit: e.target.value })}
                  options={[
                    { label: 'Unit-01 (Advanced Life Support - ALS)', value: 'Unit-01 (ALS)' },
                    { label: 'Unit-02 (Basic Life Support - BLS)', value: 'Unit-02 (BLS)' },
                    { label: 'Unit-04 (Advanced Cardiac Mobile ICU)', value: 'Unit-04 (Cardiac ICU)' },
                    { label: 'Unit-09 (Neonatal / Pediatric Transit)', value: 'Unit-09 (Neonatal)' },
                  ]}
                />
                <Input
                  label="Destination Hospital"
                  placeholder="e.g. Ruby Hall Clinic Pune"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                />
              </div>

              <Input
                label="Pickup Address / Landmark *"
                placeholder="Exact building, road, cross street or GPS landmark in Pune"
                value={formData.pickup_location}
                onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                required
              />

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Paramedic & Transit Clinical Notes
                </label>
                <textarea
                  className="w-full h-16 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="e.g. Oxygen cylinder active, patient unconscious, internal bleeding suspected"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="danger" isLoading={submitting}>
                  <Send className="w-4 h-4 mr-1.5" />
                  Dispatch Unit Now
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Ambulance Dispatch Orders Table */}
      {requests.length === 0 ? (
        <EmptyState
          icon={Ambulance}
          title="No active ambulance dispatch logs"
          description="Fleet is currently on standby. Create a new dispatch request when an emergency call is received."
          actionLabel="Request Ambulance"
          onAction={() => setIsFormOpen(true)}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time / Unit</TableHead>
              <TableHead>Pickup & Destination</TableHead>
              <TableHead>Requester / Patient</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Status Tracker</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow
                key={req.id}
                className={
                  req.urgency_level === 'Critical' && req.status !== 'Completed'
                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-l-4 border-l-rose-600'
                    : ''
                }
              >
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {timeAgo(req.created_at)}
                    </div>
                    <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                      {req.assigned_unit || 'Unit Unassigned'}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 max-w-[240px]">
                    <div className="flex items-start gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                      <span>{req.pickup_location}</span>
                    </div>
                    {req.destination && (
                      <p className="text-[11px] text-slate-500 ml-5 truncate">
                        → {req.destination}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5 text-xs">
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      {req.patient_name || req.requester_name}
                    </p>
                    <div className="flex items-center gap-1 text-slate-500 font-mono">
                      <Phone className="w-3 h-3 text-blue-500" />
                      <a href={`tel:${req.requester_phone}`} className="hover:underline">
                        {req.requester_phone}
                      </a>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${getStatusColor(
                      req.urgency_level
                    )}`}
                  >
                    {req.urgency_level}
                  </span>
                </TableCell>
                <TableCell>
                  {/* Inline Status updater */}
                  <select
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 ${getStatusColor(
                      req.status
                    )}`}
                    value={req.status}
                    onChange={(e) => onUpdateStatus(req.id, e.target.value as any)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="En-Route">En-Route</option>
                    <option value="Arrived">Arrived</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => shareViaWhatsApp(req)}
                      className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                      title="Share emergency dispatch details on WhatsApp"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    {req.status !== 'Completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateStatus(req.id, 'Completed')}
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                        title="Mark Patient Transit Completed"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                    )}
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
