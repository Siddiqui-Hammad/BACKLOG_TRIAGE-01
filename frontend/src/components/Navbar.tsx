import React from "react";
import { User, Calendar, ChevronDown, Shield } from "lucide-react";

interface NavbarProps {
  title: string;
  subtitle: string;
  showDisclaimerInHeader?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ title, subtitle, showDisclaimerInHeader = false }) => {
  return (
    <header className="px-7 py-4 flex items-center justify-between border-b border-slate-200/60 bg-white sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {showDisclaimerInHeader && (
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50/80 border border-indigo-100 rounded-xl text-[11px] font-semibold text-indigo-900">
            <Shield className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>AI assists in prioritization. Final decisions remain with the judicial authority.</span>
          </div>
        )}

        {/* Court Officer Pill */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white border border-slate-200/80 rounded-xl shadow-sm text-xs font-semibold text-slate-800">
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="text-left leading-tight">
            <span className="text-slate-900 block font-bold text-[11px]">Court Officer</span>
            <span className="text-[10px] text-slate-500 font-normal">District Court, Delhi</span>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
        </div>

        {/* Date / Time Pill */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white border border-slate-200/80 rounded-xl shadow-sm text-xs font-semibold text-slate-800">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <div className="text-left leading-tight">
            <span className="text-slate-900 block font-bold text-[11px]">12 May 2026</span>
            <span className="text-[10px] text-slate-500 font-normal">11:30 AM</span>
          </div>
        </div>
      </div>
    </header>
  );
};
