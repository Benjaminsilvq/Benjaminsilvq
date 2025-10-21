import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const accountId = searchParams.get("accountId")

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  const balances = {
    checking: {
      current: 36000.0,
      available: 36000.0,
      pending: 0.0,
      last_updated: new Date().toISOString(),
    },
    savings: {
      current: 25250.0,
      available: 25250.0,
      pending: 0.0,
      last_updated: new Date().toISOString(),
    },
    credit: {
      current: -1250.75,
      available: 3749.25,
      pending: 0.0,
      credit_limit: 5000.0,
      last_updated: new Date().toISOString(),
    },
  }

  if (accountId && balances[accountId as keyof typeof balances]) {
    return NextResponse.json({
      balance: balances[accountId as keyof typeof balances],
    })
  }

  return NextResponse.json({ balances })
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, accountId, amount, type, description } = await request.json()

    console.log(`[v0] ${type} balance update:`, { userId, accountId, amount, description })

    // Mock balance update - in real app, update database
    const updatedBalance =
      type === "credit"
        ? { current: 12450.75 + amount, available: 12450.75 + amount }
        : { current: 12450.75 - amount, available: 12450.75 - amount }

    return NextResponse.json({
      success: true,
      balance: {
        ...updatedBalance,
        pending: 0.0,
        last_updated: new Date().toISOString(),
      },
      transaction_id: `txn_${Date.now()}`,
      message: `Balance ${type}ed successfully`,
    })
  } catch (error) {
    console.error("Balance update error:", error)
    return NextResponse.json({ error: "Failed to update balance" }, { status: 500 })
  }
}
