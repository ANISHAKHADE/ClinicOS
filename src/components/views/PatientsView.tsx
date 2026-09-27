import React, { useState, useMemo } from 'react';
import { Search, Plus, Download, Eye, Edit2, Trash2, Users, Phone, Mail } from 'lucide-react';
import { Patient, Appointment } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { EmptyState } from '../ui/EmptyState';
import { PatientAvatar } from '../patients/PatientAvatar';
import { getBloodGroupColor } from '../../lib/utils';
import { ClinicStore } from '../../lib/storage';

interface PatientsViewProps {
  patients: Patient[];
  onOpenNewPatient: () => void;
  onEditPatient: (patient: Patient) => void;
  onViewPatient: (patient: Patient) => void;
  onDeletePatient: (id: number) => void;
  onBookAppointment: (patientId: number) => void;
  notify: (msg: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export function PatientsView({
  patients,
  onOpenNewPatient,
  onEditPatient,
  onViewPatient,
  onDeletePatient,
  onBookAppointment,
  notify,
}: PatientsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('All');

  // Filtered patients list
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesBlood =
        bloodGroupFilter === 'All' || patient.blood_group === bloodGroupFilter;

      return matchesSearch && matchesBlood;
    });
  }, [patients, searchTerm, bloodGroupFilter]);

  const handleExportCSV = () => {
    if (patients.length === 0) {
      notify('No patient records to export', 'warning');
      return;
    }

    const headers = [
      'Patient ID',
      'Full Name',
      'Date of Birth',
      'Gender',
      'Phone',
      'Email',
      'Blood Group',
      'Address',
      'Emergency Contact Name',
      'Emergency Contact Phone',
      'Allergies',
      'Notes',
    ];

    const rows = filteredPatients.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.dob,
      p.gender,
      p.phone,
      p.email || '',
      p.blood_group,
      `"${(p.address || '').replace(/"/g, '""')}"`,
      `"${(p.emergency_contact_name || '').replace(/"/g, '""')}"`,
      p.emergency_contact_phone || '',
      `"${(p.allergies || '').replace(/"/g, '""')}"`,
      `"${(p.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `clinicos_patients_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('Patient records exported successfully', 'success');
  };

  const calculateAge = (dob: string) => {
    if (!dob) return '-';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? `${age}y` : '<1y';
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Patient Medical Registry
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {patients.length} registered patient records on file
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="flex-1 sm:flex-initial">
            <Download className="w-4 h-4 mr-1.5" />
            Export CSV
          </Button>
          <Button variant="primary" size="sm" onClick={onOpenNewPatient} className="flex-1 sm:flex-initial">
            <Plus className="w-4 h-4 mr-1.5" />
            Register Patient
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by patient name, phone number, or email..."
              className="pl-9 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')}>
              Clear
            </Button>
          )}
        </div>

        {/* Blood Group Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1.5">
            Filter by Blood:
          </span>
          {BLOOD_GROUPS.map((bg) => {
            const isSelected = bloodGroupFilter === bg;
            return (
              <button
                key={bg}
                onClick={() => setBloodGroupFilter(bg)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {bg}
              </button>
            );
          })}
        </div>
      </div>

      {/* Patients Table */}
      {filteredPatients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No patients match your search"
          description="Adjust your search query or blood group filter, or register a new patient."
          actionLabel="Register Patient"
          onAction={onOpenNewPatient}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient Details</TableHead>
              <TableHead>Contact Information</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Age / Gender</TableHead>
              <TableHead>Emergency Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <PatientAvatar name={patient.name} bloodGroup={patient.blood_group} size="md" />
                    <div>
                      <button
                        onClick={() => onViewPatient(patient)}
                        className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 text-left transition-colors"
                      >
                        {patient.name}
                      </button>
                      <p className="text-[11px] text-slate-400 font-mono">
                        #PT-{String(patient.id).padStart(4, '0')}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5 text-xs">
                    <div className="flex items-center gap-1.5 font-mono text-slate-800 dark:text-slate-200">
                      <Phone className="w-3 h-3 text-blue-500" />
                      {patient.phone}
                    </div>
                    {patient.email && (
                      <div className="flex items-center gap-1.5 text-slate-500 truncate max-w-[200px]">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {patient.email}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${getBloodGroupColor(
                      patient.blood_group
                    )}`}
                  >
                    {patient.blood_group}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {calculateAge(patient.dob)} • {patient.gender}
                  </div>
                </TableCell>
                <TableCell>
                  {patient.emergency_contact_phone ? (
                    <div className="text-xs space-y-0.5">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {patient.emergency_contact_name || 'Relative'}
                      </p>
                      <p className="font-mono text-slate-500">{patient.emergency_contact_phone}</p>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">None</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewPatient(patient)}
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                      title="View Medical Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditPatient(patient)}
                      className="h-8 w-8 p-0 text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                      title="Edit Record"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (
                          confirm(
                            `Delete patient ${patient.name}? All associated appointment records will also be removed.`
                          )
                        ) {
                          onDeletePatient(patient.id);
                        }
                      }}
                      className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                      title="Delete Patient"
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
