"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RefreshCw, TrendingUp, TrendingDown, DollarSign, Eye, EyeOff, AlertCircle } from "lucide-react"
import { useAuth } from "@/components/auth/auth-manager"
import { useToast } from "@/hooks/use-toast"

interface LiveBalanceManagerProps {
  onBack: () => void
}

interface Transaction {
  id: string
  type: "credit" | "debit"
  amount: number
  description: string
  date: string
  category: string
  status: "completed" | "pending" | "failed"
  balance_after: number
  merchant: string
  account: string
}

interface Balance {
  current: number
  available: number
  pending: number
  last_updated: string
  credit_limit?: number
}

export function LiveBalanceManager({ onBack }: LiveBalanceManagerProps) {
  const { user, debitBalance, creditBalance } = useAuth()
  const [balances, setBalances] = useState<Record<string, Balance>>({})
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [balanceVisible, setBalanceVisible] = useState(true)
  const { toast } = useToast()

  const fetchBalances = useCallback(async () => {
    try {
      const response = await fetch("/api/balance?userId=current")
      const data = await response.json()
      setBalances(data.balances)
    } catch (error) {
      console.error("Failed to fetch balances:", error)
      toast({
        title: "Error",
        description: "Failed to load account balances",
        variant: "destructive",
      })
    }
  }, [toast])

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch("/api/transactions?userId=current&limit=10")
      const data = await response.json()
      setTransactions(data.transactions)
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      })
    }
  }, [toast])

  const refreshData = async () => {
    setRefreshing(true)
    await Promise.all([fetchBalances(), fetchTransactions()])
    setRefreshing(false)
    toast({
      title: "Refreshed",
      description: "Account data updated successfully",
    })
  }

  const processTransaction = async (type: "credit" | "debit", amount: number, description: string) => {
    try {
      // Update local balance immediately for real-time feel
      const success = type === "credit" ? creditBalance(amount, description) : debitBalance(amount, description)

      if (!success && type === "debit") {
        toast({
          title: "Transaction Failed",
          description: "Insufficient funds for this transaction",
          variant: "destructive",
        })
        return
      }

      // Process transaction via API
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount: type === "debit" ? -amount : amount,
          description,
          category: type === "credit" ? "Deposit" : "Withdrawal",
          balance_after: user?.balance || 0,
        }),
      })

      if (response.ok) {
        // Refresh data to sync with server
        await refreshData()

        toast({
          title: "Transaction Complete",
          description: `$${amount.toFixed(2)} ${type === "credit" ? "credited to" : "debited from"} your account`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process transaction",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchBalances(), fetchTransactions()])
      setLoading(false)
    }
    loadData()

    // Set up real-time updates every 30 seconds
    const interval = setInterval(refreshData, 30000)
    return () => clearInterval(interval)
  }, [fetchBalances, fetchTransactions])

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading live balance data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 bg-red-600 text-white">
        <button onClick={onBack} className="text-white hover:text-gray-200">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Live Balance</h1>
          <p className="text-sm text-red-100">Real-time account monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setBalanceVisible(!balanceVisible)} className="text-white hover:text-gray-200">
            {balanceVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
          <button onClick={refreshData} disabled={refreshing} className="text-white hover:text-gray-200">
            <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Current Balance */}
        <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Primary Checking</h3>
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-2">
              {balanceVisible ? `$${user?.balance?.toLocaleString() || "0.00"}` : "••••••"}
            </div>
            <div className="flex items-center gap-2 text-green-100">
              <span className="text-sm">Available Balance</span>
              <Badge variant="secondary" className="bg-green-500 text-white">
                Live
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Account Balances */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">All Accounts</h3>

          {Object.entries(balances).map(([accountType, balance]) => (
            <Card key={accountType}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 capitalize">
                      {accountType === "checking"
                        ? "Everyday Checking"
                        : accountType === "savings"
                          ? "Way2Save Savings"
                          : "Credit Card"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {balanceVisible ? `$${balance.current.toLocaleString()}` : "••••••"}
                    </p>
                    {balance.pending > 0 && (
                      <p className="text-xs text-yellow-600">${balance.pending.toFixed(2)} pending</p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {new Date(balance.last_updated).toLocaleTimeString()}
                    </Badge>
                    {accountType === "credit" && balance.credit_limit && (
                      <p className="text-xs text-gray-500 mt-1">Limit: ${balance.credit_limit.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Quick Transactions</h3>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => processTransaction("credit", 100, "Test Deposit")}
              className="h-16 bg-green-600 hover:bg-green-700 text-white flex-col"
            >
              <TrendingUp className="w-5 h-5 mb-1" />
              <span className="text-sm">Add $100</span>
            </Button>
            <Button
              onClick={() => processTransaction("debit", 50, "Test Withdrawal")}
              variant="outline"
              className="h-16 border-red-600 text-red-600 hover:bg-red-50 flex-col bg-transparent"
            >
              <TrendingDown className="w-5 h-5 mb-1" />
              <span className="text-sm">Withdraw $50</span>
            </Button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>

          <div className="space-y-2">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="border border-gray-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          transaction.type === "credit" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "credit" ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{transaction.description}</p>
                        <p className="text-xs text-gray-600">{transaction.merchant}</p>
                        <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-semibold ${
                          transaction.type === "credit" ? "text-green-600" : "text-gray-900"
                        }`}
                      >
                        {transaction.type === "credit" ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                      <Badge variant={transaction.status === "completed" ? "default" : "secondary"} className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Balance Alerts */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-800">Balance Monitoring Active</h4>
                <p className="text-sm text-yellow-700">You'll receive alerts for all credit and debit transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
