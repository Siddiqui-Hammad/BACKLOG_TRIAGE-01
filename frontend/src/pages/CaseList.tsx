import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  AlertOctagon,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ArrowUpDown,
  FileText,
  Clock,
  Check,
} from "lucide-react";
import { CaseListItem, PriorityLevel } from "../types";
import { api } from "../services/api";

interface CaseListProps {
  initialFilter?: Record<string, string>;
  onSelectCase: (caseId: string) => void;
}

export const CaseList: React.FC<CaseListProps> = ({
  initialFilter,
  onSelectCase,
}) => {
  const [cases, setCases] = useState<CaseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPriority, setSelectedPriority] = useState(
    initialFilter?.priority || "All"
  );
  const [selectedStage, setSelectedStage] = useState(
    initialFilter?.stage || "All"
  );
  const [selectedFastTrack, setSelectedFastTrack] = useState(
    initialFilter?.fast_track || "All"
  );
  const [selectedDelayStatus, setSelectedDelayStatus] = useState(
    initialFilter?.delay_status || "All"
  );

  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await api.getCases({
        priority: selectedPriority,
        stage: selectedStage,
        fast_track: selectedFastTrack,
        delay_status: selectedDelayStatus,
        search: search.trim() || undefined,
      });
      setCases(data);
    } catch (err) {
      console.error("Failed to load docket", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [selectedPriority, selectedStage, selectedFastTrack, selectedDelayStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCases();
  };

  const getPriorityBadge = (priority: PriorityLevel, score: number) => {
    switch (priority) {
      case "Critical":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-100 text-red-700 border border-red-200">
            <AlertOctagon className="w-3 h-3 text-red-600" />
            <span>Critical ({score.toFixed(1)})</span>
          </span>
        );
      case "High":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-orange-100 text-orange-700 border border-orange-200">
            <Flame className="w-3 h-3 text-orange-600" />
            <span>High ({score.toFixed(1)})</span>
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Medium ({score.toFixed(1)})</span>
          </span>
        );
      case "Routine":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Routine ({score.toFixed(1)})</span>
          </span>
        );
    }
  };

  const getFastTrackBadge = (status: string) => {
    if (status === "Suitable" || status === "Potentially Suitable") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <Zap className="w-2.5 h-2.5 text-purple-600" />
          <span>{status}</span>
        </span>
      );
    }
    return <span className="text-slate-400 text-xs">-</span>;
  };

  const getDelayRiskBadge = (category: string, risk: number) => {
    const color =
      category === "High"
        ? "text-red-600 bg-red-50 border-red-200"
        : category === "Medium"
        ? "text-amber-600 bg-amber-50 border-amber-200"
        : "text-emerald-600 bg-emerald-50 border-emerald-200";

    return (
      <div className="flex items-center gap-1.5">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${color}`}>
          {category}
        </span>
        <span className="text-xs font-semibold text-slate-700">{risk}%</span>
      </div>
    );
  };

  return (
    <div className="flex-1 p-6 space-y-5 overflow-y-auto max-w-7xl mx-auto">
      {/* Header & Export CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Prioritized Court Docket List</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {cases.length} Cases
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Sorted strictly by AI hybrid priority ranking: Critical &rarr; High &rarr; Medium &rarr; Routine
          </p>
        </div>

        <a
          href="/api/cases/export"
          download="prioritized_court_docket.csv"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition"
        >
          <Download className="w-3.5 h-3.5 text-blue-600" />
          <span>Export Prioritized CSV</span>
        </a>
      </div>

      {/* Priority Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Priority:</span>
        </span>
        {["All", "Critical", "High", "Medium", "Routine"].map((lvl) => {
          const isSelected = selectedPriority === lvl;
          return (
            <button
              key={lvl}
              onClick={() => setSelectedPriority(lvl)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                isSelected
                  ? lvl === "Critical"
                    ? "bg-red-600 text-white shadow-sm"
                    : lvl === "High"
                    ? "bg-orange-600 text-white shadow-sm"
                    : lvl === "Medium"
                    ? "bg-amber-600 text-white shadow-sm"
                    : lvl === "Routine"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {lvl}
            </button>
          );
        })}
      </div>

      {/* Multi-Factor Search & Secondary Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Case ID, Title, Litigants, Dispute Type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-20 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-md transition"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {/* Stage Filter */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-2.5 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 outline-none"
          >
            <option value="All">All Stages</option>
            <option value="Filing / Summons & Notice">Summons / Notice</option>
            <option value="Written Statement / Pleadings">Pleadings</option>
            <option value="Framing of Issues & Admissions">Issues Framing</option>
            <option value="Petitioner / Prosecution Evidence">Petitioner Evidence</option>
            <option value="Respondent / Defence Evidence">Defence Evidence</option>
            <option value="Final Arguments">Final Arguments</option>
            <option value="Order / Judgment Reserve">Judgment Reserve</option>
            <option value="Execution Petition">Execution</option>
          </select>

          {/* Fast Track Filter */}
          <select
            value={selectedFastTrack}
            onChange={(e) => setSelectedFastTrack(e.target.value)}
            className="px-2.5 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 outline-none"
          >
            <option value="All">All ADR Status</option>
            <option value="Eligible">Fast-Track Eligible</option>
            <option value="Suitable">Suitable</option>
            <option value="Potentially Suitable">Potentially Suitable</option>
          </select>

          {/* Delay Status Filter */}
          <select
            value={selectedDelayStatus}
            onChange={(e) => setSelectedDelayStatus(e.target.value)}
            className="px-2.5 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 outline-none"
          >
            <option value="All">All Delay Risks</option>
            <option value="High">High Delay Risk</option>
            <option value="Medium">Medium Delay Risk</option>
            <option value="Low">Low Delay Risk</option>
          </select>
        </div>
      </div>

      {/* Case Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-semibold text-slate-500 flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Evaluating case priorities...</span>
          </div>
        ) : cases.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No matching cases found</p>
            <p className="text-xs text-slate-500">
              Try adjusting your priority or search filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold select-none">
                <tr>
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Case Title & Type</th>
                  <th className="py-3 px-4">Filing Date</th>
                  <th className="py-3 px-4">Procedural Stage</th>
                  <th className="py-3 px-4">Hearings / Adj.</th>
                  <th className="py-3 px-4">Delay Risk</th>
                  <th className="py-3 px-4">Fast-Track / ADR</th>
                  <th className="py-3 px-4">Triage Priority</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cases.map((c) => (
                  <tr
                    key={c.case_id}
                    onClick={() => onSelectCase(c.case_id)}
                    className="hover:bg-blue-50/40 transition cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {c.case_id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition">
                        {c.case_title}
                      </div>
                      <div className="text-[11px] text-slate-500">{c.case_type}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {c.filed_date}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {c.current_stage}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-semibold text-slate-800">
                        {c.num_hearings}
                      </span>{" "}
                      <span className="text-slate-400">/</span>{" "}
                      <span className="text-amber-600 font-semibold">
                        {c.num_adjournments} adj
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {getDelayRiskBadge(c.delay_status, c.delay_risk)}
                    </td>
                    <td className="py-3 px-4">
                      {getFastTrackBadge(c.fast_track_status)}
                    </td>
                    <td className="py-3 px-4">
                      {getPriorityBadge(c.priority, c.priority_score)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase(c.case_id);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-600 transition"
                        title="View Case Analysis & Judge Review"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
