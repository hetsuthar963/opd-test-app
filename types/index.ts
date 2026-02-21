// Patient types
export interface PatientRow {
  id: string;
  patientCode: string;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  age: number;
  phone: string;
  address?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientInput {
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  age: number;
  phone: string;
  address?: string;
}

// Appointment types
export interface AppointmentRow {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: Date;
  appointmentTime: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  tokenNumber: number;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
  patient: PatientRow;
  doctor: {
    id: string;
    name: string;
    specialization: string;
  };
  consultation?: {
    id: string;
    isCompleted: boolean;
  };
}

export interface AppointmentInput {
  patientId: string;
  doctorId: string;
  appointmentDate: Date;
  appointmentTime: string;
  reason?: string;
}

// Doctor types
export interface DoctorRow {
  id: string;
  userId: string;
  name: string;
  specialization: string;
  registrationNo: string;
  isAvailable: boolean;
  createdAt: Date;
}

// Consultation types
export interface ConsultationRow {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  bloodPressure?: string;
  temperature?: number;
  notes?: string;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  patient: PatientRow;
  doctor: {
    id: string;
    name: string;
    specialization: string;
  };
  appointment: {
    id: string;
    appointmentDate: Date;
    appointmentTime: string;
    reason?: string;
  };
}

export interface ConsultationInput {
  bloodPressure?: string;
  temperature?: number;
  notes?: string;
}

// Pagination types
export interface PaginationInfo {
  total: number;
  page: number;
  pages: number;
  limit: number;
}
