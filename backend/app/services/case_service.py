"""
Case Service: Coordinates all 7 triage engines, database persistence, dashboard metrics, and alerts.
"""
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_, func

from app.models.case_model import Case, CaseAnalysisRecord, JudgeFeedback
from app.engines.legal_rules import evaluate_legal_urgency
from app.engines.ageing_engine import evaluate_case_age
from app.engines.stagnation_engine import evaluate_stagnation
from app.engines.delay_predictor import predict_delay_risk
from app.engines.resolution_engine import evaluate_resolution_opportunities
from app.engines.priority_engine import calculate_hybrid_priority
from app.engines.explanation_engine import generate_case_explanation
from app.config.settings import settings

def analyze_single_case(case_obj: Case, db: Session, ref_date: str = '2026-08-21') -> CaseAnalysisRecord:
    case_dict = {
        'case_id': case_obj.case_id,
        'case_title': case_obj.case_title,
        'case_type': case_obj.case_type,
        'filed_date': case_obj.filed_date,
        'current_stage': case_obj.current_stage,
        'last_progress_date': case_obj.last_progress_date,
        'num_hearings': case_obj.num_hearings,
        'num_adjournments': case_obj.num_adjournments,
        'recent_adjournments': case_obj.recent_adjournments,
        'custody_indicator': case_obj.custody_indicator,
        'days_in_custody': case_obj.days_in_custody,
        'urgency_category': case_obj.urgency_category,
        'statutory_deadline': case_obj.statutory_deadline,
    }

    legal_res = evaluate_legal_urgency(case_dict, ref_date=ref_date)
    age_res = evaluate_case_age(case_obj.filed_date, ref_date=ref_date)
    stag_res = evaluate_stagnation(
        last_progress_date_str=case_obj.last_progress_date,
        current_stage=case_obj.current_stage,
        num_hearings=case_obj.num_hearings,
        num_adjournments=case_obj.num_adjournments,
        recent_adjournments=case_obj.recent_adjournments,
        ref_date=ref_date
    )
    delay_res = predict_delay_risk(
        case_data=case_dict,
        age_days=age_res['case_age_days'],
        stagnation_score=stag_res['stagnation_score']
    )
    res_opps = evaluate_resolution_opportunities(
        case_data=case_dict,
        case_age_years=age_res['case_age_years']
    )
    priority_res = calculate_hybrid_priority(
        legal_urgency_score=legal_res['legal_urgency_score'],
        age_score=age_res['age_score'],
        stagnation_score=stag_res['stagnation_score'],
        delay_risk_score=delay_res['delay_risk'],
        other_factors_score=15.0 if legal_res['legal_urgency'] else 0.0
    )

    analysis_dict = {
        'case_id': case_obj.case_id,
        'priority_score': priority_res['priority_score'],
        'priority_category': priority_res['priority_category'],
        'case_age_years': age_res['case_age_years'],
        'age_classification': age_res['age_classification'],
        'stagnation_score': stag_res['stagnation_score'],
        'stagnation_reasons': stag_res['stagnation_reasons'],
        'urgency_flags': legal_res['urgency_flags'],
        'delay_risk': delay_res['delay_risk']
    }

    narrative = generate_case_explanation(case_dict, analysis_dict)

    record = db.query(CaseAnalysisRecord).filter(CaseAnalysisRecord.case_id == case_obj.case_id).first()
    if not record:
        record = CaseAnalysisRecord(case_id=case_obj.case_id)
        db.add(record)

    record.case_age_days = age_res['case_age_days']
    record.case_age_years = age_res['case_age_years']
    record.age_classification = age_res['age_classification']
    record.age_score = age_res['age_score']

    record.stagnation_score = stag_res['stagnation_score']
    record.stagnation_level = stag_res['stagnation_level']
    record.stagnation_reasons = json.dumps(stag_res['stagnation_reasons'])

    record.delay_risk = delay_res['delay_risk']
    record.delay_risk_category = delay_res['risk_category']
    record.est_timeline_min = delay_res['estimated_timeline_min_months']
    record.est_timeline_max = delay_res['estimated_timeline_max_months']
    record.model_confidence = delay_res['model_confidence']

    record.legal_urgency = legal_res['legal_urgency']
    record.urgency_flags = json.dumps(legal_res['urgency_flags'])
    record.legal_urgency_score = legal_res['legal_urgency_score']

    record.fast_track_status = res_opps['fast_track']
    record.mediation_status = res_opps['mediation']
    record.lok_adalat_status = res_opps['lok_adalat']
    record.settlement_status = res_opps['settlement']

    record.priority_score = priority_res['priority_score']
    record.priority_category = priority_res['priority_category']
    record.recommended_action = priority_res['recommended_action']

    record.factor_legal_urgency = priority_res['factor_breakdown']['legal_urgency']
    record.factor_case_age = priority_res['factor_breakdown']['case_age']
    record.factor_stagnation = priority_res['factor_breakdown']['stagnation']
    record.factor_delay_risk = priority_res['factor_breakdown']['delay_risk']
    record.factor_other_urgency = priority_res['factor_breakdown']['other_factors']

    record.narrative_explanation = narrative

    db.commit()
    db.refresh(record)
    return record

def analyze_all_cases_service(db: Session) -> int:
    cases = db.query(Case).all()
    for c in cases:
        analyze_single_case(c, db)
    return len(cases)

def get_case_detail_service(case_id: str, db: Session) -> Optional[Dict[str, Any]]:
    case = db.query(Case).filter(Case.case_id == case_id).first()
    if not case:
        return None
    
    analysis = db.query(CaseAnalysisRecord).filter(CaseAnalysisRecord.case_id == case_id).first()
    if not analysis:
        analysis = analyze_single_case(case, db)

    latest_feedback = db.query(JudgeFeedback).filter(JudgeFeedback.case_id == case_id).order_by(desc(JudgeFeedback.created_at)).first()

    return {
        'case_id': case.case_id,
        'case_title': case.case_title,
        'case_type': case.case_type,
        'filed_date': case.filed_date,
        'current_stage': case.current_stage,
        'last_progress_date': case.last_progress_date,
        'num_hearings': case.num_hearings,
        'num_adjournments': case.num_adjournments,
        'recent_adjournments': case.recent_adjournments,
        'custody_indicator': case.custody_indicator,
        'days_in_custody': case.days_in_custody,
        'urgency_category': case.urgency_category,
        'statutory_deadline': case.statutory_deadline,
        'petitioner': case.petitioner,
        'respondent': case.respondent,
        'court_room': case.court_room,
        'judge_name': case.judge_name,
        'next_hearing_date': case.next_hearing_date,
        'analysis': {
            'case_id': analysis.case_id,
            'case_age_days': analysis.case_age_days,
            'case_age_years': analysis.case_age_years,
            'age_classification': analysis.age_classification,
            'age_score': analysis.age_score,
            'stagnation_score': analysis.stagnation_score,
            'stagnation_level': analysis.stagnation_level,
            'stagnation_reasons': json.loads(analysis.stagnation_reasons or '[]'),
            'delay_risk': analysis.delay_risk,
            'delay_risk_category': analysis.delay_risk_category,
            'estimated_timeline_min_months': analysis.est_timeline_min,
            'estimated_timeline_max_months': analysis.est_timeline_max,
            'model_confidence': analysis.model_confidence,
            'legal_urgency': analysis.legal_urgency,
            'urgency_flags': json.loads(analysis.urgency_flags or '[]'),
            'legal_urgency_score': analysis.legal_urgency_score,
            'fast_track_status': analysis.fast_track_status,
            'mediation_status': analysis.mediation_status,
            'lok_adalat_status': analysis.lok_adalat_status,
            'settlement_status': analysis.settlement_status,
            'priority_score': analysis.priority_score,
            'priority_category': analysis.priority_category,
            'factor_breakdown': {
                'legal_urgency': analysis.factor_legal_urgency,
                'case_age': analysis.factor_case_age,
                'stagnation': analysis.factor_stagnation,
                'delay_risk': analysis.factor_delay_risk,
                'other_factors': analysis.factor_other_urgency
            },
            'narrative_explanation': analysis.narrative_explanation,
            'recommended_action': analysis.recommended_action
        },
        'latest_judge_feedback': {
            'id': latest_feedback.id,
            'engine_priority': latest_feedback.engine_priority,
            'judge_decision': latest_feedback.judge_decision,
            'action_taken': latest_feedback.action_taken,
            'reason': latest_feedback.reason,
            'notes': latest_feedback.notes,
            'timestamp': str(latest_feedback.created_at)
        } if latest_feedback else None
    }

def get_cases_list_service(
    db: Session,
    priority: Optional[str] = None,
    stage: Optional[str] = None,
    fast_track: Optional[str] = None,
    delay_status: Optional[str] = None,
    search: Optional[str] = None
) -> List[Dict[str, Any]]:
    query = db.query(Case, CaseAnalysisRecord).outerjoin(
        CaseAnalysisRecord, Case.case_id == CaseAnalysisRecord.case_id
    )

    if priority and priority.lower() != 'all':
        query = query.filter(CaseAnalysisRecord.priority_category == priority)
    if stage and stage.lower() != 'all':
        query = query.filter(Case.current_stage == stage)
    if fast_track and fast_track.lower() != 'all':
        if fast_track == 'Eligible':
            query = query.filter(CaseAnalysisRecord.fast_track_status.in_(['Suitable', 'Potentially Suitable']))
        else:
            query = query.filter(CaseAnalysisRecord.fast_track_status == fast_track)
    if delay_status and delay_status.lower() != 'all':
        query = query.filter(CaseAnalysisRecord.delay_risk_category == delay_status)
    if search:
        s = f"%{search}%"
        query = query.filter(
            or_(
                Case.case_id.ilike(s),
                Case.case_title.ilike(s),
                Case.petitioner.ilike(s),
                Case.respondent.ilike(s),
                Case.case_type.ilike(s)
            )
        )

    results = query.all()
    priority_map = {'Critical': 4, 'High': 3, 'Medium': 2, 'Routine': 1}
    
    formatted = []
    for case, analysis in results:
        p_cat = analysis.priority_category if analysis else 'Routine'
        p_score = analysis.priority_score if analysis else 0.0
        ft_stat = analysis.fast_track_status if analysis else 'Not Identified'
        d_cat = analysis.delay_risk_category if analysis else 'Low'
        d_risk = analysis.delay_risk if analysis else 0
        s_level = analysis.stagnation_level if analysis else 'Low'
        l_urg = analysis.legal_urgency if analysis else False

        formatted.append({
            'case_id': case.case_id,
            'case_title': case.case_title,
            'case_type': case.case_type,
            'filed_date': case.filed_date,
            'current_stage': case.current_stage,
            'priority': p_cat,
            'priority_score': p_score,
            'fast_track_status': ft_stat,
            'delay_status': d_cat,
            'delay_risk': d_risk,
            'stagnation_level': s_level,
            'legal_urgency': l_urg,
            'num_hearings': case.num_hearings,
            'num_adjournments': case.num_adjournments,
            '_rank': priority_map.get(p_cat, 0)
        })

    formatted.sort(key=lambda x: (x['_rank'], x['priority_score']), reverse=True)
    for item in formatted:
        item.pop('_rank', None)
    return formatted

def get_dashboard_metrics(db: Session) -> Dict[str, Any]:
    total_cases = db.query(Case).count()
    if total_cases == 0:
        return {
            'summary_cards': {'critical': 0, 'high': 0, 'medium': 0, 'routine': 0, 'fast_track_eligible': 0},
            'delay_distribution': {'high_delay': 0, 'medium_delay': 0, 'low_delay': 0},
            'total_pending_cases': 0,
            'avg_case_age_years': 0.0,
            'stagnating_cases_count': 0,
            'quick_alerts': [],
            'disclaimer': settings.DISCLAIMER_TEXT
        }

    analyses = db.query(CaseAnalysisRecord).all()
    crit = sum(1 for a in analyses if a.priority_category == 'Critical')
    high = sum(1 for a in analyses if a.priority_category == 'High')
    med = sum(1 for a in analyses if a.priority_category == 'Medium')
    rout = sum(1 for a in analyses if a.priority_category == 'Routine')
    ft_eligible = sum(1 for a in analyses if a.fast_track_status in ['Suitable', 'Potentially Suitable'])

    high_delay = sum(1 for a in analyses if a.delay_risk_category == 'High')
    med_delay = sum(1 for a in analyses if a.delay_risk_category == 'Medium')
    low_delay = sum(1 for a in analyses if a.delay_risk_category == 'Low')

    avg_age = round(sum(a.case_age_years for a in analyses) / max(1, len(analyses)), 1)
    stagnating_count = sum(1 for a in analyses if a.stagnation_level in ['High', 'Severe'])

    undertrial_alerts = db.query(Case).filter(Case.custody_indicator == True, Case.days_in_custody >= settings.UNDERTRIAL_CUSTODY_DAYS_THRESHOLD).count()
    statutory_alerts = sum(1 for a in analyses if any('statutory deadline' in f.lower() for f in json.loads(a.urgency_flags or '[]')))
    no_progress_3m = sum(1 for a in analyses if a.stagnation_score >= 30)

    quick_alerts = [
        {
            'type': 'UNDERTRIAL',
            'count': undertrial_alerts,
            'title': f"{undertrial_alerts} cases crossing configured undertrial custody threshold",
            'severity': 'Critical',
            'filter': {'priority': 'Critical'}
        },
        {
            'type': 'STATUTORY',
            'count': statutory_alerts,
            'title': f"{statutory_alerts} cases approaching configured statutory target deadlines",
            'severity': 'High',
            'filter': {'priority': 'High'}
        },
        {
            'type': 'STAGNATION',
            'count': no_progress_3m,
            'title': f"{no_progress_3m} cases with no meaningful progress > 3 months",
            'severity': 'Medium',
            'filter': {'delay_status': 'High'}
        }
    ]

    return {
        'summary_cards': {
            'critical': crit,
            'high': high,
            'medium': med,
            'routine': rout,
            'fast_track_eligible': ft_eligible
        },
        'delay_distribution': {
            'high_delay': high_delay,
            'medium_delay': med_delay,
            'low_delay': low_delay
        },
        'total_pending_cases': total_cases,
        'avg_case_age_years': avg_age,
        'stagnating_cases_count': stagnating_count,
        'quick_alerts': quick_alerts,
        'disclaimer': settings.DISCLAIMER_TEXT
    }

def get_alerts_catalog(db: Session) -> List[Dict[str, Any]]:
    cases_with_analysis = db.query(Case, CaseAnalysisRecord).join(
        CaseAnalysisRecord, Case.case_id == CaseAnalysisRecord.case_id
    ).all()

    alerts_list = []
    for case, analysis in cases_with_analysis:
        urgency_flags = json.loads(analysis.urgency_flags or '[]')
        stag_reasons = json.loads(analysis.stagnation_reasons or '[]')

        if analysis.legal_urgency:
            for flag in urgency_flags:
                alerts_list.append({
                    'id': f"urg-{case.case_id}-{len(alerts_list)}",
                    'case_id': case.case_id,
                    'case_title': case.case_title,
                    'category': 'URGENT',
                    'severity': 'Critical' if analysis.priority_category == 'Critical' else 'High',
                    'message': flag,
                    'details': f"Stage: {case.current_stage} | Pending for {analysis.case_age_years} yrs | Hearings: {case.num_hearings}",
                    'filed_date': case.filed_date,
                    'current_stage': case.current_stage,
                    'priority': analysis.priority_category
                })

        if analysis.stagnation_level in ['High', 'Severe'] or analysis.delay_risk >= 75:
            reason_text = stag_reasons[0] if stag_reasons else f"High delay risk ({analysis.delay_risk}%)"
            alerts_list.append({
                'id': f"del-{case.case_id}-{len(alerts_list)}",
                'case_id': case.case_id,
                'case_title': case.case_title,
                'category': 'DELAY',
                'severity': 'High' if analysis.stagnation_level == 'Severe' else 'Medium',
                'message': f"Severe procedural stagnation: {reason_text}",
                'details': f"Predicted delay timeline: {analysis.est_timeline_min}-{analysis.est_timeline_max} months | Adjournments: {case.num_adjournments}",
                'filed_date': case.filed_date,
                'current_stage': case.current_stage,
                'priority': analysis.priority_category
            })

        if case.statutory_deadline or case.next_hearing_date:
            info = f"Next listing: {case.next_hearing_date}" if case.next_hearing_date else f"Target deadline: {case.statutory_deadline}"
            alerts_list.append({
                'id': f"upc-{case.case_id}-{len(alerts_list)}",
                'case_id': case.case_id,
                'case_title': case.case_title,
                'category': 'UPCOMING',
                'severity': 'Medium',
                'message': f"Upcoming listing / statutory calendar: {info}",
                'details': f"Court Room: {case.court_room} | Stage: {case.current_stage}",
                'filed_date': case.filed_date,
                'current_stage': case.current_stage,
                'priority': analysis.priority_category
            })

        if analysis.fast_track_status in ['Suitable', 'Potentially Suitable'] or analysis.mediation_status == 'Suitable' or analysis.lok_adalat_status == 'Suitable':
            opp_types = []
            if analysis.fast_track_status in ['Suitable', 'Potentially Suitable']: opp_types.append('Fast-Track Review')
            if analysis.mediation_status == 'Suitable': opp_types.append('Mediation / Conciliation')
            if analysis.lok_adalat_status == 'Suitable': opp_types.append('Lok Adalat Referral')
            opp_str = ', '.join(opp_types)

            alerts_list.append({
                'id': f"opp-{case.case_id}-{len(alerts_list)}",
                'case_id': case.case_id,
                'case_title': case.case_title,
                'category': 'OPPORTUNITY',
                'severity': 'Info',
                'message': f"Alternative resolution opportunity candidate: {opp_str}",
                'details': f"Dispute Type: {case.case_type} | Pending: {analysis.case_age_years} yrs",
                'filed_date': case.filed_date,
                'current_stage': case.current_stage,
                'priority': analysis.priority_category
            })

    return alerts_list
