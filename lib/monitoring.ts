// Built-in error tracking without external dependencies
class InternalErrorTracker {
  private errors: Array<{
    id: string
    timestamp: string
    error: Error
    context?: Record<string, any>
    environment: string
  }> = []

  private maxErrors = 1000 // Keep last 1000 errors in memory

  captureException(error: Error, context?: Record<string, any>) {
    const errorEntry = {
      id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } as Error,
      context: {
        ...context,
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "server",
        url: typeof window !== "undefined" ? window.location.href : context?.url,
      },
      environment: process.env.NODE_ENV || "development",
    }

    this.errors.push(errorEntry)

    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors)
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error Captured:", errorEntry)
    }

    return errorEntry.id
  }

  getErrors(limit = 50) {
    return this.errors.slice(-limit).reverse()
  }

  getErrorById(id: string) {
    return this.errors.find((error) => error.id === id)
  }

  clearErrors() {
    this.errors = []
  }

  getErrorStats() {
    const now = Date.now()
    const oneHourAgo = now - 60 * 60 * 1000
    const oneDayAgo = now - 24 * 60 * 60 * 1000

    const recentErrors = this.errors.filter((error) => new Date(error.timestamp).getTime() > oneHourAgo)

    const dailyErrors = this.errors.filter((error) => new Date(error.timestamp).getTime() > oneDayAgo)

    return {
      total: this.errors.length,
      lastHour: recentErrors.length,
      lastDay: dailyErrors.length,
      errorRate: recentErrors.length / 60, // errors per minute
    }
  }
}

// Create singleton instance
const errorTracker = new InternalErrorTracker()

// Analytics tracking with built-in fallbacks
export const trackPageView = (page: string, userId?: string) => {
  const event = {
    type: "page_view",
    page,
    userId,
    timestamp: new Date().toISOString(),
    sessionId:
      typeof window !== "undefined"
        ? sessionStorage.getItem("sessionId") || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        : undefined,
  }

  // Store session ID for tracking
  if (typeof window !== "undefined" && !sessionStorage.getItem("sessionId")) {
    sessionStorage.setItem("sessionId", event.sessionId!)
  }

  // Use Vercel Analytics if available, otherwise use internal tracking
  if (typeof window !== "undefined" && (window as any).va) {
    ;(window as any).va("track", "page_view", {
      page,
      userId,
    })
  } else {
    // Internal analytics tracking
    console.info("Analytics Event:", event)

    // Store in localStorage for basic analytics (development/fallback)
    if (typeof window !== "undefined") {
      const analytics = JSON.parse(localStorage.getItem("internal_analytics") || "[]")
      analytics.push(event)

      // Keep only last 1000 events
      if (analytics.length > 1000) {
        analytics.splice(0, analytics.length - 1000)
      }

      localStorage.setItem("internal_analytics", JSON.stringify(analytics))
    }
  }
}

// Error tracking with intelligent fallbacks
export const trackError = (error: Error, context?: Record<string, any>) => {
  console.error("Application Error:", error)

  // Use internal error tracker
  const errorId = errorTracker.captureException(error, context)

  // Also log using our structured logger
  import("./logger").then(({ logError }) => {
    logError(error, { ...context, errorId })
  })

  return errorId
}

// Custom metrics tracking
export const trackUserAction = (action: string, properties?: Record<string, any>) => {
  const event = {
    type: "user_action",
    action,
    properties,
    timestamp: new Date().toISOString(),
    sessionId: typeof window !== "undefined" ? sessionStorage.getItem("sessionId") : undefined,
  }

  // Use Vercel Analytics if available
  if (typeof window !== "undefined" && (window as any).va) {
    ;(window as any).va("track", action, properties)
  } else {
    console.info("User Action:", event)

    // Internal tracking
    if (typeof window !== "undefined") {
      const analytics = JSON.parse(localStorage.getItem("internal_analytics") || "[]")
      analytics.push(event)
      localStorage.setItem("internal_analytics", JSON.stringify(analytics.slice(-1000)))
    }
  }
}

// Performance metrics with automatic categorization
export const trackPerformance = (metric: string, value: number, unit = "ms") => {
  const performanceEvent = {
    type: "performance",
    metric,
    value,
    unit,
    timestamp: new Date().toISOString(),
    category: value < 100 ? "excellent" : value < 500 ? "good" : value < 1000 ? "acceptable" : "poor",
  }

  // Log performance metrics
  import("./logger").then(({ logPerformance }) => {
    logPerformance(metric, value, { unit, category: performanceEvent.category })
  })

  // Track in analytics
  if (typeof window !== "undefined") {
    const analytics = JSON.parse(localStorage.getItem("internal_analytics") || "[]")
    analytics.push(performanceEvent)
    localStorage.setItem("internal_analytics", JSON.stringify(analytics.slice(-1000)))
  }
}

// Business metrics tracking
export const trackBusinessMetric = (event: string, value?: number, metadata?: Record<string, any>) => {
  const businessEvent = {
    type: "business_metric",
    event,
    value,
    metadata,
    timestamp: new Date().toISOString(),
  }

  import("./logger").then(({ logBusinessEvent }) => {
    logBusinessEvent(event, { value, ...metadata })
  })

  console.info("Business Metric:", businessEvent)
}

// Health check utilities with enhanced error handling
export const createHealthCheck = (name: string, checkFn: () => Promise<boolean>) => {
  return async () => {
    try {
      const startTime = Date.now()
      const result = await Promise.race([
        checkFn(),
        new Promise<boolean>((_, reject) => setTimeout(() => reject(new Error("Health check timeout")), 5000)),
      ])
      const duration = Date.now() - startTime

      trackPerformance(`health_check_${name}`, duration)

      return {
        name,
        status: result ? "healthy" : "unhealthy",
        duration,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      const errorId = trackError(error as Error, { healthCheck: name })
      return {
        name,
        status: "error",
        error: (error as Error).message,
        errorId,
        timestamp: new Date().toISOString(),
      }
    }
  }
}

// Get internal analytics data (for admin dashboard)
export const getAnalytics = () => {
  if (typeof window === "undefined") return { events: [], errors: [] }

  const events = JSON.parse(localStorage.getItem("internal_analytics") || "[]")
  const errors = errorTracker.getErrors()
  const errorStats = errorTracker.getErrorStats()

  return {
    events: events.slice(-100), // Last 100 events
    errors: errors.slice(0, 50), // Last 50 errors
    errorStats,
    summary: {
      totalEvents: events.length,
      totalErrors: errors.length,
      sessionId: sessionStorage.getItem("sessionId"),
    },
  }
}

// Clear analytics data
export const clearAnalytics = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("internal_analytics")
    sessionStorage.removeItem("sessionId")
    errorTracker.clearErrors()
  }
}

// Export error tracker for admin access
export { errorTracker }
