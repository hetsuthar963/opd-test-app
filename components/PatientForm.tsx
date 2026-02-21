// src/components/patients/PatientForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientSchema, type PatientInput } from "@/lib/validators";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PatientForm({ onSuccess, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PatientInput>({
    resolver: zodResolver(patientSchema),
  });

  const gender = watch("gender");

  async function onSubmit(values: PatientInput) {
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Something went wrong.");
        return;
      }
      reset();
      onSuccess();
    } catch {
      setServerError("Network error. Please try again.");
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

      {/* Name */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-stone-700">
          Full Name <span className="text-red-400">*</span>
        </label>
        <input
          {...register("name")}
          placeholder="e.g. Ramesh Kumar"
          className={`w-full px-3.5 py-2.5 text-sm border rounded-lg text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all
            ${errors.name ? "border-red-300 bg-red-50/30" : "border-stone-200 bg-white"}`}
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Gender */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-stone-700">
          Gender <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["MALE", "FEMALE", "OTHER"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setValue("gender", g, { shouldValidate: true })}
              className={`py-2.5 text-sm font-medium rounded-lg border transition-all
                ${gender === g
                  ? "border-teal-500 bg-teal-50 text-teal-700"
                  : "border-stone-200 text-stone-500 hover:border-stone-300 hover:bg-stone-50"}`}
            >
              {g.charAt(0) + g.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        {errors.gender && (
          <p className="text-xs text-red-500">{errors.gender.message}</p>
        )}
      </div>

      {/* Age + Phone row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-stone-700">
            Age <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            min={1}
            max={150}
            {...register("age", { valueAsNumber: true })}
            placeholder="28"
            className={`w-full px-3.5 py-2.5 text-sm border rounded-lg text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all
              ${errors.age ? "border-red-300 bg-red-50/30" : "border-stone-200 bg-white"}`}
          />
          {errors.age && (
            <p className="text-xs text-red-500">{errors.age.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-stone-700">
            Mobile <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            maxLength={10}
            {...register("phone")}
            placeholder="9876543210"
            className={`w-full px-3.5 py-2.5 text-sm border rounded-lg text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all
              ${errors.phone ? "border-red-300 bg-red-50/30" : "border-stone-200 bg-white"}`}
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Address — optional */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-stone-700">
          Address <span className="text-stone-400 font-normal text-xs">(optional)</span>
        </label>
        <input
          {...register("address")}
          placeholder="Street, City"
          className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-lg text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 bg-white transition-all"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 text-sm font-medium border border-stone-200 rounded-lg text-stone-500 hover:bg-stone-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Saving…
            </>
          ) : "Register Patient"}
        </button>
      </div>
    </form>
  );
}