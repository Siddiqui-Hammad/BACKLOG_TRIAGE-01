import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Printer,
  Layers,
  Calendar,
  Clock,
  Edit3,
  UserCheck,
  Pause,
  AlertTriangle,
  ChevronDown,
  Shield,
  Check,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Navbar } from "../components/Navbar";
import { api } from "../services/api";

export const CaseDetails: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Judge Review State
  const [judgeAction, setJudgeAction] = useState("Change Priority");
  const [judgePriority, setJudgePriority] = useState("High");
  const [reason, setReason] = useState("Hearing already scheduled within 7 days");
  const [notes, setNotes] = useState("Hearing is already fixed and likely to conclude soon.");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const loadCase = async () => {
    if (!caseId) return;
    try {
      setLoading(true);
      const data = await api.getCaseDetail(caseId);
      setCaseData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCase();
  }, [caseId]);

  const handleSubmitJudgeReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId || !caseData) return;
    try {
      setSubmitting(true);
      await api.submitJudgeFeedback(caseId, {
        engine_priority: caseData.analysis.priority_category,
        judge_decision: judgeAction === "Accept Recommendation" ? caseData.analysis.priority_category : judgePriority,
        action_taken: judgeAction,
        reason: reason,
        notes: notes,
      });
      setSubmitSuccess(true);
      await loadCase();
    } catch (err: any) {
      alert(err.message || "Failed to save judge review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !caseData) {
    return (
      <div className="flex-1 bg-[#f8fafc] flex flex-col items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500 mt-3">Loading Case Dossier...</p>
      </div>
    );
  }

  const { analysis } = caseData;
  const factors = analysis.factor_breakdown;

  const scoreDonut = [
    { name: "Legal Urgency", value: 30, color: "#ef4444" },
    { name: "Case Age", value: 24, color: "#f97316" },
    { name: "Stagnation", value: 18, color: "#eab308" },
    { name: "Delay Risk", value: 16, color: "#6366f1" },
    { name: "Other", value: 0, color: "#10b981" },
  ];

  return (
    <div className="flex-1 bg-[#f8fafc] flex flex-col min-h-screen overflow-y-auto">
      <Navbar
        title="Cases"
        subtitle="AI-prioritized cases with key details and status"
      />

      <div className="p-8 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <Link
              to="/cases"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Cases</span>
            </Link>

            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-slate-900">
                {caseData.case_title}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                {analysis.priority_category}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1 font-medium">
              Case ID: <span className="font-mono font-bold text-slate-700">{caseData.case_id}</span> | Case Type: {caseData.case_type} | Filed Date: {caseData.filed_date}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Downloading PDF Case Dossier...")}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* 6 Metric Badges in a Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Current Stage</div>
              <div className="text-xs font-bold text-slate-900">{caseData.current_stage}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Next Hearing Date</div>
              <div className="text-xs font-bold text-slate-900">28 May 2026</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Pending Since</div>
              <div className="text-xs font-bold text-slate-900">{analysis.case_age_years} Years, 4 Months</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Last Meaningful Progress</div>
              <div className="text-xs font-bold text-slate-900">15 Jun 2024 (11m ago)</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Total Hearings</div>
              <div className="text-xs font-bold text-slate-900">{caseData.num_hearings || 18}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Pause className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Total Adjournments</div>
              <div className="text-xs font-bold text-slate-900">{caseData.num_adjournments || 7}</div>
            </div>
          </div>
        </div>

        {/* 3 Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column 1 (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900">Why This Case Was Prioritized</h3>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1"></span>
                  <span>Case is pending for more than 4 years</span>
                </li>
                <li className="flex items-start gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1"></span>
                  <span>No meaningful progress for 11 months</span>
                </li>
                <li className="flex items-start gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-1"></span>
                  <span>7 adjournments with 3 in last 90 days</span>
                </li>
                <li className="flex items-start gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1"></span>
                  <span>High predicted risk of further delay</span>
                </li>
                <li className="flex items-start gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1"></span>
                  <span>Undertrial threshold approaching (if applicable)</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-indigo-600 font-bold cursor-pointer">
                <span>How Was This Analyzed?</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900">Priority Score Breakdown</h3>

              <div className="flex items-center gap-4">
                <div className="relative w-28 h-28 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scoreDonut}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={50}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {scoreDonut.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-base font-extrabold text-slate-900">88</span>
                    <span className="text-[9px] text-slate-400">/100</span>
                  </div>
                </div>

                <div className="space-y-1.5 flex-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> Legal Urgency
                    </span>
                    <span className="font-bold text-slate-900">30 (30%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span> Case Age
                    </span>
                    <span className="font-bold text-slate-900">24 (25%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Stagnation
                    </span>
                    <span className="font-bold text-slate-900">18 (20%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Delay Risk
                    </span>
                    <span className="font-bold text-slate-900">16 (20%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Other Factors
                    </span>
                    <span className="font-bold text-slate-900">0 (5%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Predictive Analysis</h3>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full border-4 border-indigo-600 flex flex-col items-center justify-center shrink-0">
                  <span className="text-sm font-extrabold text-indigo-700">82%</span>
                  <span className="text-[8px] font-bold text-red-600">High Risk</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-[11px] text-slate-500">Estimated Disposal Timeline</div>
                  <div className="font-bold text-slate-900">8 – 12 months</div>
                  <div className="text-[11px] text-slate-500 mt-1">Model Confidence</div>
                  <div className="font-bold text-slate-900">87%</div>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-100">
                Prototype predictive estimate based on available case features.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Case Timeline (Key Events)</h3>

              <div className="space-y-2 text-xs relative pl-4 border-l-2 border-slate-100">
                <div className="relative">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -left-[21px] top-1"></span>
                  <span className="text-[10px] text-slate-400 block font-mono">12 Jan 2022</span>
                  <span className="font-semibold text-slate-800">Case Filed</span>
                </div>
                <div className="relative">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -left-[21px] top-1"></span>
                  <span className="text-[10px] text-slate-400 block font-mono">05 Mar 2022</span>
                  <span className="font-semibold text-slate-800">Summons Issued</span>
                </div>
                <div className="relative">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -left-[21px] top-1"></span>
                  <span className="text-[10px] text-slate-400 block font-mono">14 Sep 2022</span>
                  <span className="font-semibold text-slate-800">Charge Framed</span>
                </div>
                <div className="relative">
                  <span className="w-2 h-2 rounded-full bg-amber-500 absolute -left-[21px] top-1"></span>
                  <span className="text-[10px] text-slate-400 block font-mono">15 Jun 2024</span>
                  <span className="font-semibold text-slate-800">Last Meaningful Progress</span>
                </div>
                <div className="relative">
                  <span className="w-2 h-2 rounded-full bg-blue-500 absolute -left-[21px] top-1"></span>
                  <span className="text-[10px] text-slate-400 block font-mono">28 May 2026</span>
                  <span className="font-semibold text-slate-800">Next Hearing Date</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => alert("Viewing complete procedural history...")}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700"
                >
                  View Full Timeline
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2.5">
              <h3 className="text-xs font-bold text-slate-900 mb-1">Fast-Track / Resolution Opportunities</h3>

              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                <span className="text-slate-600 font-medium">Fast-Track Review</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                  Potentially Suitable
                </span>
              </div>

              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                <span className="text-slate-600 font-medium">Mediation / Conciliation</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                  Suitable
                </span>
              </div>

              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                <span className="text-slate-600 font-medium">Lok Adalat</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                  Potentially Suitable
                </span>
              </div>

              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                <span className="text-slate-600 font-medium">Settlement Opportunity</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                  Not Identified
                </span>
              </div>

              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-600 font-medium">Compoundable Offence Check</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                  Not Applicable
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2 text-xs">
              <h3 className="text-xs font-bold text-slate-900 mb-2">Case Information</h3>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Petitioner / Complainant</span>
                  <span className="font-bold text-slate-800">State</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Court</span>
                  <span className="font-bold text-slate-800">District Court, Delhi</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Respondent / Accused</span>
                  <span className="font-bold text-slate-800">Rajesh Kumar</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Judge</span>
                  <span className="font-bold text-slate-800">Hon'ble A. K. Sharma</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Category</span>
                  <span className="font-bold text-slate-800">Criminal</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Case Tags</span>
                  <span className="font-bold text-slate-800">—</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3 (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border-2 border-indigo-200 shadow-md space-y-5">
            <h3 className="text-sm font-bold text-slate-900">Judge Review & Feedback</h3>

            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-xs space-y-1.5">
              <div className="text-rose-900 font-bold uppercase tracking-wider text-[10px]">
                System Recommendation
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Priority:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                  Critical
                </span>
              </div>
              <div className="text-slate-700">
                <span className="font-medium text-slate-500">Recommended: </span>
                <span className="font-bold text-slate-900">Review this case on priority</span>
              </div>
            </div>

            {submitSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Judge review recorded successfully.</span>
              </div>
            )}

            <form onSubmit={handleSubmitJudgeReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Judge Action</label>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="judgeAction"
                      value="Accept Recommendation"
                      checked={judgeAction === "Accept Recommendation"}
                      onChange={(e) => setJudgeAction(e.target.value)}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="font-medium text-slate-700">Accept Recommendation</span>
                  </label>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="judgeAction"
                        value="Change Priority"
                        checked={judgeAction === "Change Priority"}
                        onChange={(e) => setJudgeAction(e.target.value)}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span className="font-medium text-slate-700">Change Priority</span>
                    </label>

                    {judgeAction === "Change Priority" && (
                      <select
                        value={judgePriority}
                        onChange={(e) => setJudgePriority(e.target.value)}
                        className="px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 outline-none"
                      >
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Routine">Routine</option>
                      </select>
                    )}
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="judgeAction"
                      value="Defer Decision"
                      checked={judgeAction === "Defer Decision"}
                      onChange={(e) => setJudgeAction(e.target.value)}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="font-medium text-slate-700">Defer Decision</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="judgeAction"
                      value="Override Recommendation"
                      checked={judgeAction === "Override Recommendation"}
                      onChange={(e) => setJudgeAction(e.target.value)}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="font-medium text-slate-700">Override Recommendation</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Reason for Decision / Change *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none"
                >
                  <option value="Hearing already scheduled within 7 days">
                    Hearing already scheduled within 7 days
                  </option>
                  <option value="Statutory timeline & undertrial threshold verified">
                    Statutory timeline & undertrial threshold verified
                  </option>
                  <option value="Priority elevated for vulnerable / Senior Citizen litigant">
                    Priority elevated for vulnerable / Senior Citizen litigant
                  </option>
                  <option value="Referred to Lok Adalat / Court Mediation">
                    Referred to Lok Adalat / Court Mediation
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 outline-none focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/cases")}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Decision"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Note */}
        <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-500 pt-2 pb-6">
          <Shield className="w-4 h-4 text-slate-400" />
          <span>
            AI assists in prioritization based on configured rules, case history and predictive analysis. Final decisions remain with the judicial authority.
          </span>
        </div>
      </div>
    </div>
  );
};
