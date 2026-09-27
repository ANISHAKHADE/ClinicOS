import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Appointment } from '../../types';
import { formatDate } from '../../lib/utils';
import { Printer, CheckCircle2 } from 'lucide-react';

interface PrintSlipModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PrintSlipModal({ appointment, isOpen, onClose }: PrintSlipModalProps) {
  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Confirmation Slip"
      description="Official patient OPD pass and consultation voucher."
      size="md"
    >
      <div className="space-y-6">
        {/* Printable Card Area with ID for print CSS */}
        <div
          id="print-section"
          className="p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm space-y-5"
        >
          {/* Header */}
          <div className="text-center border-b-2 border-dashed border-slate-200 dark:border-slate-800 pb-4">
            <div className="inline-flex items-center gap-1.5 font-black text-xl tracking-tight text-blue-600 dark:text-blue-400">
              🏥 ClinicOS HealthCare
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              FIT-FEST Health Center • Sassoon Road, Pune 411001
            </p>
            <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
              Token #OPD-{String(appointment.id).padStart(4, '0')}
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Patient Name:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {appointment.patient_name}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Contact Phone:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {appointment.patient_phone || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Blood Group:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">
                {appointment.patient_blood_group || 'Recorded in file'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Consulting Doctor:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {appointment.doctor_name}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Date & Time:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
                {formatDate(appointment.appointment_date)} at {appointment.appointment_time} hrs
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-medium">Purpose of Visit:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 text-right max-w-[240px]">
                {appointment.reason}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Booking Status:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {appointment.status}
              </span>
            </div>
          </div>

          {/* Clinical Instructions */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p className="font-bold text-slate-800 dark:text-slate-200">Patient Instructions:</p>
            <p>1. Please report to the reception counter 10 minutes prior to your time.</p>
            <p>2. Carry previous discharge summaries, lab reports, and current medications.</p>
            <p>3. In case of an emergency change, call Helpline: 020-26163391.</p>
          </div>

          <div className="text-center pt-2 text-[10px] text-slate-400">
            Generated on {new Date().toLocaleString()} • Valid on presentation at ClinicOS OPD counter.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print Slip
          </Button>
        </div>
      </div>
    </Modal>
  );
}
