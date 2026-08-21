"""
Pydantic schemas for request validation and structured responses.
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class CaseBase(BaseModel):
    case_id: str
    case_title: str
    case_type: str
    filed_date: str
    current_stage: str
    last_progress_date: str
    num_hearings: int = 0
    num_adjournments: int = 0
    recent_adjournments: int = 0
    custody_indicator: bool = False
    days_in_custody: int = 0
    urgency_category: Optional[str] = None
    statutory_deadline: Optional[str] = None
    petitioner: Optional[str] = None
    respondent: Optional[str] = None
    court_room: Optional[str] = 'Court Room 4 - District Court'
    judge_name: Optional[str] = 'Hon. Additional District & Sessions Judge'
    next_hearing_date: Optional[str] = None

class CaseCreate(CaseBase):
    pass

class FactorBreakdown(BaseModel):
    legal_urgency: float
    case_age: float
    stagnation: float
    delay_risk: float
    other_factors: float

class OpportunitySummary(BaseModel):
    fast_track: str
    mediation: str
    lok_adalat: str
    settlement: str

class CaseAnalysisOut(BaseModel):
    case_id: str
    case_age_days: int
    case_age_years: float
    age_classification: str
    age_score: float
    stagnation_score: float
    stagnation_level: str
    stagnation_reasons: List[str]
    delay_risk: int
    delay_risk_category: str
    estimated_timeline_min_months: int
    estimated_timeline_max_months: int
    model_confidence: int
    legal_urgency: bool
    urgency_flags: List[str]
    legal_urgency_score: float
    fast_track_status: str
    mediation_status: str
    lok_adalat_status: str
    settlement_status: str
    priority_score: float
    priority_category: str
    factor_breakdown: FactorBreakdown
    narrative_explanation: str
    recommended_action: str

class CaseDetailOut(CaseBase):
    analysis: Optional[CaseAnalysisOut] = None
    latest_judge_feedback: Optional[Dict[str, Any]] = None

class CaseListItem(BaseModel):
    case_id: str
    case_title: str
    case_type: str
    filed_date: str
    current_stage: str
    priority: str
    priority_score: float
    fast_track_status: str
    delay_status: str
    delay_risk: int
    stagnation_level: str
    legal_urgency: bool
    num_hearings: int
    num_adjournments: int

class JudgeFeedbackCreate(BaseModel):
    engine_priority: str
    judge_decision: str
    action_taken: str
    reason: str
    notes: Optional[str] = ''

class JudgeFeedbackOut(BaseModel):
    id: int
    case_id: str
    engine_priority: str
    engine_action: str
    judge_decision: str
    action_taken: str
    reason: str
    notes: Optional[str]
    timestamp: str

class PriorityCounts(BaseModel):
    critical: int = 0
    high: int = 0
    medium: int = 0
    routine: int = 0
    fast_track_eligible: int = 0

class DelayDistribution(BaseModel):
    high_delay: int = 0
    medium_delay: int = 0
    low_delay: int = 0

class DashboardStats(BaseModel):
    summary_cards: PriorityCounts
    delay_distribution: DelayDistribution
    total_pending_cases: int
    avg_case_age_years: float
    stagnating_cases_count: int
    quick_alerts: List[Dict[str, Any]]
    disclaimer: str

class AlertItem(BaseModel):
    id: str
    case_id: str
    case_title: str
    category: str
    severity: str
    message: str
    details: str
    filed_date: str
    current_stage: str
    priority: str
