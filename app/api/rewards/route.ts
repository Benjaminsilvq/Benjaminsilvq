import { type NextRequest, NextResponse } from "next/server"

export interface RewardsAccount {
  userId: string
  totalPoints: number
  tier: "Silver" | "Gold" | "Platinum"
  pointsToNextTier: number
  cashValue: number
  expiringPoints: {
    amount: number
    date: string
  } | null
  recentActivity: RewardTransaction[]
}

export interface RewardTransaction {
  id: string
  type: "earned" | "redeemed" | "bonus" | "expired"
  points: number
  description: string
  date: string
  category?: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  // Mock rewards data
  const rewardsAccount: RewardsAccount = {
    userId,
    totalPoints: 45280,
    tier: "Gold",
    pointsToNextTier: 4720,
    cashValue: 452.8,
    expiringPoints: {
      amount: 1500,
      date: "2025-03-31",
    },
    recentActivity: [
      {
        id: "reward_001",
        type: "bonus",
        points: 20000,
        description: "Welcome bonus - Active Cash Card",
        date: new Date(Date.now() - 86400000).toISOString(),
        category: "Sign-up Bonus",
      },
      {
        id: "reward_002",
        type: "earned",
        points: 156,
        description: "Purchase at Whole Foods Market",
        date: new Date(Date.now() - 172800000).toISOString(),
        category: "Groceries",
      },
      {
        id: "reward_003",
        type: "earned",
        points: 89,
        description: "Gas purchase at Shell",
        date: new Date(Date.now() - 259200000).toISOString(),
        category: "Gas",
      },
      {
        id: "reward_004",
        type: "redeemed",
        points: -10000,
        description: "Redeemed for statement credit",
        date: new Date(Date.now() - 604800000).toISOString(),
        category: "Redemption",
      },
      {
        id: "reward_005",
        type: "earned",
        points: 245,
        description: "Dining at The Cheesecake Factory",
        date: new Date(Date.now() - 691200000).toISOString(),
        category: "Dining",
      },
    ],
  }

  return NextResponse.json({ rewards: rewardsAccount })
}

export async function POST(request: NextRequest) {
  try {
    const { userId, action, points, redemptionType } = await request.json()

    if (action === "redeem") {
      // Simulate redemption
      await new Promise((resolve) => setTimeout(resolve, 1500))

      return NextResponse.json({
        success: true,
        message: `Successfully redeemed ${points} points`,
        transactionId: `redeem_${Date.now()}`,
        redemptionType,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Rewards error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
