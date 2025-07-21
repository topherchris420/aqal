// Custom log levels
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
  },
}

// Add colors to winston
import winston from "winston"
winston.addColors(customLevels.colors)

// Determine log level based on environment with intelligent defaults
const getLogLevel = (): string => {
  if (process.env.NODE_ENV === "production") return "info"
  if (process.env.NODE_ENV === "test") return "error"
  return "debug" // development default
}

// Custom format for structured logging
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
      environment: process.env.NODE_ENV || "development",
      service: "aqal-integral-app",
    })
  }),
)

// Create logger instance with intelligent defaults
export const logger = winston.createLogger({
  level: getLogLevel(),
  levels: customLevels.levels,
  format: logFormat,
  defaultMeta: {
    service: "aqal-integral-app",
    version: process.env.npm_package_version || "1.0.0",
  },
  transports: [
    // Console transport - always enabled for development visibility
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize({ all: true }), winston.format.simple()),
      silent: process.env.NODE_ENV === "test", // Silence in tests
    }),

    // File transports - only in production or when explicitly enabled
    ...(process.env.NODE_ENV === "production" || process.env.ENABLE_FILE_LOGGING === "true"
      ? [
          new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
          new winston.transports.File({
            filename: "logs/combined.log",
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
        ]
      : []),
  ],

  // Handle uncaught exceptions only in production
  ...(process.env.NODE_ENV === "production"
    ? {
        exceptionHandlers: [new winston.transports.File({ filename: "logs/exceptions.log" })],
        rejectionHandlers: [new winston.transports.File({ filename: "logs/rejections.log" })],
      }
    : {}),
})

// Structured logging helpers
export const loggers = {
  auth: logger.child({ module: "auth" }),
  api: logger.child({ module: "api" }),
  database: logger.child({ module: "database" }),
  cache: logger.child({ module: "cache" }),
  security: logger.child({ module: "security" }),
  performance: logger.child({ module: "performance" }),
}

// Request logging middleware with performance tracking
export const requestLogger = (req: any, res: any, next: any) => {
  const startTime = Date.now()

  res.on("finish", () => {
    const duration = Date.now() - startTime
    const logLevel = res.statusCode >= 400 ? "warn" : "info"

    loggers.api[logLevel]("HTTP Request", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get("User-Agent"),
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.id,
      // Performance classification
      performanceCategory: duration < 100 ? "fast" : duration < 500 ? "normal" : "slow",
    })

    // Track slow requests for optimization
    if (duration > 1000) {
      loggers.performance.warn("Slow Request Detected", {
        method: req.method,
        url: req.url,
        duration,
        threshold: 1000,
      })
    }
  })

  next()
}

// Error logging helper with context enrichment
export const logError = (error: Error, context?: Record<string, any>) => {
  logger.error("Application Error", {
    message: error.message,
    stack: error.stack,
    name: error.name,
    ...context,
    errorId: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  })
}

// Performance logging helper with thresholds
export const logPerformance = (operation: string, duration: number, metadata?: Record<string, any>) => {
  const logLevel = duration > 1000 ? "warn" : duration > 500 ? "info" : "debug"

  loggers.performance[logLevel]("Performance Metric", {
    operation,
    duration,
    performanceCategory:
      duration < 100 ? "excellent" : duration < 500 ? "good" : duration < 1000 ? "acceptable" : "poor",
    ...metadata,
  })
}

// Business event logging
export const logBusinessEvent = (event: string, data?: Record<string, any>) => {
  logger.info("Business Event", {
    event,
    ...data,
    eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  })
}

// Security event logging
export const logSecurityEvent = (
  event: string,
  severity: "low" | "medium" | "high" | "critical",
  data?: Record<string, any>,
) => {
  const logLevel = severity === "critical" ? "error" : severity === "high" ? "warn" : "info"

  loggers.security[logLevel]("Security Event", {
    event,
    severity,
    ...data,
    securityEventId: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  })
}
