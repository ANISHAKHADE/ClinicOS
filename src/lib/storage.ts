import {
  Patient,
  Appointment,
  AmbulanceRequest,
  BloodRequirement,
  BloodBank,
  Hospital,
  EmergencyRequest,
  DashboardStats,
} from '../types';

const STORAGE_KEYS = {
  PATIENTS: 'clinicos_patients_v1',
  APPOINTMENTS: 'clinicos_appointments_v1',
  AMBULANCE: 'clinicos_ambulance_v1',
  BLOOD_BANKS: 'clinicos_blood_banks_v1',
  BLOOD_REQS: 'clinicos_blood_reqs_v1',
  HOSPITALS: 'clinicos_hospitals_v1',
  EMERGENCIES: 'clinicos_emergencies_v1',
};

// Seed Data
export const DEFAULT_BLOOD_BANKS: BloodBank[] = [
  {
    id: 1,
    name: 'Ruby Hall Clinic Blood Bank',
    address: '40 Sassoon Road',
    city: 'Pune',
    phone: '020-26163391',
    email: 'bloodbank@rubyhall.com',
    operating_hours: '24/7',
    available_groups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    emergency_service: 1,
  },
  {
    id: 2,
    name: 'KEM Hospital Blood Bank',
    address: 'Rasta Peth',
    city: 'Pune',
    phone: '020-26129561',
    email: 'bloodbank@kem.org',
    operating_hours: '24/7',
    available_groups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    emergency_service: 1,
  },
  {
    id: 3,
    name: 'Sahyadri Hospital Blood Bank',
    address: '30-C Erandwane',
    city: 'Pune',
    phone: '020-67213000',
    email: 'sahyadriblood@sahyadri.com',
    operating_hours: '24/7',
    available_groups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    emergency_service: 1,
  },
  {
    id: 4,
    name: 'Deenanath Mangeshkar Blood Bank',
    address: 'Erandwane, Near Mhatre Bridge',
    city: 'Pune',
    phone: '020-49153000',
    email: 'blood@dmhospital.org',
    operating_hours: '08:00 - 20:00',
    available_groups: ['A+', 'A-', 'B+', 'B-', 'O+', 'AB+'],
    emergency_service: 0,
  },
  {
    id: 5,
    name: 'Inlaks & Budhrani Blood Bank',
    address: 'Koregaon Park',
    city: 'Pune',
    phone: '020-66053000',
    email: 'bloodbank@inlaks.org',
    operating_hours: '24/7',
    available_groups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    emergency_service: 1,
  },
];

export const DEFAULT_HOSPITALS: Hospital[] = [
  {
    id: 1,
    name: 'Ruby Hall Clinic',
    address: '40 Sassoon Road',
    city: 'Pune',
    phone: '020-26163391',
    type: 'Private',
    emergency_available: 1,
    icu_available: 1,
    distance_km: 2.5,
    specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Organ Transplant'],
    rating: 4.8,
    operating_hours: '24/7',
  },
  {
    id: 2,
    name: 'KEM Hospital & Research Centre',
    address: 'Rasta Peth, Sardar Moodliar Road',
    city: 'Pune',
    phone: '020-26129561',
    type: 'Government',
    emergency_available: 1,
    icu_available: 1,
    distance_km: 3.2,
    specialties: ['General Medicine', 'Trauma Surgery', 'Pediatrics', 'Obstetrics'],
    rating: 4.3,
    operating_hours: '24/7',
  },
  {
    id: 3,
    name: 'Sahyadri Super Speciality Hospital',
    address: '30-C Erandwane, Deccan Gymkhana',
    city: 'Pune',
    phone: '020-67213000',
    type: 'Specialty',
    emergency_available: 1,
    icu_available: 1,
    distance_km: 4.1,
    specialties: ['Cardiac Sciences', 'Neurosciences', 'Bone & Joint', 'Hematology'],
    rating: 4.6,
    operating_hours: '24/7',
  },
  {
    id: 4,
    name: 'Deenanath Mangeshkar Hospital',
    address: 'Erandwane',
    city: 'Pune',
    phone: '020-49153000',
    type: 'Private',
    emergency_available: 1,
    icu_available: 1,
    distance_km: 5.8,
    specialties: ['Multi-specialty', 'Critical Care', 'Gastroenterology', 'Renal Sciences'],
    rating: 4.7,
    operating_hours: '24/7',
  },
  {
    id: 5,
    name: 'Jehangir Hospital',
    address: '32 Sassoon Road',
    city: 'Pune',
    phone: '020-66053000',
    type: 'Private',
    emergency_available: 1,
    icu_available: 1,
    distance_km: 2.8,
    specialties: ['Cardiology', 'Oncology', 'Nephrology', 'Pulmonology'],
    rating: 4.5,
    operating_hours: '24/7',
  },
  {
    id: 6,
    name: 'Poona Hospital & Research Centre',
    address: '27 Sadashiv Peth',
    city: 'Pune',
    phone: '020-24331706',
    type: 'Private',
    emergency_available: 1,
    icu_available: 0,
    distance_km: 3.5,
    specialties: ['General Medicine', 'Dialysis', 'Endoscopy', 'Urology'],
    rating: 4.2,
    operating_hours: '24/7',
  },
  {
    id: 7,
    name: 'Inamdar Multispeciality Hospital',
    address: 'Fatima Nagar, Wanowrie',
    city: 'Pune',
    phone: '020-66812222',
    type: 'Specialty',
    emergency_available: 1,
    icu_available: 1,
    distance_km: 6.2,
    specialties: ['Orthopedics', 'Spine Surgery', 'Plastic Surgery', 'Bariatric'],
    rating: 4.4,
    operating_hours: '24/7',
  },
  {
    id: 8,
    name: 'Aga Khan Health Centre & Clinic',
    address: 'Pune Camp, MG Road',
    city: 'Pune',
    phone: '020-26122051',
    type: 'Clinic',
    emergency_available: 0,
    icu_available: 0,
    distance_km: 4.5,
    specialties: ['Primary Care', 'Family Medicine', 'Vaccinations', 'Pathology Lab'],
    rating: 4.1,
    operating_hours: '08:00 - 20:00',
  },
];

export const DEFAULT_PATIENTS: Patient[] = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    dob: '1979-03-15',
    gender: 'Male',
    phone: '9876543210',
    email: 'rajesh.sharma@example.com',
    blood_group: 'A+',
    address: 'Flat 402, Green Acres, Baner, Pune',
    emergency_contact_name: 'Sunita Sharma',
    emergency_contact_phone: '9876543219',
    allergies: 'Penicillin, Shellfish',
    notes: 'Hypertension controlled with medication. Regular monthly check-up.',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Priya Patel',
    dob: '1992-07-22',
    gender: 'Female',
    phone: '9988776655',
    email: 'priya.patel@example.com',
    blood_group: 'B+',
    address: 'B-12, Mayur Colony, Kothrud, Pune',
    emergency_contact_name: 'Kunal Patel',
    emergency_contact_phone: '9988776600',
    allergies: 'None recorded',
    notes: 'Consultation for recurring viral symptoms and vitamin deficiency.',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Amit Kumar',
    dob: '1996-11-08',
    gender: 'Male',
    phone: '8765432109',
    email: 'amit.kumar@example.com',
    blood_group: 'O-',
    address: 'Tower 4, Magarpatta City, Hadapsar, Pune',
    emergency_contact_name: 'Ramesh Kumar',
    emergency_contact_phone: '8765432199',
    allergies: 'Dust mites, Ibuprofen',
    notes: 'Rare O- blood donor. Asthmatic, carries inhaler.',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Sunita Devi',
    dob: '1969-05-30',
    gender: 'Female',
    phone: '9870123456',
    email: 'sunita.devi@example.com',
    blood_group: 'AB+',
    address: 'Plot 88, Model Colony, Shivajinagar, Pune',
    emergency_contact_name: 'Anil Devi',
    emergency_contact_phone: '9870123499',
    allergies: 'Sulfa drugs',
    notes: 'Type-2 Diabetes monitoring and HbA1c screening quarterly.',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Vikram Singh',
    dob: '1986-02-14',
    gender: 'Male',
    phone: '9123456780',
    email: 'vikram.singh@example.com',
    blood_group: 'A-',
    address: 'Row House 14, Datta Mandir Road, Wakad, Pune',
    emergency_contact_name: 'Neha Singh',
    emergency_contact_phone: '9123456799',
    allergies: 'Aspirin',
    notes: 'Post-arthroscopy recovery review for knee joint.',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

function getSampleAppointments(): Appointment[] {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return [
    {
      id: 1,
      patient_id: 1,
      patient_name: 'Rajesh Sharma',
      patient_phone: '9876543210',
      patient_blood_group: 'A+',
      doctor_name: 'Dr. Mehta',
      appointment_date: today,
      appointment_time: '10:00',
      reason: 'Routine BP & hypertension follow-up',
      status: 'Confirmed',
      notes: 'Check systolic history and renew prescriptions',
      follow_up_required: 1,
      follow_up_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      patient_id: 2,
      patient_name: 'Priya Patel',
      patient_phone: '9988776655',
      patient_blood_group: 'B+',
      doctor_name: 'Dr. Sharma',
      appointment_date: today,
      appointment_time: '11:30',
      reason: 'Persistent seasonal allergy and low grade fever',
      status: 'Scheduled',
      notes: 'CBC blood panel advised',
      follow_up_required: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 3,
      patient_id: 3,
      patient_name: 'Amit Kumar',
      patient_phone: '8765432109',
      patient_blood_group: 'O-',
      doctor_name: 'Dr. Kulkarni',
      appointment_date: today,
      appointment_time: '14:30',
      reason: 'Chest tightness check & spirometry review',
      status: 'Confirmed',
      notes: 'Bring current bronchodilator',
      follow_up_required: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 4,
      patient_id: 4,
      patient_name: 'Sunita Devi',
      patient_phone: '9870123456',
      patient_blood_group: 'AB+',
      doctor_name: 'Dr. Joshi',
      appointment_date: yesterday,
      appointment_time: '14:00',
      reason: 'Diabetic blood sugar evaluation',
      status: 'Completed',
      notes: 'Dietary guidance provided, fasting sugar stabilized',
      follow_up_required: 0,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 5,
      patient_id: 5,
      patient_name: 'Vikram Singh',
      patient_phone: '9123456780',
      patient_blood_group: 'A-',
      doctor_name: 'Dr. Mehta',
      appointment_date: tomorrow,
      appointment_time: '10:30',
      reason: 'Knee rehabilitation physical exam',
      status: 'Scheduled',
      notes: 'Physiotherapist notes reviewed',
      follow_up_required: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 6,
      patient_id: 1,
      patient_name: 'Rajesh Sharma',
      patient_phone: '9876543210',
      patient_blood_group: 'A+',
      doctor_name: 'Dr. Sharma',
      appointment_date: yesterday,
      appointment_time: '16:00',
      reason: 'Annual vision check request',
      status: 'Cancelled',
      notes: 'Rescheduled by patient due to office meeting',
      follow_up_required: 0,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}

export const DEFAULT_AMBULANCE: AmbulanceRequest[] = [
  {
    id: 1,
    requester_name: 'Kavita Deshmukh',
    requester_phone: '9822012345',
    patient_name: 'Anand Deshmukh',
    pickup_location: 'Survey 45, Near Balewadi High Street, Baner',
    destination: 'Ruby Hall Clinic Pune',
    urgency_level: 'Critical',
    status: 'En-Route',
    assigned_unit: 'Unit-04 (Advanced Life Support)',
    notes: 'Severe chest angina, patient conscious but breathless. Oxygen on board.',
    created_at: new Date(Date.now() - 18 * 60000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    requester_name: 'Suresh Patil',
    requester_phone: '9766543210',
    patient_name: 'Mangala Patil',
    pickup_location: 'Flat 101, Shivam Apts, Paud Road, Kothrud',
    destination: 'Sahyadri Hospital Deccan',
    urgency_level: 'High',
    status: 'Dispatched',
    assigned_unit: 'Unit-09 (Basic Life Support)',
    notes: 'Elderly patient fall, suspected hip fracture, immobilization required.',
    created_at: new Date(Date.now() - 35 * 60000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    requester_name: 'Dr. R. K. Gore',
    requester_phone: '9422001122',
    patient_name: 'Manoj Jadhav',
    pickup_location: 'Primary Health Center, Manchar',
    destination: 'KEM Hospital Pune',
    urgency_level: 'Critical',
    status: 'Pending',
    assigned_unit: '',
    notes: 'Inter-hospital transfer. Ventilator support needed.',
    created_at: new Date(Date.now() - 8 * 60000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    requester_name: 'Pooja Shinde',
    requester_phone: '9890123456',
    patient_name: 'Radhika Shinde',
    pickup_location: 'Viman Nagar, Lane 2',
    destination: 'Inlaks & Budhrani Hospital',
    urgency_level: 'Medium',
    status: 'Completed',
    assigned_unit: 'Unit-02',
    notes: 'High fever seizure, patient safely admitted to emergency ward.',
    created_at: new Date(Date.now() - 180 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 60 * 60000).toISOString(),
  },
];

export const DEFAULT_BLOOD_REQS: BloodRequirement[] = [
  {
    id: 1,
    blood_group: 'O-',
    quantity_units: 3,
    required_by: 'Amit Kumar',
    hospital_name: 'KEM Hospital Pune',
    location: 'Rasta Peth, Pune',
    contact_name: 'Dr. Salunkhe (Blood Bank In-Charge)',
    contact_phone: '020-26129561',
    urgency: 'Emergency',
    status: 'Active',
    notes: 'Emergency polytrauma surgical case in OT 2. Negative groups critically low.',
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: 2,
    blood_group: 'AB-',
    quantity_units: 2,
    required_by: 'Rohit Kulkarni',
    hospital_name: 'Ruby Hall Clinic',
    location: 'Sassoon Road, Pune',
    contact_name: 'Sister Mary (ICU Coordinator)',
    contact_phone: '9823055441',
    urgency: 'Urgent',
    status: 'Active',
    notes: 'Scheduled bypass graft scheduled tomorrow 8:00 AM.',
    created_at: new Date(Date.now() - 150 * 60000).toISOString(),
  },
  {
    id: 3,
    blood_group: 'B+',
    quantity_units: 1,
    required_by: 'Geeta Waghmare',
    hospital_name: 'Deenanath Mangeshkar Hospital',
    location: 'Erandwane, Pune',
    contact_name: 'Mahesh Waghmare',
    contact_phone: '9765432100',
    urgency: 'Normal',
    status: 'Fulfilled',
    notes: 'Donation fulfilled via Rotary Pune camp replacement donors.',
    created_at: new Date(Date.now() - 500 * 60000).toISOString(),
  },
];

export const DEFAULT_EMERGENCIES: EmergencyRequest[] = [
  {
    id: 1,
    type: 'Medical',
    patient_name: 'Sunil Rao',
    patient_phone: '9822446688',
    description: 'Acute severe chest pain radiating to left arm, cold sweats, history of CAD',
    location: 'Aundh Ravet BRTS corridor, near MediPoint Hospital',
    priority: 'Critical',
    status: 'Open',
    assigned_to: 'Dr. Kulkarni & Triage Team Alpha',
    resolution_notes: '',
    created_at: new Date(Date.now() - 12 * 60000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    type: 'Blood',
    patient_name: 'Emergency Ward Bed 7',
    patient_phone: '020-26129561',
    description: '3 units O- blood needed immediately for internal hemorrhage shock',
    location: 'KEM Hospital Trauma Center, Rasta Peth',
    priority: 'High',
    status: 'In-Progress',
    assigned_to: 'Blood Coordinator Deshmukh',
    resolution_notes: '2 donor volunteer units in transit from Ruby Hall Clinic',
    created_at: new Date(Date.now() - 50 * 60000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    type: 'Ambulance',
    patient_name: 'Manoj Jadhav',
    patient_phone: '9422001122',
    description: 'Cardiac arrest resuscitation underway at rural clinic, immediate cardiac ICU transfer requested',
    location: 'Primary Health Center, Manchar',
    priority: 'Critical',
    status: 'Open',
    assigned_to: 'Ambulance Central Dispatch',
    resolution_notes: '',
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    type: 'General',
    patient_name: 'Vandana Kale',
    patient_phone: '9822998877',
    description: 'Severe pediatric asthma flare, unresponsive to inhaler',
    location: 'Koregaon Park, Lane 5',
    priority: 'High',
    status: 'Resolved',
    assigned_to: 'Dr. Sharma',
    resolution_notes: 'Nebulization administered at clinic, oxygen saturation back to 98%',
    created_at: new Date(Date.now() - 240 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 120 * 60000).toISOString(),
  },
];

// Helper to get from storage or default
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('clinicos_data_updated'));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export class ClinicStore {
  // Initialization
  static init(): void {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
      setItem(STORAGE_KEYS.PATIENTS, DEFAULT_PATIENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      setItem(STORAGE_KEYS.APPOINTMENTS, getSampleAppointments());
    }
    if (!localStorage.getItem(STORAGE_KEYS.AMBULANCE)) {
      setItem(STORAGE_KEYS.AMBULANCE, DEFAULT_AMBULANCE);
    }
    if (!localStorage.getItem(STORAGE_KEYS.BLOOD_BANKS)) {
      setItem(STORAGE_KEYS.BLOOD_BANKS, DEFAULT_BLOOD_BANKS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.BLOOD_REQS)) {
      setItem(STORAGE_KEYS.BLOOD_REQS, DEFAULT_BLOOD_REQS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.HOSPITALS)) {
      setItem(STORAGE_KEYS.HOSPITALS, DEFAULT_HOSPITALS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EMERGENCIES)) {
      setItem(STORAGE_KEYS.EMERGENCIES, DEFAULT_EMERGENCIES);
    }
  }

  static resetToDemo(): void {
    if (typeof window === 'undefined') return;
    setItem(STORAGE_KEYS.PATIENTS, DEFAULT_PATIENTS);
    setItem(STORAGE_KEYS.APPOINTMENTS, getSampleAppointments());
    setItem(STORAGE_KEYS.AMBULANCE, DEFAULT_AMBULANCE);
    setItem(STORAGE_KEYS.BLOOD_BANKS, DEFAULT_BLOOD_BANKS);
    setItem(STORAGE_KEYS.BLOOD_REQS, DEFAULT_BLOOD_REQS);
    setItem(STORAGE_KEYS.HOSPITALS, DEFAULT_HOSPITALS);
    setItem(STORAGE_KEYS.EMERGENCIES, DEFAULT_EMERGENCIES);
  }

  // Patients
  static getPatients(): Patient[] {
    return getItem<Patient[]>(STORAGE_KEYS.PATIENTS, DEFAULT_PATIENTS);
  }

  static getPatientById(id: number): (Patient & { appointments: Appointment[] }) | null {
    const patients = this.getPatients();
    const patient = patients.find((p) => p.id === id);
    if (!patient) return null;
    const appointments = this.getAppointments().filter((a) => a.patient_id === id);
    return { ...patient, appointments };
  }

  static addPatient(data: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): Patient {
    const patients = this.getPatients();
    const newId = patients.length > 0 ? Math.max(...patients.map((p) => p.id)) + 1 : 1;
    const newPatient: Patient = {
      ...data,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setItem(STORAGE_KEYS.PATIENTS, [newPatient, ...patients]);
    return newPatient;
  }

  static updatePatient(id: number, data: Partial<Patient>): Patient | null {
    const patients = this.getPatients();
    const idx = patients.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const updated: Patient = {
      ...patients[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    patients[idx] = updated;
    setItem(STORAGE_KEYS.PATIENTS, patients);

    // Also update denormalized patient name/phone in appointments
    if (data.name || data.phone || data.blood_group) {
      const appointments = this.getAppointments().map((apt) => {
        if (apt.patient_id === id) {
          return {
            ...apt,
            patient_name: data.name ?? apt.patient_name,
            patient_phone: data.phone ?? apt.patient_phone,
            patient_blood_group: data.blood_group ?? apt.patient_blood_group,
          };
        }
        return apt;
      });
      setItem(STORAGE_KEYS.APPOINTMENTS, appointments);
    }

    return updated;
  }

  static deletePatient(id: number): boolean {
    const patients = this.getPatients().filter((p) => p.id !== id);
    setItem(STORAGE_KEYS.PATIENTS, patients);
    // Cascade delete appointments
    const appointments = this.getAppointments().filter((a) => a.patient_id !== id);
    setItem(STORAGE_KEYS.APPOINTMENTS, appointments);
    return true;
  }

  // Appointments
  static getAppointments(): Appointment[] {
    return getItem<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, getSampleAppointments());
  }

  static addAppointment(
    data: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'patient_name' | 'patient_phone' | 'patient_blood_group'>
  ): Appointment {
    const appointments = this.getAppointments();
    const patients = this.getPatients();
    const patient = patients.find((p) => p.id === Number(data.patient_id));

    const newId = appointments.length > 0 ? Math.max(...appointments.map((a) => a.id)) + 1 : 1;
    const newAppointment: Appointment = {
      ...data,
      patient_id: Number(data.patient_id),
      id: newId,
      patient_name: patient?.name || 'Unknown Patient',
      patient_phone: patient?.phone || '',
      patient_blood_group: patient?.blood_group || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setItem(STORAGE_KEYS.APPOINTMENTS, [newAppointment, ...appointments]);
    return newAppointment;
  }

  static updateAppointment(id: number, data: Partial<Appointment>): Appointment | null {
    const appointments = this.getAppointments();
    const idx = appointments.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    const updated: Appointment = {
      ...appointments[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    appointments[idx] = updated;
    setItem(STORAGE_KEYS.APPOINTMENTS, appointments);
    return updated;
  }

  static deleteAppointment(id: number): boolean {
    const appointments = this.getAppointments().filter((a) => a.id !== id);
    setItem(STORAGE_KEYS.APPOINTMENTS, appointments);
    return true;
  }

  // Ambulance
  static getAmbulanceRequests(): AmbulanceRequest[] {
    return getItem<AmbulanceRequest[]>(STORAGE_KEYS.AMBULANCE, DEFAULT_AMBULANCE);
  }

  static addAmbulanceRequest(
    data: Omit<AmbulanceRequest, 'id' | 'created_at' | 'updated_at'>
  ): AmbulanceRequest {
    const requests = this.getAmbulanceRequests();
    const newId = requests.length > 0 ? Math.max(...requests.map((r) => r.id)) + 1 : 1;
    const newReq: AmbulanceRequest = {
      ...data,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setItem(STORAGE_KEYS.AMBULANCE, [newReq, ...requests]);

    // If critical, automatically log into emergencies queue
    if (data.urgency_level === 'Critical') {
      this.addEmergency({
        type: 'Ambulance',
        patient_name: data.patient_name || data.requester_name,
        patient_phone: data.requester_phone,
        description: `Emergency ambulance dispatched to ${data.pickup_location}. Destination: ${
          data.destination || 'Nearest Emergency Center'
        }`,
        location: data.pickup_location,
        priority: 'Critical',
        status: 'Open',
        assigned_to: data.assigned_unit || 'Ambulance Unit Dispatch',
      });
    }

    return newReq;
  }

  static updateAmbulanceStatus(id: number, status: AmbulanceRequest['status'], assigned_unit?: string): void {
    const requests = this.getAmbulanceRequests();
    const idx = requests.findIndex((r) => r.id === id);
    if (idx !== -1) {
      requests[idx].status = status;
      if (assigned_unit !== undefined) requests[idx].assigned_unit = assigned_unit;
      requests[idx].updated_at = new Date().toISOString();
      setItem(STORAGE_KEYS.AMBULANCE, requests);
    }
  }

  // Blood Requirements & Banks
  static getBloodBanks(): BloodBank[] {
    return getItem<BloodBank[]>(STORAGE_KEYS.BLOOD_BANKS, DEFAULT_BLOOD_BANKS);
  }

  static getBloodRequirements(): BloodRequirement[] {
    return getItem<BloodRequirement[]>(STORAGE_KEYS.BLOOD_REQS, DEFAULT_BLOOD_REQS);
  }

  static addBloodRequirement(
    data: Omit<BloodRequirement, 'id' | 'created_at' | 'status'>
  ): BloodRequirement {
    const reqs = this.getBloodRequirements();
    const newId = reqs.length > 0 ? Math.max(...reqs.map((r) => r.id)) + 1 : 1;
    const newReq: BloodRequirement = {
      ...data,
      id: newId,
      status: 'Active',
      created_at: new Date().toISOString(),
    };
    setItem(STORAGE_KEYS.BLOOD_REQS, [newReq, ...reqs]);

    if (data.urgency === 'Emergency') {
      this.addEmergency({
        type: 'Blood',
        patient_name: data.required_by || data.contact_name,
        patient_phone: data.contact_phone,
        description: `URGENT: ${data.quantity_units} units of ${data.blood_group} blood required at ${
          data.hospital_name || data.location
        }`,
        location: data.location,
        priority: 'Critical',
        status: 'Open',
        assigned_to: 'Blood Bank Network',
      });
    }

    return newReq;
  }

  static updateBloodReqStatus(id: number, status: BloodRequirement['status']): void {
    const reqs = this.getBloodRequirements();
    const idx = reqs.findIndex((r) => r.id === id);
    if (idx !== -1) {
      reqs[idx].status = status;
      setItem(STORAGE_KEYS.BLOOD_REQS, reqs);
    }
  }

  // Hospitals
  static getHospitals(): Hospital[] {
    return getItem<Hospital[]>(STORAGE_KEYS.HOSPITALS, DEFAULT_HOSPITALS);
  }

  // Emergencies
  static getEmergencies(): EmergencyRequest[] {
    return getItem<EmergencyRequest[]>(STORAGE_KEYS.EMERGENCIES, DEFAULT_EMERGENCIES);
  }

  static addEmergency(
    data: Omit<EmergencyRequest, 'id' | 'created_at' | 'updated_at'>
  ): EmergencyRequest {
    const emergencies = this.getEmergencies();
    const newId = emergencies.length > 0 ? Math.max(...emergencies.map((e) => e.id)) + 1 : 1;
    const newEmerg: EmergencyRequest = {
      ...data,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setItem(STORAGE_KEYS.EMERGENCIES, [newEmerg, ...emergencies]);
    return newEmerg;
  }

  static updateEmergency(id: number, data: Partial<EmergencyRequest>): EmergencyRequest | null {
    const emergencies = this.getEmergencies();
    const idx = emergencies.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    const updated: EmergencyRequest = {
      ...emergencies[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    emergencies[idx] = updated;
    setItem(STORAGE_KEYS.EMERGENCIES, emergencies);
    return updated;
  }

  // Dashboard Stats Aggregator
  static getDashboardStats(): DashboardStats {
    const today = new Date().toISOString().split('T')[0];
    const patients = this.getPatients();
    const appointments = this.getAppointments();
    const emergencies = this.getEmergencies();
    const bloodReqs = this.getBloodRequirements();
    const ambulances = this.getAmbulanceRequests();
    const bloodBanks = this.getBloodBanks();
    const hospitals = this.getHospitals();

    // Start/End of current week
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(now.setDate(diff)).toISOString().split('T')[0];

    const todayAppointments = appointments.filter((a) => a.appointment_date === today).length;
    const activeEmergencies = emergencies.filter(
      (e) => e.status === 'Open' || e.status === 'In-Progress'
    ).length;
    const openBloodRequirements = bloodReqs.filter((b) => b.status === 'Active').length;
    const pendingAmbulance = ambulances.filter(
      (a) => a.status === 'Pending' || a.status === 'Dispatched' || a.status === 'En-Route'
    ).length;
    const completedThisWeek = appointments.filter(
      (a) => a.status === 'Completed' && a.appointment_date >= startOfWeek
    ).length;

    const upcomingAppointments = appointments
      .filter((a) => a.appointment_date === today && (a.status === 'Scheduled' || a.status === 'Confirmed'))
      .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time))
      .slice(0, 6);

    const recentEmergencies = emergencies
      .filter((e) => e.status === 'Open' || e.status === 'In-Progress')
      .sort((a, b) => {
        const pOrder: Record<string, number> = { Critical: 1, High: 2, Medium: 3, Low: 4 };
        return (pOrder[a.priority] || 5) - (pOrder[b.priority] || 5);
      })
      .slice(0, 5);

    return {
      totalPatients: patients.length,
      todayAppointments,
      activeEmergencies,
      openBloodRequirements,
      pendingAmbulance,
      completedThisWeek,
      totalBloodBanks: bloodBanks.length,
      totalHospitals: hospitals.length,
      upcomingAppointments,
      recentEmergencies,
    };
  }
}
