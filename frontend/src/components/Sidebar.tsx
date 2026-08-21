import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Zap,
  Bell,
  BarChart2,
  Settings,
  Scale,
  User,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/cases", label: "Cases", icon: FileText },
    { path: "/triage", label: "Triage Engine", icon: Zap },
    { path: "/alerts", label: "Alerts", icon: Bell },
    { path: "/reports", label: "Reports", icon: BarChart2 },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className="w-64 bg-[#0a1128] text-slate-200 flex flex-col justify-between select-none shrink-0 h-screen sticky top-0 z-20">
      <div>
        {/* Golden Scales Emblem */}
        <div className="pt-7 pb-5 px-6 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
            <Scale className="w-8 h-8 stroke-[1.75]" />
          </div>
          <h1 className="text-sm font-bold text-white tracking-tight leading-snug max-w-[180px]">
            Judicial Case<br />Backlog Triage Engine
          </h1>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 py-2 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-[#4338ca] text-white shadow-md shadow-indigo-950/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        {/* Collapse Button Circle */}
        <div className="px-6 py-2 flex justify-end">
          <button className="w-6 h-6 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Court Officer Profile */}
        <div className="p-4 border-t border-slate-800/60 bg-[#080d20]">
          <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-800/40 transition cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-tight">Court Officer</div>
                <div className="text-[10px] text-slate-400">District Court, Delhi</div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>
    </aside>
  );
};
