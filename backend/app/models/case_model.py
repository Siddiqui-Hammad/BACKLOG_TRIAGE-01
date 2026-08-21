"""
SQLalchemy ORM models for cases, analysis results, and judge review feedback.
"""
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Case(Base):
    __tablename__ = 'cases'

    case_id = Column(String, primary_key=True, index=True)
    case_title = Column(String, nullable=False)
    case_type = Column(String, nullable=False)
    filed_date = Column(String, nullable=False)
    current_stage = Column(String, nullable=False)
    last_progress_date = Column(String, nullable=False)
    num_hearings = Column(Integer, default=0)
    num_adjournments = Column(Integer, default=0)
    recent_adjournments = Column(Integer, default=0)
    
    # Urgency & Status attributes
    custody_indicator = Column(Boolean, default=False)
    days_in_custody = Column(Integer, default=0)
    urgency_category = Column(String, nullable=True)
    statutory_deadline = Column(String, nullable=True)
    
    # Metadata
    petitioner = Column(String, nullable=True)
    respondent = Column(String, nullable=True)
    court_room = Column(String, default='Court Room 4 - District Court')
    judge_name = Column(String, default='Hon. Additional District & Sessions Judge')
    next_hearing_date = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CaseAnalysisRecord(Base):
    __tablename__ = 'case_analyses'

    case_id = Column(String, primary_key=True, index=True)
    case_age_days = Column(Integer, default=0)
    case_age_years = Column(Float, default=0.0)
    age_classification = Column(String, default='Recent')
    age_score = Column(Float, default=0.0)

    stagnation_score = Column(Float, default=0.0)
    stagnation_level = Column(String, default='Low')
    stagnation_reasons = Column(Text, default='[]')

    delay_risk = Column(Integer, default=0)
    delay_risk_category = Column(String, default='Low')
    est_timeline_min = Column(Integer, default=1)
    est_timeline_max = Column(Integer, default=3)
    model_confidence = Column(Integer, default=85)

    legal_urgency = Column(Boolean, default=False)
    urgency_flags = Column(Text, default='[]')
    legal_urgency_score = Column(Float, default=0.0)

    fast_track_status = Column(String, default='Not Identified')
    mediation_status = Column(String, default='Not Identified')
    lok_adalat_status = Column(String, default='Not Identified')
    settlement_status = Column(String, default='Not Identified')

    priority_score = Column(Float, default=0.0)
    priority_category = Column(String, default='Routine')

    factor_legal_urgency = Column(Float, default=0.0)
    factor_case_age = Column(Float, default=0.0)
    factor_stagnation = Column(Float, default=0.0)
    factor_delay_risk = Column(Float, default=0.0)
    factor_other_urgency = Column(Float, default=0.0)

    narrative_explanation = Column(Text, default='')
    recommended_action = Column(Text, default='')
    analyzed_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class JudgeFeedback(Base):
    __tablename__ = 'judge_feedback'

    id = Column(Integer, primary_key=True, autoincrement=True)
    case_id = Column(String, index=True, nullable=False)
    engine_priority = Column(String, nullable=False)
    engine_action = Column(String, nullable=False)
    judge_decision = Column(String, nullable=False)
    action_taken = Column(String, nullable=False)
    reason = Column(String, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
