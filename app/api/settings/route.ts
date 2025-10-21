import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  const settings = {
    personal: {
      fullName: "", // Will be populated from auth context
      email: "", // Will be populated from auth context
      phone: "", // Will be populated from auth context
      address: "123 Main St, Anytown, ST 12345",
      dateOfBirth: "1985-06-15",
      ssn: "***-**-1234",
    },
    notifications: {
      transactionAlerts: true,
      lowBalanceAlerts: true,
      securityAlerts: true,
      marketingEmails: false,
      smsNotifications: true,
      pushNotifications: true,
      emailStatements: true,
      creditAlerts: true,
      debitAlerts: true,
      depositAlerts: true,
      withdrawalAlerts: true,
    },
    security: {
      twoFactorAuth: true,
      biometricLogin: false,
      sessionTimeout: 15,
      loginNotifications: true,
      deviceTrust: true,
      autoLock: true,
    },
    privacy: {
      dataSharing: false,
      marketingOptIn: false,
      analyticsOptIn: true,
      locationTracking: false,
      cookiePreferences: "essential",
      profileVisibility: "private",
      transactionHistory: "private",
    },
  }

  return NextResponse.json({ settings })
}

export async function PUT(request: NextRequest) {
  try {
    const { section, data } = await request.json()

    console.log(`[v0] Updating ${section} settings:`, data)

    // Mock update - in real app, update database
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: `${section} settings updated successfully`,
      updatedAt: new Date().toISOString(),
      section,
      data,
    })
  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
