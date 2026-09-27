export interface Patient {
  id: number;
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email?: string;
  blood_group: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  allergies?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-Show';
  notes?: string;
  follow_up_required: number;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  patient_name?: string;
  patient_phone?: string;
  patient_blood_group?: string;
}

export interface AmbulanceRequest {
  id: number;
  requester_name: string;
  requester_phone: string;
  patient_name?: string;
  pickup_location: string;
  destination?: string;
  urgency_level: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Dispatched' | 'En-Route' | 'Arrived' | 'Completed' | 'Cancelled';
  notes?: string;
  assigned_unit?: string;
  created_at: string;
  updated_at: string;
}

export interface BloodRequirement {
  id: number;
  blood_group: string;
  quantity_units: number;
  required_by?: string;
  hospital_name?: string;
  location: string;
  contact_name: string;
  contact_phone: string;
  urgency: 'Emergency' | 'Urgent' | 'Normal';
  status: 'Active' | 'Fulfilled' | 'Expired';
  notes?: string;
  created_at: string;
}

export interface BloodBank {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  operating_hours: string;
  available_groups: string[];
  emergency_service: number;
}

export interface Hospital {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  type: 'Government' | 'Private' | 'Clinic' | 'Specialty';
  emergency_available: number;
  icu_available: number;
  distance_km: number;
  specialties: string[];
  rating: number;
  operating_hours: string;
}

export interface EmergencyRequest {
  id: number;
  type: 'Medical' | 'Ambulance' | 'Blood' | 'General';
  patient_name?: string;
  patient_phone?: string;
  description: string;
  location: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In-Progress' | 'Resolved' | 'Closed';
  assigned_to?: string;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  activeEmergencies: number;
  openBloodRequirements: number;
  pendingAmbulance: number;
  completedThisWeek: number;
  totalBloodBanks: number;
  totalHospitals: number;
  upcomingAppointments: Appointment[];
  recentEmergencies: EmergencyRequest[];
}
