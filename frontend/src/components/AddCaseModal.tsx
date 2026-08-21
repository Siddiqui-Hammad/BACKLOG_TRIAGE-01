import React, { useState } from "react";
import { X, PlusCircle, Scale, AlertCircle } from "lucide-react";
import { api } from "../services/api";

interface AddCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (caseId: string) => void;
}

export const AddCaseModal: React.FC<AddCaseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    case_id: "",
    case_title: "",
    case_type: "Civil Suit (Money Recovery)",
    filed_date: "2023-05-12",
    current_stage: "Petitioner / Prosecution Evidence",
    last_progress_date: "2024-02-10",
    num_hearings: 6,
    num_adjournments: 3,
    recent_adjournments: 1,
    custody_indicator: false,
    days_in_custody: 0,
    urgency_category: "",
    statutory_deadline: "",
    court_room: "Court Room 1 - District Court",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        num_hearings: Number(formData.num_hearings),
        num_adjournments: Number(formData.num_adjournments),
        recent_adjournments: Number(formData.recent_adjournments),
        days_in_custody: Number(formData.days_in_custody),
        urgency_category: formData.urgency_category || undefined,
        statutory_deadline: formData.statutory_deadline || undefined,
      };
      const res = await api.createCase(payload);
      onSuccess(res.case_id);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create case");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm">Add Case to Judicial Docket</h2>
              <p className="text-[11px] text-slate-300">
                Trigger real-time 7-Step Triage pipeline upon registration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Case Identifier (CNR / Case ID) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. DL-2023-4589"
                value={formData.case_id}
                onChange={(e) =>
                  setFormData({ ...formData, case_id: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Case Title (Petitioner vs Respondent) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar vs Suresh Verma"
                value={formData.case_title}
                onChange={(e) =>
                  setFormData({ ...formData, case_title: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dispute Classification / Case Type
              </label>
              <select
                value={formData.case_type}
                onChange={(e) =>
                  setFormData({ ...formData, case_type: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Civil Suit (Money Recovery)">
                  Civil Suit (Money Recovery)
                </option>
                <option value="Criminal Case (IPC 420/406 Fraud)">
                  Criminal Case (IPC 420/406 Fraud)
                </option>
                <option value="NI Act Section 138 (Cheque Bounce)">
                  NI Act Section 138 (Cheque Bounce)
                </option>
                <option value="Motor Accident Claim (MACT)">
                  Motor Accident Claim (MACT)
                </option>
                <option value="Matrimonial Dispute (HMA / Maintenance)">
                  Matrimonial Dispute (HMA / Maintenance)
                </option>
                <option value="Land Acquisition & Title Dispute">
                  Land Acquisition & Title Dispute
                </option>
                <option value="Commercial Summary Suit (Order 37 CPC)">
                  Commercial Summary Suit (Order 37 CPC)
                </option>
                <option value="Bail Application & Criminal Revision">
                  Bail Application & Criminal Revision
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Procedural Stage
              </label>
              <select
                value={formData.current_stage}
                onChange={(e) =>
                  setFormData({ ...formData, current_stage: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Filing / Summons & Notice">
                  Filing / Summons & Notice
                </option>
                <option value="Written Statement / Pleadings">
                  Written Statement / Pleadings
                </option>
                <option value="Framing of Issues & Admissions">
                  Framing of Issues & Admissions
                </option>
                <option value="Petitioner / Prosecution Evidence">
                  Petitioner / Prosecution Evidence
                </option>
                <option value="Respondent / Defence Evidence">
                  Respondent / Defence Evidence
                </option>
                <option value="Final Arguments">Final Arguments</option>
                <option value="Order / Judgment Reserve">
                  Order / Judgment Reserve
                </option>
                <option value="Execution Petition">Execution Petition</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date of Institution (Filing Date)
              </label>
              <input
                type="date"
                required
                value={formData.filed_date}
                onChange={(e) =>
                  setFormData({ ...formData, filed_date: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Last Meaningful Progress Date
              </label>
              <input
                type="date"
                required
                value={formData.last_progress_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    last_progress_date: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Hearings Held
              </label>
              <input
                type="number"
                min="0"
                value={formData.num_hearings}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    num_hearings: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Adjournments Granted
              </label>
              <input
                type="number"
                min="0"
                value={formData.num_adjournments}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    num_adjournments: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recent Consecutive Adjournments
              </label>
              <input
                type="number"
                min="0"
                value={formData.recent_adjournments}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    recent_adjournments: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Statutory Target Deadline (Optional)
              </label>
              <input
                type="date"
                value={formData.statutory_deadline}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    statutory_deadline: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Special Urgency Category
              </label>
              <select
                value={formData.urgency_category}
                onChange={(e) =>
                  setFormData({ ...formData, urgency_category: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">None / Standard</option>
                <option value="Senior Citizen (72 Yrs)">
                  Senior Citizen Litigant (&gt;65 Yrs)
                </option>
                <option value="Undertrial Custody Threshold">
                  Undertrial Incarceration
                </option>
                <option value="Interim Maintenance Urgency">
                  Maintenance / Domestic Violence
                </option>
                <option value="Personal Liberty / Bail">
                  Personal Liberty / Bail Matter
                </option>
                <option value="Child Custody Matter">
                  Child Custody / Guardianship
                </option>
              </select>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.custody_indicator}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      custody_indicator: e.target.checked,
                    })
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Accused in Judicial Custody</span>
              </label>
              {formData.custody_indicator && (
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    placeholder="Days in Custody"
                    value={formData.days_in_custody}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        days_in_custody: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 transition disabled:opacity-50 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{loading ? "Analyzing & Adding..." : "Add & Prioritize"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
