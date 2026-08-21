import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Scale,
  Clock,
  AlertOctagon,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Zap,
  TrendingUp,
  ShieldAlert,
  Brain,
  History,
  Check,
  Calendar,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { CaseDetail, PriorityLevel } from "../types";
import { api } from "../services/api";

interface CaseDetailsProps {
  caseId: string;
  onBack: () => void;
  onRefreshList?: () => void;
}

export const CaseDetails: React.FC<CaseDetailsProps> = ({
  caseId,
  onBack,
  onRefreshList,
}) => {
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  // Judge Review Form State
  const [judgeDecision, setJudgeDecision] = useState<string>("Critical");
  const [actionTaken, setActionTaken] = useState<string>("Accepted Recommendation");
  const [reason, setReason] = useState<string>("Statutory timeline and undertrial threshold verified");
  const [notes, setNotes] = useState<string>("");

  const loadCase = async () => {
    try {
      setLoading(true);
      const data = await api.getCaseDetail(caseId);
      setCaseData(data);
      if (data.analysis) {
        setJudgeDecision(data.analysis.priority_category);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCase();
  }, [caseId]);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseData) return;
    setSubmittingFeedback(true);
    setFeedbackSuccess(null);
    try {
      await api.submitJudgeFeedback(caseId, {
        engine_priority: caseData.analysis.priority_category,
        judge_decision: judgeDecision,
        action_taken: actionTaken,
        reason: reason || undefined,
        notes: notes || undefined,
      });
      setFeedbackSuccess("Judicial determination persisted successfully into court records.");
      await loadCase();
      if (onRefreshList) onRefreshList();
    } catch (err: any) {
      alert(err.message || "Failed to record judge decision");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading || !caseData) {
    return (
      <div className="flex-1 p-12 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500">
          Loading comprehensive judicial case dossier...
        </p>
      </div>
    );
  }

  const { analysis } = caseData;
  const factors = analysis.factor_breakdown;

  const getPriorityColor = (p: PriorityLevel) => {
    switch (p) {
      case "Critical":
        return "bg-red-600 text-white";
      case "High":
        return "bg-orange-600 text-white";
      case "Medium":
        return "bg-amber-500 text-white";
      case "Routine":
      default:
        return "bg-emerald-600 text-white";
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-w-6xl mx-auto">
      {/* Top Back Navigation & Case Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                {caseData.case_id}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getPriorityColor(
                  analysis.priority_category
                )}`}
              >
                {analysis.priority_category} Priority (Score: {analysis.priority_score.toFixed(1)}/100)
              </span>
            </div>
            <h1 className="text-base font-bold text-slate-900 mt-1">
              {caseData.case_title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Stage:</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold">
            {caseData.current_stage}
          </span>
        </div>
      </div>

      {/* Grid: 2 Columns - Left Dossier & Analysis, Right Decision Engine & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Dossier, Explanation, Factor Breakdown, Predictive Model */}
        <div className="lg:col-span-2 space-y-6">
          {/* Why Was This Prioritized? Natural Language Explanation Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-md border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
              <Brain className="w-4 h-4" />
              <span>AI Judicial Explainability Dossier</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {analysis.narrative_explanation}
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Recommended Operational Action:</span>
              <span className="font-bold text-emerald-400">
                {analysis.recommended_action}
              </span>
            </div>
          </div>

          {/* Factor Breakdown Weights */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Multi-Factor Priority Breakdown</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                Transparent Weights
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {/* Factor 1: Legal Urgency */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">
                    1. Statutory & Custody Urgency (Weight 30%)
                  </span>
                  <span className="font-bold text-slate-900">
                    +{factors.legal_urgency.toFixed(1)} pts
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${(factors.legal_urgency / 30) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Factor 2: Case Age */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">
                    2. Age & Pendency Horizon (Weight 25% | {analysis.case_age_years} yrs)
                  </span>
                  <span className="font-bold text-slate-900">
                    +{factors.case_age.toFixed(1)} pts
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${(factors.case_age / 25) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Factor 3: Stagnation */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">
                    3. Procedural Inactivity & Stagnation (Weight 20% | Level: {analysis.stagnation_level})
                  </span>
                  <span className="font-bold text-slate-900">
                    +{factors.stagnation.toFixed(1)} pts
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${(factors.stagnation / 20) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Factor 4: Delay Risk */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">
                    4. Predictive Delay Risk (Weight 20% | Score: {analysis.delay_risk}%)
                  </span>
                  <span className="font-bold text-slate-900">
                    +{factors.delay_risk.toFixed(1)} pts
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${(factors.delay_risk / 20) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Factor 5: Other Urgency */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">
                    5. Vulnerable Litigant / Priority Flag (Weight 5%)
                  </span>
                  <span className="font-bold text-slate-900">
                    +{factors.other_factors.toFixed(1)} pts
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(factors.other_factors / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Case Procedural Snapshot Details */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-600" />
              <span>Procedural Docket Metadata</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Dispute Type</span>
                <span className="font-bold text-slate-900">{caseData.case_type}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Date of Institution</span>
                <span className="font-bold text-slate-900">{caseData.filed_date}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Last Progress Date</span>
                <span className="font-bold text-slate-900">{caseData.last_progress_date}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Total Hearings</span>
                <span className="font-bold text-slate-900">{caseData.num_hearings}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Adjournments</span>
                <span className="font-bold text-amber-700">{caseData.num_adjournments}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Custody Indicator</span>
                <span className="font-bold text-slate-900">
                  {caseData.custody_indicator
                    ? `Yes (${caseData.days_in_custody} days)`
                    : "No"}
                </span>
              </div>
              {caseData.statutory_deadline && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 col-span-2">
                  <span className="text-red-600 font-semibold block">
                    Statutory Target Deadline
                  </span>
                  <span className="font-bold text-red-800">{caseData.statutory_deadline}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Predictive Delay, ADR Opportunities & Judge Review Form */}
        <div className="space-y-6">
          {/* Predictive Delay & ADR Opportunities */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>Alternative Resolution Opportunities</span>
            </h3>

            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-purple-50/60 border border-purple-100 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800">Fast-Track Bench Review</span>
                <span className="font-bold text-purple-700 px-2 py-0.5 rounded bg-purple-100">
                  {analysis.fast_track_status}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800">Court Mediation / Conciliation</span>
                <span className="font-bold text-blue-700 px-2 py-0.5 rounded bg-blue-100">
                  {analysis.mediation_status}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800">National Lok Adalat Referral</span>
                <span className="font-bold text-emerald-700 px-2 py-0.5 rounded bg-emerald-100">
                  {analysis.lok_adalat_status}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-800">Predicted Timeline: </span>
              {analysis.estimated_timeline_min_months} - {analysis.estimated_timeline_max_months} months
              <div className="mt-1 text-slate-500">
                Model Confidence: {analysis.model_confidence}% | Stagnation Level: {analysis.stagnation_level}
              </div>
            </div>
          </div>

          {/* Interactive Judge Review & Decision Persistence Form */}
          <div className="bg-white p-5 rounded-xl border-2 border-blue-500/80 shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Judge Review & Decision Loop
                </h3>
                <p className="text-[11px] text-slate-500">
                  Judicial feedback modifies live docket priority
                </p>
              </div>
            </div>

            {feedbackSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feedbackSuccess}</span>
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judicial Decision / Action
                </label>
                <select
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Accepted Recommendation">
                    Accept AI Recommendation
                  </option>
                  <option value="Changed Priority">
                    Modify / Change Priority Tier
                  </option>
                  <option value="Deferred Listing">
                    Defer / Await Statutory Response
                  </option>
                  <option value="Overridden">
                    Judicial Override with Special Reasons
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Final Priority
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["Critical", "High", "Medium", "Routine"] as PriorityLevel[]).map(
                    (p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setJudgeDecision(p)}
                        className={`py-1.5 text-xs font-bold rounded-lg transition ${
                          judgeDecision === p
                            ? p === "Critical"
                              ? "bg-red-600 text-white"
                              : p === "High"
                              ? "bg-orange-600 text-white"
                              : p === "Medium"
                              ? "bg-amber-600 text-white"
                              : "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Judicial Justification
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Statutory timeline and undertrial threshold verified">
                    Statutory timeline & undertrial threshold verified
                  </option>
                  <option value="Priority elevated due to Senior Citizen litigant">
                    Priority elevated for vulnerable / Senior Citizen litigant
                  </option>
                  <option value="Referred to National Lok Adalat / Mediation cell">
                    Referred to Lok Adalat / Court Mediation
                  </option>
                  <option value="Interlocutory applications pending; priority adjusted">
                    Interlocutory applications pending; priority adjusted
                  </option>
                  <option value="Procedural adjournment granted upon mutual request">
                    Procedural adjournment granted upon mutual request
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judge Notes & Order Direction
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter specific court directives or listing date instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submittingFeedback}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>
                  {submittingFeedback ? "Recording Order..." : "Confirm & Save Judicial Decision"}
                </span>
              </button>
            </form>

            {caseData.latest_judge_feedback && (
              <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-500 font-semibold">
                  <span>Prior Review Log:</span>
                  <span>{caseData.latest_judge_feedback.timestamp}</span>
                </div>
                <div className="font-bold text-slate-800">
                  Decision: {caseData.latest_judge_feedback.judge_decision} (
                  {caseData.latest_judge_feedback.action_taken})
                </div>
                {caseData.latest_judge_feedback.notes && (
                  <p className="text-slate-600 italic">
                    "{caseData.latest_judge_feedback.notes}"
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
