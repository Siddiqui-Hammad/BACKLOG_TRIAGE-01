"""
Case Ageing Calculation Engine.
"""
from typing import Dict, Any
from datetime import datetime
from app.config.settings import settings

def evaluate_case_age(filed_date_str: str, ref_date: str = '2026-08-21') -> Dict[str, Any]:
    try:
        ref_dt = datetime.strptime(ref_date, '%Y-%m-%d')
        filed_dt = datetime.strptime(filed_date_str, '%Y-%m-%d')
        age_days = max(0, (ref_dt - filed_dt).days)
    except Exception:
        age_days = 365
    
    age_years = round(age_days / 365.25, 2)

    if age_years < settings.AGE_THRESHOLD_RECENT_YEARS:
        classification = 'Recent'
        age_score = (age_years / settings.AGE_THRESHOLD_RECENT_YEARS) * 30.0
    elif age_years < settings.AGE_THRESHOLD_AGEING_YEARS:
        classification = 'Ageing'
        age_score = 30.0 + ((age_years - 1.0) / 1.0) * 25.0
    elif age_years < settings.AGE_THRESHOLD_LONG_PENDING_YEARS:
        classification = 'Long Pending'
        age_score = 55.0 + ((age_years - 2.0) / 3.0) * 30.0
    else:
        classification = 'Severely Delayed'
        age_score = min(100.0, 85.0 + min(15.0, (age_years - 5.0) * 3.0))

    return {
        'case_age_days': age_days,
        'case_age_years': age_years,
        'age_classification': classification,
        'age_score': round(min(100.0, max(0.0, age_score)), 1)
    }
