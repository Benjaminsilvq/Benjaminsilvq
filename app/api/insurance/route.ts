import { type NextRequest, NextResponse } from "next/server"

export interface InsuranceProduct {
  id: string
  name: string
  type: "auto" | "home" | "life" | "renters" | "umbrella"
  description: string
  coverage: string
  startingPrice: string
  features: string[]
  benefits: string[]
}

const insuranceProducts: InsuranceProduct[] = [
  {
    id: "auto-insurance",
    name: "Auto Insurance",
    type: "auto",
    description: "Comprehensive coverage for your vehicle",
    coverage: "Liability, Collision, Comprehensive",
    startingPrice: "$75/month",
    features: [
      "Liability coverage",
      "Collision coverage",
      "Comprehensive coverage",
      "Uninsured motorist protection",
      "Roadside assistance",
    ],
    benefits: [
      "24/7 claims support",
      "Accident forgiveness",
      "Multi-policy discounts",
      "Safe driver discounts",
      "Easy mobile claims",
    ],
  },
  {
    id: "home-insurance",
    name: "Homeowners Insurance",
    type: "home",
    description: "Protect your home and belongings",
    coverage: "Dwelling, Personal Property, Liability",
    startingPrice: "$125/month",
    features: [
      "Dwelling coverage",
      "Personal property protection",
      "Liability coverage",
      "Additional living expenses",
      "Natural disaster coverage",
    ],
    benefits: [
      "Replacement cost coverage",
      "Bundle and save with auto",
      "Claims-free discounts",
      "Home security discounts",
      "24/7 customer service",
    ],
  },
  {
    id: "life-insurance",
    name: "Term Life Insurance",
    type: "life",
    description: "Financial protection for your loved ones",
    coverage: "Death Benefit",
    startingPrice: "$25/month",
    features: [
      "Flexible coverage amounts",
      "Terms from 10-30 years",
      "Level premiums",
      "Conversion options",
      "No medical exam options available",
    ],
    benefits: [
      "Affordable protection",
      "Tax-free death benefit",
      "Online application",
      "Fast approval",
      "Living benefits available",
    ],
  },
  {
    id: "renters-insurance",
    name: "Renters Insurance",
    type: "renters",
    description: "Coverage for your personal belongings",
    coverage: "Personal Property, Liability",
    startingPrice: "$15/month",
    features: [
      "Personal property coverage",
      "Liability protection",
      "Additional living expenses",
      "Medical payments to others",
      "Identity theft protection",
    ],
    benefits: [
      "Affordable coverage",
      "Replacement cost option",
      "Bundle discounts",
      "Easy claims process",
      "Worldwide coverage",
    ],
  },
  {
    id: "umbrella-insurance",
    name: "Umbrella Insurance",
    type: "umbrella",
    description: "Extra liability protection beyond your other policies",
    coverage: "Excess Liability",
    startingPrice: "$20/month",
    features: [
      "Coverage from $1M to $5M",
      "Covers multiple properties and vehicles",
      "Legal defense costs",
      "Worldwide coverage",
      "Protects assets and future income",
    ],
    benefits: [
      "Affordable extra protection",
      "Peace of mind",
      "Covers gaps in other policies",
      "Protects your savings",
      "Bundle discounts available",
    ],
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const productId = searchParams.get("id")

  if (productId) {
    const product = insuranceProducts.find((p) => p.id === productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json({ product })
  }

  const filteredProducts = type ? insuranceProducts.filter((p) => p.type === type) : insuranceProducts

  return NextResponse.json({ products: filteredProducts })
}

export async function POST(request: NextRequest) {
  try {
    const quote = await request.json()

    console.log("[v0] Insurance quote request received:", quote)

    const quoteId = `quote_${Date.now()}`

    // Simulate quote generation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const monthlyPremium = Math.floor(Math.random() * 150) + 50

    return NextResponse.json({
      success: true,
      quoteId,
      monthlyPremium,
      annualPremium: monthlyPremium * 12,
      coverageAmount: quote.coverageAmount || 100000,
      message: "Your insurance quote is ready!",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
  } catch (error) {
    console.error("Insurance quote error:", error)
    return NextResponse.json({ error: "Failed to generate quote" }, { status: 500 })
  }
}
