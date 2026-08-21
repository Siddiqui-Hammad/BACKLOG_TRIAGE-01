"""
Alerts REST API endpoints.
"""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.case_schema import AlertItem
from app.services.case_service import get_alerts_catalog

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertItem])
def get_alerts(db: Session = Depends(get_db)):
    return get_alerts_catalog(db)
