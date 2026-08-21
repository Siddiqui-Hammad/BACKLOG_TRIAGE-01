import React from "react";
import { User, Calendar, ChevronDown, Shield } from "lucide-react";

interface NavbarProps {
  title: string;
  subtitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title, subtitle }) => {
  return (
    <header className="px-8 py-5 flex items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Court Officer Pill */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-semibold text-slate-800">
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
        <div className="flex items-center gap-2.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-semibold text-slate-800">
          <Calendar className="w-4 h-4 text-slate-500" />
          <div className="text-left leading-tight">
            <span className="text-slate-900 block font-bold text-[11px]">12 May 2026</span>
            <span className="text-[10px] text-slate-500 font-normal">11:30 AM</span>
          </div>
        </div>
      </div>
    </header>
  );
};
