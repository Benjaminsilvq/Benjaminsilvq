import { type NextRequest, NextResponse } from "next/server"
import { findNearbyATMsBranches } from "@/lib/atm-branch-data"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = Number.parseFloat(searchParams.get("lat") || "0")
  const lng = Number.parseFloat(searchParams.get("lng") || "0")
  const radius = Number.parseInt(searchParams.get("radius") || "25")
  const type = searchParams.get("type") // 'atm', 'branch', or null for both

  if (!lat || !lng) {
    return NextResponse.json({ error: "Latitude and longitude required" }, { status: 400 })
  }

  try {
    let locations = findNearbyATMsBranches(lat, lng, radius)

    if (type) {
      locations = locations.filter((location) => location.type === type)
    }

    return NextResponse.json({
      success: true,
      locations,
      userLocation: { lat, lng },
      searchRadius: radius,
    })
  } catch (error) {
    console.error("ATM locator error:", error)
    return NextResponse.json({ error: "Failed to find locations" }, { status: 500 })
  }
}
