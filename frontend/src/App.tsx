import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./pages/Dashboard";
import { CaseList } from "./pages/CaseList";
import { CaseDetails } from "./pages/CaseDetails";
import { TriageEngine } from "./pages/TriageEngine";
import { Alerts } from "./pages/Alerts";
import { Reports } from "./pages/Reports";
import { AddCaseModal } from "./components/AddCaseModal";
import { UploadCsvModal } from "./components/UploadCsvModal";
import { api } from "./services/api";

export function App() {
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [caseFilter, setCaseFilter] = useState<Record<string, string> | undefined>(undefined);

  // Modals
  const [isAddCaseOpen, setIsAddCaseOpen] = useState(false);
  const [isUploadCsvOpen, setIsUploadCsvOpen] = useState(false);
  const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);

  const handleNavigateToCases = (filter?: Record<string, string>) => {
    setCaseFilter(filter);
    setSelectedCaseId(null);
    setCurrentTab("cases");
  };

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentTab("case-details");
  };

  const handleReanalyzeAll = async () => {
    try {
      setIsAnalyzingAll(true);
      await api.analyzeAllCases();
      // Reload current tab by resetting
      setCurrentTab((prev) => prev);
      alert("7-Step Triage pipeline successfully executed across the entire court docket!");
    } catch (err: any) {
      alert(err.message || "Failed to run batch triage");
    } finally {
      setIsAnalyzingAll(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
      {/* Navy Dark Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setSelectedCaseId(null);
          setCurrentTab(tab);
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          onAddCase={() => setIsAddCaseOpen(true)}
          onUploadCsv={() => setIsUploadCsvOpen(true)}
          onReanalyzeAll={handleReanalyzeAll}
          isAnalyzing={isAnalyzingAll}
        />

        {/* Page Switcher */}
        <main className="flex-1 flex overflow-hidden bg-slate-50">
          {currentTab === "dashboard" && (
            <Dashboard
              onNavigateToCases={handleNavigateToCases}
              onNavigateToCaseDetail={handleSelectCase}
            />
          )}

          {currentTab === "cases" && (
            <CaseList
              initialFilter={caseFilter}
              onSelectCase={handleSelectCase}
            />
          )}

          {currentTab === "case-details" && selectedCaseId && (
            <CaseDetails
              caseId={selectedCaseId}
              onBack={() => setCurrentTab("cases")}
            />
          )}

          {currentTab === "triage" && <TriageEngine />}

          {currentTab === "alerts" && (
            <Alerts onSelectCase={handleSelectCase} />
          )}

          {currentTab === "reports" && <Reports />}
        </main>
      </div>

      {/* Add Case Modal */}
      <AddCaseModal
        isOpen={isAddCaseOpen}
        onClose={() => setIsAddCaseOpen(false)}
        onSuccess={(newCaseId) => {
          handleSelectCase(newCaseId);
        }}
      />

      {/* Upload CSV Modal */}
      <UploadCsvModal
        isOpen={isUploadCsvOpen}
        onClose={() => setIsUploadCsvOpen(false)}
        onSuccess={() => {
          handleNavigateToCases();
        }}
      />
    </div>
  );
}

export default App;
