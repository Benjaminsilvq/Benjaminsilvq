"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Phone } from "lucide-react"

interface ForgotPasswordProps {
  onBack: () => void
  onSubmit: (data: { type: string; value: string }) => void
}

export function ForgotPassword({ onBack, onSubmit }: ForgotPasswordProps) {
  const [recoveryType, setRecoveryType] = useState<"username" | "password">("username")
  const [method, setMethod] = useState<"email" | "phone">("email")
  const [value, setValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      onSubmit({ type: `${recoveryType}-${method}`, value })
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-red-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <CardTitle className="text-xl font-semibold text-gray-900">Account Recovery</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Recovery Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">What do you need help with?</Label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="recoveryType"
                      value="username"
                      checked={recoveryType === "username"}
                      onChange={(e) => setRecoveryType(e.target.value as "username")}
                      className="text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-700">I forgot my username</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="recoveryType"
                      value="password"
                      checked={recoveryType === "password"}
                      onChange={(e) => setRecoveryType(e.target.value as "password")}
                      className="text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-700">I forgot my password</span>
                  </label>
                </div>
              </div>

              {/* Method Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">How would you like to recover it?</Label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="method"
                      value="email"
                      checked={method === "email"}
                      onChange={(e) => setMethod(e.target.value as "email")}
                      className="text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-700">Send to my email address</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="method"
                      value="phone"
                      checked={method === "phone"}
                      onChange={(e) => setMethod(e.target.value as "phone")}
                      className="text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm text-gray-700">Send to my phone number</span>
                  </label>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact" className="text-sm font-medium text-gray-700">
                    {method === "email" ? "Email Address" : "Phone Number"}
                  </Label>
                  <div className="relative">
                    {method === "email" ? (
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    ) : (
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    )}
                    <Input
                      id="contact"
                      type={method === "email" ? "email" : "tel"}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="pl-10 h-12 border-gray-300 focus:border-red-600 focus:ring-red-600"
                      placeholder={method === "email" ? "Enter your email" : "Enter your phone number"}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : `Send ${recoveryType === "username" ? "Username" : "Reset Link"}`}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  We'll send your {recoveryType} information to the {method} address on file.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
