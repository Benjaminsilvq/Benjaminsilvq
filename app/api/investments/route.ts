import { type NextRequest, NextResponse } from "next/server"

export interface InvestmentProduct {
  id: string
  name: string
  type: "brokerage" | "ira" | "401k" | "managed" | "robo"
  description: string
  minimumInvestment: number
  fees: string
  features: string[]
  riskLevel: "Low" | "Medium" | "High"
  expectedReturn: string
}

const investments: InvestmentProduct[] = [
  {
    id: "intuitive-investor",
    name: "Wells Fargo Intuitive Investor®",
    type: "robo",
    description: "Automated investing with professional portfolio management",
    minimumInvestment: 500,
    fees: "0.35% - 0.50% annual advisory fee",
    features: [
      "Automated portfolio management",
      "Tax-loss harvesting",
      "Automatic rebalancing",
      "Diversified ETF portfolios",
      "Financial planning tools",
    ],
    riskLevel: "Medium",
    expectedReturn: "5% - 8% annually",
  },
  {
    id: "self-directed",
    name: "WellsTrade® Self-Directed Investing",
    type: "brokerage",
    description: "Trade stocks, ETFs, options, and more on your own",
    minimumInvestment: 0,
    fees: "$0 online equity trades",
    features: [
      "Commission-free online stock and ETF trades",
      "Advanced trading tools",
      "Real-time quotes and research",
      "Mobile trading app",
      "Options and mutual funds available",
    ],
    riskLevel: "High",
    expectedReturn: "Varies by investment",
  },
  {
    id: "traditional-ira",
    name: "Traditional IRA",
    type: "ira",
    description: "Tax-deferred retirement savings",
    minimumInvestment: 0,
    fees: "Varies by investment",
    features: [
      "Tax-deductible contributions",
      "Tax-deferred growth",
      "Wide range of investment options",
      "Contribution limit: $7,000/year (2025)",
      "Catch-up contributions for 50+",
    ],
    riskLevel: "Medium",
    expectedReturn: "6% - 9% annually",
  },
  {
    id: "roth-ira",
    name: "Roth IRA",
    type: "ira",
    description: "Tax-free retirement growth",
    minimumInvestment: 0,
    fees: "Varies by investment",
    features: [
      "Tax-free withdrawals in retirement",
      "No required minimum distributions",
      "Flexible investment options",
      "Contribution limit: $7,000/year (2025)",
      "Income limits apply",
    ],
    riskLevel: "Medium",
    expectedReturn: "6% - 9% annually",
  },
  {
    id: "wealth-management",
    name: "Wells Fargo Advisors",
    type: "managed",
    description: "Personalized wealth management with a dedicated advisor",
    minimumInvestment: 250000,
    fees: "1.00% - 1.50% of assets under management",
    features: [
      "Dedicated financial advisor",
      "Customized investment strategy",
      "Comprehensive financial planning",
      "Estate and tax planning",
      "Exclusive investment opportunities",
    ],
    riskLevel: "Medium",
    expectedReturn: "7% - 10% annually",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const productId = searchParams.get("id")

  if (productId) {
    const product = investments.find((p) => p.id === productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json({ product })
  }

  const filteredProducts = type ? investments.filter((p) => p.type === type) : investments

  return NextResponse.json({ products: filteredProducts })
}

export async function POST(request: NextRequest) {
  try {
    const application = await request.json()

    console.log("[v0] Investment account application received:", application)

    const applicationId = `app_invest_${Date.now()}`

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return NextResponse.json({
      success: true,
      applicationId,
      status: "approved",
      message: "Your investment account application has been approved!",
      accountNumber: `****${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`,
      nextSteps: [
        "Fund your account",
        "Complete your investor profile",
        "Review recommended portfolio",
        "Start investing",
      ],
    })
  } catch (error) {
    console.error("Investment application error:", error)
    return NextResponse.json({ error: "Failed to process application" }, { status: 500 })
  }
}
