🚀 Smart Loan Eligibility Checker

An AI-powered loan risk prediction system built with Python (Flask/FastAPI), Cohere API, and a modern React + Tailwind frontend.
Users can check their loan eligibility instantly, get an approval score, understand risk factors, and download or email a personalized loan report PDF.

✨ Features

✅ Dynamic Loan Forms – Choose from 5 loan types: Car, Home, Student, Personal, and Business. Each form shows only relevant fields (max 10–12).
✅ AI-Powered Analysis – Uses Cohere API to generate loan decisions, risk scores, and improvement tips.
✅ Explainable Decisions – Shows important factors considered (Credit Score, Income, LTV ratio, etc.).
✅ Loan Risk Score (0–100) – More than just Yes/No, users get a numerical score.
✅ Alternative Loan Suggestions – If rejected, users get recommended alternatives.
✅ Beautiful Results Dashboard – Animated charts, risk indicators, and insights.
✅ Downloadable PDF Report – User-friendly summary with eligibility, risk score, and suggestions.
✅ Email Report Option – One-click email delivery of the PDF (no signup required).
✅ Modern UI/UX – React + Tailwind + Framer Motion animations for a smooth, lively experience.

🖥️ Tech Stack
Backend

Python (Flask / FastAPI)

Cohere API (for AI decision-making)

ReportLab (PDF generation)

SMTP / SendGrid / Gmail API (email sending)

Frontend

React (Vite)

TailwindCSS (styling)

Framer Motion (animations)

Recharts (risk score visualization)

Axios (API calls)

📌 API Endpoints
🔹 GET /loan-types

Returns available loan types and their required fields.

🔹 POST /analyze-loan

Accepts user inputs → Calls Cohere → Returns:

{
  "decision": "Risk",
  "risk_score": 62,
  "reasons": [
    "Low income compared to requested loan",
    "High debt-to-income ratio"
  ],
  "improvement_tips": [
    "Reduce existing debts",
    "Increase down payment"
  ],
  "comparison_insights": [
    "You may qualify for a personal loan instead of a business loan"
  ]
}

🔹 GET /download-report

Generates and returns a PDF report of results.

🔹 POST /send-email

Sends the generated PDF report to a provided email.

📊 Example Flow

1️⃣ User selects loan type (Car, Home, etc.)
2️⃣ Dynamic form appears with relevant fields (Income, Credit Score, etc.)
3️⃣ User submits form → Backend sends data to Cohere
4️⃣ AI analysis response → Decision + Score + Reasons + Alternatives
5️⃣ Results page → Shows insights with graphs & animations
6️⃣ Download / Email Report → Personalized PDF with explainable features

🎨 Frontend Preview

Landing page with animations & gradient hero section.

Loan type cards with icons & hover effects.

Animated form fields with smooth transitions.

Results page → Circular progress bar for risk score, insights displayed in cards.

Buttons: Download PDF / Email Report.

⚡ Getting Started
1. Clone Repository
git clone https://github.com/yourusername/loan-eligibility-checker.git
cd loan-eligibility-checker

2. Backend Setup
cd backend
pip install -r requirements.txt


Create a .env file:

COHERE_API_KEY=your_cohere_key
SMTP_EMAIL=your_email
SMTP_PASSWORD=your_password


Run server:

uvicorn main:app --reload

3. Frontend Setup
cd frontend
npm install
npm run dev

📥 Sample PDF Report

The generated report includes:

User details & loan type

Decision (Approved / Risk)

Loan Risk Score (e.g., 72/100)

Reasons for decision

Suggestions for improvement

Explainable features considered

🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.
