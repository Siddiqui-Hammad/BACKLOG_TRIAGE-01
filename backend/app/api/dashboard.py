"""
Dashboard REST API endpoints.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.case_schema import DashboardStats
from app.services.case_service import get_dashboard_metrics

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardStats)
def get_dashboard(db: Session = Depends(get_db)):
    return get_dashboard_metrics(db)
