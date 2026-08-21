"""
Seed Data Generator: Generates ~150 diverse, realistic Indian court cases with complete procedural histories.
"""
import random
import csv
import os
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.case_model import Case
from app.services.case_service import analyze_single_case

def generate_realistic_cases(db: Session, count: int = 150):
    # Clear existing to ensure fresh clean calibrated distribution
    db.query(Case).delete()
    db.commit()

    random.seed(42)

    case_types = [
        'Civil Suit (Money Recovery)',
        'Criminal Case (IPC 420/406 Fraud)',
        'NI Act Section 138 (Cheque Bounce)',
        'Motor Accident Claim (MACT)',
        'Matrimonial Dispute (HMA / Maintenance)',
        'Land Acquisition & Title Dispute',
        'Commercial Summary Suit (Order 37 CPC)',
        'Bail Application & Criminal Revision'
    ]

    stages = [
        'Filing / Summons & Notice',
        'Written Statement / Pleadings',
        'Framing of Issues & Admissions',
        'Petitioner / Prosecution Evidence',
        'Respondent / Defence Evidence',
        'Final Arguments',
        'Order / Judgment Reserve',
        'Execution Petition'
    ]

    petitioner_names = [
        'State of NCT of Delhi', 'Sunita Devi', 'M/s Apex Infra Ltd', 'Rajesh Gupta',
        'National Insurance Co. Ltd', 'Anita Sharma', 'ICICI Bank Ltd', 'Ramesh Chandra Verma',
        'Pooja Aggarwal', 'Vikas Trading Corp', 'State of Maharashtra', 'Kavita Singh',
        'HDFC Bank Ltd', 'Surendra Kumar', 'Meena Kumari & Ors', 'State of Karnataka'
    ]

    respondent_names = [
        'Rahul Kumar & Anr', 'Dinesh Singh', 'Bharat Logistics Pvt Ltd', 'Pawan Verma',
        'Mukesh Rawat & Ors', 'Sanjay Sharma', 'Om Prakash Yadav', 'Shyam Lal & Sons',
        'Deepak Malhotra', 'Global Steel Works', 'Mohit Bansal', 'Ritu Mathur',
        'Pradeep Mehra', 'Ashok Singhal', 'Ajay Kumar & Ors', 'Vikram Rathore'
    ]

    court_rooms = [
        'Court Room 1 - Principal District Judge',
        'Court Room 2 - Commercial Court Division',
        'Court Room 3 - Additional District Judge (Fast Track)',
        'Court Room 4 - Chief Judicial Magistrate',
        'Court Room 5 - Motor Accident Claims Tribunal (MACT)',
        'Court Room 6 - Family Court Division'
    ]

    ref_date = datetime(2026, 8, 21)
    generated_cases = []
    
    for i in range(1, count + 1):
        state_code = random.choice(['DL', 'MH', 'KA', 'WB', 'TN', 'UP'])
        
        # Design specific priority buckets for a realistic distribution
        if i <= 18:
            # Critical urgency cases: Undertrials > 180 days, ancient cases (> 6 years), severe stagnation
            year = random.choice([2017, 2018, 2019])
            case_type = random.choice(['Criminal Case (IPC 420/406 Fraud)', 'Bail Application & Criminal Revision', 'NI Act Section 138 (Cheque Bounce)'])
            stage = random.choice(['Petitioner / Prosecution Evidence', 'Respondent / Defence Evidence', 'Final Arguments'])
            is_custody = True
            custody_days = random.randint(210, 480)
            urgency_cat = 'Undertrial Custody Threshold'
            statutory_deadline_str = (ref_date + timedelta(days=random.randint(10, 45))).strftime('%Y-%m-%d')
            num_hearings = random.randint(24, 45)
            num_adjournments = int(num_hearings * 0.75)
            recent_adjournments = random.randint(3, 5)
            inactive_days = random.randint(150, 400)
        elif i <= 55:
            # High priority cases: Senior citizen, statutory approaching, long pending (> 3 years)
            year = random.choice([2019, 2020, 2021, 2022])
            case_type = random.choice(case_types)
            stage = random.choice(stages)
            is_custody = random.choice([True, False])
            custody_days = random.randint(90, 160) if is_custody else 0
            urgency_cat = random.choice(['Senior Citizen (72 Yrs)', 'Interim Maintenance Urgency', 'Child Custody Matter'])
            statutory_deadline_str = (ref_date + timedelta(days=random.randint(20, 75))).strftime('%Y-%m-%d')
            num_hearings = random.randint(12, 28)
            num_adjournments = int(num_hearings * 0.55)
            recent_adjournments = random.randint(2, 4)
            inactive_days = random.randint(90, 220)
        elif i <= 110:
            # Medium priority cases: Routine civil, NI Act, MACT with moderate age (1-3 years)
            year = random.choice([2022, 2023, 2024])
            case_type = random.choice(case_types)
            stage = random.choice(stages)
            is_custody = False
            custody_days = 0
            urgency_cat = None
            statutory_deadline_str = None
            num_hearings = random.randint(5, 15)
            num_adjournments = int(num_hearings * 0.35)
            recent_adjournments = random.randint(1, 2)
            inactive_days = random.randint(30, 110)
        else:
            # Routine / Fresh cases: < 1 year, active progress
            year = random.choice([2025, 2026])
            case_type = random.choice(case_types)
            stage = random.choice(['Filing / Summons & Notice', 'Written Statement / Pleadings', 'Framing of Issues & Admissions'])
            is_custody = False
            custody_days = 0
            urgency_cat = None
            statutory_deadline_str = None
            num_hearings = random.randint(1, 5)
            num_adjournments = random.randint(0, 1)
            recent_adjournments = 0
            inactive_days = random.randint(5, 45)

        seq = 1000 + i
        case_id = f"{state_code}-{year}-{seq}"
        petitioner = random.choice(petitioner_names)
        respondent = random.choice(respondent_names)
        case_title = f"{petitioner} vs {respondent}"

        filed_month = random.randint(1, 12) if year < 2026 else random.randint(1, 6)
        filed_day = random.randint(1, 28)
        filed_dt = datetime(year, filed_month, filed_day)
        filed_date_str = filed_dt.strftime('%Y-%m-%d')

        last_prog_dt = max(filed_dt, ref_date - timedelta(days=inactive_days))
        last_progress_str = last_prog_dt.strftime('%Y-%m-%d')

        next_hearing_str = (ref_date + timedelta(days=random.randint(5, 60))).strftime('%Y-%m-%d')

        case_obj = Case(
            case_id=case_id,
            case_title=case_title,
            case_type=case_type,
            filed_date=filed_date_str,
            current_stage=stage,
            last_progress_date=last_progress_str,
            num_hearings=num_hearings,
            num_adjournments=num_adjournments,
            recent_adjournments=recent_adjournments,
            custody_indicator=is_custody,
            days_in_custody=custody_days,
            urgency_category=urgency_cat,
            statutory_deadline=statutory_deadline_str,
            petitioner=petitioner,
            respondent=respondent,
            court_room=random.choice(court_rooms),
            judge_name='Hon. Additional District & Sessions Judge',
            next_hearing_date=next_hearing_str
        )

        db.add(case_obj)
        generated_cases.append(case_obj)

    db.commit()

    for c in generated_cases:
        analyze_single_case(c, db, ref_date='2026-08-21')

    print(f"Successfully seeded and analyzed {len(generated_cases)} cases with calibrated distribution.")

    export_csv_path = os.path.join(os.path.dirname(__file__), 'sample_cases.csv')
    with open(export_csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            'case_id', 'case_title', 'case_type', 'filed_date', 'current_stage',
            'last_progress_date', 'num_hearings', 'num_adjournments', 'recent_adjournments',
            'custody_indicator', 'days_in_custody', 'urgency_category', 'statutory_deadline',
            'petitioner', 'respondent', 'court_room'
        ])
        for c in generated_cases[:30]:
            writer.writerow([
                c.case_id, c.case_title, c.case_type, c.filed_date, c.current_stage,
                c.last_progress_date, c.num_hearings, c.num_adjournments, c.recent_adjournments,
                c.custody_indicator, c.days_in_custody, c.urgency_category or '', c.statutory_deadline or '',
                c.petitioner, c.respondent, c.court_room
            ])
    print(f"Generated sample CSV at {export_csv_path}")
