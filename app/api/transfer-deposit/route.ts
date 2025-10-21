import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { transferType, amount, accountId, externalBank, directDeposit } = await request.json()

    if (!transferType || !amount || !accountId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let transferData: any = {
      id: `TXF${Date.now()}`,
      amount: Number.parseFloat(amount),
      accountId,
      transferType,
      status: "processing",
      submittedAt: new Date().toISOString(),
      confirmationNumber: `TD${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    }

    if (transferType === "external") {
      if (!externalBank) {
        return NextResponse.json({ error: "External bank information required" }, { status: 400 })
      }

      transferData = {
        ...transferData,
        externalBank: {
          bankName: externalBank.bankName,
          routingNumber: externalBank.routingNumber,
          accountNumber: externalBank.accountNumber.replace(/\d(?=\d{4})/g, "*"),
          accountType: externalBank.accountType,
        },
        expectedArrival: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 business days
        fee: externalBank.expedited ? 15.0 : 0.0,
        expedited: externalBank.expedited || false,
      }
    } else if (transferType === "direct_deposit") {
      if (!directDeposit) {
        return NextResponse.json({ error: "Direct deposit information required" }, { status: 400 })
      }

      transferData = {
        ...transferData,
        directDeposit: {
          employerName: directDeposit.employerName,
          percentage: directDeposit.percentage,
          amount: directDeposit.fixedAmount || null,
          startDate: directDeposit.startDate,
        },
        status: "setup_complete",
        routingNumber: "121000248", // Wells Fargo routing number
        accountNumber: accountId,
      }
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json({
      success: true,
      transfer: transferData,
      message: `${transferType === "direct_deposit" ? "Direct deposit setup" : "Transfer"} completed successfully`,
    })
  } catch (error) {
    console.error("Transfer deposit error:", error)
    return NextResponse.json({ error: "Failed to process transfer" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const accountId = searchParams.get("accountId")
  const type = searchParams.get("type") // 'external', 'direct_deposit', or null for all

  if (!accountId) {
    return NextResponse.json({ error: "Account ID required" }, { status: 400 })
  }

  // Mock transfer history
  const transfers = [
    {
      id: "TXF1704123456",
      transferType: "external",
      amount: 2500.0,
      status: "completed",
      submittedAt: "2024-01-15T10:30:00Z",
      completedAt: "2024-01-18T09:00:00Z",
      confirmationNumber: "TD7K9L2M4N",
      externalBank: {
        bankName: "Bank of America",
        accountNumber: "****5678",
      },
    },
    {
      id: "TXF1704098765",
      transferType: "direct_deposit",
      amount: 3200.0,
      status: "active",
      submittedAt: "2024-01-01T08:00:00Z",
      confirmationNumber: "TD3X8Y1Z5Q",
      directDeposit: {
        employerName: "Virginia Tech",
        percentage: 100,
        frequency: "bi-weekly",
      },
    },
  ]

  let filteredTransfers = transfers
  if (type) {
    filteredTransfers = transfers.filter((t) => t.transferType === type)
  }

  return NextResponse.json({ transfers: filteredTransfers })
}
