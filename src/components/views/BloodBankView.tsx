import React, { useState, useMemo } from 'react';
import {
  Droplet,
  Phone,
  MapPin,
  Clock,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Building,
  HeartPulse,
} from 'lucide-react';
import { BloodBank, BloodRequirement } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { getBloodGroupColor, getStatusColor, timeAgo } from '../../lib/utils';

interface BloodBankViewProps {
  bloodBanks: BloodBank[];
  requirements: BloodRequirement[];
  onAddRequirement: (req: Omit<BloodRequirement, 'id' | 'created_at' | 'status'>) => void;
  onFulfillRequirement: (id: number) => void;
  notify: (msg: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const ALL_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export function BloodBankView({
  bloodBanks,
  requirements,
  onAddRequirement,
  onFulfillRequirement,
  notify,
}: BloodBankViewProps) {
  const [activeTab, setActiveTab] = useState<'banks' | 'requirements'>('banks');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    blood_group: 'O-',
    quantity_units: 2,
    required_by: '',
    hospital_name: 'KEM Hospital Pune',
    location: 'Rasta Peth, Pune',
    contact_name: 'Dr. Salunkhe',
    contact_phone: '020-26129561',
    urgency: 'Emergency' as BloodRequirement['urgency'],
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);

  // Filtered blood banks
  const filteredBanks = useMemo(() => {
    if (selectedGroup === 'All') return bloodBanks;
    return bloodBanks.filter((b) => b.available_groups.includes(selectedGroup));
  }, [bloodBanks, selectedGroup]);

  // Filtered requirements
  const filteredRequirements = useMemo(() => {
    if (selectedGroup === 'All') return requirements;
    return requirements.filter((r) => r.blood_group === selectedGroup);
  }, [requirements, selectedGroup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.blood_group || !formData.location || !formData.contact_phone) {
      notify('Please fill required fields (Blood group, location, phone)', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      onAddRequirement({
        blood_group: formData.blood_group,
        quantity_units: Number(formData.quantity_units),
        required_by: formData.required_by.trim() || undefined,
        hospital_name: formData.hospital_name.trim() || undefined,
        location: formData.location.trim(),
        contact_name: formData.contact_name.trim(),
        contact_phone: formData.contact_phone.trim(),
        urgency: formData.urgency,
        notes: formData.notes.trim() || undefined,
      });

      notify(`Blood requirement posted for ${formData.quantity_units} units of ${formData.blood_group}`, 'success');
      setIsFormOpen(false);
      setActiveTab('requirements');
    } catch {
      notify('Failed to post blood requirement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Droplet className="w-7 h-7 text-rose-600" />
            Blood Bank & Critical Needs Network
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time blood bank inventory tracker and urgent hospital transfusion requests
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isFormOpen ? 'secondary' : 'danger'}
            onClick={() => setIsFormOpen(!isFormOpen)}
          >
            {isFormOpen ? 'Close Form' : '+ Post Blood Requirement'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('banks')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'banks'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          Blood Banks Directory ({bloodBanks.length})
        </button>

        <button
          onClick={() => setActiveTab('requirements')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'requirements'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          Active Requirements ({requirements.filter((r) => r.status === 'Active').length})
        </button>
      </div>

      {/* Blood Group Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2">
          Filter by Blood Group:
        </span>
        <button
          onClick={() => setSelectedGroup('All')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            selectedGroup === 'All'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          All Groups
        </button>
        {ALL_BLOOD_GROUPS.map((bg) => (
          <button
            key={bg}
            onClick={() => setSelectedGroup(bg)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedGroup === bg
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {bg}
          </button>
        ))}
      </div>

      {/* New Blood Requirement Form Drawer */}
      {isFormOpen && (
        <Card className="border-rose-300 dark:border-rose-900 shadow-md animate-in slide-in-from-top-4 fade-in duration-200">
          <CardHeader className="bg-rose-50/70 dark:bg-rose-950/30 border-b border-rose-100 dark:border-rose-900/50 pb-3">
            <CardTitle className="text-base font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-rose-600" />
              Post Emergency Blood Transfusion Need
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Blood Group Required *"
                  value={formData.blood_group}
                  onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                  options={ALL_BLOOD_GROUPS.map((bg) => ({ label: `${bg} Transfusion`, value: bg }))}
                />
                <Input
                  label="Quantity in Units *"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.quantity_units}
                  onChange={(e) => setFormData({ ...formData, quantity_units: Number(e.target.value) })}
                  required
                />
                <Select
                  label="Urgency Tier *"
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                  options={[
                    { label: 'Emergency (Immediate OT / ICU)', value: 'Emergency' },
                    { label: 'Urgent (Within 6 hours)', value: 'Urgent' },
                    { label: 'Normal (Elective Surgery)', value: 'Normal' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Patient Name"
                  placeholder="e.g. Ramesh Kulkarni"
                  value={formData.required_by}
                  onChange={(e) => setFormData({ ...formData, required_by: e.target.value })}
                />
                <Input
                  label="Hospital / Department"
                  placeholder="e.g. Ruby Hall Clinic (OT 3)"
                  value={formData.hospital_name}
                  onChange={(e) => setFormData({ ...formData, hospital_name: e.target.value })}
                />
                <Input
                  label="Hospital Location / Ward *"
                  placeholder="e.g. Sassoon Road, Pune"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Contact Person *"
                    placeholder="Doctor / Coordinator"
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    required
                  />
                  <Input
                    label="Contact Phone *"
                    placeholder="020-... / 9822..."
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Input
                label="Clinical Justification / Diagnosis"
                placeholder="e.g. Multiple trauma with acute hemoglobin drop, scheduled valve surgery"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="danger" isLoading={submitting}>
                  Broadcast Blood Requirement
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tab 1: Blood Banks Directory */}
      {activeTab === 'banks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBanks.map((bank) => (
            <Card key={bank.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 leading-snug">
                      {bank.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      {bank.address}, {bank.city}
                    </p>
                  </div>
                  {bank.emergency_service === 1 && (
                    <Badge variant="danger" className="text-[10px] font-black uppercase flex-shrink-0">
                      24/7 Service
                    </Badge>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-blue-500" />
                    <a href={`tel:${bank.phone}`} className="font-mono font-bold hover:underline">
                      {bank.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Operating Hours: {bank.operating_hours}</span>
                  </div>
                </div>

                {/* Available Blood Groups Matrix */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Stocked Blood Groups
                  </p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {ALL_BLOOD_GROUPS.map((bg) => {
                      const isAvailable = bank.available_groups.includes(bg);
                      return (
                        <div
                          key={bg}
                          className={`py-1 text-center rounded-lg text-xs font-bold font-mono transition-colors ${
                            isAvailable
                              ? getBloodGroupColor(bg)
                              : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 opacity-60'
                          }`}
                        >
                          {bg}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 2: Active Blood Requirements */}
      {activeTab === 'requirements' && (
        <div className="space-y-4">
          {filteredRequirements.length === 0 ? (
            <EmptyState
              icon={Droplet}
              title="No blood requirements matching filters"
              description="All patient blood demands have been satisfied or no urgent cases posted."
              actionLabel="Post Requirement"
              onAction={() => setIsFormOpen(true)}
            />
          ) : (
            filteredRequirements.map((req) => (
              <Card
                key={req.id}
                className={
                  req.status === 'Fulfilled'
                    ? 'opacity-60 bg-slate-50/50 dark:bg-slate-900/40'
                    : req.urgency === 'Emergency'
                    ? 'border-rose-300 dark:border-rose-900/80 shadow-xs'
                    : ''
                }
              >
                <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Big blood chip */}
                    <div
                      className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-extrabold flex-shrink-0 shadow-sm ${
                        req.status === 'Fulfilled'
                          ? 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          : getBloodGroupColor(req.blood_group)
                      }`}
                    >
                      <span className="text-lg leading-none">{req.blood_group}</span>
                      <span className="text-[9px] uppercase font-bold tracking-wider mt-0.5">
                        {req.quantity_units} Units
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusColor(
                            req.urgency
                          )}`}
                        >
                          {req.urgency}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(
                            req.status
                          )}`}
                        >
                          {req.status}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo(req.created_at)}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                        {req.quantity_units} Unit{req.quantity_units > 1 ? 's' : ''} {req.blood_group} for{' '}
                        {req.required_by || 'Emergency Patient'}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 flex-wrap">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{req.hospital_name || req.location}</span>
                        <span>• Contact:</span>
                        <a
                          href={`tel:${req.contact_phone}`}
                          className="font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {req.contact_phone}
                        </a>
                        <span>({req.contact_name})</span>
                      </p>

                      {req.notes && (
                        <p className="text-xs text-slate-500 italic mt-0.5">"{req.notes}"</p>
                      )}
                    </div>
                  </div>

                  {req.status === 'Active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onFulfillRequirement(req.id)}
                      className="self-end sm:self-center text-emerald-600 border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/40"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      Mark As Fulfilled
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
