import React, { useState } from "react";
import {
  Download,
  Calendar,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  FileText,
  FileSpreadsheet,
  Shield,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Navbar } from "../components/Navbar";

export const Reports: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState("Overview");

  const subTabs = [
    "Overview",
    "Case Backlog",
    "Priority Analysis",
    "Delay Analysis",
    "Stage Analysis",
    "Judge Feedback",
    "Action Taken",
  ];

  const priorityPie = [
    { name: "Critical (85-100)", count: 128, percent: "6.2%", color: "#ef4444" },
    { name: "High (70-84)", count: 326, percent: "15.9%", color: "#f97316" },
    { name: "Medium (45-69)", count: 542, percent: "26.4%", color: "#eab308" },
    { name: "Routine (0-44)", count: 842, percent: "41.0%", color: "#10b981" },
  ];

  const delayPie = [
    { name: "High Delay (>12M)", count: 614, percent: "29.9%", color: "#ef4444" },
    { name: "Medium Delay (3-12M)", count: 828, percent: "40.4%", color: "#f97316" },
    { name: "Low Delay (<3M)", count: 610, percent: "29.7%", color: "#10b981" },
  ];

  const feedbackPie = [
    { name: "Accepted", count: 568, percent: "45.5%", color: "#10b981" },
    { name: "Priority Changed", count: 356, percent: "28.5%", color: "#f59e0b" },
    { name: "Deferred", count: 152, percent: "12.2%", color: "#3b82f6" },
    { name: "Overridden", count: 110, percent: "8.8%", color: "#ef4444" },
    { name: "Others", count: 62, percent: "5.0%", color: "#64748b" },
  ];

  const trendData = [
    { month: "Dec 2025", pending: 2280 },
    { month: "Jan 2026", pending: 2150 },
    { month: "Feb 2026", pending: 2120 },
    { month: "Mar 2026", pending: 2040 },
    { month: "Apr 2026", pending: 1980 },
    { month: "May 2026", pending: 1920 },
  ];

  const stageBars = [
    { name: "Filing/Registration", count: 312, percent: "15.2%", color: "#6366f1" },
    { name: "Pleadings", count: 256, percent: "12.5%", color: "#06b6d4" },
    { name: "Evidence", count: 642, percent: "31.3%", color: "#10b981" },
    { name: "Arguments", count: 428, percent: "20.8%", color: "#f59e0b" },
    { name: "Judgment Reserved", count: 246, percent: "12.0%", color: "#ef4444" },
    { name: "Others", count: 168, percent: "8.2%", color: "#64748b" },
  ];

  const courtPendency = [
    { name: "District Court, Delhi", count: 652, percent: "31.8%" },
    { name: "Rohini Courts, Delhi", count: 412, percent: "20.1%" },
    { name: "Karkardooma Courts, Delhi", count: 298, percent: "14.5%" },
    { name: "Tis Hazari Courts, Delhi", count: 276, percent: "13.5%" },
    { name: "Saket Courts, Delhi", count: 208, percent: "10.1%" },
  ];

  return (
    <div className="flex-1 bg-[#f8fafc] flex flex-col min-h-screen overflow-y-auto">
      <header className="px-8 py-5 flex items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Comprehensive insights and analytics on case backlog and prioritization
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-semibold text-slate-800">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>12 May 2026 – 12 May 2026</span>
          </div>

          <a
            href="/api/cases/export"
            download="backlog_analytics_report.csv"
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </a>
        </div>
      </header>

      <div className="p-8 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {subTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                activeSubTab === tab
                  ? "bg-[#4338ca] text-white shadow-indigo-100"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400">Date Range</span>
            <select className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer">
              <option>12 May 2026 – 12 May 2026</option>
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400">Court / Bench</span>
            <select className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer">
              <option>All Courts</option>
              <option>District Court, Delhi</option>
              <option>Rohini Courts</option>
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400">Case Type</span>
            <select className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer">
              <option>All</option>
              <option>Civil</option>
              <option>Criminal</option>
              <option>NI Act 138</option>
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400">Priority Level</span>
            <select className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer">
              <option>All</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-xl text-xs font-bold transition shadow-sm">
              Apply Filters
            </button>
            <button className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Top 5 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
            <span className="text-[11px] text-slate-500 font-medium">Total Pending Cases</span>
            <div className="text-2xl font-black text-slate-900">2,052</div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              <span>↑ 4.2% from last 30 days</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
            <span className="text-[11px] text-slate-500 font-medium">New Cases (Period)</span>
            <div className="text-2xl font-black text-slate-900">312</div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <TrendingDown className="w-3 h-3" />
              <span>↓ 8.1% from last 30 days</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
            <span className="text-[11px] text-slate-500 font-medium">Disposed Cases (Period)</span>
            <div className="text-2xl font-black text-slate-900">278</div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              <span>↑ 12.6% from last 30 days</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
            <span className="text-[11px] text-slate-500 font-medium">Average Case Age</span>
            <div className="text-2xl font-black text-slate-900">3.8 Years</div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              <span>↑ 0.4 years from last 30 days</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
            <span className="text-[11px] text-slate-500 font-medium">Stagnating Cases (&gt;3M)</span>
            <div className="text-2xl font-black text-slate-900">1,127</div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <TrendingDown className="w-3 h-3" />
              <span>↓ 2.7% from last 30 days</span>
            </div>
          </div>
        </div>

        {/* Middle Charts Row (3 Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Cases by Priority */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 mb-2">Cases by Priority</h3>
              <div className="flex items-center gap-4 h-48">
                <div className="relative w-36 h-36 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={priorityPie}
                        cx="50%"
                        cy="50%"
                        innerRadius={42}
                        outerRadius={58}
                        paddingAngle={2}
                        dataKey="count"
                      >
                        {priorityPie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-sm font-extrabold text-slate-900">2,052</span>
                    <span className="text-[8px] text-slate-400 font-medium">Total Cases</span>
                  </div>
                </div>

                <div className="space-y-1.5 flex-1 text-[11px]">
                  {priorityPie.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </span>
                      <span className="font-bold text-slate-900">
                        {item.count} <span className="text-slate-400 font-normal">({item.percent})</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <span className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">
                View Priority-wise Cases →
              </span>
            </div>
          </div>

          {/* Card 2: Delay Status Overview */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 mb-2">Delay Status Overview</h3>
              <div className="flex items-center gap-4 h-48">
                <div className="relative w-36 h-36 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={delayPie}
                        cx="50%"
                        cy="50%"
                        innerRadius={42}
                        outerRadius={58}
                        paddingAngle={2}
                        dataKey="count"
                      >
                        {delayPie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 flex-1 text-[11px]">
                  {delayPie.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </span>
                      <span className="font-bold text-slate-900">
                        {item.count} <span className="text-slate-400 font-normal">({item.percent})</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <span className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">
                View Delay Analysis →
              </span>
            </div>
          </div>

          {/* Card 3: Trend of Pending Cases */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-900">Trend of Pending Cases</h3>
                <span className="text-[10px] font-bold text-slate-500">Last 6 Months ▾</span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} domain={[1000, 2500]} />
                    <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px" }} />
                    <Area type="monotone" dataKey="pending" stroke="#6366f1" fill="#e0e7ff" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <span className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">
                View Trend Details →
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Charts Row (3 Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 4: Cases by Current Stage */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 mb-3">Cases by Current Stage</h3>
              <div className="space-y-2 text-xs">
                {stageBars.map((stg, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600">{stg.name}</span>
                      <span className="font-bold text-slate-900">
                        {stg.count} <span className="text-slate-400 font-normal">({stg.percent})</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: stg.percent, backgroundColor: stg.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right mt-3">
              <span className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">
                View Stage Analysis →
              </span>
            </div>
          </div>

          {/* Card 5: Top Courts by Pendency */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 mb-3">Top Courts by Pendency</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                    <tr>
                      <th className="py-2">Court / Bench</th>
                      <th className="py-2 text-right">Pending Cases</th>
                      <th className="py-2 text-right">% of Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-[11px]">
                    {courtPendency.map((c, i) => (
                      <tr key={i}>
                        <td className="py-2 font-medium text-slate-800">{c.name}</td>
                        <td className="py-2 font-bold text-slate-900 text-right">{c.count}</td>
                        <td className="py-2 text-slate-500 text-right">{c.percent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right mt-3">
              <span className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">
                View Court-wise Report →
              </span>
            </div>
          </div>

          {/* Card 6: Judge Feedback Summary */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 mb-2">Judge Feedback Summary</h3>
              <div className="flex items-center gap-4 h-48">
                <div className="relative w-36 h-36 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={feedbackPie}
                        cx="50%"
                        cy="50%"
                        innerRadius={42}
                        outerRadius={58}
                        paddingAngle={2}
                        dataKey="count"
                      >
                        {feedbackPie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-sm font-extrabold text-slate-900">1,248</span>
                    <span className="text-[8px] text-slate-400 font-medium">Total Decisions</span>
                  </div>
                </div>

                <div className="space-y-1.5 flex-1 text-[11px]">
                  {feedbackPie.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </span>
                      <span className="font-bold text-slate-900">
                        {item.count} <span className="text-slate-400 font-normal">({item.percent})</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <span className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">
                View Feedback Report →
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Banner: Generate Custom Report */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Generate Custom Report</h4>
              <p className="text-[11px] text-slate-500">
                Create and download customized reports based on selected filters and parameters.
              </p>
            </div>
          </div>

          <button
            onClick={() => alert("Generating customized court backlog analytics PDF/CSV report...")}
            className="px-5 py-2.5 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>

        {/* Footer Note */}
        <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-500 pt-2 pb-6">
          <Shield className="w-4 h-4 text-slate-400" />
          <span>
            Reports are generated based on AI analysis, configured rules and available case data. Final decisions remain with the judicial authority.
          </span>
        </div>
      </div>
    </div>
  );
};
