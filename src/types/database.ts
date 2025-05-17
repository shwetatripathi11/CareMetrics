export interface Doctor {
  id: string;
  doctor_code: string;
  full_name: string;
  email: string;
  specialty?: string;
  working_hospital?: string;
  created_at: string;
}

export interface Patient {
  id: string;
  patient_id: string;
  full_name: string;
  gender?: string;
  date_of_birth?: string;
  sa?: string;
  working_hospital?: string;
  created_at: string;
}

export interface Prescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  prescribing_institution: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  prescription_details?: {
    medications?: {
      name: string;
      dosage: string;
      frequency: string;
    }[];
    notes?: string;
  };
  created_at: string;
  updated_at: string;
  
  // Joined fields
  patient?: Patient;
  doctor?: Doctor;
} 