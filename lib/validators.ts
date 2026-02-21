// src/lib/validators.ts
import { z } from "zod";

// ── Patient ──────────────────────────────────────────────────────────────────
export const patientSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100)
    .trim(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  age: z
    .number()
    .int()
    .min(0, "Age must be positive")
    .max(150),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter valid 10-digit Indian mobile number"),
  address: z.string().max(500).optional(),
});

export type PatientInput = z.infer<typeof patientSchema>;

// ── Appointment ───────────────────────────────────────────────────────────────
export const appointmentSchema = z.object({
  patientId: z.string().cuid("Invalid patient"),
  doctorId: z.string().cuid("Invalid doctor"),
  appointmentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  appointmentTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Time must be HH:MM"),
  reason: z.string().max(500).optional(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;

// ── Appointment status update ─────────────────────────────────────────────────
export const appointmentStatusSchema = z.object({
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});

// ── Consultation ──────────────────────────────────────────────────────────────
export const consultationSchema = z.object({
  appointmentId: z.string().cuid("Invalid appointment"),
  patientId: z.string().cuid("Invalid patient"),
  doctorId: z.string().cuid("Invalid doctor"),
  bloodPressure: z
    .string()
    .regex(/^\d{2,3}\/\d{2,3}$/, "Format: 120/80")
    .optional()
    .or(z.literal("")),
  temperature: z.number().min(90).max(110).optional(),
  notes: z.string().max(2000).optional(),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;

// ── Consultation update ───────────────────────────────────────────────────────
export const consultationUpdateSchema = z.object({
  bloodPressure: z
    .string()
    .regex(/^\d{2,3}\/\d{2,3}$/, "Format: 120/80")
    .optional()
    .or(z.literal("")),
  temperature: z.number().min(90).max(110).optional(),
  notes: z.string().max(2000).optional(),
  isCompleted: z.boolean().optional(),
});
