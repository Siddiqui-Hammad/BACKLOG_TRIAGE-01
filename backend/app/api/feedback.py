"""
Judge Review & Feedback Loop REST API endpoints.
Persists human judicial determinations (Accept, Change Priority, Defer, Override) into SQLite backend.
"""
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.case_model import Case, CaseAnalysisRecord, JudgeFeedback
from app.schemas.case_schema import JudgeFeedbackCreate, JudgeFeedbackOut
from app.services.case_service import get_case_detail_service

router = APIRouter(prefix="/api", tags=["Judge Feedback"])

@router.post("/cases/{case_id}/judge-feedback", response_model=Dict[str, Any])
def submit_judge_feedback(case_id: str, feedback_in: JudgeFeedbackCreate, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.case_id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    analysis = db.query(CaseAnalysisRecord).filter(CaseAnalysisRecord.case_id == case_id).first()
    engine_action = analysis.recommended_action if analysis else "Standard Listing"

    fb_obj = JudgeFeedback(
        case_id=case_id,
        engine_priority=feedback_in.engine_priority,
        engine_action=engine_action,
        judge_decision=feedback_in.judge_decision,
        action_taken=feedback_in.action_taken,
        reason=feedback_in.reason,
        notes=feedback_in.notes
    )
    db.add(fb_obj)

    if feedback_in.action_taken in ["Changed Priority", "Accepted Recommendation", "Overridden"]:
        if analysis and feedback_in.judge_decision in ["Critical", "High", "Medium", "Routine"]:
            analysis.priority_category = feedback_in.judge_decision

    db.commit()
    db.refresh(fb_obj)

    return {
        "status": "success",
        "message": "Judge review feedback recorded and applied successfully.",
        "feedback_id": fb_obj.id,
        "case_id": case_id,
        "judge_decision": fb_obj.judge_decision,
        "action_taken": fb_obj.action_taken,
        "timestamp": str(fb_obj.created_at)
    }

@router.get("/feedback/history")
def get_all_feedback_history(db: Session = Depends(get_db)):
    records = db.query(JudgeFeedback, Case).join(Case, JudgeFeedback.case_id == Case.case_id).order_by(desc(JudgeFeedback.created_at)).all()
    history = []
    for fb, case in records:
        history.append({
            "id": fb.id,
            "case_id": fb.case_id,
            "case_title": case.case_title,
            "case_type": case.case_type,
            "engine_priority": fb.engine_priority,
            "engine_action": fb.engine_action,
            "judge_decision": fb.judge_decision,
            "action_taken": fb.action_taken,
            "reason": fb.reason,
            "notes": fb.notes,
            "timestamp": str(fb.created_at)
        })
    return history
