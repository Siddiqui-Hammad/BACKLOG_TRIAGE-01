import React from "react";
import {
  LayoutDashboard,
  FileText,
  Cpu,
  Bell,
  BarChart3,
  Scale,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  alertCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  alertCount = 0,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Overview Dashboard", icon: LayoutDashboard },
    { id: "cases", label: "Case Docket & List", icon: FileText },
    { id: "triage", label: "Triage Engine (7-Step)", icon: Cpu, badge: "AI" },
    { id: "alerts", label: "Actionable Alerts", icon: Bell, count: alertCount },
    { id: "reports", label: "Audit & Reports", icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col justify-between border-r border-slate-800 select-none">
      <div>
        {/* Court Header Branding */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-wide text-white flex items-center gap-1.5">
                <span>?????-TRIAGE</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
                  SIH 2024
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Judicial Backlog Engine
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.count ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-bold animate-pulse">
                    {item.count}
                  </span>
                ) : null}
                {item.badge ? (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Operational Badge & Decision-Support Notice */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/30 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Triage Pipeline
          </span>
          <span className="text-emerald-400 font-semibold">Active (7/7)</span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-[10px] text-slate-400 leading-relaxed">
          <div className="flex items-center gap-1 text-amber-400 font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Judicial Advisory</span>
          </div>
          Advisory prioritization only. Final listing decisions rest with the
          learned Bench.
        </div>
      </div>
    </aside>
  );
};
