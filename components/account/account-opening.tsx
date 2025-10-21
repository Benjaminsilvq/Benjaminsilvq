"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, User, CreditCard, Shield, CheckCircle } from "lucide-react"

interface AccountOpeningProps {
  accountType: string
  onBack: () => void
  onComplete: () => void
}

function AccountOpening({ accountType, onBack, onComplete }: AccountOpeningProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    ssn: "",
    email: "",
    phone: "",

    // Address Information
    address: "",
    city: "",
    state: "",
    zipCode: "",

    // Employment Information
    employmentStatus: "",
    employer: "",
    annualIncome: "",

    // Account Preferences
    initialDeposit: "",
    paperlessStatements: false,
    overdraftProtection: false,
    debitCard: true,

    // Agreements
    termsAccepted: false,
    privacyAccepted: false,
    disclosuresAccepted: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    setStep((prev) => prev + 1)
  }

  const handleSubmit = () => {
    // Simulate account creation
    alert(
      `${accountType} account created successfully! Your new account number is: ${Math.random().toString().slice(2, 12)}`,
    )
    onComplete()
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Open {accountType}</h1>
          <p className="text-sm text-gray-600">Step {step} of 4</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-red-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-4">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="ssn">Social Security Number</Label>
                <Input
                  id="ssn"
                  value={formData.ssn}
                  onChange={(e) => handleInputChange("ssn", e.target.value)}
                  placeholder="XXX-XX-XXXX"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(XXX) XXX-XXXX"
                  required
                />
              </div>

              <Button onClick={handleNext} className="w-full bg-red-600 hover:bg-red-700">
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Address & Employment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="employmentStatus">Employment Status</Label>
                <Select
                  value={formData.employmentStatus}
                  onValueChange={(value) => handleInputChange("employmentStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self-employed">Self-Employed</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="employer">Employer</Label>
                <Input
                  id="employer"
                  value={formData.employer}
                  onChange={(e) => handleInputChange("employer", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="annualIncome">Annual Income</Label>
                <Select
                  value={formData.annualIncome}
                  onValueChange={(value) => handleInputChange("annualIncome", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select income range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-25k">Under $25,000</SelectItem>
                    <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                    <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                    <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
                    <SelectItem value="over-100k">Over $100,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleNext} className="w-full bg-red-600 hover:bg-red-700">
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Account Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="initialDeposit">Initial Deposit Amount</Label>
                <Input
                  id="initialDeposit"
                  type="number"
                  min="25"
                  value={formData.initialDeposit}
                  onChange={(e) => handleInputChange("initialDeposit", e.target.value)}
                  placeholder="Minimum $25"
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="paperless"
                    checked={formData.paperlessStatements}
                    onCheckedChange={(checked) => handleInputChange("paperlessStatements", checked)}
                  />
                  <Label htmlFor="paperless">Paperless statements (recommended)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="overdraft"
                    checked={formData.overdraftProtection}
                    onCheckedChange={(checked) => handleInputChange("overdraftProtection", checked)}
                  />
                  <Label htmlFor="overdraft">Overdraft protection</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="debitCard"
                    checked={formData.debitCard}
                    onCheckedChange={(checked) => handleInputChange("debitCard", checked)}
                  />
                  <Label htmlFor="debitCard">Request debit card</Label>
                </div>
              </div>

              <Button onClick={handleNext} className="w-full bg-red-600 hover:bg-red-700">
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Review & Agreements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold">Account Summary</h3>
                <p>
                  <strong>Account Type:</strong> {accountType}
                </p>
                <p>
                  <strong>Name:</strong> {formData.firstName} {formData.lastName}
                </p>
                <p>
                  <strong>Initial Deposit:</strong> ${formData.initialDeposit}
                </p>
                <p>
                  <strong>Email:</strong> {formData.email}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => handleInputChange("termsAccepted", checked)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the Terms and Conditions
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={formData.privacyAccepted}
                    onCheckedChange={(checked) => handleInputChange("privacyAccepted", checked)}
                  />
                  <Label htmlFor="privacy" className="text-sm">
                    I agree to the Privacy Policy
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="disclosures"
                    checked={formData.disclosuresAccepted}
                    onCheckedChange={(checked) => handleInputChange("disclosuresAccepted", checked)}
                  />
                  <Label htmlFor="disclosures" className="text-sm">
                    I acknowledge receipt of account disclosures
                  </Label>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={!formData.termsAccepted || !formData.privacyAccepted || !formData.disclosuresAccepted}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Open Account
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AccountOpening
