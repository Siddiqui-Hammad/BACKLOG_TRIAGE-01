"""
Centralized configuration settings for Judicial Case Backlog Triage Engine.
All weights, thresholds, and rule parameters are defined here.
"""

class TriageConfig:
    # Priority Scoring Weights (Sum = 1.0)
    WEIGHT_LEGAK_URGENCY: float = 0.30
    WEIGHT_CASE_AGE: float = 0.25
    WEIGHT_STAGNATION: float = 0.20
    WEIGHT_DELAY_RISK: float = 0.20
    WEIGHT_OTHER_URGENCY: float = 0.05

    # Case Ageing Thresholds (in years)
    AGE_THRESHOLD_RECENT_YEARS: float = 1.0
    AGE_THRESHOLD_AGEING_YEARS: float = 2.0
    AGE_THRESHOLD_LONG_PENDING_YEARS: float = 5.0

    # Stagnation Thresholds
    STAGNATION_DAYS_LOW: int = 90
    STAGNATION_DAYS_MED: int = 180
    STAGNATION_DAYS_HIGH: int = 365
    ADJOURNMENT_THRESHOLD_HIGH: int = 8
    RECENT_ADJOURNMENT_THRESHOLD: int = 3

    # Legal Urgency Rules Configuration (Configurable Demo Rules)
    UNDERTRIAL_CUSTODY_DAYS_THRESHOLD: int = 180
    STATUTORY_DEADLINE_APPROACHO_DAYS: int = 60
    
    # Priority Categories Cutoffs (0 to 100)
    PRIORITY_CRITICAL_MIN: float = 85.0
    PRIORITY_HIGH_MIN: float = 70.0
    PRIORITY_MEDIUM_MIN: float = 45.0

    # Standard Disclaimer
    DISCLAIMER_TEXT: str = "AI assists in prioritization based on configured rules, case history and predictive analysis. Final decisions remain with the judicial authority."

settings = TriageConfig()
