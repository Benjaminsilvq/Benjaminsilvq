"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  PiggyBank,
  Target,
  AlertCircle,
  Eye,
  EyeOff,
  Plus,
  ArrowRight,
} from "lucide-react"
import { useAuth } from "@/components/auth/auth-manager"

interface UserDashboardProps {
  onBack: () => void
}

const accountSummary = {
  checking: { balance: 9942.31, change: 245.67, changePercent: 2.5 },
  savings: { balance: 15750.0, change: -125.0, changePercent: -0.8 },
  creditCard: { balance: -1250.75, limit: 5000, utilization: 25 },
  investment: { balance: 28450.0, change: 1250.0, changePercent: 4.6 },
}

const recentActivity = [
  { type: "income", description: "Salary Deposit", amount: 3054.16, date: "Today" },
  { type: "expense", description: "Grocery Store", amount: -127.45, date: "Yesterday" },
  { type: "transfer", description: "Savings Transfer", amount: -500.0, date: "2 days ago" },
]

const spendingCategories = [
  { category: "Food & Dining", amount: 450.25, percent: 35, color: "bg-red-500" },
  { category: "Transportation", amount: 280.0, percent: 22, color: "bg-blue-500" },
  { category: "Shopping", amount: 195.75, percent: 15, color: "bg-green-500" },
  { category: "Entertainment", amount: 165.0, percent: 13, color: "bg-yellow-500" },
  { category: "Utilities", amount: 195.0, percent: 15, color: "bg-purple-500" },
]

const goals = [
  { name: "Emergency Fund", current: 5250, target: 10000, progress: 52.5 },
  { name: "Vacation", current: 1800, target: 3000, progress: 60 },
  { name: "New Car", current: 8500, target: 25000, progress: 34 },
]

const insights = [
  {
    type: "positive",
    title: "Great Savings Progress!",
    description: "You've saved 15% more this month compared to last month.",
    action: "View Savings Tips",
  },
  {
    type: "warning",
    title: "High Spending Alert",
    description: "Your dining expenses are 25% higher than usual this month.",
    action: "Set Budget Limit",
  },
  {
    type: "info",
    title: "Investment Opportunity",
    description: "Consider increasing your 401(k) contribution to maximize employer match.",
    action: "Learn More",
  },
]

export function UserDashboard({ onBack }: UserDashboardProps) {
  const { user } = useAuth()
  const [balanceVisible, setBalanceVisible] = useState(true)

  const totalNetWorth =
    accountSummary.checking.balance +
    accountSummary.savings.balance +
    accountSummary.investment.balance +
    accountSummary.creditCard.balance

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome back, {user?.firstName || "User"}!</p>
        </div>
        <button onClick={() => setBalanceVisible(!balanceVisible)} className="text-gray-600 hover:text-gray-800">
          {balanceVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Net Worth Overview */}
        <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Total Net Worth</h3>
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-2">
              {balanceVisible ? `$${totalNetWorth.toLocaleString()}` : "••••••"}
            </div>
            <div className="flex items-center gap-2 text-red-100">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+$1,370.67 this month</span>
            </div>
          </CardContent>
        </Card>

        {/* Account Summary */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Account Summary</h3>

          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Checking</p>
                    <p className="font-semibold text-gray-900">
                      {balanceVisible ? `$${accountSummary.checking.balance.toLocaleString()}` : "••••••"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">+{accountSummary.checking.changePercent}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <PiggyBank className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Savings</p>
                    <p className="font-semibold text-gray-900">
                      {balanceVisible ? `$${accountSummary.savings.balance.toLocaleString()}` : "••••••"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingDown className="w-3 h-3 text-red-600" />
                  <span className="text-red-600">{accountSummary.savings.changePercent}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Investments</p>
                    <p className="font-semibold text-gray-900">
                      {balanceVisible ? `$${accountSummary.investment.balance.toLocaleString()}` : "••••••"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">+{accountSummary.investment.changePercent}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Credit Card</p>
                    <p className="font-semibold text-gray-900">
                      {balanceVisible ? `$${Math.abs(accountSummary.creditCard.balance).toLocaleString()}` : "••••••"}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-600">{accountSummary.creditCard.utilization}% utilization</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-2">
            {recentActivity.map((activity, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          activity.type === "income"
                            ? "bg-green-100"
                            : activity.type === "expense"
                              ? "bg-red-100"
                              : "bg-blue-100"
                        }`}
                      >
                        {activity.type === "income" ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : activity.type === "expense" ? (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{activity.description}</p>
                        <p className="text-xs text-gray-600">{activity.date}</p>
                      </div>
                    </div>
                    <div className={`font-semibold ${activity.amount > 0 ? "text-green-600" : "text-gray-900"}`}>
                      {activity.amount > 0 ? "+" : ""}${Math.abs(activity.amount).toFixed(2)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Spending Categories */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Spending This Month</h3>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {spendingCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{category.category}</span>
                      <span className="font-medium">${category.amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${category.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${category.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Goals */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Financial Goals</h3>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
              <Plus className="w-4 h-4 mr-1" />
              Add Goal
            </Button>
          </div>

          <div className="space-y-3">
            {goals.map((goal, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{goal.name}</p>
                      <p className="text-sm text-gray-600">
                        ${goal.current.toLocaleString()} of ${goal.target.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{goal.progress.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Financial Insights */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Financial Insights</h3>

          <div className="space-y-3">
            {insights.map((insight, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        insight.type === "positive"
                          ? "bg-green-100"
                          : insight.type === "warning"
                            ? "bg-yellow-100"
                            : "bg-blue-100"
                      }`}
                    >
                      {insight.type === "positive" ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : insight.type === "warning" ? (
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <DollarSign className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                      >
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>

          <div className="grid grid-cols-2 gap-3">
            <Button className="h-16 bg-red-600 hover:bg-red-700 text-white flex-col">
              <Plus className="w-5 h-5 mb-1" />
              <span className="text-sm">Transfer Money</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 border-red-600 text-red-600 hover:bg-red-50 flex-col bg-transparent"
            >
              <CreditCard className="w-5 h-5 mb-1" />
              <span className="text-sm">Pay Bills</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 border-red-600 text-red-600 hover:bg-red-50 flex-col bg-transparent"
            >
              <PiggyBank className="w-5 h-5 mb-1" />
              <span className="text-sm">Open Account</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 border-red-600 text-red-600 hover:bg-red-50 flex-col bg-transparent"
            >
              <Target className="w-5 h-5 mb-1" />
              <span className="text-sm">Set Goals</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
