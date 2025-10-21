import { type NextRequest, NextResponse } from "next/server"

export interface CreditCard {
  id: string
  name: string
  type: "cash-back" | "travel" | "balance-transfer" | "business" | "student"
  annualFee: number
  apr: string
  introApr?: string
  introAprPeriod?: number
  rewards: {
    type: string
    rate: string
    bonus?: string
  }
  benefits: string[]
  creditScoreRequired: string
  image: string
}

const creditCards: CreditCard[] = [
  {
    id: "active-cash",
    name: "Wells Fargo Active Cash® Card",
    type: "cash-back",
    annualFee: 0,
    apr: "20.24% - 29.99%",
    introApr: "0%",
    introAprPeriod: 15,
    rewards: {
      type: "Unlimited 2% cash rewards",
      rate: "2%",
      bonus: "$200 cash rewards bonus after spending $500 in first 3 months",
    },
    benefits: [
      "Unlimited 2% cash rewards on purchases",
      "$200 cash rewards bonus",
      "0% intro APR for 15 months",
      "Cell phone protection",
      "No annual fee",
    ],
    creditScoreRequired: "Good to Excellent (670+)",
    image: "/wells-fargo-active-cash-credit-card-red-design.jpg",
  },
  {
    id: "autograph",
    name: "Wells Fargo Autograph℠ Card",
    type: "travel",
    annualFee: 0,
    apr: "20.24% - 29.99%",
    introApr: "0%",
    introAprPeriod: 12,
    rewards: {
      type: "3X points on travel, dining, gas, transit, streaming",
      rate: "3X",
      bonus: "20,000 bonus points after spending $1,000 in first 3 months",
    },
    benefits: [
      "3X points on travel, dining, gas, transit, streaming",
      "1X points on other purchases",
      "20,000 bonus points ($200 value)",
      "No foreign transaction fees",
      "Cell phone protection",
    ],
    creditScoreRequired: "Good to Excellent (670+)",
    image: "/wells-fargo-autograph-credit-card-modern-design.jpg",
  },
  {
    id: "reflect",
    name: "Wells Fargo Reflect® Card",
    type: "balance-transfer",
    annualFee: 0,
    apr: "18.24% - 29.99%",
    introApr: "0%",
    introAprPeriod: 21,
    rewards: {
      type: "No rewards program",
      rate: "0%",
    },
    benefits: [
      "0% intro APR for 21 months on purchases and balance transfers",
      "No annual fee",
      "Cell phone protection",
      "My Wells Fargo Deals℠",
    ],
    creditScoreRequired: "Good to Excellent (670+)",
    image: "/wells-fargo-reflect-credit-card-blue-design.jpg",
  },
  {
    id: "business-platinum",
    name: "Wells Fargo Business Platinum Credit Card",
    type: "business",
    annualFee: 0,
    apr: "18.24% - 26.99%",
    introApr: "0%",
    introAprPeriod: 9,
    rewards: {
      type: "No rewards program",
      rate: "0%",
    },
    benefits: [
      "0% intro APR for 9 months on purchases",
      "No annual fee",
      "Employee cards at no additional cost",
      "Expense management tools",
    ],
    creditScoreRequired: "Good to Excellent (670+)",
    image: "/wells-fargo-business-platinum-credit-card.jpg",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const cardId = searchParams.get("id")

  // Get specific card
  if (cardId) {
    const card = creditCards.find((c) => c.id === cardId)
    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }
    return NextResponse.json({ card })
  }

  // Filter by type
  const filteredCards = type ? creditCards.filter((c) => c.type === type) : creditCards

  return NextResponse.json({ cards: filteredCards })
}

export async function POST(request: NextRequest) {
  try {
    const application = await request.json()

    console.log("[v0] Credit card application received:", application)

    // Mock application processing
    const applicationId = `app_cc_${Date.now()}`

    // Simulate credit check and approval process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const approved = Math.random() > 0.3 // 70% approval rate

    return NextResponse.json({
      success: true,
      applicationId,
      status: approved ? "approved" : "pending",
      message: approved
        ? "Congratulations! Your application has been approved."
        : "Your application is under review. We'll notify you within 7-10 business days.",
      estimatedCreditLimit: approved ? Math.floor(Math.random() * 15000) + 5000 : null,
    })
  } catch (error) {
    console.error("Credit card application error:", error)
    return NextResponse.json({ error: "Failed to process application" }, { status: 500 })
  }
}
