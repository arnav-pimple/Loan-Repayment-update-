import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, formData, result } = body

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // In a real application, you would use an email service like SendGrid, Nodemailer, or Resend
    // For this demo, we'll simulate the email sending process

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Create email content
    const emailContent = {
      to: email,
      subject: "Your Loan Eligibility Report - LoanCheck AI",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ea580c;">Your Loan Eligibility Report</h1>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Application Summary</h2>
            <p><strong>Loan Type:</strong> ${formData.loanType}</p>
            <p><strong>Decision:</strong> <span style="color: ${result.decision === "approved" ? "#10b981" : result.decision === "risk" ? "#eab308" : "#ef4444"};">${result.decision.toUpperCase()}</span></p>
            <p><strong>Risk Score:</strong> ${result.riskScore}/100</p>
          </div>

          <div style="margin: 20px 0;">
            <h3>Key Factors:</h3>
            <ul>
              ${result.reasons.map((reason: string) => `<li>${reason}</li>`).join("")}
            </ul>
          </div>

          ${
            result.improvementTips.length > 0
              ? `
          <div style="margin: 20px 0;">
            <h3>Improvement Tips:</h3>
            <ul>
              ${result.improvementTips.map((tip: string) => `<li>${tip}</li>`).join("")}
            </ul>
          </div>
          `
              : ""
          }

          <div style="background: #ea580c; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p>Thank you for using LoanCheck AI!</p>
            <p style="margin: 0;">Visit us again for more financial insights.</p>
          </div>
        </div>
      `,
    }

    // Log the email content (in real app, this would actually send the email)
    console.log("Email would be sent:", emailContent)

    return NextResponse.json({
      success: true,
      message: `Report sent successfully to ${email}`,
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
