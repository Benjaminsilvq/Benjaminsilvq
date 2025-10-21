import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const transferData = await request.json()

    console.log("[v0] Processing international wire transfer:", transferData)

    // Validate required fields
    const requiredFields = [
      "amount",
      "recipientName",
      "recipientAddress",
      "bankName",
      "swiftCode",
      "country",
      "currency",
      "purposeOfTransfer",
    ]

    for (const field of requiredFields) {
      if (!transferData[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Validate amount
    const amount = Number.parseFloat(transferData.amount)
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ success: false, error: "Invalid transfer amount" }, { status: 400 })
    }

    // Calculate fees
    const wireFee = 45.0
    const totalAmount = amount + wireFee

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate confirmation number
    const confirmationNumber = `WF${Date.now().toString(36).toUpperCase()}`
    const referenceNumber = `WIRE-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`

    // Create wire transfer record
    const wireTransfer = {
      id: `wire_${Date.now()}`,
      confirmationNumber,
      referenceNumber,
      type: "international_wire",
      status: "processing",
      amount,
      currency: transferData.currency,
      fee: wireFee,
      totalAmount,
      fromAccount: transferData.fromAccount || "checking-6224",
      recipient: {
        name: transferData.recipientName,
        address: transferData.recipientAddress,
        phone: transferData.recipientPhone,
        email: transferData.recipientEmail,
      },
      bank: {
        name: transferData.bankName,
        swiftCode: transferData.swiftCode,
        iban: transferData.iban,
        address: transferData.bankAddress,
      },
      destination: {
        country: transferData.country,
        currency: transferData.currency,
      },
      purposeOfTransfer: transferData.purposeOfTransfer,
      intermediaryBank: transferData.intermediaryBank,
      correspondentBank: transferData.correspondentBank,
      submittedDate: new Date().toISOString(),
      expectedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
      processingTime: "1-5 business days",
      exchangeRate: getExchangeRate(transferData.currency),
      memo: transferData.memo,
    }

    return NextResponse.json({
      success: true,
      wireTransfer,
      message: "International wire transfer initiated successfully",
    })
  } catch (error) {
    console.error("Wire transfer error:", error)
    return NextResponse.json({ success: false, error: "Failed to process wire transfer" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const transferId = searchParams.get("transferId")

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  // Mock wire transfer history
  const wireTransfers = [
    {
      id: "wire_001",
      confirmationNumber: "WF2024ABC123",
      referenceNumber: "WIRE-2024-0001",
      type: "international_wire",
      status: "completed",
      amount: 5000.0,
      currency: "GBP",
      fee: 45.0,
      totalAmount: 5045.0,
      fromAccount: "checking-6224",
      recipient: {
        name: "John Smith",
        address: "123 London Street, London, UK",
        phone: "+44 20 1234 5678",
      },
      bank: {
        name: "Barclays Bank",
        swiftCode: "BARCGB22",
        iban: "GB29 NWBK 6016 1331 9268 19",
      },
      destination: {
        country: "United Kingdom",
        currency: "GBP",
      },
      purposeOfTransfer: "family-support",
      submittedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      completedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      exchangeRate: 0.79,
    },
    {
      id: "wire_002",
      confirmationNumber: "WF2024DEF456",
      referenceNumber: "WIRE-2024-0002",
      type: "international_wire",
      status: "processing",
      amount: 10000.0,
      currency: "EUR",
      fee: 45.0,
      totalAmount: 10045.0,
      fromAccount: "checking-6224",
      recipient: {
        name: "Marie Dubois",
        address: "45 Rue de Paris, Paris, France",
        phone: "+33 1 23 45 67 89",
      },
      bank: {
        name: "BNP Paribas",
        swiftCode: "BNPAFRPP",
        iban: "FR14 2004 1010 0505 0001 3M02 606",
      },
      destination: {
        country: "France",
        currency: "EUR",
      },
      purposeOfTransfer: "business",
      submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      expectedCompletion: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      exchangeRate: 0.92,
    },
  ]

  if (transferId) {
    const transfer = wireTransfers.find((t) => t.id === transferId)
    if (!transfer) {
      return NextResponse.json({ error: "Wire transfer not found" }, { status: 404 })
    }
    return NextResponse.json({ wireTransfer: transfer })
  }

  return NextResponse.json({
    wireTransfers,
    total_count: wireTransfers.length,
  })
}

function getExchangeRate(currency: string): number {
  const rates: Record<string, number> = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.5,
    CAD: 1.36,
    AUD: 1.52,
    CHF: 0.88,
    CNY: 7.24,
    INR: 83.12,
    MXN: 17.05,
  }
  return rates[currency] || 1.0
}
