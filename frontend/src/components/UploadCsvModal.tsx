import React, { useState } from "react";
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { api } from "../services/api";

interface UploadCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadCsvModal: React.FC<UploadCsvModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.uploadCsv(file);
      setResult(res.message);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1400);
    } catch (err: any) {
      setError(err.message || "Failed to process CSV file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="font-bold text-sm">Bulk Case Ingestion (CSV)</h2>
              <p className="text-[11px] text-slate-300">
                Upload court docket cases for automated multi-factor prioritization
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-md transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{result}</span>
            </div>
          )}

          {/* Drag & Drop Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
              isDragOver
                ? "border-blue-500 bg-blue-50/50"
                : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
            }`}
          >
            <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">
              Drag & Drop case docket CSV file here
            </p>
            <p className="text-[11px] text-slate-500 mt-1">or browse your system</p>
            <input
              type="file"
              accept=".csv"
              id="csvFileInput"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <label
              htmlFor="csvFileInput"
              className="inline-block mt-3 px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-sm transition"
            >
              Select CSV File
            </label>

            {file && (
              <div className="mt-4 p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center justify-between text-left">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold truncate max-w-[220px]">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-blue-600 font-medium">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-blue-500 hover:text-blue-800 text-xs font-bold"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
            <span>Supports headers: case_id, case_title, case_type, filed_date, current_stage...</span>
            <a
              href="/api/cases/export"
              download="sample_cases.csv"
              className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <Download className="w-3 h-3" />
              <span>Download Docket Sample</span>
            </a>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!file || uploading}
              onClick={handleUpload}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 transition disabled:opacity-50 flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{uploading ? "Ingesting & Triaging..." : "Upload & Prioritize"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
