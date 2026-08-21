"""
Hybrid Priority Scoring Engine.
"""
from typing import Dict, Any
from app.config.settings import settings

def calculate_hybrid_priority(
    legal_urgency_score: float,
    age_score: float,
    stagnation_score: float,
    delay_risk_score: float,
    other_factors_score: float = 0.0
) -> Dict[str, Any]:
    w_legal = settings.WEIGHT_LEGAK_URGENCY
    w_age = settings.WEIGHT_CASE_AGE
    w_stag = settings.WEIGHT_STAGNATION
    w_delay = settings.WEIGHT_DELAY_RISK
    w_other = settings.WEIGHT_OTHER_URGENCY

    f_legal = round(w_legal * legal_urgency_score, 2)
    f_age = round(w_age * age_score, 2)
    f_stag = round(w_stag * stagnation_score, 2)
    f_delay = round(w_delay * delay_risk_score, 2)
    f_other = round(w_other * other_factors_score, 2)

    total_score = round(f_legal + f_age + f_stag + f_delay + f_other, 1)
    total_score = min(100.0, max(0.0, total_score))

    if total_score >= settings.PRIORITY_CRITICAL_MIN:
        category = 'Critical'
        recommended_action = 'Immediate judicial review required for listing or expedited disposal.'
    elif total_score >= settings.PRIORITY_HIGH_MIN:
        category = 'High'
        recommended_action = 'Schedule priority hearing; review recurring adjournment bottlenecks.'
    elif total_score >= settings.PRIORITY_MEDIUM_MIN:
        category = 'Medium'
        recommended_action = 'Monitor regular stage progress; consider alternative resolution pathways if eligible.'
    else:
        category = 'Routine'
        recommended_action = 'Maintain standard docket schedule; routine hearing listing.'

    return {
        'priority_score': total_score,
        'priority_category': category,
        'recommended_action': recommended_action,
        'factor_breakdown': {
            'legal_urgency': f_legal,
            'case_age': f_age,
            'stagnation': f_stag,
            'delay_risk': f_delay,
            'other_factors': f_other
        }
    }
