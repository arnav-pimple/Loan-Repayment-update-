"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (email: string) => Promise<void>
}

export function EmailModal({ isOpen, onClose, onSend }: EmailModalProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await onSend(email)
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
        setEmail("")
      }, 2000)
    } catch (err) {
      setError("Failed to send email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
      setEmail("")
      setError("")
      setIsSuccess(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass-card p-6 rounded-2xl border-white/20"
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={handleClose}
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Content */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {isSuccess ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <Mail className="w-6 h-6 text-primary" />
                )}
              </div>
              <h2 className="font-heading font-bold text-xl mb-2">
                {isSuccess ? "Email Sent!" : "Send Report via Email"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isSuccess
                  ? "Your loan report has been sent successfully"
                  : "Enter your email address to receive a copy of your loan report"}
              </p>
            </div>

            {!isSuccess && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-card border-white/20 mt-1"
                    required
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 glass-card border-white/20 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading || !email} className="flex-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Report
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}

            {isSuccess && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Check your inbox for the detailed report</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
