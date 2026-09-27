import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Appointment } from '../../types';
import { ClinicStore } from '../../lib/storage';
import { AlertTriangle, Clock } from 'lucide-react';

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (apt: Appointment) => void;
  preselectedPatientId?: number | null;
  notify: (msg: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  onOpenNewPatientModal?: () => void;
}

const DOCTORS = [
  { label: 'Dr. Mehta (General Physician & Internal Medicine)', value: 'Dr. Mehta' },
  { label: 'Dr. Sharma (Pediatrics & Child Health)', value: 'Dr. Sharma' },
  { label: 'Dr. Kulkarni (Cardiology & Critical Care)', value: 'Dr. Kulkarni' },
  { label: 'Dr. Joshi (Orthopedics & Joint Reconstruction)', value: 'Dr. Joshi' },
];

const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
];

export function AppointmentFormModal({
  isOpen,
  onClose,
  onSuccess,
  preselectedPatientId,
  notify,
  onOpenNewPatientModal,
}: AppointmentFormModalProps) {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    patient_id: preselectedPatientId ? String(preselectedPatientId) : '',
    doctor_name: 'Dr. Mehta',
    appointment_date: today,
    appointment_time: '10:00',
    reason: '',
    notes: '',
    status: 'Scheduled' as Appointment['status'],
    follow_up_required: false,
    follow_up_date: '',
  });

  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load patients list for dropdown
  const patients = ClinicStore.getPatients();

  useEffect(() => {
    if (preselectedPatientId) {
      setFormData((prev) => ({ ...prev, patient_id: String(preselectedPatientId) }));
    } else if (patients.length > 0 && !formData.patient_id) {
      setFormData((prev) => ({ ...prev, patient_id: String(patients[0].id) }));
    }
  }, [preselectedPatientId, isOpen, patients]);

  // Conflict detection
  useEffect(() => {
    if (formData.doctor_name && formData.appointment_date && formData.appointment_time) {
      const allApts = ClinicStore.getAppointments();
      const conflict = allApts.find(
        (a) =>
          a.doctor_name === formData.doctor_name &&
          a.appointment_date === formData.appointment_date &&
          a.appointment_time === formData.appointment_time &&
          a.status !== 'Cancelled' &&
          a.status !== 'No-Show'
      );

      if (conflict) {
        setConflictWarning(
          `Schedule Conflict: ${formData.doctor_name} is already booked at ${formData.appointment_time} on ${formData.appointment_date} with ${conflict.patient_name}.`
        );
      } else {
        setConflictWarning(null);
      }
    }
  }, [formData.doctor_name, formData.appointment_date, formData.appointment_time]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patient_id) {
      notify('Please select or register a patient', 'warning');
      return;
    }
    if (!formData.reason.trim()) {
      notify('Please provide the clinical reason for the visit', 'warning');
      return;
    }
    if (formData.appointment_date < today) {
      notify('Appointments cannot be scheduled for past dates', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const newApt = ClinicStore.addAppointment({
        patient_id: Number(formData.patient_id),
        doctor_name: formData.doctor_name,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        reason: formData.reason.trim(),
        notes: formData.notes.trim(),
        status: formData.status,
        follow_up_required: formData.follow_up_required ? 1 : 0,
        follow_up_date: formData.follow_up_date || undefined,
      });

      notify(`Appointment confirmed with ${formData.doctor_name}`, 'success');
      onSuccess(newApt);
      onClose();
    } catch {
      notify('Failed to schedule appointment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Medical Appointment"
      description="Select patient, consulting physician, and appointment slot."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Patient Selection Row */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Select Patient *
            </label>
            {onOpenNewPatientModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenNewPatientModal();
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                + Register New Patient
              </button>
            )}
          </div>
          <select
            className="flex h-10 w-full rounded-lg border border-slate-300 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700"
            value={formData.patient_id}
            onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
            required
          >
            <option value="">-- Choose Patient --</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.gender}, {p.blood_group}) - Tel: {p.phone}
              </option>
            ))}
          </select>
        </div>

        {/* Doctor and Date/Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Consulting Doctor *"
            value={formData.doctor_name}
            onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
            options={DOCTORS}
          />
          <Select
            label="Initial Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            options={[
              { label: 'Scheduled', value: 'Scheduled' },
              { label: 'Confirmed', value: 'Confirmed' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Date *"
            type="date"
            min={today}
            value={formData.appointment_date}
            onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
            required
          />
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Time Slot *
            </label>
            <select
              className="flex h-9 w-full rounded-lg border border-slate-300 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700"
              value={formData.appointment_time}
              onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot} hrs
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Conflict Warning Alert */}
        {conflictWarning && (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-2.5 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Slot Collision Detected</p>
              <p className="mt-0.5">{conflictWarning}</p>
              <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-400">
                You may still confirm if double-booking is permitted by clinical protocol.
              </p>
            </div>
          </div>
        )}

        <Input
          label="Reason for Visit / Chief Complaint *"
          placeholder="e.g. Severe migraine, Chest pain evaluation, Routine BP check"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          required
        />

        <div className="space-y-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Special Instructions / Diagnostic Notes
          </label>
          <textarea
            className="w-full h-20 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Fasting 10 hrs prior to blood test, bring previous ECG reports"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        {/* Follow up toggle */}
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-800 dark:text-slate-200">
            <input
              type="checkbox"
              checked={formData.follow_up_required}
              onChange={(e) => setFormData({ ...formData, follow_up_required: e.target.checked })}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Flag for mandatory follow-up visit
          </label>
          {formData.follow_up_required && (
            <div className="pt-2">
              <Input
                label="Target Follow-up Date"
                type="date"
                min={today}
                value={formData.follow_up_date}
                onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={submitting}>
            Confirm Appointment
          </Button>
        </div>
      </form>
    </Modal>
  );
}
