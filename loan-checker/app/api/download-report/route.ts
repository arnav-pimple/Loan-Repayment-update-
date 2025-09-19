import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formData, result } = body

    // In a real application, you would use a PDF generation library like jsPDF or Puppeteer
    // For this demo, we'll simulate the PDF generation process

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create a simple text-based report (in real app, this would be a proper PDF)
    const reportContent = `
LOAN ELIGIBILITY REPORT
======================

Application Details:
- Loan Type: ${formData.loanType}
- Decision: ${result.decision.toUpperCase()}
- Risk Score: ${result.riskScore}/100

Key Factors:
${result.reasons.map((reason: string) => `- ${reason}`).join("\n")}

${
  result.improvementTips.length > 0
    ? `
Improvement Tips:
${result.improvementTips.map((tip: string) => `- ${tip}`).join("\n")}
`
    : ""
}

${
  result.alternativeLoans.length > 0
    ? `
Alternative Loan Options:
${result.alternativeLoans.map((loan: any) => `- ${loan.type}: ${loan.rate} for ${loan.term}`).join("\n")}
`
    : ""
}

Generated on: ${new Date().toLocaleDateString()}
    `.trim()

    // Return the report as a downloadable file
    return new NextResponse(reportContent, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="loan-report.pdf"',
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
