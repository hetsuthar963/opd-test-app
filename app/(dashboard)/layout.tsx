"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/patient", label: "Patients", icon: "person_add" },
  { href: "/appointments", label: "Appointments", icon: "calendar_month" },
  { href: "/consultations", label: "Consultations", icon: "clinical_notes" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-2xl">
              local_hospital
            </span>
            <span className="text-lg font-bold text-gray-800">ClinicFlow</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">ClinicFlow User</p>
            </div>
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">CF</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
