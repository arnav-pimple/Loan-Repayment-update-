from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict

LOAN_FIELDS = {
    "car": [
        "full_name", "age", "employment_status", "annual_income",
        "existing_debts", "credit_score", "loan_amount", "loan_tenure",
        "collateral", "vehicle_value", "down_payment", "insurance_status"
    ],
    "home": [
        "full_name", "age", "employment_status", "annual_income",
        "existing_debts", "credit_score", "loan_amount", "loan_tenure",
        "collateral", "property_value", "down_payment", "years_in_current_job"
    ],
    "student": [
        "full_name", "age", "employment_status", "annual_income",
        "existing_debts", "credit_score", "loan_amount", "loan_tenure",
        "collateral", "course_type", "university_tier", "expected_future_salary", "co_signer_presence"
    ],
    "personal": [
        "full_name", "age", "employment_status", "annual_income",
        "existing_debts", "credit_score", "loan_amount", "loan_tenure",
        "collateral", "purpose", "existing_credit_card_usage"
    ],
    "business": [
        "full_name", "age", "employment_status", "annual_income",
        "existing_debts", "credit_score", "loan_amount", "loan_tenure",
        "collateral", "business_type", "years_in_business", "annual_turnover", "profit_margin"
    ]
}

class LoanTypeResponse(BaseModel):
    loan_types: List[str]
    fields: Dict[str, List[str]]

class LoanAnalysisRequest(BaseModel):
    loan_type: str
    data: dict  # user form submission

class LoanAnalysisResponse(BaseModel):
    decision: str
    risk_score: int
    reasons: List[str]
    improvement_tips: List[str]
    comparison_insights: Optional[List[str]]

class ReportEmailRequest(BaseModel):
    email: EmailStr
    report_data: dict  # The same data as PDF generation
