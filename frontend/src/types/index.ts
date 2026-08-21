export type PriorityLevel = "Critical" | "High" | "Medium" | "Routine";
export type DelayCategory = "Low" | "Medium" | "High";
export type StagnationLevel = "Low" | "Moderate" | "High" | "Severe";
export type OpportunityStatus = "Suitable" | "Potentially Suitable" | "Not Suitable" | "Not Identified";

export interface FactorBreakdown {
  legal_urgency: number;
  case_age: number;
  stagnation: number;
  delay_risk: number;
  other_factors: number;
}

export interface CaseAnalysis {
  case_id: string;
  case_age_days: number;
  case_age_years: number;
  age_classification: string;
  age_score: number;
  stagnation_score: number;
  stagnation_level: StagnationLevel;
  stagnation_reasons: string[];
  delay_risk: number;
  delay_risk_category: DelayCategory;
  estimated_timeline_min_months: number;
  estimated_timeline_max_months: number;
  model_confidence: number;
  legal_urgency: boolean;
  urgency_flags: string[];
  legal_urgency_score: number;
  fast_track_status: OpportunityStatus;
  mediation_status: OpportunityStatus;
  lok_adalat_status: OpportunityStatus;
  settlement_status: OpportunityStatus;
  priority_score: number;
  priority_category: PriorityLevel;
  factor_breakdown: FactorBreakdown;
  narrative_explanation: string;
  recommended_action: string;
}

export interface JudgeFeedbackRecord {
  id?: number;
  engine_priority: string;
  judge_decision: string;
  action_taken: string;
  reason?: string;
  notes?: string;
  timestamp?: string;
}

export interface CaseDetail {
  case_id: string;
  case_title: string;
  case_type: string;
  filed_date: string;
  current_stage: string;
  last_progress_date: string;
  num_hearings: number;
  num_adjournments: number;
  recent_adjournments: number;
  custody_indicator: boolean;
  days_in_custody: number;
  urgency_category?: string;
  statutory_deadline?: string;
  petitioner?: string;
  respondent?: string;
  court_room?: string;
  judge_name?: string;
  next_hearing_date?: string;
  analysis: CaseAnalysis;
  latest_judge_feedback?: JudgeFeedbackRecord;
}

export interface CaseListItem {
  case_id: string;
  case_title: string;
  case_type: string;
  filed_date: string;
  current_stage: string;
  priority: PriorityLevel;
  priority_score: number;
  fast_track_status: OpportunityStatus;
  delay_status: DelayCategory;
  delay_risk: number;
  stagnation_level: StagnationLevel;
  legal_urgency: boolean;
  num_hearings: number;
  num_adjournments: number;
}

export interface QuickAlert {
  type: string;
  count: number;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Info";
  filter?: Record<string, string>;
}

export interface DashboardStats {
  summary_cards: {
    critical: number;
    high: number;
    medium: number;
    routine: number;
    fast_track_eligible: number;
  };
  delay_distribution: {
    high_delay: number;
    medium_delay: number;
    low_delay: number;
  };
  total_pending_cases: number;
  avg_case_age_years: number;
  stagnating_cases_count: number;
  quick_alerts: QuickAlert[];
  disclaimer: string;
}

export interface AlertItem {
  id: string;
  case_id: string;
  case_title: string;
  category: "URGENT" | "DELAY" | "UPCOMING" | "OPPORTUNITY";
  severity: "Critical" | "High" | "Medium" | "Info";
  message: string;
  details: string;
  filed_date: string;
  current_stage: string;
  priority: PriorityLevel;
}

export interface FeedbackAuditItem {
  id: number;
  case_id: string;
  case_title: string;
  case_type: string;
  engine_priority: string;
  engine_action: string;
  judge_decision: string;
  action_taken: string;
  reason?: string;
  notes?: string;
  timestamp: string;
}
