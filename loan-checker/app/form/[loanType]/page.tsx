"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AnimatedBackground } from "@/components/animated-background"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface FormField {
  id: string
  label: string
  type: "text" | "number" | "select" | "switch"
  options?: string[]
  min?: number
  max?: number
  step?: number
  required?: boolean
  placeholder?: string
}

const loanFormFields: Record<string, FormField[]> = {
  car: [
    {
      id: "income",
      label: "Annual Income",
      type: "number",
      min: 1500000,
      max: 37500000,
      step: 375000,
      required: true,
      placeholder: "Enter annual income in ₹",
    },
    {
      id: "carPrice",
      label: "Car Price",
      type: "number",
      min: 375000,
      max: 15000000,
      step: 75000,
      required: true,
      placeholder: "Enter car price in ₹",
    },
    {
      id: "downPayment",
      label: "Down Payment",
      type: "number",
      min: 0,
      max: 3750000,
      step: 37500,
      required: true,
      placeholder: "Enter down payment in ₹",
    },
    {
      id: "creditScore",
      label: "Credit Score Range",
      type: "select",
      options: ["300-579", "580-669", "670-739", "740-799", "800-850"],
      required: true,
    },
    {
      id: "employment",
      label: "Employment Status",
      type: "select",
      options: ["Full-time", "Part-time", "Self-employed", "Unemployed"],
      required: true,
    },
    { id: "carType", label: "Car Type", type: "select", options: ["New", "Used"], required: true },
    {
      id: "loanTerm",
      label: "Preferred Loan Term (years)",
      type: "select",
      options: ["2", "3", "4", "5", "6", "7"],
      required: true,
    },
    { id: "hasCoSigner", label: "Do you have a co-signer?", type: "switch" },
    {
      id: "monthlyExpenses",
      label: "Monthly Expenses",
      type: "number",
      min: 37500,
      max: 750000,
      step: 7500,
      required: true,
      placeholder: "Enter monthly expenses in ₹",
    },
    { id: "existingLoans", label: "Do you have existing auto loans?", type: "switch" },
  ],
  home: [
    {
      id: "income",
      label: "Annual Income",
      type: "number",
      min: 2250000,
      max: 75000000,
      step: 750000,
      required: true,
      placeholder: "Enter annual income in ₹",
    },
    {
      id: "homePrice",
      label: "Home Price",
      type: "number",
      min: 3750000,
      max: 150000000,
      step: 750000,
      required: true,
      placeholder: "Enter home price in ₹",
    },
    {
      id: "downPayment",
      label: "Down Payment",
      type: "number",
      min: 0,
      max: 30000000,
      step: 375000,
      required: true,
      placeholder: "Enter down payment in ₹",
    },
    {
      id: "creditScore",
      label: "Credit Score Range",
      type: "select",
      options: ["300-579", "580-669", "670-739", "740-799", "800-850"],
      required: true,
    },
    {
      id: "employment",
      label: "Employment Status",
      type: "select",
      options: ["Full-time", "Part-time", "Self-employed", "Unemployed"],
      required: true,
    },
    {
      id: "homeType",
      label: "Property Type",
      type: "select",
      options: ["Single Family", "Condo", "Townhouse", "Multi-family"],
      required: true,
    },
    {
      id: "loanTerm",
      label: "Preferred Loan Term (years)",
      type: "select",
      options: ["15", "20", "25", "30"],
      required: true,
    },
    { id: "firstTimeBuyer", label: "First-time home buyer?", type: "switch" },
    {
      id: "monthlyDebts",
      label: "Monthly Debt Payments",
      type: "number",
      min: 0,
      max: 375000,
      step: 3750,
      required: true,
      placeholder: "Enter monthly debt payments in ₹",
    },
    {
      id: "assets",
      label: "Total Assets",
      type: "number",
      min: 0,
      max: 37500000,
      step: 375000,
      required: true,
      placeholder: "Enter total assets in ₹",
    },
  ],
  student: [
    {
      id: "tuitionCost",
      label: "Annual Tuition Cost",
      type: "number",
      min: 375000,
      max: 6000000,
      step: 75000,
      required: true,
      placeholder: "Enter annual tuition cost in ₹",
    },
    {
      id: "programLength",
      label: "Program Length (years)",
      type: "select",
      options: ["1", "2", "3", "4", "5", "6+"],
      required: true,
    },
    {
      id: "schoolType",
      label: "School Type",
      type: "select",
      options: ["Public In-State", "Public Out-of-State", "Private", "Community College"],
      required: true,
    },
    {
      id: "degreeLevel",
      label: "Degree Level",
      type: "select",
      options: ["Associate", "Bachelor's", "Master's", "Doctoral", "Professional"],
      required: true,
    },
    {
      id: "parentIncome",
      label: "Parent/Guardian Income",
      type: "number",
      min: 0,
      max: 22500000,
      step: 375000,
      placeholder: "Enter parent/guardian income in ₹",
    },
    {
      id: "studentIncome",
      label: "Student Income",
      type: "number",
      min: 0,
      max: 3750000,
      step: 75000,
      placeholder: "Enter student income in ₹",
    },
    { id: "hasCoSigner", label: "Do you have a co-signer?", type: "switch" },
    {
      id: "creditScore",
      label: "Credit Score Range",
      type: "select",
      options: ["No Credit", "300-579", "580-669", "670-739", "740-799", "800-850"],
      required: true,
    },
    {
      id: "currentYear",
      label: "Current Academic Year",
      type: "select",
      options: ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"],
      required: true,
    },
    { id: "existingLoans", label: "Do you have existing student loans?", type: "switch" },
  ],
  personal: [
    {
      id: "income",
      label: "Annual Income",
      type: "number",
      min: 1125000,
      max: 22500000,
      step: 187500,
      required: true,
      placeholder: "Enter annual income in ₹",
    },
    {
      id: "loanAmount",
      label: "Loan Amount Needed",
      type: "number",
      min: 75000,
      max: 7500000,
      step: 37500,
      required: true,
      placeholder: "Enter loan amount needed in ₹",
    },
    {
      id: "loanPurpose",
      label: "Loan Purpose",
      type: "select",
      options: ["Debt Consolidation", "Home Improvement", "Medical Expenses", "Wedding", "Vacation", "Other"],
      required: true,
    },
    {
      id: "creditScore",
      label: "Credit Score Range",
      type: "select",
      options: ["300-579", "580-669", "670-739", "740-799", "800-850"],
      required: true,
    },
    {
      id: "employment",
      label: "Employment Status",
      type: "select",
      options: ["Full-time", "Part-time", "Self-employed", "Unemployed"],
      required: true,
    },
    {
      id: "loanTerm",
      label: "Preferred Loan Term (years)",
      type: "select",
      options: ["2", "3", "4", "5", "6", "7"],
      required: true,
    },
    {
      id: "monthlyExpenses",
      label: "Monthly Expenses",
      type: "number",
      min: 37500,
      max: 600000,
      step: 7500,
      required: true,
      placeholder: "Enter monthly expenses in ₹",
    },
    { id: "hasCollateral", label: "Do you have collateral?", type: "switch" },
    {
      id: "bankingHistory",
      label: "Years with current bank",
      type: "select",
      options: ["Less than 1", "1-2", "3-5", "5+"],
      required: true,
    },
    {
      id: "existingDebt",
      label: "Total Existing Debt",
      type: "number",
      min: 0,
      max: 15000000,
      step: 75000,
      required: true,
      placeholder: "Enter total existing debt in ₹",
    },
  ],
  business: [
    {
      id: "businessRevenue",
      label: "Annual Business Revenue",
      type: "number",
      min: 750000,
      max: 375000000,
      step: 1875000,
      required: true,
      placeholder: "Enter annual business revenue in ₹",
    },
    {
      id: "loanAmount",
      label: "Loan Amount Needed",
      type: "number",
      min: 375000,
      max: 75000000,
      step: 375000,
      required: true,
      placeholder: "Enter loan amount needed in ₹",
    },
    {
      id: "businessAge",
      label: "Years in Business",
      type: "select",
      options: ["Less than 1", "1-2", "3-5", "5-10", "10+"],
      required: true,
    },
    {
      id: "businessType",
      label: "Business Type",
      type: "select",
      options: ["Sole Proprietorship", "Partnership", "LLC", "Corporation", "Non-profit"],
      required: true,
    },
    {
      id: "industry",
      label: "Industry",
      type: "select",
      options: [
        "Retail",
        "Manufacturing",
        "Technology",
        "Healthcare",
        "Construction",
        "Food Service",
        "Professional Services",
        "Other",
      ],
      required: true,
    },
    {
      id: "loanPurpose",
      label: "Loan Purpose",
      type: "select",
      options: ["Equipment Purchase", "Working Capital", "Expansion", "Real Estate", "Inventory", "Other"],
      required: true,
    },
    {
      id: "creditScore",
      label: "Personal Credit Score",
      type: "select",
      options: ["300-579", "580-669", "670-739", "740-799", "800-850"],
      required: true,
    },
    { id: "collateral", label: "Do you have business collateral?", type: "switch" },
    {
      id: "employees",
      label: "Number of Employees",
      type: "select",
      options: ["1", "2-5", "6-10", "11-25", "26-50", "50+"],
      required: true,
    },
    {
      id: "cashFlow",
      label: "Monthly Cash Flow",
      type: "number",
      min: -750000,
      max: 7500000,
      step: 75000,
      required: true,
      placeholder: "Enter monthly cash flow in ₹",
    },
  ],
}

const loanTitles: Record<string, string> = {
  car: "Car Loan Application",
  home: "Home Loan Application",
  student: "Student Loan Application",
  personal: "Personal Loan Application",
  business: "Business Loan Application",
}

export default function LoanFormPage({ params }: { params: { loanType: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fields = loanFormFields[params.loanType] || []
  const fieldsPerStep = 3
  const totalSteps = Math.ceil(fields.length / fieldsPerStep)
  const currentFields = fields.slice(currentStep * fieldsPerStep, (currentStep + 1) * fieldsPerStep)

  const handleFieldChange = (fieldId: string, value: any) => {
    console.log("[v0] Field changed:", fieldId, value)
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleNext = () => {
    console.log("[v0] Moving to next step, current:", currentStep)
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    console.log("[v0] Moving to previous step, current:", currentStep)
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    console.log("[v0] Submitting form with data:", formData)
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Store form data and navigate to results
    localStorage.setItem("loanFormData", JSON.stringify({ ...formData, loanType: params.loanType }))
    router.push("/results")
  }

  const formatCurrencyValue = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const renderField = (field: FormField) => {
    const value = formData[field.id]

    switch (field.type) {
      case "number":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
            </Label>
            <Input
              id={field.id}
              type="number"
              min={field.min}
              max={field.max}
              step={field.step}
              placeholder={field.placeholder}
              value={value || ""}
              onChange={(e) => handleFieldChange(field.id, Number.parseFloat(e.target.value) || 0)}
              className="glass-card border-white/20"
            />
            {field.min !== undefined && field.max !== undefined && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Min: {formatCurrencyValue(field.min)}</span>
                <span>Max: {formatCurrencyValue(field.max)}</span>
              </div>
            )}
          </motion.div>
        )

      case "select":
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
            </Label>
            <Select value={value || ""} onValueChange={(newValue) => handleFieldChange(field.id, newValue)}>
              <SelectTrigger className="glass-card border-white/20">
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        )

      case "switch":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between p-4 glass-card rounded-lg"
          >
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
            </Label>
            <Switch
              id={field.id}
              checked={value || false}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
            />
          </motion.div>
        )

      default:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={value || ""}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="glass-card border-white/20"
            />
          </motion.div>
        )
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

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
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4">{loanTitles[params.loanType]}</h1>
            <p className="text-muted-foreground">
              Step {currentStep + 1} of {totalSteps} - Please provide the following information
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-secondary rounded-full h-2 mt-4">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="font-heading">Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {renderField(field)}
                </motion.div>
              ))}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="glass-card border-white/20 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep === totalSteps - 1 ? (
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="animate-pulse-glow">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Get Recommendations
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
