"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      {/* Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e7edf3] bg-[#ffffff]/90 backdrop-blur-md px-10 py-3">
        <div className="flex items-center gap-4">
          <button onClick={() => navigateTo("/")} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center text-[#137fec]">
              <span className="material-symbols-outlined text-3xl">local_hospital</span>
            </div>
            <h2 className="text-[#0d141b] text-lg font-bold leading-tight">ClinicFlow</h2>
          </button>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="hidden md:flex items-center gap-9">
            <a className="text-[#0d141b] hover:text-[#137fec] transition-colors text-sm font-medium" href="#features">Features</a>
            <a className="text-[#0d141b] hover:text-[#137fec] transition-colors text-sm font-medium" href="#pricing">Pricing</a>
            <a className="text-[#0d141b] hover:text-[#137fec] transition-colors text-sm font-medium" href="#contact">Contact</a>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => navigateTo("/patient")}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f6f7f8] hover:bg-slate-200 text-[#0d141b] text-sm font-bold transition-all"
            >
              <span className="truncate">Log In</span>
            </button>
            <button 
              onClick={() => navigateTo("/patient")}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#137fec] hover:bg-[#0e5cb0] text-white text-sm font-bold transition-all shadow-lg shadow-[#137fec]/20"
            >
              <span className="truncate">Get Started</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full">
        {/* Hero Section */}
        <div className="w-full max-w-7xl px-4 sm:px-10 py-12 md:py-20">
          <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div className="flex flex-col gap-8 flex-1 items-center lg:items-start text-center lg:text-left">
              <div className="flex flex-col gap-4">
                <h1 className="text-[#0d141b] text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1]">
                  Manage Your Clinic <br className="hidden lg:block"/> with <span className="text-[#137fec]">Ease</span>
                </h1>
                <h2 className="text-[#4c739a] text-lg md:text-xl font-normal leading-relaxed max-w-2xl">
                  Streamline patient registration, master your appointment schedule, and capture consultation details—all in one secure platform designed for modern healthcare.
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => navigateTo("/patient")}
                  className="flex items-center justify-center h-12 px-8 bg-[#137fec] hover:bg-[#0e5cb0] text-white text-base font-bold rounded-lg transition-all shadow-lg shadow-[#137fec]/30 w-full sm:w-auto"
                >
                  <span>Get Started Free</span>
                  <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
                </button>
                <button 
                  onClick={() => navigateTo("/appointments")}
                  className="flex items-center justify-center h-12 px-8 bg-white border border-[#e7edf3] hover:border-[#137fec] text-[#0d141b] text-base font-bold rounded-lg transition-all w-full sm:w-auto"
                >
                  <span>View Demo</span>
                  <span className="material-symbols-outlined ml-2 text-sm">play_circle</span>
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-[#4c739a] font-medium">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAabEx6hAQCc4joISzFiVcExf7TyzsM9tEgAXNOgJg_FRacq8nrA3y0-zMsgZf7YEZMAJuVYVR1aUlpVOwwPGphQ7jEyhS58r0DOP5yuOMau7L_2TdIGZlhmQWwPBqu9TtfzCcUsQaEeYI-TAkdvTxTg7CKsKdhY7H5Dh40V3LlikgiO3GH9pQ46B5FGz2fUMW-sb15GmYqycrkOSzmjKzNu-i_GLHY-U3ushOOIHShojcDWmgnjFPr8kQzt0AsAlLuob6DEwdQn8TF')"}}></div>
                  <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC3vaZmwSCXfdXVYNYwuSWZrBZsR4gyWFzO4yuXB_ywTbIOjbPrfvCSllroeEje52VS6IjH87DcJsEvuu1N8_77MNWESz_1CVTGxyNT75WMMlyHkJivrDRSDOyotSYUOOW8cb8GG3UXOh-bqMpODXZncnRpqEsNB9-HJwhh1wh_jvw40bZZ8nuhsRqOzt9d7UkLfqUPvcVPCaskPuy5aKBSaMhNhKwY6NW3pzhv9MaUqRno1SAMGg0UwRYdZxdHxr6iK-M1ptEqXNrW')"}}></div>
                  <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAohEn6T_jSrvt86wv4JnIKSnp_NU2Yxc1YdwmDc1xcYM_HPRqIXNo2ZwjRnXju7WhJs2Gps2ujiknHg5x0rnbPi3TekLkKMCwPiUCj4wft_s8cRQ4--njGPZD_NuYdeA4Y1Y0ZTIcmUTJqtLezQNOKP-xb6ooEmt0jFWWW1tgMKARtId7IzCzQ6p8EBMUBwCXqQCqVdAHYrmkdCFxCh5RW2L862Z05ZF6_TPzk_eh4VvsfsUYF_fSkyWZZUrLVTB3aptcZw4kk8Egl')"}}></div>
                </div>
                <p>Trusted by 500+ clinics</p>
              </div>
            </div>

            {/* Hero Image */}
            <div className="flex-1 w-full max-w-[600px] lg:max-w-none relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#137fec] to-blue-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative w-full aspect-[4/3] bg-white rounded-xl overflow-hidden shadow-2xl border border-[#e7edf3]">
                <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAapXUL3AMvcrail-gGbepPn0mpbrdIrvH1IKzjOJjt6IrEtYCdf8cfQ-rH0t-6WpiP9xBMe5d292CZWe57Z3IOtiCH-JBeecZohma2GCUjbUAzBMxda2dJ-OgRVUn-K8rttSvhBz3emfSBfxdwZYfs550db0d17lD4ABluKr6ACpb-DyWCJyxBSeuXRuPq822luj15rz3hZhLFyL_F2YjwzufcytOmq1TOuPrL891Zw1G-JL5LUetygrsEU-w-LQGMbTnq8pi3Tq4F')"}}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-[#e7edf3] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0d141b]">Appointment Confirmed</p>
                    <p className="text-xs text-[#4c739a]">Dr. Sarah Smith with Patient #2849</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="w-full bg-white py-20 border-y border-[#e7edf3]">
          <div className="max-w-7xl mx-auto px-4 sm:px-10 flex flex-col gap-12">
            <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
              <h2 className="text-[#137fec] font-bold tracking-wider uppercase text-sm">Core Features</h2>
              <h3 className="text-[#0d141b] text-3xl md:text-4xl font-black leading-tight">
                Everything you need to run your practice
              </h3>
              <p className="text-[#4c739a] text-lg">
                Designed for modern medical professionals, ClinicFlow simplifies the daily operations of your clinic so you can focus on what matters most: your patients.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group flex flex-col gap-6 p-8 rounded-2xl bg-white border border-[#e7edf3] shadow-sm hover:shadow-xl hover:border-[#137fec]/50 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-[#137fec] group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl">person_add</span>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-xl font-bold text-[#0d141b]">Patient Management</h4>
                  <p className="text-[#4c739a] leading-relaxed">
                    Effortlessly register new patients and search your secure database in seconds. maintain comprehensive digital records with ease.
                  </p>
                </div>
              </div>
              {/* Feature 2 */}
              <div className="group flex flex-col gap-6 p-8 rounded-2xl bg-white border border-[#e7edf3] shadow-sm hover:shadow-xl hover:border-[#137fec]/50 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl">calendar_month</span>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-xl font-bold text-[#0d141b]">Smart Scheduling</h4>
                  <p className="text-[#4c739a] leading-relaxed">
                    Book appointments and view your daily roster with a smart drag-and-drop interface designed to prevent double-booking conflicts.
                  </p>
                </div>
              </div>
              {/* Feature 3 */}
              <div className="group flex flex-col gap-6 p-8 rounded-2xl bg-white border border-[#e7edf3] shadow-sm hover:shadow-xl hover:border-[#137fec]/50 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl">clinical_notes</span>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-xl font-bold text-[#0d141b]">Consultation Summaries</h4>
                  <p className="text-[#4c739a] leading-relaxed">
                    Record vitals, diagnosis notes, and treatment plans quickly during patient visits. Generate professional summary reports instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div id="pricing" className="w-full px-4 sm:px-10 py-20">
          <div className="max-w-5xl mx-auto bg-[#137fec] rounded-3xl p-8 md:p-16 text-center md:text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-black/10 blur-3xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col gap-4 max-w-xl">
                <h2 className="text-white text-3xl md:text-4xl font-black leading-tight">
                  Ready to modernize your clinic?
                </h2>
                <p className="text-blue-100 text-lg">
                  Join over 500+ clinics managing their practice better with ClinicFlow. Start your free 14-day trial today.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <button 
                  onClick={() => navigateTo("/patient")}
                  className="px-8 py-4 bg-white text-[#137fec] text-base font-bold rounded-xl shadow-xl hover:bg-slate-50 transition-all w-full md:w-auto whitespace-nowrap"
                >
                  Get Started for Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer id="contact" className="w-full border-t border-[#e7edf3] bg-white py-12 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 text-[#0d141b]">
            <span className="material-symbols-outlined text-[#137fec] text-2xl">local_hospital</span>
            <span className="font-bold text-lg">ClinicFlow</span>
          </div>
          <div className="flex gap-8 text-sm text-[#4c739a]">
            <a className="hover:text-[#137fec] transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-[#137fec] transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-[#137fec] transition-colors" href="#">Support</a>
          </div>
          <div className="text-sm text-[#4c739a]">
            © 2023 ClinicFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
