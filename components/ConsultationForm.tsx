// src/components/consultations/ConsultationForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { consultationSchema, type ConsultationInput } from "@/lib/validators";
import type { AppointmentRow } from "@/types";

interface Props {
  appointment: AppointmentRow;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ConsultationForm({ appointment, onSuccess, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsultationInput>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      appointmentId: appointment.id,
      patientId: appointment.patient.id,
      doctorId: appointment.doctor.id,
    },
  });

  async function onSubmit(values: ConsultationInput) {
    setLoading(true);
    setServerError("");
    try {
      // Clean empty strings to undefined
      const payload = {
        ...values,
        bloodPressure: values.bloodPressure?.trim() || undefined,
        temperature: values.temperature || undefined,
        notes: values.notes?.trim() || undefined,
      };

      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Failed to save consultation.");
        return;
      }
      onSuccess();
    } catch {
      setServerError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {serverError && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      {/* Vitals section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-emerald-500 rounded-full" />
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Vitals</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">

          {/* Blood Pressure */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Blood Pressure
              </span>
            </label>
            <div className="relative">
              <input
                {...register("bloodPressure")}
                placeholder="120/80"
                maxLength={7}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg font-mono text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all
                  ${errors.bloodPressure ? "border-red-300 bg-red-50/30" : "border-slate-200 bg-white"}`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">mmHg</span>
            </div>
            {errors.bloodPressure && (
              <p className="text-xs text-red-500">{errors.bloodPressure.message}</p>
            )}
          </div>

          {/* Temperature */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                Temperature
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min={90}
                max={110}
                {...register("temperature", { valueAsNumber: true })}
                placeholder="98.6"
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg font-mono text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all
                  ${errors.temperature ? "border-red-300 bg-red-50/30" : "border-slate-200 bg-white"}`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">°F</span>
            </div>
            {errors.temperature && (
              <p className="text-xs text-red-500">{errors.temperature.message}</p>
            )}
          </div>
        </div>

        {/* Normal ranges hint */}
        <div className="mt-3 flex gap-4 text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
          <span>Normal BP: <span className="font-mono text-slate-500">90-120 / 60-80</span></span>
          <span>Normal Temp: <span className="font-mono text-slate-500">97–99°F</span></span>
        </div>
      </div>

      {/* Notes section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-emerald-500 rounded-full" />
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Clinical Notes</h3>
        </div>

        <textarea
          {...register("notes")}
          rows={6}
          placeholder={`Symptoms observed...\nDiagnosis...\nPrescription / treatment plan...\nFollow-up instructions...`}
          className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white resize-none leading-relaxed transition-all"
        />
        {errors.notes && (
          <p className="text-xs text-red-500 mt-1">{errors.notes.message}</p>
        )}
      </div>

      {/* Tip */}
      <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3">
        <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-emerald-700">
          After saving, you can <strong>Mark Complete</strong> from the history tab once the consultation is finished.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
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
          className="flex-1 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm shadow-emerald-200"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Saving…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Consultation
            </>
          )}
        </button>
      </div>
    </form>
  );
}