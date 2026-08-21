import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { CaseList } from "./pages/CaseList";
import { CaseDetails } from "./pages/CaseDetails";
import { TriageEngine } from "./pages/TriageEngine";
import { Alerts } from "./pages/Alerts";
import { Reports } from "./pages/Reports";

export function App() {
  return (
    <Router>
      <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] font-sans antialiased text-slate-800">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cases" element={<CaseList />} />
            <Route path="/cases/:caseId" element={<CaseDetails />} />
            <Route path="/triage" element={<TriageEngine />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<TriageEngine />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
