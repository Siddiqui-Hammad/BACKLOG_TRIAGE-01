"""
Cases CRUD, Filter, Search, Manual Entry, and CSV Upload REST API endpoints.
"""
import csv
import io
import random
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.case_model import Case
from app.schemas.case_schema import CaseCreate, CaseDetailOut, CaseListItem
from app.services.case_service import (
    get_cases_list_service,
    get_case_detail_service,
    analyze_single_case
)

router = APIRouter(prefix="/api/cases", tags=["Cases"])

@router.get("", response_model=List[CaseListItem])
def list_cases(
    priority: Optional[str] = Query(None),
    stage: Optional[str] = Query(None),
    fast_track: Optional[str] = Query(None),
    delay_status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return get_cases_list_service(
        db=db,
        priority=priority,
        stage=stage,
        fast_track=fast_track,
        delay_status=delay_status,
        search=search
    )

@router.get("/export")
def export_cases_csv(db: Session = Depends(get_db)):
    cases = get_cases_list_service(db=db)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        'Case ID', 'Case Title', 'Case Type', 'Filed Date', 'Stage',
        'Priority', 'Priority Score', 'Fast-Track Status', 'Delay Status',
        'Delay Risk %', 'Stagnation Level', 'Legal Urgency', 'Hearings', 'Adjournments'
    ])
    for c in cases:
        writer.writerow([
            c['case_id'], c['case_title'], c['case_type'], c['filed_date'], c['current_stage'],
            c['priority'], c['priority_score'], c['fast_track_status'], c['delay_status'],
            c['delay_risk'], c['stagnation_level'], c['legal_urgency'], c['num_hearings'], c['num_adjournments']
        ])
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=prioritized_cases_backlog.csv"}
    )

@router.get("/{case_id}", response_model=CaseDetailOut)
def get_case(case_id: str, db: Session = Depends(get_db)):
    case_detail = get_case_detail_service(case_id, db)
    if not case_detail:
        raise HTTPException(status_code=404, detail="Case not found")
    return case_detail

@router.post("", response_model=CaseDetailOut)
def create_case(case_in: CaseCreate, db: Session = Depends(get_db)):
    existing = db.query(Case).filter(Case.case_id == case_in.case_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Case ID already exists in the docket")

    case_obj = Case(
        case_id=case_in.case_id,
        case_title=case_in.case_title,
        case_type=case_in.case_type,
        filed_date=case_in.filed_date,
        current_stage=case_in.current_stage,
        last_progress_date=case_in.last_progress_date,
        num_hearings=case_in.num_hearings,
        num_adjournments=case_in.num_adjournments,
        recent_adjournments=case_in.recent_adjournments,
        custody_indicator=case_in.custody_indicator,
        days_in_custody=case_in.days_in_custody,
        urgency_category=case_in.urgency_category,
        statutory_deadline=case_in.statutory_deadline,
        petitioner=case_in.petitioner or (case_in.case_title.split(' vs ')[0] if ' vs ' in case_in.case_title else case_in.case_title),
        respondent=case_in.respondent or (case_in.case_title.split(' vs ')[1] if ' vs ' in case_in.case_title else 'Respondent'),
        court_room=case_in.court_room or 'Court Room 4 - District Court',
        judge_name=case_in.judge_name or 'Hon. Additional District & Sessions Judge',
        next_hearing_date=case_in.next_hearing_date
    )
    db.add(case_obj)
    db.commit()
    db.refresh(case_obj)

    analyze_single_case(case_obj, db)

    return get_case_detail_service(case_obj.case_id, db)

@router.post("/upload")
async def upload_cases_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    contents = await file.read()
    decoded = contents.decode('utf-8')
    reader = csv.DictReader(io.StringIO(decoded))

    created_count = 0
    updated_count = 0

    for row in reader:
        case_id = row.get('case_id') or row.get('Case ID') or f"DL-2024-{random.randint(5000, 9999)}"
        case_title = row.get('case_title') or row.get('Case Title') or 'State vs Respondent'
        case_type = row.get('case_type') or row.get('Case Type') or 'Civil Suit'
        filed_date = row.get('filed_date') or row.get('Filed Date') or '2023-01-15'
        current_stage = row.get('current_stage') or row.get('Current Stage') or 'Evidence'
        last_progress_date = row.get('last_progress_date') or row.get('Last Meaningful Progress') or filed_date
        
        try: num_hearings = int(row.get('num_hearings') or row.get('Number of Hearings') or 4)
        except: num_hearings = 4
        
        try: num_adjournments = int(row.get('num_adjournments') or row.get('Number of Adjournments') or 2)
        except: num_adjournments = 2

        try: recent_adjournments = int(row.get('recent_adjournments') or 1)
        except: recent_adjournments = 1

        custody_indicator = str(row.get('custody_indicator', '')).lower() in ['true', '1', 'yes']
        try: days_in_custody = int(row.get('days_in_custody') or 0)
        except: days_in_custody = 0

        urgency_category = row.get('urgency_category') or None
        statutory_deadline = row.get('statutory_deadline') or None
        petitioner = row.get('petitioner') or None
        respondent = row.get('respondent') or None

        case_obj = db.query(Case).filter(Case.case_id == case_id).first()
        if not case_obj:
            case_obj = Case(case_id=case_id)
            db.add(case_obj)
            created_count += 1
        else:
            updated_count += 1

        case_obj.case_title = case_title
        case_obj.case_type = case_type
        case_obj.filed_date = filed_date
        case_obj.current_stage = current_stage
        case_obj.last_progress_date = last_progress_date
        case_obj.num_hearings = num_hearings
        case_obj.num_adjournments = num_adjournments
        case_obj.recent_adjournments = recent_adjournments
        case_obj.custody_indicator = custody_indicator
        case_obj.days_in_custody = days_in_custody
        case_obj.urgency_category = urgency_category
        case_obj.statutory_deadline = statutory_deadline
        case_obj.petitioner = petitioner
        case_obj.respondent = respondent

        db.commit()
        analyze_single_case(case_obj, db)

    return {
        "status": "success",
        "message": f"Successfully processed CSV: {created_count} cases created, {updated_count} cases updated and prioritized.",
        "created": created_count,
        "updated": updated_count
    }
