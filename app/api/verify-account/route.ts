import { type NextRequest, NextResponse } from "next/server"

const ACCOUNT_HOLDERS: { [key: string]: { name: string; accountType: string } } = {
  "6224": { name: "Johnny Mercer", accountType: "checking" },
  "8847": { name: "Johnny Mercer", accountType: "savings" },
  "12345678": { name: "Sarah Johnson", accountType: "checking" },
  "87654321": { name: "Michael Chen", accountType: "savings" },
  "11223344": { name: "Emily Rodriguez", accountType: "checking" },
  "44332211": { name: "David Thompson", accountType: "business checking" },
  "55667788": { name: "Jessica Williams", accountType: "savings" },
  "88776655": { name: "Robert Martinez", accountType: "checking" },
  "99887766": { name: "Amanda Davis", accountType: "savings" },
  "66778899": { name: "Christopher Lee", accountType: "checking" },
}

export async function POST(request: NextRequest) {
  try {
    const { account_number, routing_number } = await request.json()

    // Simulate Wells Fargo account verification
    const wellsFargoRoutingNumbers = [
      "121000248", // Wells Fargo Bank
      "121042882", // Wells Fargo Bank West
      "121100782", // Wells Fargo Bank Southwest
      "111900659", // Wells Fargo Bank Texas
      "091000019", // Wells Fargo Bank Minnesota
    ]

    // Basic validation
    if (!account_number || !routing_number) {
      return NextResponse.json(
        {
          verified: false,
          error: "Account number and routing number are required",
        },
        { status: 400 },
      )
    }

    // Check if routing number is valid Wells Fargo routing number
    const isValidWellsFargo = wellsFargoRoutingNumbers.includes(routing_number)

    // Simulate account verification process
    const isValidAccountFormat = /^\d{4,17}$/.test(account_number)

    const accountHolder = ACCOUNT_HOLDERS[account_number] || {
      name: "Account Holder",
      accountType: "checking",
    }

    if (isValidWellsFargo && isValidAccountFormat) {
      return NextResponse.json({
        verified: true,
        account_status: "active",
        account_type: accountHolder.accountType,
        account_holder_name: accountHolder.name, // Added account holder name
        bank_name: "Wells Fargo Bank",
        verification_timestamp: new Date().toISOString(),
        online_banking_enabled: true,
        mobile_deposit_enabled: true,
        wire_transfer_enabled: true,
        international_services: true,
      })
    } else {
      return NextResponse.json(
        {
          verified: false,
          error: isValidWellsFargo ? "Invalid account number format" : "Invalid Wells Fargo routing number",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Account verification error:", error)
    return NextResponse.json(
      {
        verified: false,
        error: "Account verification service temporarily unavailable",
      },
      { status: 500 },
    )
  }
}
