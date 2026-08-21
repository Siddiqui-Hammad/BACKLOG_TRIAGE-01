"""
Fast-Track & Alternative Dispute Resolution (ADR) Opportunity Engine.
"""
from typing import Dict, Any

def evaluate_resolution_opportunities(case_data: Dict[str, Any], case_age_years: float) -> Dict[str, str]:
    case_type = (case_data.get('case_type') or '').lower()
    urgency_cat = (case_data.get('urgency_category') or '').lower()
    current_stage = (case_data.get('current_stage') or '').lower()
    num_hearings = case_data.get('num_hearings', 0)

    # 1. Fast-Track
    if 'senior citizen' in urgency_cat or ('summary' in case_type and case_age_years > 1.5):
        fast_track = 'Suitable'
    elif 'cheque bounce' in case_type or 'ni act' in case_type or (case_age_years >= 3.0 and 'arguments' in current_stage):
        fast_track = 'Potentially Suitable'
    else:
        fast_track = 'Not Identified'

    # 2. Mediation / Conciliation
    if any(k in case_type for k in ['matrimonial', 'divorce', 'family', 'partition', 'landlord', 'tenancy']):
        mediation = 'Suitable'
    elif any(k in case_type for k in ['commercial', 'contract', 'civil suit', 'recovery']) and num_hearings <= 8:
        mediation = 'Potentially Suitable'
    else:
        mediation = 'Not Identified'

    # 3. Lok Adalat
    if any(k in case_type for k in ['motor accident', 'mact', 'cheque bounce', 'ni act', 'compoundable']):
        lok_adalat = 'Suitable'
    elif any(k in case_type for k in ['recovery', 'money suit', 'labour', 'bank loan']) and case_age_years >= 1.0:
        lok_adalat = 'Potentially Suitable'
    else:
        lok_adalat = 'Not Identified'

    # 4. Settlement
    if mediation == 'Suitable' or lok_adalat == 'Suitable':
        settlement = 'Potentially Suitable'
    elif 'recovery' in case_type or 'commercial' in case_type:
        settlement = 'Potentially Suitable'
    else:
        settlement = 'Not Identified'

    return {
        'fast_track': fast_track,
        'mediation': mediation,
        'lok_adalat': lok_adalat,
        'settlement': settlement
    }
