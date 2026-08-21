"""
Stagnation Detection Engine.
"""
from typing import Dict, Any, List
from datetime import datetime
from app.config.settings import settings

def evaluate_stagnation(
    last_progress_date_str: str,
    current_stage: str,
    num_hearings: int,
    num_adjournments: int,
    recent_adjournments: int,
    ref_date: str = '2026-08-21'
) -> Dict[str, Any]:
    try:
        ref_dt = datetime.strptime(ref_date, '%Y-%m-%d')
        progress_dt = datetime.strptime(last_progress_date_str, '%Y-%m-%d')
        days_inactive = max(0, (ref_dt - progress_dt).days)
    except Exception:
        days_inactive = 60

    reasons: List[str] = []
    stagnation_points = 0.0

    if days_inactive >= settings.STAGNATION_DAYS_HIGH:
        months_inactive = round(days_inactive / 30.4)
        reasons.append(f"No meaningful progress recorded for {months_inactive} months ({days_inactive} days)")
        stagnation_points += 45.0
    elif days_inactive >= settings.STAGNATION_DAYS_MED:
        months_inactive = round(days_inactive / 30.4)
        reasons.append(f"No meaningful progress for {months_inactive} months ({days_inactive} days)")
        stagnation_points += 30.0
    elif days_inactive >= settings.STAGNATION_DAYS_LOW:
        reasons.append(f"Case has remained inactive for {days_inactive} days")
        stagnation_points += 15.0

    if recent_adjournments >= settings.RECENT_ADJOURNMENT_THRESHOLD:
        reasons.append(f"{recent_adjournments} consecutive adjournments recorded in the last 90 days")
        stagnation_points += 25.0
    elif recent_adjournments > 0:
        reasons.append(f"{recent_adjournments} adjournments recorded in recent hearings")
        stagnation_points += 10.0

    if num_hearings > 0:
        adj_ratio = num_adjournments / max(1, num_hearings)
        if adj_ratio >= 0.60 and num_hearings >= 5:
            reasons.append(f"High adjournment rate ({num_adjournments} of {num_hearings} hearings adjourned, {round(adj_ratio*100)}%)")
            stagnation_points += 20.0
        elif num_adjournments >= settings.ADJOURNMENT_THRESHOLD_HIGH:
            reasons.append(f"Cumulative adjournments ({num_adjournments}) exceeding benchmark")
            stagnation_points += 15.0

    stage_lower = current_stage.lower()
    if 'evidence' in stage_lower and days_inactive > 150:
        reasons.append("Case has remained in Evidence / Witness Examination stage for an extended duration")
        stagnation_points += 15.0
    elif 'summons' in stage_lower and days_inactive > 120:
        reasons.append("Service of summons / notice unfulfilled after multiple cycles")
        stagnation_points += 15.0
    elif 'written statement' in stage_lower and days_inactive > 90:
        reasons.append("Written statement / pleadings stage delayed beyond standard timelines")
        stagnation_points += 10.0

    if not reasons:
        reasons.append("Active regular hearing schedule with recent procedural progress")

    final_score = min(100.0, max(0.0, stagnation_points))

    if final_score >= 81.0:
        level = 'Severe'
    elif final_score >= 61.0:
        level = 'High'
    elif final_score >= 31.0:
        level = 'Medium'
    else:
        level = 'Low'


    return {
        'stagnation_score': round(final_score, 1),
        'stagnation_level': level,
        'stagnation_reasons': reasons,
        'days_inactive': days_inactive
    }
