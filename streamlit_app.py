import os
import sys
import json
import io
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st
from datetime import datetime

# Include backend in path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from app.database import init_db, SessionLocal
from app.data.seed_data import generate_realistic_cases
from app.models.case_model import Case, CaseAnalysisRecord, JudgeFeedback
from app.services.case_service import (
    get_dashboard_metrics,
    get_cases_list_service,
    get_case_detail_service,
    get_alerts_catalog,
    analyze_single_case,
    analyze_all_cases_service,
)
from app.config.settings import settings

st.set_page_config(
    page_title="Judicial Case Backlog Triage Engine | SIH Prototype",
    page_icon="⚖️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    .main-header {
        font-size: 22px;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 2px;
    }
    .sub-header {
        font-size: 13px;
        color: #64748b;
        margin-bottom: 18px;
    }
    .metric-card {
        background-color: #ffffff;
        border-radius: 12px;
        padding: 16px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .advisory-box {
        background-color: #f8fafc;
        border-left: 4px solid #2563eb;
        padding: 12px 16px;
        border-radius: 0 8px 8px 0;
        font-size: 12px;
        color: #334155;
        margin-top: 10px;
    }
</style>
""", unsafe_allow_html=True)

# Initialize Database & Seed data if needed
@st.cache_resource
def setup_data():
    init_db()
    db = SessionLocal()
    try:
        generate_realistic_cases(db, count=150)
    finally:
        db.close()
    return True

setup_data()

def get_db_session():
    return SessionLocal()

# Sidebar Navigation
st.sidebar.markdown("""
<div style="display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #334155;">
    <div style="font-size: 24px;">⚖️</div>
    <div>
        <div style="font-weight: 800; font-size: 15px; color: #ffffff; letter-spacing: 0.5px;">न्याय-TRIAGE</div>
        <div style="font-size: 11px; color: #94a3b8;">SIH Judicial Backlog Engine</div>
    </div>
</div>
""", unsafe_allow_html=True)

nav_page = st.sidebar.radio(
    "Navigation",
    [
        "🏛️ Overview Dashboard",
        "📋 Case Docket & Prioritized List",
        "🔍 Case Dossier & Judge Review",
        "⚙️ 7-Step Triage Engine Explorer",
        "🚨 Actionable Alerts Center",
        "📊 Audit & Backlog Reports",
        "➕ Ingest Cases (Manual / CSV)"
    ]
)

st.sidebar.markdown("---")
st.sidebar.markdown("""
<div class="advisory-box">
    <b>Judicial Advisory Notice:</b><br/>
    AI assists in prioritization based on configured legal rules, case history and predictive analysis. Final decisions remain with the judicial authority.
</div>
""", unsafe_allow_html=True)

# -------------------------------------------------------------
# PAGE 1: OVERVIEW DASHBOARD
# -------------------------------------------------------------
if nav_page == "🏛️ Overview Dashboard":
    st.markdown('<div class="main-header">🏛️ Judicial Case Backlog Triage Engine</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Executive Overview & Multi-Factor Hybrid Prioritization Docket</div>', unsafe_allow_html=True)

    db = get_db_session()
    dash = get_dashboard_metrics(db)
    cards = dash["summary_cards"]
    db.close()

    c1, c2, c3, c4, c5 = st.columns(5)
    with c1:
        st.metric(label="🔴 Critical Priority", value=f"{cards['critical']} cases", delta="Score ≥ 85", delta_color="inverse")
    with c2:
        st.metric(label="🟠 High Priority", value=f"{cards['high']} cases", delta="Score 70-84", delta_color="inverse")
    with c3:
        st.metric(label="🟡 Medium Priority", value=f"{cards['medium']} cases", delta="Score 45-69")
    with c4:
        st.metric(label="🟢 Routine Progression", value=f"{cards['routine']} cases", delta="Score < 45")
    with c5:
        st.metric(label="⚡ Fast-Track / ADR", value=f"{cards['fast_track_eligible']} cases", delta="Mediation / Lok Adalat")

    st.markdown("---")

    k1, k2, k3 = st.columns(3)
    with k1:
        st.info(f"📁 **Total Active Pending Cases**: {dash['total_pending_cases']} Cases (100% indexed)")
    with k2:
        st.warning(f"⏳ **Average Case Pendency Age**: {dash['avg_case_age_years']} Years across active roster")
    with k3:
        st.error(f"🛑 **Stagnating Cases (>90d inactive)**: {dash['stagnating_cases_count']} Cases flagged")

    col_chart1, col_chart2 = st.columns(2)

    with col_chart1:
        st.subheader("📊 Docket Breakdown by Triage Tier")
        df_pie = pd.DataFrame([
            {"Priority": "Critical", "Count": cards["critical"]},
            {"Priority": "High", "Count": cards["high"]},
            {"Priority": "Medium", "Count": cards["medium"]},
            {"Priority": "Routine", "Count": cards["routine"]},
        ])
        fig_pie = px.pie(
            df_pie,
            values="Count",
            names="Priority",
            color="Priority",
            color_discrete_map={"Critical": "#ef4444", "High": "#f97316", "Medium": "#eab308", "Routine": "#10b981"},
            hole=0.45
        )
        fig_pie.update_layout(margin=dict(t=10, b=10, l=10, r=10), height=280)
        st.plotly_chart(fig_pie, use_container_width=True)

    with col_chart2:
        st.subheader("📈 Delay Risk & Stagnation Distribution")
        df_bar = pd.DataFrame([
            {"Risk Level": "High Delay Risk", "Count": dash["delay_distribution"]["high_delay"]},
            {"Risk Level": "Medium Delay Risk", "Count": dash["delay_distribution"]["medium_delay"]},
            {"Risk Level": "Low Delay Risk", "Count": dash["delay_distribution"]["low_delay"]},
        ])
        fig_bar = px.bar(
            df_bar,
            x="Count",
            y="Risk Level",
            orientation="h",
            color="Risk Level",
            color_discrete_map={"High Delay Risk": "#ef4444", "Medium Delay Risk": "#f59e0b", "Low Delay Risk": "#10b981"}
        )
        fig_bar.update_layout(margin=dict(t=10, b=10, l=10, r=10), height=280, showlegend=False)
        st.plotly_chart(fig_bar, use_container_width=True)

    st.subheader("🚨 High-Impact Actionable Triage Alerts")
    for a in dash["quick_alerts"]:
        if a["severity"] == "Critical":
            st.error(f"🔴 **{a['type']}**: {a['title']} ({a['count']} cases flagged)")
        elif a["severity"] == "High":
            st.warning(f"🟠 **{a['type']}**: {a['title']} ({a['count']} cases flagged)")
        else:
            st.info(f"🟡 **{a['type']}**: {a['title']} ({a['count']} cases flagged)")

# -------------------------------------------------------------
# PAGE 2: CASE DOCKET & PRIORITIZED LIST
# -------------------------------------------------------------
elif nav_page == "📋 Case Docket & Prioritized List":
    st.markdown('<div class="main-header">📋 Prioritized Court Docket List</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Strict Ranking: Critical (≥85) ➔ High (70-84) ➔ Medium (45-69) ➔ Routine (<45)</div>', unsafe_allow_html=True)

    db = get_db_session()

    f1, f2, f3, f4 = st.columns(4)
    with f1:
        p_filter = st.selectbox("Priority Tier", ["All", "Critical", "High", "Medium", "Routine"])
    with f2:
        stage_filter = st.selectbox("Procedural Stage", [
            "All", "Filing / Summons & Notice", "Written Statement / Pleadings",
            "Framing of Issues & Admissions", "Petitioner / Prosecution Evidence",
            "Respondent / Defence Evidence", "Final Arguments", "Order / Judgment Reserve"
        ])
    with f3:
        adr_filter = st.selectbox("ADR / Fast-Track Status", ["All", "Eligible", "Suitable", "Potentially Suitable"])
    with f4:
        search_query = st.text_input("🔍 Search Litigant / Case ID / Dispute", "")

    cases = get_cases_list_service(
        db,
        priority=p_filter if p_filter != "All" else None,
        stage=stage_filter if stage_filter != "All" else None,
        fast_track=adr_filter if adr_filter != "All" else None,
        search=search_query if search_query else None
    )
    db.close()

    st.write(f"Showing **{len(cases)}** matching prioritized cases:")

    df_display = pd.DataFrame([
        {
            "Case ID": c["case_id"],
            "Case Title": c["case_title"],
            "Dispute Type": c["case_type"],
            "Stage": c["current_stage"],
            "Priority Tier": c["priority"],
            "Priority Score": f"{c['priority_score']:.1f}/100",
            "Delay Risk": f"{c['delay_risk']}% ({c['delay_status']})",
            "Hearings / Adj": f"{c['num_hearings']} / {c['num_adjournments']}",
            "Fast-Track ADR": c["fast_track_status"]
        }
        for c in cases
    ])

    st.dataframe(df_display, use_container_width=True, height=420)

    csv_bytes = df_display.to_csv(index=False).encode('utf-8')
    st.download_button(
        label="📥 Download Prioritized Docket CSV",
        data=csv_bytes,
        file_name="prioritized_court_docket.csv",
        mime="text/csv"
    )

# -------------------------------------------------------------
# PAGE 3: CASE DOSSIER & JUDGE REVIEW
# -------------------------------------------------------------
elif nav_page == "🔍 Case Dossier & Judge Review":
    st.markdown('<div class="main-header">🔍 Judicial Case Dossier & Human-in-the-Loop Review</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Inspect Multi-Factor Scores, AI Explainability Narratives, and Persist Rulings</div>', unsafe_allow_html=True)

    db = get_db_session()
    all_cases = db.query(Case.case_id, Case.case_title, Case.case_type).all()
    case_choices = {f"{c[0]} — {c[1]} ({c[2]})": c[0] for c in all_cases}

    selected_choice = st.selectbox("Select Case to Inspect:", list(case_choices.keys()))
    selected_case_id = case_choices[selected_choice]

    case_detail = get_case_detail_service(selected_case_id, db)
    db.close()

    if case_detail:
        analysis = case_detail["analysis"]
        factors = analysis["factor_breakdown"]

        st.markdown(f"""
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); color: white; padding: 18px; border-radius: 12px; margin-bottom: 16px;">
            <div style="color: #60a5fa; font-weight: 700; font-size: 13px; margin-bottom: 6px;">🧠 AI Judicial Explainability Dossier</div>
            <div style="font-size: 13px; line-height: 1.6;">{analysis['narrative_explanation']}</div>
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #334155; font-size: 12px; color: #34d399;">
                <b>Recommended Operational Action:</b> {analysis['recommended_action']}
            </div>
        </div>
        """, unsafe_allow_html=True)

        col_dos, col_judge = st.columns([3, 2])

        with col_dos:
            st.subheader("⚖️ Procedural Case Snapshot")
            m1, m2, m3 = st.columns(3)
            with m1:
                st.write(f"**Dispute Type:** {case_detail['case_type']}")
                st.write(f"**Filed Date:** {case_detail['filed_date']}")
                st.write(f"**Age:** {analysis['case_age_years']} Yrs ({analysis['age_classification']})")
            with m2:
                st.write(f"**Current Stage:** {case_detail['current_stage']}")
                st.write(f"**Hearings:** {case_detail['num_hearings']}")
                st.write(f"**Adjournments:** {case_detail['num_adjournments']} ({case_detail['recent_adjournments']} recent)")
            with m3:
                st.write(f"**Custody Status:** {'Yes (' + str(case_detail['days_in_custody']) + ' days)' if case_detail['custody_indicator'] else 'No'}")
                st.write(f"**Statutory Target:** {case_detail['statutory_deadline'] or 'Standard'}")
                st.write(f"**Court Room:** {case_detail['court_room']}")

            st.markdown("---")
            st.subheader("📊 5-Factor Weighted Score Breakdown")
            st.write(f"1. **Legal & Custody Urgency** (Weight 30%): **+{factors['legal_urgency']:.1f}** / 30 pts")
            st.progress(min(1.0, factors["legal_urgency"] / 30.0))

            st.write(f"2. **Case Age & Pendency Horizon** (Weight 25%): **+{factors['case_age']:.1f}** / 25 pts")
            st.progress(min(1.0, factors["case_age"] / 25.0))

            st.write(f"3. **Procedural Inactivity & Stagnation** (Weight 20%): **+{factors['stagnation']:.1f}** / 20 pts")
            st.progress(min(1.0, factors["stagnation"] / 20.0))

            st.write(f"4. **Predictive Delay Risk** (Weight 20%): **+{factors['delay_risk']:.1f}** / 20 pts")
            st.progress(min(1.0, factors["delay_risk"] / 20.0))

            st.write(f"5. **Vulnerable Litigant Flag** (Weight 5%): **+{factors['other_factors']:.1f}** / 5 pts")
            st.progress(min(1.0, factors["other_factors"] / 5.0))

        with col_judge:
            st.subheader("⚡ ADR Opportunities")
            st.success(f"• **Fast-Track Bench**: {analysis['fast_track_status']}")
            st.info(f"• **Court Mediation**: {analysis['mediation_status']}")
            st.warning(f"• **National Lok Adalat**: {analysis['lok_adalat_status']}")

            st.markdown("---")
            st.subheader("👨‍⚖️ Judge Review Decision Form")
            st.caption("Judicial determination overrides live docket score with complete audit persistence.")

            with st.form(key=f"judge_form_{selected_case_id}"):
                j_action = st.selectbox("Action Taken:", [
                    "Accepted Recommendation",
                    "Changed Priority",
                    "Deferred Listing",
                    "Overridden with Special Reasons"
                ])
                j_decision = st.selectbox("Assigned Final Priority:", ["Critical", "High", "Medium", "Routine"], index=["Critical", "High", "Medium", "Routine"].index(analysis['priority_category']))
                j_reason = st.selectbox("Primary Judicial Reason:", [
                    "Statutory timeline and undertrial threshold verified",
                    "Priority elevated for vulnerable / Senior Citizen litigant",
                    "Referred to Lok Adalat / Court Mediation",
                    "Interlocutory applications pending; priority adjusted",
                    "Procedural adjournment granted upon mutual request"
                ])
                j_notes = st.text_area("Judge Directions / Notes:", "Hearing scheduled on priority roster.")

                submit_btn = st.form_submit_button("Confirm & Save Judicial Decision")

                if submit_btn:
                    db_w = get_db_session()
                    record = db_w.query(CaseAnalysisRecord).filter(CaseAnalysisRecord.case_id == selected_case_id).first()
                    fb_obj = JudgeFeedback(
                        case_id=selected_case_id,
                        engine_priority=analysis['priority_category'],
                        engine_action=analysis['recommended_action'],
                        judge_decision=j_decision,
                        action_taken=j_action,
                        reason=j_reason,
                        notes=j_notes
                    )
                    db_w.add(fb_obj)
                    if record and j_decision in ["Critical", "High", "Medium", "Routine"]:
                        record.priority_category = j_decision
                    db_w.commit()
                    db_w.close()
                    st.success("✅ Judicial determination recorded and applied to docket!")
                    st.rerun()

            if case_detail["latest_judge_feedback"]:
                st.info(f"**Last Judicial Determination ({case_detail['latest_judge_feedback']['timestamp']}):** {case_detail['latest_judge_feedback']['judge_decision']} ({case_detail['latest_judge_feedback']['action_taken']}) — *\"{case_detail['latest_judge_feedback']['notes']}\"*")

# -------------------------------------------------------------
# PAGE 4: 7-STEP TRIAGE ENGINE EXPLORER
# -------------------------------------------------------------
elif nav_page == "⚙️ 7-Step Triage Engine Explorer":
    st.markdown('<div class="main-header">⚙️ 7-Step Triage Engine Architecture</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Transparent, Explainable Multi-Layer Judicial Prioritization Pipeline</div>', unsafe_allow_html=True)

    steps_data = [
        ("Step 1: Legal & Statutory Rule Engine", "🔴 30% Weight", "Evaluates custody threshold (>180 days), senior citizen litigants (>65 yrs), maintenance/DV emergencies, and statutory deadlines (NI Act 138, Order 37 CPC)."),
        ("Step 2: Case Ageing & Horizon Engine", "🟠 25% Weight", "Calculates chronological age in days and years, classifying into Recent (<2y), Ageing (2-5y), Long Pending (5-10y), Severely Delayed (>10y)."),
        ("Step 3: Stagnation & Inactivity Engine", "🟡 20% Weight", "Detects procedural inertia via inactive days since last progress, hearing-to-adjournment ratios, and bottleneck stages."),
        ("Step 4: Deterministic ML Delay Predictor", "🟣 20% Weight", "Deterministic multi-factor regression estimating expected months to disposal, delay risk probability (0-100%), and model confidence %."),
        ("Step 5: Fast-Track & ADR Opportunity Engine", "🟢 Diversion", "Screens negotiable, settlement-friendly disputes (MACT, NI Act, Matrimonial recovery) for Mediation and Lok Adalat diversion."),
        ("Step 6: Hybrid Priority Scoring Algorithm", "🔵 Fusion", "Weighted synthesis into aggregate 0-100 score categorized into Critical (≥85), High (70-84), Medium (45-69), Routine (<45)."),
        ("Step 7: Natural Language Explainability Engine", "⚪ Transparency", "Translates mathematical vectors into human-readable judicial reasoning narratives for judges and registry officers.")
    ]

    for title, badge, desc in steps_data:
        with st.expander(f"{title} — [{badge}]", expanded=True):
            st.write(desc)

    st.markdown("""
    <div style="background-color: #0f172a; color: #93c5fd; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 12px; margin-top: 15px;">
        Priority Score = (0.30 × Legal_Urgency) + (0.25 × Age_Score) + (0.20 × Stagnation_Score) + (0.20 × Delay_Risk) + (0.05 × Special_Flags)
    </div>
    """, unsafe_allow_html=True)

# -------------------------------------------------------------
# PAGE 5: ACTIONABLE ALERTS CENTER
# -------------------------------------------------------------
elif nav_page == "🚨 Actionable Alerts Center":
    st.markdown('<div class="main-header">🚨 Actionable Judicial Alerts Center</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Automated Risk Safeguards, Stagnation Flags, and Settlement Triggers</div>', unsafe_allow_html=True)

    db = get_db_session()
    alerts = get_alerts_catalog(db)
    db.close()

    tab_all, tab_urg, tab_del, tab_upc, tab_opp = st.tabs([
        f"All Alerts ({len(alerts)})",
        "🔴 Urgent Safeguards",
        "⏳ Stagnation Triggers",
        "📅 Target Deadlines",
        "⚡ ADR Opportunities"
    ])

    def render_alerts(alert_list):
        if not alert_list:
            st.info("No active alerts in this category.")
            return
        for a in alert_list:
            if a["severity"] == "Critical":
                st.error(f"**[{a['severity']}] {a['case_id']} — {a['case_title']}**\n\n{a['message']}\n\n*Details: {a['details']}*")
            elif a["severity"] == "High":
                st.warning(f"**[{a['severity']}] {a['case_id']} — {a['case_title']}**\n\n{a['message']}\n\n*Details: {a['details']}*")
            else:
                st.info(f"**[{a['severity']}] {a['case_id']} — {a['case_title']}**\n\n{a['message']}\n\n*Details: {a['details']}*")

    with tab_all:
        render_alerts(alerts)
    with tab_urg:
        render_alerts([a for a in alerts if a["category"] == "URGENT"])
    with tab_del:
        render_alerts([a for a in alerts if a["category"] == "DELAY"])
    with tab_upc:
        render_alerts([a for a in alerts if a["category"] == "UPCOMING"])
    with tab_opp:
        render_alerts([a for a in alerts if a["category"] == "OPPORTUNITY"])

# -------------------------------------------------------------
# PAGE 6: AUDIT & BACKLOG REPORTS
# -------------------------------------------------------------
elif nav_page == "📊 Audit & Backlog Reports":
    st.markdown('<div class="main-header">📊 Audit & Backlog Reports</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Judicial Decision Audit Trail, Disposal Analytics, and Governance Logs</div>', unsafe_allow_html=True)

    db = get_db_session()
    records = db.query(JudgeFeedback, Case).join(Case, JudgeFeedback.case_id == Case.case_id).order_by(JudgeFeedback.created_at.desc()).all()
    db.close()

    st.subheader(f"👨‍⚖️ Recorded Judicial Determinations ({len(records)} entries)")

    if not records:
        st.info("No judge review feedback has been logged yet. Review any case in the Case Dossier tab to populate this audit log.")
    else:
        df_fb = pd.DataFrame([
            {
                "Timestamp": str(fb.created_at),
                "Case ID": fb.case_id,
                "Case Title": c.case_title,
                "AI Recommendation": fb.engine_priority,
                "Judge Ruling": fb.judge_decision,
                "Action Taken": fb.action_taken,
                "Reason / Directives": fb.reason or fb.notes or "-"
            }
            for fb, c in records
        ])
        st.dataframe(df_fb, use_container_width=True)

# -------------------------------------------------------------
# PAGE 7: INGEST CASES (MANUAL / CSV)
# -------------------------------------------------------------
elif nav_page == "➕ Ingest Cases (Manual / CSV)":
    st.markdown('<div class="main-header">➕ Ingest New Court Cases</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Add Single Case or Upload Batch CSV with Instant 7-Step Triage Execution</div>', unsafe_allow_html=True)

    mode = st.radio("Ingestion Mode:", ["📁 Drag & Drop CSV Upload", "✍️ Manual Single Case Registration"], horizontal=True)

    if mode == "📁 Drag & Drop CSV Upload":
        uploaded_file = st.file_uploader("Choose a Docket CSV file", type=["csv"])
        if uploaded_file is not None:
            df_in = pd.read_csv(uploaded_file)
            st.write(f"Detected **{len(df_in)}** rows in CSV:")
            st.dataframe(df_in.head(5), use_container_width=True)

            if st.button("🚀 Ingest & Run Triage Pipeline"):
                db = get_db_session()
                count = 0
                for _, row in df_in.iterrows():
                    cid = str(row.get('case_id') or row.get('Case ID') or f"DL-2024-{datetime.now().microsecond}")
                    c_obj = db.query(Case).filter(Case.case_id == cid).first()
                    if not c_obj:
                        c_obj = Case(case_id=cid)
                        db.add(c_obj)
                    c_obj.case_title = str(row.get('case_title') or row.get('Case Title') or 'Petitioner vs Respondent')
                    c_obj.case_type = str(row.get('case_type') or 'Civil Suit')
                    c_obj.filed_date = str(row.get('filed_date') or '2023-01-15')
                    c_obj.current_stage = str(row.get('current_stage') or 'Evidence')
                    c_obj.last_progress_date = str(row.get('last_progress_date') or '2023-01-15')
                    c_obj.num_hearings = int(row.get('num_hearings') or 4)
                    c_obj.num_adjournments = int(row.get('num_adjournments') or 2)
                    c_obj.recent_adjournments = int(row.get('recent_adjournments') or 1)
                    c_obj.custody_indicator = bool(str(row.get('custody_indicator')).lower() in ['true', '1', 'yes'])
                    c_obj.days_in_custody = int(row.get('days_in_custody') or 0)
                    db.commit()
                    analyze_single_case(c_obj, db)
                    count += 1
                db.close()
                st.success(f"✅ Successfully ingested and prioritized {count} cases!")

    else:
        with st.form("manual_case_form"):
            mc1, mc2 = st.columns(2)
            with mc1:
                new_id = st.text_input("Case ID *", "DL-2024-9988")
                new_title = st.text_input("Case Title *", "Ramesh Verma vs Suresh Kumar")
                new_type = st.selectbox("Dispute Type", [
                    "Civil Suit (Money Recovery)", "Criminal Case (IPC 420/406 Fraud)",
                    "NI Act Section 138 (Cheque Bounce)", "Motor Accident Claim (MACT)",
                    "Matrimonial Dispute (HMA / Maintenance)", "Land Acquisition & Title Dispute"
                ])
                new_stage = st.selectbox("Current Stage", ["Filing / Summons & Notice", "Written Statement / Pleadings", "Petitioner / Prosecution Evidence", "Final Arguments"])
            with mc2:
                new_filed = st.date_input("Filing Date", datetime(2023, 4, 15)).strftime('%Y-%m-%d')
                new_prog = st.date_input("Last Progress Date", datetime(2024, 1, 10)).strftime('%Y-%m-%d')
                new_hearings = st.number_input("Total Hearings", min_value=0, value=6)
                new_adj = st.number_input("Total Adjournments", min_value=0, value=3)
                new_custody = st.checkbox("Accused in Custody")
                new_custody_days = st.number_input("Days in Custody", min_value=0, value=0) if new_custody else 0

            save_btn = st.form_submit_button("Add & Run Triage")
            if save_btn:
                db = get_db_session()
                case_obj = Case(
                    case_id=new_id,
                    case_title=new_title,
                    case_type=new_type,
                    filed_date=new_filed,
                    current_stage=new_stage,
                    last_progress_date=new_prog,
                    num_hearings=new_hearings,
                    num_adjournments=new_adj,
                    recent_adjournments=1,
                    custody_indicator=new_custody,
                    days_in_custody=new_custody_days
                )
                db.add(case_obj)
                db.commit()
                analyze_single_case(case_obj, db)
                db.close()
                st.success(f"✅ Case {new_id} added and triaged successfully!")
