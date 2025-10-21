import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const type = searchParams.get("type")

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  // Mock pending processes - in real app, fetch from database
  const pendingProcesses = [
    {
      id: "pending_001",
      type: "check_deposit",
      description: "Mobile Check Deposit",
      amount: 1250.0,
      status: "processing",
      submitted_date: new Date(Date.now() - 3600000).toISOString(),
      expected_completion: new Date(Date.now() + 86400000).toISOString(),
      reference_number: "CHK-2024-001",
      details: {
        check_number: "1234",
        bank_name: "First National Bank",
        account_holder: "ACME Corporation",
      },
    },
    {
      id: "pending_002",
      type: "wire_transfer",
      description: "International Wire Transfer",
      amount: 5000.0,
      status: "pending_approval",
      submitted_date: new Date(Date.now() - 7200000).toISOString(),
      expected_completion: new Date(Date.now() + 172800000).toISOString(),
      reference_number: "WIRE-2024-002",
      details: {
        recipient: "John Smith",
        destination_country: "United Kingdom",
        swift_code: "BARCGB22",
      },
    },
    {
      id: "pending_003",
      type: "account_verification",
      description: "External Account Verification",
      amount: 0.0,
      status: "awaiting_confirmation",
      submitted_date: new Date(Date.now() - 10800000).toISOString(),
      expected_completion: new Date(Date.now() + 259200000).toISOString(),
      reference_number: "VERIFY-2024-003",
      details: {
        bank_name: "Chase Bank",
        account_type: "Checking",
        verification_method: "Micro-deposits",
      },
    },
    {
      id: "pending_004",
      type: "loan_application",
      description: "Personal Loan Application",
      amount: 15000.0,
      status: "under_review",
      submitted_date: new Date(Date.now() - 14400000).toISOString(),
      expected_completion: new Date(Date.now() + 432000000).toISOString(),
      reference_number: "LOAN-2024-004",
      details: {
        loan_type: "Personal Loan",
        term: "36 months",
        purpose: "Home Improvement",
      },
    },
  ]

  const filteredProcesses = type ? pendingProcesses.filter((p) => p.type === type) : pendingProcesses

  return NextResponse.json({
    pending_processes: filteredProcesses,
    total_count: pendingProcesses.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const process = await request.json()

    console.log("[v0] Creating pending process:", process)

    // Mock process creation - in real app, save to database
    const createdProcess = {
      id: `pending_${Date.now()}`,
      ...process,
      status: "processing",
      submitted_date: new Date().toISOString(),
      expected_completion: new Date(Date.now() + 86400000).toISOString(),
      reference_number: `${process.type.toUpperCase()}-2024-${Math.floor(Math.random() * 1000)}`,
    }

    return NextResponse.json({
      success: true,
      process: createdProcess,
      message: "Process initiated successfully",
    })
  } catch (error) {
    console.error("Process creation error:", error)
    return NextResponse.json({ error: "Failed to create process" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { processId, action, status } = await request.json()

    console.log(`[v0] ${action} pending process:`, processId, status)

    // Mock process update - in real app, update database
    return NextResponse.json({
      success: true,
      message: `Process ${action} successfully`,
      new_status: status || "completed",
    })
  } catch (error) {
    console.error("Process update error:", error)
    return NextResponse.json({ error: "Failed to update process" }, { status: 500 })
  }
}
