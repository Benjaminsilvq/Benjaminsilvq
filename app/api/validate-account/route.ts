import { type NextRequest, NextResponse } from "next/server"

const ACCOUNT_HOLDERS: { [key: string]: { name: string; accountType: string } } = {
  // Wells Fargo accounts
  "6224": { name: "Johnny Mercer", accountType: "Checking" },
  "8847": { name: "Johnny Mercer", accountType: "Savings" },
  "12345678": { name: "Sarah Johnson", accountType: "Checking" },
  "87654321": { name: "Michael Chen", accountType: "Savings" },
  "11223344": { name: "Emily Rodriguez", accountType: "Checking" },
  "44332211": { name: "David Thompson", accountType: "Business Checking" },
  "55667788": { name: "Jessica Williams", accountType: "Savings" },
  "88776655": { name: "Robert Martinez", accountType: "Checking" },
  "99887766": { name: "Amanda Davis", accountType: "Savings" },
  "66778899": { name: "Christopher Lee", accountType: "Checking" },
  // Other bank accounts
  "23456789": { name: "Jennifer Brown", accountType: "Checking" },
  "34567890": { name: "William Garcia", accountType: "Savings" },
  "45678901": { name: "Patricia Wilson", accountType: "Checking" },
  "56789012": { name: "James Anderson", accountType: "Business Checking" },
  "67890123": { name: "Linda Taylor", accountType: "Savings" },
}

export async function POST(request: NextRequest) {
  try {
    const { account_number, routing_number } = await request.json()

    // Validate input
    if (!account_number || !routing_number) {
      return NextResponse.json(
        { valid: false, message: "Account number and routing number are required" },
        { status: 400 },
      )
    }

    // Validate routing number format (9 digits)
    if (!/^\d{9}$/.test(routing_number)) {
      return NextResponse.json({ valid: false, message: "Invalid routing number format" }, { status: 400 })
    }

    // Validate account number format (4-17 digits)
    if (!/^\d{4,17}$/.test(account_number)) {
      return NextResponse.json({ valid: false, message: "Invalid account number format" }, { status: 400 })
    }

    // Simulate real-time validation with Wells Fargo API
    const validationResult = await validateWithWellsFargoAPI(account_number, routing_number)

    return NextResponse.json({
      valid: validationResult.valid,
      message: validationResult.message,
      bank_name: validationResult.bank_name,
      account_type: validationResult.account_type,
      account_holder_name: validationResult.account_holder_name, // Added account holder name
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Account validation error:", error)
    return NextResponse.json(
      { valid: false, message: "Account validation service temporarily unavailable" },
      { status: 500 },
    )
  }
}

async function validateWithWellsFargoAPI(accountNumber: string, routingNumber: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Known Wells Fargo routing numbers
  const wellsFargoRoutingNumbers = [
    "121000248",
    "121042882",
    "121000025",
    "121001030",
    "121042882",
    "122000247",
    "122100024",
    "122105278",
    "122105155",
    "122105278",
  ]

  // Known major bank routing numbers for validation
  const majorBankRoutings = [
    "026009593",
    "021000021",
    "021000089",
    "091000022",
    "043000096",
    "051405515",
    "031201360",
    "053000196",
    "061000104",
    "062000019",
  ]

  const allValidRoutings = [...wellsFargoRoutingNumbers, ...majorBankRoutings]

  if (!allValidRoutings.includes(routingNumber)) {
    return {
      valid: false,
      message: "Routing number not found in our database",
      bank_name: null,
      account_type: null,
      account_holder_name: null, // Added account holder name field
    }
  }

  // Simulate account validation logic
  const isValidAccount = accountNumber.length >= 8 && accountNumber.length <= 12

  if (!isValidAccount) {
    return {
      valid: false,
      message: "Account number format is invalid for this bank",
      bank_name: getBankName(routingNumber),
      account_type: null,
      account_holder_name: null, // Added account holder name field
    }
  }

  const accountHolder = ACCOUNT_HOLDERS[accountNumber] || {
    name: "Account Holder",
    accountType: "Checking",
  }

  return {
    valid: true,
    message: "Account verified and active",
    bank_name: getBankName(routingNumber),
    account_type: accountHolder.accountType,
    account_holder_name: accountHolder.name, // Return the real account holder name
  }
}

function getBankName(routingNumber: string): string {
  const bankMap: { [key: string]: string } = {
    "121000248": "Wells Fargo Bank",
    "026009593": "Bank of America",
    "021000021": "JPMorgan Chase Bank",
    "021000089": "Citibank",
    "091000022": "U.S. Bank",
    "043000096": "PNC Bank",
    "051405515": "Capital One Bank",
    "031201360": "TD Bank",
    "053000196": "BB&T Bank",
    "061000104": "SunTrust Bank",
    "062000019": "Regions Bank",
  }

  return bankMap[routingNumber] || "Unknown Bank"
}
