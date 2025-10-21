"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, DollarSign } from "lucide-react"

interface AccountCreationProps {
  onBack: () => void
  onCreateAccount: (accountData: any) => void
}

const accountTypes = [
  { id: "everyday", name: "Everyday Checking", fee: "$10/month", minimum: "$25" },
  { id: "clear", name: "Clear Access Banking", fee: "$5/month", minimum: "$25" },
  { id: "prime", name: "Prime Checking", fee: "$25/month", minimum: "$25" },
  { id: "premier", name: "Premier Checking", fee: "$35/month", minimum: "$25" },
  { id: "way2save", name: "Way2Save Savings", fee: "Variable", minimum: "$25" },
  { id: "platinum", name: "Platinum Savings", fee: "$12/month", minimum: "$25" },
]

export function AccountCreation({ onBack, onCreateAccount }: AccountCreationProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    ssn: "",

    // Address
    address: "",
    city: "",
    state: "",
    zipCode: "",

    // Account Selection
    accountType: "",
    initialDeposit: "",

    // Login Credentials
    username: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    if (step === 1) {
      onBack()
    } else {
      setStep(step - 1)
    }
  }

  const handleSubmit = () => {
    onCreateAccount(formData)
  }

  return (
    <div className="min-h-screen bg-red-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <CardTitle className="text-xl font-semibold text-gray-900">Open New Account</CardTitle>
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? "bg-red-600" : "bg-gray-200"}`} />
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="h-10"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="h-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 h-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10 h-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      className="pl-10 h-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ssn">Social Security Number</Label>
                  <Input
                    id="ssn"
                    type="password"
                    value={formData.ssn}
                    onChange={(e) => handleInputChange("ssn", e.target.value)}
                    className="h-10"
                    placeholder="XXX-XX-XXXX"
                    required
                  />
                </div>

                <Button onClick={handleNext} className="w-full h-10 bg-red-600 hover:bg-red-700">
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="pl-10 h-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="h-10"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select onValueChange={(value) => handleInputChange("state", value)}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AL">Alabama</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="VA">Virginia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      className="h-10"
                      required
                    />
                  </div>
                </div>

                <Button onClick={handleNext} className="w-full h-10 bg-red-600 hover:bg-red-700">
                  Continue
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Account</h3>

                <div className="space-y-3">
                  {accountTypes.map((account) => (
                    <label
                      key={account.id}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        formData.accountType === account.id
                          ? "border-red-600 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="accountType"
                        value={account.id}
                        checked={formData.accountType === account.id}
                        onChange={(e) => handleInputChange("accountType", e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{account.name}</h4>
                          <p className="text-sm text-gray-600">Monthly fee: {account.fee}</p>
                          <p className="text-sm text-gray-600">Minimum opening: {account.minimum}</p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            formData.accountType === account.id ? "border-red-600 bg-red-600" : "border-gray-300"
                          }`}
                        >
                          {formData.accountType === account.id && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initialDeposit">Initial Deposit Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="initialDeposit"
                      type="number"
                      min="25"
                      value={formData.initialDeposit}
                      onChange={(e) => handleInputChange("initialDeposit", e.target.value)}
                      className="pl-10 h-10"
                      placeholder="25.00"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">Minimum deposit: $25.00</p>
                </div>

                <Button onClick={handleNext} className="w-full h-10 bg-red-600 hover:bg-red-700">
                  Continue
                </Button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Login Credentials</h3>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className="pl-10 h-10"
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="h-10"
                    placeholder="Create a strong password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="h-10"
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Account Summary</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>Name:</strong> {formData.firstName} {formData.lastName}
                    </p>
                    <p>
                      <strong>Account Type:</strong> {accountTypes.find((a) => a.id === formData.accountType)?.name}
                    </p>
                    <p>
                      <strong>Initial Deposit:</strong> ${formData.initialDeposit}
                    </p>
                  </div>
                </div>

                <Button onClick={handleSubmit} className="w-full h-10 bg-red-600 hover:bg-red-700">
                  Create Account
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
