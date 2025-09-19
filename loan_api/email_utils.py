import smtplib
from email.message import EmailMessage
from config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL

def send_email_report(to_address, pdf_file, subject="Loan Analysis Report"):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = FROM_EMAIL
    msg["To"] = to_address
    msg.set_content("Please find your loan analysis report attached as PDF.")

    msg.add_attachment(pdf_file.read(), maintype="application", subtype="pdf", filename="loan_report.pdf")

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)
