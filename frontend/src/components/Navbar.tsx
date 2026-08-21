import React from "react";
import {
  Scale,
  PlusCircle,
  Upload,
  RefreshCw,
  Clock,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

interface NavbarProps {
  onAddCase: () => void;
  onUploadCsv: () => void;
  onReanalyzeAll: () => void;
  isAnalyzing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onAddCase,
  onUploadCsv,
  onReanalyzeAll,
  isAnalyzing = false,
}) => {
  const currentDate = "21 Aug 2026 | New Delhi Bench";

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Court Branch & Bench Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">
              District & Sessions Court Triage System
            </h1>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{currentDate}</span>
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-medium">
          <Sparkles className="w-3 h-3 text-blue-600" />
          <span>7-Phase Hybrid Scoring Active</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onReanalyzeAll}
          disabled={isAnalyzing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition disabled:opacity-50"
          title="Run 7-Step Triage pipeline across all registered cases"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-slate-500 ${
              isAnalyzing ? "animate-spin" : ""
            }`}
          />
          <span className="hidden sm:inline">
            {isAnalyzing ? "Triaging Docket..." : "Re-Prioritize All"}
          </span>
        </button>

        <button
          onClick={onUploadCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition"
        >
          <Upload className="w-3.5 h-3.5 text-blue-600" />
          <span>Upload CSV</span>
        </button>

        <button
          onClick={onAddCase}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Case</span>
        </button>
      </div>
    </header>
  );
};
