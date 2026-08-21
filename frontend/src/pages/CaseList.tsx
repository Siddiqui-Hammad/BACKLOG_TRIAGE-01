import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  RotateCcw,
  Download,
  Eye,
  AlertTriangle,
  Flag,
  Clock,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { api } from "../services/api";

export const CaseList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState(searchParams.get("priority") || "All");
  const [stageFilter, setStageFilter] = useState("All");
  const [fastTrackFilter, setFastTrackFilter] = useState(searchParams.get("fast_track") || "All");
  const [delayFilter, setDelayFilter] = useState("All");

  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await api.getCases({
        search: search || undefined,
        priority: priorityFilter !== "All" ? priorityFilter : undefined,
        stage: stageFilter !== "All" ? stageFilter : undefined,
        fast_track: fastTrackFilter !== "All" ? fastTrackFilter : undefined,
      });
      setCases(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [priorityFilter, stageFilter, fastTrackFilter, delayFilter]);

  const handleClearFilters = () => {
    setSearch("");
    setPriorityFilter("All");
    setStageFilter("All");
    setFastTrackFilter("All");
    setDelayFilter("All");
    setSearchParams({});
    fetchCases();
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Critical":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700">Critical</span>;
      case "High":
      case "High Priority":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-700">High</span>;
      case "Medium":
      case "Medium Priority":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">Medium</span>;
      case "Routine":
      case "Normal Processing":
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">Routine</span>;
    }
  };

  const getFastTrackBadge = (status: string) => {
    if (status.includes("Potentially")) {
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700">Potentially Suitable</span>;
    }
    if (status.includes("Suitable")) {
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700">Suitable</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500">Not Identified</span>;
  };

  const getDelayBadge = (delayStatus: string) => {
    if (delayStatus.includes("High")) {
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700">High Delay</span>;
    }
    if (delayStatus.includes("Medium")) {
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-700">Medium Delay</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">Low Delay</span>;
  };

  return (
    <div className="flex-1 bg-[#f8fafc] flex flex-col min-h-screen overflow-y-auto">
      <Navbar
        title="Cases"
        subtitle="AI-prioritized cases with key details and status"
      />

      <div className="p-8 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Top 5 Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div
            onClick={() => setPriorityFilter("Critical")}
            className={`cursor-pointer rounded-2xl p-4 border transition ${
              priorityFilter === "Critical" ? "bg-red-100 border-red-300 ring-2 ring-red-400" : "bg-[#fff1f2] border-rose-100"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-slate-900">128</div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">Critical</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Needs Urgent Attention</p>
          </div>

          <div
            onClick={() => setPriorityFilter("High")}
            className={`cursor-pointer rounded-2xl p-4 border transition ${
              priorityFilter === "High" ? "bg-orange-100 border-orange-300 ring-2 ring-orange-400" : "bg-[#fff7ed] border-orange-100"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
              <Flag className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-slate-900">326</div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">High Priority</div>
            <p className="text-[10px] text-slate-500 mt-0.5">High Priority Cases</p>
          </div>

          <div
            onClick={() => setPriorityFilter("Medium")}
            className={`cursor-pointer rounded-2xl p-4 border transition ${
              priorityFilter === "Medium" ? "bg-amber-100 border-amber-300 ring-2 ring-amber-400" : "bg-[#fefce8] border-amber-100"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-slate-900">542</div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">Medium Priority</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Medium Priority Cases</p>
          </div>

          <div
            onClick={() => setPriorityFilter("Routine")}
            className={`cursor-pointer rounded-2xl p-4 border transition ${
              priorityFilter === "Routine" ? "bg-emerald-100 border-emerald-300 ring-2 ring-emerald-400" : "bg-[#f0fdf4] border-emerald-100"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-slate-900">842</div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">Routine</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Routine Cases</p>
          </div>

          <div
            onClick={() => setFastTrackFilter("Eligible")}
            className={`cursor-pointer rounded-2xl p-4 border transition ${
              fastTrackFilter === "Eligible" ? "bg-purple-100 border-purple-300 ring-2 ring-purple-400" : "bg-[#faf5ff] border-purple-100"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-slate-900">214</div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">Fast-Track Eligible</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Fast-Track / Settlement</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[260px] relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Case ID, Title, Party, etc."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchCases()}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400">Priority</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Routine">Routine</option>
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400">Current Stage</span>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Filing">Filing / Registration</option>
              <option value="Pleadings">Written Statement / Pleadings</option>
              <option value="Evidence">Evidence</option>
              <option value="Arguments">Final Arguments</option>
              <option value="Judgment">Judgment Reserve</option>
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400">Fast-Track Status</span>
            <select
              value={fastTrackFilter}
              onChange={(e) => setFastTrackFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Eligible">Potentially Suitable</option>
              <option value="Suitable">Suitable</option>
              <option value="Not Identified">Not Identified</option>
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400">Delay Status</span>
            <select
              value={delayFilter}
              onChange={(e) => setDelayFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="High">High Delay</option>
              <option value="Medium">Medium Delay</option>
              <option value="Low">Low Delay</option>
            </select>
          </div>

          <button
            onClick={handleClearFilters}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>

          <a
            href="/api/cases/export"
            download="prioritized_court_docket.csv"
            className="px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-indigo-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </a>
        </div>

        {/* Case Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Case Title</th>
                  <th className="py-3 px-4">Filed Date</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Fast-Track Status</th>
                  <th className="py-3 px-4">Delay Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {cases.map((c) => (
                  <tr
                    key={c.case_id}
                    onClick={() => navigate(`/cases/${c.case_id}`)}
                    className="hover:bg-indigo-50/20 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                      {c.case_id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {c.case_title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {c.filed_date}
                    </td>
                    <td className="py-3.5 px-4">
                      {c.current_stage}
                    </td>
                    <td className="py-3.5 px-4">
                      {getPriorityBadge(c.priority)}
                    </td>
                    <td className="py-3.5 px-4">
                      {getFastTrackBadge(c.fast_track_status)}
                    </td>
                    <td className="py-3.5 px-4">
                      {getDelayBadge(c.delay_status)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/cases/${c.case_id}`);
                        }}
                        className="w-7 h-7 rounded-full bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 text-slate-500 inline-flex items-center justify-center transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing 1 to {cases.length} of 2,052 cases</span>
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
              <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                4
              </button>
              <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                5
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                205
              </button>
              <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
