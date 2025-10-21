"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Search,
  Home,
  CreditCard,
  TrendingUp,
  Shield,
  Car,
  GraduationCap,
  Building,
  Smartphone,
  Calculator,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExploreServicesProps {
  onBack: () => void
}

const services = [
  {
    id: "mortgages",
    title: "Home Loans & Mortgages",
    description: "Find the right home loan for your needs",
    icon: <Home className="w-6 h-6" />,
    color: "bg-blue-600",
    features: ["Competitive rates", "Online pre-approval", "First-time buyer programs"],
  },
  {
    id: "credit-cards",
    title: "Credit Cards",
    description: "Earn rewards and build credit",
    icon: <CreditCard className="w-6 h-6" />,
    color: "bg-green-600",
    features: ["Cash back rewards", "0% intro APR", "Travel benefits"],
  },
  {
    id: "investments",
    title: "Investment Services",
    description: "Grow your wealth with expert guidance",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "bg-purple-600",
    features: ["Portfolio management", "Retirement planning", "Financial advisors"],
  },
  {
    id: "insurance",
    title: "Insurance Products",
    description: "Protect what matters most",
    icon: <Shield className="w-6 h-6" />,
    color: "bg-orange-600",
    features: ["Auto insurance", "Home insurance", "Life insurance"],
  },
  {
    id: "auto-loans",
    title: "Auto Loans",
    description: "Finance your next vehicle",
    icon: <Car className="w-6 h-6" />,
    color: "bg-red-600",
    features: ["New & used cars", "Refinancing", "Quick approval"],
  },
  {
    id: "student-loans",
    title: "Student Loans",
    description: "Invest in your education",
    icon: <GraduationCap className="w-6 h-6" />,
    color: "bg-indigo-600",
    features: ["Undergraduate loans", "Graduate loans", "Parent PLUS loans"],
  },
  {
    id: "business",
    title: "Business Banking",
    description: "Solutions for your business",
    icon: <Building className="w-6 h-6" />,
    color: "bg-gray-600",
    features: ["Business checking", "Commercial loans", "Merchant services"],
  },
  {
    id: "digital",
    title: "Digital Services",
    description: "Banking made easy",
    icon: <Smartphone className="w-6 h-6" />,
    color: "bg-teal-600",
    features: ["Mobile banking", "Online bill pay", "Zelle payments"],
  },
]

const tools = [
  {
    id: "mortgage-calculator",
    title: "Mortgage Calculator",
    description: "Calculate monthly payments",
    icon: <Calculator className="w-5 h-5" />,
  },
  {
    id: "branch-locator",
    title: "Branch & ATM Locator",
    description: "Find locations near you",
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    id: "contact",
    title: "Contact Us",
    description: "Get help when you need it",
    icon: <Phone className="w-5 h-5" />,
  },
  {
    id: "hours",
    title: "Banking Hours",
    description: "View branch hours",
    icon: <Clock className="w-5 h-5" />,
  },
]

export function ExploreServices({ onBack }: ExploreServicesProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<"all" | "loans" | "cards" | "invest" | "business">("all")
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [serviceData, setServiceData] = useState<any>(null)
  const { toast } = useToast()

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    switch (selectedCategory) {
      case "loans":
        return ["mortgages", "auto-loans", "student-loans"].includes(service.id)
      case "cards":
        return service.id === "credit-cards"
      case "invest":
        return ["investments", "insurance"].includes(service.id)
      case "business":
        return service.id === "business"
      default:
        return true
    }
  })

  const handleServiceClick = async (service: any) => {
    setSelectedService(service.id)
    setLoading(true)

    try {
      let endpoint = ""
      switch (service.id) {
        case "credit-cards":
          endpoint = "/api/credit-cards"
          break
        case "mortgages":
        case "auto-loans":
        case "student-loans":
          endpoint = "/api/loans"
          break
        case "investments":
          endpoint = "/api/investments"
          break
        case "insurance":
          endpoint = "/api/insurance"
          break
        case "digital":
          toast({
            title: "Digital Banking",
            description: "Access mobile banking, online bill pay, and Zelle payments from your dashboard.",
          })
          setLoading(false)
          setSelectedService(null)
          return
        case "business":
          toast({
            title: "Business Banking",
            description: "Contact a business banking specialist at 1-800-CALL-WELLS for personalized service.",
          })
          setLoading(false)
          setSelectedService(null)
          return
      }

      if (endpoint) {
        const response = await fetch(endpoint)
        const data = await response.json()
        setServiceData(data)
      }
    } catch (error) {
      console.error("Failed to load service data:", error)
      toast({
        title: "Error",
        description: "Failed to load service information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToolClick = (tool: any) => {
    switch (tool.id) {
      case "mortgage-calculator":
        setSelectedService("calculator")
        break
      case "branch-locator":
        toast({
          title: "Branch & ATM Locator",
          description: "Opening location finder...",
        })
        break
      case "contact":
        toast({
          title: "Contact Information",
          description: "Phone: 1-800-869-3557 | Email: support@wellsfargo.com",
        })
        break
      case "hours":
        toast({
          title: "Banking Hours",
          description: "Mon-Fri: 9AM-5PM | Sat: 9AM-1PM | Sun: Closed",
        })
        break
    }
  }

  if (selectedService === "calculator") {
    return <MortgageCalculatorView onBack={() => setSelectedService(null)} />
  }

  if (selectedService && serviceData) {
    return (
      <ServiceDetailView
        service={selectedService}
        data={serviceData}
        onBack={() => {
          setSelectedService(null)
          setServiceData(null)
        }}
      />
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Explore Services</h1>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
      </div>

      {/* Category Filters */}
      {!searchTerm && (
        <div className="flex overflow-x-auto gap-2 px-4 py-3 border-b border-gray-200">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === "all" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Services
          </button>
          <button
            onClick={() => setSelectedCategory("loans")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === "loans" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Loans
          </button>
          <button
            onClick={() => setSelectedCategory("cards")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === "cards" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Credit Cards
          </button>
          <button
            onClick={() => setSelectedCategory("invest")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === "invest" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Investing
          </button>
          <button
            onClick={() => setSelectedCategory("business")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === "business" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Business
          </button>
        </div>
      )}

      <div className="p-4 space-y-6">
        {/* Quick Tools */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Quick Tools</h3>
          <div className="grid grid-cols-2 gap-3">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                className="p-4 bg-red-50 border border-red-200 rounded-lg text-left hover:bg-red-100 transition-colors"
              >
                <div className="text-red-600 mb-2">{tool.icon}</div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{tool.title}</h4>
                <p className="text-xs text-gray-600">{tool.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {searchTerm ? `Search Results (${filteredServices.length})` : "All Services"}
          </h3>

          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="border border-gray-200 hover:border-red-300 transition-colors cursor-pointer"
              onClick={() => handleServiceClick(service)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center text-white`}>
                    {service.icon}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{service.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>

                    <div className="space-y-1">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-1 h-1 bg-red-600 rounded-full" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Button
                      className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white text-sm"
                      disabled={loading && selectedService === service.id}
                    >
                      {loading && selectedService === service.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Learn More"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">Try adjusting your search terms or browse all services.</p>
          </div>
        )}

        {/* Contact Information */}
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-gray-900">Customer Service</p>
                <p className="text-sm text-gray-600">1-800-869-3557</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-gray-900">Available 24/7</p>
                <p className="text-sm text-gray-600">Online and mobile banking support</p>
              </div>
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MortgageCalculatorView({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState({
    homePrice: "",
    downPayment: "",
    interestRate: "",
    loanTerm: "30",
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleCalculate = async () => {
    if (!formData.homePrice || !formData.downPayment || !formData.interestRate) {
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
          homePrice: Number.parseFloat(formData.homePrice),
          downPayment: Number.parseFloat(formData.downPayment),
          interestRate: Number.parseFloat(formData.interestRate),
          loanTerm: Number.parseInt(formData.loanTerm),
        }),
      })

      const data = await response.json()
      setResult(data.calculation)
    } catch (error) {
      console.error("Calculation error:", error)
      toast({
        title: "Calculation Error",
        description: "Failed to calculate mortgage. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Mortgage Calculator</h1>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Calculate Your Monthly Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Home Price</Label>
              <Input
                type="number"
                placeholder="500000"
                value={formData.homePrice}
                onChange={(e) => setFormData({ ...formData, homePrice: e.target.value })}
              />
            </div>
            <div>
              <Label>Down Payment</Label>
              <Input
                type="number"
                placeholder="100000"
                value={formData.downPayment}
                onChange={(e) => setFormData({ ...formData, downPayment: e.target.value })}
              />
            </div>
            <div>
              <Label>Interest Rate (%)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="6.5"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
              />
            </div>
            <div>
              <Label>Loan Term (years)</Label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.loanTerm}
                onChange={(e) => setFormData({ ...formData, loanTerm: e.target.value })}
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
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Payment
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">Your Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Monthly Payment:</span>
                <span className="text-2xl font-bold text-green-900">${result.monthlyPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Principal Amount:</span>
                <span className="font-semibold">${result.principalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Total Interest:</span>
                <span className="font-semibold">${result.totalInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Total Payment:</span>
                <span className="font-semibold">${result.totalPayment.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function ServiceDetailView({ service, data, onBack }: { service: string; data: any; onBack: () => void }) {
  const { toast } = useToast()

  const handleApply = async (item: any) => {
    toast({
      title: "Application Started",
      description: `Starting your application for ${item.name || item.title}...`,
    })
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900 capitalize">{service.replace("-", " ")}</h1>
      </div>

      <div className="p-4 space-y-3">
        {(data.cards || data.loans || data.products || data.accounts || []).map((item: any) => (
          <Card key={item.id} className="border border-gray-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{item.name || item.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>

              {item.apr && (
                <div className="text-sm mb-2">
                  <span className="font-medium">APR:</span> {item.apr}
                </div>
              )}
              {item.interestRate && (
                <div className="text-sm mb-2">
                  <span className="font-medium">Interest Rate:</span> {item.interestRate}
                </div>
              )}
              {item.apy && (
                <div className="text-sm mb-2">
                  <span className="font-medium">APY:</span> {item.apy}
                </div>
              )}
              {item.annualFee !== undefined && (
                <div className="text-sm mb-2">
                  <span className="font-medium">Annual Fee:</span> ${item.annualFee}
                </div>
              )}

              {(item.features || item.benefits || []).slice(0, 3).map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  {feature}
                </div>
              ))}

              <Button className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white" onClick={() => handleApply(item)}>
                Apply Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
