import { type NextRequest, NextResponse } from "next/server"

export interface SavingsAccount {
  id: string
  name: string
  type: "savings" | "money-market" | "cd"
  apy: string
  minimumDeposit: number
  monthlyFee: number
  features: string[]
  benefits: string[]
}

const savingsAccounts: SavingsAccount[] = [
  {
    id: "way2save",
    name: "Way2Save® Savings Account",
    type: "savings",
    apy: "0.15%",
    minimumDeposit: 25,
    monthlyFee: 5,
    features: [
      "Automatic savings transfers",
      "Save As You Go® transfers",
      "$1 transfer from checking for each debit card purchase",
      "Fee waived with $300 minimum daily balance",
    ],
    benefits: [
      "Build savings automatically",
      "No minimum balance requirement",
      "FDIC insured",
      "Mobile and online banking",
    ],
  },
  {
    id: "platinum-savings",
    name: "Platinum Savings Account",
    type: "savings",
    apy: "0.25%",
    minimumDeposit: 25,
    monthlyFee: 12,
    features: [
      "Relationship interest rate",
      "Tiered interest rates",
      "Unlimited transfers and withdrawals",
      "Fee waived with $3,500 minimum daily balance",
    ],
    benefits: [
      "Higher interest rates with larger balances",
      "Relationship benefits",
      "FDIC insured",
      "Premier banking services",
    ],
  },
  {
    id: "money-market",
    name: "Wells Fargo Money Market Account",
    type: "money-market",
    apy: "0.35% - 0.50%",
    minimumDeposit: 2500,
    monthlyFee: 25,
    features: [
      "Tiered interest rates",
      "Check writing privileges",
      "Debit card access",
      "Fee waived with $25,000 minimum daily balance",
    ],
    benefits: ["Higher interest rates than savings", "Easy access to funds", "FDIC insured", "Relationship rewards"],
  },
  {
    id: "cd-special",
    name: "Special Fixed Rate CD",
    type: "cd",
    apy: "4.50% - 5.00%",
    minimumDeposit: 2500,
    monthlyFee: 0,
    features: [
      "Fixed interest rate",
      "Terms from 3 months to 5 years",
      "Automatic renewal",
      "Early withdrawal penalties apply",
    ],
    benefits: ["Guaranteed returns", "FDIC insured up to $250,000", "No monthly fees", "Competitive rates"],
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const accountId = searchParams.get("id")

  if (accountId) {
    const account = savingsAccounts.find((a) => a.id === accountId)
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }
    return NextResponse.json({ account })
  }

  const filteredAccounts = type ? savingsAccounts.filter((a) => a.type === type) : savingsAccounts

  return NextResponse.json({ accounts: filteredAccounts })
}

export async function POST(request: NextRequest) {
  try {
    const application = await request.json()

    console.log("[v0] Savings account application received:", application)

    const applicationId = `app_savings_${Date.now()}`

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json({
      success: true,
      applicationId,
      status: "approved",
      message: "Your savings account has been opened successfully!",
      accountNumber: `****${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`,
      routingNumber: "121000248",
    })
  } catch (error) {
    console.error("Savings account application error:", error)
    return NextResponse.json({ error: "Failed to process application" }, { status: 500 })
  }
}
