// src/app/(dashboard)/appointments/page.tsx
"use client";

import { useState, useCallback } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import AppointmentForm from "@/components/AppointmentForm";
import type { AppointmentRow } from "@/types";

const STATUS_STYLES: Record<string, string> = {
  SCHEDULED:   "bg-blue-50 text-blue-600 border-blue-100",
  IN_PROGRESS: "bg-amber-50 text-amber-600 border-amber-100",
  COMPLETED:   "bg-emerald-50 text-emerald-600 border-emerald-100",
  CANCELLED:   "bg-red-50 text-red-500 border-red-100",
};

function todayString() {
  return new Date().toISOString().split("T")[0];
}

function fmt12(time: string) {
  const [h, m] = time.split(":");
  const hr = parseInt(h, 10);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
}

export default function AppointmentsPage() {
  const [date, setDate] = useState(todayString());
  const [showForm, setShowForm] = useState(false);
  const { appointments, isLoading, mutate } = useAppointments(date);

  const handleSuccess = useCallback(() => {
    setShowForm(false);
    mutate();
  }, [mutate]);

  const cancelAppt = async (id: string) => {
    if (!confirm("Cancel this appointment?")) return;
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    mutate();
  };

  const isToday = date === todayString();

  return (
    <div className="min-h-screen bg-[#f0f4ff] font-['DM_Sans',sans-serif]">

      {/* ── Top bar ── */}
      <div className="border-b border-indigo-100 bg-white px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
            Appointments
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isToday ? "Today's schedule" : `Schedule for ${new Date(date + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`}
            {" — "}
            <span className="font-medium text-indigo-600">{appointments.length} booked</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date picker */}
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="bg-transparent text-sm text-indigo-700 font-medium focus:outline-none cursor-pointer"
            />
          </div>
          {!isToday && (
            <button
              onClick={() => setDate(todayString())}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2"
            >
              Back to today
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-indigo-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Book Appointment
          </button>
        </div>
      </div>

      <div className="px-8 py-6 max-w-6xl mx-auto">

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-indigo-50 p-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-indigo-50 shadow-sm py-20 text-center">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">No appointments {isToday ? "today" : "on this date"}</p>
            <p className="text-slate-400 text-sm mt-1">Click "Book Appointment" to add one</p>
          </div>

        ) : (
          <div className="space-y-3">
            {(appointments as AppointmentRow[]).map((appt) => (
              <div
                key={appt.id}
                className="bg-white rounded-xl border border-indigo-50/80 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all p-5"
              >
                <div className="flex items-start justify-between gap-4">

                  {/* Token + Time */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex flex-col items-center justify-center border border-indigo-100">
                      <span className="text-[10px] text-indigo-400 font-medium leading-none">#</span>
                      <span className="text-lg font-bold text-indigo-600 leading-none">{appt.tokenNumber}</span>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-800">{appt.patient.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">{appt.patient.patientCode}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 grid grid-cols-3 gap-3 min-w-0">
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Time</p>
                      <p className="text-sm font-medium text-slate-700">{fmt12(appt.appointmentTime)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Doctor</p>
                      <p className="text-sm font-medium text-slate-700 truncate">{appt.doctor.name}</p>
                      <p className="text-xs text-slate-400 truncate">{appt.doctor.specialization}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Reason</p>
                      <p className="text-sm text-slate-600 truncate">{appt.reason || "—"}</p>
                    </div>
                  </div>

                  {/* Status + actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-medium border px-2.5 py-1 rounded-full ${STATUS_STYLES[appt.status]}`}>
                      {appt.status.replace("_", " ")}
                    </span>

                    {appt.status === "SCHEDULED" && (
                      <button
                        onClick={() => cancelAppt(appt.id)}
                        className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-md transition-colors border border-transparent hover:border-red-100"
                      >
                        Cancel
                      </button>
                    )}

                    {appt.consultation?.isCompleted && (
                      <span className="text-xs text-emerald-500 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Consulted
                      </span>
                    )}
                  </div>
                </div>

                {/* Patient sub-info */}
                <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-4 text-xs text-slate-400">
                  <span>{appt.patient.age} yrs · {appt.patient.gender.toLowerCase()}</span>
                  <span className="font-mono">{appt.patient.phone}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Book Appointment Drawer ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="w-[460px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold text-slate-800">Book Appointment</h2>
                <p className="text-xs text-slate-400 mt-0.5">Schedule a patient with a doctor</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <AppointmentForm
                defaultDate={date}
                onSuccess={handleSuccess}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}