import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Patient } from '../../types';
import { ClinicStore } from '../../lib/storage';

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedPatient: Patient) => void;
  initialData?: Patient | null;
  notify: (msg: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const BLOOD_GROUPS = [
  { label: 'A+ (Positive)', value: 'A+' },
  { label: 'A- (Negative)', value: 'A-' },
  { label: 'B+ (Positive)', value: 'B+' },
  { label: 'B- (Negative)', value: 'B-' },
  { label: 'AB+ (Positive)', value: 'AB+' },
  { label: 'AB- (Negative)', value: 'AB-' },
  { label: 'O+ (Positive)', value: 'O+' },
  { label: 'O- (Negative)', value: 'O-' },
];

export function PatientFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  notify,
}: PatientFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    phone: '',
    email: '',
    blood_group: 'A+',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    allergies: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        dob: initialData.dob || '',
        gender: initialData.gender || 'Male',
        phone: initialData.phone || '',
        email: initialData.email || '',
        blood_group: initialData.blood_group || 'A+',
        address: initialData.address || '',
        emergency_contact_name: initialData.emergency_contact_name || '',
        emergency_contact_phone: initialData.emergency_contact_phone || '',
        allergies: initialData.allergies || '',
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        name: '',
        dob: '',
        gender: 'Male',
        phone: '',
        email: '',
        blood_group: 'A+',
        address: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        allergies: '',
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Patient name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.blood_group) newErrors.blood_group = 'Blood group is required';

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      notify('Please resolve highlighted form errors', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      if (initialData) {
        const updated = ClinicStore.updatePatient(initialData.id, formData);
        if (updated) {
          notify(`Patient ${updated.name} updated successfully`, 'success');
          onSuccess(updated);
          onClose();
        } else {
          notify('Failed to update patient record', 'error');
        }
      } else {
        const created = ClinicStore.addPatient(formData);
        notify(`New patient ${created.name} registered`, 'success');
        onSuccess(created);
        onClose();
      }
    } catch {
      notify('An unexpected error occurred while saving', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Patient Record' : 'Register New Patient'}
      description="Enter personal, contact, and clinical details for hospital intake."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name *"
            placeholder="e.g. Anand Deshmukh"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            autoFocus
          />
          <Input
            label="Date of Birth *"
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            error={errors.dob}
          />
          <Select
            label="Gender *"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
            options={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
              { label: 'Other', value: 'Other' },
            ]}
          />
          <Select
            label="Blood Group *"
            value={formData.blood_group}
            onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
            options={BLOOD_GROUPS}
            error={errors.blood_group}
          />
          <Input
            label="Phone Number (10 Digits) *"
            placeholder="e.g. 9822012345"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
          />
          <Input
            label="Email Address (Optional)"
            placeholder="e.g. patient@example.com"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />
        </div>

        <Input
          label="Residential Address"
          placeholder="Flat / Society, Street, Area, Pune"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Emergency Contact Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Person Name"
              placeholder="e.g. Sunita Deshmukh (Spouse)"
              value={formData.emergency_contact_name}
              onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
            />
            <Input
              label="Emergency Phone"
              placeholder="e.g. 9822099999"
              type="tel"
              value={formData.emergency_contact_phone}
              onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              Known Allergies & Drug Reactions
            </label>
            <textarea
              className="w-full h-20 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Penicillin, Sulfa, Aspirin, Pollen"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Clinical & Medical Notes
            </label>
            <textarea
              className="w-full h-20 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Hypertensive on Telmisartan, diabetic diet, post-op review"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={submitting}>
            {initialData ? 'Update Record' : 'Complete Registration'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
