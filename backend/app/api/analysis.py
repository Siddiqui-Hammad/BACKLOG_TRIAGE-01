"""
Triage Analysis, Explanations, Resolution Opportunities, and Pipeline Status REST API endpoints.
"""
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.case_model import Case, CaseAnalysisRecord
from app.schemas.case_schema import CaseAnalysisOut, OpportunitySummary
from app.services.case_service import (
    analyze_single_case,
    analyze_all_cases_service,
    get_case_detail_service
)
from app.config.settings import settings

router = APIRouter(prefix="/api", tags=["Analysis"])

@router.post("/cases/{case_id}/analyze", response_model=CaseAnalysisOut)
def run_case_analysis(case_id: str, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.case_id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    analyze_single_case(case, db)
    detail = get_case_detail_service(case_id, db)
    return detail['analysis']

@router.post("/analyze/all")
def run_batch_analysis(db: Session = Depends(get_db)):
    count = analyze_all_cases_service(db)
    return {
        "status": "success",
        "message": f"Successfully executed 7-step triage pipeline across all {count} cases.",
        "cases_analyzed": count
    }

@router.get("/cases/{case_id}/explanation")
def get_explanation(case_id: str, db: Session = Depends(get_db)):
    detail = get_case_detail_service(case_id, db)
    if not detail:
        raise HTTPException(status_code=404, detail="Case not found")
    analysis = detail['analysis']
    return {
        "case_id": case_id,
        "priority_category": analysis['priority_category'],
        "priority_score": analysis['priority_score'],
        "narrative_explanation": analysis['narrative_explanation'],
        "factor_breakdown": analysis['factor_breakdown'],
        "recommended_action": analysis['recommended_action']
    }

@router.get("/cases/{case_id}/opportunities", response_model=OpportunitySummary)
def get_case_opportunities(case_id: str, db: Session = Depends(get_db)):
    detail = get_case_detail_service(case_id, db)
    if not detail:
        raise HTTPException(status_code=404, detail="Case not found")
    analysis = detail['analysis']
    return {
        "fast_track": analysis['fast_track_status'],
        "mediation": analysis['mediation_status'],
        "lok_adalat": analysis['lok_adalat_status'],
        "settlement": analysis['settlement_status']
    }

@router.get("/triage/status")
def get_triage_pipeline_status(db: Session = Depends(get_db)):
    total = db.query(Case).count()
    analyzed = db.query(CaseAnalysisRecord).count()
    return {
        "pipeline_version": "2.4-SIH-Prototype",
        "status": "Operational",
        "total_cases_registered": total,
        "total_cases_analyzed": analyzed,
        "coverage_percentage": round((analyzed / max(1, total)) * 100, 1),
        "scoring_weights": {
            "legal_urgency": f"{int(settings.WEIGHT_LEGAL_URGENCY * 100)}%",
            "case_age": f"{int(settings.WEIGHT_CASE_AGE * 100)}%",
            "stagnation": f"{int(settings.WEIGHT_STAGNATION * 100)}%",
            "delay_risk": f"{int(settings.WEIGHT_DELAY_RISK * 100)}%",
            "other_urgency": f"{int(settings.WEIGHT_OTHER_URGENCY * 100)}%"
        },
        "pipeline_steps": [
            {"step": 1, "name": "Legal & Procedural Urgency Rule Engine", "status": "Active"},
            {"step": 2, "name": "Case Ageing & Horizon Classification", "status": "Active"},
            {"step": 3, "name": "Stagnation & Procedural Inactivity Detection", "status": "Active"},
            {"step": 4, "name": "Deterministic ML Delay Risk Prediction", "status": "Active"},
            {"step": 5, "name": "Fast-Track & ADR Resolution Opportunity Matching", "status": "Active"},
            {"step": 6, "name": "Transparent Hybrid Priority Scoring", "status": "Active"},
            {"step": 7, "name": "Natural Language Judicial Explainability", "status": "Active"}
        ],
        "disclaimer": settings.DISCLAIMER_TEXT
    }
