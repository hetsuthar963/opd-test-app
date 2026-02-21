// src/app/(dashboard)/patients/page.tsx
"use client";

import { useState, useCallback } from "react";
import { usePatients } from "@/hooks/usePatients";
import PatientForm from "@/components/PatientForm";
import type { PatientRow } from "@/types";

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const { patients, pagination, isLoading, mutate } = usePatients(search, page);

  const handleSuccess = useCallback(() => {
    setShowForm(false);
    mutate();
  }, [mutate]);

  return (
    <div className="min-h-screen bg-[#f5f3ef] font-['DM_Sans',sans-serif]">

      {/* ── Top bar ── */}
      <div className="border-b border-stone-200 bg-white px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-stone-800 tracking-tight">Patient Registry</h1>
          <p className="text-xs text-stone-400 mt-0.5">
            {pagination?.total ?? 0} patients registered
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Register Patient
        </button>
      </div>

      <div className="px-8 py-6 max-w-6xl mx-auto space-y-5">

        {/* ── Search ── */}
        <div className="relative max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or phone..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-stone-200 rounded-lg text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
          />
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/60">
                {["Code", "Patient Name", "Gender", "Age", "Mobile", "Registered On"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-stone-50">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-stone-100 rounded animate-pulse" style={{ width: `${60 + j * 10}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-stone-400">
                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">No patients found</p>
                    {search && <p className="text-xs mt-1">Try a different search term</p>}
                  </td>
                </tr>
              ) : (
                (patients as PatientRow[]).map((p, idx) => (
                  <tr
                    key={p.id}
                    className={`border-b border-stone-50 hover:bg-teal-50/40 transition-colors ${idx % 2 === 0 ? "" : "bg-stone-50/30"}`}
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs font-medium text-teal-700 bg-teal-50 border border-teal-100 px-2 py-1 rounded-md">
                        {p.patientCode}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-stone-800">{p.name}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border
                        ${p.gender === "MALE" ? "bg-sky-50 text-sky-600 border-sky-100" :
                          p.gender === "FEMALE" ? "bg-rose-50 text-rose-600 border-rose-100" :
                          "bg-stone-100 text-stone-500 border-stone-200"}`}>
                        {p.gender.charAt(0) + p.gender.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-stone-600 text-sm">{p.age} yrs</td>
                    <td className="px-5 py-3.5 text-stone-600 text-sm font-mono">{p.phone}</td>
                    <td className="px-5 py-3.5 text-stone-400 text-sm">
                      {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-stone-100 bg-stone-50/50">
              <span className="text-xs text-stone-400">
                {pagination.total} results · Page {pagination.page} of {pagination.pages}
              </span>
              <div className="flex gap-1.5">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 text-xs border border-stone-200 rounded-md text-stone-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={page === pagination.pages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 text-xs border border-stone-200 rounded-md text-stone-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Register Patient Drawer ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />
          {/* Panel */}
          <div className="w-[420px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
              <div>
                <h2 className="text-base font-semibold text-stone-800">Register New Patient</h2>
                <p className="text-xs text-stone-400 mt-0.5">Fill in the patient details below</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <PatientForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}