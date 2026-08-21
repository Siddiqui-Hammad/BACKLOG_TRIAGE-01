import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UploadCloud,
  Plus,
  AlertTriangle,
  Flag,
  Clock,
  Calendar,
  Users,
  ArrowRight,
  FileText,
  Hourglass,
  Shield,
  ChevronRight,
  List,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Navbar } from "../components/Navbar";
import { AddCaseModal } from "../components/AddCaseModal";
import { UploadCsvModal } from "../components/UploadCsvModal";
import { api } from "../services/api";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboard();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const priorityData = [
    { name: "Critical", count: 128, percent: "6.2%", color: "#ef4444" },
    { name: "High Priority", count: 326, percent: "15.9%", color: "#f97316" },
    { name: "Medium Priority", count: 542, percent: "26.4%", color: "#eab308" },
    { name: "Routine", count: 842, percent: "41.0%", color: "#10b981" },
    { name: "Fast-Track Eligible", count: 214, percent: "10.5%", color: "#6366f1" },
  ];

  const delayData = [
    { name: "High Delay", count: 512, fill: "#ef4444" },
    { name: "Medium Delay", count: 862, fill: "#f97316" },
    { name: "Low Delay", count: 678, fill: "#10b981" },
  ];

  return (
    <div className="flex-1 bg-[#f4f6fa] flex flex-col min-h-screen overflow-y-auto">
      <Navbar
        title="Dashboard"
        subtitle="Overview of pending cases and AI-prioritization insights"
      />

      <div className="p-7 space-y-5 max-w-[1600px] mx-auto w-full">
        {/* Top Section: Left Upload Box + Right 5 Summary Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
          {/* Add / Upload Cases Card (4 cols) */}
          <div className="xl:col-span-4 bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Add / Upload Cases</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Upload CSV/Excel or add cases manually</p>

              {/* Drag & Drop Box */}
              <div
                onClick={() => setIsUploadModalOpen(true)}
                className="mt-3.5 border-2 border-dashed border-indigo-200/80 hover:border-indigo-400 bg-indigo-50/20 hover:bg-indigo-50/40 rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-1.5">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-700">Drag & drop file here</p>
                <span className="text-[10px] text-slate-400 my-0.5 font-medium">or</span>
                <button
                  type="button"
                  className="px-3.5 py-1.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold rounded-lg shadow-sm transition"
                >
                  Choose File
                </button>
                <p className="text-[10px] text-slate-400 mt-1.5">Supports .csv, .xlsx files</p>
              </div>
            </div>

            <div className="mt-3">
              <div className="relative flex py-1.5 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  OR
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full mt-0.5 py-2 px-4 bg-white border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Case Manually</span>
              </button>
            </div>
          </div>

          {/* 5 Summary Stat Cards (8 cols) */}
          <div className="xl:col-span-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-stretch">
            {/* 1. Critical */}
            <div className="bg-[#fff5f5] border border-rose-200/70 rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">128</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">Critical</div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Needs Urgent Attention</p>
              </div>
              <Link
                to="/cases?priority=Critical"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 mt-3"
              >
                <span>View Cases</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* 2. High Priority */}
            <div className="bg-[#fffaf0] border border-orange-200/70 rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-2.5">
                  <Flag className="w-3.5 h-3.5" />
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">326</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">High Priority</div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">High Priority Cases</p>
              </div>
              <Link
                to="/cases?priority=High"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 mt-3"
              >
                <span>View Cases</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* 3. Medium Priority */}
            <div className="bg-[#fffff0] border border-amber-200/70 rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">542</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">Medium Priority</div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Medium Priority Cases</p>
              </div>
              <Link
                to="/cases?priority=Medium"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700 mt-3"
              >
                <span>View Cases</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* 4. Routine */}
            <div className="bg-[#f0fff4] border border-emerald-200/70 rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2.5">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">842</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">Routine</div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Routine Cases</p>
              </div>
              <Link
                to="/cases?priority=Routine"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 mt-3"
              >
                <span>View Cases</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* 5. Fast-Track Eligible */}
            <div className="bg-[#faf5ff] border border-purple-200/70 rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-2.5">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">214</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">Fast-Track Eligible</div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Fast-Track / Settlement</p>
              </div>
              <Link
                to="/cases?fast_track=Eligible"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 hover:text-purple-700 mt-3"
              >
                <span>View Cases</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Middle Section: 3 Equal Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          {/* Card 1: Cases by Priority */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <h3 className="text-xs font-bold text-slate-900 mb-2">Cases by Priority</h3>
            <div className="flex items-center justify-between gap-3 h-52">
              <div className="relative w-40 h-40 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="count"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-base font-extrabold text-slate-900">2,052</span>
                  <span className="text-[9px] text-slate-400 font-medium">Total Cases</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-1.5 flex-1 pr-1">
                {priorityData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 font-medium">{item.name}</span>
                    </div>
                    <span className="text-slate-900 font-bold">
                      {item.count} <span className="text-slate-400 font-normal">({item.percent})</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Delay Status Overview */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <h3 className="text-xs font-bold text-slate-900 mb-2">Delay Status Overview</h3>
            <div className="h-52 w-full flex flex-col justify-center">
              <ResponsiveContainer width="100%" height="80%">
                <BarChart
                  layout="vertical"
                  data={delayData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 1000]} ticks={[0, 250, 500, 750, 1000]} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }} width={85} />
                  <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                  <Bar dataKey="count" radius={[0, 5, 5, 0]}>
                    {delayData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 3: Quick Alerts */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 mb-2.5">Quick Alerts</h3>
              <div className="space-y-2.5">
                <Link
                  to="/alerts"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-3 h-3" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 group-hover:text-slate-900">
                      56 cases crossing undertrial threshold
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  to="/alerts"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <Clock className="w-3 h-3" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 group-hover:text-slate-900">
                      217 cases near statutory deadline
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  to="/alerts"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <Calendar className="w-3 h-3" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 group-hover:text-slate-900">
                      1,127 cases with no progress &gt; 3 months
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>

            <Link
              to="/alerts"
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 text-center transition flex items-center justify-center gap-1.5 mt-2.5"
            >
              <span>View All Alerts</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Bottom Section: Key Statistics Banner */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-5">
          <div className="flex-1">
            <h4 className="text-xs font-bold text-slate-900 mb-2.5">Key Statistics</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Metric 1 */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900">12,842</div>
                  <div className="text-[10px] text-slate-500 font-medium">Total Pending Cases</div>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Hourglass className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900">4.2 yrs</div>
                  <div className="text-[10px] text-slate-500 font-medium">Average Case Age</div>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900">2,341</div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    Stagnating Cases <span className="text-slate-400">(No progress &gt; 6m)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Large CTA Button */}
          <button
            onClick={() => navigate("/cases")}
            className="w-full lg:w-auto px-7 py-3.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl shadow-md transition flex items-center justify-between gap-5 group"
          >
            <div className="flex items-center gap-3 text-left">
              <List className="w-5 h-5 text-indigo-200" />
              <div>
                <div className="text-xs font-bold text-white">View Prioritized Cases</div>
                <div className="text-[10px] text-indigo-200">See AI-prioritized case list</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-200 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {/* Footer Judicial Notice */}
        <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-500 pt-1 pb-4">
          <Shield className="w-4 h-4 text-slate-400" />
          <span>
            AI assists in prioritization based on legal rules and case history. Final decisions remain with the judicial authority.
          </span>
        </div>
      </div>

      {/* Modals */}
      <AddCaseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(id) => navigate(`/cases/${id}`)}
      />
      <UploadCsvModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => {
          fetchStats();
          navigate("/cases");
        }}
      />
    </div>
  );
};
