from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO

def generate_loan_report_pdf(candidate_data, analysis):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    textobj = c.beginText(50, 700)
    textobj.setFont("Helvetica", 12)

    textobj.textLine("Loan Analysis Report")
    textobj.textLine("="*40)
    textobj.textLine("Candidate Details:")
    for k, v in candidate_data.items():
        textobj.textLine(f"{k.replace('_', ' ').title()}: {v}")
    textobj.textLine("")
    textobj.textLine(f"Loan Type: {candidate_data.get('loan_type', '')}")
    textobj.textLine(f"Decision: {analysis['decision']}")
    textobj.textLine(f"Loan Risk Score: {analysis['risk_score']}/100")
    textobj.textLine("Reasons:")
    for r in analysis['reasons']:
        textobj.textLine(f"- {r}")
    textobj.textLine("Improvement Tips:")
    for t in analysis.get('improvement_tips', []):
        textobj.textLine(f"- {t}")
    textobj.textLine("Alternatives:")
    for alt in analysis.get('comparison_insights', []):
        textobj.textLine(f"- {alt}")
    textobj.textLine("")
    textobj.textLine("Important factors considered: Credit Score, Income, Loan-to-Value Ratio etc.")

    c.drawText(textobj)
    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer

