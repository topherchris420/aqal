import { NextResponse } from "next/server"
import { getAnalytics, clearAnalytics, errorTracker } from "@/lib/monitoring"

// Get analytics data (admin endpoint)
export async function GET() {
  try {
    const analytics = getAnalytics()
    const errorStats = errorTracker.getErrorStats()

    // Add server-side analytics if available
    const serverAnalytics = {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({
      ...analytics,
      server: serverAnalytics,
      errorStats,
    })
  } catch (error) {
    console.error("Failed to get analytics:", error)
    return NextResponse.json({ error: "Failed to retrieve analytics" }, { status: 500 })
  }
}

// Clear analytics data (admin endpoint)
export async function DELETE() {
  try {
    clearAnalytics()

    return NextResponse.json({
      success: true,
      message: "Analytics data cleared",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Failed to clear analytics:", error)
    return NextResponse.json({ error: "Failed to clear analytics" }, { status: 500 })
  }
}
