import React, { useState } from "react";
import {
  FileText,
  Scale,
  Clock,
  TrendingUp,
  Handshake,
  CheckSquare,
  UserCheck,
  ArrowRight,
  Code,
  AlertTriangle,
  Lightbulb,
  Brain,
  Star,
  Check,
  Building,
  Calendar,
  Shield,
  Rocket,
  BarChart2,
  BookOpen,
} from "lucide-react";
import { Navbar } from "../components/Navbar";

export const TriageEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"models" | "rules" | "weights">("models");
  const [rules, setRules] = useState({
    undertrial: true,
    statutory: true,
    senior: true,
    compoundable: true,
    noProgress: true,
  });

  const flowSteps = [
    {
      num: 1,
      title: "Case Ingestion",
      points: ["Upload / Add Cases", "Extract Key Info"],
      icon: FileText,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      numBg: "bg-blue-100 text-blue-800",
    },
    {
      num: 2,
      title: "Legal & Procedural Urgency Check",
      points: ["Undertrial Rules", "Statutory Deadlines", "Vulnerable Cases"],
      icon: Scale,
      color: "bg-rose-50 text-rose-600 border-rose-100",
      numBg: "bg-rose-100 text-rose-800",
    },
    {
      num: 3,
      title: "Ageing & Stagnation Analysis",
      points: ["Case Age", "Stage Duration", "No-progress Detection"],
      icon: Clock,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      numBg: "bg-emerald-100 text-emerald-800",
    },
    {
      num: 4,
      title: "Delay Risk Prediction",
      points: ["ML + Pattern Analysis", "Historical Trends", "Risk Scoring"],
      icon: TrendingUp,
      color: "bg-amber-50 text-amber-600 border-amber-100",
      numBg: "bg-amber-100 text-amber-800",
    },
    {
      num: 5,
      title: "Resolution Opportunity Check",
      points: ["Fast-Track Review", "Mediation / Conciliation", "Lok Adalat"],
      icon: Handshake,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
      numBg: "bg-indigo-100 text-indigo-800",
    },
    {
      num: 6,
      title: "Hybrid Priority Scoring",
      points: ["Weighted Scoring", "Explainable Factors", "Transparent Logic"],
      icon: CheckSquare,
      color: "bg-sky-50 text-sky-600 border-sky-100",
      numBg: "bg-sky-100 text-sky-800",
    },
    {
      num: 7,
      title: "Judge Review",
      points: ["Accept / Modify", "Defer / Override", "Feedback Loop"],
      icon: UserCheck,
      color: "bg-teal-50 text-teal-600 border-teal-100",
      numBg: "bg-teal-100 text-teal-800",
    },
  ];

  return (
    <div className="flex-1 bg-[#f8fafc] flex flex-col min-h-screen overflow-y-auto">
      <Navbar
        title="Triage Engine"
        subtitle="How your cases are analyzed and prioritized"
      />

      <div className="p-8 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Top Banner with 7-Step Pipeline Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">How the Triage Engine Works</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Multi-layered analysis to identify urgent, delayed and fast-resolution cases
              </p>
            </div>
            <button
              onClick={() => alert("Deterministic Weighted Scoring Logic: Score = 0.30*Legal + 0.25*Age + 0.20*Stagnation + 0.20*DelayRisk + 0.05*Other")}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-[11px] font-bold text-slate-700 transition flex items-center gap-1.5 self-start shadow-sm"
            >
              <Code className="w-3.5 h-3.5" />
              <span>View Code Logic &lt;/&gt;</span>
            </button>
          </div>

          {/* 7 Connected Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 items-stretch">
            {flowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="relative flex flex-col">
                  <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex flex-col justify-between h-full hover:border-indigo-300 transition">
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className={`w-5 h-5 rounded-full ${step.numBg} text-[10px] font-bold flex items-center justify-center`}>
                          {step.num}
                        </span>
                        <div className={`p-1.5 rounded-lg ${step.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 leading-tight mb-2">
                        {step.title}
                      </h3>
                      <ul className="space-y-1 text-[10px] text-slate-500">
                        {step.points.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {idx < flowSteps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle Section: 3 Deep-Dive Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Card 1: Priority Scoring Framework (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Priority Scoring Framework</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Transparent and explainable scoring system</p>

              {/* Score Donut Meter */}
              <div className="mt-4 flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-indigo-600"
                      strokeDasharray="85, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-extrabold text-slate-900">85%</span>
                    <span className="text-[8px] text-slate-400 font-medium">Priority Score</span>
                  </div>
                </div>

                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Critical</span>
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">(Threshold: 85-100)</p>
                </div>
              </div>

              {/* Score Contribution Bars */}
              <div className="mt-4 space-y-2.5">
                <div className="text-[11px] font-bold text-slate-700">Score Contribution:</div>
                <div className="space-y-2 text-[10px]">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600">Legal Urgency</span>
                      <span className="font-bold text-slate-900">30%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: "30%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600">Case Age</span>
                      <span className="font-bold text-slate-900">25%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600">Stagnation</span>
                      <span className="font-bold text-slate-900">20%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600">Delay Risk</span>
                      <span className="font-bold text-slate-900">20%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600">Other Factors</span>
                      <span className="font-bold text-slate-900">5%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "5%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Critical? Box */}
            <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-indigo-950">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 mb-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
                <span>Why Critical?</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600">
                <li>• Pending for 4.2 years</li>
                <li>• No meaningful progress for 11 months</li>
                <li>• Repeated adjournments (12)</li>
                <li>• High predicted delay risk (82%)</li>
              </ul>
            </div>
          </div>

          {/* Card 2: AI Models & Analysis (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">AI Models & Analysis</h3>
                </div>
                {/* Tabs */}
                <div className="flex p-0.5 bg-slate-100 rounded-lg text-[10px] font-bold">
                  {(["models", "rules", "weights"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`px-2.5 py-1 rounded-md capitalize transition ${
                        activeTab === t ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Models List */}
              <div className="space-y-2.5">
                {/* Model 1 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <Brain className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Stagnation Detection Model</h4>
                      <p className="text-[10px] text-slate-500">Identifies long-pending cases with no meaningful progress</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold text-[10px] shrink-0">
                    Accuracy <span className="text-indigo-700">94.2%</span>
                  </span>
                </div>

                {/* Model 2 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Delay Risk Prediction Model</h4>
                      <p className="text-[10px] text-slate-500">Predicts likelihood of further delay using historical patterns</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold text-[10px] shrink-0">
                    Accuracy <span className="text-blue-700">91.8%</span>
                  </span>
                </div>

                {/* Model 3 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                      <Handshake className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Resolution Opportunity Model</h4>
                      <p className="text-[10px] text-slate-500">Identifies cases suitable for fast-track / mediation</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold text-[10px] shrink-0">
                    Accuracy <span className="text-purple-700">89.6%</span>
                  </span>
                </div>

                {/* Model 4 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Priority Classification Engine</h4>
                      <p className="text-[10px] text-slate-500">Hybrid scoring with rule + ML based approach</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] shrink-0">
                    Explainable 100%
                  </span>
                </div>
              </div>
            </div>

            {/* Key Features Checkmarks */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[10px] font-bold text-slate-700 mb-2">Key Features Used for Analysis:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-600 font-medium">
                <span className="flex items-center gap-1 text-emerald-700">
                  <Check className="w-3 h-3 text-emerald-600" /> Case Age
                </span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <Check className="w-3 h-3 text-emerald-600" /> Last Progress Date
                </span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <Check className="w-3 h-3 text-emerald-600" /> Hearing History
                </span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <Check className="w-3 h-3 text-emerald-600" /> Adjournment Count
                </span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <Check className="w-3 h-3 text-emerald-600" /> Case Category
                </span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <Check className="w-3 h-3 text-emerald-600" /> Current Stage
                </span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <Check className="w-3 h-3 text-emerald-600" /> Undertrial Status
                </span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <Check className="w-3 h-3 text-emerald-600" /> Statutory Deadlines
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Configurable Rule Engine (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-slate-900">Configurable Rule Engine</h3>
                <button
                  onClick={() => alert("Rule Configuration settings are active in prototype mode.")}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Edit Rules
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mb-3">Legal and procedural urgency rules (prototype)</p>

              {/* Toggles */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Scale className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-800">Undertrial Threshold Alert</div>
                      <div className="text-[9px] text-slate-400">Flag undertrial cases crossing configured limit</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={rules.undertrial}
                    onChange={(e) => setRules({ ...rules, undertrial: e.target.checked })}
                    className="toggle-checkbox w-4 h-4 text-indigo-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-800">Statutory Deadline Alert</div>
                      <div className="text-[9px] text-slate-400">Flag cases nearing legal deadline</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={rules.statutory}
                    onChange={(e) => setRules({ ...rules, statutory: e.target.checked })}
                    className="toggle-checkbox w-4 h-4 text-indigo-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-800">Senior Citizen / Vulnerable</div>
                      <div className="text-[9px] text-slate-400">Give higher urgency weightage</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={rules.senior}
                    onChange={(e) => setRules({ ...rules, senior: e.target.checked })}
                    className="toggle-checkbox w-4 h-4 text-indigo-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Handshake className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-800">Compoundable Offences</div>
                      <div className="text-[9px] text-slate-400">Identify settlement opportunities</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={rules.compoundable}
                    onChange={(e) => setRules({ ...rules, compoundable: e.target.checked })}
                    className="toggle-checkbox w-4 h-4 text-indigo-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-800">No Progress &gt; 6 Months</div>
                      <div className="text-[9px] text-slate-400">Mark cases with long inactivity</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={rules.noProgress}
                    onChange={(e) => setRules({ ...rules, noProgress: e.target.checked })}
                    className="toggle-checkbox w-4 h-4 text-indigo-600 rounded"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => alert("Full rule configuration modal")}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 text-center transition flex items-center justify-center gap-1.5"
            >
              <span>View Full Rule Configuration</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Bottom Section: Engine Impact (Prototype) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h4 className="text-xs font-bold text-slate-900 mb-3">Engine Impact (Prototype)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900">27–35%</div>
                  <div className="text-[10px] text-slate-500 font-medium">Est. Backlog Reduction</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900">40%</div>
                  <div className="text-[10px] text-slate-500 font-medium">Faster Case Movement</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900">2.3x</div>
                  <div className="text-[10px] text-slate-500 font-medium">Delay Risk Identification</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Handshake className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900">68%</div>
                  <div className="text-[10px] text-slate-500 font-medium">Fast-Resolution Opportunities</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert("Research papers and legal datasets referenced: National Judicial Data Grid (NJDG), Law Commission of India 245th Report.")}
            className="w-full lg:w-auto px-5 py-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 rounded-xl transition flex items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-2.5 text-left">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <div>
                <div className="text-xs font-bold">View Methodology & References</div>
                <div className="text-[10px] text-indigo-600">See research, datasets and references used</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </div>
    </div>
  );
};
