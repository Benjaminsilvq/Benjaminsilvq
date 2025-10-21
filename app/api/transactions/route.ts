import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const limit = Number.parseInt(searchParams.get("limit") || "25")

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  // Mock transaction data - in real app, fetch from database
  const transactions = [
    {
      id: "txn_001",
      type: "credit",
      amount: 3054.16,
      description: "Salary Deposit - Direct Deposit",
      date: new Date().toISOString(),
      category: "Income",
      status: "completed",
      balance_after: 12450.75,
      merchant: "ACME Corporation",
      account: "Everyday Checking ...6224",
    },
    {
      id: "txn_002",
      type: "debit",
      amount: -127.45,
      description: "Grocery Store Purchase",
      date: new Date(Date.now() - 86400000).toISOString(),
      category: "Food & Dining",
      status: "completed",
      balance_after: 9396.59,
      merchant: "Whole Foods Market",
      account: "Everyday Checking ...6224",
    },
    {
      id: "txn_003",
      type: "debit",
      amount: -500.0,
      description: "Transfer to Savings",
      date: new Date(Date.now() - 172800000).toISOString(),
      category: "Transfer",
      status: "completed",
      balance_after: 9524.04,
      merchant: "Internal Transfer",
      account: "Everyday Checking ...6224",
    },
    {
      id: "txn_004",
      type: "credit",
      amount: 500.0,
      description: "Transfer from Checking",
      date: new Date(Date.now() - 172800000).toISOString(),
      category: "Transfer",
      status: "completed",
      balance_after: 16250.0,
      merchant: "Internal Transfer",
      account: "Way2Save Savings ...8847",
    },
    {
      id: "txn_005",
      type: "debit",
      amount: -89.99,
      description: "Monthly Subscription",
      date: new Date(Date.now() - 259200000).toISOString(),
      category: "Subscriptions",
      status: "completed",
      balance_after: 10024.04,
      merchant: "Netflix Inc",
      account: "Everyday Checking ...6224",
    },
  ]

  return NextResponse.json({
    transactions: transactions.slice(0, limit),
    total_count: transactions.length,
    has_more: transactions.length > limit,
  })
}

export async function POST(request: NextRequest) {
  try {
    const transaction = await request.json()

    console.log("[v0] Processing new transaction:", transaction)

    // Mock transaction processing - in real app, process with payment system
    const processedTransaction = {
      id: `txn_${Date.now()}`,
      ...transaction,
      status: "completed",
      date: new Date().toISOString(),
      balance_after: transaction.balance_after || 0,
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      transaction: processedTransaction,
      message: "Transaction processed successfully",
    })
  } catch (error) {
    console.error("Transaction processing error:", error)
    return NextResponse.json({ error: "Failed to process transaction" }, { status: 500 })
  }
}
