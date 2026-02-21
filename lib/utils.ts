// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(time: string): string {
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${display}:${m} ${ampm}`;
}

export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

/** Generates a patient code like PAT-240001 */
export function generatePatientCode(count: number): string {
  const year = new Date().getFullYear().toString().slice(-2);
  return `PAT-${year}${String(count).padStart(4, "0")}`;
}

/** Generate token number for a doctor on a given date */
export async function getNextTokenNumber(
  prisma: import("@prisma/client").PrismaClient,
  doctorId: string,
  date: string
): Promise<number> {
  const count = await prisma.appointment.count({
    where: {
      doctorId,
      appointmentDate: new Date(date),
    },
  });
  return count + 1;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    SCHEDULED: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    IN_PROGRESS: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    COMPLETED: "bg-green-500/15 text-green-400 border-green-500/30",
    CANCELLED: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return map[status] || "bg-gray-500/15 text-gray-400";
}