"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import {
  Search,
  Bell,
  LogOut,
  CreditCard,
  ArrowUpDown,
  Clock,
  CheckCircle,
  Filter,
  User,
  Building,
  Receipt,
  Code,
  Moon,
  Sun,
  ArrowLeft,
  Globe,
  Shield,
  Zap,
  Menu,
  X,
  MapPin,
  Upload,
  DollarSign,
  Settings,
} from "lucide-react"
import { useAuth } from "@/components/auth/auth-manager"
import { useTheme } from "@/components/theme/theme-provider"
import { ProfileManagement } from "@/components/account/profile-management"
import { AccountOptions } from "@/components/account/account-options"
import { BankSelector } from "@/components/account/bank-selector"
import { TransactionReceipt } from "@/components/transactions/transaction-receipt"
import { Statements } from "@/components/transactions/statements"
import { PayTransfer } from "@/components/transactions/pay-transfer"
import { DepositService } from "@/components/services/deposit-service"
import { CashDeposit } from "@/components/services/cash-deposit"
import { TransferDeposit } from "@/components/services/transfer-deposit"
import { ATMBranchLocator } from "@/components/services/atm-branch-locator"
import { ExploreServices } from "@/components/services/explore-services"
import { UserDashboard } from "@/components/dashboard/user-dashboard"
import { MobileDashboard } from "@/components/dashboard/mobile-dashboard"
import { APIIntegration } from "@/components/api/api-integration"
import { BankingServices } from "@/components/services/banking-services"
import { AccountInfoDisplay } from "@/components/account/account-info-display"
import { SettingsManager } from "@/components/account/settings-manager"
import { LiveBalanceManager } from "@/components/balance/live-balance-manager"
import {
  EnhancedNotificationCenter,
  EnhancedNotificationProvider,
} from "@/components/notifications/enhanced-notification-system"
import { PendingProcessManager } from "@/components/pending/pending-process-manager"
import { AllProducts } from "@/components/services/all-products"

interface Transaction {
  id: string
  type: "pending" | "completed"
  description: string
  amount: number
  date: string
  category: "salary" | "check" | "transfer" | "payment" | "deposit"
}

interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
}

const initialTransactions: Transaction[] = [
  {
    id: "1",
    type: "pending",
    description: "CHECK # 161",
    amount: -865.0,
    date: "Pending",
    category: "check",
  },
  {
    id: "2",
    type: "completed",
    description: "VIRGINIA TECH REG SALARY\n230626 XXXXX4726 HAIBO HUANG",
    amount: 3054.16,
    date: "07/03/2023",
    category: "salary",
  },
  {
    id: "3",
    type: "completed",
    description: "VIRGINIA TECH REG SALARY\n230609 XXXXX4726 HAIBO HUANG",
    amount: 3053.63,
    date: "06/16/2023",
    category: "salary",
  },
  {
    id: "4",
    type: "completed",
    description: "CHECK # 160",
    amount: -1130.75,
    date: "06/15/2023",
    category: "check",
  },
  {
    id: "5",
    type: "completed",
    description: "RECURRING TRANSFER TO TRUIST\nBANK CHK XXXXXX1068 H. HUANG REF\n#FP0JTMXGQ3 ON 06/15/23",
    amount: -500.0,
    date: "06/15/2023",
    category: "transfer",
  },
  {
    id: "6",
    type: "completed",
    description: "WF CREDIT CARD AUTO PAY 230612\n904964091A993 HUANG HAIBO",
    amount: -130.68,
    date: "06/12/2023",
    category: "payment",
  },
]

export function BankingInterface() {
  const [activeTab, setActiveTab] = useState("overview")
  const [activeNavItem, setActiveNavItem] = useState("accounts")
  const [currentView, setCurrentView] = useState<
    | "main"
    | "profile"
    | "accounts"
    | "banks"
    | "receipt"
    | "statements"
    | "transfer"
    | "deposit"
    | "cash_deposit"
    | "transfer_deposit"
    | "atm_locator"
    | "explore"
    | "dashboard"
    | "api"
    | "services"
    | "account_info"
    | "settings"
    | "live_balance"
    | "notifications"
    | "pending_processes"
    | "all_products"
  >("main")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showTransactionHistory, setShowTransactionHistory] = useState(false)
  const [showBalanceOptions, setShowBalanceOptions] = useState(false)
  const [accountVerified, setAccountVerified] = useState(true)
  const [onlineServicesActive, setOnlineServicesActive] = useState(true)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [depositType, setDepositType] = useState<"check" | "cash" | "transfer">("check")
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const { user, logout, debitBalance, creditBalance } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const balance = user?.balance || 36000.0
  const accountNumber = user?.accountNumber || "6224"
  const accountType = user?.accountType || "EVERYDAY CHECKING"

  useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]")
    setNotifications(savedNotifications)
  }, [])

  const handleSignOff = () => {
    logout()
  }

  const handleMenuClick = () => {
    setCurrentView("profile")
  }

  const handleAccountsClick = () => {
    setCurrentView("accounts")
  }

  const handleBanksClick = () => {
    setCurrentView("banks")
  }

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setCurrentView("receipt")
  }

  const handleStatementsClick = () => {
    setCurrentView("statements")
  }

  const handleTransferClick = () => {
    setCurrentView("transfer")
  }

  const handleDepositClick = () => {
    setCurrentView("deposit")
  }

  const handleCashDepositClick = () => {
    setCurrentView("cash_deposit")
  }

  const handleTransferDepositClick = () => {
    setCurrentView("transfer_deposit")
  }

  const handleATMLocatorClick = () => {
    setCurrentView("atm_locator")
  }

  const handleExploreClick = () => {
    setCurrentView("explore")
  }

  const handleDashboardClick = () => {
    setCurrentView("dashboard")
  }

  const handleAPIClick = () => {
    setCurrentView("api")
  }

  const handleServicesClick = () => {
    setCurrentView("services")
  }

  const handleAccountInfoClick = () => {
    setCurrentView("account_info")
  }

  const handleSettingsClick = () => {
    setCurrentView("settings")
  }

  const handleLiveBalanceClick = () => {
    setCurrentView("live_balance")
  }

  const handleNotificationsClick = () => {
    setCurrentView("notifications")
  }

  const handlePendingProcessesClick = () => {
    setCurrentView("pending_processes")
  }

  const handleAllProductsClick = () => {
    setCurrentView("all_products")
  }

  const handleSearchClick = () => {
    setShowSearch(!showSearch)
    if (!showSearch) {
      setSearchQuery("")
      setSearchResults([])
    }
  }

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      // Search through transactions, account info, and services
      const results = []

      // Search transactions
      const transactionResults = transactions
        .filter(
          (t) =>
            t.description.toLowerCase().includes(query.toLowerCase()) ||
            t.amount.toString().includes(query) ||
            t.date.toLowerCase().includes(query.toLowerCase()),
        )
        .map((t) => ({ ...t, type: "transaction" }))

      // Search account information
      const accountResults = []
      if (query.toLowerCase().includes("balance") || query.toLowerCase().includes("account")) {
        accountResults.push({
          id: "account-balance",
          title: "Account Balance",
          description: `Current balance: $${balance.toLocaleString()}`,
          type: "account",
        })
      }

      if (query.toLowerCase().includes("routing") || query.toLowerCase().includes("121000248")) {
        accountResults.push({
          id: "routing-number",
          title: "Routing Number",
          description: "121000248 - Wells Fargo Bank",
          type: "account",
        })
      }

      // Search services
      const serviceResults = []
      const services = [
        { name: "Mobile Deposit", description: "Deposit checks with camera" },
        { name: "Transfer Money", description: "Send money to accounts" },
        { name: "ATM Locator", description: "Find nearby ATMs and branches" },
        { name: "Cash Deposit", description: "Deposit cash at ATMs" },
        { name: "Account Options", description: "View account types" },
        { name: "Profile Management", description: "Update personal info" },
      ]

      services.forEach((service) => {
        if (
          service.name.toLowerCase().includes(query.toLowerCase()) ||
          service.description.toLowerCase().includes(query.toLowerCase())
        ) {
          serviceResults.push({
            id: service.name.toLowerCase().replace(" ", "-"),
            title: service.name,
            description: service.description,
            type: "service",
          })
        }
      })

      setSearchResults([...transactionResults, ...accountResults, ...serviceResults])
    } else {
      setSearchResults([])
    }
  }

  const handleSearchResultClick = (result: any) => {
    if (result.type === "transaction") {
      setSelectedTransaction(result)
      setCurrentView("receipt")
    } else if (result.type === "account") {
      setCurrentView("account_info")
    } else if (result.type === "service") {
      // Navigate to appropriate service
      if (result.id.includes("deposit")) {
        setCurrentView("deposit")
      } else if (result.id.includes("transfer")) {
        setCurrentView("transfer")
      } else if (result.id.includes("atm")) {
        setCurrentView("atm_locator")
      } else if (result.id.includes("account")) {
        setCurrentView("accounts")
      } else if (result.id.includes("profile")) {
        setCurrentView("profile")
      }
    }
    setShowSearch(false)
    setSearchQuery("")
  }

  const handleBackToMain = () => {
    setCurrentView("main")
    setSelectedTransaction(null)
  }

  const handleTransactionComplete = (newTransaction: Transaction) => {
    if (newTransaction.amount < 0) {
      const success = debitBalance(Math.abs(newTransaction.amount), newTransaction.description)
      if (!success) {
        alert("Insufficient funds for this transaction")
        return
      }
    } else {
      creditBalance(newTransaction.amount, newTransaction.description)
    }

    setTransactions((prev) => [newTransaction, ...prev])
    setCurrentView("main")
  }

  const handleDepositComplete = (newDeposit: Transaction) => {
    setTransactions((prev) => [newDeposit, ...prev])
    setCurrentView("main")
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    const updatedNotifications = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
  }

  const handleBalanceInfoClick = () => {
    setShowBalanceOptions(!showBalanceOptions)
  }

  const handleTransactionHistoryClick = () => {
    setShowTransactionHistory(!showTransactionHistory)
  }

  const verifyAccount = async (accountNum: string, routingNum: string) => {
    try {
      const response = await fetch("/api/verify-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_number: accountNum,
          routing_number: routingNum,
        }),
      })

      const result = await response.json()
      setAccountVerified(result.verified)
      return result
    } catch (error) {
      console.error("Account verification failed:", error)
      return { verified: false, error: "Verification service unavailable" }
    }
  }

  const processPendingChecks = async () => {
    setCurrentView("pending_processes")

    // Create notification for pending process access
    const notification = {
      id: Date.now().toString(),
      type: "system" as const,
      title: "Pending Processes Accessed",
      message: "Viewing all pending transactions and processes",
      timestamp: new Date().toISOString(),
      read: false,
    }

    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
    notifications.unshift(notification)
    localStorage.setItem("notifications", JSON.stringify(notifications))
  }

  if (currentView === "main") {
    return (
      <EnhancedNotificationProvider>
        <div className="relative">
          <MobileDashboard />
        </div>
      </EnhancedNotificationProvider>
    )
  }

  if (currentView === "profile") {
    return <ProfileManagement onBack={handleBackToMain} />
  }

  if (currentView === "accounts") {
    return <AccountOptions onBack={handleBackToMain} />
  }

  if (currentView === "banks") {
    return <BankSelector onBack={handleBackToMain} />
  }

  if (currentView === "receipt" && selectedTransaction) {
    return <TransactionReceipt transaction={selectedTransaction} onBack={handleBackToMain} />
  }

  if (currentView === "statements") {
    return <Statements onBack={handleBackToMain} />
  }

  if (currentView === "transfer") {
    return (
      <EnhancedNotificationProvider>
        <PayTransfer onBack={handleBackToMain} onTransactionComplete={handleTransactionComplete} />
      </EnhancedNotificationProvider>
    )
  }

  if (currentView === "deposit") {
    return (
      <EnhancedNotificationProvider>
        <DepositService onBack={handleBackToMain} onDepositComplete={handleDepositComplete} />
      </EnhancedNotificationProvider>
    )
  }

  if (currentView === "cash_deposit") {
    return <CashDeposit onBack={handleBackToMain} onDepositComplete={handleDepositComplete} />
  }

  if (currentView === "transfer_deposit") {
    return <TransferDeposit onBack={handleBackToMain} onDepositComplete={handleDepositComplete} />
  }

  if (currentView === "atm_locator") {
    return <ATMBranchLocator onBack={handleBackToMain} />
  }

  if (currentView === "explore") {
    return <ExploreServices onBack={handleBackToMain} />
  }

  if (currentView === "dashboard") {
    return <UserDashboard onBack={handleBackToMain} />
  }

  if (currentView === "api") {
    return <APIIntegration />
  }

  if (currentView === "services") {
    return <BankingServices onBack={handleBackToMain} />
  }

  if (currentView === "account_info") {
    return (
      <EnhancedNotificationProvider>
        <AccountInfoDisplay onBack={() => setCurrentView("main")} />
      </EnhancedNotificationProvider>
    )
  }

  if (currentView === "settings") {
    return (
      <EnhancedNotificationProvider>
        <SettingsManager onBack={() => setCurrentView("main")} />
      </EnhancedNotificationProvider>
    )
  }

  if (currentView === "live_balance") {
    return (
      <EnhancedNotificationProvider>
        <LiveBalanceManager onBack={() => setCurrentView("main")} />
      </EnhancedNotificationProvider>
    )
  }

  if (currentView === "notifications") {
    return (
      <EnhancedNotificationProvider>
        <EnhancedNotificationCenter onBack={() => setCurrentView("main")} />
      </EnhancedNotificationProvider>
    )
  }

  if (currentView === "pending_processes") {
    return (
      <EnhancedNotificationProvider>
        <PendingProcessManager onBack={() => setCurrentView("main")} />
      </EnhancedNotificationProvider>
    )
  }

  if (currentView === "all_products") {
    return <AllProducts onBack={handleBackToMain} />
  }

  return (
    <EnhancedNotificationProvider>
      <div className="min-h-screen bg-[#f8f9fa]">
        <div className="bg-[#721216] text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              {/* Left Section - Mobile Optimized */}
              <div className="flex items-center gap-2 sm:gap-6">
                {currentView !== "main" && (
                  <button
                    onClick={handleBackToMain}
                    className="flex items-center gap-1 sm:gap-2 text-white hover:text-[#f7ba77] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base hidden sm:inline">Back to Overview</span>
                    <span className="font-medium text-sm sm:hidden">Back</span>
                  </button>
                )}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#dc242c] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-bold">WF</span>
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-lg sm:text-xl font-bold">Wells Fargo Online Banking</h1>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-[#f7ba77]">
                      <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Live Online Services</span>
                      {onlineServicesActive && <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />}
                    </div>
                  </div>
                  <div className="sm:hidden">
                    <h1 className="text-sm font-bold">Wells Fargo</h1>
                    <div className="flex items-center gap-1 text-xs text-[#f7ba77]">
                      <Globe className="w-3 h-3" />
                      <span>Live</span>
                      {onlineServicesActive && <Zap className="w-3 h-3 text-green-400" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Mobile Optimized */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>Account Verified</span>
                  </div>
                  <div className="relative">
                    <button onClick={handleSearchClick} className="text-white hover:text-[#f7ba77] cursor-pointer">
                      <Search className="w-5 h-5" />
                    </button>
                    {showSearch && (
                      <div className="absolute top-8 right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 text-gray-900">
                        <div className="p-4 border-b border-gray-200 bg-[#721216] text-white rounded-t-lg">
                          <h3 className="font-semibold mb-2">Search Banking</h3>
                          <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search transactions, accounts, services..."
                              value={searchQuery}
                              onChange={(e) => handleSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#dc242c]"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {searchResults.length === 0 && searchQuery ? (
                            <div className="p-4 text-center text-gray-500">No results found</div>
                          ) : searchResults.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              <p className="mb-2">Search for:</p>
                              <div className="text-sm space-y-1">
                                <p>• Transactions and payments</p>
                                <p>• Account information</p>
                                <p>• Banking services</p>
                                <p>• Balance and routing details</p>
                              </div>
                            </div>
                          ) : (
                            searchResults.map((result, index) => (
                              <div
                                key={index}
                                onClick={() => handleSearchResultClick(result)}
                                className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                      result.type === "transaction"
                                        ? "bg-blue-100"
                                        : result.type === "account"
                                          ? "bg-green-100"
                                          : "bg-purple-100"
                                    }`}
                                  >
                                    {result.type === "transaction" && <Receipt className="w-4 h-4 text-blue-600" />}
                                    {result.type === "account" && <User className="w-4 h-4 text-green-600" />}
                                    {result.type === "service" && <Building className="w-4 h-4 text-purple-600" />}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm text-gray-900">
                                      {result.title || result.description?.split("\\n")[0] || "Transaction"}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {result.description ||
                                        `${result.amount > 0 ? "+" : ""}$${Math.abs(result.amount || 0).toFixed(2)}`}
                                    </p>
                                    {result.date && <p className="text-xs text-gray-500 mt-1">{result.date}</p>}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="text-white hover:text-[#f7ba77] transition-colors"
                    aria-label="Toggle theme"
                  >
                    {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>

                {/* Notifications - Always Visible */}
                <div className="relative">
                  <button onClick={handleNotificationClick} className="relative">
                    <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white hover:text-[#f7ba77]" />
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#dc242c] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {notifications.filter((n) => !n.read).length}
                        </span>
                      </div>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute top-8 right-0 w-80 sm:w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 text-gray-900">
                      <div className="p-4 border-b border-gray-200 bg-[#721216] text-white rounded-t-lg">
                        <h3 className="font-semibold">Live Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">No notifications</div>
                        ) : (
                          notifications.map((notification) => (
                            <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-sm text-gray-900">{notification.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-2">
                                    {new Date(notification.timestamp).toLocaleString()}
                                  </p>
                                </div>
                                {!notification.read && <div className="w-2 h-2 bg-[#dc242c] rounded-full"></div>}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden text-white hover:text-[#f7ba77] transition-colors"
                  aria-label="Toggle mobile menu"
                >
                  {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                {/* Desktop Sign Off */}
                <button
                  onClick={handleSignOff}
                  className="hidden md:flex items-center gap-2 text-white text-sm hover:text-[#f7ba77] bg-[#dc242c] px-4 py-2 rounded-lg font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Off</span>
                </button>
              </div>
            </div>

            {showMobileMenu && (
              <div className="md:hidden mt-4 pb-4 border-t border-[#dc242c] pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>Account Verified</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={handleSearchClick} className="text-white hover:text-[#f7ba77] cursor-pointer">
                      <Search className="w-5 h-5" />
                    </button>
                    <button
                      onClick={toggleTheme}
                      className="text-white hover:text-[#f7ba77] transition-colors"
                      aria-label="Toggle theme"
                    >
                      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <button onClick={handleAPIClick} className="text-white hover:text-[#f7ba77]">
                      <Code className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleSignOff}
                    className="flex items-center gap-2 text-white text-sm hover:text-[#f7ba77] bg-[#dc242c] px-4 py-2 rounded-lg font-medium w-full justify-center"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Off</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <Card className="mb-4 sm:mb-6 bg-white border-l-4 border-l-[#dc242c] shadow-lg">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="text-xs sm:text-sm font-medium text-[#5b5957] mb-2">
                    {accountType} ...{accountNumber}
                  </div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-[#721216]">
                    ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#5b5957]">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                      Available Balance - Live & Active
                    </span>
                    <button
                      onClick={handleBalanceInfoClick}
                      className="w-4 h-4 sm:w-5 sm:h-5 border border-[#5b5957] rounded-full flex items-center justify-center hover:bg-[#f7ba77] hover:border-[#f7ba77] transition-colors"
                    >
                      <span className="text-xs">i</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:flex gap-2 sm:gap-3">
                  <button
                    onClick={handleTransferClick}
                    className="bg-[#dc242c] text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-[#721216] transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                    <ArrowUpDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Transfer Money</span>
                    <span className="sm:hidden">Transfer</span>
                  </button>
                  <button
                    onClick={handleDepositClick}
                    className="bg-[#b67a67] text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-[#c68e90] transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Deposit Check</span>
                    <span className="sm:hidden">Deposit</span>
                  </button>
                  <button
                    onClick={handlePendingProcessesClick}
                    className="bg-green-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Process Pending</span>
                    <span className="sm:hidden">Process</span>
                  </button>
                  <button
                    onClick={handleServicesClick}
                    className="bg-[#5b5957] text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-[#721216] transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                    <Building className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">All Services</span>
                    <span className="sm:hidden">Services</span>
                  </button>
                </div>
              </div>

              {showBalanceOptions && (
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-[#f7ba77] bg-opacity-10 border border-[#f7ba77] rounded-lg">
                  <h3 className="font-semibold text-[#721216] mb-3 text-sm sm:text-base">Live Account Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#5b5957]">Account Number:</span>
                      <span className="font-medium">****{accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5b5957]">Routing Number:</span>
                      <span className="font-medium">121000248</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5b5957]">Account Holder:</span>
                      <span className="font-medium">
                        {user?.firstName} {user?.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5b5957]">Status:</span>
                      <span className="font-medium text-green-600">Active & Live</span>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={handleAccountInfoClick}
                      className="py-2 bg-[#dc242c] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#721216]"
                    >
                      Full Account Info
                    </button>
                    <button
                      onClick={handleLiveBalanceClick}
                      className="py-2 bg-green-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-green-700"
                    >
                      Live Balance
                    </button>
                  </div>
                  <button
                    onClick={() => setShowBalanceOptions(false)}
                    className="mt-3 w-full py-2 bg-[#dc242c] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#721216]"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </Card>

          <div className="flex overflow-x-auto border-b border-gray-200 bg-white rounded-t-lg shadow-sm scrollbar-hide">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-shrink-0 py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "overview"
                  ? "border-[#dc242c] text-[#dc242c] bg-[#dc242c] bg-opacity-5"
                  : "border-transparent text-[#5b5957] hover:text-[#721216]"
              }`}
            >
              Account Overview
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`flex-shrink-0 py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "manage"
                  ? "border-[#dc242c] text-[#dc242c] bg-[#dc242c] bg-opacity-5"
                  : "border-transparent text-[#5b5957] hover:text-[#721216]"
              }`}
            >
              Manage Account
            </button>
            <button
              onClick={() => setActiveTab("routing")}
              className={`flex-shrink-0 py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "routing"
                  ? "border-[#dc242c] text-[#dc242c] bg-[#dc242c] bg-opacity-5"
                  : "border-transparent text-[#5b5957] hover:text-[#721216]"
              }`}
            >
              Account Details & Routing
            </button>
            <button
              onClick={() => setActiveTab("mobile_services")}
              className={`flex-shrink-0 py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "mobile_services"
                  ? "border-[#dc242c] text-[#dc242c] bg-[#dc242c] bg-opacity-5"
                  : "border-transparent text-[#5b5957] hover:text-[#721216]"
              }`}
            >
              Mobile Services
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-b-lg shadow-sm">
            {activeTab === "manage" && (
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <button
                    onClick={handleAccountsClick}
                    className="p-4 sm:p-6 bg-gradient-to-br from-[#f7ba77] to-[#c68e90] text-white rounded-lg text-left hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Account Options</h3>
                    <p className="text-xs sm:text-sm opacity-90">View all account types and services</p>
                  </button>

                  <button
                    onClick={handleAccountInfoClick}
                    className="p-4 sm:p-6 bg-gradient-to-br from-[#dc242c] to-[#721216] text-white rounded-lg text-left hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <User className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Account Information</h3>
                    <p className="text-xs sm:text-sm opacity-90">View account number, routing, and live details</p>
                  </button>

                  <button
                    onClick={handleSettingsClick}
                    className="p-4 sm:p-6 bg-gradient-to-br from-[#b67a67] to-[#5b5957] text-white rounded-lg text-left hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <Settings className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Settings</h3>
                    <p className="text-xs sm:text-sm opacity-90">Manage notifications, security, and privacy</p>
                  </button>

                  <button
                    onClick={handleLiveBalanceClick}
                    className="p-4 sm:p-6 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg text-left hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Live Balance</h3>
                    <p className="text-xs sm:text-sm opacity-90">Real-time balance and transaction monitoring</p>
                  </button>

                  <button
                    onClick={handleNotificationsClick}
                    className="p-4 sm:p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg text-left hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <Bell className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Notifications</h3>
                    <p className="text-xs sm:text-sm opacity-90">
                      Credit alerts, debit alerts, and security notifications
                    </p>
                  </button>

                  <button
                    onClick={handlePendingProcessesClick}
                    className="p-4 sm:p-6 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-lg text-left hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Pending Processes</h3>
                    <p className="text-xs sm:text-sm opacity-90">Review and approve pending transactions</p>
                  </button>
                </div>
              </div>
            )}

            {activeTab === "mobile_services" && (
              <div className="p-4 sm:p-6">
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#721216] mb-2">Mobile Banking Services</h3>
                  <p className="text-[#5b5957]">
                    Access all mobile deposit and location services with live camera and GPS integration
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <button
                    onClick={handleDepositClick}
                    className="p-4 sm:p-6 bg-gradient-to-br from-[#dc242c] to-[#721216] text-white rounded-lg text-left hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Mobile Check Deposit</h3>
                    <p className="text-xs sm:text-sm opacity-90">Take photos of checks with live camera access</p>
                  </button>

                  <button
                    onClick={handleCashDepositClick}
                    className="p-4 sm:p-6 bg-gradient-to-br from-[#b67a67] to-[#5b5957] text-white rounded-lg text-left hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Cash Deposit</h3>
                    <p className="text-xs sm:text-sm opacity-90">Find ATMs and branches for cash deposits</p>
                  </button>

                  <button
                    onClick={handleTransferDepositClick}
                    className="p-4 sm:p-6 bg-gradient-to-br from-[#f7ba77] to-[#c68e90] text-white rounded-lg text-left hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Transfer Deposit</h3>
                    <p className="text-xs sm:text-sm opacity-90">Setup direct deposit and external transfers</p>
                  </button>

                  <button
                    onClick={handleATMLocatorClick}
                    className="p-4 sm:p-6 bg-gradient-to-br from-[#5b5957] to-[#721216] text-white rounded-lg text-left hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <MapPin className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">ATM & Branch Locator</h3>
                    <p className="text-xs sm:text-sm opacity-90">Find nearby locations with GPS and directions</p>
                  </button>

                  <button
                    onClick={handleAPIClick}
                    className="p-4 sm:p-6 bg-gradient-to-br from-[#c68e90] to-[#b67a67] text-white rounded-lg text-left hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <Zap className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Live API Services</h3>
                    <p className="text-xs sm:text-sm opacity-90">Real-time banking API integration</p>
                  </button>

                  <button
                    onClick={handleServicesClick}
                    className="p-4 sm:p-6 bg-gradient-to-br from-[#dc242c] to-[#f7ba77] text-white rounded-lg text-left hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <Building className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">All Banking Services</h3>
                    <p className="text-xs sm:text-sm opacity-90">Complete suite of banking services</p>
                  </button>
                </div>
              </div>
            )}

            {activeTab === "routing" && (
              <div className="p-4 sm:p-6">
                <Card className="border-l-4 border-l-[#dc242c]">
                  <div className="p-4 sm:p-6">
                    <h3 className="font-semibold text-[#721216] mb-4 text-lg sm:text-xl">Live Account Information</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between py-3 border-b border-gray-100">
                          <span className="text-[#5b5957] font-medium">Account Number:</span>
                          <span className="font-bold text-[#721216]">****{accountNumber}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-100">
                          <span className="text-[#5b5957] font-medium">Routing Number:</span>
                          <span className="font-bold text-[#721216]">121000248</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-100">
                          <span className="text-[#5b5957] font-medium">Account Type:</span>
                          <span className="font-bold text-[#721216]">{accountType}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between py-3 border-b border-gray-100">
                          <span className="text-[#5b5957] font-medium">Available Balance:</span>
                          <span className="font-bold text-green-600">${balance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-100">
                          <span className="text-[#5b5957] font-medium">Account Status:</span>
                          <span className="font-bold text-green-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Active & Verified
                          </span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-100">
                          <span className="text-[#5b5957] font-medium">Online Banking:</span>
                          <span className="font-bold text-green-600 flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Fully Enabled
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "overview" && (
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#721216]">Recent Transactions</h3>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-green-600 bg-green-50 px-2 sm:px-3 py-1 rounded-full">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Live Updates</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSearchClick}
                      className="w-4 h-4 text-[#5b5957] cursor-pointer hover:text-[#dc242c]"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                    <Filter className="w-4 h-4 text-[#5b5957] cursor-pointer hover:text-[#dc242c]" />
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {transactions.map((transaction) => (
                    <Card
                      key={transaction.id}
                      className="border border-gray-200 hover:border-[#dc242c] transition-all cursor-pointer hover:shadow-md"
                      onClick={() => handleTransactionClick(transaction)}
                    >
                      <div className="p-3 sm:p-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#f7ba77] bg-opacity-20 flex items-center justify-center flex-shrink-0">
                            {transaction.type === "pending" ? (
                              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#dc242c]" />
                            ) : (
                              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="text-xs sm:text-sm text-[#5b5957] mb-1 font-medium">
                                  {transaction.date}
                                </div>
                                <div className="text-sm sm:text-base font-medium leading-tight text-[#721216] break-words">
                                  {transaction.description.split("\\n").map((line, index) => (
                                    <div key={index} className={index > 0 ? "text-[#5b5957] text-xs sm:text-sm" : ""}>
                                      {line}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                <div
                                  className={`text-lg sm:text-xl font-bold ${
                                    transaction.amount > 0 ? "text-green-600" : "text-[#721216]"
                                  }`}
                                >
                                  {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                                </div>
                                <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-[#5b5957] hover:text-[#dc242c]" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </EnhancedNotificationProvider>
  )
}
