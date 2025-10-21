import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { amount, locationId, accountId, depositMethod } = await request.json()

    if (!amount || !locationId || !accountId || !depositMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Simulate cash deposit processing
    const depositData = {
      id: `CASH${Date.now()}`,
      amount: Number.parseFloat(amount),
      accountId,
      locationId,
      depositMethod, // 'atm' or 'teller'
      status: "completed", // Cash deposits are immediate
      submittedAt: new Date().toISOString(),
      availableAt: new Date().toISOString(), // Immediate availability
      confirmationNumber: `CD${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      receipt: {
        transactionId: `TXN${Date.now()}`,
        location: locationId,
        method: depositMethod,
        fee: 0, // No fee for Wells Fargo customers
        balanceAfter: 12450.75 + Number.parseFloat(amount), // Mock balance
      },
    }

    return NextResponse.json({
      success: true,
      deposit: depositData,
      message: "Cash deposit completed successfully",
    })
  } catch (error) {
    console.error("Cash deposit error:", error)
    return NextResponse.json({ error: "Failed to process cash deposit" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const accountId = searchParams.get("accountId")

  if (!accountId) {
    return NextResponse.json({ error: "Account ID required" }, { status: 400 })
  }

  // Mock cash deposit history
  const deposits = [
    {
      id: "CASH1704123456",
      amount: 500.0,
      status: "completed",
      submittedAt: "2024-01-15T16:30:00Z",
      availableAt: "2024-01-15T16:30:00Z",
      confirmationNumber: "CD8K2M9N1P",
      location: "Wells Fargo ATM - Downtown",
      method: "atm",
    },
    {
      id: "CASH1704098765",
      amount: 1200.0,
      status: "completed",
      submittedAt: "2024-01-12T11:45:00Z",
      availableAt: "2024-01-12T11:45:00Z",
      confirmationNumber: "CD5X7Y3Z8Q",
      location: "Wells Fargo Bank - Virginia Tech Branch",
      method: "teller",
    },
  ]

  return NextResponse.json({ deposits })
}
