"""
Explainability Engine.
"""
from typing import Dict, Any, List

def generate_case_explanation(case_data: Dict[str, Any], analysis: Dict[str, Any]) -> str:
    category = analysis.get('priority_category', 'Routine')
    score = analysis.get('priority_score', 0)
    age_years = analysis.get('case_age_years', 0)
    reasons = analysis.get('stagnation_reasons', [])
    urgency_flags = analysis.get('urgency_flags', [])
    delay_risk = analysis.get('delay_risk', 0)

    points: List[str] = []
    
    if age_years >= 4.0:
        points.append(f"it has been pending for {age_years} years ({analysis.get('age_classification', '')})")
    elif age_years >= 2.0:
        points.append(f"it has been in the docket for {age_years} years")

    if urgency_flags:
        points.append(f"configured legal urgency conditions were triggered ({len(urgency_flags)} alert flags)")

    if analysis.get('stagnation_score', 0) >= 50:
        if reasons:
            first_reason = reasons[0].lower()
            points.append(f"stagnation indicators show {first_reason}")
        else:
            points.append("procedural progress has stalled in the current stage")

    if delay_risk >= 70:
        points.append(f"predictive model estimates a high risk ({delay_risk}%) of substantial further delay")

    if not points:
        return f"This case is categorized ap {category} (Priority Score: {score}/100) with normal procedural velocity and no active urgency alerts."

    joined_points = "; ".join(points)
    explanation = f"This case is prioritized as {category} (Score: {score}/100) because {joined_points}."
    return explanation
