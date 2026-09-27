import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PatientAvatar } from './PatientAvatar';
import { Patient, Appointment } from '../../types';
import { formatDate, getStatusColor } from '../../lib/utils';
import { Phone, Mail, MapPin, AlertCircle, Calendar, Plus, Clock, Edit2 } from 'lucide-react';

interface PatientDetailModalProps {
  patient: (Patient & { appointments?: Appointment[] }) | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (patient: Patient) => void;
  onBookAppointment: (patientId: number) => void;
}

export function PatientDetailModal({
  patient,
  isOpen,
  onClose,
  onEdit,
  onBookAppointment,
}: PatientDetailModalProps) {
  if (!patient) return null;

  const calculateAge = (dob: string) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? `${age} years` : 'Infant';
  };

  const appointments = patient.appointments || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Patient Medical Profile"
      description={`System ID: #PT-${String(patient.id).padStart(4, '0')}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-slate-800 dark:to-slate-800/60 border border-blue-100 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <PatientAvatar name={patient.name} bloodGroup={patient.blood_group} size="xl" showBadge />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{patient.name}</h3>
                <Badge variant="purple">{patient.gender}</Badge>
                <Badge variant="danger" className="font-mono">
                  Blood: {patient.blood_group}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                DOB: {formatDate(patient.dob)} ({calculateAge(patient.dob)})
              </p>
              <p className="text-xs text-slate-500">
                Registered on {formatDate(patient.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(patient);
              }}
            >
              <Edit2 className="w-4 h-4 mr-1.5" />
              Edit
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onBookAppointment(patient.id);
              }}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Book Appointment
            </Button>
          </div>
        </div>

        {/* Contact & Emergency Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Contact Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <a href={`tel:${patient.phone}`} className="font-mono hover:underline">
                  {patient.phone}
                </a>
              </div>
              {patient.email ? (
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <a href={`mailto:${patient.email}`} className="hover:underline">
                    {patient.email}
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Mail className="w-4 h-4 flex-shrink-0" /> No email recorded
                </div>
              )}
              {patient.address && (
                <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>{patient.address}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Emergency Contact & Relations
            </h4>
            {patient.emergency_contact_name || patient.emergency_contact_phone ? (
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {patient.emergency_contact_name || 'Relative / Guardian'}
                </p>
                {patient.emergency_contact_phone && (
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Phone className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <a href={`tel:${patient.emergency_contact_phone}`} className="font-mono font-bold text-rose-600 dark:text-rose-400 hover:underline">
                      {patient.emergency_contact_phone}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No emergency contact provided.</p>
            )}
          </div>
        </div>

        {/* Clinical Alerts & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 space-y-2">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              Known Drug Allergies
            </div>
            <p className="text-sm font-medium text-rose-900 dark:text-rose-200">
              {patient.allergies || 'No known drug or environmental allergies recorded.'}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Medical & Clinical Notes
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {patient.notes || 'No active medical notes entered for this patient.'}
            </p>
          </div>
        </div>

        {/* Appointment History Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Appointment Records ({appointments.length})
            </h4>
          </div>

          {appointments.length === 0 ? (
            <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
              No prior or scheduled appointments for this patient yet.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                        {apt.doctor_name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(
                          apt.status
                        )}`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{apt.reason}</p>
                    {apt.notes && <p className="text-[11px] text-slate-500 italic">Notes: {apt.notes}</p>}
                  </div>
                  <div className="text-right flex-shrink-0 space-y-1">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {apt.appointment_time}
                    </div>
                    <div className="text-xs text-slate-500">{formatDate(apt.appointment_date)}</div>
                    {apt.follow_up_required === 1 && (
                      <span className="inline-block text-[10px] font-bold text-amber-600 dark:text-amber-400">
                        Follow-up due
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
