"use client"

import { useState } from "react"
import {
  Search,
  Bell,
  RefreshCw,
  Plus,
  Home,
  Upload,
  ArrowLeftRight,
  Compass,
  Menu,
  X,
  MapPin,
  DollarSign,
  CreditCard,
  User,
  Settings,
  Receipt,
  Clock,
  TrendingUp,
  FileText,
  HelpCircle,
  LogOut,
  Shield,
  Car,
  GraduationCap,
  Briefcase,
  Calculator,
  Gift,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-manager"
import { DepositService } from "@/components/services/deposit-service"
import { PayTransfer } from "@/components/transactions/pay-transfer"
import { AccountInfoDisplay } from "@/components/account/account-info-display"
import { ATMBranchLocator } from "@/components/services/atm-branch-locator"
import { SettingsManager } from "@/components/account/settings-manager"
import { DocumentManager } from "@/components/documents/document-manager"
import { AllProducts } from "@/components/services/all-products"

export function MobileDashboard() {
  const { user, logout, balance } = useAuth()
  const [activeView, setActiveView] = useState<
    | "dashboard"
    | "deposit"
    | "transfer"
    | "account"
    | "explore"
    | "atm"
    | "settings"
    | "documents"
    | "help"
    | "pending"
    | "product"
    | "all_products"
  >("dashboard")
  const [activeNav, setActiveNav] = useState("accounts")
  const [notificationCount, setNotificationCount] = useState(20)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showMenu, setShowMenu] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening"

  const firstName = user?.firstName || "Johnny"
  const lastName = user?.lastName || "Mercer"
  const fullName = `${firstName} ${lastName}`
  const accountNumber = user?.accountNumber || "6224"
  const accountBalance = user?.balance || 36000.0
  const savingsBalance = 25250.0

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    if (!showNotifications) {
      setNotificationCount(0)
    }
  }

  const handleSearchClick = () => {
    setShowSearch(!showSearch)
    setSearchQuery("")
  }

  const handleNavigation = (nav: string) => {
    setActiveNav(nav)
    if (nav === "menu") {
      setShowMenu(true)
    } else if (nav === "deposit") {
      setActiveView("deposit")
    } else if (nav === "transfer") {
      setActiveView("transfer")
    } else if (nav === "accounts") {
      setActiveView("dashboard")
    } else if (nav === "explore") {
      setActiveView("explore")
    }
  }

  const handleDepositComplete = (deposit: any) => {
    console.log("[v0] Deposit completed:", deposit)
    setActiveView("dashboard")
    setActiveNav("accounts")
  }

  const handleTransactionComplete = (transaction: any) => {
    console.log("[v0] Transaction completed:", transaction)
    setActiveView("dashboard")
    setActiveNav("accounts")
  }

  if (activeView === "deposit") {
    return <DepositService onBack={() => setActiveView("dashboard")} onDepositComplete={handleDepositComplete} />
  }

  if (activeView === "transfer") {
    return <PayTransfer onBack={() => setActiveView("dashboard")} onTransactionComplete={handleTransactionComplete} />
  }

  if (activeView === "account") {
    return <AccountInfoDisplay onBack={() => setActiveView("dashboard")} />
  }

  if (activeView === "atm") {
    return <ATMBranchLocator onBack={() => setActiveView("dashboard")} />
  }

  if (activeView === "settings") {
    return <SettingsManager onBack={() => setActiveView("dashboard")} />
  }

  if (activeView === "documents") {
    return <DocumentManager onBack={() => setActiveView("dashboard")} />
  }

  if (activeView === "help") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#b8b5d4] via-[#c5c3db] to-[#d4d2e3] pb-20">
        <div className="bg-[#b8b5d4] px-4 pt-3 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setActiveView("dashboard")} className="text-gray-700 hover:text-gray-900">
              <X className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Help & Support</h1>
          </div>

          <div className="space-y-3">
            <Card className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900">Call Us</div>
                  <div className="text-xs text-gray-500">1-800-WELLS-FARGO (1-800-935-5736)</div>
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900">Live Chat</div>
                  <div className="text-xs text-gray-500">Chat with a representative</div>
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900">Send Message</div>
                  <div className="text-xs text-gray-500">Secure message center</div>
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900">FAQs</div>
                  <div className="text-xs text-gray-500">Find answers to common questions</div>
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-2xl p-4 shadow-md">
              <div className="text-sm font-semibold text-gray-900 mb-3">Quick Links</div>
              <div className="space-y-2">
                <button className="w-full text-left text-sm text-gray-700 hover:text-[#d32f2f] py-2 border-b border-gray-100">
                  Report Lost or Stolen Card
                </button>
                <button className="w-full text-left text-sm text-gray-700 hover:text-[#d32f2f] py-2 border-b border-gray-100">
                  Dispute a Transaction
                </button>
                <button className="w-full text-left text-sm text-gray-700 hover:text-[#d32f2f] py-2 border-b border-gray-100">
                  Update Contact Information
                </button>
                <button className="w-full text-left text-sm text-gray-700 hover:text-[#d32f2f] py-2">
                  Schedule an Appointment
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg">
          <div className="flex items-center justify-around max-w-md mx-auto">
            <button
              onClick={() => handleNavigation("accounts")}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
                activeNav === "accounts" ? "text-[#d32f2f]" : "text-gray-500"
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Accounts</span>
            </button>

            <button
              onClick={() => handleNavigation("deposit")}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
                activeNav === "deposit" ? "text-[#d32f2f]" : "text-gray-500"
              }`}
            >
              <Upload className="w-6 h-6" />
              <span className="text-xs font-medium">Deposit</span>
            </button>

            <button
              onClick={() => handleNavigation("transfer")}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
                activeNav === "transfer" ? "text-[#d32f2f]" : "text-gray-500"
              }`}
            >
              <ArrowLeftRight className="w-6 h-6" />
              <span className="text-xs font-medium">Pay & Transfer</span>
            </button>

            <button
              onClick={() => handleNavigation("explore")}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
                activeNav === "explore" ? "text-[#d32f2f]" : "text-gray-500"
              }`}
            >
              <Compass className="w-6 h-6" />
              <span className="text-xs font-medium">Explore</span>
            </button>

            <button
              onClick={() => handleNavigation("menu")}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
                activeNav === "menu" ? "text-[#d32f2f]" : "text-gray-500"
              }`}
            >
              <Menu className="w-6 h-6" />
              <span className="text-xs font-medium">Menu</span>
            </button>
          </div>

          <div className="flex justify-center mt-2">
            <div className="w-32 h-1 bg-gray-900 rounded-full"></div>
          </div>
        </div>
      </div>
    )
  }

  if (activeView === "pending") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#b8b5d4] via-[#c5c3db] to-[#d4d2e3] pb-20">
        <div className="bg-[#b8b5d4] px-4 pt-3 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setActiveView("dashboard")} className="text-gray-700 hover:text-gray-900">
              <X className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Pending Transactions</h1>
          </div>

          <div className="space-y-3">
            <Card className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-semibold text-gray-900">Mobile Deposit</div>
                    <div className="text-sm font-semibold text-gray-900">$1,250.00</div>
                  </div>
                  <div className="text-xs text-gray-500">Check #4521 - Processing</div>
                  <div className="text-xs text-gray-500 mt-1">Expected: Tomorrow, 10:00 AM</div>
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ArrowLeftRight className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-semibold text-gray-900">Transfer to Savings</div>
                    <div className="text-sm font-semibold text-gray-900">$500.00</div>
                  </div>
                  <div className="text-xs text-gray-500">Scheduled for 12/15/2024</div>
                  <div className="text-xs text-gray-500 mt-1">Recurring monthly</div>
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Receipt className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-semibold text-gray-900">Bill Payment - Electric</div>
                    <div className="text-sm font-semibold text-gray-900">$142.50</div>
                  </div>
                  <div className="text-xs text-gray-500">Dominion Energy - Processing</div>
                  <div className="text-xs text-gray-500 mt-1">Due: 12/20/2024</div>
                </div>
              </div>
            </Card>

            <div className="text-center py-8 text-gray-600">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">All pending transactions shown</p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg">
          <div className="flex items-center justify-around max-w-md mx-auto">
            <button
              onClick={() => handleNavigation("accounts")}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
                activeNav === "accounts" ? "text-[#d32f2f]" : "text-gray-500"
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Accounts</span>
            </button>

            <button
              onClick={() => handleNavigation("deposit")}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
                activeNav === "deposit" ? "text-[#d32f2f]" : "text-gray-500"
              }`}
            >
              <Upload className="w-6 h-6" />
              <span className="text-xs font-medium">Deposit</span>
            </button>

            <button
              onClick={() => handleNavigation("transfer")}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
                activeNav === "transfer" ? "text-[#d32f2f]" : "text-gray-500"
              }`}
            >
              <ArrowLeftRight className="w-6 h-6" />
              <span className="text-xs font-medium">Pay & Transfer</span>
            </button>

            <button
              onClick={() => handleNavigation("explore")}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
                activeNav === "explore" ? "text-[#d32f2f]" : "text-gray-500"
              }`}
            >
              <Compass className="w-6 h-6" />
              <span className="text-xs font-medium">Explore</span>
            </button>

            <button
              onClick={() => handleNavigation("menu")}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
                activeNav === "menu" ? "text-[#d32f2f]" : "text-gray-500"
              }`}
            >
              <Menu className="w-6 h-6" />
              <span className="text-xs font-medium">Menu</span>
            </button>
          </div>

          <div className="flex justify-center mt-2">
            <div className="w-32 h-1 bg-gray-900 rounded-full"></div>
          </div>
        </div>
      </div>
    )
  }

  if (activeView === "explore") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#b8b5d4] via-[#c5c3db] to-[#d4d2e3] pb-20">
        <div className="bg-[#b8b5d4] px-4 pt-3 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setActiveView("dashboard")} className="text-gray-700 hover:text-gray-900">
              <X className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Explore Products</h1>
          </div>

          <button
            onClick={() => setActiveView("all_products")}
            className="w-full mb-4 bg-gradient-to-r from-[#dc242c] to-[#721216] text-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all active:scale-98"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold">View All Products & Services</div>
                  <div className="text-xs opacity-90">Browse our complete catalog</div>
                </div>
              </div>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <div className="space-y-4">
            {/* Banking Products */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Banking</h2>
              <div className="space-y-3">
                <Card
                  onClick={() => {
                    setSelectedProduct({
                      title: "Credit Cards",
                      description: "Find the perfect credit card for your lifestyle",
                      details: [
                        "Cash back rewards up to 5%",
                        "0% intro APR for 15 months",
                        "No annual fee options",
                        "Travel rewards and benefits",
                      ],
                      cta: "Apply Now",
                    })
                    setActiveView("product")
                  }}
                  className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">Credit Cards</div>
                      <div className="text-xs text-gray-500">Earn rewards on every purchase</div>
                    </div>
                  </div>
                </Card>

                <Card
                  onClick={() => {
                    setSelectedProduct({
                      title: "Savings Accounts",
                      description: "Grow your money with competitive rates",
                      details: [
                        "Up to 4.5% APY on savings",
                        "No monthly maintenance fees",
                        "FDIC insured up to $250,000",
                        "Easy online access",
                      ],
                      cta: "Open Account",
                    })
                    setActiveView("product")
                  }}
                  className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">Savings Accounts</div>
                      <div className="text-xs text-gray-500">High-yield savings options</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Loans */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Loans</h2>
              <div className="space-y-3">
                <Card
                  onClick={() => {
                    setSelectedProduct({
                      title: "Home Loans",
                      description: "Make your dream home a reality",
                      details: [
                        "Competitive mortgage rates",
                        "First-time homebuyer programs",
                        "Refinancing options available",
                        "Expert guidance throughout",
                      ],
                      cta: "Get Pre-Qualified",
                    })
                    setActiveView("product")
                  }}
                  className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <Home className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">Home Loans</div>
                      <div className="text-xs text-gray-500">Mortgage and refinancing options</div>
                    </div>
                  </div>
                </Card>

                <Card
                  onClick={() => {
                    setSelectedProduct({
                      title: "Auto Loans",
                      description: "Finance your next vehicle with ease",
                      details: [
                        "Rates as low as 3.99% APR",
                        "New and used car financing",
                        "Quick approval process",
                        "Flexible payment terms",
                      ],
                      cta: "Apply for Auto Loan",
                    })
                    setActiveView("product")
                  }}
                  className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                      <Car className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">Auto Loans</div>
                      <div className="text-xs text-gray-500">New and used car financing</div>
                    </div>
                  </div>
                </Card>

                <Card
                  onClick={() => {
                    setSelectedProduct({
                      title: "Personal Loans",
                      description: "Flexible financing for life's moments",
                      details: [
                        "Borrow $3,000 to $100,000",
                        "Fixed rates and payments",
                        "No collateral required",
                        "Fast funding in 1-2 days",
                      ],
                      cta: "Check Your Rate",
                    })
                    setActiveView("product")
                  }}
                  className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">Personal Loans</div>
                      <div className="text-xs text-gray-500">Flexible financing options</div>
                    </div>
                  </div>
                </Card>

                <Card
                  onClick={() => {
                    setSelectedProduct({
                      title: "Student Loans",
                      description: "Invest in your education",
                      details: [
                        "Competitive student loan rates",
                        "Undergraduate and graduate options",
                        "Flexible repayment plans",
                        "No origination fees",
                      ],
                      cta: "Learn More",
                    })
                    setActiveView("product")
                  }}
                  className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">Student Loans</div>
                      <div className="text-xs text-gray-500">Finance your education</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Investments & Insurance */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Investments & Insurance</h2>
              <div className="space-y-3">
                <Card
                  onClick={() => {
                    setSelectedProduct({
                      title: "Investment Services",
                      description: "Build wealth for your future",
                      details: [
                        "Retirement planning (401k, IRA)",
                        "Brokerage accounts",
                        "Robo-advisor options",
                        "Professional wealth management",
                      ],
                      cta: "Start Investing",
                    })
                    setActiveView("product")
                  }}
                  className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">Investments</div>
                      <div className="text-xs text-gray-500">Grow your wealth</div>
                    </div>
                  </div>
                </Card>

                <Card
                  onClick={() => {
                    setSelectedProduct({
                      title: "Insurance Products",
                      description: "Protect what matters most",
                      details: [
                        "Life insurance coverage",
                        "Home and auto insurance",
                        "Health insurance options",
                        "Umbrella policies available",
                      ],
                      cta: "Get a Quote",
                    })
                    setActiveView("product")
                  }}
                  className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">Insurance</div>
                      <div className="text-xs text-gray-500">Comprehensive coverage options</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Tools & Calculators */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Financial Tools</h2>
              <div className="space-y-3">
                <Card className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">Financial Calculators</div>
                      <div className="text-xs text-gray-500">Mortgage, loan, and savings calculators</div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">Special Offers</div>
                      <div className="text-xs text-gray-500">Exclusive deals and promotions</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg">
          <div className="flex items-center justify-around max-w-md mx-auto">
            <button
              onClick={() => handleNavigation("accounts")}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
                activeNav === "accounts" ? "text-[#d32f2f]" : "text-gray-500"
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Accounts</span>
            </button>

            <button
              onClick={() => handleNavigation("deposit")}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
                activeNav === "deposit" ? "text-[#d32f2f]" : "text-gray-500"
              }`}
            >
              <Upload className="w-6 h-6" />
              <span className="text-xs font-medium">Deposit</span>
            </button>

            <button
              onClick={() => handleNavigation("transfer")}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
                activeNav === "transfer" ? "text-[#d32f2f]" : "text-gray-500"
              }`}
            >
              <ArrowLeftRight className="w-6 h-6" />
              <span className="text-xs font-medium">Pay & Transfer</span>
            </button>

            <button
              onClick={() => handleNavigation("explore")}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
                activeNav === "explore" ? "text-[#d32f2f]" : "text-gray-500"
              }`}
            >
              <Compass className="w-6 h-6" />
              <span className="text-xs font-medium">Explore</span>
            </button>

            <button
              onClick={() => handleNavigation("menu")}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
                activeNav === "menu" ? "text-[#d32f2f]" : "text-gray-500"
              }`}
            >
              <Menu className="w-6 h-6" />
              <span className="text-xs font-medium">Menu</span>
            </button>
          </div>

          <div className="flex justify-center mt-2">
            <div className="w-32 h-1 bg-gray-900 rounded-full"></div>
          </div>
        </div>
      </div>
    )
  }

  if (activeView === "product" && selectedProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#b8b5d4] via-[#c5c3db] to-[#d4d2e3] pb-20">
        <div className="bg-[#b8b5d4] px-4 pt-3 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setActiveView("explore")} className="text-gray-700 hover:text-gray-900">
              <X className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">{selectedProduct.title}</h1>
          </div>

          <div className="space-y-4">
            <Card className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{selectedProduct.description}</h2>

              <div className="space-y-3 mb-6">
                {selectedProduct.details.map((detail: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">{detail}</span>
                  </div>
                ))}
              </div>

              <button className="w-full py-3 bg-[#dc242c] text-white rounded-xl font-semibold hover:bg-[#721216] transition-colors">
                {selectedProduct.cta}
              </button>
            </Card>

            <Card className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Need Help Deciding?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our financial advisors are here to help you find the right product for your needs.
              </p>
              <button className="w-full py-2 border border-[#dc242c] text-[#dc242c] rounded-xl font-medium hover:bg-red-50 transition-colors">
                Schedule a Consultation
              </button>
            </Card>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg">
          <div className="flex items-center justify-around max-w-md mx-auto">
            <button
              onClick={() => handleNavigation("accounts")}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
                activeNav === "accounts" ? "text-[#d32f2f]" : "text-gray-500"
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Accounts</span>
            </button>

            <button
              onClick={() => handleNavigation("deposit")}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
                activeNav === "deposit" ? "text-[#d32f2f]" : "text-gray-500"
              }`}
            >
              <Upload className="w-6 h-6" />
              <span className="text-xs font-medium">Deposit</span>
            </button>

            <button
              onClick={() => handleNavigation("transfer")}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
                activeNav === "transfer" ? "text-[#d32f2f]" : "text-gray-500"
              }`}
            >
              <ArrowLeftRight className="w-6 h-6" />
              <span className="text-xs font-medium">Pay & Transfer</span>
            </button>

            <button
              onClick={() => handleNavigation("explore")}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
                activeNav === "explore" ? "text-[#d32f2f]" : "text-gray-500"
              }`}
            >
              <Compass className="w-6 h-6" />
              <span className="text-xs font-medium">Explore</span>
            </button>

            <button
              onClick={() => handleNavigation("menu")}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
                activeNav === "menu" ? "text-[#d32f2f]" : "text-gray-500"
              }`}
            >
              <Menu className="w-6 h-6" />
              <span className="text-xs font-medium">Menu</span>
            </button>
          </div>

          <div className="flex justify-center mt-2">
            <div className="w-32 h-1 bg-gray-900 rounded-full"></div>
          </div>
        </div>
      </div>
    )
  }

  if (activeView === "all_products") {
    return <AllProducts onBack={() => setActiveView("dashboard")} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#b8b5d4] via-[#c5c3db] to-[#d4d2e3] pb-20">
      {/* Mobile Header */}
      <div className="bg-[#b8b5d4] px-4 pt-3 pb-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          {/* Search Bar */}
          <button
            onClick={handleSearchClick}
            className="flex-1 max-w-[200px] bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
          >
            <Search className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Ask Fargo</span>
          </button>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-white/20 rounded-full transition-colors active:scale-95"
            >
              <RefreshCw className="w-5 h-5 text-[#d32f2f]" />
            </button>
            <button
              onClick={handleNotificationClick}
              className="relative p-2 hover:bg-white/20 rounded-full transition-colors active:scale-95"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-[#d32f2f] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount}
                </div>
              )}
            </button>
            <button
              onClick={() => setActiveView("account")}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#dc242c] to-[#721216] flex items-center justify-center text-white font-semibold text-sm hover:shadow-lg transition-all active:scale-95"
            >
              {firstName.charAt(0)}
              {lastName.charAt(0)}
            </button>
            <button
              onClick={logout}
              className="text-sm text-gray-700 font-medium hover:text-gray-900 transition-colors active:scale-95"
            >
              Sign off
            </button>
          </div>
        </div>

        {/* Greeting */}
        <h1 className="text-2xl font-normal text-gray-800 mb-6">
          {greeting},
          <br />
          {fullName}
        </h1>

        {/* Account Cards */}
        <div className="space-y-3">
          <Card
            onClick={() => setActiveView("account")}
            className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="text-xs font-medium text-gray-600 mb-1">EVERYDAY CHECKING ...{accountNumber}</div>
            <div className="text-3xl font-semibold text-gray-900 mb-1">
              ${accountBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-500">Available balance</div>
            <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">Routing Number: 121000248</div>
          </Card>

          <Card
            onClick={() => setActiveView("account")}
            className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="text-xs font-medium text-gray-600 mb-1">WAY2SAVE SAVINGS ...{accountNumber}</div>
            <div className="text-3xl font-semibold text-gray-900 mb-1">
              ${savingsBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-500">Available balance</div>
            <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">Routing Number: 121000248</div>
          </Card>

          <button
            onClick={() => setActiveView("explore")}
            className="w-full bg-white rounded-2xl p-4 shadow-md flex items-center gap-3 hover:bg-gray-50 transition-colors active:scale-98"
          >
            <div className="w-8 h-8 bg-[#6b5dd3] rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Open new account</span>
          </button>

          <Card
            onClick={() => setActiveView("account")}
            className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#6b5dd3] rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">702</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Your FICO® Score went up 10 points</div>
                <div className="text-xs text-gray-500">Updated 04/19/2024</div>
              </div>
            </div>
          </Card>

          <Card
            onClick={() => setActiveView("explore")}
            className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#ffd700] rounded-full flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Earn 20k bonus points</div>
                <div className="text-xs text-gray-500">Apply for a Wells Fargo credit card</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => handleNavigation("accounts")}
            className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
              activeNav === "accounts" ? "text-[#d32f2f]" : "text-gray-500"
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Accounts</span>
          </button>

          <button
            onClick={() => handleNavigation("deposit")}
            className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
              activeNav === "deposit" ? "text-[#d32f2f]" : "text-gray-500"
            }`}
          >
            <Upload className="w-6 h-6" />
            <span className="text-xs font-medium">Deposit</span>
          </button>

          <button
            onClick={() => handleNavigation("transfer")}
            className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
              activeNav === "transfer" ? "text-[#d32f2f]" : "text-gray-500"
            }`}
          >
            <ArrowLeftRight className="w-6 h-6" />
            <span className="text-xs font-medium">Pay & Transfer</span>
          </button>

          <button
            onClick={() => handleNavigation("explore")}
            className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
              activeNav === "explore" ? "text-[#d32f2f]" : "text-gray-500"
            }`}
          >
            <Compass className="w-6 h-6" />
            <span className="text-xs font-medium">Explore</span>
          </button>

          <button
            onClick={() => handleNavigation("menu")}
            className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors active:scale-95 ${
              activeNav === "menu" ? "text-[#d32f2f]" : "text-gray-500"
            }`}
          >
            <Menu className="w-6 h-6" />
            <span className="text-xs font-medium">Menu</span>
          </button>
        </div>

        {/* Home Indicator (iPhone style) */}
        <div className="flex justify-center mt-2">
          <div className="w-32 h-1 bg-gray-900 rounded-full"></div>
        </div>
      </div>

      {/* Menu Modal */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-in slide-in-from-bottom max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Menu</h2>
              <button
                onClick={() => setShowMenu(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => {
                  setShowMenu(false)
                  setActiveView("account")
                }}
                className="p-4 bg-gradient-to-br from-[#dc242c] to-[#721216] text-white rounded-xl text-left hover:shadow-lg transition-all active:scale-95"
              >
                <User className="w-6 h-6 mb-2" />
                <div className="text-sm font-semibold">Account Info</div>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false)
                  setActiveView("settings")
                }}
                className="p-4 bg-gradient-to-br from-[#6b5dd3] to-[#5b4bc3] text-white rounded-xl text-left hover:shadow-lg transition-all active:scale-95"
              >
                <Settings className="w-6 h-6 mb-2" />
                <div className="text-sm font-semibold">Settings</div>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false)
                  setActiveView("atm")
                }}
                className="p-4 bg-gradient-to-br from-[#f7ba77] to-[#c68e90] text-white rounded-xl text-left hover:shadow-lg transition-all active:scale-95"
              >
                <MapPin className="w-6 h-6 mb-2" />
                <div className="text-sm font-semibold">ATM Locator</div>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false)
                  setActiveView("pending")
                }}
                className="p-4 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl text-left hover:shadow-lg transition-all active:scale-95"
              >
                <Clock className="w-6 h-6 mb-2" />
                <div className="text-sm font-semibold">Pending</div>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false)
                  setShowNotifications(true)
                }}
                className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl text-left hover:shadow-lg transition-all active:scale-95"
              >
                <Bell className="w-6 h-6 mb-2" />
                <div className="text-sm font-semibold">Notifications</div>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false)
                  setActiveView("help")
                }}
                className="p-4 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl text-left hover:shadow-lg transition-all active:scale-95"
              >
                <HelpCircle className="w-6 h-6 mb-2" />
                <div className="text-sm font-semibold">Help & Support</div>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false)
                  setActiveView("documents")
                }}
                className="p-4 bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-xl text-left hover:shadow-lg transition-all active:scale-95"
              >
                <FileText className="w-6 h-6 mb-2" />
                <div className="text-sm font-semibold">Documents</div>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false)
                  setActiveView("explore")
                }}
                className="p-4 bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-xl text-left hover:shadow-lg transition-all active:scale-95"
              >
                <Compass className="w-6 h-6 mb-2" />
                <div className="text-sm font-semibold">Explore</div>
              </button>
            </div>

            <button
              onClick={logout}
              className="w-full py-3 bg-[#dc242c] text-white rounded-xl font-semibold hover:bg-[#721216] transition-colors flex items-center justify-center gap-2 active:scale-95"
            >
              <LogOut className="w-5 h-5" />
              Sign Off
            </button>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-white z-50 p-4">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setShowSearch(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
            <input
              type="text"
              placeholder="Search accounts, transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d32f2f]"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-gray-500 mb-2">Quick Actions</div>
            <button
              onClick={() => {
                setShowSearch(false)
                setActiveView("transfer")
              }}
              className="w-full p-4 bg-white border border-gray-200 rounded-xl text-left hover:border-[#d32f2f] transition-colors"
            >
              <div className="flex items-center gap-3">
                <ArrowLeftRight className="w-5 h-5 text-[#d32f2f]" />
                <div>
                  <div className="font-medium text-gray-900">Transfer Money</div>
                  <div className="text-xs text-gray-500">Send money to accounts</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setShowSearch(false)
                setActiveView("deposit")
              }}
              className="w-full p-4 bg-white border border-gray-200 rounded-xl text-left hover:border-[#d32f2f] transition-colors"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-[#d32f2f]" />
                <div>
                  <div className="font-medium text-gray-900">Deposit Check</div>
                  <div className="text-xs text-gray-500">Mobile check deposit</div>
                </div>
              </div>
            </button>

            <button className="w-full p-4 bg-white border border-gray-200 rounded-xl text-left hover:border-[#d32f2f] transition-colors">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#d32f2f]" />
                <div>
                  <div className="font-medium text-gray-900">Find ATM</div>
                  <div className="text-xs text-gray-500">Locate nearby ATMs</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-white z-50 p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            <button
              onClick={() => setShowNotifications(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="space-y-3">
            <Card className="p-4 border-l-4 border-l-[#d32f2f]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#d32f2f] rounded-full flex items-center justify-center flex-shrink-0">
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Transaction Alert</div>
                  <div className="text-sm text-gray-600 mt-1">Your recent transfer of $500 was successful</div>
                  <div className="text-xs text-gray-500 mt-2">2 hours ago</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-green-600">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Deposit Received</div>
                  <div className="text-sm text-gray-600 mt-1">Direct deposit of $3,054.16 received</div>
                  <div className="text-xs text-gray-500 mt-2">1 day ago</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-blue-600">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Security Alert</div>
                  <div className="text-sm text-gray-600 mt-1">New device login detected from Chrome on Windows</div>
                  <div className="text-xs text-gray-500 mt-2">3 days ago</div>
                </div>
              </div>
            </Card>

            <button className="w-full py-3 bg-[#dc242c] text-white rounded-xl font-semibold hover:bg-[#721216] transition-colors">
              Mark All as Read
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
