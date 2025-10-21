"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  CreditCard,
  TrendingUp,
  Shield,
  GraduationCap,
  Car,
  Building,
  Phone,
  Calculator,
  MapPin,
  Mail,
  ExternalLink,
  CheckCircle,
  Lock,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BankingServicesProps {
  onBack: () => void
}

export function BankingServices({ onBack }: BankingServicesProps) {
  const [activeService, setActiveService] = useState<string | null>(null)
  const [calculatorData, setCalculatorData] = useState({
    homePrice: "",
    downPayment: "",
    interestRate: "",
    loanTerm: "30",
  })
  const [calculatorResult, setCalculatorResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const services = [
    {
      id: "investment",
      title: "Investment Services",
      icon: TrendingUp,
      description: "Grow your wealth with our investment options",
      features: ["Portfolio Management", "Retirement Planning", "Mutual Funds", "Stock Trading"],
      available: true,
    },
    {
      id: "insurance",
      title: "Insurance Products",
      icon: Shield,
      description: "Protect what matters most to you",
      features: ["Life Insurance", "Auto Insurance", "Home Insurance", "Health Insurance"],
      available: true,
    },
    {
      id: "credit-cards",
      title: "Credit Cards",
      icon: CreditCard,
      description: "Find the right credit card for your needs",
      features: ["Rewards Cards", "Cash Back", "Travel Cards", "Business Cards"],
      available: true,
    },
    {
      id: "student-loans",
      title: "Student Loans",
      icon: GraduationCap,
      description: "Finance your education with competitive rates",
      features: ["Federal Loans", "Private Loans", "Refinancing", "Repayment Options"],
      available: true,
    },
    {
      id: "auto-loans",
      title: "Auto Loans",
      icon: Car,
      description: "Get behind the wheel with our auto financing",
      features: ["New Car Loans", "Used Car Loans", "Refinancing", "Lease Options"],
      available: true,
    },
    {
      id: "business-banking",
      title: "Business Banking",
      icon: Building,
      description: "Banking solutions for your business",
      features: ["Business Checking", "Business Loans", "Merchant Services", "Payroll Services"],
      available: true,
    },
    {
      id: "customer-service",
      title: "Customer Service",
      icon: Phone,
      description: "Get help when you need it",
      features: ["24/7 Support", "Live Chat", "Phone Support", "Branch Locations"],
      available: true,
    },
    {
      id: "mortgage-calculator",
      title: "Mortgage Calculator",
      icon: Calculator,
      description: "Calculate your mortgage payments",
      features: ["Payment Calculator", "Affordability Calculator", "Refinance Calculator", "Rate Comparison"],
      available: true,
    },
    {
      id: "branch-locator",
      title: "Branch & ATM Locator",
      icon: MapPin,
      description: "Find branches and ATMs near you",
      features: ["Branch Finder", "ATM Locator", "Hours & Services", "Directions"],
      available: true,
    },
    {
      id: "contact-us",
      title: "Contact Us",
      icon: Mail,
      description: "Get in touch with us",
      features: ["Email Support", "Phone Numbers", "Mailing Address", "Feedback Form"],
      available: true,
    },
  ]

  const handleVerification = async (type: string) => {
    setLoading(true)
    try {
      switch (type) {
        case "bank-account":
          const response = await fetch("/api/verify-account", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              account_number: "123456789",
              routing_number: "121000248",
            }),
          })
          const data = await response.json()
          toast({
            title: "Bank Account Verified",
            description: `Status: ${data.verified ? "Verified" : "Not Verified"} - ${data.bank_name || ""}`,
          })
          break

        case "phone-id":
          toast({
            title: "Phone Verification",
            description: "Verification code sent via SMS. Please check your phone.",
          })
          break

        case "email":
          toast({
            title: "Email Verification",
            description: "Verification link sent to your email. Please check your inbox.",
          })
          break

        case "ssn-trace":
          toast({
            title: "SSN Trace Complete",
            description: "Valid SSN with address history found.",
          })
          break
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Failed to complete verification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCalculate = async () => {
    if (!calculatorData.homePrice || !calculatorData.downPayment || !calculatorData.interestRate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/calculators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "mortgage",
          homePrice: Number.parseFloat(calculatorData.homePrice),
          downPayment: Number.parseFloat(calculatorData.downPayment),
          interestRate: Number.parseFloat(calculatorData.interestRate),
          loanTerm: Number.parseInt(calculatorData.loanTerm),
        }),
      })

      const data = await response.json()
      setCalculatorResult(data.calculation)
      toast({
        title: "Calculation Complete",
        description: `Monthly payment: $${data.calculation.monthlyPayment.toLocaleString()}`,
      })
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Failed to calculate mortgage. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleServiceClick = (serviceId: string) => {
    setActiveService(serviceId)

    switch (serviceId) {
      case "investment":
        window.open("https://www.wellsfargo.com/investing-wealth/", "_blank")
        break
      case "insurance":
        window.open("https://www.wellsfargo.com/insurance/", "_blank")
        break
      case "credit-cards":
        window.open("https://www.wellsfargo.com/credit-cards/", "_blank")
        break
      case "student-loans":
        window.open("https://www.wellsfargo.com/student/", "_blank")
        break
      case "auto-loans":
        window.open("https://www.wellsfargo.com/auto-loans/", "_blank")
        break
      case "business-banking":
        window.open("https://www.wellsfargo.com/biz/", "_blank")
        break
      case "customer-service":
        toast({
          title: "Customer Service",
          description: "Phone: 1-800-869-3557 | Email: fargocustomer_248@zohomail.com",
        })
        break
      case "mortgage-calculator":
        setActiveService("calculator")
        break
      case "branch-locator":
        toast({
          title: "Branch & ATM Locator",
          description: "Find nearest locations, check hours, and get directions.",
        })
        break
      case "contact-us":
        toast({
          title: "Contact Information",
          description: "Email: fargocustomer_248@zohomail.com | Phone: 1-800-869-3557",
        })
        break
    }
  }

  if (activeService === "calculator") {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
          <button onClick={() => setActiveService(null)} className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Mortgage Calculator</h1>
        </div>

        <div className="p-4 space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Calculate Your Monthly Payment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Home Price</label>
                <Input
                  type="number"
                  placeholder="500000"
                  value={calculatorData.homePrice}
                  onChange={(e) => setCalculatorData({ ...calculatorData, homePrice: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Down Payment</label>
                <Input
                  type="number"
                  placeholder="100000"
                  value={calculatorData.downPayment}
                  onChange={(e) => setCalculatorData({ ...calculatorData, downPayment: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="6.5"
                  value={calculatorData.interestRate}
                  onChange={(e) => setCalculatorData({ ...calculatorData, interestRate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Loan Term (years)</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={calculatorData.loanTerm}
                  onChange={(e) => setCalculatorData({ ...calculatorData, loanTerm: e.target.value })}
                >
                  <option value="15">15 years</option>
                  <option value="20">20 years</option>
                  <option value="30">30 years</option>
                </select>
              </div>
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={handleCalculate}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  "Calculate Payment"
                )}
              </Button>
            </div>
          </Card>

          {calculatorResult && (
            <Card className="p-4 bg-green-50 border-green-200">
              <h3 className="font-semibold text-green-900 mb-3">Your Results</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Monthly Payment:</span>
                  <span className="text-2xl font-bold text-green-900">
                    ${calculatorResult.monthlyPayment.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Principal Amount:</span>
                  <span className="font-semibold">${calculatorResult.principalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Total Interest:</span>
                  <span className="font-semibold">${calculatorResult.totalInterest.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Total Payment:</span>
                  <span className="font-semibold">${calculatorResult.totalPayment.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Banking Services</h1>
      </div>

      {/* Verification Section */}
      <div className="p-4 border-b border-gray-200 bg-blue-50">
        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Account Verification APIs
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleVerification("bank-account")}
            className="text-xs"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Bank Verify"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleVerification("phone-id")}
            className="text-xs"
            disabled={loading}
          >
            Phone ID
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleVerification("email")}
            className="text-xs"
            disabled={loading}
          >
            Email Verify
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleVerification("ssn-trace")}
            className="text-xs"
            disabled={loading}
          >
            SSN Trace
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {services.map((service) => {
          const IconComponent = service.icon
          return (
            <Card
              key={service.id}
              className="border border-gray-200 hover:border-red-300 transition-colors cursor-pointer"
              onClick={() => handleServiceClick(service.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{service.title}</h3>
                      {service.available && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-green-600">Live</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {service.features.map((feature, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                    <Button className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white text-sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Access {service.title}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Customer Service Contact */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-3">Contact our customer service team</p>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => window.open("mailto:fargocustomer_248@zohomail.com", "_blank")}
          >
            <Mail className="w-4 h-4 mr-2" />
            Email Support
          </Button>
        </div>
      </div>
    </div>
  )
}
