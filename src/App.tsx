/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TabType, Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer, ToastItem, ToastType } from './components/layout/ToastContainer';

// View Components
import { DashboardView } from './components/views/DashboardView';
import { PatientsView } from './components/views/PatientsView';
import { AppointmentsView } from './components/views/AppointmentsView';
import { AmbulanceView } from './components/views/AmbulanceView';
import { BloodBankView } from './components/views/BloodBankView';
import { HospitalsView } from './components/views/HospitalsView';
import { EmergencyView } from './components/views/EmergencyView';

// Modals
import { PatientFormModal } from './components/patients/PatientFormModal';
import { PatientDetailModal } from './components/patients/PatientDetailModal';
import { AppointmentFormModal } from './components/appointments/AppointmentFormModal';
import { PrintSlipModal } from './components/appointments/PrintSlipModal';

// Storage & Types
import { ClinicStore } from './lib/storage';
import {
  Patient,
  Appointment,
  AmbulanceRequest,
  BloodRequirement,
  BloodBank,
  Hospital,
  EmergencyRequest,
  DashboardStats,
} from './types';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data State
  const [stats, setStats] = useState<DashboardStats>(() => ClinicStore.getDashboardStats());
  const [patients, setPatients] = useState<Patient[]>(() => ClinicStore.getPatients());
  const [appointments, setAppointments] = useState<Appointment[]>(() => ClinicStore.getAppointments());
  const [ambulanceRequests, setAmbulanceRequests] = useState<AmbulanceRequest[]>(() =>
    ClinicStore.getAmbulanceRequests()
  );
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>(() => ClinicStore.getBloodBanks());
  const [bloodRequirements, setBloodRequirements] = useState<BloodRequirement[]>(() =>
    ClinicStore.getBloodRequirements()
  );
  const [hospitals, setHospitals] = useState<Hospital[]>(() => ClinicStore.getHospitals());
  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>(() =>
    ClinicStore.getEmergencies()
  );

  // Modals State
  const [isPatientFormOpen, setIsPatientFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const [selectedPatientForDetail, setSelectedPatientForDetail] = useState<
    (Patient & { appointments?: Appointment[] }) | null
  >(null);
  const [isPatientDetailOpen, setIsPatientDetailOpen] = useState(false);

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [preselectedPatientId, setPreselectedPatientId] = useState<number | null>(null);

  const [printableAppointment, setPrintableAppointment] = useState<Appointment | null>(null);
  const [isPrintSlipOpen, setIsPrintSlipOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const notify = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  // Sync state whenever storage updates
  const refreshAllData = useCallback(() => {
    setStats(ClinicStore.getDashboardStats());
    setPatients(ClinicStore.getPatients());
    setAppointments(ClinicStore.getAppointments());
    setAmbulanceRequests(ClinicStore.getAmbulanceRequests());
    setBloodBanks(ClinicStore.getBloodBanks());
    setBloodRequirements(ClinicStore.getBloodRequirements());
    setHospitals(ClinicStore.getHospitals());
    setEmergencies(ClinicStore.getEmergencies());

    // Update detail view if open
    if (selectedPatientForDetail) {
      const refreshed = ClinicStore.getPatientById(selectedPatientForDetail.id);
      setSelectedPatientForDetail(refreshed);
    }
  }, [selectedPatientForDetail]);

  useEffect(() => {
    ClinicStore.init();
    refreshAllData();

    const handleStorageUpdate = () => {
      refreshAllData();
    };

    window.addEventListener('clinicos_data_updated', handleStorageUpdate);
    return () => window.removeEventListener('clinicos_data_updated', handleStorageUpdate);
  }, [refreshAllData]);

  // Handlers for Patient Actions
  const handleOpenAddPatient = () => {
    setEditingPatient(null);
    setIsPatientFormOpen(true);
  };

  const handleOpenEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setIsPatientFormOpen(true);
  };

  const handleViewPatient = (patient: Patient) => {
    const fullPatient = ClinicStore.getPatientById(patient.id);
    setSelectedPatientForDetail(fullPatient);
    setIsPatientDetailOpen(true);
  };

  const handleViewPatientById = (patientId: number) => {
    const fullPatient = ClinicStore.getPatientById(patientId);
    if (fullPatient) {
      setSelectedPatientForDetail(fullPatient);
      setIsPatientDetailOpen(true);
    } else {
      notify('Patient profile not found', 'warning');
    }
  };

  const handleDeletePatient = (id: number) => {
    ClinicStore.deletePatient(id);
    notify('Patient and associated records deleted', 'info');
  };

  // Handlers for Appointment Actions
  const handleOpenNewAppointment = (patientId?: number) => {
    setPreselectedPatientId(patientId || null);
    setIsAppointmentModalOpen(true);
  };

  const handleUpdateAppointmentStatus = (id: number, status: Appointment['status']) => {
    ClinicStore.updateAppointment(id, { status });
    notify(`Appointment status changed to ${status}`, 'success');
  };

  const handleDeleteAppointment = (id: number) => {
    ClinicStore.deleteAppointment(id);
    notify('Appointment cancelled and removed', 'info');
  };

  const handlePrintSlip = (apt: Appointment) => {
    setPrintableAppointment(apt);
    setIsPrintSlipOpen(true);
  };

  // Handlers for Ambulance Actions
  const handleAddAmbulanceRequest = (
    data: Omit<AmbulanceRequest, 'id' | 'created_at' | 'updated_at'>
  ) => {
    ClinicStore.addAmbulanceRequest(data);
  };

  const handleUpdateAmbulanceStatus = (
    id: number,
    status: AmbulanceRequest['status'],
    assignedUnit?: string
  ) => {
    ClinicStore.updateAmbulanceStatus(id, status, assignedUnit);
    notify(`Ambulance status updated to ${status}`, 'info');
  };

  // Handlers for Blood Bank Actions
  const handleAddBloodRequirement = (
    data: Omit<BloodRequirement, 'id' | 'created_at' | 'status'>
  ) => {
    ClinicStore.addBloodRequirement(data);
  };

  const handleFulfillBloodRequirement = (id: number) => {
    ClinicStore.updateBloodReqStatus(id, 'Fulfilled');
    notify('Blood demand marked as fulfilled', 'success');
  };

  // Handlers for Emergency Actions
  const handleAddEmergency = (data: Omit<EmergencyRequest, 'id' | 'created_at' | 'updated_at'>) => {
    ClinicStore.addEmergency(data);
  };

  const handleUpdateEmergencyStatus = (
    id: number,
    status: EmergencyRequest['status'],
    resolutionNotes?: string
  ) => {
    ClinicStore.updateEmergency(id, {
      status,
      resolution_notes: resolutionNotes,
    });
    notify(`Emergency case marked as ${status}`, 'info');
  };

  const handleUpdateEmergencyAssignee = (id: number, assignedTo: string) => {
    ClinicStore.updateEmergency(id, { assigned_to: assignedTo });
    notify('Assigned physician updated', 'info');
  };

  // Demo Data Reset
  const handleResetDemo = () => {
    ClinicStore.resetToDemo();
    notify('ClinicOS restored to default hackathon dataset!', 'success');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Main Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        emergencyCount={stats.activeEmergencies}
        ambulancePendingCount={stats.pendingAmbulance}
        onResetDemo={handleResetDemo}
      />

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:pl-64 transition-all duration-300">
        <Header
          activeTab={activeTab}
          setSidebarOpen={setSidebarOpen}
          stats={stats}
          onNavigate={(tab) => setActiveTab(tab)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenNewPatient={handleOpenAddPatient}
              onOpenNewAppointment={() => handleOpenNewAppointment()}
              onPrintSlip={handlePrintSlip}
              onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            />
          )}

          {activeTab === 'patients' && (
            <PatientsView
              patients={patients}
              onOpenNewPatient={handleOpenAddPatient}
              onEditPatient={handleOpenEditPatient}
              onViewPatient={handleViewPatient}
              onDeletePatient={handleDeletePatient}
              onBookAppointment={(patientId) => handleOpenNewAppointment(patientId)}
              notify={notify}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsView
              appointments={appointments}
              onOpenNewAppointment={() => handleOpenNewAppointment()}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onDeleteAppointment={handleDeleteAppointment}
              onPrintSlip={handlePrintSlip}
              onViewPatientById={handleViewPatientById}
              notify={notify}
            />
          )}

          {activeTab === 'ambulance' && (
            <AmbulanceView
              requests={ambulanceRequests}
              onAddRequest={handleAddAmbulanceRequest}
              onUpdateStatus={handleUpdateAmbulanceStatus}
              notify={notify}
            />
          )}

          {activeTab === 'blood-bank' && (
            <BloodBankView
              bloodBanks={bloodBanks}
              requirements={bloodRequirements}
              onAddRequirement={handleAddBloodRequirement}
              onFulfillRequirement={handleFulfillBloodRequirement}
              notify={notify}
            />
          )}

          {activeTab === 'hospitals' && <HospitalsView hospitals={hospitals} />}

          {activeTab === 'emergency' && (
            <EmergencyView
              emergencies={emergencies}
              onAddEmergency={handleAddEmergency}
              onUpdateStatus={handleUpdateEmergencyStatus}
              onUpdateAssignee={handleUpdateEmergencyAssignee}
              notify={notify}
            />
          )}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <PatientFormModal
        isOpen={isPatientFormOpen}
        onClose={() => setIsPatientFormOpen(false)}
        initialData={editingPatient}
        onSuccess={() => {}}
        notify={notify}
      />

      <PatientDetailModal
        isOpen={isPatientDetailOpen}
        onClose={() => setIsPatientDetailOpen(false)}
        patient={selectedPatientForDetail}
        onEdit={(p) => {
          setIsPatientDetailOpen(false);
          handleOpenEditPatient(p);
        }}
        onBookAppointment={(pId) => {
          setIsPatientDetailOpen(false);
          handleOpenNewAppointment(pId);
        }}
      />

      <AppointmentFormModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        preselectedPatientId={preselectedPatientId}
        onSuccess={() => {}}
        notify={notify}
        onOpenNewPatientModal={handleOpenAddPatient}
      />

      <PrintSlipModal
        isOpen={isPrintSlipOpen}
        onClose={() => setIsPrintSlipOpen(false)}
        appointment={printableAppointment}
      />
    </div>
  );
}
