import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Clock,
  Calendar,
  Handshake,
  Info,
  Search,
  RotateCcw,
  Eye,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { api } from "../services/api";

export const Alerts: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [courtFilter, setCourtFilter] = useState("All");

  const alertCards = [
    { title: "56", label: "Urgent", desc: "Cases crossing configured undertrial threshold", icon: AlertTriangle, color: "text-red-600 bg-red-100", border: "border-rose-100 bg-[#fff1f2]", cat: "URGENT" },
    { title: "217", label: "Delay", desc: "Cases with no progress for more than 3 months", icon: Clock, color: "text-orange-600 bg-orange-100", border: "border-orange-100 bg-[#fff7ed]", cat: "DELAY" },
    { title: "89", label: "Upcoming", desc: "Cases nearing statutory deadline", icon: Calendar, color: "text-amber-600 bg-amber-100", border: "border-amber-100 bg-[#fefce8]", cat: "UPCOMING" },
    { title: "214", label: "Opportunity", desc: "Cases with potential fast-track / settlement opportunity", icon: Handshake, color: "text-purple-600 bg-purple-100", border: "border-purple-100 bg-[#faf5ff]", cat: "OPPORTUNITY" },
    { title: "18", label: "General", desc: "Other important system notifications", icon: Info, color: "text-blue-600 bg-blue-100", border: "border-blue-100 bg-[#eff6ff]", cat: "GENERAL" },
  ];

  const staticAlerts = [
    {
      id: "alt-1",
      icon: AlertTriangle,
      iconColor: "text-red-600 bg-red-100",
      title: "Undertrial threshold crossed",
      desc: "Undertrial has been in custody for more than 60 days.",
      case_id: "DL-2024-1024",
      case_title: "State vs. Rajesh Kumar",
      court: "District Court, Delhi",
      category: "Urgent",
      categoryColor: "bg-red-50 text-red-700 dot-red-500",
      priority: "High",
      priorityColor: "bg-red-100 text-red-700",
      triggered_on: "12 May 2026\n10:45 AM",
    },
    {
      id: "alt-2",
      icon: Clock,
      iconColor: "text-orange-600 bg-orange-100",
      title: "No progress for 3+ months",
      desc: "No meaningful progress has been recorded for more than 3 months.",
      case_id: "DL-2023-0786",
      case_title: "Anita Sharma vs. Ramesh Sharma",
      court: "District Court, Delhi",
      category: "Delay",
      categoryColor: "bg-orange-50 text-orange-700 dot-orange-500",
      priority: "High",
      priorityColor: "bg-orange-100 text-orange-700",
      triggered_on: "12 May 2026\n09:30 AM",
    },
    {
      id: "alt-3",
      icon: Calendar,
      iconColor: "text-amber-600 bg-amber-100",
      title: "Statutory deadline approaching",
      desc: "Case is approaching the configured statutory deadline.",
      case_id: "DL-2024-0459",
      case_title: "Vikas Gupta vs. ICICI Bank",
      court: "District Court, Delhi",
      category: "Upcoming",
      categoryColor: "bg-amber-50 text-amber-700 dot-amber-500",
      priority: "Medium",
      priorityColor: "bg-amber-100 text-amber-700",
      triggered_on: "12 May 2026\n09:15 AM",
    },
    {
      id: "alt-4",
      icon: Handshake,
      iconColor: "text-purple-600 bg-purple-100",
      title: "Fast-track opportunity identified",
      desc: "This case may be suitable for fast-track review.",
      case_id: "DL-2024-0633",
      case_title: "Meena vs. State of Delhi",
      court: "District Court, Delhi",
      category: "Opportunity",
      categoryColor: "bg-purple-50 text-purple-700 dot-purple-500",
      priority: "Medium",
      priorityColor: "bg-amber-100 text-amber-700",
      triggered_on: "12 May 2026\n08:50 AM",
    },
    {
      id: "alt-5",
      icon: Info,
      iconColor: "text-blue-600 bg-blue-100",
      title: "Hearing not scheduled",
      desc: "No hearing date is scheduled for next 30 days.",
      case_id: "DL-2024-0998",
      case_title: "Rohit Kumar vs. Union of India",
      court: "District Court, Delhi",
      category: "General",
      categoryColor: "bg-blue-50 text-blue-700 dot-blue-500",
      priority: "Low",
      priorityColor: "bg-emerald-100 text-emerald-700",
      triggered_on: "12 May 2026\n08:20 AM",
    },
  ];

  useEffect(() => {
    api.getAlerts().then((data) => {
      setAlerts(data);
      setLoading(false);
    });
  }, []);

  const handleClear = () => {
    setSearch("");
    setCategoryFilter("All");
    setPriorityFilter("All");
    setCourtFilter("All");
  };

  return (
    <div className="flex-1 bg-[#f8fafc] flex flex-col min-h-screen overflow-y-auto">
      <Navbar
        title="Alerts"
        subtitle="Important alerts and notifications requiring attention"
      />

      <div className="p-8 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Top 5 Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {alertCards.map((c, i) => {
            const Icon = c.icon;
            const isSelected = categoryFilter === c.cat;
            return (
              <div
                key={i}
                onClick={() => setCategoryFilter(isSelected ? "All" : c.cat)}
                className={`rounded-2xl p-4 border transition cursor-pointer flex flex-col justify-between shadow-sm ${c.border} ${
                  isSelected ? "ring-2 ring-indigo-500" : ""
                }`}
              >
                <div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${c.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{c.title}</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">{c.label}</div>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{c.desc}</p>
                </div>
                <div className="text-[11px] font-bold text-slate-700 mt-4 flex items-center gap-1">
                  <span>View All</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[260px] relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search alerts by Case ID, Title, or Party..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400">Alert Category</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="URGENT">Urgent</option>
              <option value="DELAY">Delay</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="OPPORTUNITY">Opportunity</option>
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400">Priority Level</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400">Court / Bench</span>
            <select
              value={courtFilter}
              onChange={(e) => setCourtFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="District Court, Delhi">District Court, Delhi</option>
              <option value="Rohini Courts">Rohini Courts</option>
            </select>
          </div>

          <button
            onClick={handleClear}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>

        {/* Alerts Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="py-3 px-4">Alert</th>
                  <th className="py-3 px-4">Case Details</th>
                  <th className="py-3 px-4">Alert Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Triggered On</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {staticAlerts.map((alt) => {
                  const Icon = alt.icon;
                  return (
                    <tr
                      key={alt.id}
                      onClick={() => navigate(`/cases/${alt.case_id}`)}
                      className="hover:bg-indigo-50/20 cursor-pointer transition"
                    >
                      {/* Alert Title & Description */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${alt.iconColor}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 leading-tight">{alt.title}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{alt.desc}</div>
                          </div>
                        </div>
                      </td>

                      {/* Case Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-indigo-600">{alt.case_id}</div>
                        <div className="font-semibold text-slate-800">{alt.case_title}</div>
                        <div className="text-[10px] text-slate-400">{alt.court}</div>
                      </td>

                      {/* Alert Category */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${alt.categoryColor}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          <span>{alt.category}</span>
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${alt.priorityColor}`}>
                          {alt.priority}
                        </span>
                      </td>

                      {/* Triggered On */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-pre-line text-[11px]">
                        {alt.triggered_on}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/cases/${alt.case_id}`);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-bold transition inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Case</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing 1 to 5 of 594 alerts</span>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shadow-sm">
                1
              </button>
              <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                2
              </button>
              <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                3
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                119
              </button>
              <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-500 pt-2 pb-6">
          <Shield className="w-4 h-4 text-slate-400" />
          <span>
            These alerts are generated based on configured rules and analysis. Please verify and take appropriate action.
          </span>
        </div>
      </div>
    </div>
  );
};
