"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Calendar,
  Percent,
  Mail,
  Download,
  ArrowLeft,
  Lightbulb,
  Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedBackground } from "@/components/animated-background"
import { ThemeToggle } from "@/components/theme-toggle"
import { CircularProgress } from "@/components/circular-progress"
import { EmailModal } from "@/components/email-modal"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface LoanResult {
  decision: "approved" | "risk" | "denied"
  riskScore: number
  reasons: string[]
  improvementTips: string[]
  alternativeLoans: Array<{
    type: string
    rate: string
    term: string
    amount: string
  }>
  loanDetails?: {
    estimatedRate: string
    maxAmount: string
    recommendedTerm: string
  }
}

// Mock AI analysis function
const analyzeLoanApplication = (formData: any): LoanResult => {
  const { loanType, income, creditScore } = formData

  // Simple scoring algorithm for demo
  let score = 50

  // Credit score impact
  if (creditScore?.includes("800-850")) score += 30
  else if (creditScore?.includes("740-799")) score += 20
  else if (creditScore?.includes("670-739")) score += 10
  else if (creditScore?.includes("580-669")) score -= 10
  else score -= 20

  // Income impact
  if (income > 100000) score += 20
  else if (income > 50000) score += 10
  else if (income < 30000) score -= 15

  // Loan type specific adjustments
  if (loanType === "student" && formData.hasCoSigner) score += 15
  if (loanType === "business" && formData.businessAge?.includes("10+")) score += 15

  score = Math.max(0, Math.min(100, score))

  const decision = score >= 70 ? "approved" : score >= 40 ? "risk" : "denied"

  const reasons = []
  const improvementTips = []
  const alternativeLoans = []

  if (decision === "approved") {
    reasons.push("Strong credit profile", "Sufficient income", "Low debt-to-income ratio")
    improvementTips.push("Consider a larger down payment to reduce monthly payments")
  } else if (decision === "risk") {
    reasons.push("Moderate credit score", "Income meets minimum requirements")
    improvementTips.push("Improve credit score by paying down existing debt", "Consider a co-signer")
    alternativeLoans.push(
      { type: "Secured Loan", rate: "8.5%", term: "5 years", amount: "$25,000" },
      { type: "Credit Union Loan", rate: "7.2%", term: "4 years", amount: "$20,000" },
    )
  } else {
    reasons.push("Credit score below minimum", "Insufficient income")
    improvementTips.push("Work on improving credit score", "Increase income or reduce expenses")
    alternativeLoans.push(
      { type: "Secured Loan", rate: "12%", term: "3 years", amount: "$10,000" },
      { type: "Peer-to-Peer Loan", rate: "15%", term: "2 years", amount: "$5,000" },
    )
  }

  return {
    decision,
    riskScore: score,
    reasons,
    improvementTips,
    alternativeLoans,
    loanDetails:
      decision === "approved"
        ? {
            estimatedRate: "6.5%",
            maxAmount: "$50,000",
            recommendedTerm: "5 years",
          }
        : undefined,
  }
}

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<LoanResult | null>(null)
  const [formData, setFormData] = useState<any>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    const storedData = localStorage.getItem("loanFormData")
    if (!storedData) {
      router.push("/")
      return
    }

    const data = JSON.parse(storedData)
    setFormData(data)

    // Simulate processing delay
    setTimeout(() => {
      const analysisResult = analyzeLoanApplication(data)
      setResult(analysisResult)

      if (analysisResult.decision === "approved") {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    }, 1000)
  }, [router])

  const handleDownloadPDF = async () => {
    if (!result || !formData) return

    setIsDownloading(true)
    try {
      const response = await fetch("/api/download-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData, result }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "loan-eligibility-report.pdf"
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        // Show success animation
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 2000)
      } else {
        throw new Error("Failed to download PDF")
      }
    } catch (error) {
      console.error("Error downloading PDF:", error)
      alert("Failed to download PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  const handleSendEmail = async (email: string) => {
    if (!result || !formData) return

    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, formData, result }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to send email")
    }

    // Show success animation
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)
  }

  if (!result) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="font-heading font-bold text-2xl mb-2">Analyzing Your Application</h2>
          <p className="text-muted-foreground">Our AI is processing your information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -10,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 10,
                rotate: 360,
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center gap-4">
          <Link href="/loan-types">
            <Button variant="outline" size="icon" className="glass-card border-white/20 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="font-heading font-bold text-2xl text-primary">LoanCheck AI</div>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4">Your Loan Analysis Results</h1>
            <p className="text-muted-foreground">Based on your application, here's what we found</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Decision Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="glass-card border-white/20">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {result.decision === "approved" ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <Badge className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 text-lg">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Approved
                        </Badge>
                      </motion.div>
                    ) : result.decision === "risk" ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 text-lg">
                          <AlertTriangle className="w-5 h-5 mr-2" />
                          Needs Review
                        </Badge>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <Badge className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 text-lg">
                          <AlertTriangle className="w-5 h-5 mr-2" />
                          High Risk
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                  <CardTitle className="font-heading text-2xl">
                    {result.decision === "approved"
                      ? "Congratulations! You're likely to be approved"
                      : result.decision === "risk"
                        ? "Your application needs some improvements"
                        : "Your application has some challenges"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.loanDetails && (
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 glass-card rounded-lg">
                        <Percent className="w-6 h-6 text-primary mx-auto mb-2" />
                        <div className="font-semibold">{result.loanDetails.estimatedRate}</div>
                        <div className="text-sm text-muted-foreground">Est. Rate</div>
                      </div>
                      <div className="text-center p-4 glass-card rounded-lg">
                        <DollarSign className="w-6 h-6 text-primary mx-auto mb-2" />
                        <div className="font-semibold">{result.loanDetails.maxAmount}</div>
                        <div className="text-sm text-muted-foreground">Max Amount</div>
                      </div>
                      <div className="text-center p-4 glass-card rounded-lg">
                        <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                        <div className="font-semibold">{result.loanDetails.recommendedTerm}</div>
                        <div className="text-sm text-muted-foreground">Term</div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="font-heading font-semibold text-lg flex items-center">
                      <Target className="w-5 h-5 mr-2 text-primary" />
                      Key Factors
                    </h3>
                    <ul className="space-y-2">
                      {result.reasons.map((reason, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                          className="flex items-center text-sm"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {reason}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Risk Score */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="glass-card border-white/20 text-center">
                <CardHeader>
                  <CardTitle className="font-heading">Risk Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <CircularProgress value={result.riskScore} className="mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    {result.riskScore >= 80
                      ? "Excellent creditworthiness"
                      : result.riskScore >= 60
                        ? "Good creditworthiness"
                        : result.riskScore >= 40
                          ? "Fair creditworthiness"
                          : "Needs improvement"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Improvement Tips */}
          {result.improvementTips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6"
            >
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="font-heading flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                    Improvement Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.improvementTips.map((tip, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        className="flex items-start"
                      >
                        <TrendingUp className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{tip}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Alternative Loans */}
          {result.alternativeLoans.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-6"
            >
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="font-heading">Alternative Loan Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {result.alternativeLoans.map((loan, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                        className="p-4 glass-card rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10"
                      >
                        <h4 className="font-semibold mb-2">{loan.type}</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div>Rate: {loan.rate}</div>
                          <div>Term: {loan.term}</div>
                          <div>Max Amount: {loan.amount}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button onClick={handleDownloadPDF} size="lg" className="animate-pulse-glow" disabled={isDownloading}>
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? "Generating PDF..." : "Download PDF Report"}
            </Button>
            <Button
              onClick={() => setIsEmailModalOpen(true)}
              variant="outline"
              size="lg"
              className="glass-card border-white/20 bg-transparent"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Report via Email
            </Button>
          </motion.div>
        </div>
      </main>

      {/* Email Modal */}
      <EmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} onSend={handleSendEmail} />
    </div>
  )
}
