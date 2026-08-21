"""
Configurable Legal / Procedural Urgency Rule Engine.
Evaluates custody thresholds, statutory timelines, vulnerable litigants, and priority litigation types.
"""
from typing import Dict, Any, List
from datetime import datetime
from app.config.settings import settings

def evaluate_legal_urgency(case_data: Dict[str, Any], ref_date: str = '2026-08-21') -> Dict[str, Any]:
    urgency_flags: List[str] = []
    score_points: float = 0.0

    # Rule 1: Undertrial Custody Threshold
    is_custody = case_data.get('custody_indicator', False)
    days_in_custody = case_data.get('days_in_custody', 0)
    if is_custody and days_in_custody >= settings.UNDERTRIAL_CUSTODY_DAYS_THRESHOLD:
        urgency_flags.append(f"Undertrial threshold alert: Litigant in custody for {days_in_custody} days (Configured threshold: {settings.UNDERTRIAL_CUSTODY_DAYS_THRESHOLD} days)")
        score_points += 45.0
    elif is_custody and days_in_custody > 90:
        urgency_flags.append(f"Pre-trial custody alert: Litigant in custody for {days_in_custody} days")
        score_points += 25.0

    # Rule 2: Approaching Statutory Deadline
    statutory_deadline_str = case_data.get('statutory_deadline')
    if statutory_deadline_str:
        try:
            ref_dt = datetime.strptime(ref_date, '%Y-%m-%d')
            dead_dt = datetime.strptime(statutory_deadline_str, '%Y-%m-%d')
            days_to_deadline = (dead_dt - ref_dt).days
            if 0 <= days_to_deadline <= settings.STATUTORY_DEADLINE_APPROACH_DAYS:
                urgency_flags.append(f"Approaching statutory deadline: {days_to_deadline} days remaining until target disposal ({statutory_deadline_str})")
                score_points += 35.0
            elif days_to_deadline < 0:
                urgency_flags.append(f"Statutory target deadline expired ({abs(days_to_deadline)} days overdue)")
                score_points += 40.0
        except Exception:
            pass

    # Rule 3: High Priority Legal Category
    urgency_cat = (case_data.get('urgency_category') or '').lower()
    case_type = (case_data.get('case_type') or '').lower()

    if 'senior citizen' in urgency_cat:
        urgency_flags.append("Vulnerable Litigant: Senior citizen litigant identified for expedited hearing")
        score_points += 20.0
    if 'maintenance' in urgency_cat or 'domestic violence' in urgency_cat or 'dv act' in case_type:
        urgency_flags.append("Statutory Family Urgency: Interim maintenance / domestic protection proceeding")
        score_points += 30.0
    if 'bail' in case_type or 'habeas' in case_type:
        urgency_flags.append("Personal Liberty Urgency: Bail application / liberty adjudication")
        score_points += 35.0
    if 'child custody' in urgency_cat or 'guardianship' in case_type:
        urgency_flags.append("Welfare Urgency: Child custody & visitation matter")
        score_points += 25.0

    legal_urgency = len(urgency_flags) > 0
    final_score = min(100.0, max(0.0, score_points))

    return {
        'legal_urgency': legal_urgency,
        'urgency_flags': urgency_flags,
        'legal_urgency_score': round(final_score, 1)
    }
