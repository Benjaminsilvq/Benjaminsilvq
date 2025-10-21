import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  const accountInfo = {
    accountNumber: "1234566224", // Full account number ending in 6224 to match everyday checking
    routingNumber: "121000248",
    accountHolderName: "Johnny Mercer",
    accountType: "Everyday Checking",
    balance: 36000.0,
    availableBalance: 36000.0,
    accountStatus: "Active",
    openDate: "2020-03-15",
    lastActivity: new Date().toISOString(),
    interestRate: "0.01%",
    minimumBalance: 500.0,
    monthlyFee: 10.0,
    overdraftProtection: true,
    paperlessStatements: true,
    mobileDeposit: true,
    onlineBanking: true,
    debitCard: {
      cardNumber: "**** **** **** 6224",
      expiryDate: "12/27",
      status: "Active",
    },
  }

  return NextResponse.json({ accountInfo })
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json()

    // Mock update - in real app, update database
    console.log("[v0] Account info update:", updates)

    return NextResponse.json({
      success: true,
      message: "Account information updated successfully",
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Account update error:", error)
    return NextResponse.json({ error: "Failed to update account information" }, { status: 500 })
  }
}
