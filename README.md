# Judicial Case Backlog Triage Engine
### Smart India Hackathon (SIH) Working Prototype

> **Judicial Decision-Support Advisory Notice**:
> "THE SYSTEM DOES NOT MAKE JUDICIAL DECISIONS. It only analyzes case information, detects patterns, flags urgency, estimates delay risk, identifies possible resolution opportunities, and recommends priority. The final decision ALWAYS remains with the judge/court authority."

---

## ?? Architecture Overview & 7-Step Triage Pipeline

```
                     COURT CASE DATA
                            ?
               [STEP 1] LEGAL RULE CHECKS
            (Custody >180d, Senior Citizens, Deadlines)
                            ?
             [STEP 2] AGEING & HORIZON ANALYSIS
            (Recent, Ageing, Long Pending, Delayed)
                            ?
              [STEP 3] STAGNATION DETECTION
          (Inactive Days, Adjournment/Hearing Ratios)
                            ?
             [STEP 4] DELAY RISK PREDICTION
       (Deterministic ML Estimated Timeline & Confidence)
                            ?
         [STEP 5] FAST-TRACK / ADR ELIGIBILITY
        (Mediation, Lok Adalat, Special Bench Matching)
                            ?
          [STEP 6] HYBRID PRIORITY SCORING
        (Weighted Score: 30% Legal + 25% Age + 20% Stagnation
         + 20% Delay Risk + 5% Special Urgency)
                            ?
            [STEP 7] EXPLAINABILITY & DOSSIER
          (Natural Language Justification for Bench)
                            ?
        JUDGE REVIEW + FEEDBACK + FINAL DECISION
     (Accept / Modify / Defer / Override with Audit Trail)
```

---

## ?? Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Start the Backend API (FastAPI)
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
python run.py
```
*Backend runs at: `http://127.0.0.1:8000` (Interactive API docs at `http://127.0.0.1:8000/docs`)*

### 2. Start the Frontend Application (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at: `http://localhost:5173`*

---

## ?? Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts
- **Backend**: Python 3, FastAPI, SQLAlchemy ORM, SQLite database, Pydantic v2, Scikit-learn
- **Dataset**: 150 realistic Indian court cases spanning Civil Suits, Criminal IPC fraud, Section 138 NI Act, MACT claims, Matrimonial disputes, Land Acquisition, and Bail matters.

---

## ?? Demonstration Workflow for Hackathon Judges

1. **Executive Dashboard**:
   - View live summary cards broken down by **Critical** (Red), **High** (Orange), **Medium** (Yellow), **Routine** (Green), and **Fast-Track Eligible** (Purple).
   - Inspect the interactive **Priority Donut Chart** and **Delay Risk Distribution Bar Chart**.
   - Review high-priority actionable triggers (e.g. Undertrials crossing threshold).

2. **Case List & Search**:
   - Filter cases by priority tier, procedural stage, ADR status, or delay risk.
   - Search by CNR / Case ID (e.g., `DL-2018-1001`), Litigant name, or Case type.
   - Export the prioritized docket directly to CSV.

3. **Case Dossier & Explainability**:
   - Click on any case (e.g. Critical undertrial case) to view the complete plain-English AI narrative explaining why the case was prioritized.
   - Inspect the granular 5-factor scoring breakdown bars.
   - Check the ML estimated disposal timeline and ADR opportunity status (Lok Adalat / Court Mediation).

4. **Judge Review & Feedback Loop**:
   - Select an action: *Accept Recommendation*, *Modify Priority*, *Defer*, or *Override*.
   - Assign a final judicial determination, enter court directives/notes, and click **Confirm & Save Judicial Decision**.
   - Observe immediate persistence in the SQLite backend and view historical entries in the **Audit & Reports** section.

5. **7-Step Triage Engine Explorer**:
   - Interactively click through each of the 7 modular engines to inspect input parameters, mathematical formulas, and generated outputs.
