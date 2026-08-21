import React, { useEffect, useState } from "react";
import {
  Cpu,
  Shield,
  Clock,
  PauseOctagon,
  TrendingUp,
  Zap,
  Layers,
  Brain,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { api } from "../services/api";

export const TriageEngine: React.FC = () => {
  const [pipelineStatus, setPipelineStatus] = useState<any>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTriageStatus().then((data) => {
      setPipelineStatus(data);
      setLoading(false);
    });
  }, []);

  const steps = [
    {
      num: 1,
      title: "Legal & Statutory Rule Engine",
      subtitle: "Hard Constraints & Constitutional Safeguards",
      icon: Shield,
      color: "from-red-500 to-rose-600",
      description:
        "Scans for hard statutory deadlines (e.g. NI Act 6-month trial guideline, Order 37 CPC summary suits), accused in custody crossing 180 days (Article 21 safeguard), senior citizens (>65 yrs), maintenance/DV emergencies, and bail matters.",
      inputs: ["Case Type", "Days in Custody", "Statutory Target Date", "Urgency Category"],
      outputs: ["Legal Urgency Flag (Boolean)", "Urgency Score (0-100)", "Detailed Urgency Flags"],
      weight: "30% of Hybrid Score",
    },
    {
      num: 2,
      title: "Case Ageing & Horizon Engine",
      subtitle: "Pendency Horizon & Historical Longevity",
      icon: Clock,
      color: "from-orange-500 to-amber-600",
      description:
        "Measures calendar age in days and fractional years from institution date. Classifies cases into Recent (<2 yrs), Ageing (2-5 yrs), Long Pending (5-10 yrs), and Severely Delayed (>10 yrs) using calibrated sigmoid scoring.",
      inputs: ["Filed Date", "Reference Date (2026-08-21)"],
      outputs: ["Case Age (Years & Days)", "Age Classification", "Age Score (0-100)"],
      weight: "25% of Hybrid Score",
    },
    {
      num: 3,
      title: "Stagnation & Bottleneck Engine",
      subtitle: "Inactivity Duration & Hearing Ratios",
      icon: PauseOctagon,
      color: "from-amber-500 to-yellow-600",
      description:
        "Detects procedural inertia by computing inactive days since last meaningful progress, ratio of adjournments to total hearings, recent consecutive adjournments, and bottleneck stages (Evidence, Written Statement).",
      inputs: ["Last Progress Date", "Current Stage", "Total Hearings", "Total Adjournments", "Recent Adjournments"],
      outputs: ["Stagnation Score (0-100)", "Stagnation Level (Low/Moderate/High/Severe)", "Bottleneck Reasons"],
      weight: "20% of Hybrid Score",
    },
    {
      num: 4,
      title: "Deterministic ML Delay Predictor",
      subtitle: "Machine Learning Horizon Estimation",
      icon: TrendingUp,
      color: "from-purple-500 to-indigo-600",
      description:
        "Applies deterministic multi-factor regression models to estimate the expected months to final disposal, delay risk probability (0-100%), and model confidence percentage.",
      inputs: ["Dispute Type Complexity", "Stage Weight", "Adjournment Velocity", "Custody Indicator"],
      outputs: ["Delay Risk % (0-100)", "Risk Category (Low/Medium/High)", "Estimated Timeline Range (Months)", "Model Confidence %"],
      weight: "20% of Hybrid Score",
    },
    {
      num: 5,
      title: "Fast-Track & ADR Opportunity Engine",
      subtitle: "Mediation & Lok Adalat Suitability Matching",
      icon: Zap,
      color: "from-emerald-500 to-teal-600",
      description:
        "Identifies negotiable, settlement-friendly disputes (MACT claims, Section 138 NI Act, Matrimonial recovery, Partition suits) suitable for Fast-Track Special Benches, Court Mediation, or National Lok Adalat.",
      inputs: ["Case Type", "Current Stage", "Case Age (Years)"],
      outputs: ["Fast-Track Suitability", "Mediation Suitability", "Lok Adalat Referral Status", "Settlement Feasibility"],
      weight: "Diversion Screening",
    },
    {
      num: 6,
      title: "Hybrid Priority Scoring Algorithm",
      subtitle: "Weighted Multi-Factor Fusion",
      icon: Layers,
      color: "from-blue-600 to-indigo-700",
      description:
        "Synthesizes Legal Urgency (30%), Age Score (25%), Stagnation Score (20%), Delay Risk (20%), and Special Flags (5%) into an aggregate 0-100 priority score categorized into Critical (>=85), High (70-84), Medium (45-69), Routine (<45).",
      inputs: ["All 5 Normalized Component Scores"],
      outputs: ["Hybrid Priority Score (0-100)", "Priority Category", "Factor Breakdown Dictionary"],
      weight: "Final Prioritization",
    },
    {
      num: 7,
      title: "Natural Language Explainability Engine",
      subtitle: "Human-Readable Judicial Reasoning Dossier",
      icon: Brain,
      color: "from-slate-700 to-slate-900",
      description:
        "Translates mathematical scores, statutory rule triggers, and stage bottlenecks into plain-English judicial narratives so judges and registry officers understand exactly why a case was prioritized.",
      inputs: ["Case Metadata", "Complete Triage Analysis Record"],
      outputs: ["Natural Language Explanation", "Actionable Recommended Directive"],
      weight: "Transparency & Trust",
    },
  ];

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-w-6xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Cpu className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-900">
              7-Step Triage Engine Architecture
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Explore the multi-layer pipeline that prioritizes court dockets with complete explainability
          </p>
        </div>

        {pipelineStatus && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-semibold">Triage Coverage</span>
              <span className="text-xs font-bold text-emerald-600">
                {pipelineStatus.total_cases_analyzed} / {pipelineStatus.total_cases_registered} Cases ({pipelineStatus.coverage_percentage}%)
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Operational</span>
            </span>
          </div>
        )}
      </div>

      {/* Interactive Step Navigator */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {steps.map((s) => {
          const Icon = s.icon;
          const isSelected = activeStep === s.num;
          return (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-900 text-white border-slate-800 shadow-md ring-2 ring-blue-500/50"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    isSelected ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {s.num}
                </span>
                <Icon
                  className={`w-4 h-4 ${
                    isSelected ? "text-blue-400" : "text-slate-400"
                  }`}
                />
              </div>
              <p className="text-xs font-bold leading-snug line-clamp-2">
                {s.title}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Step Deep-Dive Card */}
      {(() => {
        const current = steps.find((s) => s.num === activeStep) || steps[0];
        const Icon = current.icon;
        return (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${current.color} text-white shadow-md`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      Phase {current.num} of 7
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {current.weight}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-0.5">
                    {current.title}
                  </h2>
                  <p className="text-xs text-slate-500">{current.subtitle}</p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>Deterministic & Verified</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {current.description}
            </p>

            {/* Inputs & Outputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                <h4 className="font-bold text-xs text-blue-900">
                  Primary Input Parameters Evaluated:
                </h4>
                <ul className="space-y-1 text-xs text-blue-800">
                  {current.inputs.map((inp, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span>{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                <h4 className="font-bold text-xs text-emerald-900">
                  Engine Outputs Generated:
                </h4>
                <ul className="space-y-1 text-xs text-emerald-800">
                  {current.outputs.map((out, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Triage Formula & Architecture Summary */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Hybrid Priority Scoring Equation</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-blue-200 overflow-x-auto leading-relaxed">
          Priority Score = (0.30 &times; Legal_Urgency) + (0.25 &times; Age_Score) + (0.20 &times; Stagnation_Score) + (0.20 &times; Delay_Risk) + (0.05 &times; Special_Flags)
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 text-center">
            <span className="font-bold text-red-400 block">Critical</span>
            <span className="text-slate-300 font-mono">Score &ge; 85</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 text-center">
            <span className="font-bold text-orange-400 block">High</span>
            <span className="text-slate-300 font-mono">Score 70 - 84</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 text-center">
            <span className="font-bold text-amber-400 block">Medium</span>
            <span className="text-slate-300 font-mono">Score 45 - 69</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 text-center">
            <span className="font-bold text-emerald-400 block">Routine</span>
            <span className="text-slate-300 font-mono">Score &lt; 45</span>
          </div>
        </div>
      </div>
    </div>
  );
};
