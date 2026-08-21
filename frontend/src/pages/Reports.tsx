import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Download,
  FileCheck,
  History,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { FeedbackAuditItem, DashboardStats } from "../types";
import { api } from "../services/api";

export const Reports: React.FC = () => {
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackAuditItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getFeedbackHistory(), api.getDashboard()]).then(
      ([history, dashStats]) => {
        setFeedbackHistory(history);
        setStats(dashStats);
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-900">
              Audit & Backlog Analytics Reports
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Judicial decision audit trail, backlog triage summaries, and system governance logs
          </p>
        </div>

        <a
          href="/api/cases/export"
          download="judicial_backlog_audit_report.csv"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 transition"
        >
          <Download className="w-4 h-4" />
          <span>Download Audit Docket CSV</span>
        </a>
      </div>

      {/* Backlog Summary Executive Statistics */}
      {stats && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-blue-600" />
            <span>Executive Triage Performance Snapshot</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-medium block">Total Pending Cases</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {stats.total_pending_cases}
              </span>
              <span className="text-[11px] text-slate-500">100% docket coverage</span>
            </div>

            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <span className="text-red-600 font-bold block">Critical Tiers</span>
              <span className="text-2xl font-black text-red-700 mt-1 block">
                {stats.summary_cards.critical} Cases
              </span>
              <span className="text-[11px] text-red-600">Immediate court listing</span>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
              <span className="text-purple-600 font-bold block">ADR Diversion Potential</span>
              <span className="text-2xl font-black text-purple-700 mt-1 block">
                {stats.summary_cards.fast_track_eligible} Cases
              </span>
              <span className="text-[11px] text-purple-600">Lok Adalat / Mediation</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-emerald-600 font-bold block">Average Disposal Horizon</span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">
                {stats.avg_case_age_years} Yrs
              </span>
              <span className="text-[11px] text-emerald-600">Across active roster</span>
            </div>
          </div>
        </div>
      )}

      {/* Judicial Feedback & Review Audit Trail */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" />
            <span>Judicial Feedback & Decision Audit Trail</span>
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {feedbackHistory.length} Recorded Judicial Determinations
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs font-semibold text-slate-500">
            Loading judicial audit trail...
          </div>
        ) : feedbackHistory.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-1">
            <UserCheck className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No judge review actions recorded yet</p>
            <p className="text-[11px] text-slate-500">
              Open any case detail page and submit a judicial determination to populate the audit log.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold select-none">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Case ID</th>
                  <th className="py-2.5 px-3">Case Title</th>
                  <th className="py-2.5 px-3">AI Recommendation</th>
                  <th className="py-2.5 px-3">Judge Ruling</th>
                  <th className="py-2.5 px-3">Action Type</th>
                  <th className="py-2.5 px-3">Judicial Reason / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {feedbackHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                      {item.timestamp}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                      {item.case_id}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {item.case_title}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {item.engine_priority}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.judge_decision === "Critical"
                            ? "bg-red-100 text-red-700"
                            : item.judge_decision === "High"
                            ? "bg-orange-100 text-orange-700"
                            : item.judge_decision === "Medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {item.judge_decision}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium">
                      {item.action_taken}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 italic max-w-xs truncate">
                      {item.reason || item.notes || "-"}
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
