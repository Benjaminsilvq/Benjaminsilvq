import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const type = searchParams.get("type")

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  // Mock notifications - in real app, fetch from database
  const notifications = [
    {
      id: "notif_001",
      type: "credit",
      title: "Credit Alert",
      message: "$3,054.16 deposited to your Everyday Checking account",
      timestamp: new Date().toISOString(),
      read: false,
      priority: "medium",
      category: "Transaction Alert",
      amount: 3054.16,
      currency: "USD",
      account: "Everyday Checking ...6224",
      merchant: "ACME Corporation - Direct Deposit",
    },
    {
      id: "notif_002",
      type: "debit",
      title: "Debit Alert",
      message: "$127.45 withdrawn from your Everyday Checking account",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      read: false,
      priority: "medium",
      category: "Transaction Alert",
      amount: 127.45,
      currency: "USD",
      account: "Everyday Checking ...6224",
      merchant: "Whole Foods Market",
    },
    {
      id: "notif_003",
      type: "security",
      title: "Security Alert",
      message: "New login detected from iPhone 15 Pro",
      timestamp: new Date(Date.now() - 900000).toISOString(),
      read: false,
      priority: "high",
      category: "Account Security",
      actionRequired: true,
    },
    {
      id: "notif_004",
      type: "balance",
      title: "Low Balance Alert",
      message: "Your checking account balance is below $500",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      read: true,
      priority: "medium",
      category: "Account Management",
      amount: 450.0,
      currency: "USD",
    },
  ]

  const filteredNotifications = type ? notifications.filter((n) => n.type === type) : notifications

  return NextResponse.json({
    notifications: filteredNotifications,
    unread_count: notifications.filter((n) => !n.read).length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const notification = await request.json()

    console.log("[v0] Creating notification:", notification)

    // Mock notification creation - in real app, save to database
    const createdNotification = {
      id: `notif_${Date.now()}`,
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
    }

    return NextResponse.json({
      success: true,
      notification: createdNotification,
      message: "Notification created successfully",
    })
  } catch (error) {
    console.error("Notification creation error:", error)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { notificationId, action } = await request.json()

    console.log(`[v0] ${action} notification:`, notificationId)

    // Mock notification update - in real app, update database
    return NextResponse.json({
      success: true,
      message: `Notification ${action} successfully`,
    })
  } catch (error) {
    console.error("Notification update error:", error)
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
  }
}
