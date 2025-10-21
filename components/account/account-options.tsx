"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Plus, CreditCard, PiggyBank, TrendingUp, Building, ChevronRight } from "lucide-react"
import { useAuth } from "@/components/auth/auth-manager"
import AccountOpening from "@/components/account/account-opening" // Added account opening component import

interface AccountOptionsProps {
  onBack: () => void
}

const accountTypes = [
  {
    id: "everyday",
    name: "Everyday Checking",
    description: "Perfect for daily banking needs",
    fee: "$10/month",
    minimum: "$500 daily balance to waive fee",
    features: ["Online & Mobile Banking", "Debit Card", "Bill Pay", "Direct Deposit"],
    icon: <CreditCard className="w-6 h-6" />,
  },
  {
    id: "clear",
    name: "Clear Access Banking",
    description: "Second-chance banking opportunity",
    fee: "$5/month",
    minimum: "$300 daily balance to waive fee",
    features: ["No overdraft fees", "Online Banking", "Debit Card", "Mobile Deposit"],
    icon: <Building className="w-6 h-6" />,
  },
  {
    id: "prime",
    name: "Prime Checking",
    description: "Interest-earning checking account",
    fee: "$25/month",
    minimum: "$20,000 minimum balance to waive fee",
    features: ["Earns Interest", "Free Cashier's Checks", "Premium Support", "Overdraft Protection"],
    icon: <TrendingUp className="w-6 h-6" />,
  },
  {
    id: "premier",
    name: "Premier Checking",
    description: "Premium banking with exclusive benefits",
    fee: "$35/month",
    minimum: "Large balance requirements",
    features: ["Relationship Rewards", "Investment Services", "Private Banking", "Concierge Service"],
    icon: <Building className="w-6 h-6" />,
  },
  {
    id: "way2save",
    name: "Way2Save Savings",
    description: "Automatic savings with every purchase",
    fee: "Variable monthly fee",
    minimum: "$25 minimum opening deposit",
    features: ["Automatic Transfers", "Competitive Rates", "Online Banking", "Mobile App"],
    icon: <PiggyBank className="w-6 h-6" />,
  },
  {
    id: "platinum",
    name: "Platinum Savings",
    description: "High-yield savings account",
    fee: "$12/month",
    minimum: "$3,500 daily balance to waive fee",
    features: ["Higher Interest Rates", "Tiered Rate Structure", "Online Banking", "Mobile Deposit"],
    icon: <TrendingUp className="w-6 h-6" />,
  },
]

export function AccountOptions({ onBack }: AccountOptionsProps) {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<"checking" | "savings" | "cds">("checking")
  const [showAccountOpening, setShowAccountOpening] = useState<string | null>(null) // Added state for account opening

  const filteredAccounts = accountTypes.filter((account) => {
    if (selectedCategory === "checking") {
      return (
        account.id.includes("checking") ||
        account.id === "everyday" ||
        account.id === "clear" ||
        account.id === "prime" ||
        account.id === "premier"
      )
    }
    if (selectedCategory === "savings") {
      return account.id.includes("savings") || account.id === "way2save" || account.id === "platinum"
    }
    return false
  })

  const handleOpenAccount = (accountType: string) => {
    setShowAccountOpening(accountType) // Updated to show account opening component instead of alert
  }

  // Added conditional rendering for account opening component
  if (showAccountOpening) {
    return (
      <AccountOpening
        accountType={showAccountOpening}
        onBack={() => setShowAccountOpening(null)}
        onComplete={() => {
          setShowAccountOpening(null)
          onBack()
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
        <h1 className="text-xl font-semibold text-gray-900">Account Options</h1>
      </div>

      {/* Current Account Info */}
      <div className="p-4 bg-red-50 border-b border-red-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Current Account</h3>
            <p className="text-sm text-gray-600">
              {user?.accountType} ...{user?.accountNumber}
            </p>
            <p className="text-lg font-bold text-green-600">${user?.balance?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setSelectedCategory("checking")}
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 ${
            selectedCategory === "checking" ? "border-red-600 text-red-600" : "border-transparent text-gray-600"
          }`}
        >
          Checking
        </button>
        <button
          onClick={() => setSelectedCategory("savings")}
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 ${
            selectedCategory === "savings" ? "border-red-600 text-red-600" : "border-transparent text-gray-600"
          }`}
        >
          Savings
        </button>
        <button
          onClick={() => setSelectedCategory("cds")}
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 ${
            selectedCategory === "cds" ? "border-red-600 text-red-600" : "border-transparent text-gray-600"
          }`}
        >
          CDs
        </button>
      </div>

      <div className="p-4 space-y-4">
        {selectedCategory === "cds" ? (
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Certificate of Deposit Options</h3>
              <p className="text-gray-600 mb-4">
                Secure your savings with guaranteed returns. Choose from various term lengths and competitive rates.
              </p>
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">3-Month CD</p>
                    <p className="text-sm text-gray-600">Minimum $2,500</p>
                  </div>
                  <p className="font-bold text-green-600">2.50% APY</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">6-Month CD</p>
                    <p className="text-sm text-gray-600">Minimum $2,500</p>
                  </div>
                  <p className="font-bold text-green-600">3.00% APY</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">12-Month CD</p>
                    <p className="text-sm text-gray-600">Minimum $2,500</p>
                  </div>
                  <p className="font-bold text-green-600">3.75% APY</p>
                </div>
              </div>
              <Button className="w-full mt-4 bg-red-600 hover:bg-red-700" onClick={() => handleOpenAccount("CD")}>
                <Plus className="w-4 h-4 mr-2" />
                Open CD Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredAccounts.map((account) => (
            <Card key={account.id} className="border border-gray-200 hover:border-red-300 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                    {account.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{account.name}</h3>
                        <p className="text-sm text-gray-600">{account.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monthly Fee:</span>
                        <span className="font-medium">{account.fee}</span>
                      </div>
                      <div className="text-sm text-gray-600">{account.minimum}</div>
                    </div>

                    <div className="space-y-1 mb-4">
                      <p className="text-sm font-medium text-gray-900">Key Features:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {account.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-red-600 rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleOpenAccount(account.name)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Open Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
