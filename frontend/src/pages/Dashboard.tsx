import React, { useEffect, useState } from "react";
import {
  AlertOctagon,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ArrowRight,
  TrendingUp,
  Clock,
  PauseCircle,
  FileCheck,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DashboardStats } from "../types";
import { api } from "../services/api";

interface DashboardProps {
  onNavigateToCases: (filter?: Record<string, string>) => void;
  onNavigateToCaseDetail: (caseId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigateToCases,
  onNavigateToCaseDetail,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboard();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500">
            Synthesizing 7-Step Triage Docket Intelligence...
          </p>
        </div>
      </div>
    );
  }

  // Chart Data
  const priorityChartData = [
    { name: "Critical", value: stats.summary_cards.critical, color: "#ef4444" },
    { name: "High", value: stats.summary_cards.high, color: "#f97316" },
    { name: "Medium", value: stats.summary_cards.medium, color: "#eab308" },
    { name: "Routine", value: stats.summary_cards.routine, color: "#10b981" },
  ];

  const delayChartData = [
    {
      category: "High Delay Risk",
      count: stats.delay_distribution.high_delay,
      fill: "#ef4444",
    },
    {
      category: "Medium Delay Risk",
      count: stats.delay_distribution.medium_delay,
      fill: "#f59e0b",
    },
    {
      category: "Low Delay Risk",
      count: stats.delay_distribution.low_delay,
      fill: "#10b981",
    },
  ];

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto">
      {/* Top Banner Notice */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-800/60">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">
              Judicial Case Backlog Triage Engine
            </h2>
            <p className="text-xs text-blue-200 mt-0.5 max-w-2xl leading-relaxed">
              Multi-factor hybrid prioritization combining statutory legal rules,
              stagnation detection, age analysis, and ML delay risk.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateToCases()}
          className="shrink-0 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2"
        >
          <span>View Prioritized Docket</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 5 Core Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Critical Card */}
        <div
          onClick={() => onNavigateToCases({ priority: "Critical" })}
          className="bg-white p-4 rounded-xl border border-red-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-red-600 tracking-wider uppercase">
              Critical
            </span>
            <div className="p-1.5 rounded-md bg-red-50 text-red-600 group-hover:scale-110 transition">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-700">
              {stats.summary_cards.critical}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">cases</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Score &ge; 85 | Immediate listing
          </p>
        </div>

        {/* High Card */}
        <div
          onClick={() => onNavigateToCases({ priority: "High" })}
          className="bg-white p-4 rounded-xl border border-orange-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-orange-600 tracking-wider uppercase">
              High Priority
            </span>
            <div className="p-1.5 rounded-md bg-orange-50 text-orange-600 group-hover:scale-110 transition">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-orange-700">
              {stats.summary_cards.high}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">cases</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Score 70-84 | Urgent attention
          </p>
        </div>

        {/* Medium Card */}
        <div
          onClick={() => onNavigateToCases({ priority: "Medium" })}
          className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-600 tracking-wider uppercase">
              Medium
            </span>
            <div className="p-1.5 rounded-md bg-amber-50 text-amber-600 group-hover:scale-110 transition">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700">
              {stats.summary_cards.medium}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">cases</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Score 45-69 | Standard roster
          </p>
        </div>

        {/* Routine Card */}
        <div
          onClick={() => onNavigateToCases({ priority: "Routine" })}
          className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-600 tracking-wider uppercase">
              Routine
            </span>
            <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 group-hover:scale-110 transition">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">
              {stats.summary_cards.routine}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">cases</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Score &lt; 45 | Regular progression
          </p>
        </div>

        {/* Fast-Track Opportunity Card */}
        <div
          onClick={() => onNavigateToCases({ fast_track: "Eligible" })}
          className="bg-white p-4 rounded-xl border border-purple-200/80 shadow-sm hover:shadow-md transition cursor-pointer group col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-600 tracking-wider uppercase">
              Fast-Track / ADR
            </span>
            <div className="p-1.5 rounded-md bg-purple-50 text-purple-600 group-hover:scale-110 transition">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-700">
              {stats.summary_cards.fast_track_eligible}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">cases</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Mediation / Lok Adalat candidates
          </p>
        </div>
      </div>

      {/* 3 Core System Health KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Pending Cases</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">
              {stats.total_pending_cases} Cases
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Average Pendency Age</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">
              {stats.avg_case_age_years} Years
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
            <PauseCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Stagnating Cases (&gt;90d inactive)</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">
              {stats.stagnating_cases_count} Cases
            </p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Row: Donut Chart & Horizontal Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Breakdown Donut Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Docket Breakdown by Triage Priority
              </h3>
              <p className="text-xs text-slate-500">
                Determined by 7-phase hybrid weighted model
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Live Roster
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {priorityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} cases`, "Count"]}
                  contentStyle={{
                    borderRadius: "8px",
                    fontSize: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "11px", fontWeight: "600" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delay Status Overview Horizontal Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Delay Risk & Stagnation Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Procedural hearing ratios & inactivity timelines
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Risk Distribution
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={delayChartData}
                margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
              >
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fontSize: 11, fontWeight: "500" }}
                />
                <Tooltip
                  formatter={(value: any) => [`${value} cases`, "Cases"]}
                  contentStyle={{
                    borderRadius: "8px",
                    fontSize: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {delayChartData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actionable Alerts */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-sm text-slate-900">
              High-Impact Actionable Triage Alerts
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Rule-Based & Predictive Triggers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {stats.quick_alerts.map((alert, idx) => (
            <div
              key={idx}
              onClick={() => onNavigateToCases(alert.filter)}
              className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    alert.severity === "Critical"
                      ? "bg-red-100 text-red-700"
                      : alert.severity === "High"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {alert.type}
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {alert.count} cases
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 leading-snug">
                {alert.title}
              </p>
              <div className="mt-2 text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                <span>Filter docket</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prominent Disclaimer Footer */}
      <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-300 text-center text-xs text-slate-600">
        <span className="font-bold text-slate-800">Judicial Notice: </span>
        {stats.disclaimer}
      </div>
    </div>
  );
};
