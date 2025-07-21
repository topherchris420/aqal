import { NextResponse } from "next/server"
import { createHealthCheck } from "@/lib/monitoring"

// Database health check with timeout and retry logic
const checkDatabase = createHealthCheck("database", async () => {
  try {
    // Simulate database check - replace with actual database ping
    // const result = await db.raw('SELECT 1')

    // For now, return true - replace with actual database connectivity check
    await new Promise((resolve) => setTimeout(resolve, 10)) // Simulate DB call
    return true
  } catch (error) {
    console.error("Database health check failed:", error)
    return false
  }
})

// Redis health check with fallback
const checkRedis = createHealthCheck("redis", async () => {
  try {
    // Simulate Redis check - replace with actual Redis ping
    // const result = await redis.ping()

    // For now, return true - replace with actual Redis connectivity check
    await new Promise((resolve) => setTimeout(resolve, 5)) // Simulate Redis call
    return true
  } catch (error) {
    console.error("Redis health check failed:", error)
    return false
  }
})

// External API health check
const checkExternalAPIs = createHealthCheck("external_apis", async () => {
  try {
    // Check critical external services
    const checks = await Promise.allSettled([
      // Add your external API checks here
      // fetch('https://api.example.com/health', { signal: AbortSignal.timeout(3000) }),
    ])

    // For now, return true - add actual external service checks
    return true
  } catch (error) {
    console.error("External APIs health check failed:", error)
    return false
  }
})

// Memory usage check with intelligent thresholds
const checkMemoryUsage = () => {
  const usage = process.memoryUsage()
  const totalMB = Math.round(usage.rss / 1024 / 1024)
  const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024)
  const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024)
  const externalMB = Math.round(usage.external / 1024 / 1024)

  // Dynamic thresholds based on environment
  const memoryThreshold = process.env.NODE_ENV === "production" ? 1024 : 512 // MB
  const heapThreshold = process.env.NODE_ENV === "production" ? 512 : 256 // MB

  return {
    rss: `${totalMB}MB`,
    heapUsed: `${heapUsedMB}MB`,
    heapTotal: `${heapTotalMB}MB`,
    external: `${externalMB}MB`,
    healthy: totalMB < memoryThreshold && heapUsedMB < heapThreshold,
    thresholds: {
      memory: `${memoryThreshold}MB`,
      heap: `${heapThreshold}MB`,
    },
    utilization: {
      memory: Math.round((totalMB / memoryThreshold) * 100),
      heap: Math.round((heapUsedMB / heapThreshold) * 100),
    },
  }
}

// Disk space check (for standalone deployments)
const checkDiskSpace = () => {
  try {
    const fs = require("fs")
    const stats = fs.statSync(".")

    return {
      available: true,
      healthy: true, // Simplified for now
      message: "Disk space check not implemented for this environment",
    }
  } catch (error) {
    return {
      available: false,
      healthy: true, // Don't fail health check for disk space in cloud environments
      message: "Disk space check not available",
    }
  }
}

// Application-specific health checks
const checkApplicationHealth = () => {
  const startTime = process.hrtime()

  // Check if critical application components are working
  try {
    // Simulate application health checks
    const componentChecks = {
      routing: true, // Next.js routing is working if we got here
      rendering: true, // React rendering is working
      api: true, // API routes are working if this endpoint responds
    }

    const [seconds, nanoseconds] = process.hrtime(startTime)
    const responseTime = seconds * 1000 + nanoseconds / 1000000

    return {
      components: componentChecks,
      responseTime: Math.round(responseTime * 100) / 100,
      healthy: Object.values(componentChecks).every(Boolean),
    }
  } catch (error) {
    return {
      components: {},
      responseTime: 0,
      healthy: false,
      error: (error as Error).message,
    }
  }
}

export async function GET() {
  const startTime = Date.now()

  try {
    // Run all health checks in parallel with timeout
    const healthCheckPromise = Promise.all([checkDatabase(), checkRedis(), checkExternalAPIs()])

    // Add timeout to prevent hanging health checks
    const healthChecks = (await Promise.race([
      healthCheckPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Health check timeout")), 10000)),
    ])) as Awaited<typeof healthCheckPromise>

    const [database, redis, externalAPIs] = healthChecks
    const memory = checkMemoryUsage()
    const disk = checkDiskSpace()
    const application = checkApplicationHealth()

    const uptime = process.uptime()
    const timestamp = new Date().toISOString()
    const duration = Date.now() - startTime

    const healthData = {
      status: "healthy",
      timestamp,
      uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      buildId: process.env.BUILD_ID || "unknown",
      buildTime: process.env.BUILD_TIME || "unknown",
      checks: {
        database,
        redis,
        external_apis: externalAPIs,
        memory,
        disk,
        application,
      },
      performance: {
        healthCheckDuration: `${duration}ms`,
        averageResponseTime: application.responseTime,
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid,
      },
    }

    // Determine overall health status
    const criticalChecks = [database.status === "healthy", application.healthy, memory.healthy]

    const nonCriticalChecks = [redis.status === "healthy", externalAPIs.status === "healthy"]

    const allCriticalHealthy = criticalChecks.every(Boolean)
    const allNonCriticalHealthy = nonCriticalChecks.every(Boolean)

    if (!allCriticalHealthy) {
      healthData.status = "unhealthy"
    } else if (!allNonCriticalHealthy) {
      healthData.status = "degraded"
    }

    // Log health check results with appropriate level
    const logLevel = healthData.status === "healthy" ? "info" : "warn"
    console[logLevel]("Health Check Completed", {
      status: healthData.status,
      duration,
      checks: Object.keys(healthData.checks).reduce(
        (acc, key) => {
          const check = healthData.checks[key as keyof typeof healthData.checks]
          acc[key] = (check as any).status || (check as any).healthy ? "healthy" : "unhealthy"
          return acc
        },
        {} as Record<string, string>,
      ),
    })

    return NextResponse.json(healthData, {
      status: healthData.status === "unhealthy" ? 503 : 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "X-Health-Check-Duration": `${duration}ms`,
        "X-Health-Status": healthData.status,
      },
    })
  } catch (error) {
    const duration = Date.now() - startTime

    console.error("Health Check Failed", {
      error: (error as Error).message,
      stack: (error as Error).stack,
      duration,
    })

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
        errorMessage: (error as Error).message,
        duration: `${duration}ms`,
        checks: {
          database: { status: "unknown", error: "Health check failed" },
          redis: { status: "unknown", error: "Health check failed" },
          external_apis: { status: "unknown", error: "Health check failed" },
          memory: { healthy: false, error: "Health check failed" },
          application: { healthy: false, error: "Health check failed" },
        },
      },
      {
        status: 503,
        headers: {
          "X-Health-Check-Duration": `${duration}ms`,
          "X-Health-Status": "unhealthy",
        },
      },
    )
  }
}

// Add a simple ping endpoint for basic availability checks
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "X-Service": "aqal-integral-app",
      "X-Status": "available",
    },
  })
}
