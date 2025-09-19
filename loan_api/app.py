from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse, JSONResponse
from models import LOAN_FIELDS, LoanTypeResponse, LoanAnalysisRequest, LoanAnalysisResponse, ReportEmailRequest
from cohere_client import analyze_loan_with_cohere
from pdf_utils import generate_loan_report_pdf
from email_utils import send_email_report

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World!"}

@app.get("/loan-types", response_model=LoanTypeResponse)
def get_loan_types():
    return LoanTypeResponse(loan_types=list(LOAN_FIELDS.keys()), fields=LOAN_FIELDS)

def compute_derived_ratios(data):
    ratios = {}
    try:
        ratios["loan_to_income_ratio"] = float(data["loan_amount"]) / float(data["annual_income"])
    except:
        ratios["loan_to_income_ratio"] = None
    try:
        ratios["debt_to_income_ratio"] = float(data.get("existing_debts", 0)) / float(data["annual_income"])
    except:
        ratios["debt_to_income_ratio"] = None
    try:
        if data.get("collateral", "No") == "Yes":
            ratios["collateral_to_loan_ratio"] = float(data.get("collateral_value", 0)) / float(data["loan_amount"])
        else:
            ratios["collateral_to_loan_ratio"] = None
    except:
        ratios["collateral_to_loan_ratio"] = None
    return ratios

@app.post("/analyze-loan", response_model=LoanAnalysisResponse)
def analyze_loan(payload: LoanAnalysisRequest):
    if payload.loan_type not in LOAN_FIELDS:
        raise HTTPException(status_code=400, detail="Invalid loan type")
    derived_ratios = compute_derived_ratios(payload.data)
    result = analyze_loan_with_cohere(payload.loan_type, payload.data, derived_ratios)
    return LoanAnalysisResponse(**result)

@app.post("/download-report")
def download_report(payload: LoanAnalysisRequest):
    analysis = analyze_loan(payload)
    try:
        pdf_buffer = generate_loan_report_pdf({**payload.data, "loan_type": payload.loan_type}, analysis.dict())
        return StreamingResponse(pdf_buffer, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=loan_report.pdf"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate or stream PDF: {e}")

@app.post("/send-email")
def send_email(payload: ReportEmailRequest):
    analysis = analyze_loan(LoanAnalysisRequest(loan_type=payload.report_data["loan_type"], data=payload.report_data))
    pdf_buffer = generate_loan_report_pdf(payload.report_data, analysis.dict())
    try:
        send_email_report(payload.email, pdf_buffer)
        return {"message": "Email sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

