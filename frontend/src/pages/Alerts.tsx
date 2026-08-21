import React, { useEffect, useState } from "react";
import {
  Bell,
  ShieldAlert,
  Clock,
  Calendar,
  Zap,
  ArrowRight,
  Filter,
  Eye,
} from "lucide-react";
import { AlertItem } from "../types";
import { api } from "../services/api";

interface AlertsProps {
  onSelectCase: (caseId: string) => void;
}

export const Alerts: React.FC<AlertsProps> = ({ onSelectCase }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAlerts().then((data) => {
      setAlerts(data);
      setLoading(false);
    });
  }, []);

  const categories = [
    { id: "ALL", label: "All Alerts", icon: Bell },
    { id: "URGENT", label: "Urgent Safeguards", icon: ShieldAlert },
    { id: "DELAY", label: "Procedural Stagnation", icon: Clock },
    { id: "UPCOMING", label: "Target Deadlines", icon: Calendar },
    { id: "OPPORTUNITY", label: "ADR Opportunities", icon: Zap },
  ];

  const filteredAlerts =
    selectedCategory === "ALL"
      ? alerts
      : alerts.filter((a) => a.category === selectedCategory);

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "Critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "High":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Info":
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-600 text-white">
              <Bell className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-900">
              Judicial Actionable Alerts Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated notifications flagging statutory risk, severe stagnation, and resolution opportunities
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          {filteredAlerts.length} Total Alerts Active
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          const count =
            cat.id === "ALL"
              ? alerts.length
              : alerts.filter((a) => a.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                isSelected
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Alerts Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs font-semibold text-slate-500 flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading triage alert triggers...</span>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2">
          <Bell className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No active alerts in this category</p>
          <p className="text-xs text-slate-500">All registered cases are within standard operational limits.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => onSelectCase(alert.case_id)}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(
                      alert.severity
                    )}`}
                  >
                    {alert.severity}
                  </span>
                  <span className="font-mono font-bold text-xs text-blue-700">
                    {alert.case_id}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {alert.case_title}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                  {alert.message}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {alert.details}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCase(alert.case_id);
                  }}
                  className="px-3 py-1.5 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Case</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
