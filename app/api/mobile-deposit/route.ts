import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const amount = formData.get("amount") as string
    const checkFront = formData.get("checkFront") as File
    const checkBack = formData.get("checkBack") as File
    const accountId = formData.get("accountId") as string

    // Validate required fields
    if (!amount || !checkFront || !checkBack || !accountId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Simulate check processing with OCR
    const depositData = {
      id: `DEP${Date.now()}`,
      amount: Number.parseFloat(amount),
      accountId,
      status: "processing",
      submittedAt: new Date().toISOString(),
      expectedAvailability: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      confirmationNumber: `MD${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      checkImages: {
        front: `data:image/jpeg;base64,${Buffer.from(await checkFront.arrayBuffer()).toString("base64")}`,
        back: `data:image/jpeg;base64,${Buffer.from(await checkBack.arrayBuffer()).toString("base64")}`,
      },
      ocrResults: {
        routingNumber: "121000248",
        accountNumber: "****1234",
        checkNumber: "1001",
        payee: "John Doe",
        amount: Number.parseFloat(amount),
        confidence: 0.95,
      },
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return NextResponse.json({
      success: true,
      deposit: depositData,
      message: "Mobile deposit submitted successfully",
    })
  } catch (error) {
    console.error("Mobile deposit error:", error)
    return NextResponse.json({ error: "Failed to process mobile deposit" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const accountId = searchParams.get("accountId")

  if (!accountId) {
    return NextResponse.json({ error: "Account ID required" }, { status: 400 })
  }

  // Mock deposit history
  const deposits = [
    {
      id: "DEP1704123456",
      amount: 1250.0,
      status: "completed",
      submittedAt: "2024-01-15T10:30:00Z",
      availableAt: "2024-01-16T09:00:00Z",
      confirmationNumber: "MD7K9L2M4N",
    },
    {
      id: "DEP1704098765",
      amount: 875.5,
      status: "processing",
      submittedAt: "2024-01-14T14:20:00Z",
      expectedAvailability: "2024-01-15T09:00:00Z",
      confirmationNumber: "MD3X8Y1Z5Q",
    },
  ]

  return NextResponse.json({ deposits })
}
