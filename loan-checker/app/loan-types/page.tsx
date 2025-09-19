"use client"

import { motion } from "framer-motion"
import { Car, Home, GraduationCap, User, Building2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedBackground } from "@/components/animated-background"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

const loanTypes = [
  {
    id: "car",
    title: "Car Loan",
    description: "Finance your dream vehicle with competitive rates",
    icon: Car,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "home",
    title: "Home Loan",
    description: "Make homeownership a reality with our mortgage solutions",
    icon: Home,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    id: "student",
    title: "Student Loan",
    description: "Invest in your education and future career",
    icon: GraduationCap,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "personal",
    title: "Personal Loan",
    description: "Flexible financing for your personal needs",
    icon: User,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    id: "business",
    title: "Business Loan",
    description: "Grow your business with our commercial lending",
    icon: Building2,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    iconColor: "text-red-600 dark:text-red-400",
  },
]

export default function LoanTypesPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon" className="glass-card border-white/20 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="font-heading font-bold text-2xl text-primary">LoanCheck AI</div>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-heading font-bold text-4xl md:text-6xl mb-6 text-balance"
            >
              Choose Your{" "}
              <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Loan Type
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto"
            >
              Select the type of loan you're interested in to get started with your personalized eligibility check
            </motion.p>
          </motion.div>

          {/* Loan Type Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {loanTypes.map((loan, index) => (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
                className="group cursor-pointer"
              >
                <Link href={`/form/${loan.id}`}>
                  <div className="glass-card p-8 rounded-2xl h-full flex flex-col items-center text-center group-hover:shadow-2xl transition-all duration-300 border-2 border-transparent group-hover:border-white/30">
                    {/* Icon Container */}
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                      className={`w-20 h-20 rounded-2xl ${loan.bgColor} flex items-center justify-center mb-6 group-hover:shadow-lg transition-all duration-300`}
                    >
                      <loan.icon className={`w-10 h-10 ${loan.iconColor}`} />
                    </motion.div>

                    {/* Content */}
                    <h3 className="font-heading font-bold text-2xl mb-3 group-hover:text-primary transition-colors">
                      {loan.title}
                    </h3>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">{loan.description}</p>

                    {/* CTA Button */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                      <Button
                        className={`w-full bg-gradient-to-r ${loan.color} hover:shadow-lg transition-all duration-300 group-hover:shadow-xl`}
                        size="lg"
                      >
                        Apply Now
                      </Button>
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-16"
          >
            <div className="glass-card p-8 rounded-2xl max-w-2xl mx-auto">
              <h3 className="font-heading font-bold text-2xl mb-4">Not sure which loan is right for you?</h3>
              <p className="text-muted-foreground mb-6">
                Our AI-powered recommendation engine can help you find the perfect loan type based on your financial
                situation.
              </p>
              <Button variant="outline" size="lg" className="glass-card border-white/20 bg-transparent">
                Get Recommendations
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
