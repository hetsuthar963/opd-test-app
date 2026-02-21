// src/app/(dashboard)/consultations/page.tsx
"use client";

import { useState, useCallback } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import { useConsultations } from "@/hooks/useConsultations";
import ConsultationForm from "@/components/ConsultationForm";
import type { AppointmentRow, ConsultationRow } from "@/types";

function todayString() {
  return new Date().toISOString().split("T")[0];
}

function fmt12(t: string) {
  const [h, m] = t.split(":");
  const hr = parseInt(h, 10);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
}

export default function ConsultationsPage() {
  // Skip auth for now - all users can access
  const isDoctor = true;

  const [tab, setTab] = useState<"pending" | "history">("pending");
  const [activeAppt, setActiveAppt] = useState<AppointmentRow | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);

  const { appointments, isLoading: apptLoading, mutate: mutateAppts } = useAppointments(todayString());
  const { consultations, isLoading: consultLoading, mutate: mutateConsults } = useConsultations();

  // Only appointments that can be consulted (no consult yet, not cancelled)
  const pending = (appointments as AppointmentRow[]).filter(
    a => !a.consultation && a.status !== "CANCELLED"
  );

  const handleConsultSuccess = useCallback(() => {
    setActiveAppt(null);
    mutateAppts();
    mutateConsults();
  }, [mutateAppts, mutateConsults]);

  const markComplete = async (id: string) => {
    setCompleting(id);
    await fetch(`/api/consultations/${id}`, { method: "PATCH" });
    mutateAppts();
    mutateConsults();
    setCompleting(null);
  };

  return (
    <div className="min-h-screen bg-[#f0fdf8] font-['DM_Sans',sans-serif]">

      {/* ── Top bar ── */}
      <div className="border-b border-emerald-100 bg-white px-8 py-4">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Consultations</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Vitals, clinical notes & consultation records
        </p>
      </div>

      {/* ── Tabs ── */}
      <div className="px-8 pt-5">
        <div className="inline-flex bg-white border border-emerald-100 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setTab("pending")}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              tab === "pending"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Pending Today
            {pending.length > 0 && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-bold ${
                tab === "pending" ? "bg-white/25 text-white" : "bg-emerald-100 text-emerald-600"
              }`}>
                {pending.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("history")}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              tab === "history"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Consultation History
          </button>
        </div>
      </div>

      <div className="px-8 py-5 max-w-5xl mx-auto">

        {/* ──────────────────── PENDING TAB ──────────────────── */}
        {tab === "pending" && (
          <>
            {apptLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-emerald-50 p-5 animate-pulse h-24" />
                ))}
              </div>
            ) : pending.length === 0 ? (
              <div className="bg-white rounded-2xl border border-emerald-50 shadow-sm py-20 text-center">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-600 font-medium">All caught up!</p>
                <p className="text-slate-400 text-sm mt-1">No pending consultations for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pending.map(appt => (
                  <div
                    key={appt.id}
                    className="bg-white rounded-xl border border-emerald-50 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Token */}
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex flex-col items-center justify-center border border-emerald-100 flex-shrink-0">
                          <span className="text-[9px] text-emerald-400 font-medium">TOKEN</span>
                          <span className="text-lg font-bold text-emerald-600 leading-none">{appt.tokenNumber}</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2.5 mb-0.5">
                            <p className="text-base font-semibold text-slate-800">{appt.patient.name}</p>
                            <span className="font-mono text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                              {appt.patient.patientCode}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span>{appt.patient.age} yrs · {appt.patient.gender.toLowerCase()}</span>
                            <span className="font-mono">{appt.patient.phone}</span>
                            <span>·</span>
                            <span>{fmt12(appt.appointmentTime)}</span>
                            <span>·</span>
                            <span>{appt.doctor.name}</span>
                          </div>
                          {appt.reason && (
                            <p className="text-xs text-slate-500 mt-1 italic">"{appt.reason}"</p>
                          )}
                        </div>
                      </div>

                      {isDoctor ? (
                        <button
                          onClick={() => setActiveAppt(appt)}
                          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-emerald-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Start Consultation
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
                          Doctor access only
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ──────────────────── HISTORY TAB ──────────────────── */}
        {tab === "history" && (
          <>
            {consultLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-emerald-50 p-5 animate-pulse h-32" />
                ))}
              </div>
            ) : consultations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-emerald-50 shadow-sm py-20 text-center">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-slate-600 font-medium">No consultation records yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(consultations as ConsultationRow[]).map(c => (
                  <div key={c.id} className="bg-white rounded-xl border border-emerald-50 shadow-sm p-5">

                    {/* Header row */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2.5 mb-1">
                          <p className="font-semibold text-slate-800">{c.patient.name}</p>
                          <span className="font-mono text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                            {c.patient.patientCode}
                          </span>
                          <span className={`text-xs font-medium border px-2 py-0.5 rounded-full ${
                            c.isCompleted
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-amber-50 text-amber-600 border-amber-100"
                          }`}>
                            {c.isCompleted ? "✓ Completed" : "In Progress"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Dr. {c.doctor.name} · {c.doctor.specialization}
                          {" · "}
                          {new Date(c.appointment.appointmentDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          {" at "}
                          {fmt12(c.appointment.appointmentTime)}
                        </p>
                        {c.appointment.reason && (
                          <p className="text-xs text-slate-400 mt-0.5 italic">Chief complaint: {c.appointment.reason}</p>
                        )}
                      </div>

                      {!c.isCompleted && isDoctor && (
                        <button
                          onClick={() => markComplete(c.id)}
                          disabled={completing === c.id}
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors disabled:opacity-60"
                        >
                          {completing === c.id ? (
                            <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          Mark Complete
                        </button>
                      )}
                    </div>

                    {/* Vitals */}
                    <div className="flex gap-3 mb-4">
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                        c.bloodPressure
                          ? "bg-red-50 border-red-100 text-red-700"
                          : "bg-slate-50 border-slate-100 text-slate-400"
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="font-medium">BP:</span>
                        <span className="font-mono">{c.bloodPressure || "—"}</span>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                        c.temperature
                          ? "bg-orange-50 border-orange-100 text-orange-700"
                          : "bg-slate-50 border-slate-100 text-slate-400"
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        <span className="font-medium">Temp:</span>
                        <span className="font-mono">{c.temperature ? `${c.temperature}°F` : "—"}</span>
                      </div>
                    </div>

                    {/* Notes */}
                    {c.notes ? (
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-3.5">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Clinical Notes</p>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{c.notes}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No clinical notes recorded.</p>
                    )}

                    {c.completedAt && (
                      <p className="text-xs text-emerald-500 mt-3">
                        Completed on {new Date(c.completedAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Consultation Form Drawer ── */}
      {activeAppt && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => setActiveAppt(null)} />
          <div className="w-[460px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold text-slate-800">
                  Consultation — {activeAppt.patient.name}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Token #{activeAppt.tokenNumber} · {activeAppt.doctor.name}
                </p>
              </div>
              <button
                onClick={() => setActiveAppt(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Patient summary strip */}
            <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-100">
              <div className="flex gap-4 text-xs text-emerald-700">
                <span className="font-mono font-semibold">{activeAppt.patient.patientCode}</span>
                <span>{activeAppt.patient.age} yrs · {activeAppt.patient.gender.toLowerCase()}</span>
                <span className="font-mono">{activeAppt.patient.phone}</span>
              </div>
              {activeAppt.reason && (
                <p className="text-xs text-emerald-600 mt-0.5 italic">Chief complaint: {activeAppt.reason}</p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <ConsultationForm
                appointment={activeAppt}
                onSuccess={handleConsultSuccess}
                onCancel={() => setActiveAppt(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}