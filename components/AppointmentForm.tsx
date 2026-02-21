// src/components/appointments/AppointmentForm.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema, type AppointmentInput } from "@/lib/validators";
import type { PatientRow } from "@/types";

interface DoctorOption {
  id: string;
  name: string;
  specialization: string;
}

const TIME_SLOTS = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "14:00","14:30","15:00","15:30","16:00","16:30","17:00",
];

function fmt12(t: string) {
  const [h, m] = t.split(":");
  const hr = parseInt(h, 10);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
}

function todayString() {
  return new Date().toISOString().split("T")[0];
}

interface Props {
  defaultDate?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AppointmentForm({ defaultDate, onSuccess, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientRow | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { appointmentDate: defaultDate ?? todayString() },
  });

  const selectedTime = watch("appointmentTime");
  const selectedDoctorId = watch("doctorId");

  // Load doctors on mount
  useEffect(() => {
    fetch("/api/doctors?available=true")
      .then(r => r.json())
      .then(j => setDoctors(j.data ?? []));
  }, []);

  // Debounced patient search
  useEffect(() => {
    if (!patientSearch.trim()) { setPatients([]); setShowDropdown(false); return; }
    setSearchLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/patients?search=${encodeURIComponent(patientSearch)}&limit=8`);
      const json = await res.json();
      setPatients(json.patients ?? []);
      setShowDropdown(true);
      setSearchLoading(false);
    }, 300);
  }, [patientSearch]);

  function selectPatient(p: PatientRow) {
    setSelectedPatient(p);
    setValue("patientId", p.id, { shouldValidate: true });
    setPatientSearch(p.name);
    setShowDropdown(false);
  }

  async function onSubmit(values: AppointmentInput) {
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) { setServerError(json.error ?? "Failed to book."); return; }
      reset();
      setSelectedPatient(null);
      setPatientSearch("");
      onSuccess();
    } catch {
      setServerError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {serverError && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      {/* Patient search */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          Patient <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              value={patientSearch}
              onChange={e => {
                setPatientSearch(e.target.value);
                if (selectedPatient) { setSelectedPatient(null); setValue("patientId", ""); }
              }}
              placeholder="Search by name or phone..."
              className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all
                ${errors.patientId ? "border-red-300 bg-red-50/30" : "border-slate-200 bg-white"}`}
            />
            {searchLoading && (
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && patients.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
              {patients.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => selectPatient(p)}
                  className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors border-b border-slate-50 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{p.phone} · {p.age}y · {p.gender.toLowerCase()}</p>
                    </div>
                    <span className="font-mono text-xs text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {p.patientCode}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected patient pill */}
        {selectedPatient && (
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2 mt-2">
            <div className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-indigo-700">{selectedPatient.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-indigo-800 truncate">{selectedPatient.name}</p>
              <p className="text-xs text-indigo-400">{selectedPatient.patientCode}</p>
            </div>
            <button
              type="button"
              onClick={() => { setSelectedPatient(null); setPatientSearch(""); setValue("patientId", ""); }}
              className="text-indigo-400 hover:text-indigo-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {errors.patientId && <p className="text-xs text-red-500">{errors.patientId.message}</p>}
      </div>

      {/* Doctor */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          Doctor <span className="text-red-400">*</span>
        </label>
        <div className="space-y-2">
          {doctors.map(d => (
            <button
              key={d.id}
              type="button"
              onClick={() => setValue("doctorId", d.id, { shouldValidate: true })}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all
                ${selectedDoctorId === d.id
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800">{d.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{d.specialization}</p>
                </div>
                {selectedDoctorId === d.id && (
                  <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
        {errors.doctorId && <p className="text-xs text-red-500">{errors.doctorId.message}</p>}
      </div>

      {/* Date */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          Date <span className="text-red-400">*</span>
        </label>
        <input
          type="date"
          {...register("appointmentDate")}
          min={todayString()}
          className={`w-full px-3.5 py-2.5 text-sm border rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all
            ${errors.appointmentDate ? "border-red-300 bg-red-50/30" : "border-slate-200 bg-white"}`}
        />
        {errors.appointmentDate && <p className="text-xs text-red-500">{errors.appointmentDate.message}</p>}
      </div>

      {/* Time slots */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          Time Slot <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setValue("appointmentTime", t, { shouldValidate: true })}
              className={`py-2 text-xs font-medium rounded-lg border transition-all
                ${selectedTime === t
                  ? "border-indigo-500 bg-indigo-600 text-white"
                  : "border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50"}`}
            >
              {fmt12(t)}
            </button>
          ))}
        </div>
        {errors.appointmentTime && <p className="text-xs text-red-500">{errors.appointmentTime.message}</p>}
      </div>

      {/* Reason */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          Reason <span className="text-slate-400 font-normal text-xs">(optional)</span>
        </label>
        <input
          {...register("reason")}
          placeholder="Chief complaint or visit reason"
          className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-white transition-all"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 text-sm font-medium border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Booking…
            </>
          ) : "Book Appointment"}
        </button>
      </div>
    </form>
  );
}