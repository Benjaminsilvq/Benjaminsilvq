import { type NextRequest, NextResponse } from "next/server"

export interface CreditScore {
  score: number
  provider: "FICO" | "VantageScore"
  date: string
  change: number
  factors: {
    category: string
    impact: "positive" | "negative" | "neutral"
    description: string
  }[]
  history: {
    date: string
    score: number
  }[]
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  // Mock credit score data
  const currentScore = 702
  const previousScore = 692

  const creditScore: CreditScore = {
    score: currentScore,
    provider: "FICO",
    date: new Date().toISOString(),
    change: currentScore - previousScore,
    factors: [
      {
        category: "Payment History",
        impact: "positive",
        description: "You have a strong history of on-time payments",
      },
      {
        category: "Credit Utilization",
        impact: "positive",
        description: "Your credit utilization is 18% - keep it below 30%",
      },
      {
        category: "Credit Age",
        impact: "neutral",
        description: "Average age of accounts: 5 years 3 months",
      },
      {
        category: "Credit Mix",
        impact: "positive",
        description: "Good mix of credit cards and installment loans",
      },
      {
        category: "Recent Inquiries",
        impact: "neutral",
        description: "2 hard inquiries in the past 12 months",
      },
    ],
    history: [
      { date: "2025-01-01", score: 702 },
      { date: "2024-12-01", score: 692 },
      { date: "2024-11-01", score: 688 },
      { date: "2024-10-01", score: 695 },
      { date: "2024-09-01", score: 690 },
      { date: "2024-08-01", score: 685 },
    ],
  }

  return NextResponse.json({ creditScore })
}

export async function POST(request: NextRequest) {
  try {
    const { userId, action } = await request.json()

    if (action === "refresh") {
      // Simulate credit score refresh
      await new Promise((resolve) => setTimeout(resolve, 2000))

      return NextResponse.json({
        success: true,
        message: "Credit score updated successfully",
        lastUpdated: new Date().toISOString(),
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Credit score error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
